type NoneBinary<T extends string, _T = T> = T extends `${"1" | "0"}${infer R}`
  ? NoneBinary<R>
  : T extends ""
  ? _T
  : never

type isBinaryString<T extends string> = NoneBinary<T> extends never ? never : T

export type OperateEvents = {
  left: () => void
  right: () => void
  downOne: () => void
  downBottom: () => void
  rotate: () => void
  pauseGame: () => void
}

export type Bricks = {
  o: {
    color: "#FADADD"
    struct: Binary<2>[]
  }
  i: {
    color: "#F7E9D4"
    struct: Binary<4>[]
  }
  s: {
    color: "#C8E6C9"
    struct: Binary<3>[]
  }
  z: {
    color: "#B3E5FC"
    struct: Binary<3>[]
  }
  l: {
    color: "#FFCC80"
    struct: Binary<3>[]
  }
  j: {
    color: "#FFEE58"
    struct: Binary<3>[]
  }
  t: {
    color: "#CE93D8"
    struct: Binary<3>[]
  }
}

export type BinaryString<T extends BrickStruct> = {
  readonly [K in keyof T]: isBinaryString<T[K]>
}

// type a = BinaryString<["11", "11"] | ["111", "101", "001"]>

export type Binary<
  T extends number,
  R extends string = "",
  Arr extends "_"[] = []
> = Arr["length"] extends T ? R : Binary<T, `${R}${"0" | "1"}`, [...Arr, "_"]>

export type BrickLetter = keyof Bricks

export type BrickColor = Bricks[BrickLetter]["color"]

export type BrickStruct = Bricks[BrickLetter]["struct"]
