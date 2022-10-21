import { PixelState } from "@/model"

export function getThisLine(
  playground: PixelState[],
  maxX: number, y: number,
) {
  // 获取本行的helper函数
  return Array.from({ length: maxX }, (_, i) => i)
    .map(i => i + y * maxX).filter(i => playground[i] === PixelState.line)
}

export function* fill(
  playground: PixelState[],
  maxX: number, maxY: number,
) {
  // 每行扫描
  for (let y = maxY - 1; y >= 0; y--) {
    // 一些初始化
    let x1 = 0
    let x2 = maxX - 1

    let x1Draw = false
    let x2Draw = false
    let x1Moving = true
    let res: number[] = []
    // 双指针探测
    while (x1 < x2) {
      if (x1Moving) {
        // 左指针运动
        while (playground[x1 + y * maxX] !== PixelState.line && x1 <= x2) {
          if (x1Draw) {
            // 填充
            res.push(x1 + y * maxX)
          }
          x1++
        }
        x1++
        // 与另一个指针交替控制权
        x1Draw = !x1Draw
        x1Moving = false
      } else {
        // 右指针运动
        while (playground[x2 + y * maxX] !== PixelState.line && x1 <= x2) {
          if (x2Draw) {
            // 填充
            res.push(x2 + y * maxX)
          }
          x2--
        }
        x2--
        // 与另一个指针交替控制权
        x2Draw = !x2Draw
        x1Moving = true
      }
    }
    yield res
  }
}
