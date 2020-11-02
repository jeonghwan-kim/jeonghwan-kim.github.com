---
title: 자바스크립트 this 바인딩 우선순위
layout: post
category: dev
permalink: 2017/10/22/js-context-binding.html
tags: [JavaScript]
summary: 자바스크립트의 네 가지 컨텍스트 바인딩에 대한 우선순위를 정리한다
---

자바스크립의 컨텍스트(this) 바인딩은 헷갈릴 때가 많다.
"이 정도면 이해할수 있겠군" 하다가도, 막상 코딩하다 보면 예상치 못한 상황에 부딪쳐 당황한적이 있지 않은가?

이 글은 자바스크립트 컨텍스트 바인딩을 **"우선순위"**라는 관점에서 정리했다.
카일 심슨의 글 [this와 객체 프로토타입](http://www.yes24.com/24/Goods/44132601?Acode=101)을 참고했다.

## 기본 바인딩

먼저 아래 코드로 시작해 보자.

```js
function hello() {
  console.log(this.name)
}

var name = "chris"

hello() // "chris"
```

기본적인 함수 실행이다.
`hello()` 함수를 실행하면 this는 전역객체와 바인딩된다.
자바스크립트는 **기본적으로 전역 객체에 컨텍스트가 바인딩되는 규칙**을 가진다.

하지만 엄격모드에서는 좀 다르다.
`hello()` 함수를 호출하면 기본바인딩 규칙이 동작하지 않는다.
`hello()` 함수에서 this는 undefeined가 되어 "Type Error"가 발생한다.

![Type Error 캡쳐 이미지](/assets/imgs/2017/10/type-error.png)

그럼 엄격모드와 비엄격모드를 섞어서 코딩하면 어떻게 될까?
아래 코드를 읽어보자.

```js
function hello() {
  console.log(this.name)
}

var name = "chris"

;(function () {
  "use strict"
  hello() // "chris"
})()
```

엄격모드에서 `hello()` 함수를 호출했더라도 함수 실행부가 비엄격 모드라면 컨텍스트는 전역 객체에 바인딩된다.

브라우져 개발자 도구로 중단점을 찍어서 디버깅해 보면 엄격모드로 실행되는 호출부에서는 this가 undefined로 확인된다.

![엄격 모드에서의 컨텍스트 확인 캡처 이미지](/assets/imgs/2017/10/context-in-strict-mode.png)

`hello()` 함수 실행부에서는 전역인 Window 객체임을 알 수 있다.

![비엄격 모드에서의 컨텍스트 확인 캡처 이미지](/assets/imgs/2017/10/context-in-non-strict-mode.png)

## 암시적 바인딩

다음은 함수 호출시 객체의 프로퍼티로 접근해서 실행하는 암시적 바인딩이다.
아래 코드를 보자.

```js
function hello() {
  console.log(this.name)
}

var obj = {
  name: "chris",
  hello: hello,
}

obj.hello() // 'chris'
```

`obj` 객체의 `hello` 프로퍼티에 `hello()` 함수의 레퍼런스를 할당했다.
그리고 이 `obj` 객체를 통해 `hello()` 함수를 호출했다.
`hello()` 함수는 실행될때 **호출부의 객체 프로퍼티로 접근했을 경우 이 객체를 this와 바인딩하는 규칙**을 갖는다.

하지만 객체 프로퍼티에 함수를 할당했더라도 아래와 같은 경우에는 다르게 동작한다.

```js
function hello() {
  console.log(this.name)
}

var obj = {
  name: "chris",
  hello: hello,
}

helloFn = obj.hello

name = "global context!"

helloFn() // 'chris'일까 'global context!'일까?
```

`obj` 객체의 프로퍼티에 `hello()` 함수를 할당했지만, `helloFn`에 레퍼런스를 저장하는 순간 이것은 일반 함수가 된다.

따라서 일반함수 `helloFn()`을 호출하면 기본 바인딩 규칙을 따르게 된다.
함수를 실행하는 순간 글로벌 컨택스트가 this에 바인딩되고 `this.name`은 `obj.name`이 아닌 글로벌 객체의 name인 'global context!'를 바라보게 되는 것이다.

이런 형태는 콜백함수로 사용할 때 적잖게 발생하는 실수다.
타이머에 콜백함수를 넘겨주는 코드다.

```js
function hello() {
  console.log(this.name)
}

var obj = {
  name: "chris",
  hello: hello,
}

setTimeout(obj.hello, 1000) // 1초 후에 hello 함수가 동작하면 this는?

name = "global context!"
```

`setTimeout()` 함수에 콜백함수로 `obj.hello`를 넘겨줬다.
`setTimeout` 측에서는 `obj` 객체와는 전혀 상관없이 `obj.hello`가 가리키는 `hello()` 함수만 알고 있을 뿐이다.
1초후에 실행하는 코드는 `hello()`함수를 기본 바인딩해서 실행하는 것과 동일하다.

따라서 위 결과는 'global context!'가 출력된다.

## 명시적 바인딩

좀 더 직관적으로 "난 객체를 컨택스트로 바인딩 할거야!"라고 코드에 의도를 나타내는 방법은 없을까?
그리고 타임아웃 함수에 넘겨준 콜백함수 문제도 해결하는 방법은 없을까?

자바스크립트의 `call()`, `apply()`, `bind()` 함수가 그런 역할을 하는 내장 함수들이다.
`call()`과 `apply()` 함수는 실행할 함수 인자를 넘기는 방식만 다를뿐, 컨텍스트 객체를 명시한다는 점에서 동일한 함수다.

`call()` 함수로 컨택스트를 명시하여 실행해 보자.

```js
function hello() {
  console.log(this.name)
}

var obj = {
  name: "chris",
}

name = "global context!"
hello.call(obj) // "chris"
```

`call()`는 Function.prototype 객체의 프로퍼티 중의 하나다.
`hello.call()` 형태로 사용할 수 있는 이유다.

`call()` 함수에 this 컨택스트와 바인딩할 객체를 명시할 수 있다.
`hello()` 함수가 실행되면 this는 글로벌 컨택스트가 아닌 `obj` 객체가 된다.
따라서 `this.name`은 `obj.name`과 같다.

한편 `bind()`는 함수를 정의할때 컨택스트를 바인딩 할 수 있는데 이것은 **"하드 바인딩"**이라고 한다.

`setTimeout()` 함수에 전달할 함수를 `bind()`를 이용해 컨택스트를 명시해 보겠다.

```js
function hello() {
  console.log(this.name)
}

var obj = {
  name: "chris",
}

setTimeout(obj.hello.bind(obj), 1000) // 1초 후에 hello 함수가 동작하면 this는?

name = "global context!"
```

`obj.hello`를 넘겨줄 때는 글로벌 컨택스트가 바인딩되는 반면, `obj.hello.bind(obj)`를 넘겨주면 `obj` 객체가 `hello()` 함수 실행시 this 컨택스트로 바인딩해서 실행하라는 의미다.
따라서 1초 후에 `hello()` 함수가 실행될 것이고, 이때 this는 `obj` 객체를 가리킨다.
따라서 `this.name` 값은 'chris'가 되는 것이다.

## 암시적 바인딩과 명시적 바인딩의 우선순위

그럼 암시적 바인딩과 명시적 바인딩의 우선순위는 어떻게 될까?

```js
function hello() {
  console.log(this.name)
}

var obj = {
  name: "chris",
  hello: hello,
}

obj.hello() // 'chris'
obj.hello.call({ name: "alice" }) // 'alice
```

`obj.hello()`는 암시적 바인딩 규칙이 적용되어 `obj` 객체가 바인딩된다.
`obj.name`인 'chris'를 출력한다.

반면 `obj.hello.call()` 함수를 통해 `{name: 'alice'}` 객체를 명시적으로 바인딩하면,
`obj` 객체를 통해 `hello()` 함수를 실행했더라도 `call()` 함수에 의해 명시적으로 바인딩된 `{name: 'alice'}` 객체가 this로 바인딩 된다.

> 명시적 바인딩 > 암시적 바인딩

따라서 암시적 바인딩을 확인하기 전에 반드시 `call()`, `apply()`, `bind()` 함수를 이용한 명시적 바인딩이 적용되었는지 확인하도록 하자!

## New 바인딩

마지막으로 new 바인딩을 살펴보겠다.

자바스크립트 함수 앞에 new를 붙여서 실행하며 다음과 같은 일이 일어난다.

- 새로운 객체를 반환한다
- 새로운 객체는 객체의 메소드 호출시 this로 바인딩 된다

아래 `Person()` 함수를 `new` 키워드로 호출하면 어떤 일이 일어날까?

```js
function Person(name) {
  this.name = name
}
Person.prototype.hello() {
  console.log(this.name)
}

var obj = new Person('chris');
obj.hello(); // "chris"
```

`new Person(name)` 함수를 실행하면 새로운 객체를 반환하는데 이것이 `obj`에 할당된다.
`obj.hello()` 를 실행하면 `hello()` 함수는 **new로 반환된 obj 객체를 this 컨택스트와 바인딩 되는 규칙**을 따른다.

따라서 `hello()` 함수 내에서 this는 `new Person()` 이 반환하는 객체가 되는 것이다.

## 암시적 바인딩과 new 바인딩의 우선순위

그럼 new 바인딩은 암시적 바인딩보다 우선할까? 아래 코드로 실험해 보자.

```js
function hello(name) {
  this.name = name
}

var obj1 = {
  hello: hello,
}

obj1.hello("chris")
console.log(obj1.name) // chris

var obj2 = new obj.hello("alice")
console.log(obj1.name) // chris
console.log(obj2.name) // alice
```

`obj1.hello('chris')`를 실행하면 암시적 바인딩 규칙에 의해 `obj1` 객체가 컨택스트로 바인딩된다.
따라서 함수 실행후 `obj1.name`에 'chris'가 할당된다.

반면 객체의 프로퍼티로 함수에 접근해도 `new` 키워드로 함수를 실행하면 new 바인딩이 우선함을 알수 있다.
`obj1.name`은 변함이 없고 `obj2.name`이 'alice'로 할당된 것이 그 증거다.

> new 바인딩 > 암시적 바인딩

암시적 바인딩을 사용하기 전에 new 바인딩이 되었는지 먼저 확인하자!

## 명시적 바인딩과 new 바인딩의 우선순위

이제 남은 건 명시적 바인딩과 new 바인딩과의 관계다.
명시적 바인딩을 위한 `call()`, `apply()` 함수와 `new`를 동시에 테스트하는건 좀 어려워 보인다.

대신 `bind()` 함수는 컨택스트가 바인딩된 새로운 함수를 반환하는 특징을 가지고 있다.
`bind()` 함수를 이용한 하드 바인딩과 new 바인딩 사이의 우선순위를 확인해 보자.

```js
function hello(name) {
  this.name = name
}

var obj1 = {}

var helloFn = hello.bind(obj1)
helloFn("chris")
console.log(obj1.name) // chris

var obj2 = new helloFn("alice")
console.log(obj1.name) // chris
console.log(obj2.name) // alice
```

`hello.bind(obj1)`를 이용해 `obj1` 객체를 `hello()` 함수의 컨택스트로 하드 바인딩 처리했다.

그 결과 `helloFn` 함수를 만들었다.
`helloFn('chris')`를 실행하면 하드 바인딩된 `obj1`객체가 this가 되고, `obj1.name`이 'chris'로 할당 되는것 까지 확인할 수 있다.

한편 `obj1`으로 하드바인딩된 `helloFn()` 함수를 `new` 키워드를 이용해 호출하면 어떻게 될까?
이것은 새로운 객체를 반환하는데 이 객체가 컨택스트로 바인딩된다.
그 결과 `obj2.name`에 'alice'값이 할당된 것을 확인할 수 있다.

즉 new 바인딩이 명시적 바인딩보다 우선순위가 높다는 것을 알 수 있다.

> new 바인딩 > 명시적 바인딩

`call()`, `apply()`, `bind()` 함수로 명시적 바인딩을 사용하기 전에 new 바인딩 여부를 확인하자!

## 결론

이제 네 가지 바인딩의 우선순위를 정리할수 있다.

**1) new로 함수를 호출했는가? 그럼 실행결과 반환되는 값이 this다.**

