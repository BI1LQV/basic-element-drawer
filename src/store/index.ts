import { ref, watch } from "vue"
import { PixelState } from "@/model"
import { is2DArray, sleep } from "@/utils"
export const sizeX = ref(60)
export const sizeY = ref(60)

export const drawLastTime = ref(1000)

export const playgroundState = ref<PixelState[]>([])

export function initPlayground() {
  playgroundState.value = Array.from({ length: sizeX.value * sizeY.value }).map(() => PixelState.empty)
}
watch([sizeX, sizeY], () => {
  initPlayground()
}, { immediate: true })

export const clickedPoint = ref("")
export const allowClick = ref(false)
export const requestPoint = () => new Promise<number[]>((resolve) => {
  allowClick.value = true
  const cancelWatcher = watch(clickedPoint, () => {
    cancelWatcher()
    allowClick.value = false
    resolve(clickedPoint.value.split("_").map(i => Number(i)))
  })
})

export function drawState(...pixels: number[][]) {
  pixels.forEach(([x, y]) => playgroundState.value[x * sizeY.value + y] = PixelState.line)
}

export async function drawStateWithInterval(
  pixels: Iterable<number[][]> | Iterable<number[]>,
  interval: number,
) {
  for (const maybeGroup of pixels) {
    if (is2DArray(maybeGroup)) {
      drawState(...maybeGroup)
    } else {
      drawState(maybeGroup)
    }
    await sleep(interval)
  }
}

