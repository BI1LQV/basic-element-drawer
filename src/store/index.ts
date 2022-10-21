import { type Ref, computed, ref, watch } from "vue"
import { PixelState, type Pos } from "@/model"
import { fill, idxToPixel, is2DArray, isLegal, movePixel, pixelToIdx, resizePixel, rotatePixel, sleep, xyToId } from "@/utils"
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
    .filter(([x, y]) => isLegal(x, y))
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

// selector

export const InitialMouse = () => ({ x: -1, y: -1 })

export function isInitialMouse({ value: { x, y } }: Ref<Pos>) {
  return x === -1 && y === -1
}

export const selectStart = ref(InitialMouse())
export const selectEnd = ref(InitialMouse())
export const initialMousePos = ref(InitialMouse())

export const rotateAngle = ref(0)
export const moveDiff = ref({ x: 0, y: 0 })
export const resizeDiff = ref({ x: 1, y: 1 })
export const transformType = ref<"rotate" | "resize" | "move">()
export const inheritRotateAngle = ref(0)
export const inheritMoveDiff = ref({ x: 0, y: 0 })
export const inheritResizeDiff = ref({ x: 1, y: 1 })
export function clearSelectStatus() {
  rotateAngle.value = 0
  selectEnd.value = InitialMouse()
  resizeDiff.value = { x: 1, y: 1 }
  moveDiff.value = { x: 0, y: 0 }
}

export function setSelectEnd(x: number, y: number) {
  selectEnd.value = {
    x: Math.max(selectStart.value.x, selectEnd.value.x, x),
    y: Math.max(selectStart.value.y, selectEnd.value.y, y),
  }
  selectStart.value = {
    x: Math.min(selectStart.value.x, x),
    y: Math.min(selectStart.value.y, y),
  }
}

export function clearInherit() {
  inheritRotateAngle.value = 0
  inheritMoveDiff.value = { x: 0, y: 0 }
  inheritResizeDiff.value = { x: 1, y: 1 }
  transformType.value = undefined
}

export function clearDiff() {
  rotateAngle.value = 0
  moveDiff.value = { x: 0, y: 0 }
  resizeDiff.value = { x: 1, y: 1 }
}

export function inheritThree() {
  inheritRotateAngle.value = rotateAngle.value
  inheritMoveDiff.value = moveDiff.value
  inheritResizeDiff.value = resizeDiff.value
}

export const selectCentral = computed(() => {
  const { x: sx, y: sy } = selectStart.value
  const { x: ex, y: ey } = selectEnd.value
  return { x: Math.round((sx + ex) / 2), y: Math.round((sy + ey) / 2) }
})

export function snapshotPlayground() {
  const toTransform: [number, PixelState][] = []
  const snapshot = playgroundState.value.map((state, idx) => {
    const [ix, iy] = idxToPixel(idx)
    if (
      ix > selectStart.value.x && ix < selectEnd.value.x
      && iy > selectStart.value.y && iy < selectEnd.value.y
    ) {
      if (state === PixelState.fill || state === PixelState.line) {
        toTransform.push([idx, state])
      }
      return PixelState.empty
    }
    return state
  })
  return { snapshot, toTransform }
}

export const stopTransform = ref(() => {})
const WATCH_MAP = {
  "rotate": rotateAngle,
  "move": moveDiff,
  "resize": resizeDiff,
}
export function getBlockDiff() {
  const blockDiff = { ...moveDiff.value }
  const pixelDom = document.getElementById(xyToId(0, 0))
  if (pixelDom) {
    const { margin, width, height } = getComputedStyle(pixelDom)
    blockDiff.x /= parseFloat(margin) + parseFloat(width)
    blockDiff.y /= parseFloat(margin) + parseFloat(height)
    return blockDiff
  }
}

watch(transformType, (newVal, oldVal) => {
  if (!newVal) { return }
  // if (!(!oldVal && newVal)) {
  //   return
  // }
  stopTransform.value()
  // 新transformType，开始transform
  const { snapshot, toTransform } = snapshotPlayground()
  stopTransform.value = watch(WATCH_MAP[newVal], () => {
    setTimeout(() => {
      playgroundState.value = [...snapshot]
      let toDraw: number[][]
      if (newVal === "rotate") {
        toDraw = rotatePixel(toTransform, selectCentral.value, rotateAngle.value)
      } else if (newVal === "move") {
        const blockDiff = getBlockDiff()
        if (blockDiff) {
          toDraw = movePixel(toTransform, blockDiff)
        } else {
          toDraw = []
        }
      } else if ((newVal === "resize")) {
        toDraw = resizePixel(toTransform, selectCentral.value, resizeDiff.value)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const n: never = newVal
        toDraw = []
      }
      toDraw.forEach(([idx, state]) => {
        playgroundState.value[idx] = state
      })
    })
  })
})
