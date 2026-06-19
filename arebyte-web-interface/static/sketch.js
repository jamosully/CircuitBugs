function setup() {
  // Create the canvas
  var canvas = createCanvas(300, 600, P2D);
  canvas.parent("main");

  // Create the completion button
  let button = createButton('Testing');
  button.parent("main");
  button.position(-150, 50, "relative");

  // Create the clear button

  // Set background to black
  background(0);

  // Set width of the lines
  strokeWeight(10);

  // Set color mode to hue-saturation-brightness (HSB)
  colorMode(HSB);

  // Set screen reader accessible description
  describe('A blank canvas where the user draws by dragging the mouse');

  // Data callback function
  var handleDataCallback = null;
}

function mouseDragged() {
  // Set the color based on the mouse position, and draw a line
  // from the previous position to the current position
  if (mouseX > 0 && mouseY > 0)
    { 
      let lineHue = mouseX - mouseY;
      stroke(lineHue, 90, 90);
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
}
