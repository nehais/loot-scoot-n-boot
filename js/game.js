class Game {
    constructor (gameLevel, playerName){
        this.CARGO_SPAWN_INTERVAL         = 2000;
        this.PIRATE_PROBABILITY_THRESHOLD = 0.98;

        this.pirateStealWeight  = 0;
        this.targetScore        = 0;
        this.gameLevel          = gameLevel;
        this.playerName         = playerName;
        
        this.startScreen        = document.querySelector('#game-intro');
        this.gameScreen         = document.querySelector('#game-screen');
        this.gameContainer      = document.querySelector('#game-container');
        this.gameEndScreen      = document.querySelector('#game-end-modal');
        this.gameStartTimer     = document.querySelector('#game-start-timer');
        this.targetInfoElement  = document.querySelector('#target-info');
        this.timerElement1      = document.querySelector('#timer1');
        this.timerElement2      = document.querySelector('#timer2');
        this.timerAreaElement   = document.querySelector('#timer-area');
        this.sunElement         = document.querySelector('#sun-shine');
        this.ratingInfoElement  = document.querySelector('#rating-info');
        this.timerCount         = 60;   //Game Duration
        this.gameStartCount     = 3;        
        this.height             = 0;    //Play area height
        this.width              = 0;    //Play area width
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
        
        this.horn   = new Audio('sounds/horn.wav');
        this.money  = new Audio('sounds/money.wav');
        this.sink   = new Audio('sounds/sink.wav');
        this.steal  = new Audio('sounds/steal.flac');
        this.shoot  = new Audio('sounds/shoot.wav');
        this.setLevelParameters();
    }

    setLevelParameters(){
        //Set the Game Parameters w.r.t the Level selected
        switch(this.gameLevel) {
            case "LEVEL1":
              this.targetScore        = 50;
              this.pirateStealWeight  = 50;
              this.missilesCount      = 5;
              break;
            case "LEVEL2":
              this.targetScore        = 500;
              this.pirateStealWeight  = 200;
              this.missilesCount      = 3;
              break;            
            case "LEVEL3":
              this.targetScore        = 10;
              this.pirateStealWeight  = 500000;
              this.missilesCount      = 2;
              break;
        }
        this.targetInfoElement.textContent  = this.targetScore;
          
        let missiles = document.querySelectorAll('.missile');
        missiles.forEach(missile => {
            if (missile.getAttribute('data-value') > this.missilesCount) {
                missile.remove();
            } 
        });
    }

    start (){        
        this.startScreen.style.display  = "none";
        this.gameContainer.style.display= "flex";
        this.gameScreen.style.display   = "flex";

        //Get the screen size
        this.height             = this.gameScreen.clientHeight;  //Play area height
        this.width              = this.gameScreen.clientWidth;   //Play area width
        
        //Create Player Ship Element
        let imgSrc  = 'images/ship-trail-empty.png';
        this.player = new Player(this.gameScreen, (this.width/2 - 50), (this.height - 100), 50, 200, imgSrc, this.height, this.width);    

        this.cargoIntervalId            = setInterval(()=>{
            //Create new Cargos every 2s
            const newCargo  = new Cargo(this.gameScreen, 60, 35);
            this.cargos.push(newCargo);
        }, this.CARGO_SPAWN_INTERVAL);

        this.counterIntervalId          = setInterval(()=>{
            //Decrement the Game Timer & change the sun images from sun-rise to sun-set
            if (this.gameStartCount === 0){
                this.timerCount -= 1;
            }
            
            this.timerElement1.textContent = this.timerCount;
            this.timerElement2.textContent = this.timerCount;
            
            if (this.timerCount === 40){
                this.sunElement.style.backgroundImage = `url('images/sun/sun-mid.png')`;
            }
            else if (this.timerCount === 25){
                this.sunElement.style.backgroundImage = `url('images/sun/sun-set.png')`;
            }
            else if (this.timerCount === 0){
                //Close the game in 60s
                clearInterval(this.gameIntervalId);
                clearInterval(this.cargoIntervalId);
                clearInterval(this.counterIntervalId);
                this.gameOverScreen('LOST');
                this.sink.play();
            }
        }, 1000);

        const sec3IntervalId          = setInterval(()=>{
            this.horn.play();              //Play Horn sound for game start
            //Count down 3s for game to start
            this.gameStartCount -=1;
            if (this.gameStartCount === 0){
                
                this.gameStartTimer.remove();
                
                this.gameScreen.style.justifyContent    = "flex-end";
                this.sunElement.style.display           = "block"; 
                this.gameScreen.style.animation         = "slide 5s linear infinite";
                clearInterval(sec3IntervalId);
                this.gameIntervalId                     = setInterval(()=>{
                    //Start the Game
                    this.gameLoop();
                }, this.gameLoopFrecuency);
            } 
            this.gameStartTimer.textContent = this.gameStartCount;
        }, 1000);
    }

    gameLoop (){
        this.update();
        
        if (this.gameTargetD) {
            //Player achieved the Cargo Target
            this.gameTargetDone();                  

            if(this.player.docked){                 
                this.gameOverScreen('WON');
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
            let imgSrc  = 'images/pirate-ship.png';
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
        document.getElementById('popup').style.display = 'block'; // Show the popup
        document.getElementById('overlay').style.display = 'block'; // Show the overlay
        const sec3TimeOut = setTimeout (()=>{
            document.getElementById('popup').style.display = 'none'; // Hide the popup
            document.getElementById('overlay').style.display = 'none'; // Hide the overlay
            clearTimeout(sec3TimeOut);
        }, 4000);

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
    }

    gameOverScreen(gameResult){
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

        let stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('highlighted');
            } else {
                star.classList.remove('highlighted');
            }
        });

        this.showLeaderboard(gameResult);
    }

    showLeaderboard(gameResult){
        //Fetch the past top scorers
        let topPlayers = JSON.parse(localStorage.getItem(`top-captains-${this.gameLevel}`));
        topPlayers     = topPlayers ? topPlayers : [];

        //Show the User score if WON
        if (gameResult === 'WON'){    
            let finalScoreElement = document.querySelector('#final-score');
            finalScoreElement.textContent       = `'${(60 - this.timerCount)}s'`;

            let currPlayer = {name: this.playerName,
                score: (60 - this.timerCount)};

            topPlayers.push(currPlayer);
        }        
        
        if (topPlayers.length > 0){
            const leaderboardElement            = document.querySelector('#leaderboard-area');
            leaderboardElement.style.display    = 'block';
            this.gameEndScreen.style.height     = '50vh'
            this.gameEndScreen.style.minHeight  = '455px';
            
            topPlayers.sort((a, b) => {
                return a.score - b.score
            });

            topPlayers = topPlayers.slice(0, 3);    //Take the top 3 players & discard the rest

            topPlayers.forEach((topperElement, index) => {
                let nameElement         = document.querySelector(`#name${index + 1}`);
                nameElement.textContent = topperElement.name;

                let scoreElement        = document.querySelector(`#score${index + 1}`);
                scoreElement.textContent= topperElement.score + 's';
            });

            localStorage.setItem(`top-captains-${this.gameLevel}`, JSON.stringify(topPlayers));
        }
    }
}