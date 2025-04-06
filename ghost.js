class Ghost {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    range,
    sprite,
    ghostBlue,
    ghostEyes
  ) {
    this.x = x;
    this.y = y;
    this.initialPositionTarget = { x: x, y: y };
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION.RIGHT;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.range = range;
    this.randomTargetIndex = parseInt(Math.random() * 4);
    this.target = randomTargetsForGhosts[this.randomTargetIndex];
    setInterval(() => {
      this.changeRandomDirection();
    }, 10000);
    this.sprite = sprite;
    this.ghostBlue = ghostBlue;
    this.ghostEyes = ghostEyes;
    this.aspect = 'normal';
    this.currentFrame = 1;
    this.countFrame = 4;
    this.aspectInterval = null;
    this.aspectTimeOut = null;
  }

  changeRandomDirection() {
    let addition = 1;
    this.randomTargetIndex += addition;
    this.randomTargetIndex = this.randomTargetIndex % 4;
  }

  addNeighbors(poped, mp) {
    let queue = [];
    let numOfRows = mp.length;
    let numOfColumns = mp[0].length;

    if (
      poped.x - 1 >= 0 &&
      poped.x - 1 < numOfRows &&
      mp[poped.y][poped.x - 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION.LEFT);
      queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
    }
    if (
      poped.x + 1 >= 0 &&
      poped.x + 1 < numOfRows &&
      mp[poped.y][poped.x + 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION.RIGHT);
      queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
    }
    if (
      poped.y - 1 >= 0 &&
      poped.y - 1 < numOfColumns &&
      mp[poped.y - 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION.UP);
      queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
    }
    if (
      poped.y + 1 >= 0 &&
      poped.y + 1 < numOfColumns &&
      mp[poped.y + 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION.BOTTOM);
      queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
    }
    
    return queue;
  }

  calculateNewDirection(matriz, destX, destY) {
    let mp = [];
    for (let i = 0; i < matriz.length; i++) {
      mp[i] = matriz[i].slice();
    }

    let queue = [
      {
        x: this.getMapX(),
        y: this.getMapY(),
        rightX: this.get_X_MapRightSide(),
        rightY: this.get_Y_MapRightSide(),
        moves: []
      }
    ];

    while (queue.length > 0) {
      let poped = queue.shift();
      if (poped.x === destX && poped.y === destY) {
        return poped.moves[0];
      } else {
        mp[poped.y][poped.x] = 1;
        let neighborList = this.addNeighbors(poped, mp);
        for (let i = 0; i < neighborList.length; i++) {
          queue.push(neighborList[i]);
        }
      }
    }

    return 1; // direction right
  }

  changeAnimation() {
    if (this.aspect === 'normal') return;
    this.currentFrame =
      this.currentFrame === this.countFrame ? 1 : this.currentFrame + 1;
  }

  moveGhost() {
    if (this.aspect === 'blue') {
      this.target = this.initialPositionTarget;

      if (
        this.getMapX() == pacman.getMapX() &&
        this.getMapY() == pacman.getMapY()
      ) {
        this.changeAspect('eyes');
      }
    } else if (this.aspect === 'eyes') {
      this.target = this.initialPositionTarget;
    } else if (this.isInRange()) {
      this.target = pacman;
    } else {
      this.target = randomTargetsForGhosts[this.randomTargetIndex];
    }
    this.changeDirectionIfPossible();
    this.moveForwards();
    if (this.checkCollision()) {
      this.moveBackwards();
      return;
    }
  }

  changeAspect(newAspect) {
    this.aspect = newAspect;
  }

  getAspectOfGhost() {
    return this.aspect;
  }

  draw() {
    //normal
    let sprite = this.sprite;
    let imageX = this.imageX;
    let imageY = this.imageY;
    let imageWidth = this.imageWidth;
    let imageHeight = this.imageHeight;
    let pintadoWidth = this.width;
    let pintadoHeigth = this.height;

    if (this.aspect === 'normal') {
      ghostToBlue.volume = 0;
      ghostAudio.volume = 1;
      if (this.aspectInterval) {
        clearInterval(this.aspectInterval);
        this.aspectInterval = null;
      }
    }

    if (this.aspect === 'blue' || this.aspect === 'eyes') {
      ghostToBlue.volume = 1;
      ghostAudio.volume = 0;
      imageX = (this.currentFrame - 1) * 32;
      imageY = 0;
      imageWidth = 32;
      imageHeight = 32;
      pintadoWidth = oneBlockSize;
      pintadoHeigth = oneBlockSize;
      if (!this.aspectInterval) {
        this.aspectInterval = setInterval(() => this.changeAnimation(), 75);
      }
    }

    if (this.aspect === 'blue') {
      sprite = this.ghostBlue;
      if (!this.aspectTimeOut) {
        this.aspectTimeOut = setTimeout(() => {
          changeAspectOfGhosts('normal');
          clearTimeout(this.aspectTimeOut);
          this.aspectTimeOut = null;
        }, 4000);
      }
    } else if (this.aspect === 'eyes') {
      sprite = this.ghostEyes;
    }

    ctx.save();
    ctx.drawImage(
      sprite,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
      this.x,
      this.y,
      pintadoWidth,
      pintadoHeigth
    );
    ctx.restore();
  }

  changeDirectionIfPossible() {
    let tempDirection = this.direction;
    this.direction = this.calculateNewDirection(
      matriz,
      parseInt(this.target.x / oneBlockSize),
      parseInt(this.target.y / oneBlockSize)
    );
    if (typeof this.direction == 'undefined') {
      this.direction = tempDirection;
      return;
    }
    if (
      this.getMapY() != this.get_Y_MapRightSide() &&
      (this.direction === DIRECTION.LEFT || this.direction === DIRECTION.RIGHT)
    ) {
      this.direction = DIRECTION.UP;
    }
    if (
      this.getMapX() != this.get_X_MapRightSide() &&
      this.direction === DIRECTION.UP
    ) {
      this.direction = DIRECTION.LEFT;
    }
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

  checkCollision() {
    let A = matriz[this.getMapY()][this.getMapX()] === TYPE.WALL;
    let B = matriz[this.getMapY()][this.get_X_MapRightSide()] === TYPE.WALL;
    let C = matriz[this.get_Y_MapRightSide()][this.getMapX()] === TYPE.WALL;
    let D =
      matriz[this.get_Y_MapRightSide()][this.get_X_MapRightSide()] === TYPE.WALL;

    return A || B || C || D;
  }

  isInRange() {
    let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
    let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
    if (Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range) {
      return true;
    }
    return false;
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
