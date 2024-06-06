<template>
  <div class="container">
    <canvas class="next_brick"></canvas>
    <div class="score">
      得分：<br /><span>{{ game?.state.score }}</span>
    </div>
    <div class="eliminate">
      消除行：<br /><span>{{ game?.state.eliminateNum }}</span>
    </div>
    <button class="regame" @click="game?.restartGame">重新游戏</button>
    <button
      class="pause"
      v-show="game?.state.playing"
      @click="game?.togglePause">
      {{ game?.state.pause ? "继续" : "暂停" }}
    </button>
    <div class="game" ref="gameRef">
      <button
        class="start"
        v-show="!game?.state.playing"
        @click="game?.startGame">
        开始
      </button>
      <button
        class="restart"
        v-show="game?.state.over"
        @click="game?.restartGame">
        重新开始
      </button>
      <canvas class="brick canvas" ref="canvasRef"></canvas>
      <canvas class="bg canvas" ref="bgCanvasRed"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { IGame } from "../types";
const gameRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
const bgCanvasRed = ref<HTMLCanvasElement>()

let game = ref<IGame>()
onMounted(async () => {
  const { initConfig } = await import("../gameConfig")
  const { width, height } = gameRef.value!.getBoundingClientRect()
  initConfig(width, height)
  const CanvasWithMapCtx = (await import("../game/CanvasWithMapCtx")).default
  const Game = (await import("../game")).default
  CanvasWithMapCtx.initContext(canvasRef.value!, bgCanvasRed.value!)
  game.value = new Game()
})
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 10px;
}
.bg {
  z-index: -1;
  background-color: rgb(226, 233, 175);
}
.game {
  position: relative;
  height: 80vh;
  background-size: 100% 100%;
  aspect-ratio: 9 / 18;
  z-index: 99;
  transform: scale(0.9);
  border-radius: 10px;
  border: 1px solid black;
}
.container {
  position: relative;
  margin: auto;
  height: min-content;
  width: 400px;
  background-color: rgb(158, 173, 134);
  /* z-index: ; */
}
button,
.score,
.eliminate {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s;
}
.start,
.restart {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50px;
  width: 100px;
  background-color: #328855;
  transform: translate(-50%, -50%);
  z-index: 99;
}
.start:hover {
  background-color: #64c88a;
}
.next_brick {
  position: absolute;
  background-color: white;
  border: 1px solid black;
  top: 0;
  right: 0;
  transform-origin: right center;
  transform: scale(0.4);
}

.score {
  position: absolute;
  background-color: brown;
  top: 20%;
  right: 0;
}
.eliminate {
  position: absolute;
  background-color: brown;
  top: 30%;
  right: 0;
}
.regame {
  position: absolute;
  background-color: brown;
  top: 40%;
  right: 0;
}

.restart {
  background-color: rgb(89, 140, 201);
}
.pause {
  position: absolute;
  background-color: brown;
  top: 50%;
  right: 0;
}
</style>
