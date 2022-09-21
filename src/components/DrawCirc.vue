<script setup lang="ts">
import { reactive } from "vue"
// @ts-expect error
import {
  Pointer,
} from "@element-plus/icons-vue"
import { PixelState } from "@/model"
import { drawInterval, drawState, initPlayground, playgroundState, requestPoint, sizeX, sizeY } from "@/store"
import { centerCirc, pixelToIdx, sleep } from "@/utils"

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
    <el-form-item label="圆心">
      <el-input-number v-model="form.startX" :min="0" :max="sizeX - 1" />
      <span m-1 text-xl>,</span>
      <el-input-number v-model="form.startY" :min="0" :max="sizeY - 1" />
      <el-button type="primary" :icon="Pointer" size="small" circle @click="pickPoint(form, 'startX', 'startY')" />
    </el-form-item>
    <el-form-item label="半径">
      <el-input-number v-model="form.r" :min="0" :max="sizeX - 1" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="drawCirc">画圆</el-button>
    </el-form-item>
  </el-form>
</template>

