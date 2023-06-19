---
slug: "/2023/06/20/reflect-metadata"
date: 2023-06-20
title: "리플렉트 메타데이터"
layout: post
tags:
---

# 메타 프로그래밍

단순하게 보면 어플리케이션은 프로그램과 데이터로 구성된다. 코드 영역에 있는 프로그램이 데이터 영역의 변수 값을 제어하면서 어플리케이션이 동작한다. 프로그램이 데이터를 제어 혹은 '프로그래밍'하는 셈이다.

어떤 프로그램이 다른 프로그램을 제어하는 것을 상상해 보자. 프로그램이 데이터를 제어해 어플리케이션이 동작하는 것처럼 프로그램이 프로그램을 제어해 어플리리케이션이 동작할 것이다. 마치 매트릭스의 스미스 요원처럼.

프로그래밍 대상이 되는 언어를 대상 언어, 프로그래밍 하는 언어를 메타 언어라고 한다. 이 중 스스로 메타 언어가 되는 것을 반영 혹은 리플렉션(Reflection)이라고 한다. 그리고 이러한 프로그래밍을 메타 프로그래밍이라고 부른다.

![리플렉션 이미지 검색](./reflect-search-result.jpg)

메타 프로그래밍은 세 가지 구조가 있다.

- 런타임 엔진 코드를 API를 통해 노출시키는 방식
- 문자열로 된 프로그램을 동적 실행하는 방식
- 해당 언어 범위를 벗어난 것

첫번째는 아마도 자바스크립트의 객체 디스크립터 API에 해당할 것 같다. 둘째는 eval 함수일 것 같고 마지막은 잘 모르겠다.

메타 프로그래밍 언어의 종류는 세 가지다.

- 타입 내성(Type Introspection)
- 반영(Reflection)
- 자기-수정 코드(Self-Modifying Code)

이중 반영, 리플렉션에 대해 알아보자.

# 리플렉션

스스로 메타언어가 되어 자기 자신을 프로그래밍할 수 있는 언어가 되는 것을 리플렉션이라고 한다. 자바 스크립트는 리플렉션을 지원할까? 단순한 예제를 보자.

함수의 name 필드는 읽기 전용으로 수정할 수 없는 게 특징이다.

```js
function foo() {}
console.log(foo.name) // 'foo'

foo.name = "bar"
console.log(foo.name) // NOT 'bar'
```

name을 변경할 수 없다는 정보를 어딘가에 기록했을 것 같다. 인터널 슬롯이라고 불리는 영역 중 [[Writable]] 이란 곳에 기록(참고: table-object-property-attributes)되어 있다. 인터널 슬롯은 Object의 정적 함수로 접근할 수 있는데 조회하면 false 다.

```js{1}
console.log(Object.getPropertyDescriptor(foo, "name"))
/*{
  value: 'foo',
  writable: false,
  enumerable: false, 
  configurable: true,
}*/
```

이 속성을 true로 바꾸면 name 필드를 쓸 수 있지 않을까?

```js{1-3}
Object.defineProperty(foo, "name", {
  writable: true,
})

foo.name = "bar"
console.log(foo.name) // 'bar'
```

Object.defineProperty로 객체 내부 슬롯에 접근할 수 있는데 writable을 true로 변경했다. 이제 읽기 전용 필드인 name 속성을 다른 값으로 바꿀수 있다.

프로그램이 데이터를 변경하듯 프로그램이 프로그램을 변경했다. '객체의 name은 변경될 수 없다'라는 프로그램을 변경할 수 있다는 프로그램으로 변경한 것. 메타 프로그래밍을 한 셈이다.

# 리플렉트

자바스크립트에는 리플렉션과 비슷한 이름의 리플렉트(Reflect) API가 있다. ES6부터 지원하는데 Object API의 관련 기능을 모두 지원한다.

```js{1,5,8}
Reflect.defineProperty(foo, "name", { writable: true })
foo.name = "bar"
console.log(foo.name) // 'bar'

console.log(Reflect.getOwnPropertyDescriptor(foo, "name"))
/*{
  value: 'bar',
  writable: true,
  enumerable: false, 
  configurable: true,
}*/
```

자세한 내용은 이 글을 참고했다.

