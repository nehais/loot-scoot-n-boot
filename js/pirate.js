class Pirate{
    constructor (gameScreen, width, height, imgSrc){
        //Randomly select the Pirate ship start Location
        const leftLoc   = [0.25, 0.44, 0.56, 0.33, 0.65, 0, 1];
        const leftIdx   = Math.floor(Math.random() * leftLoc.length);
        
        //Randomly select the Pirate ship Speed
        const speedY    = [3, 3.5, 2.8, 1, 1.3, 1.8, 2, 4];
        const speedIdx  = Math.floor(Math.random() * speedY.length);

        //Randomly select the Pirate return Cargo weight
        const weight    = [100, 95, 125, 250];
        const weightIdx = Math.floor(Math.random() * weight.length);
        
        this.gameScreen = gameScreen;
        //Within the screenwidth randomly position the Pirate
        this.left       = gameScreen.clientWidth * leftLoc[leftIdx];
        this.top        = -height;
        this.width      = width;
        this.height     = height;
        this.directionX = 0;
        this.directionY = speedY[speedIdx];
        this.element    = document.createElement("img");

        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
        this.element.style.width    = `${width}px`;
        this.element.style.height   = `${height}px`;
        this.element.src            = imgSrc; 
        this.element.classList.add('pirate-sway');
        this.element.style.position = "absolute";
        this.element.setAttribute('weight', weight[weightIdx]);
        
        this.gameScreen.appendChild(this.element);
    }

    move(){    
        //Move the Pirate position values     
        this.left     += this.directionX;
        this.top      += this.directionY;
        
        this.updatePosition();
    }

    updatePosition(){
        //Update the Pirate position on the screen
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }

    didCollide(obstacle){
        const pirateRect    = this.element.getBoundingClientRect();
        const obstacleRect  = obstacle.element.getBoundingClientRect();

        //Check if there is collision with the obstacle
        if (
            pirateRect.left < (obstacleRect.right) &&
            pirateRect.right > (obstacleRect.left) &&
            pirateRect.top < (obstacleRect.bottom-15) &&
            pirateRect.bottom > (obstacleRect.top-15)
          ) {
            return true;
        } else {
            return false;
        }
    }
}