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
  readonly brick: Brick
  readonly nextBrick: Brick
  render: (time: number) => void
}

export interface IGame extends PlayWithPause {
  readonly state: IGameState
  startGame: () => void
  restartGame: () => void
  cancelGame: () => void
}

export interface IGameState {
  readonly nextBrick: Brick | null
  readonly over: boolean
  readonly pause: boolean
  readonly score: number
  readonly playing: boolean
  readonly eliminateNum: number
  initState: () => void
  setNextBrick: (brick: Brick | null, renderer: IGameRenderer) => void
  setOver: () => void
  setPause: (pause: boolean) => void
  setScore: (score: number) => void
  setPlaying: (playing: boolean) => void
  setEliminateNum: (num: number) => void
}
