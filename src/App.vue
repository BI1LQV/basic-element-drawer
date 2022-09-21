<script setup lang="ts">
import Playground from "./components/Playground.vue"
import { drawInterval, initPlayground, sizeX, sizeY } from "./store"
import ControlPanel from "./components/ControlPanel.vue"
</script>

<template>
  <div>
    画板分辨率：
    X:<el-input-number v-model="sizeX" m-3></el-input-number>
    Y:<el-input-number v-model="sizeY" m-3></el-input-number>
    绘画各步间隔(ms):<el-input-number v-model="drawInterval" m-3 :step="100" :min="0"></el-input-number>
    <el-button type="danger" @click="initPlayground">清除</el-button>
  </div>
  <div h-full w-full flex class="main-base">
    <ControlPanel class="control-panel-base"></ControlPanel>
    <Playground class="playground-base aspect-square"></Playground>
  </div>
</template>

<style>
  @media screen and (orientation:portrait) {
    .playground-base {
      @apply w-2/3
    }
    .control-panel-base{
      @apply w-2/3
    }
    .main-base{
      @apply flex-col items-center
    }
  }

  @media screen and (orientation:landscape) {
    .playground-base {
      @apply h-2/3
    }
    .control-panel-base{
      @apply w-1/3
    }
    .main-base{
      @apply justify-around
    }
  }
</style>
