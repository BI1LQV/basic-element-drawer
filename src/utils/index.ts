import { sizeY } from "@/store"
export * from "./drawLine"
export function pixelToIdx(x: number, y: number) {
  return x * sizeY.value + y
}
