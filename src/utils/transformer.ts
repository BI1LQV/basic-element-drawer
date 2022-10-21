import type { Pos } from "@/model"
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
