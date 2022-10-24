import { type Ref, computed, ref, watch } from "vue"
import { PixelState, type Pos, type TransformPath } from "@/model"
import { fill, idxToPixel, is2DArray, isLegal, pixelToIdx, resizeMix, sleep, xyToId } from "@/utils"
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

export const transformPath: TransformPath[] = []

export const transformType = ref<"rotate" | "resize" | "move">()

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
  transformPath.length = 0
  transformType.value = undefined
}

export function clearDiff() {
  rotateAngle.value = 0
  moveDiff.value = { x: 0, y: 0 }
  resizeDiff.value = { x: 1, y: 1 }
}

export function inheritThree() {
  const trans = getTrans()
  trans && transformPath.push(trans)
  console.log(transformPath)
}

export const selectCentral = computed(() => {
  const { x: sx, y: sy } = selectStart.value
  const { x: ex, y: ey } = selectEnd.value
  return { x: Math.round((sx + ex) / 2), y: Math.round((sy + ey) / 2) }
})

export const transformedSelectCentral = computed(() => {
  const { x, y } = selectCentral.value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [[newIdx, _]] = resizeMix([[pixelToIdx(x, y), PixelState.selected]],
    { x, y },
    transformPath)
  const [retX, retY] = idxToPixel(newIdx)
  return { x: retX, y: retY }
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

const blockDiff = computed(() => getBlockDiff()!)

function getTrans(): TransformPath | null {
  if (transformType.value === "move") {
    return ({ ...blockDiff.value, type: "move" })
  } else if (transformType.value === "resize") {
    return ({ ...resizeDiff.value, type: "resize" })
  } else if (transformType.value === "rotate") {
    return ({ value: rotateAngle.value, type: "rotate" })
  } else {
    return null
  }
}
watch(transformType, (newVal, oldVal) => {
  if (!oldVal && newVal) {
    const { snapshot, toTransform } = snapshotPlayground()
    stopTransform.value = watch([rotateAngle, moveDiff, resizeDiff], () => {
      setTimeout(() => {
        playgroundState.value = [...snapshot]
        resizeMix(toTransform, selectCentral.value, [...transformPath, getTrans()!]).forEach(([idx, state]) => {
          playgroundState.value[idx] = state
        })
      })
    })
  }
})
