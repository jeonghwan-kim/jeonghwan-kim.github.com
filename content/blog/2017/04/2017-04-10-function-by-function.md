---
title: 함수로 함수 만들기1 다형성
layout: post
category: series
seriesId: 20170422
permalink: js/2017/04/10/function-by-function.html
tags: [javascript, functional-programming]
featured_image: /assets/imgs/2017/04/17/functional-javascript-thumbnail.png
---

> 이전글: [(함수형JS) 고차 함수](/js/2017/04/03/high-order-function-in-javascript.html)

![ploymophism](/assets/imgs/2017/04/10/ploymophism.png)

[지난 글](/js/2017/04/03/high-order-function-in-javascript.html)에서 고차함수를 다뤘다. 함수를 받고 다른 함수를 반환하는 고차함수를 이용하면 자바스크립트에서 다형성(polymorphism)을 구현할 수 있다. 다형성이란 타입이 다른 자료형이 하나의 상위 자료형으로 속하게 되는 개념인데 OOP를 지원하는 언어에서 많이 사용한다.

이번 글은 고차함수를 이용해 자바스크립트로 다형성을 구현하는 방법에 대해 알아보겠다.

## 인보커 함수
자바스크립트 객체는 모두 toString() 메소드를 가지고 있다.
*  `"abc".toString()` : "abc"
*  `[1,2,3].toString()` : "1,2,3"
*  `Number(2).toString()` :  "2"

각 자료형별로 문자열을 생성하는 메소드 toString()을 가지고 있는데 이것을 포괄하는 하나의 함수를 만들어 보겠다. 스트링 함수 string()는 들어오는 어떤 인자라도 그 인자의 고유 메소드 중 toString()을 호출하는 함수다.

스트링 함수를 만들기 전에 우선 인보커(invoker) 라는 함수를 만들어 보겠다. 인보커는 특정 프로토타입의 메소드만 실행해주는 녀석이다. 메소드 이름이 같더라도 객체의 프로토타입에 그 메소드가 없으면 실행하지 않는 일종의 메소드 실행기라고 생가하면 되겠다.

```javascript
const invoker = (name, method) =>  target => {
  if (target[name] && target[name] === method) {
    return method.apply(target);
  }
}
```

인보커는 함수 이름(name)과 메소드(method)를 전달받고, 그 후 타켓(target)을 파래매터로 받는 함수를 반환한다. 반환된 함수는 파라매터로 받은 타겟이 인보커에 전달된 메소드와 동일한 메소드를 갖고 있는지 체크한다. 메소드를 갖고 있다면 타겟의 메소드를 실행하고 그 결과 값을 리턴한다.

함수를 반환하는 인보커는 이렇게 사용할 수 있다.

```js
const string = invoker('toString', String.prototype.toString);

string('abc'); // 'abc'
string([1,2,3]); // undefined
```

인보커로 만들어진 스트링 함수(string())는 문자열 'abc'를 받아 문자열 객체의 toString 메소드를 실행하고 그 결과를 반환한다. 만약 전달 인자가 문자열이 아닌 경우, 예를 들어 배열일 경우, undefined 값을 반환할 것이다.

여기서 스트링 함수는 전달인자가 문자열일 때만 기대한 값을 반한한다는 것에 주목해야 한다. 결과값을 얻지 못하면 undefined값을 반환한다. 만약 배열의 toString() 메소드가 있었다면 undefined값이 나왔을 때 한번 더 시도해서 배열의 toString() 메소드로 문자열을 얻을 수 있었을 것이다.

* [1,2,3]을 `invoker('toString', String.prototype.toString)`이 반환한 함수의 인자로 전달
* undefined 값을 확인하면
* [1,2,3]을 `invoker('toString', Array.prototype.toString)`이 반환한 함수의 인자로 전달
* '1,2,3' 문자열 획득

나는 string 함수가 문자열 뿐만 아니라 배열, 숫자형에 대해서도 각 객체의 toString 메소드를 실행했으면 좋겠다. 그래서 생각한 것이 디스패치(dispatch) 함수다.

## 디스패치 함수
디스패치는 인보커로 만든 함수 목록을 인자로 받는다. 그리고 타켓을 받는 함수를 반환한다. 반환된 이 함수는 타켓의 특정 메소드를 실행하여 undefined 값이 아닌 기대하는 값이 나올때 까지 인보커로 만든 함수를 타켓과 함께 호출한다.

