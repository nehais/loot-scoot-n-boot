class Missile{
    constructor (gameScreen, width, height, top, left){
        this.gameScreen = gameScreen;
        this.left       = left;
        this.top        = top;
        this.width      = width;
        this.height     = height;
        this.directionX = 0;
        this.directionY = -5;
        
        //Create a Bullet Element
        this.element    = document.createElement("img");

        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
        this.element.style.width    = `${width}px`;
        this.element.style.height   = `${height}px`;        
        this.element.src            = '../images/missile.png'; 
        this.element.style.position = "absolute";
        
        this.gameScreen.appendChild(this.element);
    }

    move(){    
        //Move the missile position values       
        this.left += this.directionX;
        this.top  += this.directionY;

        this.updatePosition();
    }

    updatePosition(){
        //Update the missile position on the screen
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }
}