<script lang="ts" setup>
import DrawLine from "./DrawLine.vue"
</script>

<template>
  <el-menu default-active="1">
    <el-sub-menu index="1">
      <template #title>
        <span>画线</span>
      </template>
      <DrawLine></DrawLine>
    </el-sub-menu>
  </el-menu>
</template>
