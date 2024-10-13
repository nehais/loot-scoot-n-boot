class Player{
    constructor (gameScreen, left, top, width, height, imgSrc, gameHeight, gameWidth){
        this.gameScreen = gameScreen;
        this.gameEnded  = false;
        this.docking    = false;
        this.left       = left;
        this.top        = top;
        this.width      = width;
        this.height     = height;
        this.gameHeight = gameHeight;
        this.gameWidth  = gameWidth;
        this.directionX = 0;
        this.directionY = 0;
        this.reduceY    = 0;
        this.element    = document.createElement("img");

        this.element.style.zIndex   = 500;
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
        this.element.style.width    = `${this.width}px`;
        this.element.style.height   = `${this.height}px`;
        this.element.src            = imgSrc; 
        this.element.style.position = "absolute";
        this.element.classList.add('ship-rotate');
        
        this.gameScreen.appendChild(this.element);
    }

    move(){        
        //Move the player ship position values within the screen 
        if ((this.directionY !== 0) && (this.directionY !== -1)){
            this.directionY -= this.reduceY;
        }
        
        let newLeft = this.left + this.directionX;
        let newTop  = this.top  + this.directionY;

        if ((newLeft <= (this.gameWidth - this.width)) && (newLeft >= 0)){
            this.left = newLeft;
        }
        if (((newTop <= this.gameHeight) && (newTop >= 0)) && !this.gameEnded){
            this.top = newTop;
        }
        if (this.gameEnded && !this.docking){
            this.directionY = -4;

            if (this.top <= -this.height){ 
                this.docking                = true;
                this.rotatePlayer(0);
                this.element.src            = '../images/ship.png'
                this.directionY             = -1;    
                this.left                   = 130;
                this.top                    = this.gameHeight;
                this.element.style.top      = `${this.gameHeight + (this.height * 1.8)}px`;
                this.element.style.width    = `${this.width * 1.5}px`;
                this.element.style.height   = `${this.height * 1.8}px`;
            }  
            this.top  += this.directionY;
        }
        if (this.docking){    
            this.left                       = 130;
            let newTop  = this.top  + this.directionY;    
            if (((newTop >= 295))){
                this.top = newTop;
            }
        }

        this.updatePosition();
    }

    updatePosition(){
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }

    didCollide(obstacle){
        const playerRect    = this.element.getBoundingClientRect();
        const obstacleRect  = obstacle.element.getBoundingClientRect();

        //Check if there is collision
        if (
            playerRect.left < (obstacleRect.right) &&
            playerRect.right > (obstacleRect.left) &&
            playerRect.top < (obstacleRect.bottom-15) &&
            playerRect.bottom > (obstacleRect.top-15)
          ) {
            return true;
        } else {
            return false;
        }
    }

    rotatePlayer(angle) {
        this.element.style.transform = `rotate(${angle}deg)`;
    }
}