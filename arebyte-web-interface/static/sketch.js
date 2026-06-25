const canvasWidth = 576; // 1: 1.4
const canvasHeight = 800
var addVertex = false;
var eraseShape = false;
var oppCoords = []

function setup() {
  // Create the drawing canvas
  var canvas = createCanvas(canvasWidth, canvasHeight, SVG);
  canvas.parent("main");
  canvas.id("drawing");
  disableScrollOnCanvas(canvas);

  // Create the completion button
  let designButton = createButton('Confirm Design!');
  designButton.parent("main");
  designButton.position(0, 0, "relative");
  designButton.mousePressed(exportSVG);
  designButton.size(150, 50);

  // Create the clear button
  let clearButton = createButton("Clear drawing");
  clearButton.parent("main");
  clearButton.position(0, 0, "relative");
  clearButton.mousePressed(clearDesign);
  clearButton.size(150, 50);

  // Add a border to the canvas
  canvas.elt.style.border = '5px solid black'

  // Adjust stroke
  strokeJoin(BEVEL);

  // Separate the two canvases
  line(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight - 10);

  // Set width of the lines
  strokeWeight(4);

  // Set color mode to hue-saturation-brightness (HSB)
  colorMode(HSB);

  // Set timer for the drawer
  var vertexTimer = setInterval(function(){
    addVertex = !addVertex
  }, 1000);
}

function windowResized(event) {
  resizeCanvas(canvasWidth, canvasHeight);
}

// function mouseDragged() {
//   // Set the color based on the mouse position, and draw a line
//   // from the previous position to the current position
//   if (mouseX > 0 && mouseY > 0) {
//     beginShape()
//     stroke(color("black"), 90, 90);
//     line(pmouseX, pmouseY, mouseX, mouseY);
//   }
// }

function mousePressed() {
  // Start the shape when the user clicks
  if (mouseX < canvasWidth / 2)
  {
    oppCoords = [];
    beginShape(TESS);
  };
}

function mouseDragged() {
  // Add a vertex to the shape as the mouse drags
  if (mouseX < canvasWidth / 2) //&& addVertex)
  {
    vertex(mouseX, mouseY);
    oppCoords.push([canvasWidth - mouseX, mouseY]);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function mouseReleased() {
  // End the shape when the mouse is released
  if (mouseX < canvasWidth / 2)
  {
    oppCoords.reverse();
    console.log(oppCoords);
    for (var i = 0; i < oppCoords.length; i++) 
    {
      vertex(oppCoords[i][0], oppCoords[i][1]);
    }
    endShape(CLOSE);
    //console.log("Drawing...");
    //copy(canvas, 0, 0, canvasWidth/2, canvasHeight, -canvasWidth, 0, canvasWidth/2, canvasHeight);
  }
}

function touchStarted() {
  if (mouseX < canvasWidth / 2)
  {
    beginShape(TESS)
  };
}

function touchMoved() {
  if (mouseX < canvasWidth / 2)
  {
    vertex(mouseX, mouseY);
  }
}

function touchEnded() {
  if (mouseX < canvasWidth / 2)
  {
    endShape(CLOSE);
    //copy(canvas, 0, 0, width/2, heigh, -width, 0, width/2, height);
  }
}

function exportSVG() {
  var svgFile = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg")[0]

  var svgString = new XMLSerializer().serializeToString(svgFile);

  fetch('/upload_bug', {
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
  line(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight - 10);
}

function disableScrollOnCanvas(canvas) {
	canvas.elt.addEventListener("touchstart", (e) => {
		userStartAudio(); // Safe to include even if you don’t use sound
		e.preventDefault();
	}, { passive: false });

	canvas.elt.addEventListener("touchmove", (e) => {
		e.preventDefault();
	}, { passive: false });
}
