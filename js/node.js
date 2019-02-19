class Node {

    constructor(i,j,obstacle=false){
        this.row=i;
        this.col=j;
        this.f=0;
        this.g=0;
        this.h=0; 
        this.neighbors = new Array();
        this.previous = undefined;
        this.obstacle = false;              
    }    

    show(){
        console.log("row : "+this.row+", col : "+this.col+", Obstacle : "+this.obstacle);
    }
        
    addNeighbors(astar){
        let i = this.row;
        let j = this.col;
        if ( i < astar.rows - 1) {
            this.neighbors.push(astar.grid[i+1][j]);
        };
        if ( i > 0){
            this.neighbors.push(astar.grid[i-1][j]);
        };
        if ( j < astar.cols - 1) {
            this.neighbors.push(astar.grid[i][j+1]);
        };
        if ( j > 0) {
            this.neighbors.push(astar.grid[i][j-1]);
        }; 
    }
    
    
    

}