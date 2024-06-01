export type NoneBinary<T extends string, _T = T> = T extends `${"1" | "0"}${infer R}`
  ? NoneBinary<R>
  : T extends ""
  ? _T
  : never

export type isBinaryString<T extends string> = NoneBinary<T> extends never ? never : T
