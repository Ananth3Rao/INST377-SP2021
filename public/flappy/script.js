document.addEventListener('DOMContentLoaded', () => {
  const bird = document.querySelector('.bird');
  const gameDisplay = document.querySelector('.game-container');
  const ground = document.querySelector('.ground');

  const birdLeft = 220;
  let birdTop = 435;
  const gravity = 2;
  let isGameOver = false;
  let gap = 430;

  function startGame() {
    birdTop += gravity;
    bird.style.top = `${birdTop}px`;
    bird.style.left = `${birdLeft}px`;
  }
  const gameTimerId = setInterval(startGame, 20);

  function jump() {
    if (birdTop < 50) {
      birdTop = 0;
    } else {
      birdTop -= 50;
    }
    bird.style.top = `${birdTop}px`;
  }

  function control(e) {
    if (e.keyCode === 32) {
      jump();
    }
  }
  document.addEventListener('keyup', control);

  function generateObstacle() {
    const randomHeight = Math.random() * 60;
    let obstacleLeft = 500;
    const obstacleBottom = randomHeight;
    const obstacle = document.createElement('div');
    const topObstacle = document.createElement('div');
    if (!isGameOver) {
      obstacle.classList.add('obstacle');
      topObstacle.classList.add('TopObstacle');
    }
    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);
    obstacle.style.left = `${obstacleLeft}px`;
    topObstacle.style.left = `${obstacleLeft}px`;
    obstacle.style.bottom = `${obstacleBottom}px`;
    topObstacle.style.bottom = `${obstacleBottom + gap}px`;

    function moveObstacle() {
      if(!isGameOver) obstacleLeft -= 2;
      obstacle.style.left = `${obstacleLeft}px`;
      topObstacle.style.left = `${obstacleLeft}px`;

      if (obstacleLeft === -60) { 
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
      }
      if (
        obstacleLeft > 200 && obstacleLeft < 280 && birdLeft === 220 
        && ((535 - birdTop) < obstacleBottom + 152 || (535 - birdTop) > obstacleBottom + gap - 200)
        || birdTop === 535) {
        gameOver();
        clearInterval(timerId);
      } 
    }
    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) setTimeout(generateObstacle, 3000);
  }
  generateObstacle();

  function gameOver() {
    isGameOver = true;
    clearInterval(gameTimerId);
    console.log('game over'); 
    document.removeEventListener('keyup', control);
  }
});