<script lang="ts" setup>
import { type Ref, ref } from "vue"
import Selector from "./Selector.vue"
import { PixelState, type Pos } from "@/model"
import {
  InitialMouse, allowClick,
  clearSelectStatus, clickedPoint,
  initialMousePos,
  isInitialMouse,
  playgroundState, selectCentral,
  selectEnd, selectStart, sizeX, sizeY, transformType,
} from "@/store"
import { move, pixelToIdx, resize, rotate } from "@/utils"
const STATE_COLOR_MAP = {
  [PixelState.empty]: "bg-gray-500/10",
  [PixelState.line]: "bg-gray-500/90",
  [PixelState.fill]: "bg-yellow-500/50",
  [PixelState.selected]: "bg-blue-500/50",
}
const pixels = ref<HTMLDivElement[]>()
const isSelecting = ref(false)
function getPixel({ value: { x, y } }: Ref<Pos>) {
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
  clearSelectStatus()
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

function transformPatcher({ clientX, clientY }: MouseEvent) {
  if (!transformType.value || isInitialMouse(initialMousePos)) {
    return
  }
  const { left, top, width, height } = getPixel(selectCentral).getBoundingClientRect()
  const centerPixel = { x: left + width / 2, y: top + height / 2 }
  const centerToInit = {
    y: initialMousePos.value.y - centerPixel.y,
    x: initialMousePos.value.x - centerPixel.x,
  }
  const centerToNow = {
    y: clientY - centerPixel.y, x: clientX - centerPixel.x,
  }
  if (transformType.value === "rotate") {
    rotate(centerToInit, centerToNow)
  } else if (transformType.value === "resize") {
    resize(centerToInit, centerToNow)
  } else {
    const p: never = transformType.value
  }
}
</script>

<template>
  <div flex flex-col select-none @mouseup="endTransform" @mousemove="transformPatcher">
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
