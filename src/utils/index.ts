import { sizeY } from "@/store"
export * from "./drawLine"
export * from "./drawCirc"
export function pixelToIdx(x: number, y: number) {
  return x * sizeY.value + y
}
