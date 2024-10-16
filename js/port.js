class Port{
    constructor (gameScreen, width, height){
        this.gameScreen = gameScreen;
        this.width      = width;
        this.height     = height;
        this.top        = -height;
        this.left       = 0;
        this.directionX = 0;
        this.directionY = 1;
        
        //Create a Port Element
        this.element    = document.createElement("img");

        this.element.style.zIndex   = 650;
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
        this.element.style.width    = `${width}px`;
        this.element.style.height   = `${height}px`;        
        this.element.src            = 'images/port.png'; 
        this.element.style.position = "absolute";
        
        this.gameScreen.appendChild(this.element);
    }

    move(){    
        //Move the port position values       
        let newTop  = this.top  + this.directionY;

        if (newTop <= 0){
            this.top = newTop;
        }

        this.updatePosition();
    }

    updatePosition(){
        //Update the port position on the screen
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }
}