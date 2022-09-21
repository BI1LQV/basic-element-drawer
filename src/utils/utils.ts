import { sizeY } from "@/store"
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
