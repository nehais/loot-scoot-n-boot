class Cargo{
    constructor (gameScreen, width, height){
        //const orgCargoL = "../images/containers/orange-cont-l.png";
        const orgCargoR = "../images/containers/orange-cont-r.png";
        //const yelCargoL = "../images/containers/yellow-cont-l.png";
        const yelCargoR = "../images/containers/yellow-cont-r.png";
        const allCargo  = [orgCargoR, yelCargoR]
        const cargoIdx  = Math.floor(Math.random() * allCargo.length);

        const speedY    = [0.1, 0.5, 0.8, 1, 1.3, 1.8, 2]
        const speedIdx  = Math.floor(Math.random() * speedY.length);
        
        const leftLoc   = [85, 170, 195, 250, 280, 325, 375, 400, 430];
        const leftIdx   = Math.floor(Math.random() * leftLoc.length);

        this.gameScreen = gameScreen;
        this.left       = leftLoc[leftIdx];
        this.top        = -30;
        this.width      = width;
        this.height     = height;
        this.directionX = 0;
        this.directionY = speedY[speedIdx];
        
        this.element    = document.createElement("div");

        this.element.style.backgroundImage = `url('${allCargo[cargoIdx]}')`;
        this.element.style.backgroundSize  = 'contain';
        this.element.style.backgroundRepeat= 'no-repeat';
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
        this.element.style.width    = `${width}px`;
        this.element.style.height   = `${height}px`;
        this.element.style.position = "absolute";
        this.element.classList.add('cargo-sway');

        this.weightElement             = document.createElement("span");
        this.weightElement.textContent = speedIdx * 10;
        this.weightElement.classList.add('cargo-weight');
        
        //this.divElement.appendChild(this.element);
        this.element.appendChild(this.weightElement);

        this.gameScreen.appendChild(this.element);
    }

    move(){    
        //Move the cargo position values       
        this.left += this.directionX;
        this.top  += this.directionY;

        this.updatePosition();
    }

    updatePosition(){
        //Update the cargo on position on the screen
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }
}