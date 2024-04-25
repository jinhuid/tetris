export const gameParam = {
  column: 10,
  row: 20,
  FPS: 165,
  speed: 0,
  keySpeed: 10,
  score: 0,
  get brickWidth() {
    return window.innerWidth / this.column
  },
  get brickHeight() {
    return window.innerHeight / this.row
  },
}

export const bricks = {
  o: {
    color: "#FADADD" as const,
    struct: ["11", "11"] as Binary<2>[],
  },
  i: {
    color: "#F7E9D4" as const,
    struct: ["0000", "1111", "0000", "0000"] as Binary<4>[],
  },
  s: {
    color: "#C8E6C9" as const,
    struct: ["011", "110", "000"] as Binary<3>[],
  },
  z: {
    color: "#B3E5FC" as const,
    struct: ["110", "011", "000"] as Binary<3>[],
  },
  l: {
    color: "#FFCC80" as const,
    struct: ["001", "111", "000"] as Binary<3>[],
  },
  j: {
    color: "#FFEE58" as const,
    struct: ["100", "111", "000"] as Binary<3>[],
  },
  t: {
    color: "#CE93D8" as const,
    struct: ["000", "111", "010"] as Binary<3>[],
  },
}

export const control = {
  operate: {
    left: ["a", "ArrowLeft"],
    right: ["d", "ArrowRight"],
    up: ["w", "ArrowUp"],
    down: ["s", "ArrowDown"],
    bottom: [" "],
  },
  onceKey: ["up", "bottom"],
  speedUpKey: ["down"],
  pause: "Enter",
} as const

type NoneBinary<T extends string, _T = T> = T extends `${"1" | "0"}${infer R}`
  ? NoneBinary<R>
  : T extends ""
  ? _T
  : never

type isBinaryString<T extends string> = NoneBinary<T> extends never ? never : T

export type BinaryString<T extends BrickStruct> = {
  readonly [K in keyof T]: isBinaryString<T[K]>
}
export type Binary<
  T extends number,
  R extends string = "",
  Arr extends "_"[] = []
> = Arr["length"] extends T ? R : Binary<T, `${R}${"0" | "1"}`, [...Arr, "_"]>

export type BrickLetter = keyof typeof bricks
export type BrickColor = (typeof bricks)[BrickLetter]["color"]
export type BrickStruct = (typeof bricks)[BrickLetter]["struct"]

