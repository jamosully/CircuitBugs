const canvasWidth = 576;
const canvasHeight = 800

function setup() {
  // Create the drawing canvas
  var canvas = createCanvas(canvasWidth / 2, canvasHeight, SVG);
  canvas.parent("main");
  canvas.id("drawing");
  disableScrollOnCanvas(canvas);

  var mirrorCanvas - createCanvas(canvasWidth / 2, canvasHeight)

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

  // Set width of the lines
  strokeWeight(4);

  // Set color mode to hue-saturation-brightness (HSB)
  colorMode(HSB);
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
  beginShape();
}

function mouseDragged() {
  // Add a vertex to the shape as the mouse drags
  vertex(mouseX, mouseY);
}

function mouseReleased() {
  // End the shape when the mouse is released
  endShape();
}

function touchStarted() {
  beginShape();
}

function touchMoved() {
  vertex(mouseX, mouseY);
}

function touchEnded() {
  endShape();
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
