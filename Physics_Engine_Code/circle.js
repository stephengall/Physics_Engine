class Circle{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
        this.red = random(0, 255);
        this.green = random(0, 255);
        this.blue = random(0, 255);

        this.vel = createVector();
        this.acc = createVector();
    }
    show(){
        noStroke();
        fill(this.red, this.green, this.blue, 100);
        circle(this.x, this.y, this.r * 2);
    }
    addForce(force){
        this.acc.add(force);
        this.vel.add(this.acc);
        this.vel.limit(10);
        this.x += this.vel.x;
        this.y += this.vel.y;
    }
    evaluate(){
        
    }
}