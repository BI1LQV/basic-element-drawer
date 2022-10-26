<script lang="ts" setup>
import { type Ref, ref } from "vue"
import Selector from "./Selector.vue"
import { PixelState, type Pos } from "@/model"
import {
  InitialMouse, allowClick,
  clearInherit, clearSelectStatus,
  clickedPoint,
  inheritThree,
  initialMousePos, isInitialMouse,
  playgroundState, selectStart, setSelectEnd,
  sizeX,
  sizeY,
  stopTransform,
  transformType,
  transformedSelectCentral,
} from "@/store"
import { move, pixelToIdx, resize, rotate, xyToId } from "@/utils"
const STATE_COLOR_MAP = {
  [PixelState.empty]: "bg-gray-500/10",
  [PixelState.line]: "bg-gray-500/90",
  [PixelState.fill]: "bg-yellow-500/50",
  [PixelState.selected]: "bg-blue-500/50",
}

const isSelecting = ref(false)
function getPixel({ value: { x, y } }: Ref<Pos>) {
  return document.getElementById(xyToId(x, y))!
}

function drawPixel(x: number, y: number) {
  if (!allowClick.value) { return }
  clickedPoint.value = `${x}_${y}`
  playgroundState.value[pixelToIdx(x, y)] = PixelState.selected
}

function startSelecting(x: number, y: number) {
  // 开始框选变形区域
  selectStart.value = { x, y }// 设置框选初始点
  isSelecting.value = true// 设置框选flag
  clearSelectStatus()// 清除之前的图形变形参数
  clearInherit()// 清除之前的图形变形继承
  stopTransform.value()// 清除之前对变形参数的watcher
}
function showSelecting(x: number, y: number) {
  if (!isSelecting.value) { return }
  setSelectEnd(x, y)
}

function endSelecting() {
  isSelecting.value = false
}

function endTransform() {
  initialMousePos.value = InitialMouse()
  inheritThree()
}

function transformPatcher({ clientX, clientY }: MouseEvent) {
  // 鼠标移动时 做事件派发
  if (!transformType.value || isInitialMouse(initialMousePos)) {
    // 没有transformType 或者初始鼠标位置为初始值 则不处在框选状态 不需要派发事件
    return
  }
  const { left, top, width, height } = getPixel(transformedSelectCentral).getBoundingClientRect()
  const centerPixel = { x: left + width / 2, y: top + height / 2 }
  const centerToInit = {
    y: initialMousePos.value.y - centerPixel.y,
    x: initialMousePos.value.x - centerPixel.x,
  }
  // 计算图形中心到鼠标位置的向量
  const centerToNow = {
    y: clientY - centerPixel.y, x: clientX - centerPixel.x,
  }
  // 根据变化类型派发事件
  if (transformType.value === "rotate") {
    rotate(centerToInit, centerToNow)
  } else if (transformType.value === "resize") {
    resize(centerToInit, centerToNow)
  } else if (transformType.value === "move") {
    move(centerToInit, centerToNow)
  } else {
    const no: never = transformType.value
  }
}
</script>

<template>
  <div
    flex flex-col select-none
    @mouseup="endTransform" @mousemove="transformPatcher"
  >
    <div v-for="x of sizeX" :key="x" flex flex-grow flex-row>
      <div
        v-for="y of sizeY" :id="xyToId(x - 1, y - 1)"
        :key="y"
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
