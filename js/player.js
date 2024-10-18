class Player{
    constructor (gameScreen, left, top, width, height, imgSrc, gameHeight, gameWidth){
        this.gameScreen = gameScreen;
        this.gameTargetD= false;
        this.docking    = false;
        this.docked     = false;
        this.stuck      = false;
        this.left       = left;
        this.top        = top;
        this.width      = width;
        this.height     = height;
        this.gameHeight = gameHeight;
        this.gameWidth  = gameWidth;
        this.directionX = 0;
        this.directionY = 0;
        this.reduceY    = 0;

        this.element                        = document.createElement("div");
        this.element.style.backgroundImage  = `url('${imgSrc}')`; 
        this.element.style.backgroundRepeat = "no-repeat"; 
        this.element.style.backgroundSize   = "cover";
        this.element.style.position         = "absolute";
        this.element.style.zIndex           = 500;
        this.element.style.left             = `${this.left}px`;
        this.element.style.top              = `${this.top}px`;
        this.element.style.width            = `${this.width}px`;
        this.element.style.height           = `${this.height}px`;
        this.element.classList.add('ship-rotate');
        
        this.elementCargo                   = document.createElement("div");
        this.elementCargo.id                = 'cargos'; 
        this.elementCargo.style.backgroundImage  = `url('images/cargos.png')`; 
        this.elementCargo.style.position    = "absolute"; 
        this.elementCargo.style.backgroundRepeat = "no-repeat"; 
        this.elementCargo.style.backgroundSize   = "contain";
        this.elementCargo.style.zIndex      = 600;
        this.elementCargo.style.width       = `${0}%`;
        this.elementCargo.style.height      = `${0}%` //`${this.height * 0.40}px`;
        this.elementCargo.style.left        = `${5}px`;
        this.elementCargo.style.top         = `${this.height * 0.25}px`;

        this.element.appendChild(this.elementCargo);       
        this.gameScreen.appendChild(this.element);
    }

    move(){        
        if (this.stuck){
            return; //Stuck on the island for 5sec
        }

        //Reduce the player speed once 1/2 target achieved 
        if ((this.directionY !== 0) && (this.directionY !== -1)){
            this.directionY -= this.reduceY;
        }
        
        let newLeft = this.left + this.directionX;
        let newTop  = this.top  + this.directionY;

        //Check Player should not move out of the left/right screen
        if ((newLeft <= (this.gameWidth - this.width)) && (newLeft >= 0)){
            this.left = newLeft;
        }
        //Check Player should not move out of the top/bottom screen 
        //OR just move when docking. Port collision will stop the move.
        if ((((newTop <= this.gameHeight - 50) && (newTop >= 0)) && !this.gameTargetD) || 
            (this.docking)){
            this.top = newTop;
        }

        if (this.gameTargetD && !this.docking){
            //Game target achieved but the Ship docking has not started
            
            //Increase the speed of the ship to go off the screen
            this.directionY = -10;                                   
            this.rotatePlayer(0);
                
            if (this.top <= -this.height){
                //Ship is off screen
                //Increase Ship size & position it down to bring it up for Docking 
                this.docking                = true;
                let scaleDockingShip        = 1.35;
                if(this.gameWidth < 450){
                    scaleDockingShip = 0.95;
                }
                
                this.element.style.backgroundImage  = `url('images/ship.png' )`; //Use no running Ship image
                this.element.style.backgroundImage
                this.elementCargo.remove();
                this.directionY             = -1;                       //Slow down to dock
                this.left                   = this.gameWidth * 0.11;    //Locking yard position
                this.top                    = this.gameHeight;
                this.element.style.top      = `${this.gameHeight + (this.height * 1.8)}px`;
                this.element.style.width    = `${this.width * scaleDockingShip}px`;
                this.element.style.height   = `${this.height * scaleDockingShip}px`;
            }  
            this.top  += this.directionY;
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
        let collisionClearance= 15
        if (this.docking){
            collisionClearance = this.gameHeight * 0.10;
        }
        //Check if there is collision with the obstacle
        if (
            playerRect.left < (obstacleRect.right) &&
            playerRect.right > (obstacleRect.left) &&
            playerRect.top < (obstacleRect.bottom-collisionClearance) &&
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