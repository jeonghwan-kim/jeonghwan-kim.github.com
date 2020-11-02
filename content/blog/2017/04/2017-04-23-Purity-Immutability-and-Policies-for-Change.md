---
title: 순수성, 불변성, 변경정책
layout: post
category: series
seriesId: "bd02e3bf-8437-5d5c-a1d4-463b0f61eadb"
permalink: js/2017/04/23/Purity-Immutability-and-Policies-for-Change.html
tags: [JavaScript, functional-programming]
featured_image: /assets/imgs/2017/04/17/functional-javascript-thumbnail.png
---

> 이전글: [(함수형JS) 함수로 함수 만들기3 부분적용](/js/2017/04/21/partial-application.html)

앞서 함수로 함수를 조립할 수 있는 방법을 살펴보았다. 함수 조합 기법 뿐만 아니라 프로그램 개발의 복잡성을 줄이는 것이 함수형 프로그래밍이 추구하는 바다. 이번 글에서는 상태변화를 최소화할 수 있는 기법에 대해 알아보겠다.

![Purity-Immutability-and-Policies-for-Change-logo](/assets/imgs/2017/04/23/Purity-Immutability-and-Policies-for-Change-logo.png)

## 여기까지 왔다면 이런 코드쯤이야 술술 읽힌다

그동안 만들었던 함수를 기반으로 랜덤 문자열을 만드는 함수를 만들어 보자. 먼저 범위를 지정해서 랜덤 숫자를 반환하는 함수다.

```js
const random = (min, max) => Math.round(Math.random() * (max - min) + min)
random(1, 10) // 1~10 사이의 랜덤 숫자 하나를 반환한다
```

간단하다. 최소값과 최대값을 지정해서 random() 함수를 호출하면 범위 안의 정수 1개를 반한다.

partial() 함수를 이용해 random 함수의 파라매터 중 최소값만 1로 고정한 rand 함수를 만든다. 우리가 사용하게 될 정수는 1 이상이기 때문이다.

```js
const rand = partila1(random, 1)
rand(10) // // 1~10 사이의 랜덤 숫자 하나를 반환한다
rand(36) // 1~36 사이의 랜덤 숫자를 하나 반환한다.
```

rand(10)는 1~10까지의 랜덤 정수를 반환한다. 숫자와 영문 소문자로 구성된 36진수를 사용할 것이므로 rand(36) 함수를 이용하겠다.

반환된 숫자는 나중에 36진수 문자열로 변경할 것이다. 문자열을 만들 것이기 때문에 우선 정수 배열을 생성해야한다. 함수를 필요한만큼 반복해 실행하는 repeatedly() 함수를 사용하자.

```js
repeatedly(10, partial(rand, 36))); // 1 ~ 36 사이의 랜덤수로 이뤄진 배열
```

repeatedly() 함수는 반복 횟수와 반복할 함수를 전달받는데 rand() 함수에 36을 부분적용한 함수를 전달했다. 그결과 1에서 36사이의 정수로 구성된 배열을 반환한다.

마지막으로 정수배열로 랜덤 문자열을 만든다.

```js
const randString = len => {
  const numbers = repeatedly(len, partial(rand, 36)) // 1~36 랜덤수 배열
  return numbers.map(num => num.toString(36)).join("") // 10진수->36진수 문자열
}

randString(0) // ''
randString(1) // 'i'
randString(10) // 'eoxjuyewwz'
```

1에서 36사이의 정수를 저장한 numbers를 맵함수로 돌리면서 toString(36)을 호출하여 36진수 문자로 만든다. 이렇게 구성된문자 배열을 join() 하여 최종 문자열을 반환한다.

여기까지는 복습이다. 그 동안의 함수 조립법을 충분히 이해했다면 코드를 따라오는데 어렵지 않을 것이다. 이 글에서 하고 싶은 내용은 이제부터다.

## 순수성

> randString을 테스트할 수 있을까?

지금까지 만들었던 함수들과 달리 randString은 결과값을 예측할 수 없다. 그래서 테스트하기 마땅치 않다. 이러한 함수를 비순수하다라고 한다. 그럼 순수한 함수는 뭘까?

순수 함수는 다음 특징을 갖는다.

- 인자만을 이용해 계산한다
- 외적 요소에 영향을 받는 데이터는 사용하지 않는다
- 외부 상태를 변화시킬 수 없어야 한다

randString은 결과를 만드는데 하드웨어 종속적인 함수 Math.random()를 이용하기 때문에 처음 두 조건에 어긋난다. 비록 randString이 예측할 수 없는 결과를 반환하는 녀석이지만 순수 함수로 개선하여 테스트하기 쉽게 만들어 보겠다.

### 비순수성에서 순수성만 분리하기

랜덤 문자열을 만들어 내는 과정은 두 단계로 분리할 수 있겠다.

- 랜덤 숫자 배열을 만드는 부분
- 정수 배열을 문자로 변환하는 부분

