<script lang="ts" setup>
import { type Ref, computed, ref } from "vue"
import Selector from "./Selector.vue"
import { PixelState } from "@/model"
import { InitialMouse, allowClick, clickedPoint, initialMousePos, isInitialMouse, playgroundState, rotateAngle, selectEnd, selectStart, sizeX, sizeY } from "@/store"
import { pixelToIdx } from "@/utils"
const STATE_COLOR_MAP = {
  [PixelState.empty]: "bg-gray-500/10",
  [PixelState.line]: "bg-gray-500/90",
  [PixelState.fill]: "bg-yellow-500/50",
  [PixelState.selected]: "bg-blue-500/50",
}
const pixels = ref<HTMLDivElement[]>()
const isSelecting = ref(false)
function getPixel({ value: { x, y } }: Ref<{ x: number; y: number }>) {
  return pixels.value![pixelToIdx(x, y)]
}

function drawPixel(x: number, y: number) {
  if (!allowClick.value) { return }
  clickedPoint.value = `${x}_${y}`
  playgroundState.value[pixelToIdx(x, y)] = PixelState.selected
}

function startSelecting(x: number, y: number) {
  selectStart.value = { x, y }
  isSelecting.value = true
  rotateAngle.value = 0
}
function showSelecting(x: number, y: number) {
  if (!isSelecting.value) { return }
  selectEnd.value = { x, y }
}

function endSelecting() {
  isSelecting.value = false
}

function endTransform() {
  initialMousePos.value = InitialMouse()
}

const selectCentral = computed(() => {
  const { x: sx, y: sy } = selectStart.value
  const { x: ex, y: ey } = selectEnd.value
  return { x: Math.round((sx + ex) / 2), y: Math.round((sy + ey) / 2) }
})

function rotate(ev: MouseEvent) {
  if (isInitialMouse(initialMousePos)) { return }
  const { clientX, clientY } = ev
  const { left, top, width, height } = getPixel(selectCentral).getBoundingClientRect()
  const centerPixel = { x: left + width / 2, y: top + height / 2 }

  const initialAngle = Math.atan2(
    initialMousePos.value.y - centerPixel.y,
    initialMousePos.value.x - centerPixel.x)
  const afterAngle = Math.atan2(clientY - centerPixel.y, clientX - centerPixel.x)
  rotateAngle.value = afterAngle - initialAngle
}
</script>

<template>
  <div flex flex-col select-none @mouseup="endTransform" @mousemove="rotate">
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
    <Selector :get-pixel="getPixel"></Selector>
  </div>
</template>
