var shapes = [];
var numOfShapes = 20;
var detector;
var lookup;
var tableScale = 1;
var springs = [];
var dampSlider;
var kSlider;
var numOfSprings = 0;
var gravity;
var timeStep = 1;
var clothWidth = 15;
var collision = true;
var springConnect = false;

function setup() {
  createCanvas(1200, 800);
  
  //initialising new shape objects
  for (var i = 0; i < numOfShapes; i++) {
    shapes.push(new Rectangle(random(200, width - 200), random(height / 2 - 100, height / 2 + 100), 25, 25, random(0, TWO_PI)));
  }  

  detector = new CollisionDetector();
  lookup = new Table(tableScale);
  gravity = createVector(0, 0.1 * 1 / timeStep);

  if(springConnect) initSprings();
}
function initSprings(){
  //initialising vertical springs connections
  for(var y = 0; y < shapes.length / clothWidth - 1; y++){
    for(var x = 0; x < clothWidth; x++){
      springs.push(new Spring(shapes[x + (y * clothWidth)], shapes[x + ((y + 1)  * clothWidth)], 0.1, 20));
    }
  }
  //initialising horizontal springs connections
  for(var i = 0; i < shapes.length - 1; i++){
    if((i + 1) % clothWidth == 0) continue; //if the end of the row has been reached
    springs.push(new Spring(shapes[i], shapes[i + 1], 0.1, 40));
  }
}
function mousePressed() {
  for(var i = 0; i < shapes.length; i++){
    var testVec = createVector((mouseX - shapes[i].x1), (mouseY - shapes[i].y1));
    //testVec.normalize();
    testVec.mult(0.01);
    if(!shapes[i].locked) shapes[i].addForce(testVec);
  }
}
function draw() {
background(250);
  
// shapes[clothWidth - 1].x1 = width - 50;
// shapes[clothWidth - 1].y1 = 50;

// if(mouseIsPressed){
//   shapes[0].x1 = mouseX;
//   shapes[0].y1 = mouseY;
// }

/*loops through shapes, finds nearby candidates using Table object, calls evaluate function - which detects collisions,
  resolves them, and applies an opposing force*/
for(var u = 0; u < timeStep; u++){
  for (var x = 0; x < shapes.length; x++) {
    var index = (shapes[x].tableIndex.x + shapes[x].tableIndex.y * lookup.cols) % lookup.table.length;
    for (var i = 0; i < lookup.table[index].length; i++) {
      if (collision && detector.evaluate(shapes[x], lookup.table[index][i])) {
        shapes[x].colliding = true;
        lookup.table[index][i].colliding = true;
      }
    }
  }
  var updateVector = createVector(0, 0);
  for (var p = 0; p < shapes.length; p++) {
    shapes[p].addForce(updateVector);
    //shapes[p].addGrav(gravity);
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
}
for(var i = 0; i < springs.length; i++)
  springs[i].show();

}