```js
const dispatch = (...funs) => target => funs.reduce(
  (ret, fun) => ret === undefined ? fun(null, target) : ret,
  undefined
);
```

디스패치는 인포커가 만들어 낸 함수를 인자로 받아 다른 함수를 반환한다. 함수를 전달받아 새로운 함수를 만들어 내는 고차함수의 전형적인 예다.

```js
const string = dispatch(
  invoker('toString', String.prototype.toString)
  invoker('toString', Array.prototype.toString));

string('abc'); // 'abc'
string([1,2,3]); // '1,2,3'
```

함수 배열을 인자로 받는 디스패치에 인보커로 생성한 함수 목록을 전달했다. 배열과 문자열의 toString() 메소드를 전달한 것이다.

디스패치로 만든 스트링 함수는 전달 인자가 문자열나 배열일 경우에 대해 각 객체의 toString() 메소드를 호출할 것이다. string('abc')는 문자열을 넘겼기 때문에 디스패치에 등록한 String.prototype.toString() 메서드를 실행하고 결과를 리턴한다.

한편 string([1,2,3])로 배열을 인자로 넘긴 예를 살펴보자. 디스패치는 등록한 함수목록을 순서대로 실행하는데 첫번째 메소드인 String.prototype.toString()을 [1,2,3]과 함께 호출한다. 하지만 배열 메소드가 아니라서 undefined가 나오고 다음 후보(인보커로 만든 함수)를 찾는다. 두번째 후보는 Array.prototype.toString() 이다. 문자열 메소드이기 때문에 [1,2,3]과 함께 호출하면 [1,2,3].toString()을 호출하는 것이고 비로소 '1,2,3'이라는 문자열을 얻을 수 있게된다.

디스패치에서 사용할 함수를 만드는 인보커, 그리고 함수를 받아 새로운 함수를 만드는 디스패치를 이용해 자바스크립트에서  다형성이라는 기능을 구현해 봤다. OOP에서 추상 클래스의 메소드를 실행하면 이를 구현한 구상 클래스들의 고유한 메소드를 실행하는 구조와 비슷하다.

## 조건문을 대체하는 방법
개발을 하다보면 아래와 경우는 빈번하다.

- 타입이 doubble이라면 숫자를 두 배하는 행동을 한다
- 타입이 greeting이라면 인사말 문자열을 반환한다
- 타입이 log라면 로그 메세지를 기록한다

정리하면 어떤함수로 전달된 객체가 있는데 이 객체에는 모두 타입(type)키가 있다. 타입에 따라 행동을 달라지는데 조건문으로 작성하기 마련이다.

```js
const runCommand = cmd => {
  if (cmd.type === 'doubble') {
    return cmd.num * 2;
  }  else if (cmd.type === 'greeting') {
    return `Hello ${target.name}`;
  } else if (cmd.type === 'log') {
    return `LOG: ${cmd.msg}`;
}
```

if/else 문은 프로그래밍 언어에서 자주 사용하는 구문이지만 조건이 많아지면 코드가 길어지고 가독성이 떨어지는 단점이 있다. 앞서 만든 디스패치를 이용하면 간결하고 읽기 좋은 코드를 만들어 낼 수 있다.

디스패치는 함수를 인자로 받는데  인보커로 만든 함수였다. 인보커로 만든 함수는 타겟을 인자로 받는데 이와 동일한 구조인 isa 함수를 만들어 보겠다.  isa는 함수명에서 유추할 수 있듯이 타입이 맞으면(is a type) 어떤 동작을 하고 그 결과를 반환하는 녀석이다.

```js
const isa = (type, action) => cmd => {
  if (cmd.type === type) return action(cmd);
}
```

isa는 타입과 액션을 전달 받은 뒤 어떤 함수를 반환하는데 커맨드(cmd)를 받는 함수다. 이 함수가 실행되면 isa에 전달한 타입(type)과 커맨드(cmd)의 타입을 확인한다.  타입이 같으면 커맨드의 액션(action) 함수를 실행하는 녀석이다.

