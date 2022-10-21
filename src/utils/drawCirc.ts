export function circCore(r: number) {
  // 画1/8圆的核心
  // 判断标志pi
  let p = 5 / 4 - r
  // 初始点的x，y
  let x = 0
  let y = r
  let res = []
  // 初始点塞进结果
  res.push([x, y])
  // 斜率绝对值小于1时
  for (; x < y; x++) {
    // 通过标志位判断下一个点 是否选择低点
    if (p < 0) {
      // 选择高点
      p += 2 * (x + 1) + 1
    } else {
      // 选择低点
      y -= 1
      p += 2 * (x + 1) + 1 - 2 * (y - 1)
    }
    res.push([x + 1, y])
  }
  return res
}

export function* centerCirc(x: number, y: number, r: number) {
  let core = circCore(r)
  // 把1/8个圆偏移到指定圆心 并且用对称的方法把剩下7块显示出来
  yield core.map(([x0, y0]) => [x + x0, y + y0])
  yield core.map(([x0, y0]) => [x - x0, y + y0])
  yield core.map(([x0, y0]) => [x + x0, y - y0])
  yield core.map(([x0, y0]) => [x - x0, y - y0])

  yield core.map(([x0, y0]) => [x + y0, y + x0])
  yield core.map(([x0, y0]) => [x - y0, y + x0])
  yield core.map(([x0, y0]) => [x + y0, y - x0])
  yield core.map(([x0, y0]) => [x - y0, y - x0])
}

