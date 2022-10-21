const { round } = Math
export function eclipseCore(Rx: number, Ry: number) {
  // 定义初始值
  let Rx2 = Rx * Rx
  let Ry2 = Ry * Ry
  let twoRx2 = 2 * Rx2
  let twoRy2 = 2 * Ry2
  let p
  let x = 0
  let y = Ry
  let px = 0
  let py = twoRx2 * y
  let res = []
  // 初始点
  res.push([x, y])
  // 上半块
  // 判断标志位
  p = round(Ry2 - (Rx2 * Ry) + (0.25 * Rx2))
  while (px < py) {
    x++
    px += twoRy2
    if (p < 0) {
      // 选择高点
      p += Ry2 + px
    } else {
      // 选择低点
      y--
      py -= twoRx2
      p += Ry2 + px - py
    }
    res.push([x, y])
  }
  // 以斜率为-1为分界点
  // 下半块
  p = round(Ry2 * (x + 0.5) * (x + 0.5) + Rx2 * (y - 1) * (y - 1) - Rx2 * Ry2)
  while (y > 0) {
    y--
    py -= twoRx2
    if (p > 0) {
      p += Rx2 - py
    } else {
      x++
      px += twoRx2
      p += Rx2 - py + px
    }
    res.push([x, y])
  }
  return res
}

export function* centerEclipse(x: number, y: number, Rx: number, Ry: number) {
  // 因为椭圆的eclipseCore实际上做了两个1/8椭圆 所以这里算偏移和对称只需要四次
  let core = eclipseCore(Rx, Ry)
  yield core.map(([x0, y0]) => [x + y0, y + x0])
  yield core.map(([x0, y0]) => [x - y0, y + x0])
  yield core.map(([x0, y0]) => [x + y0, y - x0])
  yield core.map(([x0, y0]) => [x - y0, y - x0])
}
