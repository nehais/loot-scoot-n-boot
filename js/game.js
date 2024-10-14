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
        this.gameEndScreen      = document.querySelector('#game-end-modal');
        this.targetInfoElement  = document.querySelector('#target-info');
        this.timerElement       = document.querySelector('#timer');
        this.timerAreaElement   = document.querySelector('#timer-area');
        this.sunElement         = document.querySelector('#sun-shine');
        this.stars              = document.querySelectorAll('.star');
        this.ratingInfoElement  = document.querySelector('#rating-info');
        this.timerCount         = 60;   //Game Duration
        this.height             = 800;  //Play area height
        this.width              = 700;  //Play area width
        this.port               = null;
        this.pirates            = [];
        this.cargos             = [];
        this.missiles           = [];
        this.missilesCount      = 0;
        this.score              = 0;
        this.highScores         = [];
        this.gameTargetD        = false;
        this.gameIntervalId     = null;
        this.cargoIntervalId    = null;
        this.counterIntervalId  = null;
        this.gameLoopFrecuency  = Math.round(1000/60);
        
        this.gameScreen.style.position = "relative";
        
        let imgSrc  = '../images/ship-trail-empty.png';
        this.player = new Player(this.gameScreen, (this.width/2 - 50), (this.height - 100), 50, 200, imgSrc, this.height, this.width);    
        
        this.horn   = new Audio('../sounds/horn.wav');
        this.money  = new Audio('../sounds/money.wav');
        this.sink   = new Audio('../sounds/sink.wav');
        this.steal  = new Audio('../sounds/steal.flac');
        this.shoot  = new Audio('../sounds/shoot.wav');
        this.setLevelParameters();
    }

    setLevelParameters(){
        //Set the Game Parameters w.r.t the Level selected
        switch(this.gameLevel) {
            case "LEVEL1":
              this.targetScore        = 250;
              this.pirateStealWeight  = 100;
              this.missilesCount      = 5;
              break;
            case "LEVEL2":
              this.targetScore        = 500;
              this.pirateStealWeight  = 500;
              this.missilesCount      = 3;
              break;            
            case "LEVEL3":
              this.targetScore        = 1000;
              this.pirateStealWeight  = 500000;
              this.missilesCount      = 2;
              break;
        }
        this.targetInfoElement.textContent  = this.targetScore;
    }

    start (){
        this.horn.play();              //Play Horn sound for game start
                
        this.gameScreen.style.height    = `${this.height}px`;
        this.gameScreen.style.width     = `${this.width}px`;
        this.startScreen.style.display  = "none";
        this.gameContainer.style.display= "flex";
        this.gameScreen.style.display   = "flex";

        this.gameIntervalId             = setInterval(()=>{
            //Start the Game
            this.gameLoop();
        }, this.gameLoopFrecuency);

        this.cargoIntervalId            = setInterval(()=>{
            //Create new Cargos every 2s
            const newCargo  = new Cargo(this.gameScreen, 60, 35);
            this.cargos.push(newCargo);
        }, this.CARGO_SPAWN_INTERVAL);

        this.counterIntervalId          = setInterval(()=>{
            //Decrement the Game Timer & change the sun images from sun-rise to sun-set
            this.timerCount -= 1;
            this.timerElement.textContent = this.timerCount;
            if (this.timerCount === 40){
                this.sunElement.style.backgroundImage = `url('../images/sun/sun-mid.png')`;
            }
            else if (this.timerCount === 25){
                this.sunElement.style.backgroundImage = `url('../images/sun/sun-set.png')`;
            }
            else if (this.timerCount === 0){
                //Close the game in 60s
                clearInterval(this.gameIntervalId);
                clearInterval(this.cargoIntervalId);
                clearInterval(this.counterIntervalId);
                this.gameOverScreen();
                this.sink.play();
            }
        }, 1000);
    }

    gameLoop (){
        this.update();
        
        if (this.gameTargetD) {
            //Player achieved the Cargo Target
            this.gameTargetDone();                  

            if(this.player.docked){                 
                this.gameOverScreen();
                this.money.play();                
                clearInterval(this.gameIntervalId);
            }
        }
    }

    update (){
        //Move the Game elements
        this.player.move();
        this.handleObstacleMove (this.cargos, 'CARGO', this.money);
        this.handleObstacleMove (this.pirates, 'PIRATE', this.steal);
        this.handleObstacleMove (this.missiles, 'MISSILE', this.steal);
        if(this.port){
            this.port.move();
        }

        // Create a new Pirate based on a random probability
        // when there is no other Pirate on the screen
        if (Math.random() > this.PIRATE_PROBABILITY_THRESHOLD && this.pirates.length < 1 && !this.gameTargetD) {
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
        const cargosBar   = document.querySelector("#cargos");
        const progressBar = document.querySelector("#progressBar");
        let progressPercent     = (this.score / this.targetScore) * 100;
        progressPercent         = ((progressPercent > 100) ? 100 : progressPercent);
        progressBar.style.width = `${progressPercent}%`; 
        cargosBar.style.width   = `${progressPercent * 0.8}%`; 
        cargosBar.style.height  = `${progressPercent * 0.9}%`; 

        if (progressPercent >= 50){
            this.player.reduceY = 0.15;
        }
        if (progressPercent >= 100){
            this.gameTargetD = true;
        }
    }

    shootMissile(){
        if (this.missilesCount > 0){
            this.shoot.play();
            const missileElement         = document.querySelector(`#missile${this.missilesCount}`);
            missileElement.style.display = 'none';      //Remove a Missile icon to show missiles left
            this.missilesCount           -= 1;
            const newMissile             = new Missile(this.gameScreen, 10, 20, this.player.top-20, this.player.left + 15);
            this.missiles.push(newMissile);
        }
    }

    gameTargetDone(){
        clearInterval(this.counterIntervalId);          //Stop the game timer
        clearInterval(this.cargoIntervalId);            //No new Cargos should be created
        
        this.player.gameTargetD = true;
        if (this.port){
            return;
        }

        this.port = new Port(this.gameScreen, this.width, 700);  
        this.horn.play();                               //Play horn to indicate Game ended

        for(let i=0 ; i<this.pirates.length ; i++){     //Remove the Pirate
            this.removeElement(this.pirates, i);
        }
        for(let i=0 ; i<this.cargos.length ; i++){      //Remove the Cargos
            this.removeElement(this.cargos, i);
        }
        this.sunElement.remove();                       //Remove the Sun
        this.timerAreaElement.remove();                 //Remove the Timer
    }

    gameOverScreen(){
        this.sunElement.remove();                       //Remove the Sun
        
        //Stop the sea movement once Ship is docked
        this.gameScreen.style.animation         = 'slide 5s linear 1'
        this.gameScreen.style.justifyContent    = "center";                
        this.gameEndScreen.style.display        = "flex";
        
        let rating = 0;
        this.ratingInfoElement.textContent      = "Mission failed! Unfortunately, you couldn’t complete the objectives.";
        if (this.timerCount >= 40){
            rating = 3;
            this.ratingInfoElement.textContent  = "Epic win! You've mastered every challenge and emerged victorious!"; 
        }else if (this.timerCount >= 20){
            rating = 2; 
            this.ratingInfoElement.textContent  = "Fantastic! You outperformed expectations and scored big!";
        }else if (this.timerCount > 0){
            rating = 1; 
            this.ratingInfoElement.textContent  = "Mission completed, but with low rewards. There's potential for a higher score!";
        }  

        this.stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('highlighted');
            } else {
                star.classList.remove('highlighted');
            }
        });
    }
}