class Scorer {
  private _score = 0
  private _eliminateNum = 0
  get score() {
    return this._score
  }
  get eliminateNum() {
    return this._eliminateNum
  }
  scoreIncrease(v: number) {
    this._score += v
  }
  eliminateNumIncrease(v: number) {
    this._eliminateNum += v
  }
  reset() {
    this._score = 0
    this._eliminateNum = 0
  }
}

export { Scorer }
