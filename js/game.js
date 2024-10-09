class Game {
    // code to be added
    constructor (){
        this.startScreen        = document.querySelector('#game-intro');
        this.gameScreen         = document.querySelector('#game-screen');
        this.gameEndScreen      = document.querySelector('#game-end');
        this.height             = 800;  //Play area height
        this.width              = 600;  //Play area width
        //this.obstacles          = [];
        //this.score              = 0;
        //this.lives              = 3;
        this.gameIsOver         = false;
        this.gameIntervalId     = null;
        this.gameLoopFrecuency  = Math.round(1000/60);
        
        this.gameScreen.style.position = "relative";
        
        let imgSrc  = '../images/ship-trail.png';
        this.player = new Player(this.gameScreen, 250, 300, 80, 300, imgSrc);
    }

    start (){
        this.gameScreen.style.height    = `${this.height}px`;
        this.gameScreen.style.width     = `${this.width}px`;
        this.startScreen.style.display  = "none";
        this.gameScreen.style.display   = "block";

        this.gameIntervalId             = setInterval(()=>{
            //this.gameLoop();
        }, this.gameLoopFrecuency);
    }

    /*gameLoop (){
        this.update();
        
        if (this.gameIsOver) {
            clearInterval(this.gameIntervalId);
        }
    }

    update (){
        this.player.move();
    }*/
}