비순수성은 첫 번째 부분에 있다. 랜덤 숫자를 반환하기 때문이다. 이 부분의 역할을 축소해서 배열이 아닌 정수 한개만 반환하도록 하겠다. 쉬운 설명을 위해 36진수 문자로 변경하는 작업도 추가했다.

```js
const genRandChar = () => rand(36).toString(36)

genRandChar() // '2'
genRandChar() // 'i'
```

이 함수를 반복하여 랜덤 문자열을 만드는 작업은 두번째 함수로 위임한다. genString() 이 그 역할을 한다.

```js
const genString = (charGen, len) => repeatedly(len, charGen).join("")

genString(genRandChar, 5) // 'iyrph'
```

randString() 함수를 genString()과 genRandChar() 함수로 분리했다. genRandChar() 는 테스트하기 어렵지만 genString() 만큼은 테스할 수 있는 길이 열렸다.

```js
describe("genString()", () => {
  const result = genString(() => "a", 10)

  it("지정한 길이의 문자열을 반환한다", () => {
    expect(result.constructor).toBe(String)
    expect(result.length).toBe(10)
  })

  it("문자열 생성기로 문자열을 반환한다", () => {
    expect(result).toEqual("aaaaaaaaaa")
  })
})
```

### 비순수한 함수 테스트

genRandChar()가 비순수하다고 해서 정말로 테스트 할 수 있는 방법이 없을까? 완벽하진 않더라도 부분적인 테스트는 가능하다.

```js
describe('genRandChar()', ()=> {
  const result = repeateldy(1000, genRandChar)

  it('숫자와 소문자를 반환한다', ()=> {
    const expected = result => expect(/[0-9a-z]/.test(result)
    result.map(expected).toBeTruthy()
  })
})
```

genRandChar()를 1,000번 반복해서 랜덤 문자를 만들고 하나씩 체크했다. genRandChar()를 1,000번 반복해서 얻은 결과가 테스트에 통과했다고 해서 완벽한 것은 아니다. 랜덤 문자이기 때문에 기대하지 않은 문자를 만들지도 모르는 일이다. 그러나 여기까지! 비순수 함수도 부분적으로 테스트 할 수 있다는 정도만 이해하자.

### 순수한 함수는 쉽게 교체할 수 있다

순수한 함수는 테스트 뿐만 아니라 다른 함수로 교체하기도 쉽다. 만약 함수가 외부와 영향을 주고 받는다면 변경하기 전에 모든 상황을 고려해야할 것이다.

예를 들어 보겠다. 배열의 2번째 요소를 반환하는 second() 함수가 있다고 하자.

```js
const nth = (arr, i) => arr[i]
const second = arr => nth(arr, 1)
```

second()에서 사용하는 nth()는 순수함수다. 인자를 기반으로 값을 반환하고 중간에 값을 건들지 않는다. 순수함수 이기 때문에 nth()를 대체물로 교체하는 것이 쉽다.

```js
const second = arr => arr[1]
```

이처럼 순수함수를 만드는 것은 함수를 자유롭게 조립하고 대체할 수 있는 여지를 준다.

## 불변성

불변성에 대해 알아보자. 프로그램은 상태를 가지고 있는 경우가 많은데 변수에 상태 정보를 저장한다. 변수가 많아지고 여러 함수에 걸쳐 사용되고 있다면 프로그램의 복잡도는 올라간다. 따라서 변수의 최소화, 상태의 최소화가 유지보수하기 쉬운 코드를 작성할 수 있는 비결이다.

개발할 때 상태가 없다는 것은 쉽게 납득할 수 없다. 상태 기반으로 사고하기 때문이다. 함수형 프로그래밍에서는 변수를 사용하는 대신 스택으로 상태를 넘겨 해결한다.

### 재귀를 이용하면 상태를 최소화할 수 있다

스택을 만드는 방법은 함수를 수행하는 것이다. 하나의 함수가 다른 함수의 도움없이 스택을 만들려면 스스로를 호출해야한다. 재귀다.

먼저 비재귀 버전의 sum() 함수는 아래와 같다.

```js
const sum = arr => {
  let result = 0
  for (let i = 0; i < arr.size; i++) result += arr[i]
  return result
}
```

반복문을 이용해 배열의 값을 전부 더한다. 결과 값을 저장하기 위한 `result`와 배열의 인덱스를 저장한 `i` 변수를 사용했다.

재귀버전의 sumRec() 는 아래와 같다.

```js
const sumRec = (arr, seed) => {
  if (!arr.length) return seed
  return sumRec(arr.slice(1), arr[0] + seed)
}
```

변수는 전혀 사용하지 않았다. 상태를 어디서 저장하고 있는지 눈치챘는가? 바로 재귀를 호출하면서 생성된 스택으로 넘겼다. `sumRec(arr.slice(1), arr[0] + seed)` 코드에 의해 다음 수행할 함수는 스택을 만든다. 스택의 지역 변수에는 `arr.slice(1)` 값과 `arr[0] + seed` 값이 전달되어 상태 관리가 되는 것이다.

