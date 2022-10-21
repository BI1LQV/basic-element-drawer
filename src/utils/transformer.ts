import type { Pos } from "@/model"
import { moveDiff, resizeDiff, rotateAngle } from "@/store"

export function rotate(init: Pos, now: Pos) {
  const initialAngle = Math.atan2(init.y, init.x)
  const afterAngle = Math.atan2(now.y, now.x)
  rotateAngle.value = afterAngle - initialAngle
}

export function resize(init: Pos, now: Pos) {
  resizeDiff.value = { x: now.x / init.x, y: now.y / init.y }
}
