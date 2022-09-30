class CollisionDetector {
    constructor() {
        this.rec1;
        this.rec2;
        this.perpVectors = [];
        this.minDepth;
        this.minDir;
    }
    updatePerpVector() {

        this.perpVectors = [];

        for (var i = 0; i < 2; i++) {
            var tempVec1 = createVector(this.rec1.vertices[1 + i].x - this.rec1.vertices[i].x, this.rec1.vertices[1 + i].y - this.rec1.vertices[i].y);
            this.perpVectors.push(tempVec1);
        }
        for (var i = 0; i < 2; i++) {
            var tempVec1 = createVector(this.rec2.vertices[1 + i].x - this.rec2.vertices[i].x, this.rec2.vertices[1 + i].y - this.rec2.vertices[i].y);
            this.perpVectors.push(tempVec1);
        }
    }
    evaluate(rec1, rec2) {
        //for every vertex in rec1 and rec2, evaluate their dot product relative every vector perpendicular to the edges

        this.rec1 = rec1;
        this.rec2 = rec2;

        this.updatePerpVector();        

        var rec1Vals = [];
        var rec2Vals = [];
        this.minDepth = Number.MAX_VALUE;
        this.minDir = createVector();

        for (var i = 0; i < 4; i++) {
            rec1Vals = [];
            rec2Vals = [];

            for (var j = 0; j < 4; j++) {
                rec1Vals.push(this.perpVectors[i].dot(this.rec1.vertices[j]));
            }
            for (var j = 0; j < 4; j++) {
                rec2Vals.push(this.perpVectors[i].dot(this.rec2.vertices[j]));
            }
            var rec1Min = min(rec1Vals);
            var rec2Min = min(rec2Vals);

            var rec1Max = max(rec1Vals);
            var rec2Max = max(rec2Vals);


            if (!((rec1Min < rec2Max && rec1Min > rec2Min) || (rec2Min < rec1Max && rec2Min > rec1Min)))
                return false;

            if (min(rec2Max - rec1Min, rec1Max - rec2Min) < this.minDepth) {
                this.minDepth = min(rec2Max - rec1Min, rec1Max - rec2Min);
                this.minDir = this.perpVectors[i];
            }
        }
        this.minDepth /= this.minDir.mag();
        this.minDir.normalize();
//creating vector between centres of shapes
        var centres = createVector();
        centres.x = this.rec2.returnCentres().x - this.rec1.returnCentres().x;
        centres.y = this.rec2.returnCentres().y - this.rec1.returnCentres().y;

        if(this.minDir.dot(centres) < 0)
            this.minDir.mult(-1);
        stroke(250, 100);
        strokeWeight(4);
        this.moveAlongVector();
        return true;
    }
    moveAlongVector() {
        if((this.rec2.vel.sub(this.rec1.vel)).dot(this.minDir) > 0 && !(this.rec1.locked || this.rec2.locked))
            return;

        if(this.rec2.locked){
            this.minDir.mult(this.minDepth);
            this.rec1.x1 -= this.minDir.x;
            this.rec1.y1 -= this.minDir.y;
        } 
        else if(this.rec1.locked){
            this.minDir.mult(this.minDepth);
            this.rec2.x1 += this.minDir.x;
            this.rec2.y1 += this.minDir.y;
        }
        else{
            this.minDir.mult(this.minDepth / 2);
            this.rec1.x1 -= this.minDir.x;
            this.rec1.y1 -= this.minDir.y;
            this.rec2.x1 += this.minDir.x;
            this.rec2.y1 += this.minDir.y;
        }


        this.minDir.normalize();
        this.rec1.updateVertices();
        this.rec2.updateVertices();

        var collisionPoints = this.returnNearestPoint(this.rec1, this.rec2);

        for(var i = 0; i < collisionPoints.length; i++){
            stroke(51, 125);
            noFill();
            strokeWeight(4);
            //circle(collisionPoints[i].x, collisionPoints[i].y, 15);
        }

        var relativeVelocity = createVector();
        relativeVelocity = this.rec2.vel.sub(this.rec1.vel);

        var restitution = min(this.rec1.restitution, this.rec2.restitution);
        var j = -(1 + restitution) * (relativeVelocity.dot(this.minDir));
        j /= (1 / this.rec1.mass + 1 / this.rec2.mass);

        if(!this.rec1.locked) this.rec1.vel.sub(this.minDir.mult(j / this.rec1.mass));
        if(!this.rec2.locked) this.rec2.vel.add(this.minDir.mult(j / this.rec2.mass));
    }

    returnNearestPoint(rec1, rec2){
        var result = new Array(p5.Vector);
        var resultMag = Number.MAX_VALUE;

        for(var i = 0; i < rec1.vertices.length; i++){
            var shortestDist = Number.MAX_VALUE;

            var nearestVertex = createVector();
            var nearestDistance = createVector();
            for(var j = 0; j < rec2.vertices.length; j++){
                var e1 = createVector(rec2.vertices[j].x, rec2.vertices[j].y);
                var e2 = createVector(rec2.vertices[(j + 1) % rec2.vertices.length].x, rec2.vertices[(j + 1) % rec2.vertices.length].y);
   
                var currentVertex = createVector(rec1.vertices[i].x, rec1.vertices[i].y);
                var pointContact = createVector();

                var b = createVector(currentVertex.x - e1.x, currentVertex.y - e1.y);
                var e1e2 = createVector(e2.x - e1.x, e2.y - e1.y);

                var dotProduct = e1e2.dot(b);
                var distance = (e2.x - e1.x) * (e2.x - e1.x) + (e2.y - e1.y) * (e2.y - e1.y);

                var ratio = dotProduct / distance;

                if(ratio <=  0)
                    pointContact.set(e1);
                else if(ratio >= 1)
                    pointContact.set(e2);
                else{
                    var newE1e2 = createVector();
                    newE1e2 = e1.add(e1e2.mult(ratio));
                    pointContact.set(newE1e2);
                }
                
                if(dist(pointContact.x, pointContact.y, currentVertex.x, currentVertex.y) < shortestDist){
                    nearestVertex.set(currentVertex);
                    nearestDistance.set(pointContact);
                    shortestDist = dist(pointContact.x, pointContact.y, currentVertex.x, currentVertex.y);
                }
            }
            if(dist(nearestDistance.x, nearestDistance.y, nearestVertex.x, nearestVertex.y) < resultMag){
                result.splice(0, 1);
                result.push(nearestVertex);
                resultMag = dist(nearestDistance.x, nearestDistance.y, nearestVertex.x, nearestVertex.y);
                
            }
        }

        for(var i = 0; i < rec2.vertices.length; i++){
            var shortestDist = Number.MAX_VALUE;

            var nearestVertex = createVector();
            var nearestDistance = createVector();
            for(var j = 0; j < rec1.vertices.length; j++){
                var e1 = createVector(rec1.vertices[j].x, rec1.vertices[j].y);
                var e2 = createVector(rec1.vertices[(j + 1) % rec1.vertices.length].x, rec1.vertices[(j + 1) % rec1.vertices.length].y);
   
                var currentVertex = createVector(rec2.vertices[i].x, rec2.vertices[i].y);
                var pointContact = createVector();

                var b = createVector(currentVertex.x - e1.x, currentVertex.y - e1.y);
                var e1e2 = createVector(e2.x - e1.x, e2.y - e1.y);

                var dotProduct = e1e2.dot(b);
                var distance = (e2.x - e1.x) * (e2.x - e1.x) + (e2.y - e1.y) * (e2.y - e1.y);

                var ratio = dotProduct / distance;

                if(ratio <=  0)
                    pointContact.set(e1);
                else if(ratio >= 1)
                    pointContact.set(e2);
                else{
                    var newE1e2 = createVector();
                    e1e2.mult(ratio)
                    newE1e2 = e1.add(e1e2);
                    pointContact.set(newE1e2);
                }
                
                if(dist(pointContact.x, pointContact.y, currentVertex.x, currentVertex.y) < shortestDist){
                    nearestVertex.set(currentVertex);
                    nearestDistance.set(pointContact);
                    shortestDist = dist(pointContact.x, pointContact.y, currentVertex.x, currentVertex.y);
                }
            }
            if(dist(nearestDistance.x, nearestDistance.y, nearestVertex.x, nearestVertex.y) < resultMag){
                result = [];

                result.push(nearestVertex);
                resultMag = dist(nearestDistance.x, nearestDistance.y, nearestVertex.x, nearestVertex.y);

            }else if(round(dist(nearestDistance.x, nearestDistance.y, nearestVertex.x, nearestVertex.y), 2) == round(resultMag, 2)){
                result.push(nearestVertex);
            }
        }
        return result;
    }
}