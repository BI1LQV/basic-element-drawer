export function centerCirc(centerX: number, centerY: number, r: number) {
  // debugger
  let p = 5 / 4 - r
  let y = centerY + r
  let res = []
  res.push([centerX, y])
  for (let x = centerX; x <= centerY; x++) {
    if (p < 0) {
      res.push([x + 1, y])
      p += 2 * (x + 1) + 1
    } else {
      y -= 1
      res.push([x + 1, y - 1])
      p += 2 * (x + 1) + 1 - 2 * (y - 1)
    }
  }
  return res
}

