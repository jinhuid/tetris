export default class Scorer {
  static instance: Scorer
  private cb: ((score: number) => void) | undefined
  constructor(cb?: (score: number) => void) {
    if (Scorer.instance) {
      return Scorer.instance
    }
    if (cb) {
      this.cb = cb
    }
    Scorer.instance = this
  }
  private _score = 0
  get score() {
    return this._score
  }
  bonusPoint(v: number) {
    this._score += v
    if (this.cb) {
      this.cb(this._score)
    }
  }
  makeZero() {
    this._score = 0
  }
}
