<script lang="ts" setup>
import DrawLine from "./DrawLine.vue"
import DrawCirc from "./DrawCirc.vue"
import DrawEclipse from "./DrawEclipse.vue"
import DrawPoly from "./DrawPoly.vue"
</script>

<template>
  <el-menu>
    <el-sub-menu index="1">
      <template #title>
        <span>画线</span>
      </template>
      <DrawLine></DrawLine>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <span>画圆</span>
      </template>
      <DrawCirc></DrawCirc>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <span>画椭圆</span>
      </template>
      <DrawEclipse></DrawEclipse>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <span>画多边形</span>
      </template>
      <DrawPoly></DrawPoly>
    </el-sub-menu>
  </el-menu>
</template>
