var direction_mappings = {
  "n": [0, 1],
  "ne": [1, 1],
  "e": [1, 0],
  "se": [1, -1],
  "s": [0, -1],
  "sw": [-1, -1],
  "w": [-1, 0],
  "nw": [-1, 1]
}
var turning_mappings = {
  "left": {
    "n": "ne",
    "ne": "e",
    "e": "se",
    "se": "s",
    "s": "sw",
    "sw": "w",
    "w": "nw",
    "nw": "n"
  },
  "right": {
    "ne": "n",
    "e": "ne",
    "se": "e",
    "s": "se",
    "sw": "s",
    "w": "sw",
    "nw": "w",
    "n": "nw"
  }
}

// Canvas Parameters
const maxCanvasWidth = 576;
const maxCanvasHeight = 576;
var canvasWidth = maxCanvasWidth;
var canvasHeight = maxCanvasHeight;
var circuitCanvas = null;
var canvasAspectRatio = [0.72, 1]

// Colour parameters
var bg_color_arr = [0, 0, 0];
var bg_color = null;
var line_color_arr = [220, 220, 220]
var line_color = null;
var currentBackground = null;

// Drawing parameters
var draw_speed = 1; // Controls the speed at which the line generate from the click point
var propogation_threashold = 0.1;
var half_turn_rate = 0.8;
// var wall_placements=[0,0,0,0];
var end_size = 10; // Controls the size of the circle at the end of a wire
var frames = 0; // Starting frame value
var death_chance = 3; // Controls how quickly a branch can propagate for WARNING, HIGHER VALUES LAG 
var general_turn_rate = 0.01;

var drawing_nodes = []
var closed_set = []
var line_thickness = 2;
var circle_thickness = 3;
var min_initial_dist = 75;


function setup() {

  // Create canvas
  circuitCanvas = createCanvas(canvasWidth, canvasHeight, SVG);

  // Set colours and stroke strengths
  bg_color = color(bg_color_arr)
  line_color = color(line_color_arr);
  currentBackground = background(bg_color);
  frameRate(60);
  strokeWeight(line_thickness);
  fill(bg_color);

  //noFill();
  stroke(line_color)

  // Create the completion button
  let designButton = createButton('Confirm Design!');
  designButton.parent("buttons");
  designButton.position(0, 0, "relative");
  designButton.mousePressed(exportSVG);
  designButton.size(150, 50);

  // Create the clear button
  let clearButton = createButton("Clear drawing");
  clearButton.parent("buttons");
  clearButton.position(0, 0, "relative");
  clearButton.mousePressed(clearDesign);
  clearButton.size(150, 50);
}

function draw() {
  drawing_nodes.forEach(function(node){
    node.move();
    if(node.min_dist>0){//block propigation if fixed length defined
      node.min_dist-=draw_speed;
      node.draw();
    }
    else{
      node.check_terminate();
      node.turn_random()
      node.draw();
      node.propigate();
    }
  })
   closed_set.forEach(function(node){
     node.make_circle_bigger();
   });
  frames++;
 // console.log(drawing_nodes[0]);
  
}

function exportSVG() {

  // Delete the background before getting the drawing
  currentBackground = '';

  var svgFile = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg")[0]

  var svgString = new XMLSerializer().serializeToString(svgFile);

  fetch('/upload_svg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ svg_data: svgString })
  })
    .then(response => response.json())
    .then(data => console.log(data));
}

function clearDesign() {
  clear();
  currentBackground = background(bg_color);
}

function mousePressed() {

  let isOnCanvas = (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height);
  if (isOnCanvas) {
    ["n", "ne", "e", "se", "s", "sw", "w", "nw"].forEach(
      function (direction) {
        //drawing_nodes.push(new drawing_node(mouseX,mouseY,direction))
        drawing_nodes.push(new drawing_node(
          canvasWidth / 2,
          canvasHeight / 2,
          direction
        ))
      });
  }

}