### 변수를 사용할거면 변경하지 않아야 한다

모든 것을 재귀로 한다면 자바스크립트를 사용할 이유가 없다. Lisp 개발자라면 가능할지 모르겠다. 변수에 상태를 저장할 때는 웬만해선 값을 변경하지 않아야 프로그램이 단순해진다.

변수의 불변성을 보장하는 방법은 아래 두 가지가 있다.

- 불변객체로 만든다
- 복제해서 사용한다

자바스크립트의 Object.freeze() 는 불변객체로 만드는 메소드다. 객체를 전달하면 이후부터는 객체의 어떤 값도 변경할 수 없다.

```js
var a = [1, 2, 3]
Object.freeze(a)
a[1] = 42
a // [1, 2, 3]
```

그러나 서드파티 API에 전달할 객체에 불변객체를 넘기면 부작용이 생길 여지가 있다. API의 함수 구현에 따라 전달받은 인자를 수정해야만 할 수 있기 때문이다.

값을 변경할 때마다 새로운 객체로 복제해서 불변성을 지킬수도 있다. ES6에는 Object.assign() 메소드가 있는데 여러 객체를 하나로 합치는 녀석이다.

```js
let objA = { a: "A" }
let objB = { b: "B" }
let objC = Object.assign(objA, objB)

objC // {a: 'A', b: 'B'}
objA // {a: 'A', b: 'B'}
```

그러나 문제는 assign() 의 첫번째 인자도 변경된다는 점이다. 기존 객체를 유지하며 새로운 객체를 만들려면 첫번째 인자에 빈 객체를 전달해서 만들어야 한다.

```js
let objA = { a: "A" }
let objB = { b: "B" }
let objC = Object.assign({}, objA, objB)

objC // {a: 'A', b: 'B'}
objA // {a: 'A'}
```

## 변화 제어 정책

상태를 제어할 때 변이를 한 곳으로 고립시키는 방법도 있다. 아무 곳에서나 객체의 속성을 변경할 수 없고 격리된 특정 공간에서만 변경할수 있도록 강제시키는 방법이다.

```js
function Container(init) {
  this._value = init
}
Container.prototype = {
  update: function (fun, ...args) {
    const oldValue = this._value
    this._value = fun.apply(this, [oldValue, ...args])
    return this._value
  },
}
```

컨테이너 클래스를 만들었다. 상태를 담을 내부 변수 \_value를 두어 객체 생성시 값을 입력 받는다.

update() 메소드는 이 값을 변경할 때 사용한다. 함부로 값을 바꾸는 것이 아니라 update() 메소드를 통해서만 변경하도록 변이를 고정시킨 것이다. 업데이트는 변경 동작인 fun 함수와 인자 목록을 받는다. 그리고 기존 값과 함께 fun의 인자로 들어가 실행된다. 실행 결과 새로운 값이 반환되고 컨테이너로 관리하는 상태 정보는 갱신될 것이다.

아래처럼 사용할 수 있다.

```js
const num = new Container(999)
num // {_value: 999}
num.update(n => n + 1) // 1000
num.update((n, x, y, z) => n / x / y / z, 10, 10, 10) // 1
num.update(checkedOddSqr) // throw error
```

`num.update(n => n + 1)` 는 기존 값에 1을 더하는 함수를 전달해서 상태를 변경한다. 999 + 1 계산 결과 1000으로 값이 변경된다. `num.update((n, x, y, z) => n/x/y/z, 10, 10, 10)` 는 함수 뿐만아니라 함수에서 사용할 데이터를 연속해서 전달한다. `기존 값/10/10/10` 을 계산한 수 1이란 값을 가지게 될 것이다.

마지막 사용법은 컨테이너로 값을 수정할 때의 장점을 잘 보여준다. 이전 장에서 만들었던 checkedOddSqr() 함수를 전달했다. 이 함수는 인자가 홀수일때만 제곱하고 선행조건이 맞지 않을 경우 예외를 던진다. update() 메소드로 값 변경을 시도했을 때 기존 값이 1이기 때문에 예외를 던질 것이다. 변이 구간을 컨테이너로로 격리시킴으로서 얻을 수 있는 효과다.

## 정리

순수함수는 함수 조립시 쉽게 교체할 수있다. 외부와 어떤 영향도 주고 받지 않기 때문에 함수를 테스트하는 것도 매우 쉽다.

불변성은 프로그램을 단순하게 만들수 있는 방법이다. 재귀 호출과 객체 얼리기, 그리고 객체 복제를 통해 상태의 불변성을 유지할 수 있었다.

상태 변화가 필요하다면 변화를 제어할 수 있는 모델을 구현할 수 있다. 상태의 변이를 Container로 고립시켜 여기서만 변이를 일으키도록 하면 프로그램 전체에서 코드 변이 구간을 한정할 수 있다.

> 다음글: [(함수형JS) 흐름기반 프로그래밍](/js/2017/05/11/pipeline.html)
