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
    expect(BresenhamLine(3, 3, 9, 6)).toMatchInlineSnapshot(`
      [
        [
          3,
          3,
        ],
        [
          4,
          4,
        ],
        [
          5,
          4,
        ],
        [
          6,
          4,
        ],
        [
          7,
          5,
        ],
        [
          8,
          5,
        ],
        [
          9,
          5,
        ],
      ]
    `)
    expect(BresenhamLine(3, 3, 9, 6)).toEqual(DDALine(3, 3, 9, 6))
    // expect(BresenhamLine(1, 1, 6, 5)).toMatchSnapshot()
    // expect(BresenhamLine(1, 1, 6, 8)).toMatchSnapshot()
    // expect(BresenhamLine(9, 13, 3, 3)).toMatchSnapshot()
    // expect(BresenhamLine(-3, 3, -13, 11)).toMatchSnapshot()
  })
})
