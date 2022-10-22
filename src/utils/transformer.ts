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

const RESIZE_MAT = (sx: number, sy: number) => [
  [sx, 0, 0],
  [0, sy, 0],
  [0, 0, 1],
]

function matrixChainMul(toTransform: [number, PixelState][], ...matrixs: number[][][]) {
  const finalMat = matrixs.reduce((pre, cur) => multiply(cur, pre) as number[][], [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])
  return toTransform.map(([idx, state]) => {
    const p = multiply(finalMat, [...idxToPixel(idx), 1]) as number[]
    const x = round(p[0])
    const y = round(p[1])
    if (isLegal(x, y)) {
      return [pixelToIdx(x, y), state]
    }
    return undefined
  }).filter(Boolean) as number[][]
}

export function resizeMix(
  toTransform: [number, PixelState][],
  theta: number,
  { x: cX, y: cY }: Pos,
  { x: tx, y: ty }: Pos,
  { x: sx, y: sy }: Pos) {
  const m1 = TRANSLATE_MAT(-cX, -cY)// 平移到原点
  const m2 = RESIZE_MAT(sy, sx)// 缩放
  const m3 = ROTATE_MAT(-theta)// 旋转
  const m4 = TRANSLATE_MAT(cX, cY)// 平移回去
  const m5 = TRANSLATE_MAT(ty, tx)// 平移
  return matrixChainMul(toTransform, m1, m2, m3, m4, m5)
}
