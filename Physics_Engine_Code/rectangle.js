class Rectangle{
    constructor(x, y, rWidth, rHeight, angle){
      this.x1 = x;
      this.y1 = y;
      this.rWidth = rWidth;
      this.rHeight = rHeight;
      this.angle = angle;
      this.vertices = [];
      this.colliding = false;
      this.locked = false;
      this.red = random(0, 200);
      this.green = random(0, 200);
      this.blue = random(0, 200);
      this.mass = this.rWidth * this.rHeight / 250;
      this.restitution = 1;
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.tableIndex = createVector();

      this.intertia = 1 / 12 * this.mass * (this.rHeight * this.rHeight + this.rWidth * this.rWidth);
      this.rotVel = 0;
      this.rotAcc = 0;
      
      this.updateVertices();  
    }
    addForce(force){
      if(this.locked) return;
      this.acc.add(force);
      this.vel.add(this.acc);
      this.vel.limit(10);
      var tempVec = createVector(this.vel.x, this.vel.y);
      this.x1 += tempVec.x;
      this.y1 += tempVec.y;
      this.vel.mult(0.99);
      this.acc.mult(0);
      this.updateVertices();
    }
    //will be used in future for terminal velocities
    addGrav(force){
      if(this.locked) return;
      this.acc.add(force);
      this.vel.add(this.acc);
      this.vel.limit(10);
      var tempVec = createVector(this.vel.x, this.vel.y);
      this.x1 += tempVec.x;
      this.y1 += tempVec.y;
      this.acc.mult(0);
      this.updateVertices();
    }
    addRotation(angleChange){
      this.rotAcc += angleChange;
      this.rotVel += this.rotAcc;
      this.angle += this.rotVel;
      this.rotVel *= 0.99;
      this.rotAcc *= 0;
      this.updateVertices();
    }
    show(){
      push()
      fill(this.red, this.green, this.blue, 100);
      stroke(this.red, this.green, this.blue, 100);
      strokeWeight(5);
      translate(this.returnCentres().x, this.returnCentres().y);
      rectMode(CENTER);
      rotate(this.angle, (this.returnCentres().x, this.returnCentres().y));
      rect(0, 0, this.rWidth, this.rHeight);
      pop();
    }
    //allows shapes that exit the canvas to wrap back around to the other side
    edges(){
      if(this.x1 < 0){
        this.x1 = width;
      }
      if(this.x1 > width){
        this.x1 = 0;
      }
      if(this.y1 > height){
        this.y1 = 0;
      }
      if(this.y1 < 0){
        this.y1 = height;
      }
    }
    //updates vertices array based on rectangle's width, rotation and the location of one vertex
    updateVertices(){
      this.vertices = [];
      this.x2 = this.rWidth * cos(this.angle) + this.x1;
      this.y2 = this.rWidth * sin(this.angle) + this.y1;
      this.x3 = this.rHeight * cos(this.angle + PI / 2) + this.x2;
      this.y3 = this.rHeight * sin(this.angle + PI / 2) + this.y2;
      
      this.vertices.push(createVector(this.x1, this.y1));
      this.vertices.push(createVector(this.x2, this.y2));
      this.vertices.push(createVector(this.x3, this.y3));
      this.vertices.push(createVector(this.rHeight * cos(this.angle + PI / 2) + this.x1, this.rHeight * sin(this.angle + PI / 2) + this.y1));
    }
    returnCentres(){
      var x = 0;
      var y = 0;

      for(var i = 0; i < this.vertices.length; i++){
          x += this.vertices[i].x;
          y += this.vertices[i].y;
      }
      var result = createVector(x / this.vertices.length, y / this.vertices.length);
      return result;
    }
  }