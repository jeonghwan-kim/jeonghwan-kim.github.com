---
slug: "/dev/2021/03/08/babel-typescript.html"
date: 2021-03-08
title: babel-loader와 ts-loader의 빌드 결과가 다른 현상
layout: post
category: 개발
tags: [빌드도구]
---

규모있는 자바스크립트 프로젝트의 개발 환경을 구성할 때 번들러를 사용한다. 파일간의 의존성을 분석해서 몇 개의 압축된 파일로 만들어 최적의 결과를 만들어낸다. 뿐만 아니라 웹팩 로더는 최신 ECMAScript를 사용하는데 쓰인다.

타입스크립트도 마찬가지로 웹팩을 이용해 빌드 환경을 구성한다. 타입스크립트 컴파일러인 tsc가 타입스크립트 코드를 자바스크립로 변환하지만 웹팩에서 함께 사용하기 위해 ts-loader가 쓰인다.

# ts-loader와 babel-loader

그동안 타입스크립트를 사용하는 프로젝트에서 ts-loader를 잘 사용했지만 가끔 아쉬운 점이 있었는데 그 중 하나가 핫 모듈 리플레이스먼트(HMR)를 지원하지 않는다는 점이다(참고: https://github.com/TypeStrong/ts-loader#hot-module-replacement). 반드시 필요한 것은 아니지만 한 번 익숙해지고나면 없을때 적잖이 불편하다.

바벨은 최신 ECMAScript 문법이나 리액트의 JSX 코드를 자바스크립트로 변환하는데 웹팩에서는 babel-loader와 함께 쓰인다. [바벨 7부터는 타입스크립트를 지원](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/)하고 2년 전에는 [사용한다는 글](https://iamturns.com/typescript-babel/)(번역글: [바벨과 타입스크립트의 아름다운 결혼](https://ui.toast.com/weekly-pick/ko_20181220))도 있어서 이제 좀 쓰이는가 싶어서 관심있게 보고 있었다. 특히 babel-loader로 바꾸면 HMR 기능도 사용할 수 있을 것 같았다.

지난 가을 새로운 프로젝트를 시작하면서 바벨로 타입스크립트 빌드 환경을 만들었다. 빌드 시간이 단축된다라고 하는데 체감할 정도는 아닌것 같다. 오히려 빌드 결과물이 ts-loader와 좀 달라서 원인을 찾는라 한참 헤맸는데 한 번 정리해 두어야 겠다.

# 클래스의 필드가 undefined로 초기화 된다.

상속 구조의 클래스를 사용할 때 발생했다. 생성자 인자로 넘겨 받은 데이터를 객체의 필드 값으로 할당하는 역할을 하는 `BaseModel` 클래스를 만든다.

```ts
class BaseModel {
  construct(data: any = {}) {
    Object.assign(this, data)
  }
}
```

이 `BaseModel`에서 파상된 `User` 클래스는 필드를 선언해서 클래스의 모양을 만든다.

```ts
class User extends BaseModel {
  name string

  construct(data: any) {
    super(data)
  }
}
```

`User` 클래스로 객체를 만들고 나면 name 필드에 전달한 값이 할당된다.

```ts
const user = new User({name: 'alice'))
console.log(user.name) // alice
```

ts-loader를 사용했을 때는 이렇게 예상한대로 동작했다. 그런데 babel-loader를 사용하자 `name` 필드에 `undefined` 값이 할당되어 있었다.

빌드한 결과물을 보면 생성자 함수에서 undefeind로 초기화하는 코드가 추가 되었다. void 연산자는 표현식을 실행하고 undefeind를 반환한다([MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/void) 참고).

```ts
class User extends BaseModel {
  construct(data) {
    super(data)
    this.name = void 0
  }
}
```

# 왜 이런 결과가 나왔을까?

필드 선언(Field declaration)은 아직 실험적 기능(stage 3)이기 때문에 이를 사용하려면 바벨의
@babel/plugin-proposal-class-properties 플러그인을 추가해야한다.

이 스펙을 좀 더 확인해 보자.

```ts
class User {
  name = ‘alice’ // ‘alice’로 초기화하는 initializer
}
```

클래스 선언시 필드명과 값을 초기화 한다. 만약 initializer가 없다면 해당 필드는 `undefined`로 초기화 된다.

> Fields without initializers are set to undefined. - [참고](https://github.com/tc39/proposal-class-fields#fields-without-initializers-are-set-to-undefined)

plugin-proposal-class-properties 플러그인은 이 명세에 따라서 초기자가 없는 필드는 생성자 안에서 `undefined`로 초기화하는 코드가 추가된 것이다.

비슷한 문제를 겪는 글([Differences in output of Typescript compiler and Babel for classes](https://kevinwil.de/differences-in-output-of-typescript-compiler-and-babel-for-classes/))을 찾았는데 해결 방법이 내 상황과 맞지 않았다. 기존 구조를 좀 바꿔서 상속하지 않고 각 모델 클래스 안에서 변수에 값을 할당하는 방식으로 타협했다.

```ts
class User {
  constructo(data: UserDto) {
    Object.assign(this, data)
  }
}
```

# 정리

ts-loader가 명세를 따르지 않는것 아닌가라는 생각이 잠깐 들었다. 하지만 babel-loader를 사용하기 전에는 문제 없이 타입스크립트를 사용하고 있었다. 어쩌면 현실적인 이유로 이렇게 스펙과 다른 결과를 만드는 것은 아닐까?

프로젝트 중간에 next.js로 개발환경을 바꿨고 처음에 하고 싶었던 HMR은 아무런 수고없이 잘 사용하고 있다.
