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
