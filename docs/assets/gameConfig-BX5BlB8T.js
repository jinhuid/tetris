let width;
let height;
const initConfig = (w, h) => {
  width = w;
  height = h;
};
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
export {
  gameParam,
  initConfig
};