import { describe, expect, it } from "vitest"
import { DDALine } from "./drawLine"

describe("draw line", () => {
  it("dda should works", () => {
    expect(DDALine(3, 3, 9, 13)).toMatchInlineSnapshot(`
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
          4,
          5,
        ],
        [
          5,
          6,
        ],
        [
          5,
          7,
        ],
        [
          6,
          8,
        ],
        [
          7,
          9,
        ],
        [
          7,
          10,
        ],
        [
          8,
          11,
        ],
        [
          8,
          12,
        ],
        [
          9,
          13,
        ],
      ]
    `)
  })
})
