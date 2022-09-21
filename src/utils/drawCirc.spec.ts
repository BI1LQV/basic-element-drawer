import { describe, expect, it } from "vitest"
import { centerCirc, circCore } from "./drawCirc"

describe("draw circ", () => {
  it("should works", () => {
    expect(circCore(3)).toMatchInlineSnapshot(`
      [
        [
          0,
          3,
        ],
        [
          1,
          3,
        ],
        [
          2,
          2,
        ],
      ]
    `)
    const circ = centerCirc(5, 5, 3)
    expect(circ.next().value).toMatchInlineSnapshot(`
      [
        [
          5,
          8,
        ],
        [
          6,
          8,
        ],
        [
          7,
          7,
        ],
      ]
    `)
  })
})
