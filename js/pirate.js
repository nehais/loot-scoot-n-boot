class Pirate{
    constructor (gameScreen, width, height, imgSrc){
        const leftLoc   = [85, 170, 195, 250, 280, 325, 375, 400, 430];
        const leftIdx   = Math.floor(Math.random() * leftLoc.length);
        
        const speedY    = [0.1, 0.5, 0.8, 1, 1.3, 1.8, 2];
        const speedIdx  = Math.floor(Math.random() * speedY.length);
        
        this.gameScreen = gameScreen;
        this.left       = leftLoc[leftIdx];
        this.top        = -200;
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
        this.element.style.position = "absolute";
        
        this.gameScreen.appendChild(this.element);
    }

    move(){
        this.left     += this.directionX;
        this.top      += this.directionY;

        /*if ((this.left > 350) || (this.left < 50)){
            return;
        } else if ((this.top > 495) || (this.left < 0)){
            return;
        }*/
        this.updatePosition();
    }

    updatePosition(){
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }

    didCollide(obstacle){
        if(obstacle){
            return true;
        }

        return false;
    }
}