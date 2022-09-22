<script setup lang="ts">
import { drawLastTime, initPlayground, sizeX, sizeY } from "@/store"
</script>

<template>
  <div flex class="controller">
    <div>
      画板分辨率：
      X:<el-input-number v-model="sizeX" m-3></el-input-number>
      Y:<el-input-number v-model="sizeY" m-3></el-input-number>
    </div>
    <div>
      绘画持续时间(ms):<el-input-number v-model="drawLastTime" m-3 :step="100" :min="0"></el-input-number>
      <el-button type="danger" @click="initPlayground">清除</el-button>
    </div>
  </div>
</template>

<style>
    @media screen and (min-width:880px){
    .controller {
      @apply flex-row
    }
  }
  @media screen and (max-width:880px){
    .controller {
      @apply flex-col
    }
  }
</style>
