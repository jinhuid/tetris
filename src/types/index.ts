import type { BaseBrick } from "../brick"
import { BrickColor, type BrickLetter, type IBrick } from "./brick"

export type GameParam = {
  readonly windowWidth: number
  readonly windowHeight: number
  readonly row: number
  readonly column: number
  readonly devicePixelRatio: number
  readonly brickWidth: number
  readonly brickHeight: number
  readonly FPS: number | null
  readonly showLandingPoint: boolean
  speed: number
  keySpeed: number
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
  readonly brickCtx: CanvasRenderingContext2D
  readonly bgCtx: CanvasRenderingContext2D
  readonly nextBrickCtx: CanvasRenderingContext2D
  readonly mapBinary: number[]
  readonly bg: (BrickColor | undefined)[][]
}

export interface PlayWithPause {
  playGame: () => void
  pauseGame: () => void
  togglePause: () => void
}

export interface IGameRenderer extends PlayWithPause {
  readonly canvasWithMapCtx: ICanvasWithMapCtx
  readonly brick: IBrick
  readonly nextBrickLetter: BrickLetter
  render: (time: number) => void
}

export interface IGame extends PlayWithPause {
  readonly state: IGameState
  startGame: () => void
  restartGame: () => void
  cancelGame: () => void
}

export interface IGameState {
  readonly nextBrick: BaseBrick | null
  readonly over: boolean
  readonly pause: boolean
  readonly score: number
  readonly playing: boolean
  readonly eliminateNum: number
  initState: () => void
  setNextBrick: (brick: BaseBrick | null, renderer: IGameRenderer) => void
  setOver: () => void
  setPause: (pause: boolean) => void
  setScore: (score: number) => void
  setPlaying: (playing: boolean) => void
  setEliminateNum: (num: number) => void
}
