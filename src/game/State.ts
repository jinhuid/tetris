import { shallowReactive } from "vue"
import { IGameRenderer, IGameState } from "../types"
import { SinglePattern } from "../utils"
import { gameHelper } from "./Helper"
import type { BaseBrick } from "../brick"

class State implements IGameState {
  private _nextBrick!: BaseBrick | null
  private _over!: boolean
  private _pause!: boolean
  private _score!: number
  private _eliminateNum!: number
  private _playing!: boolean
  constructor() {
    this.initState()
  }
  initState() {
    this._nextBrick = null
    this._over = false
    this._pause = false
    this._score = 0
    this._eliminateNum = 0
    this._playing = false
  }
  get nextBrick() {
    return this._nextBrick
  }
  get over() {
    return this._over
  }
  get pause() {
    return this._pause
  }
  get score() {
    return this._score
  }
  get eliminateNum() {
    return this._eliminateNum
  }
  get playing() {
    return this._playing
  }
  setNextBrick(brick: BaseBrick | null, renderer: IGameRenderer) {
    this._nextBrick = brick
    if (brick) {
      gameHelper.drawNextBrick(renderer.canvasWithMapCtx.nextBrickCtx, brick)
    }
  }
  setOver() {
    this.setPlaying(false)
    this._over = true
  }
  setPause(pause: boolean) {
    this._pause = pause
  }
  setScore(score: number) {
    this._score = score
  }
  setPlaying(playing: boolean) {
    this._playing = playing
  }
  setEliminateNum(num: number) {
    this._eliminateNum = num
  }
}

const SingleGameState = SinglePattern(State)
const gameState = shallowReactive(new SingleGameState())
export default gameState
