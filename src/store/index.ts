import { type Ref, computed, ref, watch } from "vue"
import { PixelState, type Pos } from "@/model"
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

export const rotateAngle = ref(0)// 旋转角度
export const moveDiff = ref({ x: 0, y: 0 })// 平移变动量
export const resizeDiff = ref({ x: 1, y: 1 })// 缩放变动量
export const transformType = ref<"rotate" | "resize" | "move">()// 记录当前操作的类型 如果不在操作，则为undefined
// 以下是之前操作的记录
export const inheritRotateAngle = ref(0)
export const inheritMoveDiff = ref({ x: 0, y: 0 })
export const inheritResizeDiff = ref({ x: 1, y: 1 })
export function clearSelectStatus() { // 清除选择状态
  rotateAngle.value = 0
  selectEnd.value = InitialMouse()
  resizeDiff.value = { x: 1, y: 1 }
  moveDiff.value = { x: 0, y: 0 }
}

export function setSelectEnd(x: number, y: number) {
  // 处理各种非从左上到右下的情况
  selectEnd.value = {
    x: Math.max(selectStart.value.x, selectEnd.value.x, x),
    y: Math.max(selectStart.value.y, selectEnd.value.y, y),
  }
  selectStart.value = {
    x: Math.min(selectStart.value.x, x),
    y: Math.min(selectStart.value.y, y),
  }
}

export function clearInherit() { // 下次变化开始 清除之前的状态
  inheritRotateAngle.value = 0
  inheritMoveDiff.value = { x: 0, y: 0 }
  inheritResizeDiff.value = { x: 1, y: 1 }
  transformType.value = undefined
}

export function inheritThree() {
  // 每次变化结束，但是又没有取消选中 可能之后还有变换 所以存储当前状态
  inheritRotateAngle.value = rotateAngle.value
  inheritMoveDiff.value = moveDiff.value
  inheritResizeDiff.value = resizeDiff.value
}

export const selectCentral = computed(() => {
  // 框选的中心 辅助计算旋转等
  const { x: sx, y: sy } = selectStart.value
  const { x: ex, y: ey } = selectEnd.value
  return { x: Math.round((sx + ex) / 2), y: Math.round((sy + ey) / 2) }
})

export const transformedSelectCentral = computed(() => {
  // 如果有平移 需要该变量来计算平移后的选择中心
  const { x, y } = selectCentral.value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [[newIdx, _]] = resizeMix([[pixelToIdx(x, y), PixelState.selected]],
    rotateAngle.value, { x, y },
    getBlockDiff()!, resizeDiff.value)
  const [retX, retY] = idxToPixel(newIdx)
  return { x: retX, y: retY }
})

export function snapshotPlayground() {
  const toTransform: [number, PixelState][] = []// 存储需要变换的像素
  const snapshot = playgroundState.value.map((state, idx) => {
    const [ix, iy] = idxToPixel(idx)
    if (
      ix > selectStart.value.x && ix < selectEnd.value.x
      && iy > selectStart.value.y && iy < selectEnd.value.y
    ) { // 在需要变换的区域
      if (state === PixelState.fill || state === PixelState.line) {
        // 只有非空像素需要变化
        toTransform.push([idx, state])
      }
      return PixelState.empty
    }
    return state
  })
  return { snapshot, toTransform }
}

export const stopTransform = ref(() => {})// 存储watcher的取消器
export function getBlockDiff() {
  // moveDiff存储的是鼠标平移的变化量，事实上显示的模拟像素比实际鼠标平移像素差了很多，需要该函数进行一次转换
  const blockDiff = { ...moveDiff.value }
  const pixelDom = document.getElementById(xyToId(0, 0))// 获取一个虚拟像素的实际尺寸
  if (pixelDom) {
    const { margin, width, height } = getComputedStyle(pixelDom)
    blockDiff.x /= parseFloat(margin) + parseFloat(width)// 除以模拟像素的宽度加外边距
    blockDiff.y /= parseFloat(margin) + parseFloat(height)
    return blockDiff
  }
}

watch(transformType, (newVal, oldVal) => {
  if (!oldVal && newVal) {
    // 之前的transformType是空 并且有新的transformType 说明新的选择开始了
    // 快照
    const { snapshot, toTransform } = snapshotPlayground()
    stopTransform.value = watch([rotateAngle, moveDiff, resizeDiff], () => {
      // 每次有变化的时候调用该函数计算图像变化
      setTimeout(() => {
        playgroundState.value = [...snapshot]// 拷贝一次snapshot 防止污染
        const blockDiff = getBlockDiff()
        if (blockDiff) {
          resizeMix(toTransform, rotateAngle.value,
            selectCentral.value, blockDiff,
            resizeDiff.value).forEach(([idx, state]) => {
            playgroundState.value[idx] = state// 把变化后的像素施加到实际显示的数组上
          })
        }
      })
    })
  }
})
