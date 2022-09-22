<script setup lang="ts">
import { reactive } from "vue"
import PickPixel from "./PickPixel.vue"
import { LineAlgorism } from "@/model"
import { drawLastTime, drawStateWithInterval, initPlayground } from "@/store"
import { BresenhamLine, DDALine, updatePixelToForm } from "@/utils"
let form = reactive({
  algorism: LineAlgorism.DDA,
  startX: 5,
  startY: 6,
  endX: 20,
  endY: 11,
})
function drawLine() {
  initPlayground()
  const { startX, startY, endX, endY, algorism } = form
  if (algorism === LineAlgorism.DDA) {
    const pixels = DDALine(startX, startY, endX, endY)
    drawStateWithInterval(pixels, drawLastTime.value / pixels.length)
  } else if (algorism === LineAlgorism.Bresenham) {
    const pixels = BresenhamLine(startX, startY, endX, endY)
    drawStateWithInterval(pixels, drawLastTime.value / pixels.length)
  }
}
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="起始点">
      <PickPixel
        :x="form.startX" :y="form.startY"
        @update:pixel="updatePixelToForm($event, form, 'startX', 'startY')"
      ></PickPixel>
    </el-form-item>
    <el-form-item label="结束点">
      <PickPixel
        :x="form.endX" :y="form.endY"
        @update:pixel="updatePixelToForm($event, form, 'endX', 'endY')"
      ></PickPixel>
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
