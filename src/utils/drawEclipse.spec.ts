import { describe, expect, it } from "vitest"
import { centerEclipse, eclipseCore } from "./drawEclipse"

describe("draw circ", () => {
  it("should works", () => {
    expect(eclipseCore(3, 2)).toMatchSnapshot()
    expect(Array.from(centerEclipse(5, 5, 2, 3))).toMatchSnapshot()
  })
})
