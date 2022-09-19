<script setup lang="ts">
import { reactive } from "vue"
import { LineAlgorism } from "@/model"
let form = reactive({
  algorism: LineAlgorism.DDA,
  startX: 0,
  startY: 0,
  endX: 3,
  endY: 3,
})
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="起始点">
      <el-input-number v-model="form.startX" :min="1" :max="10" />
      <span m-1 text-xl>,</span>
      <el-input-number v-model="form.startY" :min="1" :max="10" />
    </el-form-item>
    <el-form-item label="起始点"></el-form-item>
    <el-form-item label="选择算法">
      <el-radio-group v-model="form.algorism" class="ml-4">
        <el-radio :label="LineAlgorism.DDA" size="large">DDA</el-radio>
        <el-radio :label="LineAlgorism.Bresenham" size="large">Bresenham</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
