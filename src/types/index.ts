import { BrickColor } from "./brick"
import { OptionalKeys } from "./helper"

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
  downBottom: () => void
  rotate: () => void
  pauseGame: () => void
}

export interface ICanvasWithMapCtx {
  ctx: CanvasRenderingContext2D
  bgCtx: CanvasRenderingContext2D
  cleanUpCanvas: () => void
  mapBinary: number[]
  bg: BrickColor[][]
}

export interface PlayWithPause {
  playGame: () => void
  pauseGame: () => void
}

export interface IRenderer extends PlayWithPause {
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

export interface EmitterEvents {
  updateScore?: Function[]
  updateEliminate?:Function[]
  updateNextBrick?: Function[]
  gameOver?: Function[]
}

export interface IEventEmitter {
  events: EmitterEvents
  on: (event: OptionalKeys<EmitterEvents>, listener: Function) => void
  emit: (event: OptionalKeys<EmitterEvents>) => void
  off: (event: OptionalKeys<EmitterEvents>, listener: Function) => void
  clearAllListeners: () => void
}