// function gen_nodes(){

//   placements=[
//     {"x":false,"y":true,"direction":"w"},
//     {"x":true,"y":false,"direction":"n"},
//     {"x":false,"y":true,"direction":"e"},
//     {"x":true,"y":false,"direction":"s"}
//   ];

//   for(i=0;i<4;i++){
//     for(k=0;k<wall_placements[i];k++){
//       if(placements[i]["x"]){
//         x=(width/wall_placements[i])*k;
//       }
//       else{
//         if(placements[i]["direction"]=="w"){
//           x=width
//         }
//         else{
//           x=0
//         }
//       }
//       if(placements[i]["y"]){
//         y=(height/wall_placements[i])*k;
//       }
//       else{
//         if(placements[i]["direction"]=="s"){
//           y=height;
//         }
//         else{
//           y=0
//         }
//       }
//       //console.log(new drawing_node(x,y,placements[i]["direction"]))
//       drawing_nodes.push(new drawing_node(x,y,placements[i]["direction"]))
//     }
//   }
// }

function remove_node(node, add_to_closed_set, source_array) {
  source_array = source_array || drawing_nodes;
  if (add_to_closed_set) {
    closed_set.push(node);
  }
  source_array.splice(source_array.indexOf(node), 1);
}

function drawing_node(x,y,direction,genaration){
  this.x_last=this.x=x;
  this.y_last=this.y=y;
  this.direction=direction;
  this.direction_vector=direction_mappings[direction];

  this.thickness=0;
  this.genaration=genaration || 1;
  if(this.genaration==1){
    this.min_dist=min_initial_dist;
  }
  else{
    this.min_dist=0;
  }
  this.move=function(){
  
    //console.log(this,direction_mappings);
    this.x_last=this.x;
    this.y_last=this.y;
    this.x+=this.direction_vector[0]*draw_speed;
    this.y+=this.direction_vector[1]*draw_speed;
  }
  this.draw=function(){
    line(this.x_last,this.y_last,this.x,this.y)
  }
  this.go_left=function(){
    this.direction=turning_mappings["left"][this.direction]
    this.direction_vector=direction_mappings[this.direction]
  }
  this.go_right=function(){
    this.direction=turning_mappings["right"][this.direction]
    this.direction_vector=direction_mappings[this.direction]
  }
  this.turn_random=function(){
    if(general_turn_rate>random(0,1)){
      split_type=random(0,1);
      if(0.5> random(0,1)){
        this.go_left()
        if(split_type>half_turn_rate){
          this.go_left()
        }
      }
      else{
        this.go_right()
        if(split_type>half_turn_rate){
          this.go_right()
        }
      }
    }
  }
  this.propigate=function(){
    if(propogation_threashold/this.genaration>random(1)){
      split_type=random(0,1);
      n1=new drawing_node(this.x,this.y,this.direction,this.genaration+1);
      n2=new drawing_node(this.x,this.y,this.direction,this.genaration+1);
      n1.go_right();
      n2.go_left()
      if(split_type>half_turn_rate){
        n1.go_right();
        n2.go_left();
      }
      drawing_nodes.push(n1);
      drawing_nodes.push(n2);
      remove_node(this,false);
    }
  }
  this.check_terminate=function(){
      if(this.x<0||this.x>width||this.y<0||this.y>height){
        remove_node(this,false);
        //console.log("ded")
        return true;
      }
      if((propogation_threashold)/death_chance>random(1)){
        this.terminate()
      }  
  }
  this.terminate=function(){
    
    ellipse(this.x,this.y,this.thickness)
    remove_node(this,true);
  }
  this.make_circle_bigger=function(){
    
    ellipse(this.x,this.y,this.thickness++);
    if(this.thickness>=end_size){
      this.terminate_true()
    }
  }
  this.terminate_true=function(){
    remove_node(this,false,closed_set)
  }
}