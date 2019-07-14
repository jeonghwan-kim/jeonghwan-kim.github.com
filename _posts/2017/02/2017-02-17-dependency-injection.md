---
title: 의존성 주입
layout: post
category: dev
permalink: js/2017/02/17/dependency-injection.html
tags:
  design-pattern
summary: 프론트엔드에서 의존성 주입에 대해 설명하는 글입니다
---

## 의존성 주입은 어떻게 사용하는가?

의존성 주입(Dependency Injection, DI)을 처음 접한 것은 앵귤러JS를 사용하면서부터다.
앵귤러 컨트롤러 함수에서는 의존성 객체(대부분 서비스)를 함수 매개변수로 받은 뒤 사용한다.
대표적인 것이 $scope라고 하는 스코프 객체다.
앵귤러 컨트롤러 함수는 템플릿과 데이터를 연결하는 역할을 하는데 스코프 객체가 그 역할을 한다.
이 때 컨트롤러는 스코프 객체를 사용하여 데이터 바인딩 기능을 구현하기 때문에 "컨트롤러는 스코프 객체에 의존성이 있다”라고 하는 것이다.

컨트롤러는 스코프 객체가 어디에 정의되었는지 모른다.
단순히 컨트롤러를 정의할 때 파라매터를 선언한 것만으로도 스코프 객체를 사용할 수 있게 된다.
아래 코드처럼 말이다.

```js
app.controller('myapp', function($scope) {
  // 주입된 $scope 객체를 사용한다
});
```

앵귤러 프레임웍에서는 이렇게 의존성 목록을 파라매터로 선언하기만하면 내부적으로 의존성 객체들을 찾아서 함수의 파라매터로 넘겨준다.

만약 DI를 직접 구현한다면 어떻게 이것을 사용할 수 있을까?
아래 코드를 보자.

```js
di.register('main', ['dep1', 'dep2'], function(dep1, dep2) {
  // dep1과 dep2 객체 혹은 함수를 사용할 수 있다.
});
```

main이라는 함수를 네임스페이스에 등록하는 과정인데 내부적으로 dep1, dep2를 사용한다.
main 함수는 dep1, dep2에 의존성을 갖고 있기 때문에 이를 함수 등록시 선언한다.
의존성 주입이 완료되면 세번째 파라매터인 함수 본체가 실행되고 dep1과 dep2가 함수 파라매터로 전달된다.
결국 main 함수는 dep1, dep2 의존 객체 선언만으로 이 객체들을 주입받아 함수 본체에서 사용수 있다.

## 의존성 주입 구현

의존성 주입을  DI 클래스로 구현해 보겠다.

```js
class DI {
  constructor() {
   this.registrations = [];
  }
}
```

사용할 함수들을 모두 등록할 수 있도록 registrations 배열을 만들어 초기화 했다.
그리고 함수를 등록하는 메소드 register를 만든다.

## Di.prototype.register()

```js
class DI {
  register(name, deps, func) {
    this.registrations[name] = {deps, func}
  }
}
```

