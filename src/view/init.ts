import { onMounted, ref } from "vue"
import CanvasWithMapCtx from "../game/CanvasWithMapCtx"
import { initConfig } from "../gameConfig"
const gameRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
const bgCanvasRed = ref<HTMLCanvasElement>()

export const init = () => {
  onMounted(() => {
    const { width, height } = gameRef.value!.getBoundingClientRect()
    initConfig(width, height)
    CanvasWithMapCtx.initContext(canvasRef.value!, bgCanvasRed.value!)
  })
}
