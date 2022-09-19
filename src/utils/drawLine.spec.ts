import { describe, expect, it } from "vitest"
import { DDALine } from "./drawLine"

describe("draw line", () => {
  it("dda should works", () => {
    expect(DDALine(3, 3, 9, 13)).toMatchSnapshot()
    expect(DDALine(1, 1, 6, 5)).toMatchSnapshot()
    expect(DDALine(1, 1, 6, 8)).toMatchSnapshot()
    expect(DDALine(9, 13, 3, 3)).toMatchSnapshot()
    expect(DDALine(-3, 3, -13, 11)).toMatchSnapshot()
  })
})
