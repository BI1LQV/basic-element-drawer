<script lang="ts" setup>
import { type Ref, computed, ref } from "vue"
import Selector from "./Selector.vue"
import { PixelState } from "@/model"
import { InitialMouse, allowClick, clickedPoint, initialMousePos, isInitialMouse, playgroundState, selectEnd, selectStart, sizeX, sizeY } from "@/store"
import { pixelToIdx } from "@/utils"
const STATE_COLOR_MAP = {
  [PixelState.empty]: "bg-gray-500/10",
  [PixelState.line]: "bg-gray-500/90",
  [PixelState.fill]: "bg-yellow-500/50",
  [PixelState.selected]: "bg-blue-500/50",
}
const pixels = ref<HTMLDivElement[]>()
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
}
function showSelecting(x: number, y: number) {
  if (isInitialMouse(selectStart)) {
    return
  }
  selectEnd.value = { x, y }
}

function endSelecting() {
  selectStart.value = InitialMouse()
}

function endTransform() {
  initialMousePos.value = InitialMouse()
  console.log(initialMousePos)
}

const selectCentral = computed(() => {
  const { x: sx, y: sy } = selectStart.value
  const { x: ex, y: ey } = selectEnd.value
  return { x: Math.round((sx + ex) / 2), y: Math.round((sy + ey) / 2) }
})

function rotate(ev: MouseEvent) {
  if (isInitialMouse(initialMousePos)) { return }
  const { clientX: mouseX, clientX: mouseY } = ev
  const { left, top, width, height } = getPixel(selectCentral).getBoundingClientRect()
  const centerPixel = { x: left + width / 2, y: top + height / 2 }
}
</script>

<template>
  <div flex flex-col select-none @mouseup="endTransform">
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
