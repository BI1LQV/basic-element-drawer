<script setup lang="ts">
import { reactive } from "vue"
import { drawLastTime, drawStateWithInterval, initPlayground, sizeX } from "@/store"
import { centerCirc, updatePixelToForm } from "@/utils"

let form = reactive({
  startX: 20,
  startY: 20,
  r: 16,
})
async function drawCirc() {
  initPlayground()
  const { startX, startY, r } = form
  drawStateWithInterval(centerCirc(startX, startY, r), drawLastTime.value / 8)
}
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="圆心">
      <PickPixel
        :x="form.startX" :y="form.startY"
        @update:pixel="updatePixelToForm($event, form, 'startX', 'startY')"
      ></PickPixel>
    </el-form-item>
    <el-form-item label="半径">
      <el-input-number v-model="form.r" :min="0" :max="sizeX - 1" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="drawCirc">画圆</el-button>
    </el-form-item>
  </el-form>
</template>

