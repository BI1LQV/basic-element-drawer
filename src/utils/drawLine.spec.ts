import { describe, expect, it } from "vitest"
import { DDALine } from "./drawLine"

describe("draw line", () => {
  it("dda should works", () => {
    expect(DDALine(3, 3, 9, 13)).toMatchSnapshot()
    expect(DDALine(1, 1, 6, 5)).toMatchSnapshot()
  })
})
