---
slug: "/dev/2020/03/24/circular-dependancy.html"
date: 2020-03-24
title: 순환 참조
layout: post
category: dev
tags: [JavaScript]
---

며칠전 일하다 발생했던 일이다.
깃헙 코드를 로컬환경으로 가져와 머지한뒤 빌드하고 브라우져로 프론트엔드 어플리케이션을 돌리는데 이런 메세지가 나왔다.

```
Uncaught TypeError: Object prototype may only be an Object or null: undefined
```

보통 오류 메세지와 함께 출력되는 스택 스레이스 몇 단계만 따라가면 원인을 찾기 마련이다.
하지만 이 녀석은 도통 모르겠다.

개발팀 슬랙방에 문의해보니 경험 많은 선임자로부터 이런 얘길 들었다.

> 웬지 서큘라 디펜던시 냄시가 난다ㅠㅠㅠ

# 모듈 의존성

코드를 파일로 분리하고 이것을 다른 파일이 불러와 사용하기 위해 우리는 모듈시스템을 사용한다.
A 파일이 B 모듈을 사용하면 "A는 B 의존성이 있다"라고 표현하기 마련이다.

> A -> B -> C

모듈간의 의존성은 이처럼 불러온 순서대로 하나의 선 혹은 트리를 만들기도 한다.

자바스크립트 클래스를 만들때 ES6의 모듈시스템을 활용해 하나에 한 파일을 작성한다.
컴포넌트 단위로 개발하다보면 더욱 그렇다.

A.js 모듈에 있는 A 클래스를 보자.

```js
// A.js

import B from "./B.js"

export default class A extends B {
  constructor() {
    super()
  }
}
```

A 클래스는 B 클래스를 상속하기 때문에 B.js 모듈을 가져와야하고 따라서 A 모듈은 B 모듈 의존성을 갖고 있다.

```js
// B.js

export default class B {
  constructor() {}
}
```

# 순환 참조(Circular Dependancy)

문제는 모듈간에 서로 참조하는 경우다.
A,B,C 순으로 모듈 의존성이 있는 와중에 마지막 C 모듈이 A모듈을 참조하면 어떤일이 벌어질까?

> A -> B -> C -> A

꼬리를 무는 형태의 원이 생기는 것이고 이것을 "**순환 참조**", "**Circualr dependancy**" 라고 말한다.
프로젝트가 커지고 개발자가 많아지다 보니 이런 경우가 생긴 것 같다.

```js
// B.js

import A from "./A.js"

export default class B extends A {
  // 순환 참조 발생 !
  constructor() {
    super()
  }
}
```

A 클래스가 B 클래스를 상속하는데 마침 B 클래스도 A 클래스를 상속하는 것이다.
A 모듈이 B 모듈을 불러온 것 처럼, B 모듈도 A 모듈의 의존성을 갖고 있다.

A - B 모듈 간에 순환참조가 생겼다.
웹팩으로 빌드한 자바스크립트는 브라우져에서 실행될 때 이런 메세지를 뿌릴 것이다.

```
Uncaught ReferenceError: Cannot access 'A' before initialization
```

# 모듈 초기화 순서

웹팩이 모듈을 처리하는 방식이 어떻게 되는지 잘 모르겠지만, 로그로 찍어보면 **의존성 맨 마지막 순서에 있는 녀석부터 모듈을 초기화** 하는 것 같다.
각 파일 상단에 콘솔 로그로 확인해 보면 A가 아니라 A가 사용한 B 모듈부터 로그가 찍힌다.

모듈 간의 싸이클이 있기 때문에 마지막 모듈을 찾을 수 없을 것 같지만,
아마 모듈을 불러올 때 내부적으로 맵에 이걸 등록해 두어서 이미 등록한 모듈은 불러오지 않아서 가능한 것은 아닐까?

그래서 그런지 모듈 의존성 말단에 있는 B.js 파일의 코드가 맨 먼저 실행된다.
B 모듈을 초기화하기 시작하는데 A 모듈을 필요로 한다.
근데 A 모듈은 아직 초기화 전이다. 따라서 이런 오류가 발생한 것이라고 추정한다.

```
Uncaught ReferenceError: Cannot access 'A' before initialization
```

# 상속뿐만 아니다

첨에 이게 클래스간 상속으로 의존성이 묶여있는 것이라고 짐작했다.
하지만 그렇지 않다.
변수를 모듈로 익스포트해도 비슷한 오류가 발생한다.

```js
// a.js

import { b } from "/b.js"

export const a = "a"
console.log(b)
```

a 모듈은 b 모듈을 가져온다.

```js
// b.js

import { a } from "./a.js"

export const b = "b"
console.log(a)
```

b 모듈도 a 모듈을 가져온다.

```
Uncaught ReferenceError: Cannot access 'a' before initialization
```

# 해결 및 예방

문제를 정확히 재현해 보려고 했지만 이게 잘 안됐다.
재현하는 방법에 따라 브라우져의 오류메세지도 달랐는데 참 까다롭다고 느겼다.
하지만 원인은 "순환참조" 이니깐 이렇게 정리해 두자.

우리는 **모듈 종단 점을 만들어서** 이 문제를 해결했다.
어떻게든 다른 모듈을 필요치 않는 독자적인 모듈을 만들어서 순환 참조가 생기는 것을 차단했다.

> 페이지 -> 서비스 -> API

명칭이야 어떻든 하나의 화면이 동작할 때 이런 의존관계가 생기기 마련이다.
화면에 그릴 데이터를 얻는 API를 모듈의 종단점으로 생각해서 API는 다른 모듈을 가져오지 않는 방식으로 말이다.

이 문제를 찾아보면서 예방하는 도구도 발견했다.
노드에서는 [madge](https://www.npmjs.com/package/madge)로 의존 관계에 있는 코드를 찾아낸다.
웹팩에서는 이런 역할의 [circular-dependency-plugin](https://github.com/aackerman/circular-dependency-plugin)도 있다. 

이걸로 우리 프로젝트를 진단해 봤는데 꽤 많은 순환참조를 발견했다.
하지만 이 모든 것이 문제를 일으키지는 않는다.
모두 해결할 필요는 없을 것 같고 순환 참조라고 의심 될만한 문제가 발생했을 때 진단 도구로 사용하는 정도면 충분할 듯 하다.

# 참고

- [[번역] 자바스크립트 & 타입스크립트의 순환 참조를 한방에 해결하는 방법](https://rinae.dev/posts/fix-circular-dependency-kr)
- [Circular dependencies in JavaScript a.k.a. Coding is not a rock-paper-scissors game](https://medium.com/content-uneditable/circular-dependencies-in-javascript-a-k-a-coding-is-not-a-rock-paper-scissors-game-9c2a9eccd4bc)
- [[영상]Circular dependencies in JavaScript](https://www.youtube.com/watch?v=JQQX62cUaYw)
- [Node.js의 순환 의존성](https://blog.outsider.ne.kr/1283)
