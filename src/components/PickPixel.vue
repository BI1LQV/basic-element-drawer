<script setup lang="ts">
import { toRefs } from "vue"
import { Pointer } from "@element-plus/icons-vue"
import { playgroundState, requestPoint, sizeX, sizeY } from "@/store"
import { pixelToIdx } from "@/utils"
import { PixelState } from "@/model"
const props = defineProps<{ x: number; y: number }>()

const emit = defineEmits<{
  (evt: "update:pixel", value: number[]): void
}>()

let { x, y } = toRefs(props)

function updateX(i: number) {
  emit("update:pixel", [i, y.value])
}

function updateY(i: number) {
  emit("update:pixel", [x.value, i])
}

async function pickPoint() {
  const originIdx = pixelToIdx(x.value, y.value)
  if (playgroundState.value[originIdx] === PixelState.selected) {
    playgroundState.value[originIdx] = PixelState.empty
  }
  let [x1, y1] = await requestPoint()
  emit("update:pixel", [x1, y1])
}
</script>

<template>
  <el-input-number :model-value="x" :min="0" :max="sizeX - 1" @update:model-value="updateX" />
  <span m-1 text-xl>,</span>
  <el-input-number :model-value="y" :min="0" :max="sizeY - 1" @update:model-value="updateY" />
  <el-button
    type="primary" :icon="Pointer"
    size="small" circle @click="pickPoint"
  />
</template>
