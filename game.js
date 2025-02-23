//////////////////////////////////GLOBAL
const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);
const $canvas = $('.packman-canvas');
const ctx = $canvas.getContext('2d');
const oneBlockSize = 20;
const $ghostSprite = $('.ghost-sprite');
const $ghostSprite2 = $('.ghost-sprite-2');
const $pacmanSprite = $('.pacman-sprite');
const $pacmanLives = $$('.pacman-live');

const $pacmanModal = $('.pacman-modal');
const $fruitSprite = $('.fruit-sprite');
const $h2Win = $('.pacman-win');
const $h2Lost = $('.pacman-lost');
const $score = $('.pacman-score');

const $ghostBlue = $('.ghost-blue');
const $ghostEyes = $('.ghost-eyes');

//Audios
const pacmanEatingAudio = new Audio('sounds-pacman/eating.mp3');
pacmanEatingAudio.loop = true;
pacmanEatingAudio.volume = 0.8;
const ghostAudio = new Audio('sounds-pacman/ghost-normal-move.mp3');
ghostAudio.loop = true;
const ghostToBlue = new Audio('sounds-pacman/ghost-turn-to-blue.mp3');
ghostToBlue.loop = true;
ghostToBlue.volume = 0;
const EndGameAudio = new Audio('sounds-pacman/start-music.mp3');
EndGameAudio.loop = true;
EndGameAudio.volume = 0;

let randomFruit = ~~(Math.random() * 7);

let matriz = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 4, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 4, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 4, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 4, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let originalMatriz = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 4, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 4, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 4, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 4, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
let lives = 3;
let total_3 = 0;
let ghostCount = 4;
let ghostImageLocations = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 }
];
let ghosts = [];
let randomTargetsForGhosts = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: 1 * oneBlockSize, y: (matriz.length - 2) * oneBlockSize },
  { x: (matriz[0].length - 2) * oneBlockSize, y: oneBlockSize },
  {
    x: (matriz[0].length - 2) * oneBlockSize,
    y: (matriz.length - 2) * oneBlockSize
  }
];
let counterScore = 0;
let onlyFoodScore = 0;

const DIRECTION = {
  RIGHT: 4,
  UP: 3,
  LEFT: 2,
  BOTTOM: 1
};

//width = 21cols x 20 = 420
//height = 23rows x 20 = 460
const widthCanvas = $canvas.width;
const heightCanvas = $canvas.height;
const canvasBackground = '#000';
const wallColor = 'dodgerblue';
const foodColor = 'yellow';
const wallInnerColor = '#000';
const pacmanSpeed = 1;
let totalFoodCircles = 0;
const TYPE = {
  HOLE: 0,
  WALL: 1,
  SPACE: 2,
  SPECIAL_FOOD: 4,
  FRUIT: 5
};

let pacman = new Pacman(
  oneBlockSize,
  oneBlockSize,
  oneBlockSize,
  oneBlockSize,
  0
);
let wallWidth = oneBlockSize / 1.1;
let wallOffset = (oneBlockSize - wallWidth) / 2;
let fps = 500;

let gameInterval = setInterval(() => gameLoop(), 1000 / fps);

//////////////////////////////////FUNCTIONS
function drawRect(x, y, width, height, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.closePath();
}

(function total_n_item_foods() {
  matriz.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === TYPE.SPACE) {
        totalFoodCircles++;
      }
    });
  });
})();

(function addFruitToMap() {
  const time = 30000; //60 segundos

  setInterval(() => {
    randomFruit = ~~(Math.random() * 7);
    matriz[13][10] = 5;
  }, time);
})();

function updateGhosts() {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveGhost();
  }
}

function changeAspectOfGhosts(newAspect) {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].changeAspect(newAspect);
  }
}

function drawGhosts() {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
}

function gameLoop() {
  update();
  draw();
  $score.textContent = counterScore;
  updateGhosts();
  if (pacman.checkGhostCollision(ghosts)) {
    onGhostCollision();
  }
}

function update() {
  pacman.movePacman();
  pacman.eat();
  checkWin();
}

function draw() {
  ctx.clearRect(0, 0, widthCanvas, heightCanvas);
  drawRect(0, 0, widthCanvas, heightCanvas, canvasBackground);
  drawWalls();
  pacman.draw();
  drawFood();
  drawGhosts();
}

function drawWalls() {
  matriz.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === TYPE.WALL) {
        drawRect(
          x * oneBlockSize,
          y * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          wallColor
        );
      }
      if (x > 0 && matriz[y][x - 1] === TYPE.WALL) {
        drawRect(
          x * oneBlockSize,
          y * oneBlockSize + wallOffset,
          wallWidth + wallOffset,
          wallWidth,
          wallInnerColor
        );
      }
      if (x < matriz[0].length - 1 && matriz[y][x + 1] === TYPE.WALL) {
        drawRect(
          x * oneBlockSize + wallOffset,
          y * oneBlockSize + wallOffset,
          wallWidth + wallOffset,
          wallWidth,
          wallInnerColor
        );
      }

      if (y > 0 && matriz[y - 1][x] === TYPE.WALL) {
        drawRect(
          x * oneBlockSize + wallOffset,
          y * oneBlockSize,
          wallWidth,
          wallWidth + wallOffset,
          wallInnerColor
        );
      }

      if (y < matriz.length - 1 && matriz[y + 1][x] === TYPE.WALL) {
        drawRect(
          x * oneBlockSize + wallOffset,
          y * oneBlockSize + wallOffset,
          wallWidth,
          wallWidth + wallOffset,
          wallInnerColor
        );
      }
    });
  });
}