```js
var obj = new hello() // this === obj
```

**2) call, apply, bind로 함수를 호출했는가? 그럼 인자로 넘겨준 객체가 this다.**

```js
var obj = {}
hello.call(obj) // this === obj
hello.apply(obj) // this === obj
hello.bind(obj)() // this === obj
```

**3) 객체 프로퍼티로 접근하여 함수를 실행했는가? 그럼 이 객체가 this다.**

```js
obj.hello() // this === obj
```

**4) 이외의 경우는 this는 전역 객체다.**

브라우져의 경우 this는 Window 객체이고 엄격모드에서는 undefined 값이된다.

결론은 네 가지 바인딩이 아래 우선순위를 따른다는 것이다.

> new 바인딩 > 명시적 바인딩 > 암시적 바인딩 > 기본바인딩

## 예외상황들

이렇게 정리했음에도 불구하고 예외는 있다.

### 명시적 바인딩시 빈 객체를 넘겨주는 경우

call, apply, bind에 명시적으로 객체를 넘기지 않고 null 값을 넘기는 경우는 어떻게 동작할까?

```js
function hello() {
  console.log(this.name)
}

var name = "chris"

hello.call(null) // "chris"
```

`hello.call(null)`로 `hello()` 함수를 실행하면 this는 전역객체를 바라본다.
기본 바인딩이 적용되는 것이다.

