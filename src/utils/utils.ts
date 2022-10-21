import { type Ref, computed } from "vue"
import { sizeY } from "@/store"
import type { Pos } from "@/model"
export function pixelToIdx(x: number, y: number) {
  return x * sizeY.value + y
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0)
    }, ms)
  })
}

export function updatePixelToForm<T, K extends keyof T>(
  [x, y]: T[K][],
  target: T, attrX: K, attrY: K,
) {
  target[attrX] = x
  target[attrY] = y
}

export function is2DArray<T>(arr: T[][] | T[]): arr is T[][] {
  return Array.isArray(arr[0])
}

export function usePx<T extends Record<string, number>>(o: T) {
  return computed(() => Object.entries(o).map(([key, val]) => [key, `${val}px`])
    .reduce((pre, [key, val]) => ({ ...pre, [key]: val }),
      ({} as Record<keyof T, string>)))
}

export function useRad(i: Ref<number>) {
  return computed(() => `${i.value}rad`)
}

export function useXY(pos: Ref<Pos>, withPx = false) {
  if (withPx) {
    return computed(() => `${pos.value.x}px ,${pos.value.y}px`)
  }
  return computed(() => `${pos.value.x} ,${pos.value.y}`)
}
