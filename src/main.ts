import Game from "./game"
import { $ } from "./utils"

const game = new Game((score) => {
  $(".score")!.textContent = score + ""
})
game.startGame()
console.log(game)
