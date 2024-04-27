import { Binary } from "./types"
import { $ } from "./utils"
const container = $("#container") as HTMLDivElement
const { width, height } = container.getBoundingClientRect()
export const gameParam = {
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
    return this.windowWidth / this.column
  },
  get brickHeight() {
    return this.windowHeight / this.row
  },
}
console.log(gameParam);

export const bricks = {
  o: {
    color: "#FADADD" as const,
    struct: ["11", "11"] as Binary<2>[],
  },
  i: {
    color: "#F7E9D4" as const,
    struct: ["0000", "1111", "0000", "0000"] as Binary<4>[],
  },
  s: {
    color: "#C8E6C9" as const,
    struct: ["011", "110", "000"] as Binary<3>[],
  },
  z: {
    color: "#B3E5FC" as const,
    struct: ["110", "011", "000"] as Binary<3>[],
  },
  l: {
    color: "#FFCC80" as const,
    struct: ["001", "111", "000"] as Binary<3>[],
  },
  j: {
    color: "#FFEE58" as const,
    struct: ["100", "111", "000"] as Binary<3>[],
  },
  t: {
    color: "#CE93D8" as const,
    struct: ["000", "111", "010"] as Binary<3>[],
  },
}

export const control = {
  operate: {
    left: ["a", "ArrowLeft"],
    right: ["d", "ArrowRight"],
    up: ["w", "ArrowUp"],
    down: ["s", "ArrowDown"],
    bottom: [" "],
  },
  onceKey: ["up", "bottom"],
  speedUpKey: ["down"],
  speedUpRate: 2,
  pause: ["Enter", "p"],
} as const
