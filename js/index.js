window.onload = function () {
    //const startButton   = document.getElementById("start-button");
    //const restartButton = document.getElementById("restart-button");
    let raceGame;
  
    startGame();

    /*startButton.addEventListener("click", function () {
      startGame();
    });*/
  
    function startGame() {
      console.log("start game");
      raceGame = new Game();
      raceGame.start();
    }
  
    //Check if arrow keys were pressed
    //document.body.onkeydown = keyPressed;
    
    /*document.body.addEventListener("keydown", keyPressed);
    function keyPressed(e) {
  
      if (e.keyCode == '38') {// up arrow
        raceGame.player.directionY -= 1;
      }
      else if (e.keyCode == '40') {// down arrow
        raceGame.player.directionY += 1;
      }
      else if (e.keyCode == '37') {// left arrow
        raceGame.player.directionX -= 1;
      }
      else if (e.keyCode == '39') {// right arrow
        raceGame.player.directionX += 1;
      }
    }*/
  };