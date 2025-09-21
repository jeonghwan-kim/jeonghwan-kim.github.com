---
slug: "/dev/2023/04/07/recursive-type"
date: 2023-04-07
title: "재귀타입"
layout: post
category: 개발
tags:
  - TypeScript
---

재귀는 알고리즘의 꽃이다. 코드를 따라가다보면 이해할 것 같다가도 금새 사고의 끈을 놓쳐버린다. 온전히 이해하지 못하지만 이것이 정답이라고 생각하니 코드가 신비롭게 보인다.

복잡하고 커다란 문제에서 단순하고 작은 규칙을 찾아 반복하는 것이 재귀의 매력이다. 쉬운 방법으로 문제를 해결하기 때문에 코드 읽기가 수월하다. 멀리서 바라보면 화사한 것 같지만 가까이에서 보면 소박하고 작은 꽃 여러 개가 모여있는 벛꽃나무 같다.

# 재귀 타입

지난주 중복 타입을 정의해야할 일이 생겼다. 중첩된 문자열 배열.

```ts
type ValueOrArray<T> = T | T[]
const nestedStrings: ValueOrArray<string>[] = ["부모", ["자식"]]
```

문자열 배열인데 이 배열은 다시 그것의 배열을 담을 수 있는 구조이다. 값이나 값의 배열의 집합인 ValueOrArray를 이용해 nestedStrings란 배열을 만들었다. 이 변수는 문자열이나 문자열 배열을 담은 배열을 값으로 가질 수 있다.

더 깊은 중복을 허용하고 싶었다. 예를 들어 ['부모', ['자식', ['손자']]] 값을 품을 수 있는 타입을 정의하고 싶다. 무한대로 중첩할 수 있으면 더 좋겠다. ValueOrArray에 타입을 확장해 유니온으로 묶는 방식은 문제를 해결할 수 없다. 무한대로 집합을 추가하는 게 불가능하니깐.

# 인터페이스와 타입 활용

인터페이스를 사용해 이 문제를 해결할 수 있다. ValueOrArray의 집합을 무한대로 정의하는 것이다. 이 집합중 하나를 다른 타입으로 정의하는데 인터페이스를 사용할 것이다. ValueOrArray의 배열이라는 뜻의 ArrayOfValueOrArray 타입을 만들었다.

```ts
// T 타입이거나 지금 정의할 타입의 배열 타입(재귀)이다.
type ValueOrArray<T> = T | ArrayOfValueOrArray<T>
// ValueOrArray의 배열 타입이다. 인터페이스로 정의했다.
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> {}

const nestedStrings: ValueOrArray<string>[] = ["부모1", ["자식1", ["손자1"]]]
```

ValueOrArray<T> 타입을 정의할때 T와 ArrayOfValueOrArray<T>의 집합으로 정했다. 바로 아래 후자를 정의했는데 여기서는 타입 정의를 마치지 않은 ValueOrArray 타입을 사용했다. 언뜻 순환참조로 보인다. 타입 정의 중에 서로를 가리키기 때문이다.

ValueOrArray를 정의하는 과정에서 ArrayOfValueOrArray를 사용한다. 후자를 정의할 때 전자를 사용하려 할 것이다. 전자는 여전히 정의 중이기 때문에 다시 후자를 사용하려고 할 것이다. 누구도 정의되지 않고 서로 가리키기만하는 모습.

ValueOrArray → ArrayOfValueOrArray → ValueOrArray → ... (반복)

순환참조를 끊는 방법은 어느 한 지점을 종단으로 만드는 것이다. 다른 곳을 참조하지 않게 해야해야 한다.

인터페이스는 타입 별칭과 다르게 전체 구조가 정해지지 않아도 사용할 수 있다. Declaration Merging에 따라 인터페이스는 같은 이름의 타입을 정의할수 있는데 나중에 컴파일러는 모든 정의를 합쳐 하나의 타입으로 정의할 것이다. 인터페이스는 언제라도 추가로 정의할 수 있는 특징이 있다. 인터페이스로 만든 타입을 타입 별칭 정의의 우측에서 사용할 수 있는 이유다.

```ts
// ArrayOfValueOrArray는 타입 정의를 완료하지 않았지만 타입 별칭의 우측 인자로 사용할 수 있다.
// 컴파일러는 ValueOrArray 타입을 정의할 수 있다.
type ValueOrArray<T> = T | ArrayOfValueOrArray<T>

// 위에 ValueOrArray 타입을 정의했기 때문에 ArrayOfValueOrArray 타입을 정의할 수 있다.
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> {}
```

인터페이스로 만든 ArrayOfValueOrArray는 ValueOrArray를 정의할 때, 즉 완료되지 않아도 타입 별칭의 우측인자로 사용할 수 있다. ValueOrArray 타입이 정의를 마쳤기 때문에 그 아래 인터페이스로 만든 ArrayOfValueOrArray도 타입을 정의할 수 있다.

인터페이스로 만든 타입을 느슨하게 정의할 수 있는 특성을 활용해 재귀 타입을 지정할 수 있다.

# 타입만 활용

타입 별칭과 인터페이스를 함께 사용해 재귀타입을 만드는 위 방식은 다소 장황하다. 타입 지정을 위해 ArrayOfValueOrArray라는 일회성 타입을 만들어야하기 때문이다.

타입스크립트 3.7부터는 타입 별칭만으로 재귀 타입을 만들 수 있다.

```ts
type ValueOrArray<T> = T | Array<ValueOrArray<T>>
```

단순하다. 타입을 지정하면서 지금 지정하고 있는 타입을 우측에 사용한다. 이전 버전과 달리 컴파일러가 타입 별칭에 사용할 타입 인자를 늦게 평가하기 때문이다. [해당 PR](https://github.com/microsoft/TypeScript/pull/33050)의 설명에 의하면 타입 별칭의 우측에서 아래 인자 중 하나로 사용되면 컴파일러가 인자를 늦게 확인한다.

- 배열 타입의 인자
- 튜플 타입의 인자
- 제네릭 클래스 인자
- 인터페이스의 인자

```ts
type Foo = Array<Foo> // 배열 타입의 인자
type Foo = [Foo, Foo] // 튜플 타입의 인자
type Foo = Bar<Foo> // 제네릭 클래스 인자
type Foo = IBar<Foo> // 인터페이스의 인자
```

ValuOrArray는 타입 별칭을 정의할 때 배열타입의 인자로 사용되었기 때문에 컴파일러가 인자 타입을 늦게 확인할 것이다.

제이슨 타입도 이렇게 표현할 수 있다. ([문서](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#more-recursive-type-aliases) 참고)

```ts
type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | { [key: string]: Json }
```

이전과 비교하면 단순함이 드러난다.

```ts
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
```

# 결론

인터페이스의 타입 병합이라는 특징을 이용해 재귀 타입을 만들 수 있었다.

타입스트크립트 3.7부터는 타입 별칭 만으로 재귀 타입을 만들 수 있다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.io-examples/tree/main/2023-04-07-recursive-type)
- [Recursive type references #33050](https://github.com/microsoft/TypeScript/pull/33050)
- [(More) Recursive Type Aliases](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#more-recursive-type-aliases)
- [Merging Interfaces](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces)
