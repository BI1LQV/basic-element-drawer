<script lang="ts" setup>
import { Crop, Rank, RefreshLeft } from "@element-plus/icons-vue"
import { type Ref, computed, reactive, ref, watch } from "vue"
import { initialMousePos, isInitialMouse, moveDiff, resizeDiff, rotateAngle, selectEnd, selectStart, transformType } from "@/store"
import { usePx, useRad, useXY } from "@/utils"
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
  transform:translate(v-bind(renderedTranslate)) scale(v-bind(renderedScale)) rotate(v-bind(renderedRotate)) ;
}
#operator{
  transform: scale(v-bind(negativeResizeDiff));
}
</style>
