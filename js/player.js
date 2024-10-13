class Player{
    constructor (gameScreen, left, top, width, height, imgSrc, gameHeight, gameWidth){
        this.gameScreen = gameScreen;
        this.gameTargetD= false;
        this.docking    = false;
        this.docked     = false;
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

        //Check Player should not move out of the screen
        if ((newLeft <= (this.gameWidth - this.width)) && (newLeft >= 0)){
            this.left = newLeft;
        }
        if (((newTop <= this.gameHeight) && (newTop >= 0)) && !this.gameTargetD){
            this.top = newTop;
        }

        if (this.gameTargetD && !this.docking){
            //Game target achieved but the Ship docking has not started
            
            //Increase the speed of the ship to go off the screen
            this.directionY = -4;                                   
            this.rotatePlayer(0);
                
            if (this.top <= -this.height){
                //Ship is off screen
                //Increase Ship size & position it down to bring it up for Docking 
                this.docking                = true;
                this.element.src            = '../images/ship.png'  //Use no running Ship image
                this.directionY             = -1;                   //Slow down to dock
                this.left                   = 130;                  //Locking yard position
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
                this.top = newTop;                                  //Move up to docking position
            }
            else{
                this.docked = true;                                 //Ship docked
            }
        }

        this.updatePosition();
    }

    updatePosition(){
        //Update the Player position on the screen
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }

    didCollide(obstacle){
        const playerRect    = this.element.getBoundingClientRect();
        const obstacleRect  = obstacle.element.getBoundingClientRect();

        //Check if there is collision with the obstacle
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
        //Steer the Player by rotating if Left or Right arrow was pressed
        this.element.style.transform = `rotate(${angle}deg)`;
    }
}