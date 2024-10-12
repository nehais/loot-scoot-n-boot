class Game {
    constructor (gameLevel){
        this.CARGO_SPAWN_INTERVAL         = 2000;
        this.PIRATE_PROBABILITY_THRESHOLD = 0.98;

        this.pirateStealWeight  = 0;
        this.targetScore        = 0;
        this.gameLevel          = gameLevel;
        
        this.startScreen        = document.querySelector('#game-intro');
        this.gameScreen         = document.querySelector('#game-screen');
        this.gameContainer      = document.querySelector('#game-container');
        this.gameEndScreen      = document.querySelector('#game-end');
        this.targetInfoElement  = document.querySelector('#target-info');        
        this.missilesElement    = document.querySelector('#missiles');
        this.scoreElement       = document.querySelector('#score');
        this.timerElement       = document.querySelector('#timer');
        this.timerCount         = 60;
        this.height             = 800;  //Play area height
        this.width              = 700;  //Play area width
        this.pirates            = [];
        this.cargos             = [];
        this.missiles           = [];
        this.missilesCount      = 0;
        this.score              = 0;
        this.gameIsOver         = false;
        this.gameIntervalId     = null;
        this.gameTimerId        = null;
        this.gameLoopFrecuency  = Math.round(1000/60);
        
        this.gameScreen.style.position = "relative";
        
        let imgSrc  = '../images/ship-trail.png';
        this.player = new Player(this.gameScreen, (this.width/2 - 50), (this.height - 100), 50, 200, imgSrc, this.height, this.width);    
        
        this.horn   = new Audio('../sounds/horn.wav');
        this.money  = new Audio('../sounds/money.wav');
        this.sink   = new Audio('../sounds/sink.wav');
        this.steal  = new Audio('../sounds/steal.flac');
        this.shoot  = new Audio('../sounds/shoot.wav');
        this.setLevelParameters();
    }

    setLevelParameters(){
        switch(this.gameLevel) {
            case "LEVEL1":
              this.targetScore        = 500;
              this.pirateStealWeight  = 100;
              this.missilesCount      = 5;
              break;
            case "LEVEL2":
              this.targetScore        = 1000;
              this.pirateStealWeight  = 500;
              this.missilesCount      = 3;
              break;            
            case "LEVEL3":
              this.targetScore        = 2000;
              this.pirateStealWeight  = 500000;
              this.missilesCount      = 2;
              break;
        }
        this.targetInfoElement.textContent  = this.targetScore;
        this.missilesElement.textContent    = this.missilesCount;
    }

    start (){
        this.horn.play();              //Play Horn sound for game start
                
        this.gameScreen.style.height    = `${this.height}px`;
        this.gameScreen.style.width     = `${this.width}px`;
        this.startScreen.style.display  = "none";
        this.gameContainer.style.display= "flex";
        this.gameScreen.style.display   = "flex";

        this.gameIntervalId             = setInterval(()=>{
            this.gameLoop();
        }, this.gameLoopFrecuency);

        this.cargoIntervalId            = setInterval(()=>{
            const newCargo  = new Cargo(this.gameScreen, 60, 35);
            this.cargos.push(newCargo);
        }, this.CARGO_SPAWN_INTERVAL);

        this.game60Timer                = setInterval(()=>{
            this.timerCount -= 1;
            this.timerElement.textContent = this.timerCount;
        }, 1000);

        this.gameTimerId                = setTimeout(()=>{
            this.gameIsOver = true;
            this.gameEndScreen.style.display= "flex";
            this.gameContainer.style.display= "none";
            this.gameScreen.style.display   = "none";
            clearTimeout(this.gameTimerId);
            clearTimeout(this.gameIntervalId);
            clearTimeout(this.cargoIntervalId);
            clearTimeout(this.game60Timer);
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
        this.handleObstacleMove (this.cargos, 'CARGO', this.money);
        this.handleObstacleMove (this.pirates, 'PIRATE', this.steal);
        this.handleObstacleMove (this.missiles, 'MISSILE', this.steal);

        // Create a new Pirate based on a random probability
        // when there is no other Pirate on the screen
        if (Math.random() > this.PIRATE_PROBABILITY_THRESHOLD && this.pirates.length < 1) {
            let imgSrc  = '../images/pirate-ship.png';
            const newPirate = new Pirate(this.gameScreen, 80, 150, imgSrc);  
            this.pirates.push(newPirate);
        }
    }
    
    handleObstacleMove (obstacles, obstacleType, collisionSound){
        for (let i=0 ; i<obstacles.length ; i++){
            obstacles[i].move();

            const obstacleCollidedPlayer = this.player.didCollide(obstacles[i]);
            if (obstacleCollidedPlayer){                //Player collided with Cargo or Pirate
                collisionSound.play();                  //Play collision sound
                if (obstacleType === 'PIRATE'){         //Remove the Cargo weight from ship as Pirate stole                    
                    this.score      = ((this.score - this.pirateStealWeight) > 0 ? this.score - this.pirateStealWeight : 0);
                    this.setProgress();
                }
                else{                                   //Collect Cargo weight
                    const weight = obstacles[i].element.getAttribute('weight'); 
                    this.score   += Number(weight); 
                    this.setProgress();
                }
                this.removeElement(obstacles, i);
            }
            else if (obstacles[i].top > this.height){   //Check if Obstacle moved out of the screen
                this.removeElement(obstacles, i);
            }
            else if (obstacleType === 'CARGO') {        
                for (let j=0 ; j<this.pirates.length ; j++){
                    const cargoCollidedPirate = this.pirates[j].didCollide(obstacles[i]);
                    if (cargoCollidedPirate){           //Cargo lost due to collision with Pirate
                        this.sink.play();               //Play sink sound for Cargo lost
                        this.removeElement(obstacles, i);
                    }
                }
            }
            else if (obstacleType === 'MISSILE') {      
                for (let j=0 ; j<this.pirates.length ; j++){
                    const missileCollidedPirate = this.pirates[j].didCollide(obstacles[i]);
                    if (missileCollidedPirate){         //Pirate ship shot down
                        this.sink.play();               //Play sink sound for Pirate ship                    
                        const weight    = this.pirates[j].element.getAttribute('weight');
                        const newCargo  = new Cargo(this.gameScreen, 60, 35, obstacles[i].top, obstacles[i].left, weight);
                        this.cargos.push(newCargo);
                        this.removeElement(obstacles, i);
                        this.removeElement(this.pirates, j);
                    }
                }
            }  
        }
    }

    removeElement(obstacles, i){
        obstacles[i].element.remove();          //Remove the Obstacle from the screen
        obstacles.splice(i, 1);                 //Remove the Obstacle from JS array
    }

    setProgress(){
        const progressBar = document.querySelector("#progressBar");
        const progressPercent = (this.score / this.targetScore) * 100;
        progressBar.style.width = `${progressPercent}%`; 

        if (progressPercent >= 50){
            this.player.reduceY = 0.15;
        }
        else if (progressPercent >= 100){
            this.gameIsOver = true;
        }
    }

    shootMissile(){
        if (this.missilesCount > 0){
            this.shoot.play();
            this.missilesCount                  -= 1;
            this.missilesElement.textContent    = this.missilesCount;
            const newMissile                    = new Missile(this.gameScreen, 5, 10, this.player.top, this.player.left + 20);
            this.missiles.push(newMissile);
        }
    }
}