`bind()`함수에 null을 첫 번째 인자로 넘기는 경우가 있는데 컨텍스트 바인딩과는 다른 목적으로 사용된다.

```js
function sum(a, b) {
  return a + b
}

var add5 = sum.bind(null, 5)
add5(2) // 7
```

`sum.bind(null, 5)`는 `sum()` 함수 실행시 컨택스트를 명시하지 않았다.
중요한 것은 두 번째 인자로 5를 넘긴 것이다.
그 결과 반환된 것은 함수인데 `sum()` 함수의 첫번째 인자를 5로 고정한 함수다.

이것을 부분함수, 혹은 커링이라고 한다.
[함수로 함수 만들기 2 커링](/js/2017/04/17/curry.html), [함수로 함수 만들기3 부분적용
](/js/2017/04/21/partial-application.html) 글을 참고하기 바란다.

부분함수와 커링이 목적이라고 하더라도 컨택스트 인자로 null을 넘기는 것은 좀 위험해 보인다.
만약 sum 함수에서 this를 사용하는 코드라도 만난다면?
예상치 못한 결과가 발생할 것이다.

따라서 빈 객체라도 만들어 넘겨주는 것이 안전한 방법이다.

```js
var add5 = sum.bind(Object.create(null), 5)
```

### 어휘적 this

