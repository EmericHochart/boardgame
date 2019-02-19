class Astarpathfinding {
    constructor (map,start,end) {
        this.start;
        this.end;
        this.cols = map.maxColumn;
        this.rows = map.maxLine;
        this.grid = new Array(this.rows);
        this.openList = new Array();
        this.closedList = [];
        this.path = new Array();
        this.noSolution = false;
        this.setup(map,start,end);
    }

    removeFromArray(arr,elt){
        for (let i = arr.length - 1 ; i >= 0; i--){
            if (arr[i] == elt) {
                arr.splice(i,1);
            };        
        };
    }
    
    heuristic(a,b){
        let h = Math.abs(a.row-b.row)+Math.abs(a.col-b.col);
        return h;
    }

    setup(map,start,end) {
        
        // 2D Array
        for (let i = 0 ; i < this.rows ; i++) {
            this.grid[i] = new Array(this.cols);
        };
    
        // Set Node
        for (let i = 0 ; i < this.rows ; i++){
            for (let j = 0; j < this.cols ; j++) {
                this.grid[i][j] = new Node(i,j);                               
                map.board[i][j].ground==0?this.grid[i][j].obstacle=false:this.grid[i][j].obstacle=true;                
            }
        };
    
        for (let i = 0 ; i < this.rows ; i++){
            for (let j = 0; j < this.cols ; j++) {            
                this.grid[i][j].addNeighbors(this);
            }
        };
    
        // Here setup start & end        
        this.start = this.grid[start.line][start.column];
        this.end = this.grid[end.line][end.column];
    
        // Push start into the openList
        this.openList.push(this.start);
    }

    app(){
    
        // the openList is not empty
        while (this.openList.length>0) {

            let lowestIndex = 0;

            // we run the openList
            for (let i = 0; i < this.openList.length; i++){

                // if f is smaller, replace the lowestIndex
                if(this.openList[i].f<this.openList[lowestIndex].f){
                    lowestIndex = i;
                };
            };

            // The current node becomes the node with the smallest f
            let current = this.openList[lowestIndex];

            // We check that the current node is not the arrival node
            if (current === this.end){
                console.log("chemin possible");
                return this.noSolution;                
            };
            
            // else
            // Remove the current node from the openList and put the current node in the closedList
            this.removeFromArray(this.openList, current);
            this.closedList.push(current);

            // We define an array with the neighbors of the current node
            let neighbors = current.neighbors;
            
            // For each neighbor of the current node
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];

                // If the neighbor is not in the closedList and is not an obstacle
                if (!this.closedList.includes(neighbor) && !neighbor.obstacle){
                    // We initialize a temp g with current g
                    let tempG = current.g + 1;
                    // Either the neighbor is in the openList
                    if (this.openList.includes(neighbor)){
                        // If the temp g is smaller than the neighbor's g then we update the neighbor's g
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;                
                        };
                    } // Either the neighbor is not in the openList
                    else {
                        // We initialize the neighbor's g
                        neighbor.g = tempG;
                        // and we put the neighbor in the openList
                        this.openList.push(neighbor);
                    };
                    // We then initialize the neighbor's h and f
                    neighbor.h = this.heuristic(neighbor,this.end);
                    neighbor.f = neighbor.g + neighbor.h;
                    // And we indicate that the neighbor node of the neighbor is the current node
                    neighbor.previous = current;

                };
            };

        } 
        // Otherwise the openList is empty
        // no solution
        this.noSolution = true;
        console.log("Chemin impossible");
        return this.noSolution;
    }   
    
}