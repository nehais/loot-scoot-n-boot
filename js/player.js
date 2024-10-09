class Player{
    constructor (gameScreen, left, top, width, height, imgSrc){
        this.gameScreen = gameScreen;
        this.left       = left;
        this.top        = top;
        this.width      = width;
        this.height     = height;
        this.directionX = 0;
        this.directionY = 0;
        this.element    = document.createElement("img");

        this.element.style.left     = `${left}px`;
        this.element.style.top      = `${top}px`;
        this.element.style.width    = `${width}px`;
        this.element.style.height   = `${height}px`;
        this.element.src            = imgSrc; 
        this.element.style.position = "absolute";
        
        this.gameScreen.appendChild(this.element);
    }

    move(){
        this.left     += this.directionX;
        this.top      += this.directionY;

        if ((this.left > 350) || (this.left < 50)){
            return;
        } else if ((this.top > 495) || (this.left < 0)){
            return;
        }
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