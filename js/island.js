class Island{
    constructor (gameScreen, width, height){
        //Randomly select the Island image
        const islandTree= "images/islands/island-tree.png";
        const islandVolc= "images/islands/island-volcano.png";
        const allIsland = [islandTree, islandVolc]
        const islandIdx = Math.floor(Math.random() * allIsland.length);
        
        //Randomly select the Island start Location
        const leftLoc   = [0.5, 0.25, 0.75, 0];
        const leftIdx   = Math.floor(Math.random() * leftLoc.length);

        this.gameScreen = gameScreen;
        //Create Island on random location
        this.left       = gameScreen.clientWidth * leftLoc[leftIdx];
        this.top        = -height;
        this.width      = width;
        this.height     = height;
        this.directionX = 0;
        this.directionY = 1;
        
        //Create a Cargo Element with weight info text on it
        this.element    = document.createElement("div");

        this.element.style.backgroundImage = `url('${allIsland[islandIdx]}')`;
        this.element.style.backgroundSize  = 'contain';
        this.element.style.backgroundRepeat= 'no-repeat';
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
        this.element.style.width    = `${width}px`;
        this.element.style.height   = `${height}px`;
        this.element.style.position = "absolute";         
        
        this.gameScreen.appendChild(this.element);
    }

    move(){    
        //Move the island position values       
        this.left += this.directionX;
        this.top  += this.directionY;

        this.updatePosition();
    }

    updatePosition(){
        //Update the island position on the screen
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }
}