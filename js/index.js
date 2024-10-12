window.onload = function () {
    const startScreen   = document.querySelector('#game-intro');
    const helpScreen    = document.querySelector('#game-help');    
    const startButton   = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const helpButton    = document.getElementById("help-button");
    const backButton    = document.getElementById("back-button");
    const level1        = document.getElementById("level1");
    const level2        = document.getElementById("level2");
    const level3        = document.getElementById("level3");

    let gameLevel;
    let scootGame;
  
    gameLevel = "LEVEL1";
    changeLevel(level1);

    //Start the game on click of start button
    level1.addEventListener("click", function () {
      gameLevel = "LEVEL1";
      changeLevel(level1);
    });
    level2.addEventListener("click", function () {
      gameLevel = "LEVEL2";
      changeLevel(level2);
    });
    level3.addEventListener("click", function () {
      gameLevel = "LEVEL3";
      changeLevel(level3);
    });
    
    function changeLevel(level) {
      level1.classList.remove('level-selected');
      level2.classList.remove('level-selected');
      level3.classList.remove('level-selected');
      level.classList.add('level-selected');
    }

    //Start the game on click of start button
    startButton.addEventListener("click", function () {
      startGame();
    });
  
    function startGame() {
      console.log("game started");
      scootGame = new Game(gameLevel);
      scootGame.start();
    }
    
    //Bring the help screen on button click
    helpButton.addEventListener("click", function () {
      helpGame();
    });
  
    function helpGame() {
      startScreen.style.display = "none";
      helpScreen.style.opacity = 1;
      helpScreen.style.display  = "flex";
    }
    
    //Bring the start screen back on button click
    backButton.addEventListener("click", function () {
      backGame();
    });
  
    function backGame() {
      startScreen.style.display = "flex";
      helpScreen.style.display  = "none";
    }
  
    //Check if arrow keys were pressed
    document.body.addEventListener("keydown", keyDownPressed);
    function keyDownPressed(e) {
      if (e.keyCode == '38') {// up arrow
        scootGame.player.directionY -= 0.5;
      }
      else if (e.keyCode == '40') {// down arrow
        scootGame.player.directionY += 0.5;
      }
      else if (e.keyCode == '37') {// left arrow
        scootGame.player.directionX -= 0.5;
        scootGame.player.rotatePlayer(-25);
      }
      else if (e.keyCode == '39') {// right arrow
        scootGame.player.directionX += 0.5;
        scootGame.player.rotatePlayer(25);
      }
    }
    
    document.body.addEventListener("keyup", keyUpPressed);
    function keyUpPressed(e) {      
      scootGame.player.rotatePlayer(0);

      if (e.keyCode == '38') {// up arrow
        scootGame.player.directionY = 0;
      }
      else if (e.keyCode == '40') {// down arrow
        scootGame.player.directionY = 0;
      }
      else if (e.keyCode == '37') {// left arrow
        scootGame.player.directionX = 0;
      }
      else if (e.keyCode == '39') {// right arrow
        scootGame.player.directionX = 0;
      }
    }

    //Reload the game on click of restart button
    restartButton.addEventListener("click", function () {
      location.reload();
    });
  };