가만보면 isa가 반환하는 함수는 하나의 인자 받는다. 두번째 이 함수의 결과가 올바르지 않으면 undefined를 반환한다. 인보커가 반환하는 함수와 같은 구조다. 따라서 **디스패치가 인보커를 이용해 새로운 함수를 만들듯, isa가 반환하는 함수도 디스패치로 조립할 수** 있다.

```js
const runCommand = dispatch(
  isa('doubble',  cmd => cmd.num * 2),
  isa('greeting', cmd => `Hello ${cmd.name}`),
  isa('log',      cmd => `LOG: ${cmd.msg}`)
);
```

런커맨드(runCommand) 함수는 앞으로 어떤 객체를 받을 것인데 이 객체의  타입(type)에 따라 다른 행동(action)를 취하는 녀석이다.

* doubble 타입이면 입력한 정수의 두배를 리턴한다.
* greeting 타입이면 'Hello Name' 문자열을 리턴한다.
* log 타입이면 로그 문자열을 반환하다.

앞서 정의한 요구사항과 코드의 표현이 똑같다. if/else로 표현한 코드는 장황한 반면 디스패치와 isa 함수로 조립한 런커맨드는 주석 한 줄 없이도 쉽게 의도를 파악할 수 있다.

```js
runCommand({type: 'log', msg: 'some log'});     // 'LOG: some log'
runCommand({type: 'doubble', num: 2}));         // 4
runCommand({type: 'greeting', name: 'Chris'})); // 'Hello Chris'
```

## 디스패치가 만든 함수를 디스패치의 인자로 전달하기

isa가 만든 함수는 인보커가 만든 함수와 같은 구조다.

* 인자를 하나 받는다 (target 혹은 cmd)
* 조건이 맞으면 유효한 결과 값을 반환한다
* 조건이 맞지 않으면 undefined 값을 반환한다

```js
function (target) {
  if (value) {
    return value;
  } else {
    return undefined;
  }
}
```

사실 디스패치가 만든 함수도 동일한 구조다. 반환된 이 함수도 target이라는 인자를 받아서 어떤 계산을 한다. 인보커나 isa가 만든 함수로 계산을 할 것이다. 결과 값이 유효하면 반환하고 그렇지 않으면 undefined값을 반환한다. 이것은 **디스패치가 반환한 함수도 디스패치의 인자로 들어갈 수 있다**는 것을 의미한다.

디스패치로 만든 런커맨드(runCommand) 함수를 디스패치의 인자로 넘겨 runCommand1 함수로 새롭게 만들 수 있다.

```js
const runCommand1 = dispatch(
  runCommand,
  isa('kill', cmd => `shut down reason: ${cmd.reason}`)
);

runCommand1({type: 'kill', reason: 'memory leak'});
  // 'shut down reason: memory leak'
```

runCommand는 log, doubble, greeting 타입에 대한 액션을 처리하는 녀석이었다. 여기에 덧붙여 디스패치를 이용해 kill 타입에 대한 액션을 추가한 runCommand1을 만들었다.

## 결론
고차함수를 이용해 자바스크립트에서 다형성을 구현한 함수를 만들어 봤다. 인보커나 isa 함수는 타겟을 받는 함수를 리턴하는데 이것은 그대로 디스패치의 인자로 들어간다. 디스패치는 전달받은 함수들을 소비하는 또다른 함수를 만들어 낸다. 그것이 스트링과 런커맨드다. 게다가 디스패치로 만든 함수를 다시 디스패치의 인자로 넘겨 새로운 함수를 만들었다.(runCommand1)

함수를 **조립**한다는 것은 무엇일까? 숫자와 숫자를 연산해 새로운 숫자를 만들 수 있는 것을 숫자의 조립으로 볼수 있을까? 함수를 조립할수 있으려면 조립할 함수를 인자로 받을 수 있어야 한다. 그리고 이렇게 조립한 결과 새로운 함수를 만들어 낼 수 있어야 한다. 이것은 또 다른 고차 함수의 인자로 들어가 조립 가능성을 유지해 주어야 한다. 고차함수를 이용해 함수를 조립해 보면서 자바스크립트에서 함수를 일급 객체로 여기는 것을 실감할 수 있었다.


> 다음글: [(함수형JS) 함수로 함수 만들기2 커링](/js/2017/04/17/curry.html)