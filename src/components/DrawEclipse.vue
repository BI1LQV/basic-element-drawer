<script setup lang="ts">
import { reactive } from "vue"
import { drawLastTime, drawStateWithInterval, initPlayground, sizeX } from "@/store"
import { updatePixelToForm } from "@/utils"
import { centerEclipse } from "@/utils/drawEclipse"

let form = reactive({
  startX: 20,
  startY: 20,
  rX: 8,
  rY: 5,
})
async function drawEclipse() {
  // initPlayground()
  const { startX, startY, rX, rY } = form
  drawStateWithInterval(centerEclipse(startX, startY, rX, rY), drawLastTime.value / 4)
}
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="椭圆心">
      <PickPixel
        :x="form.startX" :y="form.startY"
        @update:pixel="updatePixelToForm($event, form, 'startX', 'startY')"
      ></PickPixel>
    </el-form-item>
    <el-form-item label="半长轴">
      <el-input-number v-model="form.rX" :min="0" :max="sizeX - 1" />
    </el-form-item>
    <el-form-item label="半短轴">
      <el-input-number v-model="form.rY" :min="0" :max="sizeX - 1" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="drawEclipse">画椭圆</el-button>
    </el-form-item>
  </el-form>
</template>

