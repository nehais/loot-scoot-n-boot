class Game {
    // code to be added
    constructor (){
        this.startScreen        = document.querySelector('#game-intro');
        this.gameScreen         = document.querySelector('#game-screen');
        this.gameContainer      = document.querySelector('#game-container');
        this.gameEndScreen      = document.querySelector('#game-end');
        this.missilesElement    = document.querySelector('#missiles');
        this.scoreElement       = document.querySelector('#score');
        this.height             = 650;  //Play area height
        this.width              = 600;  //Play area width
        this.pirates            = [];
        this.cargos             = [];
        this.missiles           = 3;
        this.score              = 0;
        this.gameIsOver         = false;
        this.gameIntervalId     = null;
        this.gameTimerId        = null;
        this.gameLoopFrecuency  = Math.round(1000/60);
        
        this.gameScreen.style.position = "relative";
        
        let imgSrc  = '../images/ship-trail.png';
        this.player = new Player(this.gameScreen, 250, 550, 50, 200, imgSrc, this.height, this.width);    
        
        this.horn   = new Audio('../sounds/horn.wav');
        this.money  = new Audio('../sounds/money.wav');
    }

    start (){
        this.gameScreen.style.height    = `${this.height}px`;
        this.gameScreen.style.width     = `${this.width}px`;
        this.startScreen.style.display  = "none";
        this.gameContainer.style.display= "flex";
        this.gameScreen.style.display   = "flex";

        this.gameIntervalId             = setInterval(()=>{
            this.gameLoop();
        }, this.gameLoopFrecuency);

        this.cargoIntervalId             = setInterval(()=>{
            const newCargo  = new Cargo(this.gameScreen, 60, 35);
            this.cargos.push(newCargo);
        }, 5000);

        this.gameTimerId                = setTimeout(()=>{
            this.gameIsOver = true;
            this.gameEndScreen.style.display= "flex";
            this.gameContainer.style.display= "none";
            this.gameScreen.style.display   = "none";
            clearTimeout(this.gameTimerId);
        }, 60000);
    }

    gameLoop (){
        this.update();
        
        if (this.gameIsOver) {
            clearInterval(this.gameIntervalId);
        }
    }

    update (){
        this.player.move();

        this.cargos.forEach((cargo, index) => {
            cargo.move();

            const cargoCollected = this.player.didCollide(cargo);
            if (cargoCollected){
                this.money.play();              //Play money sound for Cargo pickup
                //Get the weight
                const weight = cargo.element.querySelector('.cargo-weight'); 
                this.score   += Number(weight.textContent);
                this.scoreElement.textContent = this.score;
                
                cargo.element.remove();         //Remove the cargo from the screen
                this.cargos.splice(index, 1);   //Remove the cargo from JS array
            }
            else if (cargo.top > this.height){
                cargo.element.remove();         //Remove the cargo from the screen
                this.cargos.splice(index, 1);   //Remove the cargo from JS array
            }
        })

        this.pirates.forEach((pirate, index) => {
            pirate.move();

            const pirateCollided = this.player.didCollide(pirate);
            if (pirateCollided){
                //Get the weight
                //const weight = cargo.element.querySelector('.cargo-weight'); 
                //this.score   += Number(weight.textContent);
                //this.scoreElement.textContent = this.score;
                
                pirate.element.remove();         //Remove the cargo from the screen
                this.pirates.splice(index, 1);   //Remove the cargo from JS array
            }
            else if (pirate.top > this.height){
                pirate.element.remove();         //Remove the cargo from the screen
                this.pirates.splice(index, 1);   //Remove the cargo from JS array
            }
        })
        
        // Create a new Pirate based on a random probability
        // when there is no other Pirate on the screen
        if (Math.random() > 0.98 && this.pirates.length < 1) {
            let imgSrc  = '../images/pirate-ship.png';
            const newPirate = new Pirate(this.gameScreen, 80, 150, imgSrc);  
            this.pirates.push(newPirate);
        }
    }
}