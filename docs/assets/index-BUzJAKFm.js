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
const container = $("#container");
const { width, height } = container.getBoundingClientRect();
const gameParam = {
  column: 10,
  row: 20,
  FPS: 60,
  speed: 2,
  keySpeed: 10,
  score: 0,
  devicePixelRatio: window.devicePixelRatio,
  windowWidth: width * devicePixelRatio,
  windowHeight: height * devicePixelRatio,
  get brickWidth() {
    return this.windowWidth / this.column;
  },
  get brickHeight() {
    return this.windowHeight / this.row;
  }
};
console.log(gameParam);
const bricks = {
  o: {
    color: "#FADADD",
    struct: ["11", "11"]
  },
  i: {
    color: "#F7E9D4",
    struct: ["0000", "1111", "0000", "0000"]
  },
  s: {
    color: "#C8E6C9",
    struct: ["011", "110", "000"]
  },
  z: {
    color: "#B3E5FC",
    struct: ["110", "011", "000"]
  },
  l: {
    color: "#FFCC80",
    struct: ["001", "111", "000"]
  },
  j: {
    color: "#FFEE58",
    struct: ["100", "111", "000"]
  },
  t: {
    color: "#CE93D8",
    struct: ["000", "111", "010"]
  }
};
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
const drawBrick = (ctx, { x, y, width: width2, height: height2, color }) => {
  var radius = 8 * gameParam.devicePixelRatio;
  var borderWidth = 4 * gameParam.devicePixelRatio;
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
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = borderWidth;
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
  ctx.stroke();
  ctx.closePath();
};
const drawLetter = (ctx, { x, y, width: width2, height: height2, color, structure }) => {
  for (let i = 0; i < structure.length; i++) {
    for (let j = 0; j < structure[i].length; j++) {
      if (structure[i][j] == "0")
        continue;
      drawBrick(ctx, {
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
      drawBrick(ctx, {
        x: j * brickWidth,
        y: i * brickHeight,
        width: brickWidth,
        height: brickHeight,
        color: colors[i][j]
      });
    }
  }
};
const getRandomLetter = () => {
  const letters = Object.keys(bricks);
  return letters[Math.random() * letters.length >> 0];
};
const getY = (structure) => {
  const index = structure.findLastIndex((s) => +s !== 0);
  if (index === -1)
    return -structure.length;
  return -index - 1;
};
class Brick {
  constructor(time = performance.now()) {
    __publicField(this, "letter");
    __publicField(this, "lastTime");
    __publicField(this, "color");
    __publicField(this, "structure");
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "width", gameParam.brickWidth);
    __publicField(this, "height", gameParam.brickHeight);
    __publicField(this, "isRecycle", false);
    this.letter = getRandomLetter();
    this.color = bricks[this.letter].color;
    this.structure = bricks[this.letter].struct;
    this.x = gameParam.column / 2 - 1;
    this.y = getY(this.structure);
    this.lastTime = time;
  }
  draw(ctx) {
    drawLetter(ctx, this);
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
    if (this.inBorder("left"))
      return;
    if (!this.isOverlap(mapBinary, this.getBinary(), this.x - 1)) {
      this.x--;
    }
  }
  right(mapBinary) {
    if (this.inBorder("right"))
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
    for (let i = structure.length - 1; i >= 0; i--) {
      let r;
      let carry = gameParam.column - x - len;
      if (carry >= 0) {
        r = parseInt(structure[i], 2) << carry;
      } else {
        r = parseInt(structure[i], 2) >> -carry;
      }
      binary.unshift(r);
    }
    return binary;
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
  inBorder(direction) {
    let binary = this.getBinary();
    let settle = direction == "left" ? 2 ** (gameParam.column - 1) : 1;
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] & settle) {
        return true;
      }
    }
    return false;
  }
}
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
    case control.pause.some((item) => item === e.key): {
      activeKey = e.key;
      break;
    }
    case Object.values(control.operate).flat(1).some((item) => item === e.key): {
      activeKey = e.key;
    }
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
let lastTime = 0;
const isPauseKey = (activeKey2) => {
  return control.pause.some((item) => item === activeKey2);
};
const userAction = function(pause, operation) {
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
    handle && handle();
  }
};
class Operate {
  constructor(game2, mapBinary, brick) {
    this.game = game2;
    this.mapBinary = mapBinary;
    this.brick = brick;
  }
  left() {
    this.brick.left(this.mapBinary);
  }
  right() {
    this.brick.right(this.mapBinary);
  }
  downOne() {
    const shouldNextOne = this.brick.downOne(this.mapBinary);
    if (shouldNextOne) {
      this.brick.isRecycle = true;
    }
  }
  downBottom() {
    const shouldNextOne = this.brick.downBottom(this.mapBinary);
    if (shouldNextOne) {
      this.brick.isRecycle = true;
    }
  }
  rotate() {
    this.brick.rotate(this.mapBinary);
  }
  pauseGame() {
    this.game.pause = !this.game.pause;
  }
}
const record = (mapBinary, bg, brick) => {
  if (isGameOver(brick)) {
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
};
const eliminate = (mapBinary, bg) => {
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
};
const isGameOver = (brick) => {
  const len = brick.structure.length;
  for (let i = 0; i < len; i++) {
    if (brick.y + i < 0)
      return true;
  }
  return false;
};
const canvas = $(".canvas.brick");
const bgCanvas = $(".canvas.bg");
canvas.height = bgCanvas.height = gameParam.windowHeight;
canvas.width = bgCanvas.width = gameParam.windowWidth;
class Game {
  constructor() {
    __publicField(this, "mapBinary", new Array(gameParam.row).fill(0));
    __publicField(this, "bg", Array.from(
      { length: gameParam.row },
      () => Array.from({ length: gameParam.column })
    ));
    __publicField(this, "ctx", canvas.getContext("2d"));
    __publicField(this, "bgCtx", bgCanvas.getContext("2d"));
    __publicField(this, "operate", new Operate(this, this.mapBinary, new Brick()));
    __publicField(this, "lastTime", 0);
    __publicField(this, "pauseTime", 0);
    __publicField(this, "isOver", false);
    __publicField(this, "pause", false);
  }
  render(time) {
    this.userAction();
    if (this.pause) {
      this.cachePauseTime(time);
      return;
    }
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.lastTime = time;
    this.draw();
    this.update(time - this.pauseTime);
    this.canNextOne(time - this.pauseTime);
  }
  reSetCanvas() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  }
  draw() {
    this.operate.brick.draw(this.ctx);
  }
  update(time) {
    const shouldNextOne = this.operate.brick.update(time, this.mapBinary);
    if (shouldNextOne) {
      this.operate.brick.isRecycle = true;
    }
  }
  canNextOne(time) {
    if (this.operate.brick.isRecycle) {
      this.newNextOne(time);
    }
  }
  newNextOne(time) {
    if (!record(this.mapBinary, this.bg, this.operate.brick)) {
      this.isOver = true;
      return;
    }
    eliminate(this.mapBinary, this.bg);
    drawBg(this.bgCtx, this.bg);
    this.operate.brick = new Brick(time);
  }
  cachePauseTime(time) {
    this.pauseTime += time - this.lastTime;
    this.lastTime = time;
  }
  userAction() {
    userAction(this.pause, this.operate);
  }
}
let game = new Game();
const checkGameOver = (game2) => {
  if (game2.isOver) {
    alert("Game Over");
    reStartGame();
  }
};
const reStartGame = () => {
  game.reSetCanvas();
  game = new Game();
};
const [start] = customRaf((time = performance.now()) => {
  game.render(time);
  checkGameOver(game);
}, gameParam.FPS);
start();
