class Pacman {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION.RIGHT;
    this.nextDirection = this.direction;
    this.currentFrame = 1;
    this.countFrame = 7;
    setInterval(() => this.changeAnimation(), 75);
  }

  checkGhostCollision(ghosts) {
    for (let i = 0; i < ghosts.length; i++) {
      let ghost = ghosts[i];
      if (
        ghost.getMapX() == this.getMapX() &&
        ghost.getMapY() == this.getMapY()
      ) {
        return true;
      }
    }
    return false;
  }

  movePacman() {
    this.changeDirectionIfPossible();
    this.moveForwards();
    if (this.checkCollision()) {
      this.moveBackwards();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + oneBlockSize / 2, this.y + oneBlockSize / 2);
    ctx.rotate((this.direction * 90 * Math.PI) / 180);
    ctx.translate(-this.x - oneBlockSize / 2, -this.y - oneBlockSize / 2);
    ctx.drawImage(
      $pacmanSprite,
      (this.currentFrame - 1) * oneBlockSize,
      0,
      oneBlockSize,
      oneBlockSize,
      this.x,
      this.y,
      oneBlockSize,
      oneBlockSize
    );
    ctx.restore();
  }

  eat() {
    matriz.forEach((row, y) => {
      row.forEach((value, x) => {
        if (
          value === TYPE.SPACE &&
          this.getMapX() === x &&
          this.getMapY() === y
        ) {
          matriz[y][x] = 3;
          counterScore++;
          onlyFoodScore++;
        }
        if (
          value === TYPE.FRUIT &&
          this.getMapX() === x &&
          this.getMapY() === y
        ) {
          matriz[y][x] = 3;
          counterScore += 5000;
        }
        if (
          value === TYPE.SPECIAL_FOOD &&
          this.getMapX() === x &&
          this.getMapY() === y
        ) {
          matriz[y][x] = 3;
          counterScore += 1000;
          changeAspectOfGhosts('blue');
        }
      });
    });
  }

  changeDirectionIfPossible() {
    if (this.direction === this.nextDirection) return;
    let tempDirection = this.direction;
    this.direction = this.nextDirection;
    this.moveForwards();
    if (this.checkCollision()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  getMapX() {
    return parseInt(this.x / oneBlockSize);
  }

  getMapY() {
    return parseInt(this.y / oneBlockSize);
  }

  get_X_MapRightSide() {
    return parseInt((this.x * 0.999 + oneBlockSize) / oneBlockSize);
  }

  get_Y_MapRightSide() {
    return parseInt((this.y * 0.999 + oneBlockSize) / oneBlockSize);
  }

  changeAnimation() {
    this.currentFrame =
      this.currentFrame === this.countFrame ? 1 : this.currentFrame + 1;
  }

  checkCollision() {
    let A = matriz[this.getMapY()][this.getMapX()] === TYPE.WALL;
    let B = matriz[this.getMapY()][this.get_X_MapRightSide()] === TYPE.WALL;
    let C = matriz[this.get_Y_MapRightSide()][this.getMapX()] === TYPE.WALL;
    let D =
      matriz[this.get_Y_MapRightSide()][this.get_X_MapRightSide()] === TYPE.WALL;
    return A || B || C || D;
  }

  moveForwards() {
    switch (this.direction) {
      case DIRECTION.RIGHT:
        this.x += this.speed;
        break;
      case DIRECTION.UP:
        this.y -= this.speed;
        break;
      case DIRECTION.LEFT:
        this.x -= this.speed;
        break;
      case DIRECTION.BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  moveBackwards() {
    switch (this.direction) {
      case DIRECTION.RIGHT:
        this.x -= this.speed;
        break;
      case DIRECTION.UP:
        this.y += this.speed;
        break;
      case DIRECTION.LEFT:
        this.x += this.speed;
        break;
      case DIRECTION.BOTTOM:
        this.y -= this.speed;
        break;
    }
  }
}
