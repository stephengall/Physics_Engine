class Table{
    constructor(scale){
        this.table = [];
        this.cols = scale;

        for(var i = 0; i < (this.cols * this.cols); i++)
            this.table[i] = [];

    }
    updateTable(shapes){
        //calculates index into table, stores index in rectangle object
        this.clearTable();
        for(var i = 0; i < shapes.length; i++){
            shapes[i].edges();
            shapes[i].tableIndex = createVector(floor(shapes[i].x1 / width * this.cols), floor(shapes[i].y1 / height * this.cols));
            // console.log((shapes[i].tableIndex.x + shapes[i].tableIndex.y * this.cols), this.table.length);
            (this.table[(shapes[i].tableIndex.x + shapes[i].tableIndex.y * this.cols) % this.table.length]).push(shapes[i]);
        }
    }
    clearTable(){
        for(var i = 0; i < (this.cols * this.cols); i++)
            this.table[i] = [];
    }
}