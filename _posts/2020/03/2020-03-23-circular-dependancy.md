---
title: 순환 참조
layout: post
category: dev
tags: 
---

# 배경 

# 모듈 의존성

A -> B

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
    super();
  }
}
```

# Case1. 자명한 경우

```js
// a.js
export default class A extends B {
  constructor () {
    return new B();
  }
}
```

```js
// b.js
export default class B extends A {
  constructor() {
    super();
  }
}
```

```
Uncaught RangeError: Maximum call stack size exceeded
```

A 생성자 함수가 B 생성자 함수를 호출.
B 생성자 함수는 A 생성자 함수를 호출.
함수 호출이 무한으로 실행되고 스택에 함수 컨텍스트가 쌓이면서 스택이 넘처남.

# Case2. 순환 상속 

```js
// a.js
export default class A extends B {
  constructor() {
    super();
  }
}
```

```
Uncaught ReferenceError: Cannot access 'B' before initialization
```

A 생성자함수가 B생성자 함수를 호출. 
그러나 B는 A 모듈을 ...


# Case3. 상속이 아닌데도? 

```js
// a.js
export default class A extends B {
  constructor() {
    super();
  }
}
export const type = 'typeA'
```

```js
import {type} from "./a.js"

export default class B {
  constructor() {
      console.log(type)
  }
}
```

```
Uncaught ReferenceError: Cannot access 'B' before initialization
```

A 생성자 함수가 B 생성자 함수를 호출. 
B 생성자 함수는 A 모듈의 type을 사용.
B 는 초기화 되지 않았음. 클래스 관점이 아니라 모듈 관점으로 봐야함.

# 참고 
- https://rinae.dev/posts/fix-circular-dependency-kr
- https://medium.com/content-uneditable/circular-dependencies-in-javascript-a-k-a-coding-is-not-a-rock-paper-scissors-game-9c2a9eccd4bc
- https://www.youtube.com/watch?v=JQQX62cUaYw
