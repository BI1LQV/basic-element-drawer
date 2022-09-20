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
  // dx>0,dy>0,0<m<1
  let xi = xa
  let yi = ya
  let dx = xb - xa// 6
  let dy = yb - ya// 3
  let pi = 2 * dy - dx
  let res = []
  for (;xi <= xb; xi++) {
    if (pi <= 0) {
      pi += 2 * dy
    } else {
      pi += -2 * dx
      yi += 1
    }

    res.push([xi, yi])
  }
  return res
}
