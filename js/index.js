window.onload = function () {
    const startScreen   = document.querySelector('#game-intro');
    const helpScreen    = document.querySelector('#game-help');    
    const startButton   = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const newButton1    = document.getElementById("new-game1");
    const newButton2    = document.getElementById("new-game2");
    const helpButton    = document.getElementById("help-button");
    const backButton    = document.getElementById("back-button");
    const level1        = document.getElementById("level1");
    const level2        = document.getElementById("level2");
    const level3        = document.getElementById("level3");
    const playerNameEle = document.getElementById("name");

    let gameLevel;
    let scootGame;
    let playerName      = localStorage.getItem("captain-name");
    playerNameEle.value = playerName;
  
    //On game load initially set it on Level 1
    gameLevel = "LEVEL1";
    changeLevel(level1);

    //Set & Select the game Level
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
      //Add/Remove class to mark the Level selected
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
      playerName = playerNameEle.value ? playerNameEle.value : 'Captain NoClue';
      localStorage.setItem("captain-name", playerName)

      scootGame = new Game(gameLevel, playerName);
      scootGame.start();
    }
    
    //Bring the help screen on button click
    helpButton.addEventListener("click", function () {
      helpGame();
    });
  
    function helpGame() {
      startScreen.style.display = "none";
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
      if(scootGame.gameTargetD){
        return;
      }
      else if (e.keyCode == '38') {// up arrow
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
      else if (e.keyCode == '32') {// spacebar
        scootGame.shootMissile();
      }
    }
    
    document.body.addEventListener("keyup", keyUpPressed);
    function keyUpPressed(e) {      
      scootGame.player.rotatePlayer(0);

      if(scootGame.gameIsOver){
        return;
      }
      else if (e.keyCode == '38') {// up arrow
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

    //Mobile version: Check if arrows were touched
    document.getElementById('left').addEventListener('touchstart', () => arrowTouched('LEFT'));
    document.getElementById('left').addEventListener('touchend', () =>  arrowRemoved('LEFT'));

    document.getElementById('up').addEventListener('touchstart', () => arrowTouched('UP'));
    document.getElementById('up').addEventListener('touchend', () => arrowRemoved('UP'));

    document.getElementById('right').addEventListener('touchstart', () => arrowTouched('RIGHT'));
    document.getElementById('right').addEventListener('touchend', () => arrowRemoved('RIGHT'));

    document.getElementById('down').addEventListener('touchstart', () => arrowTouched('DOWN'));
    document.getElementById('down').addEventListener('touchend', () => arrowRemoved('DOWN')); 

    document.getElementById('shoot').addEventListener('click', () => arrowTouched('SHOOT'));

    function arrowTouched(arrow) {
      if(scootGame.gameTargetD){
        return;
      }
      else if (arrow == 'UP') {// up arrow
        scootGame.player.directionY -= 0.5;
      }
      else if (arrow == 'DOWN') {// down arrow
        scootGame.player.directionY += 0.5;
      }
      else if (arrow == 'LEFT') {// left arrow
        scootGame.player.directionX -= 0.5;
        scootGame.player.rotatePlayer(-25);
      }
      else if (arrow == 'RIGHT') {// right arrow
        scootGame.player.directionX += 0.5;
        scootGame.player.rotatePlayer(25);
      }
      else if (arrow == 'SHOOT') {// missile icon
        scootGame.shootMissile();
      }
    }

    function arrowRemoved(arrow) {
      scootGame.player.rotatePlayer(0);

      if(scootGame.gameIsOver){
        return;
      }
      else if (arrow == 'UP') {// up arrow
        scootGame.player.directionY = 0;
      }
      else if (arrow == 'DOWN') {// down arrow
        scootGame.player.directionY = 0;
      }
      else if (arrow == 'LEFT') {// left arrow
        scootGame.player.directionX = 0;
      }
      else if (arrow == 'RIGHT') {// right arrow
        scootGame.player.directionX = 0;
      }
    }

    //Reload the game on click of new button
    newButton1.addEventListener("click", function () {
      location.reload();
    });
    newButton2.addEventListener("click", function () {
      location.reload();
    });

    //Reload the game on click of restart button
    restartButton.addEventListener("click", function () {
      location.reload();
    });
  };