import { bricks } from "./config"
type NoneBinary<T extends string, _T = T> = T extends `${"1" | "0"}${infer R}`
  ? NoneBinary<R>
  : T extends ""
  ? _T
  : never

type isBinaryString<T extends string> = NoneBinary<T> extends never ? never : T

export type OperateImpl = {
  left: () => void
  right: () => void
  downOne: () => void
  downBottom: () => void
  rotate: () => void
  pauseGame: () => void
}

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
