import { describe, expect, it } from "vitest"
import { centerCirc, circCore } from "./drawCirc"

describe("draw circ", () => {
  it("should works", () => {
    expect(circCore(3)).toMatchSnapshot()
    expect(Array.from(centerCirc(5, 5, 3))).toMatchSnapshot()
  })
})
