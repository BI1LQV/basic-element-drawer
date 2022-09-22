let { abs, max, round } = Math
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
  let mainAxis
  let minorAxis
  let mainAxisEnd
  let dx = xb - xa
  let dy = yb - ya
  let dMainAxis
  let dMinorAxis

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

  let minorReversed = false
  if (dMinorAxis < 0) {
    minorAxis *= -1
    dMinorAxis *= -1
    minorReversed = true
  }

  let mainReversed = false
  if (dMainAxis < 0) {
    mainAxis *= -1
    dMainAxis *= -1
    mainAxisEnd *= -1
    mainReversed = true
  }

  let pi = 2 * dMinorAxis - dMainAxis
  let res = []
  res.push([mainAxis, minorAxis])
  mainAxis += 1
  for (;mainAxis <= mainAxisEnd; mainAxis++) {
    console.log(mainAxis)
    if (pi < 0) {
      pi += 2 * dMinorAxis
    } else {
      pi += -2 * dMainAxis + 2 * dMinorAxis
      minorAxis += 1
    }
    res.push([mainAxis, minorAxis])
  }
  if (minorReversed) {
    res = res.map(([main, minor]) => [main, minor * -1])
  }
  if (mainReversed) {
    res = res.map(([main, minor]) => [main * -1, minor])
  }
  if (xyReversed) {
    return res.map(([y, x]) => [x, y])
  }
  return res
}
