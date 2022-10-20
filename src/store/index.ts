import type { Ref } from "vue"
import { ref, watch } from "vue"
import { PixelState } from "@/model"
import { fill, is2DArray, sleep } from "@/utils"
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

export function stopRequestPoint() {
  allowClick.value = false
}

export function drawState(...pixels: number[][]) {
  pixels
    .filter(([x, y]) => x < sizeX.value && y < sizeY.value && x >= 0 && y >= 0)
    .forEach(([x, y]) => playgroundState.value[x * sizeY.value + y] = PixelState.line)
}

export function fillState(pos: number[]) {
  pos.forEach(i => playgroundState.value[i] = PixelState.fill)
}

export async function drawStateWithInterval(
  pixels: Iterable<number[][]> | Iterable<number[]>,
  interval: number, isFill = false,
) {
  for (const maybeGroup of pixels) {
    if (isFill) {
      fillState(maybeGroup as number[])
    } else if (is2DArray(maybeGroup)) {
      drawState(...maybeGroup)
    } else {
      drawState(maybeGroup)
    }
    await sleep(interval)
  }
}

export function fillPlayground() {
  drawStateWithInterval(
    fill(playgroundState.value, sizeX.value, sizeY.value),
    drawLastTime.value / sizeY.value, true)
}

// selector

export const InitialMouse = () => ({ x: -1, y: -1 })

export function isInitialMouse({ value: { x, y } }: Ref<{ x: number; y: number }>) {
  return x === -1 && y === -1
}

export const selectStart = ref(InitialMouse())
export const selectEnd = ref(InitialMouse())
export const initialMousePos = ref(InitialMouse())
