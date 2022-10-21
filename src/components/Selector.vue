<script lang="ts" setup>
import { Crop, Rank, RefreshLeft } from "@element-plus/icons-vue"
import { type Ref, computed, reactive, ref, watch } from "vue"
import { clearDiff, clearInherit, getBlockDiff, inheritMoveDiff, initialMousePos, isInitialMouse, moveDiff, resizeDiff, rotateAngle, selectCentral, selectEnd, selectStart, stopTransform, transformType } from "@/store"
import { idxToPixel, movePixel, pixelToIdx, rotatePixel, usePx, useRad, useXY } from "@/utils"
import { PixelState } from "@/model"
const { getPixel } = defineProps<{
  getPixel: ({ value: { x, y } }: Ref<{ x: number; y: number }>) => HTMLElement
}>()

const selectorPos = reactive({
  left: 0,
  top: 0,
  width: 0,
  height: 0,
})
watch(selectEnd, () => {
  if (isInitialMouse(selectEnd)) {
    selectorPos.left = 0
    selectorPos.top = 0
    selectorPos.width = 0
    selectorPos.height = 0
    return
  }
  const { left, top } = getPixel(selectStart).getBoundingClientRect()
  const {
    left: leftEnd,
    top: topEnd, width, height,
  } = getPixel(selectEnd).getBoundingClientRect()
  selectorPos.left = left
  selectorPos.top = top
  selectorPos.width = leftEnd - left + width
  selectorPos.height = topEnd - top + height
})
const renderedPos = usePx(selectorPos)
const renderedRotate = useRad(rotateAngle)
const renderedScale = useXY(resizeDiff)
const renderedTranslate = useXY(moveDiff, true)

const isChangingType = ref(false)
function setInitial(ev: MouseEvent, type: "rotate" | "resize" | "move") {
  if (transformType.value && transformType.value !== type) {
    if (transformType.value === "move") {
      const [[newStart, _1], [newEnd, _2]] = movePixel([
        [pixelToIdx(selectStart.value.x, selectStart.value.y), PixelState.selected],
        [pixelToIdx(selectEnd.value.x, selectEnd.value.y), PixelState.selected],
      ], getBlockDiff()!)
      const [newStartX, newStartY] = idxToPixel(newStart)
      const [newEndX, newEndY] = idxToPixel(newEnd)
      selectStart.value = { x: newStartX, y: newStartY }
      selectEnd.value = { x: newEndX, y: newEndY }
    } else if (transformType.value === "rotate") {
      const [[p1, _1], [p2, _2], [p3, _3], [p4, _]] = rotatePixel([
        [pixelToIdx(selectStart.value.x, selectStart.value.y), PixelState.selected],
        [pixelToIdx(selectEnd.value.x, selectEnd.value.y), PixelState.selected],
        [pixelToIdx(selectStart.value.x, selectEnd.value.y), PixelState.selected],
        [pixelToIdx(selectEnd.value.x, selectStart.value.y), PixelState.selected],
      ], selectCentral.value, -rotateAngle.value)
      const [x1, y1] = idxToPixel(p1)
      const [x2, y2] = idxToPixel(p2)
      const [x3, y3] = idxToPixel(p3)
      const [x4, y4] = idxToPixel(p4)
      selectStart.value = { x: Math.min(x1, x2, x3, x4), y: Math.min(y1, y2, y3, y4) }
      selectEnd.value = { x: Math.max(x1, x2, x3, x4), y: Math.max(y1, y2, y3, y4) }
    } else if (transformType.value === "resize") {
      // TODO: 待完成
    } else {
      const n: never = transformType.value
    }
    stopTransform.value()
    isChangingType.value = true
    clearInherit()
    clearDiff()
    setTimeout(() => {
      isChangingType.value = false
    }, 150)
  }
  initialMousePos.value = { x: ev.clientX, y: ev.clientY }
  transformType.value = type
}

const negativeResizeDiff = computed(() => `${1 / resizeDiff.value.x} ,${1 / resizeDiff.value.y}`)
</script>

<template>
  <div
    id="selector" absolute
    :style="renderedPos" border="2px blue-500/50"
    pointer-events-none
    :class="{ transition: isChangingType }"
  >
    <div id="operator" absolute right-0 bottom--6 pointer-events-initial>
      <el-icon
        :color="transformType === 'rotate' ? 'blue' : 'gray'"
        @mousedown="setInitial($event, 'rotate')"
      >
        <RefreshLeft />
      </el-icon>
      <el-icon
        :color="transformType === 'resize' ? 'blue' : 'gray'"
        @mousedown="setInitial($event, 'resize')"
      >
        <Crop />
      </el-icon>
      <el-icon
        :color="transformType === 'move' ? 'blue' : 'gray'"
        @mousedown="setInitial($event, 'move')"
      >
        <Rank />
      </el-icon>
    </div>
  </div>
</template>

<style>
#selector {
  transform: rotate(v-bind(renderedRotate)) scale(v-bind(renderedScale)) translate(v-bind(renderedTranslate));
}
#operator{
  transform: scale(v-bind(negativeResizeDiff));
}
</style>