ES6부터 사용할수 있는 화살표 함수(arrow function)는 기존의 컨택스트 바인딩 규칙을 따르지 않는다.
기존 네 가지 컨택스트는 실행 시점에 바인딩 규칙이 적용된다.
**"동적 바인딩"**이라 할수 있다.

반면 화살표함수는 실행하지 않고도 바인딩 규칙을 알 수 있다.
이미 정해졌다는 점에서 **"정적 바인딩"**이다.
화살표함수는 **코드상 상위 블록의 컨택스트를 this로 바인딩하는 규칙**을 갖는다.

먼저 아래 기존 바인딩을 규칙을 이용한 타이머 예제를 보자.

```js
function hello() {
  setTimeout(function callback() {
    console.log(this.name)
  })
}

var obj = {
  name: "chris",
  hello: hello,
}

var name = "global contenxt!"

hello() // 'global contenxt!'
obj.hello() // 'global contenxt!'
hello.call({ name: "chris" }) // 'global contenxt!'
```

흔히 발생할 수 있는 실수다.

`setTimeout()` 함수에 넘겨준 `callback`은 실행시점에 컨택스트가 정해질 것이다.
기본 바인딩인 `hello()`, 암시적 바인딩인 `obj.hello()`, 그리고 명시적 바인딩인 `hello.call()`를 실행해 보자.

`callback()`은 `setTimeout()` 함수가 실행시키는 것이므로 `setTimeout()`에 의존적이다.
내장함수인 `setTimeout()` 함수는 `callback()` 형태로 실행시킬 것이므로 여기서 this는 글로벌 객체로 바인딩 된다.

이제 화살표 함수의 동작을 살펴볼 차례다.

```js
function hello() {
  setTimeout(() => {
    console.log(this.name)
  })
}
var obj = {
  name: "chris",
  hello: hello,
}
var name = "global contenxt!"

hello() // 'global contenxt!'
obj.hello() // 'chris'
hello.call({ name: "alice" }) // 'alice'
```

화살표 함수는 상위 블록의 컨텍스트를 this로 사용한다고 했다.

`hello()`로 호출했을 경우 기본 바인딩된 전역 객체를 사용하는 것을 확인할 수 있다.

`obj.hello()`는 암시적 바인딩된 `obj` 객체를 사용하고 있다.

마지막으로 `hello.call()`처럼 명시적 바인딩된 객체를 사용하는 것을 알 수 있다.
