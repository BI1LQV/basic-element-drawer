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
