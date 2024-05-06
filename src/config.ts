import { Binary, Bricks } from "./types"
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

// prettier-ignore
export const bricks:Bricks = {
  o: {
    color: "#FADADD",
    struct: ["11",
             "11"],
  },
  i: {
    color: "#F7E9D4",
    struct: ["0000",
             "1111",
             "0000",
             "0000"],
  },
  s: {
    color: "#C8E6C9",
    struct: ["011",
             "110",
             "000"],
  },
  z: {
    color: "#B3E5FC",
    struct: ["110", 
             "011", 
             "000"],
  },
  l: {
    color: "#FFCC80",
    struct: ["001", 
             "111",
             "000"],
  },
  j: {
    color: "#FFEE58",
    struct: ["100",
             "111",
             "000"],
  },
  t: {
    color: "#CE93D8",
    struct: ["000",
             "111",
             "010"],
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
