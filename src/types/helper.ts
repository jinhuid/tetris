export type NoneBinary<T extends string, _T = T> = T extends `${"1" | "0"}${infer R}`
  ? NoneBinary<R>
  : T extends ""
  ? _T
  : never

export type isBinaryString<T extends string> = NoneBinary<T> extends never ? never : T

export type Binary<
  T extends number,
  R extends string = "",
  Arr extends string[] = []
> = Arr["length"] extends T ? R : Binary<T, `${R}${"0" | "1"}`, [...Arr, ""]>
