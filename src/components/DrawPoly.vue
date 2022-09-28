<script setup lang="ts">
import { ref, watch } from "vue"
import { drawStateWithInterval, requestPoint, stopRequestPoint } from "@/store"
import { DDALine } from "@/utils"

let prePoint: null | number[] = null
let drawing = ref(false)
function drawPoly() {
  drawing.value = true
}
function stopPoly() {
  drawing.value = false
}
watch(drawing, async () => {
  while (drawing.value) {
    let nextPoint = await requestPoint()
    if (prePoint) {
      const pixels = DDALine(prePoint[0], prePoint[1], nextPoint[0], nextPoint[1])
      drawStateWithInterval(pixels, 200)
    }

    prePoint = nextPoint
  }
  prePoint = null
  if (!drawing.value) {
    stopRequestPoint()
  }
})
</script>

<template>
  <el-form label-width="120px">
    <el-form-item>
      <el-button type="primary" @click="drawPoly">开始画</el-button>
      <el-button type="primary" @click="stopPoly">停止画</el-button>
    </el-form-item>
  </el-form>
</template>

