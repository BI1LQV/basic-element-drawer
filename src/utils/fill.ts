import { PixelState } from "@/model"

export function getThisLine(
  playground: PixelState[],
  maxX: number, y: number,
) {
  return Array.from({ length: maxX }, (_, i) => i)
    .map(i => i + y * maxX).filter(i => playground[i] === PixelState.line)
}

export function* fill(
  playground: PixelState[],
  maxX: number, maxY: number,
) {
  for (let y = maxY - 1; y >= 0; y--) {
    let x1 = 0
    let x2 = maxX - 1

    let x1Draw = false
    let x2Draw = false
    let x1Moving = true
    let res: number[] = []
    while (x1 < x2) {
      if (x1Moving) {
        while (playground[x1 + y * maxX] !== PixelState.line && x1 <= x2) {
          if (x1Draw) {
            res.push(x1 + y * maxX)
          }
          x1++
        }
        x1++
        x1Draw = true
        x1Moving = false
      } else {
        while (playground[x2 + y * maxX] !== PixelState.line && x1 <= x2) {
          if (x2Draw) {
            res.push(x2 + y * maxX)
          }
          x2--
        }
        x2--
        x2Draw = true
        x1Moving = true
      }
    }
    yield res
  }
}
