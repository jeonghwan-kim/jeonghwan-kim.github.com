---
title: 순환 참조
layout: post
category: dev
tags: 
---

며칠전 일하다 발생했던 일이다. 
깃헙에서 코드를 로컬환경으로 가져와 머지한뒤 빌드하고 브라우져로 프론트엔드 어플리케이션을 돌리는데 이런 메세지가 나왔다. 

```
Uncaught TypeError: Object prototype may only be an Object or null: undefined
```

보통 오류 메세지와 함께 출력되는 스택 스레이스를 몇 단계만 따라가면 원인을 쉽게 찾기 마련이다.
하지만 이 녀석은 도통 모르겠다. 

개발팀 슬랙방에 문의해보니 경험많은 선임자로부터 이런 얘길 들었다. 

> 웬지 서큘라 디펜던시 냄시가 난다ㅠㅠㅠ


# 모듈 의존성

ES6 모듈시스템을 사용하면 한 방향으로 모듈을 가져온다.

> A -> B -> C

A가 B 모듈을 사용하고, B가 C모듈을 사용하는 방식으로. 


```js
// a.js
export default class A extends B {
  constructor () {
    super()
  }
}
```

```js
// b.js
export default class B {
  constructor() {
  }
}
```

C가 B나 A 모듈을 사용하는 경우는 거의 없었는데, 그렇게된다는 것은 각 모듈의 역할이 모호하다는 의미일 것이다.


# 순환 참조(Circular Dependancy)

근데 이번엔 이런 경우가 발생했다. 의존성 라인 마지막에 위치한 C 모듈이 A 모듈을 사용한 것이다.

> A -> B -> C -> A

이러면 꼬리를 무는 형태의 원이 생기는 것이고 이것은 순환 참조, Circualr dependancy 라고 말한다.
프로젝트가 커지고 코드 저장소를 함께 개발하는 개발자가 많아지다 보니 그럴 가능성이 생겼던 것 같다. 


```js
// A.js

import B from "./B.js";

export default class A extends B {
  constructor () {
    super()
  }
}
```

A 클래스는 B 클래스를 상속하기 때문에 B.js 모듈을 불러온다.

```js
// B.js
import A from "./A.js";

export default class B extends A { // 순환 참조 발생 !
  constructor() {
    super()
  }
}
```

B 모듈도 A 클래스를 상속하기 때문에 A.js  모듈을 불러온다. 

A.js - B.js 간에 서로 총을 겨누고 있는 모습이고 순환 참고 조건이다.

```
todo error 
```

# 모듈 초기화 순서 

웹팩이 모듈을 처리하는 방식이 어떻게 되는지 잘 모른다. 
로그로 찍어보면 의존성 순서 맨 마지막에 있는 녀석부터 모듈 초기화를 실행하는 것같다.
각 파일 상단에 콘솔 로그로 확인해 보면 A모듈이 아니라 A모듈이 사용한 B모듈부터 로그가 찍힌다.

B모듈은 다시 A모듈을 가져오기 때문에 의존성 마지막 모듈이 있다는건 말이 안되는것 같다.
아마 모듈을 해석할때 내부적으로 맵같은 데이터를 가지고 있어서 import 할때마다 모듈을 등록해 두어서 이런 순환 참조가 있더라도 모듈 등록을 마칠수 있도록 한것 아닐까? 
 
모듈 의존성 말단에 있는 B.js 파일의 코드가 맨 먼저 실행된다.
B 모듈을 초기화하기 시작하는데 A 모듈을 필요로 한다.
근데 A 모듈은 아직 초기화 전이다. 따라서 이런  오류가 발생한 것이라고 추정한다.
정확한 정보는 아니다.

```
Uncaught ReferenceError: Cannot access 'A' before initialization
```

# 상속뿐만 아니다

첨에 이게 클래스간 상속으로 의존성이 묶여있는 것이라고 짐작했다. 
그렇지 않다. 
변수를 모듈로 익스포트해도 비슷한 오류가 발생한다.

```js
// a.js
import {b} from "/b.js"

export const a = 'type a'

console.log(b)
```


```js
// b.js
import {a} from "./a.js"

console.log(a)

export const a = "type b"
```

```
todo error
```

# 해결 및 예방 

우리는 모듈 종단 점을 만들어서 이 문제를 해결했다. 
어떻게든 다른 모듈을 필요치 않는 독자적인 모듈을 만들어서 서클이 생성되는 것을 차단한 셈이다.

> 컨테이너 -> 페이지 -> 스토어 -> API 

명칭이야 어떻든 하나의 화면이 돌아갈때 이런 의존관계가 생기기 마련이다. 
화면에 그릴 데이터를 얻는 API를 모듈의 종단점으로 생각해서 API는 다른 모듈을 가져오지 않는 방식으로 말이다.

이 문제를 찾아보면서 예방하는 도구도 있다. 
노드에서는 m 머시기를 사용해서 의존 관계에 있는 코드를 찾아낸다.
웹팩에서는 이런 역할의 n 머시기 플러그인이 있다. 

이걸로 우리 프로젝트를 진단해 봤는데 꽤 많은 순환참조를 발견했다.
근데 이 모든것이 문제를 일읰지는 않는다. 모두 해결할 필요는 없을 것 같고 순환 참조라고 의심 될만한 문제가 발생했을 때 진단 도구로 사용하는 정도면 아직은 충분할 듯 하다.


# 참고 
- https://rinae.dev/posts/fix-circular-dependency-kr
- https://medium.com/content-uneditable/circular-dependencies-in-javascript-a-k-a-coding-is-not-a-rock-paper-scissors-game-9c2a9eccd4bc
- https://www.youtube.com/watch?v=JQQX62cUaYw
