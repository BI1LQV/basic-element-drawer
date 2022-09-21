import { describe, expect, it } from "vitest"
import { centerCirc } from "./drawCirc"

describe("draw circ", () => {
  it("should works", () => {
    expect(centerCirc(5, 5, 3)).toMatchInlineSnapshot(`
      [
        [
          5,
          3,
        ],
        [
          6,
          3,
        ],
      ]
    `)
  })
})
