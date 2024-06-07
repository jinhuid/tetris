var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { gameParam } from "./gameConfig-BX5BlB8T.js";
import CanvasWithMapCtx from "./CanvasWithMapCtx-Db4Zc8U1.js";
import { s as shallowReactive } from "./index-CX8mas6B.js";
const drawStyle = (ctx, { x, y, width, height, color }) => {
  const radius = height / 10 * gameParam.devicePixelRatio;
  const borderWidth = height / 25 * gameParam.devicePixelRatio;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.fill();
  const borderX = x + borderWidth / 2;
  const borderY = y + borderWidth / 2;
  const borderWidthAdjusted = width - borderWidth;
  const borderHeightAdjusted = height - borderWidth;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  ctx.moveTo(borderX + radius, borderY);
  ctx.lineTo(borderX + borderWidthAdjusted - radius, borderY);
  ctx.arcTo(
    borderX + borderWidthAdjusted,
    borderY,
    borderX + borderWidthAdjusted,
    borderY + radius,
    radius
  );
  ctx.lineTo(
    borderX + borderWidthAdjusted,
    borderY + borderHeightAdjusted - radius
  );
  ctx.arcTo(
    borderX + borderWidthAdjusted,
    borderY + borderHeightAdjusted,
    borderX + borderWidthAdjusted - radius,
    borderY + borderHeightAdjusted,
    radius
  );
  ctx.lineTo(borderX + radius, borderY + borderHeightAdjusted);
  ctx.arcTo(
    borderX,
    borderY + borderHeightAdjusted,
    borderX,
    borderY + borderHeightAdjusted - radius,
    radius
  );
  ctx.lineTo(borderX, borderY + radius);
  ctx.arcTo(borderX, borderY, borderX + radius, borderY, radius);
  ctx.stroke();
  ctx.closePath();
};
const offsetCanvas = document.createElement("canvas");
const offsetCtx = offsetCanvas.getContext("2d");
offsetCanvas.height = gameParam.brickHeight * 20;
offsetCanvas.width = gameParam.brickWidth;
let index = 0;
const cache = {};
const drawBrickPiece = (ctx, { x, y, width, height, color }) => {
  if (color in cache) {
    ctx.drawImage(
      offsetCanvas,
      0,
      height * cache[color],
      width,
      height,
      x,
      y,
      width,
      height
    );
    return;
  }
  drawStyle(offsetCtx, {
    x: 0,
    y: index * height,
    width,
    height,
    color
  });
  cache[color] = index++;
  ctx.drawImage(
    offsetCanvas,
    0,
    height * cache[color],
    width,
    height,
    x,
    y,
    width,
    height
  );
};
const drawBrick = (ctx, { x, y, width, height, color, structure }) => {
  for (let i = 0; i < structure.length; i++) {
    for (let j = 0; j < structure[i].length; j++) {
      if (structure[i][j] == "0")
        continue;
      drawBrickPiece(ctx, {
        x: (x + j) * width,
        y: (y + i) * height,
        width,
        height,
        color
      });
    }
  }
};
const bricks = {
  o: {
    color: "#FADADD",
    struct: [
      "11",
      "11"
    ]
  },
  i: {
    color: "#F7E9D4",
    struct: [
      "0000",
      "1111",
      "0000",
      "0000"
    ]
  },
  s: {
    color: "#C8E6C9",
    struct: [
      "011",
      "110",
      "000"
    ]
  },
  z: {
    color: "#B3E5FC",
    struct: [
      "110",
      "011",
      "000"
    ]
  },
  l: {
    color: "#FFCC80",
    struct: [
      "001",
      "111",
      "000"
    ]
  },
  j: {
    color: "#FFEE58",
    struct: [
      "100",
      "111",
      "000"
    ]
  },
  t: {
    color: "#CE93D8",
    struct: [
      "000",
      "111",
      "010"
    ]
  },
  ".": {
    color: "green",
    struct: ["1"]
  }
};
const getY = (structure) => {
  const index2 = structure.findLastIndex((s) => +s !== 0);
  if (index2 === -1)
    return -structure.length;
  return -index2 - 1;
};
const _Brick = class _Brick {
  constructor(letter, lastTime2 = performance.now()) {
    __publicField(this, "color");
    __publicField(this, "width");
    __publicField(this, "height");
    __publicField(this, "structure");
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "isRecycle", false);
    this.letter = letter;
    this.lastTime = lastTime2;
    this.color = bricks[this.letter].color;
    this.width = _Brick.width;
    this.height = _Brick.height;
    this.structure = bricks[this.letter].struct;
    this.x = gameParam.column / 2 - 1;
    this.y = getY(this.structure);
  }
  draw(ctx) {
    drawBrick(ctx, this);
  }
  /**
   * @param time 每帧调用时间戳
   * @param canDown 能不能继续下落
   * @returns 是否无法继续下落
   */
  update(time, mapBinary) {
    if (time - this.lastTime >= 1e3 / gameParam.speed) {
      this.lastTime = time - (time - this.lastTime) % (1e3 / gameParam.speed);
      if (!this.isOverlap(mapBinary, this.getBinary(), this.x, this.y + 1)) {
        this.y++;
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  left(mapBinary) {
    if (this.isAtBorder("left"))
      return;
    if (!this.isOverlap(mapBinary, this.getBinary(), this.x - 1)) {
      this.x--;
    }
  }
  right(mapBinary) {
    if (this.isAtBorder("right"))
      return;
    if (!this.isOverlap(mapBinary, this.getBinary(), this.x + 1)) {
      this.x++;
    }
  }
  /**
   *
   * @param mapBinary 已记录方块的二进制数据
   * @returns 是否无法继续下落
   */
  downOne(mapBinary) {
    if (!this.isOverlap(mapBinary, this.getBinary(), this.x, this.y + 1)) {
      this.y++;
      return false;
    }
    return true;
  }
  downToBottom(mapBinary) {
    while (!this.isOverlap(mapBinary, this.getBinary(), this.x, this.y + 1)) {
      this.y++;
    }
    return true;
  }
  rotate(mapBinary) {
    const len = this.structure[0].length;
    let newStructure = Array.from(
      { length: len },
      () => new Array(len)
    );
    for (let i = 0; i < this.structure.length; i++) {
      for (let j = 0; j < this.structure[i].length; j++) {
        let x = i, y = len - 1 - j;
        if (this.structure[i][j] === "1" && (x + this.x >= gameParam.column || x + this.x < 0 || y + this.y >= gameParam.row))
          return;
        newStructure[y][x] = this.structure[i][j];
      }
    }
    newStructure = newStructure.map(
      (s) => s.join("")
    );
    const newBinary = this.getBinary(newStructure);
    if (this.isOverlap(mapBinary, newBinary))
      return;
    this.structure = newStructure;
  }
  getBinary(structure = this.structure, x = this.x) {
    const binary = [];
    const len = structure[0].length;
    const carry = gameParam.column - x - len;
    for (let i = len - 1; i >= 0; i--) {
      let r;
      if (carry >= 0) {
        r = parseInt(structure[i], 2) << carry;
      } else {
        r = parseInt(structure[i], 2) >> -carry;
      }
      binary.unshift(r);
    }
    return binary;
  }
  correctLastTime(time) {
    this.lastTime = time;
  }
  /**
   *
   * @param mapBinary 已记录方块的二进制数据
   * @param binary 方块二进制数据
   * @param x 第几行
   * @param y 第几列
   * @returns 是不是有方块重叠
   */
  isOverlap(mapBinary, binary = this.getBinary(), x = this.x, y = this.y) {
    if (x - this.x !== 0) {
      const shift = x - this.x;
      if (shift > 0) {
        binary = binary.map((b) => b >> shift);
      } else {
        binary = binary.map((b) => b << -shift);
      }
    }
    for (let i = binary.length - 1; i >= 0; i--) {
      if (y + i < 0)
        continue;
      if (binary[i] & (mapBinary[y + i] ?? 2 ** gameParam.column - 1)) {
        return true;
      }
    }
    return false;
  }
  /**
   *
   * @param direction 方向
   * @returns 是否在左或右边无法移动
   */
  isAtBorder(direction) {
    const binary = this.getBinary();
    const maxBorderBinaryValue = { left: 2 ** (gameParam.column - 1), right: 1 };
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] & maxBorderBinaryValue[direction]) {
        return true;
      }
    }
    return false;
  }
};
__publicField(_Brick, "height", gameParam.brickHeight);
__publicField(_Brick, "width", gameParam.brickWidth);
let Brick = _Brick;
const customRaf = (fn, fps) => {
  if (!!fps) {
    if (!Number.isInteger(fps) || fps <= 0) {
      throw new TypeError("fps 应该是一个正整数");
    }
  }
  let timer;
  function raf(...args) {
    const run = (() => {
      if (fps) {
        const interval = 1e3 / fps;
        let lastTime2 = 0;
        return (timeStamp) => {
          const deltaTime = timeStamp - lastTime2;
          if (deltaTime >= interval) {
            fn.apply(this, [timeStamp, ...args]);
            lastTime2 = timeStamp - deltaTime % interval;
          }
        };
      }
      return (timeStamp) => {
        fn.apply(this, [timeStamp, ...args]);
      };
    })();
    const update = (timeStamp) => {
      timer = requestAnimationFrame(update);
      run(timeStamp);
    };
    cancel();
    update(0);
  }
  function cancel() {
    cancelAnimationFrame(timer);
  }
  return [raf, cancel];
};
function SinglePattern(Ctor) {
  let instance;
  const p = new Proxy(Ctor, {
    construct(target, args) {
      if (!instance) {
        instance = Reflect.construct(target, args);
      }
      return instance;
    }
  });
  Ctor.prototype.constructor = p;
  return p;
}
class Helper {
  constructor() {
    __publicField(this, "eliminateTarget", 2 ** gameParam.column - 1);
  }
  getRandomLetter() {
    const letters = Object.keys(bricks);
    return letters[Math.random() * letters.length >> 0];
  }
  /**
   * @dec 记录方块的落点位置 以及它的颜色
   * @returns 是否成功记录 如果失败就是游戏结束
   */
  record(mapBinary, bg, brick) {
    if (this.isGameOver(brick)) {
      return false;
    }
    const binary = brick.getBinary();
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] === 0)
        continue;
      mapBinary[brick.y + i] |= binary[i];
      for (let j = gameParam.column - 1, r = binary[i]; r !== 0; j--, r >>= 1) {
        if (r & 1) {
          bg[brick.y + i][j] = brick.color;
        }
      }
    }
    return true;
  }
  /**
   * 消除行和颜色
   */
  eliminate(mapBinary, bg, from, to) {
    let count = 0;
    while (from < to) {
      if (mapBinary[from] === this.eliminateTarget) {
        mapBinary.splice(from, 1);
        mapBinary.unshift(0);
        bg.splice(from, 1);
        bg.unshift(new Array(bg[0].length));
        count++;
        continue;
      }
      from++;
    }
    return count;
  }
  isGameOver(brick) {
    const len = brick.structure.length;
    for (let i = 0; i < len; i++) {
      if (brick.y + i < 0)
        return true;
    }
    return false;
  }
  drawBg(ctx, colors, brickWidth, brickHeight) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < colors[i].length; j++) {
        if (colors[i][j] === void 0)
          continue;
        drawBrickPiece(ctx, {
          x: j * brickWidth,
          y: i * brickHeight,
          width: brickWidth,
          height: brickHeight,
          color: colors[i][j]
        });
      }
    }
  }
  drawNextBrick(ctx, brick) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawBrick(ctx, { ...brick, x: 0, y: 0 });
  }
  computeScore(row) {
    switch (row) {
      case 0:
        return 20;
      case 1:
        return 120;
      case 2:
        return 320;
      case 3:
        return 720;
      case 4:
        return 1520;
      default:
        return 20;
    }
  }
}
const SingleGameHelper = SinglePattern(Helper);
const gameHelper = new SingleGameHelper();
class State {
  constructor() {
    __publicField(this, "_nextBrick");
    __publicField(this, "_over");
    __publicField(this, "_pause");
    __publicField(this, "_score");
    __publicField(this, "_eliminateNum");
    __publicField(this, "_playing");
    this.initState();
  }
  initState() {
    this._nextBrick = null;
    this._over = false;
    this._pause = false;
    this._score = 0;
    this._eliminateNum = 0;
    this._playing = false;
  }
  get nextBrick() {
    return this._nextBrick;
  }
  get over() {
    return this._over;
  }
  get pause() {
    return this._pause;
  }
  get score() {
    return this._score;
  }
  get eliminateNum() {
    return this._eliminateNum;
  }
  get playing() {
    return this._playing;
  }
  setNextBrick(brick, renderer) {
    this._nextBrick = brick;
    if (brick) {
      gameHelper.drawNextBrick(renderer.canvasWithMapCtx.nextBrickCtx, brick);
    }
  }
  setOver() {
    this.setPlaying(false);
    this._over = true;
  }
  setPause(pause) {
    this._pause = pause;
  }
  setScore(score) {
    this._score = score;
  }
  setPlaying(playing) {
    this._playing = playing;
  }
  setEliminateNum(num) {
    this._eliminateNum = num;
  }
}
const SingleGameState = SinglePattern(State);
const gameState = shallowReactive(new SingleGameState());
const gameState$1 = gameState;
const control = {
  operate: {
    left: ["a", "ArrowLeft"],
    right: ["d", "ArrowRight"],
    up: ["w", "ArrowUp"],
    down: ["s", "ArrowDown"],
    bottom: [" "]
  },
  onceKey: ["up", "bottom"],
  speedUpKey: ["down"],
  speedUpRate: 2,
  pause: ["Enter", "p"]
};
const isKeyPressed = {
  left: false,
  right: false,
  up: false,
  down: false,
  bottom: false
};
let activeKey = null;
window.onkeydown = (e) => {
  switch (true) {
    case control.pause.some((item) => item === e.key):
      activeKey = e.key;
      break;
    case Object.values(control.operate).flat(1).some((item) => item === e.key):
      activeKey = e.key;
  }
};
window.onkeyup = (e) => {
  switch (true) {
    case activeKey === e.key:
      activeKey = null;
    default:
      let ctrlKey;
      if (ctrlKey = findCtrlKey(e.key)) {
        isKeyPressed[ctrlKey] = false;
      }
  }
};
function findCtrlKey(activeKey2) {
  if (control.pause.some((item) => item === activeKey2)) {
    return "pause";
  }
  for (const [key, value] of Object.entries(control.operate)) {
    if (value.some((item) => item === activeKey2)) {
      return key;
    }
  }
}
const getBrickDownInterval = (ctrlKey) => {
  let interval = 1e3 / gameParam.keySpeed;
  if (control.speedUpKey.some((item) => item === ctrlKey)) {
    interval = 1e3 / control.speedUpRate / gameParam.keySpeed;
  }
  return interval;
};
const getHandle = /* @__PURE__ */ function() {
  const direction = {
    left: "left",
    right: "right",
    down: "downOne",
    bottom: "downToBottom",
    up: "rotate"
  };
  return (operation, ctrlKey) => {
    if (control.onceKey.some((item) => item === ctrlKey) && isKeyPressed[ctrlKey])
      return null;
    return operation[direction[ctrlKey]].bind(operation);
  };
}();
const isPauseKey = (activeKey2) => {
  return control.pause.some((item) => item === activeKey2);
};
let lastTime = 0;
const userActions = function(pause, over, operation) {
  if (activeKey === null)
    return;
  if (over)
    return;
  if (isPauseKey(activeKey)) {
    operation.pauseGame();
    activeKey = null;
    return;
  }
  if (pause)
    return;
  let now = Date.now();
  const ctrlKey = findCtrlKey(activeKey);
  if (!isKeyPressed[ctrlKey]) {
    lastTime = now;
    let handle = getHandle(operation, ctrlKey);
    handle == null ? void 0 : handle();
    isKeyPressed[ctrlKey] = true;
    return;
  }
  let interval = getBrickDownInterval(ctrlKey);
  if (now - lastTime >= interval) {
    lastTime = now - (now - lastTime) % interval;
    let handle = getHandle(operation, ctrlKey);
    handle == null ? void 0 : handle();
  }
};
class Operation {
  constructor(renderer, canvasWithMapCtx, brick, Player) {
    this.renderer = renderer;
    this.canvasWithMapCtx = canvasWithMapCtx;
    this.brick = brick;
    this.Player = Player;
  }
  takeTurns(brick) {
    this.brick = brick;
  }
  left() {
    this.brick.left(this.canvasWithMapCtx.mapBinary);
  }
  right() {
    this.brick.right(this.canvasWithMapCtx.mapBinary);
  }
  downOne() {
    const shouldNextOne = this.brick.downOne(this.canvasWithMapCtx.mapBinary);
    if (shouldNextOne) {
      this.brick.isRecycle = true;
    }
  }
  downToBottom() {
    const shouldNextOne = this.brick.downToBottom(this.canvasWithMapCtx.mapBinary);
    if (shouldNextOne) {
      this.brick.isRecycle = true;
    }
  }
  rotate() {
    this.brick.rotate(this.canvasWithMapCtx.mapBinary);
  }
  pauseGame() {
    if (this.renderer.gameState.pause) {
      this.Player.playGame();
    } else {
      this.Player.pauseGame();
    }
  }
}
class Renderer {
  constructor() {
    __publicField(this, "_canvasWithMapCtx");
    __publicField(this, "operation");
    __publicField(this, "gameHelper");
    __publicField(this, "lastTime", 0);
    __publicField(this, "pauseTime", 0);
    __publicField(this, "_gameState");
    __publicField(this, "_brick");
    __publicField(this, "_nextBrick");
    __publicField(this, "over", false);
    __publicField(this, "pause", false);
    this._canvasWithMapCtx = new CanvasWithMapCtx();
    this.gameHelper = gameHelper;
    this._gameState = gameState$1;
    this._brick = new Brick(this.gameHelper.getRandomLetter());
    this._nextBrick = new Brick(this.gameHelper.getRandomLetter());
    this.operation = new Operation(this, this._canvasWithMapCtx, this.brick, {
      playGame: this.playGame.bind(this),
      pauseGame: this.pauseGame.bind(this),
      togglePause: this.togglePause.bind(this)
    });
  }
  get canvasWithMapCtx() {
    return this._canvasWithMapCtx;
  }
  get gameState() {
    return this._gameState;
  }
  get brick() {
    return this._brick;
  }
  get nextBrick() {
    return this._nextBrick;
  }
  render(time) {
    this.userActions();
    if (this.pause) {
      this.cachePauseTime(time);
      return;
    }
    if (this.over) {
      return;
    }
    this.clearCanvas(this._canvasWithMapCtx.brickCtx);
    this.lastTime = time;
    this.draw();
    this.update(time - this.pauseTime);
    this.checkBrickState(time - this.pauseTime);
  }
  clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  draw() {
    this.operation.brick.draw(this._canvasWithMapCtx.brickCtx);
  }
  update(time) {
    const shouldNextOne = this.operation.brick.update(
      time,
      this._canvasWithMapCtx.mapBinary
    );
    if (shouldNextOne) {
      this.operation.brick.isRecycle = true;
    }
  }
  checkBrickState(time) {
    if (this.operation.brick.isRecycle) {
      this.replaceNextOne(time);
    }
  }
  /**
   * @dec 先检查是否能记录下来，然后消除行，计算得分，更新游戏状态,最后替换下一个方块
   */
  replaceNextOne(time) {
    const isSuccess = this.gameHelper.record(
      this._canvasWithMapCtx.mapBinary,
      this._canvasWithMapCtx.bg,
      this.brick
    );
    if (!isSuccess) {
      this.over = true;
      this.gameState.setOver();
      return;
    }
    const eliminateNum = this.gameHelper.eliminate(
      this._canvasWithMapCtx.mapBinary,
      this._canvasWithMapCtx.bg,
      this.brick.y,
      Math.min(
        this.brick.y + this.brick.structure.length,
        this._canvasWithMapCtx.mapBinary.length
      )
    );
    console.time("drawBg");
    this.gameHelper.drawBg(
      this._canvasWithMapCtx.bgCtx,
      this._canvasWithMapCtx.bg,
      Brick.width,
      Brick.height
    );
    console.timeEnd("drawBg");
    const score = this.gameHelper.computeScore(eliminateNum);
    this._brick = this.nextBrick;
    this._nextBrick = new Brick(this.gameHelper.getRandomLetter(), time);
    this.brick.correctLastTime(time);
    this.operation.takeTurns(this.brick);
    this.gameState.setNextBrick(this.nextBrick, this);
    this.gameState.setScore(score + this.gameState.score);
    this.gameState.setEliminateNum(eliminateNum + this.gameState.eliminateNum);
  }
  cachePauseTime(time) {
    this.pauseTime += time - this.lastTime;
    this.lastTime = time;
  }
  playGame() {
    this.gameState.setPause(false);
    this.pause = false;
  }
  pauseGame() {
    this.gameState.setPause(true);
    this.pause = true;
  }
  togglePause() {
    this.gameState.setPause(!this.gameState.pause);
    this.pause = !this.pause;
  }
  userActions() {
    userActions(this.pause, this.over, this.operation);
  }
}
class Game {
  constructor() {
    __publicField(this, "renderer");
    __publicField(this, "_state");
    __publicField(this, "startWithEnd");
    __publicField(this, "startRaf");
    __publicField(this, "cancelRaf");
    this.renderer = new Renderer();
    this._state = gameState$1;
    this.defineRaf(this.renderer);
  }
  get state() {
    return this._state;
  }
  defineRaf(renderer) {
    this.startWithEnd = customRaf((time = performance.now()) => {
      renderer.render(time);
    }, gameParam.FPS);
    this.startRaf = this.startWithEnd[0];
    this.cancelRaf = this.startWithEnd[1];
  }
  startGame() {
    this.startRaf();
    this.state.setPlaying(true);
    this.state.setNextBrick(this.renderer.nextBrick, this.renderer);
  }
  cancelGame() {
    this.cancelRaf();
  }
  restartGame() {
    this.cancelRaf();
    this.state.initState();
    this.renderer = new Renderer();
    this.defineRaf(this.renderer);
    this.startRaf();
    this.state.setPlaying(true);
    this.state.setNextBrick(this.renderer.nextBrick, this.renderer);
  }
  playGame() {
    this.renderer.playGame();
  }
  pauseGame() {
    this.renderer.pauseGame();
  }
  togglePause() {
    this.renderer.togglePause();
  }
}
export {
  Game as default
};
