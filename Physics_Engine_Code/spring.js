class Spring{
    constructor(point1, point2, k, restLength){
        this.point1 = point1;
        this.point2 = point2;
        this.k = k;
        this.damping = 1;
        this.restLength = restLength;
        this.point1vel = createVector();
        this.point2vel = createVector();
        this.point1acc = createVector();
        this.point2acc = createVector();

        this.point2External = createVector();
    }
    show(){
        stroke(51, 100);
        strokeWeight(4);
        line(this.point1.returnCentres().x, this.point1.returnCentres().y, this.point2.returnCentres().x, this.point2.returnCentres().y);
    }
    //adds force to rectangles proportional to its distance away from the strings rest position
    updatePos(){
        var direction = createVector(this.point1.x1 - this.point2.x1, this.point1.y1 - this.point2.y1);
        var d = dist(this.point2.x1, this.point2.y1, this.point1.x1, this.point1.y1);
        d -= this.restLength;

        direction.normalize();
        direction.mult(d * this.k * 1 / this.damping);
        this.point2.addForce(direction);
        direction.mult(-1);
        this.point1.addForce(direction);
    }
}