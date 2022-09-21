<script setup lang="ts">
import { reactive } from "vue"
// @ts-expect error
import {
  Pointer,
} from "@element-plus/icons-vue"
import { LineAlgorism, PixelState } from "@/model"
import { drawState, initPlayground, playgroundState, requestPoint, sizeX, sizeY } from "@/store"
import { BresenhamLine, DDALine, pixelToIdx } from "@/utils"
let form = reactive({
  algorism: LineAlgorism.DDA,
  startX: 0,
  startY: 0,
  endX: 3,
  endY: 3,
})
function drawLine() {
  initPlayground()
  const { startX, startY, endX, endY, algorism } = form
  if (algorism === LineAlgorism.DDA) {
    drawState(DDALine(startX, startY, endX, endY))
  } else if (algorism === LineAlgorism.Bresenham) {
    console.log(BresenhamLine(startX, startY, endX, endY))
    drawState(BresenhamLine(startX, startY, endX, endY))
  }
}
type FormKey = keyof typeof form
async function pickPoint(target: typeof form, xAttrName: FormKey, yAttrName: FormKey) {
  const originIdx = pixelToIdx(target[xAttrName], target[yAttrName])
  if (playgroundState.value[originIdx] === PixelState.line) {
    playgroundState.value[originIdx] = PixelState.empty
  }
  let [x, y] = await requestPoint()
  target[xAttrName] = x
  target[yAttrName] = y
}
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="起始点">
      <el-input-number v-model="form.startX" :min="0" :max="sizeX - 1" />
      <span m-1 text-xl>,</span>
      <el-input-number v-model="form.startY" :min="0" :max="sizeY - 1" />
      <el-button type="primary" :icon="Pointer" size="small" circle @click="pickPoint(form, 'startX', 'startY')" />
    </el-form-item>
    <el-form-item label="结束点">
      <el-input-number v-model="form.endX" :min="0" :max="sizeX - 1" />
      <span m-1 text-xl>,</span>
      <el-input-number v-model="form.endY" :min="0" :max="sizeY - 1" />
      <el-button type="primary" :icon="Pointer" size="small" circle @click="pickPoint(form, 'endX', 'endY')" />
    </el-form-item>
    <el-form-item label="选择算法">
      <el-radio-group v-model="form.algorism" class="ml-4">
        <el-radio :label="LineAlgorism.DDA" size="large">DDA</el-radio>
        <el-radio :label="LineAlgorism.Bresenham" size="large">Bresenham</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="drawLine">画线</el-button>
    </el-form-item>
  </el-form>
</template>
