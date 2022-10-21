let { abs, max, round } = Math

export function DDALine(
  xa: number, ya: number, xb: number, yb: number,
) {
  // 计算两个坐标轴迭代delta
  let dx = xb - xa
  let dy = yb - ya
  // 自适应的step长度，到时候循环 谁长找谁迭代就行
  let steps = max(abs(dx), abs(dy))
  // 设定每步增量
  let xInc = dx / steps
  let yInc = dy / steps
  // 保证原坐标immutable 另外开一组新变量
  let x = xa
  let y = ya
  let res = []
  res.push([round(x), round(y)])
  // 迭代生成点
  for (let k = 0; k < steps; k++) {
    x += xInc
    y += yInc
    res.push([round(x), round(y)])
  }
  return res
}
// 用来标记是否有正负翻转 提高代码可读性 直接在代码里*-1或者设置一个布尔值也是可以的
enum SeqReverseFlag {
  reversed = -1,
  unReversed = 1,
}
export function BresenhamLine(
  xa: number, ya: number, xb: number, yb: number,
) {
  // 初始化主变量
  // 为了自适应从x轴还是y轴迭代 设置mainAxis和minorAxis 程序总是在main方向迭代
  let mainAxis, minorAxis, mainAxisEnd, dMainAxis, dMinorAxis
  // 计算delta
  let dx = xb - xa
  let dy = yb - ya

  let xyReversed = false
  // 判断从哪个方向迭代 给初始变量赋值
  if (abs(dx) > abs(dy)) {
    // 0<|m|<1; 从x迭代
    mainAxis = xa
    minorAxis = ya
    dMainAxis = dx
    dMinorAxis = dy
    mainAxisEnd = xb
  } else {
    // |m|>1; 从y迭代
    mainAxis = ya
    minorAxis = xa
    dMainAxis = dy
    dMinorAxis = dx
    mainAxisEnd = yb
    // 到时候return前还要交换一下xy
    xyReversed = true
  }
  // 除了从x轴还是y轴迭代，还有一个要考虑的问题是迭代是向正方形还是负方向
  // 上课给的算法只能做到向正方向迭代 所以这里做一些适配 把问题转化到向正方向的迭代
  // 默认不正负翻转
  let minorReversed = SeqReverseFlag.unReversed
  // 如果副轴的delta小于0 把整个迭代转成向正方向的
  if (dMinorAxis < 0) {
    minorAxis *= -1
    dMinorAxis *= -1
    minorReversed = SeqReverseFlag.reversed
  }
  // 主轴的正负反转 和上面一样
  let mainReversed = SeqReverseFlag.unReversed
  if (dMainAxis < 0) {
    mainAxis *= -1
    dMainAxis *= -1
    mainAxisEnd *= -1
    mainReversed = SeqReverseFlag.reversed
  }
  // 主逻辑
  // 计算pi 用于判断下一个点选择
  let pi = 2 * dMinorAxis - dMainAxis
  let res = []
  // 把第一个点塞到结果数组
  res.push([mainAxis, minorAxis])
  mainAxis += 1
  // 在主轴迭代
  for (;mainAxis <= mainAxisEnd; mainAxis++) {
    if (pi >= 0) {
      pi += -2 * dMainAxis
      minorAxis += 1
    }
    pi += 2 * dMinorAxis
    res.push([mainAxis, minorAxis])
  }
  // 如果迭代方向本来是负方向的 需要在这里反转回去
  if (minorReversed + mainReversed !== SeqReverseFlag.unReversed * 2) {
    res = res.map(([main, minor]) => [
      main * mainReversed, minor * minorReversed,
    ])
  }
  // 如果在y轴迭代 在这里交换xy位置 反转回去
  if (xyReversed) {
    return res.map(([y, x]) => [x, y])
  }
  return res
}
