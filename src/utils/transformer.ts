import { multiply } from "mathjs"
import { idxToPixel, isLegal, pixelToIdx } from "./utils"
import type { PixelState, Pos } from "@/model"
import { inheritMoveDiff, inheritResizeDiff, inheritRotateAngle, moveDiff, resizeDiff, rotateAngle } from "@/store"

export function rotate(init: Pos, now: Pos) {
  const initialAngle = Math.atan2(init.y, init.x)
  const afterAngle = Math.atan2(now.y, now.x)
  rotateAngle.value = afterAngle - initialAngle + inheritRotateAngle.value
}

export function resize(init: Pos, now: Pos) {
  resizeDiff.value = { x: now.x / init.x * inheritResizeDiff.value.x, y: now.y / init.y * inheritResizeDiff.value.y }
}

export function move(init: Pos, now: Pos) {
  moveDiff.value = { x: (now.x - init.x) + inheritMoveDiff.value.x, y: now.y - init.y + inheritMoveDiff.value.y }
}
const { cos, sin, round } = Math

const TRANSLATE_MAT = (tx: number, ty: number) => [
  [1, 0, tx],
  [0, 1, ty],
  [0, 0, 1],
]

const ROTATE_MAT = (theta: number) => [
  [cos(theta), -sin(theta), 0], // 不需要另外保存sin cos值 js引擎会自动优化
  [sin(theta), cos(theta), 0],
  [0, 0, 1],
]

export function rotatePixel(toTransform: [number, PixelState][], { x: cX, y: cY }: Record<"x" | "y", number>, theta: number) {
  const m1 = TRANSLATE_MAT(-cX, -cY)
  const m2 = ROTATE_MAT(-theta)
  const m3 = TRANSLATE_MAT(cX, cY)
  return toTransform.map(([idx, state]) => {
    const p0 = [...idxToPixel(idx), 1]// 原来的点
    const p1 = multiply(m1, p0)// 平移到原点
    const p2 = multiply(m2, p1) // 旋转
    const p3 = multiply(m3, p2) as number[]// 转回去
    const x = round(p3[0])
    const y = round(p3[1])
    if (isLegal(x, y)) {
      return [pixelToIdx(x, y), state]
    }
    return undefined
  }).filter(Boolean) as number[][]
}
