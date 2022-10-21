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
      // 如果是填充 调用fillState
      fillState(maybeGroup as number[])
    } else if (is2DArray(maybeGroup)) {
      // 如果是一组像素（如画圆的时候每次需要画一组
      drawState(...maybeGroup)
    } else {
      // 如果是单个像素（如画线每次只画一个点
      drawState(maybeGroup)
    }
    // 睡眠 等待
    await sleep(interval)
  }
}

export function fillPlayground() {
  drawStateWithInterval(
    fill(playgroundState.value, sizeX.value, sizeY.value),
    drawLastTime.value / sizeY.value, true)
}

