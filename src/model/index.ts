export enum PixelState {
  empty,
  line,
  fill,
  selected,
}
export enum LineAlgorism {
  DDA,
  Bresenham,
}

export interface Pos {x: number; y: number}
export type TransformPath = ({ x: number; y: number; type: "resize" | "move" } | { value: number;type: "rotate" })
