<script lang="ts" setup>
import { type Ref, computed, reactive, ref, watch } from "vue"
import { Crop, Rank, RefreshLeft } from "@element-plus/icons-vue"
import { PixelState } from "@/model"
import { allowClick, clickedPoint, playgroundState, sizeX, sizeY } from "@/store"
import { pixelToIdx } from "@/utils"
const STATE_COLOR_MAP = {
  [PixelState.empty]: "bg-gray-500/10",
  [PixelState.line]: "bg-gray-500/90",
  [PixelState.fill]: "bg-yellow-500/50",
  [PixelState.selected]: "bg-blue-500/50",
}
const pixels = ref<HTMLElement[]>()

function getPixel({ value: { x, y } }: Ref<{ x: number; y: number }>) {
  return pixels.value![pixelToIdx(x, y)]
}
function drawPixel(x: number, y: number) {
  if (!allowClick.value) { return }
  clickedPoint.value = `${x}_${y}`
  playgroundState.value[pixelToIdx(x, y)] = PixelState.selected
}

const selectStart = ref({ x: -1, y: -1 })
const selectEnd = ref({ x: -1, y: -1 })

const selectCentral = computed(() => {
  const { x: sx, y: sy } = selectStart.value
  const { x: ex, y: ey } = selectEnd.value
  return { x: Math.round((sx + ex) / 2), y: Math.round((sy + ey) / 2) }
})

function startSelecting(x: number, y: number) {
  selectStart.value = { x, y }
}
function showSelecting(x: number, y: number) {
  if (selectStart.value.x === -1 && selectStart.value.y === -1) {
    return
  }
  selectEnd.value = { x, y }
}

function endSelecting() {
  selectStart.value = { x: -1, y: -1 }
}
const pos = reactive({
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
  pos.left = left
  pos.top = top
  pos.width = leftEnd - left + width
  pos.height = topEnd - top + height
})
const renderPos = computed(() => {
  return {
    left: `${pos.left}px`,
    top: `${pos.top}px`,
    width: `${pos.width}px`,
    height: `${pos.height}px`,
  }
})
function rotate(ev: MouseEvent) {
  console.log(ev)
}
</script>

<template>
  <div flex flex-col select-none>
    <div v-for="x of sizeX" :key="x" flex flex-grow flex-row>
      <div
        v-for="y of sizeY" :key="y"
        ref="pixels"
        flex-grow m="0.1"
        :class="[
          STATE_COLOR_MAP[ playgroundState[(x - 1) * sizeY + (y - 1)] ],
          allowClick ? 'cursor-pointer' : '',
        ]"
        @click="drawPixel(x - 1, y - 1)"
        @mousedown="startSelecting(x - 1, y - 1)"
        @mouseover="showSelecting(x - 1, y - 1)"
        @mouseup="endSelecting()"
      ></div>
    </div>
    <Teleport to="#app">
      <div
        absolute :style="renderPos"
        border="2px blue-500/50" pointer-events-none
      >
        <div absolute right-0 bottom--6 pointer-events-initial>
          <el-icon
            l-icon :size="20" color="black"
            @mousedown="rotate"
          >
            <RefreshLeft />
          </el-icon>
          <el-icon :size="20" color="black"><Crop /></el-icon>
          <el-icon><Rank /></el-icon>
        </div>
      </div>
    </Teleport>
  </div>
</template>
