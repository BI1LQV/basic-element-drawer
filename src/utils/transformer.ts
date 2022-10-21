import { initialMousePos, isInitialMouse, rotateAngle } from "@/store"

export function rotate(ev: MouseEvent, centralDom: HTMLDivElement) {
  if (isInitialMouse(initialMousePos)) { return }
  const { clientX, clientY } = ev
  const { left, top, width, height } = centralDom.getBoundingClientRect()
  const centerPixel = { x: left + width / 2, y: top + height / 2 }

  const initialAngle = Math.atan2(
    initialMousePos.value.y - centerPixel.y,
    initialMousePos.value.x - centerPixel.x)
  const afterAngle = Math.atan2(clientY - centerPixel.y, clientX - centerPixel.x)
  rotateAngle.value = afterAngle - initialAngle
}
