import { describe, expect, it } from "vitest"
import { fill, getThisLine } from "./fill"
import { PixelState } from "@/model"

describe("get line pixel", () => {
  it("should works", () => {
    expect(getThisLine(
      [
        PixelState.empty, PixelState.empty, PixelState.empty,
        PixelState.line, PixelState.empty, PixelState.line,
        PixelState.empty, PixelState.empty, PixelState.empty,
      ], 3, 1,
    )).toMatchInlineSnapshot(`
      [
        3,
        5,
      ]
    `)
    expect(getThisLine(
      [
        PixelState.empty, PixelState.empty, PixelState.empty,
        PixelState.line, PixelState.empty, PixelState.line,
        PixelState.empty, PixelState.empty, PixelState.empty,
      ], 3, 0,
    )).toMatchInlineSnapshot("[]")
    expect(getThisLine(
      [
        PixelState.empty, PixelState.empty, PixelState.empty,
        PixelState.line, PixelState.empty, PixelState.line,
        PixelState.empty, PixelState.empty, PixelState.empty,
      ], 3, 2,
    )).toMatchInlineSnapshot("[]")
  })
})

describe("get line pixel", () => {
  it("should works", () => {
    expect(Array.from(fill([
      PixelState.empty, PixelState.empty, PixelState.empty, PixelState.empty,
      PixelState.line, PixelState.empty, PixelState.empty, PixelState.line,
      PixelState.empty, PixelState.empty, PixelState.empty, PixelState.empty,
    ], 4, 4))).toMatchInlineSnapshot(`
      [
        [],
        [],
        [
          5,
          6,
        ],
        [],
      ]
    `)
  })
})