함수 이름을 registrations 배열의 키(key)로 하여 객체를 할당했다.
이 객체는 두 개의 키를 가지고 있는데 (1) 의존성 목록을 저장하는 deps 배열과 (2) 함수 본체인 func이다.
좀더 엄밀히 말하면 함수 본체를 반환하는 함수다.
이를 [성크(thunk)](https://en.wikipedia.org/wiki/Thunk)라고 부른다.
성크를 사용한 이유는 등록한 함수를 불러올 때 함수 본문과 여기에 의존 객체를 매개변수로 넘겨줘야하기 때문이다.
성크를 사용하지 않으면 등록한 함수 본문을 불러올 때 의존객체를 매개변수로 넘겨줄 방법이 없다.
나중에 구현할 DI.get 메소드를 보면 이해하게 될 것이다.

여기까지 구현하면 아래와 같은 의존성 주입을 이용한 함수 정의가 가능하다.

```js
const di = new Di();

di.register('dep1', [], function() {
  return function() {
    /* dep1 함수 본문 */
    return 1;
  };
});

di.register('dep2', [], function() {
  return function() {
    /* dep2 함수 본문 */
    return 2;
  };
});

di.register('main', ['dep1', 'dep2'], function(dep1, dep2) {
  return function() {
    /* main 함수 본문 */
    return dep1() + dep2();
  }
});
```

dep1, dep2는 의존성이 없고 main은 이미 등록한 dep1, dep2에 의존하는 함수다.

## Di.prototype.get()

그럼 등록한 main 함수는 어떻게 사용할 수 있을까?

```js
const main = di.get('main');
main();
```

di 객체로부터 등록한 main 함수를 가져오기 위한 get 메소드를 구현해 보자.

```js
class Di {
  get(name) {
    const registration = this.registrations[name];
    const deps = [];
    if (registration === undefined) { return undefined; }
  }
}
```

name은 등록 배열에서 가져올 함수 이름이다.
이미 등록된 함수를 저장하고 있는 registrations 배열에서 name 변수 값으로 들어온 객체를 찾는다.
이 경우 registrations['main']을 찾는 것이다.

그리고 main 함수의 의존성 목록을 저장할 deps를 빈 배열로 초기화한다.

만약 main 함수가 등록되지 않았을 경우 get 메소드는 undefined 값을 반환한다.

계속해서 main 함수의 의존성을 찾아보자.

```js
class DI {
  get(name) {
    /* 중략 */

    registration.deps.forEach(depName => {
      deps.push(this.get(depName))
    });
    return registration.func.apply(undefined, deps);
  }
}
```

main 함수를 찾게되면 registration 변수에는 아래와 같은 객체가 들어 있을 것이다.

```js
{
  deps: ['dep1', 'dep2'],
  func: function() { function(dep1, dep2) { /* main 함수 본문 */ } }
}
```

register 메소드를 확인하면 쉽게 알 수 있다.
main 함수의 의존성 목록인 deps 배열을 순회하면서 의존 객체를 찾아낼 수 있다.
get 메소드를 재귀로 호출하는 부분이 그렇다.
get('dep1'), get('dep2')를 호출하여 각각 dep1과 dep2의 의존성을 해결하고 객체를 반환할 것이다.

재귀 단계에 들어가 dep1, dep2를 불러오는 과정을 한번 더 살펴보자.
registration['dep1']에 저장된 값을 불러오는데 아래와 같은 객체로 되어 있다.

```js
{
  deps: [],
  func: function() { function() { return 1; }  }
}
```

main 함수와는 다르게 의존성 배열이 비어있기 때문에 의존성 객체를 찾는 forEach 구문은 건너뛴다.
그리고 아래 함수를 실행한다.

```js
return registration.func.apply(undefined, []);
  // function() { return 1; }
```

그럼 다시 get('main') 으로 돌아와서 ...
아직 main의 의존성 객체를 찾는 forEach 반복문에 있다는 것을 기억하자.
main 함수의 의존성 객체를 담는 deps 배열에 get('dep1')의 결과인 function() {return 1;} 함수 본체를 추가한다.
마찬가지로 get('dept2')의 결과도 deps 배열에 추가되어 결국 dept 배열은 아래 값으로 채워진다.

```js
[
  function() { return 1; },
  function() { return 2; }
]
```

마지막으로 아래 코드가 실행되는데

```js
return registration.func.apply(undefined, deps);
```

registration.func에는 main 함수의 본체를 담은 성크가 있고 apply 함수로 deps를 매개변수로 넘겨준다.
main 함수 본체에서는 의존성 객체 목록을 매개변수로 받아서 사용할 수 있는 것이다.

```js
function(dep1, dep2) {
  return function() {
    return dep1() + dep2();
  }
}
```

main을 사용하는 측에서는 function() { return dep1() + dep2(); } 코드를 사용하게 되지만
dep1, dep2는 클로져 변수로 남아있기 때문에 함수 본문에서 사용할 수 있다.

register로 함수를 등록할 때 왜 성크로 등록했는지 이제 이해할 수 있다.

아래는 DI 클래스의 전체 코드다.

```js
class DI {
  constructor() {
    this.registrations = [];
  }
  register(name, deps, func) {
    this.registrations[name] = {deps, func}
  }
  get(name) {
    const registration = this.registrations[name];
    const deps = [];

    if (registration === undefined) { return undefined; }

    registration.deps.forEach(depName => {
      deps.push(this.get(depName))
    });

    return registration.func.apply(undefined, deps);
  }
}
```

## DI는 객체간의 결합도를 줄여준다

DI는 정말로 객체간의 의존도를 줄일까?
DI 없이 main 함수를 구현해보자. (dep1과 dep2 타입을 좀 변경했다)

```js
function main() {
  const dep1 = new Dep1();
  const dep2 = new Dep2();
  return dep1.get() + dep2.calculate();
}
```

main 함수의 역할은 dep1과 dep2의 각 메소드 결과를 합치는 것이다.
하지만 그 전에 main이 직접 dep1, dep2 객체를 생성하는 부분이 있다.
main 함수는 dep1, dep2 객체를 소비하기만 하면 되는데 생성하는 역할도 수행하고 있어서 객체간의 의존성이 비교적 크다.

만약 객체 생성을 main 함수가 아닌 다른 누군가가 한다면?
그리고 그 객체를 main 함수의 파라매터로 넣어준다면?
그렇다면 main 함수는 dep1, dep2 객체를 소비하기만 하면된다.

```js
function main(dep1, dep2) {
  return dep1.get() + dep2.calculate();
}
```

dep1, dep2를 생성하고 main 함수에 주입해 주는 역할이 바로 우리가 만든 DI.get 메소드의 역할이다.


## DI는 테스트를 명확하게 한다

main 함수를 테스트하려면 어떻게 할까?
의존성 주입이 없다면 main 함수 본연의 기능 테스트만으로는 부족하다.
dep1, dep2의 소비 방법 뿐만아니라 생성하는 코드도 테스트해야 한다.
그렇게 작성한 테스트는 main 함수의 기능을 설명할 수 없는 애매한 코드가 된다.

한편 DI를 사용한 main 함수는 명확한 테스트 코드를 작성할 수 있다.
테스트 코드에서 main 함수 파라매터로 dep1, dep2 객체를 생성해서 넣어주기만 하면된다.
main 함수에서는 이 객체들을 소비하는 로직만 테스트하면 그만이다.

실제 dep1, dep2 객체를 넣지 않아도 된다.
main 함수에서 사용할 객체의 메소드만 정의한 [덕 타이핑](https://ko.wikipedia.org/wiki/%EB%8D%95_%ED%83%80%EC%9D%B4%ED%95%91) 객체를 넣을 수도 있다.

아래는  main 함수가 dep1, dep2를 소비하는 테스트 코드다.

```js
describe('main은', () => {
  it('dep1.get과 dep2.calculate를 호출한다', ()=> {
    // 스파이 함수를 만든다.
    const spy1 = createSpy();
    const spy2 = createSpy();

    // 생성한 스파이 함수를 의존 객체의 get, calculate 메소드로 바인딩한다.
    const dep1 = {get: spy1};
    const dep2 = {calculate: spy2};

    // 테스트 대상을 실행한다.
    main(dep1, dep2);

    // 의존 객체 사용 결과를 검증한다.
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  })
})
```

dep1, dep2의 구현을 정확히 모르더라도 main에서 사용할 get, calcaulate 함수에 스파이를 심었다.
그 후 main 함수가 호출되었을 때 스파이 함수가 호출되었음을 확인하면 main와 dep1, dep2의 관계를 테스트한 셈이다.