function createNewPacman() {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    pacmanSpeed
  );
}

function drawCircle({ x, y, radius, color }) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(
    x * oneBlockSize + oneBlockSize / 2,
    y * oneBlockSize + oneBlockSize / 2,
    radius,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.closePath();
}

function drawFood() {
  matriz.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === TYPE.SPACE) {
        drawCircle({ x, y, radius: oneBlockSize / 10, color: foodColor });
      }
      if (value === TYPE.SPECIAL_FOOD) {
        drawCircle({ x, y, radius: oneBlockSize / 3, color: foodColor });
      }
      if (value === TYPE.FRUIT) {
        ctx.drawImage(
          $fruitSprite,
          randomFruit * 32,
          0,
          32,
          32,
          x * oneBlockSize,
          y * oneBlockSize,
          oneBlockSize,
          oneBlockSize
        );
      }
    });
  });
}

function resetGameComplete() {
  if (gameInterval) clearInterval(gameInterval);
  lives = 3;
  counterScore = 0;
  onlyFoodScore = 0;
  total_3 = 0;
  $score.textContent = counterScore;
  $pacmanLives.forEach(pacman => pacman.classList.remove('desaparecer'));
  restartPacmanAndGhosts();
  gameInterval = setInterval(() => gameLoop(), 1000 / fps);
  matriz = structuredClone(originalMatriz);
}

function gameOver() {
  clearInterval(gameInterval);
  pacmanEatingAudio.pause();
  ghostAudio.pause();
  ghostToBlue.pause();
  EndGameAudio.volume = 1;
  $pacmanModal.classList.remove('hiddenModal');
}

function checkWin() {
  if (onlyFoodScore >= totalFoodCircles) {
    $h2Win.classList.toggle('h2-hidden', false);
    $h2Lost.classList.toggle('h2-hidden', true);
    gameOver();
  }
}

function allGhostsAreNormal() {
  return ghosts.every(ghost => ghost.getAspectOfGhost() === 'normal');
}

function onGhostCollision() {
  if (allGhostsAreNormal()) {
    lives--;
    restartPacmanAndGhosts();
    $pacmanLives[lives].classList.add('desaparecer');

    if (lives == 0) {
      $h2Win.classList.toggle('h2-hidden', true);
      $h2Lost.classList.toggle('h2-hidden', false);
      gameOver();
    }

    return;
  }
}

function createGhosts() {
  ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    let newGhost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostImageLocations[i % 4].x,
      ghostImageLocations[i % 4].y,
      124,
      116,
      6 + i,
      $ghostSprite,
      $ghostBlue,
      $ghostEyes
    );
    ghosts.push(newGhost);
  }
  for (let i = 0; i < ghostCount; i++) {
    let newGhost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostImageLocations[i % 4].x,
      ghostImageLocations[i % 4].y,
      124,
      116,
      6 + i,
      $ghostSprite2,
      $ghostBlue,
      $ghostEyes
    );
    ghosts.push(newGhost);
  }
}

function restartPacmanAndGhosts() {
  createNewPacman();
  createGhosts();
}

//////////////////////////////////EVENTS

document.addEventListener('keydown', ({ key }) => {
  if (key === 'ArrowRight' || key === 'D' || key === 'd')
    pacman.nextDirection = DIRECTION.RIGHT;
  else if (key === 'ArrowLeft' || key === 'A' || key === 'a')
    pacman.nextDirection = DIRECTION.LEFT;
  else if (key === 'ArrowUp' || key === 'W' || key === 'w')
    pacman.nextDirection = DIRECTION.UP;
  else if (key === 'ArrowDown' || key === 'S' || key === 's')
    pacman.nextDirection = DIRECTION.BOTTOM;
});

document.addEventListener('mousedown', e => {
  if (e.target.matches('.toUp')) {
    pacman.nextDirection = DIRECTION.UP;
  } else if (e.target.matches('.toLeft')) {
    pacman.nextDirection = DIRECTION.LEFT;
  } else if (e.target.matches('.toDown')) {
    pacman.nextDirection = DIRECTION.BOTTOM;
  } else if (e.target.matches('.toRight')) {
    pacman.nextDirection = DIRECTION.RIGHT;
  }
});

document.addEventListener('click', e => {
  if (
    e.target.matches('.btn-pacman-again') ||
    e.target.matches('.btn-pacman-again *')
  ) {
    $pacmanModal.classList.add('hiddenModal');
    resetGameComplete();
    playSoundsOfGame();
  }
});

function playSoundsOfGame() {
  pacmanEatingAudio.play();
  ghostAudio.play();
  ghostToBlue.play();
  EndGameAudio.play();
  EndGameAudio.volume = 0;
}
