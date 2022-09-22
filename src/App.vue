<script setup lang="ts">
import Playground from "./components/Playground.vue"
import ControlPanel from "./components/ControlPanel.vue"
import PlaygroundController from "./components/PlaygroundController.vue"
</script>

<template>
  <PlaygroundController></PlaygroundController>
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
