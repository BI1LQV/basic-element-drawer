<script lang="ts" setup>
import { PixelState } from "@/model"
import { allowClick, clickedPoint, playgroundState, requestPoint, sizeX, sizeY } from "@/store"
import { pixelToIdx } from "@/utils"
const STATE_COLOR_MAP = {
  [PixelState.empty]: "bg-gray-500/10",
  [PixelState.line]: "bg-gray-500/90",
  [PixelState.fill]: "bg-yellow-500/50",
  [PixelState.selected]: "bg-blue-500/50",
}
// let isDrawing = false
function drawPixel(x: number, y: number) {
  // if (!isDrawing) { return }
  if (!allowClick.value) { return }
  clickedPoint.value = `${x}_${y}`
  playgroundState.value[pixelToIdx(x, y)] = PixelState.selected
}

// function startDraw() {
//   isDrawing = true
// }
// function endDraw() {
//   isDrawing = false
// }
</script>

<template>
  <!-- <div flex flex-col @mousedown="startDraw" @mouseup="endDraw">
    <div v-for="x of sizeX" :key="x" flex flex-grow flex-row>
      <div
        v-for="y of sizeY" :key="y"
        flex-grow class="m-0.2"
        :class="STATE_COLOR_MAP[ playgroundState[(x - 1) * sizeY + (y - 1)] ]"
        @mouseover="drawPixel((x - 1) * sizeY + (y - 1))"
      ></div>
    </div>
  </div> -->
  <div flex flex-col>
    <div v-for="x of sizeX" :key="x" flex flex-grow flex-row>
      <div
        v-for="y of sizeY" :key="y"
        flex-grow class="m-0.1"
        :class="STATE_COLOR_MAP[ playgroundState[(x - 1) * sizeY + (y - 1)] ]"
        @click="drawPixel(x - 1, y - 1)"
      ></div>
    </div>
  </div>
</template>
