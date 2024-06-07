var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { gameParam } from "./gameConfig-BX5BlB8T.js";
const _CanvasWithMapCtx = class _CanvasWithMapCtx {
  constructor() {
    __publicField(this, "brickCtx");
    __publicField(this, "bgCtx");
    __publicField(this, "nextBrickCtx");
    __publicField(this, "mapBinary");
    __publicField(this, "bg");
    this.brickCtx = _CanvasWithMapCtx.ctx;
    this.bgCtx = _CanvasWithMapCtx.bgCtx;
    this.nextBrickCtx = _CanvasWithMapCtx.nextBrickCtx;
    this.mapBinary = new Array(gameParam.row).fill(0);
    this.bg = Array.from(
      { length: gameParam.row },
      () => Array.from({ length: gameParam.column }, () => void 0)
    );
    this.cleanUpCanvas();
  }
  static initContext(brickCanvas, bgCanvas, nextBrickCanvas) {
    this.canvas = brickCanvas;
    this.bgCanvas = bgCanvas;
    this.nextBrickCanvas = nextBrickCanvas;
    this.ctx = brickCanvas.getContext("2d");
    this.bgCtx = bgCanvas.getContext("2d");
    this.nextBrickCtx = nextBrickCanvas.getContext(
      "2d"
    );
    this.canvas.height = this.bgCanvas.height = gameParam.windowHeight;
    this.canvas.width = this.bgCanvas.width = gameParam.windowWidth;
    this.nextBrickCanvas.height = gameParam.brickHeight * 4;
    this.nextBrickCanvas.width = gameParam.brickWidth * 4;
  }
  cleanUpCanvas() {
    this.clearCanvas(this.brickCtx);
    this.clearCanvas(this.bgCtx);
  }
  clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
};
__publicField(_CanvasWithMapCtx, "canvas");
__publicField(_CanvasWithMapCtx, "bgCanvas");
__publicField(_CanvasWithMapCtx, "ctx");
__publicField(_CanvasWithMapCtx, "bgCtx");
__publicField(_CanvasWithMapCtx, "nextBrickCanvas");
__publicField(_CanvasWithMapCtx, "nextBrickCtx");
let CanvasWithMapCtx = _CanvasWithMapCtx;
export {
  CanvasWithMapCtx as default
};
