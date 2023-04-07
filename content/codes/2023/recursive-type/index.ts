{
  type ValueOrArray<T> = T | T[]
  const nestedStrings: ValueOrArray<string>[] = ["부모", ["자식"]]
}
{
  type ValueOrArray<T> = T | ArrayOfValueOrArray<T>
  // ValueOrArray의 배열 타입이다.
  interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> {}

  const nestedStrings: ValueOrArray<string>[] = ["부모1", ["자식1", ["손자1"]]]
}
{
  type ValueOrArray<T> = T | ValueOrArray<T>[]
  const nestedStrings: ValueOrArray<string>[] = ["부모1", ["자식1", ["손자1"]]]
}
{
  type Json =
    | string
    | number
    | boolean
    | null
    | undefined
    | JsonArray
    | JsonObject
  interface JsonArray extends Array<Json> {}
  interface JsonObject extends Record<string, Json> {}
  const json: Json = {
    a: { x: 1, y: [true, "ok"] },
  }
}
{
  type Json =
    | string
    | number
    | boolean
    | null
    | undefined
    | Json[]
    | { [key: string]: Json }
  const json: Json = {
    a: { x: 1, y: [true, "ok"] },
  }
}
