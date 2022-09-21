import { sizeY } from "@/store"
export * from "./drawLine"
export * from "./drawCirc"
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

export function updatePixelToForm(
  [x, y]: number[],
  target: any, attrX: string, attrY: string,
) {
  target[attrX] = x
  target[attrY] = y
}
