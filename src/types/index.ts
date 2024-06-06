import { Brick } from "../brick"
import { BrickColor } from "./brick"

export type GameParam = {
  readonly windowWidth: number
  readonly windowHeight: number
  readonly row: number
  readonly column: number
  readonly devicePixelRatio: number
  readonly brickWidth: number
  readonly brickHeight: number
  readonly FPS: number | null
  speed: number
  keySpeed: number
  score: number
}

export type OperateEvents = {
  left: () => void
  right: () => void
  downOne: () => void
  downToBottom: () => void
  rotate: () => void
  pauseGame: () => void
}

export interface ICanvasWithMapCtx {
  ctx: CanvasRenderingContext2D
  bgCtx: CanvasRenderingContext2D
  mapBinary: number[]
  bg: (BrickColor | undefined)[][]
}

export interface PlayWithPause {
  playGame: () => void
  pauseGame: () => void
}

export interface IRenderer extends PlayWithPause {
  brick: Brick
  nextBrick: Brick
  over: boolean
  pause: boolean
  render: (time: number) => void
}

export interface IGame extends PlayWithPause {
  over: boolean
  pause: boolean
  startGame: () => void
  restartGame: () => void
  cancelGame: () => void
}

// const fnArr: ((a: 1) => void)[] | ((b: 2) => void)[] = []
// fnArr.push(() => {})

export interface EmitterEvents {
  updateScore: ((score: number) => void)[]
  updateEliminate: ((num: number) => void)[]
  updateNextBrick: ((brick: Brick|null) => void)[]
  startGame: ((renderer: IRenderer) => void)[]
  resetDom: (() => void)[]
  gameOver: (() => void)[]
}

export interface IEventEmitter {
  events: Partial<EmitterEvents>
  on: <E extends keyof EmitterEvents>(
    event: E,
    listener: EmitterEvents[E][number]
  ) => void
  emit: <E extends keyof EmitterEvents>(
    event: E,
    ...args: Parameters<EmitterEvents[E][number]>
  ) => void
  off: <E extends keyof EmitterEvents>(
    event: E,
    listener: EmitterEvents[E][number]
  ) => void
  clearAllListeners: () => void
}
