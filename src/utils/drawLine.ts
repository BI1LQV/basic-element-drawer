let { abs, max, round } = Math
enum SeqReverseFlag {
  reversed = -1,
  unReversed = 1,
}
export function DDALine(xa: number, ya: number, xb: number, yb: number) {
  let dx = xb - xa
  let dy = yb - ya
  let steps = max(abs(dx), abs(dy))
  let xInc = dx / steps
  let yInc = dy / steps

  let x = xa
  let y = ya
  let res = []
  res.push([round(x), round(y)])
  for (let k = 0; k < steps; k++) {
    x += xInc
    y += yInc
    res.push([round(x), round(y)])
  }
  return res
}

export function BresenhamLine(xa: number, ya: number, xb: number, yb: number) {
  let mainAxis, minorAxis, mainAxisEnd, dMainAxis, dMinorAxis
  let dx = xb - xa
  let dy = yb - ya

  let xyReversed = false
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
    xyReversed = true
  }

  let minorReversed = SeqReverseFlag.unReversed
  if (dMinorAxis < 0) {
    minorAxis *= -1
    dMinorAxis *= -1
    minorReversed = SeqReverseFlag.reversed
  }

  let mainReversed = SeqReverseFlag.unReversed
  if (dMainAxis < 0) {
    mainAxis *= -1
    dMainAxis *= -1
    mainAxisEnd *= -1
    mainReversed = SeqReverseFlag.reversed
  }
  // main logic
  let pi = 2 * dMinorAxis - dMainAxis
  let res = []
  res.push([mainAxis, minorAxis])
  mainAxis += 1
  for (;mainAxis <= mainAxisEnd; mainAxis++) {
    if (pi >= 0) {
      pi += -2 * dMainAxis
      minorAxis += 1
    }
    pi += 2 * dMinorAxis
    res.push([mainAxis, minorAxis])
  }

  if (minorReversed + mainReversed !== SeqReverseFlag.unReversed * 2) {
    res = res.map(([main, minor]) => [main * mainReversed, minor * minorReversed])
  }
  if (xyReversed) {
    return res.map(([y, x]) => [x, y])
  }
  return res
}
