window.onload = function () {
    const startButton   = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    let scootGame;
  
    //Start the game on click of start button
    startButton.addEventListener("click", function () {
      startGame();
    });
  
    function startGame() {
      console.log("game started");
      scootGame = new Game();
      scootGame.start();
    }
  
    //Check if arrow keys were pressed
    document.body.addEventListener("keydown", keyDownPressed);
    function keyDownPressed(e) {
      console.log("keydown pressed");
  
      if (e.keyCode == '38') {// up arrow
        scootGame.player.directionY -= 0.01;
      }
      else if (e.keyCode == '40') {// down arrow
        scootGame.player.directionY += 0.01;
      }
      else if (e.keyCode == '37') {// left arrow
        scootGame.player.directionX -= 0.01;
      }
      else if (e.keyCode == '39') {// right arrow
        scootGame.player.directionX += 0.01;
      }
    }
    
    document.body.addEventListener("keyup", keyUpPressed);
    function keyUpPressed(e) {
      console.log("keyup pressed");
  
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