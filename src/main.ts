import Game from "./game"

let game = new Game()

const checkGameOver = (game: Game) => {
  if (game.isOver) {
    alert("Game Over")
    reStartGame()
  }
}

const reStartGame = () => {
  game.reSetCanvas()
  game = new Game()
}

const start = (time: number = performance.now()) => {
  requestAnimationFrame(start)
  game.render(time)
  checkGameOver(game)
}

start()
