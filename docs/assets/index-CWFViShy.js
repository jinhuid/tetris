var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const $ = (selector) => {
  return document.querySelector(selector);
};
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
const container = $(".game");
const { width, height } = container.getBoundingClientRect();
const gameParam = {
  column: 10,
  row: 20,
  FPS: null,
  speed: 2,
  keySpeed: 10,
  score: 0,
  devicePixelRatio: window.devicePixelRatio,
  // 给方块计算出整数值宽高，不然小数情况可能会出现方块间的间隙
  get brickWidth() {
    return Math.round(width * this.devicePixelRatio / this.column);
  },
  get brickHeight() {
    return Math.round(height * this.devicePixelRatio / this.row);
  },
  // 以方块的整数值加上行列算出整个画布的宽高
  get windowWidth() {
    return this.brickWidth * this.column;
  },
  get windowHeight() {
    return this.brickHeight * this.row;
  }
};
const drawStyle = (ctx, { x, y, width: width2, height: height2, color }) => {
  const radius = height2 / 10 * gameParam.devicePixelRatio;
  const borderWidth = height2 / 25 * gameParam.devicePixelRatio;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width2 - radius, y);
  ctx.arcTo(x + width2, y, x + width2, y + radius, radius);
  ctx.lineTo(x + width2, y + height2 - radius);
  ctx.arcTo(x + width2, y + height2, x + width2 - radius, y + height2, radius);
  ctx.lineTo(x + radius, y + height2);
  ctx.arcTo(x, y + height2, x, y + height2 - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.fill();
  const borderX = x + borderWidth / 2;
  const borderY = y + borderWidth / 2;
  const borderWidthAdjusted = width2 - borderWidth;
  const borderHeightAdjusted = height2 - borderWidth;
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
const drawBrickPiece = (ctx, { x, y, width: width2, height: height2, color }) => {
  if (color in cache) {
    ctx.drawImage(
      offsetCanvas,
      0,
      height2 * cache[color],
      width2,
      height2,
      x,
      y,
      width2,
      height2
    );
    return;
  }
  drawStyle(offsetCtx, {
    x: 0,
    y: index * height2,
    width: width2,
    height: height2,
    color
  });
  cache[color] = index++;
  ctx.drawImage(
    offsetCanvas,
    0,
    height2 * cache[color],
    width2,
    height2,
    x,
    y,
    width2,
    height2
  );
};
const drawBrick = (ctx, { x, y, width: width2, height: height2, color, structure }) => {
  for (let i = 0; i < structure.length; i++) {
    for (let j = 0; j < structure[i].length; j++) {
      if (structure[i][j] == "0")
        continue;
      drawBrickPiece(ctx, {
        x: (x + j) * width2,
        y: (y + i) * height2,
        width: width2,
        height: height2,
        color
      });
    }
  }
};
const drawBg = function(ctx, colors, brickWidth = gameParam.brickWidth, brickHeight = gameParam.brickHeight) {
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
};
const canvas = $(".canvas.brick");
const bgCanvas = $(".canvas.bg");
canvas.height = bgCanvas.height = gameParam.windowHeight;
canvas.width = bgCanvas.width = gameParam.windowWidth;
const _CanvasWithMapCtx = class _CanvasWithMapCtx {
  constructor() {
    __publicField(this, "ctx");
    __publicField(this, "bgCtx");
    __publicField(this, "mapBinary");
    __publicField(this, "bg");
    this.ctx = _CanvasWithMapCtx.ctx;
    this.bgCtx = _CanvasWithMapCtx.bgCtx;
    this.mapBinary = new Array(gameParam.row).fill(0);
    this.bg = Array.from(
      { length: gameParam.row },
      () => Array.from({ length: gameParam.column })
    );
  }
  cleanUpCanvas() {
    this.clearCanvas(this.ctx);
    this.clearCanvas(this.bgCtx);
  }
  clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
};
__publicField(_CanvasWithMapCtx, "ctx", canvas.getContext("2d"));
__publicField(_CanvasWithMapCtx, "bgCtx", bgCanvas.getContext("2d"));
let CanvasWithMapCtx = _CanvasWithMapCtx;
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
class Brick {
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
    this.width = gameParam.brickWidth;
    this.height = gameParam.brickHeight;
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
  downBottom(mapBinary) {
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
}
class GameHelper {
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
  eliminate(mapBinary, bg) {
    let count = 0;
    for (let i = gameParam.row - 1; i >= 0; i--) {
      if (mapBinary[i] === 2 ** gameParam.column - 1) {
        count++;
        mapBinary.splice(i, 1);
        mapBinary.unshift(0);
        bg.splice(i, 1);
        bg.unshift(Array.from({ length: gameParam.column }));
        i++;
      }
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
const SingleGameHelper = SinglePattern(GameHelper);
const gameHelper = new SingleGameHelper();
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
    bottom: "downBottom",
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
const userActions = function(pause, operation) {
  if (activeKey === null)
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
  downBottom() {
    const shouldNextOne = this.brick.downBottom(this.canvasWithMapCtx.mapBinary);
    if (shouldNextOne) {
      this.brick.isRecycle = true;
    }
  }
  rotate() {
    this.brick.rotate(this.canvasWithMapCtx.mapBinary);
  }
  pauseGame() {
    if (this.renderer.pause) {
      this.Player.playGame();
    } else {
      this.Player.pauseGame();
    }
  }
}
class Scorer {
  constructor() {
    __publicField(this, "_score", 0);
    __publicField(this, "_eliminateNum", 0);
  }
  get score() {
    return this._score;
  }
  get eliminateNum() {
    return this._eliminateNum;
  }
  scoreIncrease(v) {
    this._score += v;
  }
  eliminateNumIncrease(v) {
    this._eliminateNum += v;
  }
  reset() {
    this._score = 0;
    this._eliminateNum = 0;
  }
}
const SingleScorer = SinglePattern(Scorer);
const scorer = new SingleScorer();
class EventEmitter {
  constructor() {
    __publicField(this, "events", {});
  }
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  emit(event, ...args) {
    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
  }
  off(event, listener) {
    const listeners = this.events[event];
    if (listeners) {
      this.events[event] = listeners.filter((l) => l !== listener);
    }
  }
  clearAllListeners() {
    this.events = {};
  }
}
const SingleEventEmitter = SinglePattern(EventEmitter);
const eventEmitter = new SingleEventEmitter();
class Renderer {
  constructor(canvasWithMapCtx) {
    __publicField(this, "canvasWithMapCtx");
    __publicField(this, "operation");
    __publicField(this, "scorer");
    __publicField(this, "eventEmitter");
    __publicField(this, "gameHelper");
    __publicField(this, "brick");
    __publicField(this, "nextBrick");
    __publicField(this, "lastTime", 0);
    __publicField(this, "pauseTime", 0);
    __publicField(this, "_over", false);
    __publicField(this, "_pause", false);
    this.canvasWithMapCtx = canvasWithMapCtx;
    this.scorer = scorer;
    this.eventEmitter = eventEmitter;
    this.gameHelper = gameHelper;
    this.brick = new Brick(this.gameHelper.getRandomLetter());
    this.nextBrick = new Brick(this.gameHelper.getRandomLetter());
    this.operation = new Operation(this, this.canvasWithMapCtx, this.brick, {
      playGame: this.playGame.bind(this),
      pauseGame: this.pauseGame.bind(this)
    });
  }
  get over() {
    return this._over;
  }
  get pause() {
    return this._pause;
  }
  render(time) {
    this.userActions();
    if (this._pause) {
      this.cachePauseTime(time);
      return;
    }
    this.clearCanvas(this.canvasWithMapCtx.ctx);
    this.lastTime = time;
    this.draw();
    this.update(time - this.pauseTime);
    this.canNextOne(time - this.pauseTime);
  }
  clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  draw() {
    this.operation.brick.draw(this.canvasWithMapCtx.ctx);
  }
  update(time) {
    const shouldNextOne = this.operation.brick.update(
      time,
      this.canvasWithMapCtx.mapBinary
    );
    if (shouldNextOne) {
      this.operation.brick.isRecycle = true;
    }
  }
  canNextOne(time) {
    if (this.operation.brick.isRecycle) {
      this.newNextOne(time);
    }
  }
  newNextOne(time) {
    const isSuccess = this.gameHelper.record(
      this.canvasWithMapCtx.mapBinary,
      this.canvasWithMapCtx.bg,
      this.brick
    );
    if (!isSuccess) {
      this._over = true;
      return;
    }
    const row = this.gameHelper.eliminate(
      this.canvasWithMapCtx.mapBinary,
      this.canvasWithMapCtx.bg
    );
    const score = this.gameHelper.computeScore(row);
    this.scorer.scoreIncrease(score);
    this.scorer.eliminateNumIncrease(row);
    this.eventEmitter.emit("updateScore", this.scorer.score);
    this.eventEmitter.emit("updateEliminate", this.scorer.eliminateNum);
    drawBg(this.canvasWithMapCtx.bgCtx, this.canvasWithMapCtx.bg);
    this.brick = this.nextBrick;
    this.nextBrick = new Brick(this.gameHelper.getRandomLetter(), time);
    this.eventEmitter.emit("updateNextBrick", this.nextBrick);
    this.brick.correctLastTime(time);
    this.operation.takeTurns(this.brick);
  }
  cachePauseTime(time) {
    this.pauseTime += time - this.lastTime;
    this.lastTime = time;
  }
  playGame() {
    this._pause = false;
  }
  pauseGame() {
    this._pause = true;
  }
  userActions() {
    userActions(this._pause, this.operation);
  }
}
class Game {
  constructor() {
    __publicField(this, "canvasWithMapCtx");
    __publicField(this, "renderer");
    __publicField(this, "Scorer");
    __publicField(this, "startWithEnd");
    this.canvasWithMapCtx = new CanvasWithMapCtx();
    this.Scorer = scorer;
    this.renderer = new Renderer(this.canvasWithMapCtx);
    this.startWithEnd = customRaf((time = performance.now()) => {
      this.renderer.render(time);
    }, gameParam.FPS);
  }
  get score() {
    return this.Scorer.score;
  }
  get over() {
    return this.renderer.over;
  }
  get pause() {
    return this.renderer.pause;
  }
  startGame() {
    this.startWithEnd[0]();
  }
  cancelGame() {
    this.startWithEnd[1]();
  }
  restartGame() {
    this.canvasWithMapCtx.cleanUpCanvas();
    this.canvasWithMapCtx = new CanvasWithMapCtx();
    this.renderer = new Renderer(this.canvasWithMapCtx);
  }
  playGame() {
    this.renderer.playGame();
  }
  pauseGame() {
    this.renderer.pauseGame();
  }
}
class Ui {
  constructor() {
    __publicField(this, "game");
    __publicField(this, "dom");
    __publicField(this, "eventEmitter");
    __publicField(this, "scorer");
    this.game = new Game();
    this.eventEmitter = eventEmitter;
    this.scorer = scorer;
    this.dom = {
      brickCanvas: $(".brick"),
      bgCanvas: $(".bg"),
      nextBrickCanvas: $(".next_brick"),
      start: $(".start"),
      // Cast the result to HTMLElement
      pause: $(".pause"),
      regame: $(".regame"),
      restart: $(".restart"),
      score: $(".score>span"),
      eliminate: $(".eliminate>span")
    };
    this.dom.nextBrickCanvas.width = gameParam.brickWidth * 4;
    this.dom.nextBrickCanvas.height = gameParam.brickHeight * 4;
    this.init();
    this.addEvent();
  }
  init() {
    this.eventEmitter.clearAllListeners();
    this.eventEmitter.on("updateScore", () => {
      this.dom.score.innerText = this.scorer.score + "";
    });
    this.eventEmitter.on("updateEliminate", () => {
      this.dom.eliminate.innerText = this.scorer.eliminateNum + "";
    });
    this.eventEmitter.on("updateNextBrick", (brick) => {
      this.dom.nextBrickCanvas.getContext("2d").clearRect(0, 0, this.dom.nextBrickCanvas.width, this.dom.nextBrickCanvas.height);
      drawBrick(this.dom.nextBrickCanvas.getContext("2d"), {
        ...brick,
        x: 0,
        y: 0
      });
    });
  }
  addEvent() {
    this.dom.start.addEventListener("click", () => {
      this.game.startGame();
      this.dom.start.style.display = "none";
      this.dom.pause.style.display = "block";
    });
    this.dom.pause.addEventListener("click", () => {
      if (this.game.pause) {
        this.game.playGame();
        this.dom.pause.innerText = "暂停";
      } else {
        this.game.pauseGame();
        this.dom.pause.innerText = "继续";
      }
    });
    this.dom.regame.addEventListener("click", () => {
      this.scorer.reset();
      this.eventEmitter.emit("updateScore", this.scorer.score);
      this.game.restartGame();
      this.init();
    });
  }
}
new Ui();
