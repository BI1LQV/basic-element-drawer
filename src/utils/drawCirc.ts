export function circCore(r: number) {
  // debugger
  let p = 5 / 4 - r
  let x = 0
  let y = r
  let res = []
  res.push([x, y])
  for (; x < y; x++) {
    if (p < 0) {
      p += 2 * (x + 1) + 1
    } else {
      y -= 1
      p += 2 * (x + 1) + 1 - 2 * (y - 1)
    }
    res.push([x + 1, y])
  }
  return res
}

export function* centerCirc(x: number, y: number, r: number) {
  let core = circCore(r)
  yield core.map(([x0, y0]) => [x + x0, y + y0])
  yield core.map(([x0, y0]) => [x - x0, y + y0])
  yield core.map(([x0, y0]) => [x + x0, y - y0])
  yield core.map(([x0, y0]) => [x - x0, y - y0])

  yield core.map(([x0, y0]) => [x + y0, y + x0])
  yield core.map(([x0, y0]) => [x - y0, y + x0])
  yield core.map(([x0, y0]) => [x + y0, y - x0])
  yield core.map(([x0, y0]) => [x - y0, y - x0])
}

