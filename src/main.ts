import { gameParam } from "./config"
import Game from "./game"
import { customRaf } from "./utils"

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

const [start] = customRaf((time: number = performance.now()) => {
  game.render(time)
  checkGameOver(game)
}, gameParam.FPS)

start()
