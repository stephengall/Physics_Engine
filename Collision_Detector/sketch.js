var shapes = [];
var numOfShapes = 15;
var detector;
var lookup;
var tableScale = 1;
var springs = [];
var dampSlider;
var kSlider;
var numOfSprings = 0;
var gravity;
var timeStep = 1;

function setup() {
  createCanvas(1200, 800);
  
  for (var i = 0; i < numOfShapes; i++) {
    shapes.push(new Rectangle(random(200, width - 200), random(height / 2 - 100, height / 2 + 100),50, 50, random(0, TWO_PI)));
  }  
  detector = new CollisionDetector();
  lookup = new Table(tableScale);
  gravity = createVector(0, 0.1 * 1 / timeStep);

  for(var i = 0; i < numOfSprings; i++){
    springs.push(new Spring(shapes[i], shapes[i + 1], 0.02, 0));
  }

}
function mousePressed() {
  for(var i = 0; i < shapes.length; i++){
    var testVec = createVector((mouseX - shapes[i].x1), (mouseY - shapes[i].y1));
    testVec.normalize();
    if(!shapes[i].locked) shapes[i].addForce(testVec);
  }
}
function draw() {
  background(250);

/*loops through shapes, finds nearby candidates using Table object, calls evaluate function - which detects collisions,
  resolves them, and applies an opposing force*/

for(var u = 0; u < timeStep; u++){
  for (var x = 0; x < shapes.length; x++) {
    var index = (shapes[x].tableIndex.x + shapes[x].tableIndex.y * lookup.cols) % lookup.table.length;
    for (var i = 0; i < lookup.table[index].length; i++) {
      if (detector.evaluate(shapes[x], lookup.table[index][i])) {
        shapes[x].colliding = true;
        lookup.table[index][i].colliding = true;
      }
    }
  }
  var updateVector = createVector(0, 0);
  for (var p = 0; p < shapes.length; p++) {
    shapes[p].addForce(updateVector);
    // shapes[p].addForce(gravity);
    shapes[p].edges();
  }
  lookup.updateTable(shapes);
  for(var i = 0; i < springs.length; i++){
    springs[i].updatePos();
  }
}

//updating shapes.
for (var p = 0; p < shapes.length; p++){
  shapes[p].colliding = false;
  shapes[p].show();
  if(p < springs.length) springs[p].show();
}
  fill(51);
  noStroke();
  textSize(24);
  text("Number of entities: " + shapes.length, 10, 30);

}

