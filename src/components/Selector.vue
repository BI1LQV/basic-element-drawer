<script lang="ts" setup>
import { Crop, Rank, RefreshLeft } from "@element-plus/icons-vue"
import { type Ref, reactive, watch } from "vue"
import { initialMousePos, rotateAngle, selectEnd, selectStart } from "@/store"
import { usePx, useRad } from "@/utils"
const { getPixel } = defineProps<{
  getPixel: ({ value: { x, y } }: Ref<{ x: number; y: number }>) => HTMLDivElement
}>()

const selectorPos = reactive({
  left: 0,
  top: 0,
  width: 0,
  height: 0,
})
watch(selectEnd, () => {
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
function setInitial(ev: MouseEvent, type: "rotate") {
  initialMousePos.value = { x: ev.clientX, y: ev.clientY }
}
</script>

<template>
  <!-- <Teleport to="#app"> -->
  <div
    id="selector" absolute
    :style="renderedPos" border="2px blue-500/50"
    pointer-events-none
  >
    <div absolute right-0 bottom--6 pointer-events-initial>
      <el-icon
        l-icon :size="20" color="black"
        @mousedown="setInitial($event, 'rotate')"
      >
        <RefreshLeft />
      </el-icon>
      <el-icon :size="20" color="black"><Crop /></el-icon>
      <el-icon><Rank /></el-icon>
    </div>
  </div>
  <!-- </Teleport> -->
</template>

<style>
#selector {
  transform: rotate(v-bind(renderedRotate));
}
</style>
