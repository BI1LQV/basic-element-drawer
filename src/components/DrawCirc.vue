<script setup lang="ts">
import { reactive } from "vue"
import { drawInterval, drawState, initPlayground, sizeX } from "@/store"
import { centerCirc, sleep, updatePixelToForm } from "@/utils"

let form = reactive({
  startX: 10,
  startY: 10,
  r: 5,
})
async function drawCirc() {
  initPlayground()
  const { startX, startY, r } = form
  let circIter = centerCirc(startX, startY, r)
  for (let part of circIter) {
    drawState(part)
    await sleep(drawInterval.value)
  }
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

