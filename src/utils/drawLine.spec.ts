import { describe, expect, it } from "vitest"
import { BresenhamLine, DDALine } from "./drawLine"

describe("draw line", () => {
  it("dda should works", () => {
    expect(DDALine(3, 3, 9, 13)).toMatchSnapshot()
    expect(DDALine(1, 1, 6, 5)).toMatchSnapshot()
    expect(DDALine(1, 1, 6, 8)).toMatchSnapshot()
    expect(DDALine(9, 13, 3, 3)).toMatchSnapshot()
    expect(DDALine(-3, 3, -13, 11)).toMatchSnapshot()
  })
})

describe("draw line", () => {
  it("Bresenham should works", () => {
    expect(BresenhamLine(3, 3, 9, 6)).toEqual(DDALine(3, 3, 9, 6))
    expect(BresenhamLine(1, 1, 6, 5)).toEqual(DDALine(1, 1, 6, 5))
    expect(BresenhamLine(1, 1, 6, 6)).toEqual(DDALine(1, 1, 6, 6))
    expect(BresenhamLine(1, 1, 6, 8)).toEqual(DDALine(1, 1, 6, 8))
    expect(BresenhamLine(9, 13, 3, 3)).toEqual(DDALine(9, 13, 3, 3))
    expect(BresenhamLine(-3, 3, -13, 11)).toEqual(DDALine(-3, 3, -13, 11))
  })
})
