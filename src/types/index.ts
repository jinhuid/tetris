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
  togglePause: () => void
}

export interface IGameRenderer extends PlayWithPause {
  gameState: IGameState
  brick: Brick
  nextBrick: Brick
  render: (time: number) => void
}

export interface IGame extends PlayWithPause {
  state: IGameState
  startGame: () => void
  restartGame: () => void
  cancelGame: () => void
}

export interface IGameState {
  nextBrick: Brick | null
  over: boolean
  pause: boolean
  score: number
  playing: boolean
  eliminateNum: number
  initState: () => void
  setNextBrick: (brick: Brick | null) => void
  setOver: () => void
  setPause: (pause: boolean) => void
  setScore: (score: number) => void
  setPlaying: (playing: boolean) => void
  setEliminateNum: (num: number) => void
}
