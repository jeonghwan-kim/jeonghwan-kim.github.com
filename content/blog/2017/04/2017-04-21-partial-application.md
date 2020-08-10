---
title: 함수로 함수 만들기3 부분적용
layout: post
category: series
seriesId: "bd02e3bf-8437-5d5c-a1d4-463b0f61eadb"
permalink: js/2017/04/21/partial-application.html
tags: [javascript, functional-programming]
featured_image: /assets/imgs/2017/04/17/functional-javascript-thumbnail.png
---

> 이전글: [(함수형JS) 함수로 함수 만들기2 커링](/js/2017/04/17/curry.html)

![partial-application-banner](/assets/imgs/2017/04/21/partial-application-logo.png)

커링을 충분히 이해했다면( [(함수형JS) 함수로 함수 만들기2 커링](/js/2017/04/17/curry.html) ) 부분적용은 쉽게 접근할 수 있다. 커링이 하나의 인자만 받는 함수열을 만드는 것이었다면, 부분적용은 여러개 인자를 미리 고정하고 나머지 인자만 받는 함수 하나를 반환한다. 여러번 함수를 호출해야하는 것이 커링의 단점일 경우가 있는데 부분적용으로 해결할 수 있다.

## 부분적용
partial() 함수는 실행할 함수 fun과 인자 몇개를 미리 받는다. 그리고 나머지 인자를 받을 수 있는 함수를 반환한다.

```js
const partial = (fun, ...args1) => {
  return (...args2) => fun.apply(null, [...args1, ...args2]);
}
```

커링이 하나의 함수만 인자로 받고 또 그러한 함수를 반환했던 것과 달리, 부분적용은 필요한 만큼 인자를 받아 클로져로 캡쳐해 놓는다. 반환한 함수가 나머지 인자들를 받고 함수 fun에 캡쳐한 인자와 나머지 인자들을 전부 전달한다.

커링과 부분적용의 동작 원리를 이해했다면 부분적용을 어떻게 사용하는지 아는 것이 다음 차례다. 모든 함수는 인자를 받아 로직을 수행하는데 함수가 요구하는 인자 형식이 있을 것이다. 특히 타입이 없는 자바스크립트는 인자에 대한 검증이 필요할 상황이 많다. 이렇게 선행 조건을 만족할 경우에만 함수를 실행하도록 부분적용으로 풀어 보겠다.

## 선행조건
먼저 정수를 제곱하는 sqr() 함수를 만든다.

```js
const sqr = n => n * n;

sqr(2); // 4
sqr('two'); // NaN
```

입력한 정수를 제곱하는 함수이지만 문자열을 넣으면 NaN이라는 엉뚱한 값이 나온다. 값을 곱하기 전에 파라매터를 확인해서 정수 여부를 체크하는 로직을 만들어 보자. 정수면 제곱하고 그렇지 않으면 예외를 던지는 기능을 만들 것인데 부분적용을 이용한다.

### condition(): 검증자를 통과하면 함수를 실행한다

커링으로 만든 checker 함수를 기억하는가? 검증자(validator) 목록을 받은 뒤 검증대상을 인자로 받는 함수를 반환했다. checker로 반환된 함수는 단지 전달한 값이 검증에 통과하는지 여부만 확인할 수 있다.

우리가 만들 condition은 checker 기능 뿐만아니라  검증된 값을 실제로 사용하는 녀석이다. 어떤 행동을 할수 있다록 함수를 인자로 받을 것이다. condition이 반환하는 함수는 함수와 정수를 인자로 받는다. 커링이 하나의 인자만 받는 반면, 부분적용은 한번에 필요한만큼의 인자를 받는다.

```js
const condition = (...validators) => (fun, arg) => {
  const result = validators.reduce(
    (isValid, vali) => vali(arg) ? isValid : false,
    true
  );

  if (!result) throw new Error();
  return fun(arg);
}
```

검증자 validators를 받아 fun과 arg를 인자로 받는 함수를 반환했다. 반환된 함수를 실행하면 먼저 검증자를 이용해 arg 값을 검사한다. 검증에 통과하지 못하면 에러 객체를 던지도록 했다. 검증된 값은  fun 함수의 인자로 전달하여 실행하고 결과를 반환한다.

### sqrConditon(): 정수일때만 함수를 실행한다

선행 조건을 체크하는 condition과 제곱을 구하는 sqr이 준비되었다. 이 둘을 이용해서 입력한 값이 정수일 때만 제곱값을 반환하는 새로운 버전의 제곱 함수를 만들어 보자.

```js
const isInteger = arg => Number.isInteger(arg);
const sqrConditon = condition(isInteger);

sqrConditon(sqr, 2); // 4
sqrConditon(sqr, 'a'); // throw error
```

