class Cargo{
    constructor (gameScreen, width, height, top, left, weight){
        //Randomly select the Cargo
        const orgCargo = "images/containers/orange-cont-r.png";
        const yelCargo = "images/containers/yellow-cont-r.png";
        const allCargo  = [orgCargo, yelCargo]
        const cargoIdx  = Math.floor(Math.random() * allCargo.length);

        //Randomly select the Cargo Speed
        const speedY    = [0.1, 0.5, 0.8, 1, 1.3, 1.8, 2]
        const speedIdx  = Math.floor(Math.random() * speedY.length);
        
        //Randomly select the Cargo start Location
        const leftLoc   = [85, 170, 195, 250, 280, 325, 375, 400, 430];
        const leftIdx   = Math.floor(Math.random() * leftLoc.length);

        //Randomly select the Cargo sway speed
        const topLoc    = [-0.4, 0.5, 0, 0.3, 0.7, -0.6, -0.7];
        const topIdx    = Math.floor(Math.random() * topLoc.length);

        this.gameScreen = gameScreen;
        //Create Cargo on Dead Pirate location or randomly bring it on Sea
        this.left       = (left ? left : leftLoc[leftIdx]);
        this.top        = (top ? top : -height);
        this.width      = width;
        this.height     = height;
        this.directionX = topLoc[topIdx];
        this.directionY = speedY[speedIdx];
        
        //Create a Cargo Element with weight info text on it
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
        this.element.classList.add('cargo-pick');

        const wgt = (weight ? weight :  speedIdx * 10);
                    
        this.element.setAttribute('weight', wgt);

        this.weightElement             = document.createElement("span");
        this.weightElement.textContent = wgt;
        this.weightElement.classList.add('cargo-weight');
        
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
        //Update the cargo position on the screen
        this.element.style.left     = `${this.left}px`;
        this.element.style.top      = `${this.top}px`;
    }
}