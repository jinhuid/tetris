export type Binary<
  T extends number,
  R extends string = "",
  Arr extends string[] = []
> = Arr["length"] extends T ? R : Binary<T, `${R}${"0" | "1"}`, [...Arr, ""]>

export type Struct<
  T extends number,
  R extends any[] = []
> = R["length"] extends T ? R : Struct<T, [...R, Binary<T>]>

export type BrickLetter = keyof Bricks

export type BrickColor = Bricks[BrickLetter]["color"]

export type BrickStruct = Bricks[BrickLetter]["struct"]

export type Bricks = {
  [key: string]: {
    color: string
    struct: Readonly<Struct<1> | Struct<2> | Struct<3> | Struct<4>>
  }
  o: {
    color: "#FADADD"
    struct: Readonly<Struct<2>>
  }
  i: {
    color: "#F7E9D4"
    struct: Readonly<Struct<4>>
  }
  s: {
    color: "#C8E6C9"
    struct: Readonly<Struct<3>>
  }
  z: {
    color: "#B3E5FC"
    struct: Readonly<Struct<3>>
  }
  l: {
    color: "#FFCC80"
    struct: Readonly<Struct<3>>
  }
  j: {
    color: "#FFEE58"
    struct: Readonly<Struct<3>>
  }
  t: {
    color: "#CE93D8"
    struct: Readonly<Struct<3>>
  }
}

export interface IBrick {
  letter: BrickLetter
  x: number
  y: number
  width: number
  height: number
  color: BrickColor
  structure: Readonly<number[]>
  isRecycle: boolean
  draw(ctx: CanvasRenderingContext2D): void
  update(time: number, mapBinary: number[]): boolean
  getBinary(): number[]
  left(mapBinary: number[]): void
  right(mapBinary: number[]): void
  downOne(mapBinary: number[]): boolean
  downToBottom(mapBinary: number[]): boolean
  rotate(mapBinary: number[]): void
}