- [Proxy와 Relfect | javascript.info](https://ko.javascript.info/proxy)

Object와 Reflect가 자바스크립트에 이미 정의된 속성을 다루는 API를 제공하지만 이것만으로 메타 프로그래밍을 하기에는 부족하다. 특정 어플리케이션에서만 다루는 도메인 데이터를 프로그램 수준에 저장할 방법이 없기 때문이다.

# 리플렉트 메타데이터

이런 한계를 넘어서기 위한 제안이 [Metadata Proposal - ECMAScript](https://rbuckton.github.io/reflect-metadata/)이다. 메타 데이터를 저장할 인터널 슬롯을 추가하고 여기에 접근할 수 있는 Reflect API를 추가하는 것이다.

- [[Metadata]]: 모든 객체의 메타데이터를 관리하기 위한 맵
- [[DefineMetadata]]: Reflect.defineMetadata로 호출할 인터널 메소드. 객체 혹은 메소드의 메타데이터를 정의
- [[GetMetadata]]: Reflect.getMetadata로 호출할 인터널 메소드. 객체 혹은 메소드의 메타 데이터를 조회

언제나 그렇듯 이러한 제안이 수락되기 전에는 누군가 미리 구현체를 만들어 놓는다.

- [rbuckton/reflect-metadata](https://github.com/rbuckton/reflect-metadata)

프라미스전에 q가 나오고 어싱크 함수 전에 co가 나오는것 처럼.

이런 식이다.

```js
import "reflect-metadata"

function foo() {}
Reflect.defineMetadata("version", 1, foo)
console.log(Reflect.getMetatdata("version", foo)) // 1
```

foo라는 함수에 version이란 새로운 메타 데이터를 추가했다. 마치 이미지 파일에 이미지 데이터와 별개로 위치나 카메라 정보가 저장된 것과 비슷하다. foo 함수의 내부 구현과 무관하게 foo를 설명하는 정보를 메타데이터 공간에 기록한 것이다.

어떤 구조일까?

```{2}
namespace Reflect {
  const Metadata = new _WeakMap<any, Map<string | symbol | undefined, Map<any, any>>>();
```

Relfect 이름 공간에 Metadata라는 맵을 두었다. 대상 객체를 키로하고 여기에 메타 데이터를 둘 맵을 또 두었다. 이곳에는 대상객체에 저장할 키, 밸류 형식의 메타 데이터가 들어갈 것이다. foo 예제에서는 이런 식으로 저장될 것이다.

```js
const Metadata = Map{
  foo: Map{
    version: 1
  }
}
```

유심히 보면 중첩 가장 깊은 곳에 맵이 하나 더 있다. 이것은 클래스의 특정 메소드에 메타데이터를 기록할 용도이다. 예를 들면 이렇다.

```js
class MyClass {
  myMethod() {}
}

Reflect.defineMetadata('required', true, MyClass, 'myMethod')

const Metadata = Map{
  foo: Map{
    version: 1
  },
  MyClass: Map{
    myMethod: Map{
      required: true,
    }
  }
```

메타 데이터를 정의하는 defineMedtata을 보자.

```ts{9-14,23-24,32,35-36,38,41-42}
function defineMetadata(
  metadataKey: any,
  metadataValue: any,
  target: any,
  propertyKey?: string | symbol
): void {
  if (!IsObject(target)) throw new TypeError()
  if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey)
  return OrdinaryDefineOwnMetadata(
    metadataKey,
    metadataValue,
    target,
    propertyKey
  )
}

function OrdinaryDefineOwnMetadata(
  MetadataKey: any,
  MetadataValue: any,
  O: any,
  P: string | symbol | undefined
): void {
  const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true)
  metadataMap.set(MetadataKey, MetadataValue)
}

function GetOrCreateMetadataMap(
  O: any,
  P: string | symbol | undefined,
  Create: boolean
): Map<any, any> | undefined {
  let targetMetadata = Metadata.get(O)
  if (IsUndefined(targetMetadata)) {
    if (!Create) return undefined
    targetMetadata = new _Map<string | symbol | undefined, Map<any, any>>()
    Metadata.set(O, targetMetadata)
  }
  let metadataMap = targetMetadata.get(P)
  if (IsUndefined(metadataMap)) {
    if (!Create) return undefined
    metadataMap = new _Map<any, any>()
    targetMetadata.set(P, metadataMap)
  }
  return metadataMap
}
```

defineMetadata()

- 메타키, 메타값, 대상 객체를 인자롤 받는다. 객체의 속성을 받기도 한다.
- 대상 객체의 메타데이터를 조회한다.
- 없으면 맵을 새로 만들어 저장 후 반환한다.

메타 데이터를 얻는 getMetatdata를 보자.

```ts{8,16-19,28,30,38,40}
function getMetadata(
  metadataKey: any,
  target: any,
  propertyKey?: string | symbol
): any {
  if (!IsObject(target)) throw new TypeError()
  if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey)
  return OrdinaryGetMetadata(metadataKey, target, propertyKey)
}

function OrdinaryGetMetadata(
  MetadataKey: any,
  O: any,
  P: string | symbol | undefined
): any {
  const hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P)
  if (hasOwn) return OrdinaryGetOwnMetadata(MetadataKey, O, P)
  const parent = OrdinaryGetPrototypeOf(O)
  if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P)
  return undefined
}

function OrdinaryHasOwnMetadata(
  MetadataKey: any,
  O: any,
  P: string | symbol | undefined
): boolean {
  const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false)
  if (IsUndefined(metadataMap)) return false
  return ToBoolean(metadataMap.has(MetadataKey))
}

function OrdinaryGetOwnMetadata(
  MetadataKey: any,
  O: any,
  P: string | symbol | undefined
): any {
  const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false)
  if (IsUndefined(metadataMap)) return undefined
  return metadataMap.get(MetadataKey)
}
```

getMetadata()

- 메타 데이터 저장소(Metadata)에서 대상 객체의 메타데이터 맵을 찾는다.
- 없으면 프로토타입 체인을 재귀적으로 찾는다.
- 메타데이터 맵에서 해당 키의 값을 찾는다.

# 활용

Nest.js 프레임웍에서는 컨트롤러 클래스의 경로 정보를 메타데이터로 사용한다.

```ts{1}
@Controller("/cats")
class CatsController {}
```

컨트롤러 클래스에 데코레이터를 사용해 메타데이터를 기록한다. CatsController 클래스에 '/cats'란 메타데이터를 저장해 둔 것. 요청을 처리할 때 이 경로에 해당하는 요청일 경우 CatController를 사용할 것이다.

데코레이터에서 어떻게 메타데이터를 정의하는지 보자. controller.decorator.ts 파일이다.

```ts{4}
function Controller(path) {
  return (target) {
    // 'path', '/cats', 'CatsController'
    Reflect.defineMetadata(PATH_METADATA, path, target);
  }
}
```

Reflect.defineMetadata 함수를 사용했다. PATH_METADATA가 'path' 문자열이기 때문에 {path: '/cats'} 란 메타데이터를 target 값의 키에 저장할 것이다. 실제 모양은 이럴 것이다.

```ts
const Metadata = Map{
  CatsController: Map{
    path: '/cat'
  }
}
```

콘트롤러 클래스 이름을 키로 사용하고 여기에 메타 데이터를 기록했다.

이 메타데이터를 사용하는 부분을 살펴볼 차례다. router-explorer.ts 파일이다.

```ts{2}
function extractRouterPath(metatype) {
  const path = Reflect.getMetadata(PATH_METADATA, metatype) // '/cats'

  if (isUndefined(path)) {
    throw new UnknownRequestMappingException(metatype)
  }
  if (Array.isArray(path)) {
    return path.map(p => addLeadingSlash(p))
  }
  return [addLeadingSlash(path)]
}
```

아마도 요청을 처리하는 로직 중 하나일 것 같다. extractRouterPath에서 Reflect.getMetadata 함수를 사용했다. 인자 metatype이 컨트롤러 클래스일텐데 이 클래스의 메타데이터중 'path' 값을 조회하는 로직이다.

컨트롤러 클래스가 처리할 경로를 클래스 안에 저장하지 않고 메타데이터 공간에 따로 저장한 부분이 인상적이다.

# 결론

매타프로그래밍이라는 개발 패러다임과 이를 구현하는 언어 특징 중 리플렉션에 대해 정리했다.

자바스크립트에서는 Object, Reflect API를 통해 리플렉션을 흉내낼 수 있다. 이미 정의된 내부 슬롯만 사용하기 때문에 메타 프로그래밍에는 한계이다. 이를 극복하기 위해 Metadata 제안이 나왔고 reflect-metadata가 그 구현체이다.

이 라이브러리를 활용한 nestjs의 컨트롤러 데코레이터를 살펴 봤다.

참고

- [Introduction to "reflect-metadata" package and its ECMASCript proposal](https://medium.com/jspoint/introduction-to-reflect-metadata-package-and-its-ecmascript-proposal-8798405d7d88)
- [메타프로그래밍 | 위키백과](https://ko.wikipedia.org/wiki/메타프로그래밍)
- [Proxy와 Reflect | javascript.info](https://ko.javascript.info/proxy)
- [rbuckton/reflect-metadata | github](https://github.com/rbuckton/reflect-metadata)
