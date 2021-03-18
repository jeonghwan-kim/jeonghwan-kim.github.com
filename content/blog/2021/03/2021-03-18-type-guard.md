---
title: 유니온 타입과 타입 가드
layout: post
category: dev
tags: [TypeScript]
---

타입스크립트를 사용하면서 편리한 점은 코딩할 때 매우 정확하게 자동완성 된다는 점이다.
코드 편집기에 연동된 타입스크립트 컴파일러가 실시간으로 코드를 분석해서 타입을 추적해준 덕분이다.
타입스크립트 피처링의 멋진 개발 환경이다.

# 타입가드(Type Guard)

타입스크립트는 원시 타입과 클래스뿐만 아니라 이것들을 마구 섞어서 유니온 타입을 만들 수 있는데 함수 인자로 사용한 예를 보면 이렇다.

```ts
function doSomething(arg: string | number)
```

인자는 string일 수도 있고 number일 수도 있다.
이러한 유니온 타입의 인자를 처리할 때 정확히 어떤 타입인지 검사해야 할 경우가 있는데 이것은 **타입 가드**라고 한다.

> A type guard is some expression that performs a runtime check that guarantees the type in some scope. (출처:[typescriptlang.org](https://www.typescriptlang.org/docs/handbook/advanced-types.html))

타입 가드는 특정 범위 안에서 런타임 타입 검사를 수행하는 표현식이다.

# 원시 타입에 식별하기

원시 타입은 typeof 연산자를 이용해 타입을 검사할 수 있다.
피연산자의 타입을 문자열로 반환하기 때문에 이걸 가지고 검사하는 방식이다.

```ts
const doSomething(id: string | number) {
  if (typeof id === "string") {
    id.trim() // id가 문자열 이기 trim()을 사용해도 됨
  } else {
    id // string 타입이 아니기 때문에 남은 number 타입임
  }
}
```

함수 안에서 타입 가드 없이 id.trim()을 호출하면 타입스크립트는 오류를 내뱉는다.
왜냐면 number 타입일 가능성도 있기 때문이다. 따라서 typeof 연산자로 string 타입을 검사한 뒤에 string 함수를 사용해야 한다.

자바스크립트에서는 컴파일 과정이 없기 때문에 이러한 타입 검사를 하지 않고 바로 id.trim()을 사용해 버릴 수 있는데 위험한 코드가 된다.
반면 타입스크립트는 타입 가드를 사용하도록 강제해 불분명한 인자 타입을 검사하는 코드를 작성하게끔 하기 때문에 안전하다.

# 클래스 객체 식별하기

생성자 함수가 반환하는 클래스 객체는 typeof로 검사할 수 없다.
모든 객체가 문자열 "object"를 반환하기 때문이다.
대신 instanceof 연산자를 이용해 식별한다.
instanceof 연산자는 생성자의 프로토타입이 객체의 프로토타입 체인에 있는지 검사하기 때문이다.

```ts
class Diner { }
class Merchant { }

const doSomething(user: Diner | Merchant) {
   if (user instanceof Diner) {
    user.createOrder() // user가 Diner 클래스의 객체임
  } else {
    user.acceptOrder() // user가 Merchant 클래스의 객체임
  }
}
```

# 일반 객체 식별하기

타입스크립트로 객체 타입을 지정할 때 클래스 말고도 인터페이스를 사용한다.
자바스크립트 객체는 바로 리터럴로 생성하기 때문에 모양이 다를수 있는 반변 타입스크립트에서는 인터페이스로 객체의 모양을 강제할 수 있다.

```ts
interface Bird {
  fly(): number
}

interface Fish {
  swim(): number
}
```

Bird나 Fish 타입을 인자로 받는 아래 함수의 본체는 이를 식별하기위해 특정 속성 유무를 사용한다.

```ts
function doSomething(animal: Fish | Bird) {
  if ("swim" in animal) {
    ;(animal as Fish).swim() // swim 속성이 있으니깐 Fish 타입이구나
  } else {
    ;(animal as Bird).fly() // fly 속성이 있으니깐 Bird 타입이구나
  }
}
```

문제는 if("swim" in animal)에서 Fish 타입임을 체크했는데 그 다음 블록에서는 swim as Fish 로 다시 한 번 Fish 임을 알려줘야 한다는 점이다.
조건문 안에서 swim이 함수인지도 검사해서 as Fish를 줄일 수도 있지만 여전히 코드가 장황해 보이는 것은 마찬가지다.

# 사용자 정의 타입가드

얼마전 회사 코드 리뷰를 하다가 이러한 경우 사용자 정의 타입가드를 사용해서 깔끔하게 표현한 코드를 발견했다.

[사용자 정의 타입가드(User-Defined Type Guards)](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)

타임을 검사하는 함수를 만들고 이 함수에 전달한 인자가 특정 타입임을 확인하는 메세지를 반환한다.
메세지라고 표현했는데 문서에서는 타입 술어(Type Predicate 라고 했는데 번역이 마땅찮다)라고 부른다.
Fish 타입을 검사하는 isFish() 함수는 animal is Fish 라는 타입 술어를 반환한다.

```ts
function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined
}
```

함수의 본체는 불리언 값을 반환하다.
한편 함수 시그니처의 반환 값은 animal is Fish 라는 타입 술어라는 것이 눈에 뜨인다.

이제 isFish를 조건문에서 사용하면 유니온 타입에서 특정 타입을 검사하는 코드가 단순해진다.

```ts
function doSomething(animal: Fish | Bird) {
  if (isFish(animal) {
    animal.swim() // animal은 Fish 타입이 확실함
  } else {
    animal.fly() // animal은 Fish 타입이 아니니깐 Bird 타입이 확실함
  }
}
```

# 정리

유효 범위 안에서 유니온 타입을 검사하는 방법에 대해 알아 보았다.

원시 타입을 검사하려면 타입을 문자열로 반환하는 typeof 연산자를 사용한다.

클래스 객체을 검사려면 instanceof 연산자를 사용한다.

마지막으로 일반 객체로 섞인 유니온 타입을 검사하려면 사용자 정의 타입 가드를 사용한다.

알고있는 단어와 표현이 많을수록 외국어를 유창하게 할 수 있다고들 한다.
프로그래밍 언어도 문법을 얼마나 많이 알고 깊게 이해하느냐에 따라 우아한 코드를 쓸 수 있다는 것을 다시 한 번 깨닫는다.
