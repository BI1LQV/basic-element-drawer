<script setup lang="ts">
import Playground from "./components/Playground.vue"
import { sizeX, sizeY } from "./store"
</script>

<template>
  <div>
    X:<el-input-number v-model="sizeX" m-3></el-input-number>
    Y:<el-input-number v-model="sizeY" m-3></el-input-number>
  </div>
  <Playground class="w-4/5 aspect-square"></Playground>
</template>
