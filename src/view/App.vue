<template>
  <div
    class="m-auto relative flex flex-row w-min h-min bg-gradient-to-t from-[rgb(225,230,217)] to-[rgb(248,253,239)]">
    <div
      class="relative h-[80vh] aspect-[9/18] flex border-r-[3px] border-[rgb(186 187 188)] rounded-lg overflow-hidden"
      ref="gameRef">
      <button
        class="btn btn-primary btn-lg m-auto z-10"
        v-show="!game?.state.playing && !game?.state.over"
        @click="game?.startGame">
        开始
      </button>
      <button
        class="btn btn-accent btn-lg m-auto z-10"
        v-show="game?.state.over"
        @click="game?.restartGame">
        重新开始
      </button>
      <div
        class="toast absolute toast-center toast-middle z-10"
        v-show="game?.state.pause">
        <div class="alert alert-info">
          <span>游戏已暂停</span>
          <span class="loading loading-ring loading-sm"></span>
        </div>
      </div>
      <canvas class="absolute h-full w-full" ref="brickRef"></canvas>
      <canvas class="absolute h-full w-full" ref="bgRef"></canvas>
    </div>
    <div class="flex flex-col w-min rounded-md ml-4 mr-4">
      <canvas
        class="size-20 bg-[#e8e2d58c] rounded-md mb-4 mt-4"
        ref="nextBrickRef"></canvas>
      <div class="stats stats-vertical shadow w-20">
        <div class="stat p-0 pt-3 pb-3">
          <div class="stat-title text-center">得分:</div>
          <div class="stat-value text-center text-base">
            {{ game?.state.score || 0 }}
          </div>
        </div>
        <div class="stat p-0 pt-3 pb-3">
          <div class="stat-title text-center">消除行：</div>
          <div class="stat-value text-center text-base">
            {{ game?.state.eliminateNum || 0 }}
          </div>
        </div>
      </div>
      <div
        class="stats stats-vertical w-25 mt-20 bg-transparent overflow-hidden">
        <button
          v-show="game?.state.playing"
          class="btn bg-[rgb(255,255,255)]"
          @click="game?.restartGame">
          重新游戏
        </button>
        <button
          class="btn bg-[rgb(255,255,255)]"
          v-show="game?.state.playing"
          @click="game?.togglePause">
          {{ game?.state.pause ? "继续" : "暂停" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue"
import { IGame } from "../types"
const gameRef = ref<HTMLDivElement>()
const brickRef = ref<HTMLCanvasElement>()
const bgRef = ref<HTMLCanvasElement>()
const nextBrickRef = ref<HTMLCanvasElement>()

let game = shallowRef<IGame>()
onMounted(async () => {
  const { initConfig } = await import("../gameConfig")
  const { width, height } = gameRef.value!.getBoundingClientRect()
  initConfig(width, height)
  const CanvasWithMapCtx = (await import("../game/CanvasWithMapCtx")).default
  const Game = (await import("../game")).default
  CanvasWithMapCtx.initContext(
    brickRef.value!,
    bgRef.value!,
    nextBrickRef.value!
  )
  game.value = new Game()
  console.log(game)
})
</script>