isInteger 정수 여부를 확인하는 검증자 함수다. condition과 isInteger 검증자를 합체해서 sqrCondition 함수를 만들었다. 이것은 두 개의 인자를 받는데 검증자를 통과한 다음 실행할 함수와 정수를 전달 받는다. sqrCondition(sqr, 2)는 정수 2가 검증에 통과한 뒤 sqr 함수로 전달되어 정수 4를 반환한다.

반면 sqrCondition(sqr, 'a')는 문자열 'a'가 isInteger 검증자에 통과하지 못하고 곧장 예외를 던진다.

### checkedSqr(): 정수일때만 제곱한다

sqrConditon(sqr, 3) 은 약간 어색한 함수 사용이다. 제곱을 구하는데 함수 사용이 직관적이지 않다. 선행 조건을 체크하는 sqrCondition과 sqr을 조합하여 정수 하나만 받아 제곱을 구하는 함수를 만들수 있는데 partial을 사용할 것이다.

```js
const checkedSqr = partial(sqrConditon, sqr);

checkedSqr(3); // 9
checkedSqr('b'); // throw error
```

partial 함수는 첫번째 인자로 들어온 함수에게 두번째로 들어온 인자들을 미리 전달한다. 그리고 partial이 반환한 함수로 전달받은 인자들을 추가로 전달해서 실행한다. 그러니깐

* sqrCondtion 함수에게 sqr 를 미리 전달하고
	* -> sqrCondition(sqr)
* partial로 만든 checkedSqr이 받은 인자 3을 추가로 sqrCondition에게 전달한다.
	* -> sqrCondition(sqr, 3)

선행 조건을 검사하는 sqrCondition이 두 개 인자(함수와 정수)를 받았다면, checkedSqr은 sqrCondition과 검증에 통과한 후 실행할 함수 sqr을 부분적용한 함수다. 이 함수는 checkedSqr(3) 처럼 정수 3만 전달해서 사용할 수 있다.

참고로 순서만 변경하면 커링으로도 같은 기능을 하는 함수를 만들수 있다.

```js
const curry2Left = fun => arg1 => arg2 => fun(arg1, arg2);
const checkedSqr = curry2Left(sqrCondition)(sqr);
```

부분적용을 사용하는 이유는 커링으로 함수를 만들때 함수 호출 횟수를 줄이기 위해서다.

### checkedOddSqr(): 홀수일때만 제곱한다

checkedSqr은 이것만으로도 제 기능을 훌륭하게 해낸다. 상상력을 더해 홀수만 제곱하는 함수로 만들어 보는 것은 어떨까?

```js
const isOdd = n => n % 2;
const checkedSqrCondition = condition(isOdd)
const checkedOddSqr = partial(checkedSqrCondition, checkedSqr);

checkedOddSqr(3); // 9
checkedOddSqr(4); // throw
```

정수 여부를 체크하는 isOdd 검증자를 만들었다.

condition 함수에 isOdd를 전달여서 홀수일때만 어떤 행동을 하는 함수인 checkedSqrCondition을 만들었다. 이것은 checkedSqrCondition(checkedSqr, 3) 처럼 사용하게 될 것이다.

sqrCondition(sqr, 3)을 checkedSqr(3)으로 개선했듯이, 같은 방법으로 partial 함수를 이용해  checkedOddSqr(3)으로 만들수 있다.

partila로 만든 함수 checkedOddSqr(3) 을 실행하면

* checkedSqrCondition 함수에게 checkedSqr 를 미리 전달하고
	* -> checkedSqrCondition(checkedSqr)
* partial로 만든 checkedOddSqr이 받은 인자 3을 추가로 checkedSqrCondition에게 전달한다.
	* -> checkedSqrCondition(checkedSqr, 3)

checkedSqrCondition은 입력한 값이 홀수인 것을 확인한 다음 checkedSqr(3)을 실행한다.

## 정리
자바스크립트에서 정수는 일급으로 취급한다. 두 개의 정수를 더해서 새로운 정수를 만드는 것이  가능하다. 함수도 일급으로 처리한다. 따라서 두 개의 함수를 더해서(조합해서) 새로운 함수를 만드는 것이 가능하다.

함수를 인자로 받고 또 다른 함수를 반환하는 고차함수 방식을 사용하면 함수조합이 가능하다. 커링을 이용하면 여러개 인자를 받는 함수를 하나의 인자만 받는 함수열로 만들수 있다. 마지막으로 부분적용으로 필요한 만큼 인자를 미리 적용한 새로운 함수를 만들어 낼수 있다.

몇번이고 글을 읽고 정리하는데도 머리가 혼란스럽다. 정수를 조합하는 것은 쉽게 이해되는데 함수를 조합하는 것은 잘 그려지지 않는다. 함수가 하나의 차원이고 차원간에 조합으로 다른 차원을 만들어 내는 것이라는 생각이 든다.

> 다음글: [(함수형JS) 순수성, 불변성, 변경정책](/js/2017/04/23/Purity-Immutability-and-Policies-for-Change.html)