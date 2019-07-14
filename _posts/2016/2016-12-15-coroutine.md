---
title: 제너레이터와 프라미스를 이용한 비동기 처리
layout: post
category: dev
tags:
  javascript
summary: 콜백, 프라미스, 코루틴을 이용해 비동기 처리하는 방법을 비교한 글입니다 
permalink: /2016/12/15/coroutine.html
---

자바스크립트 개발에 있어 프론트엔드도 마찬가지겠지만 백엔드에도 비동기 로직이 많다. 어쩌면 대부분 비동기 작업일 수 있다. 디비를 읽고, 파일을 읽는 행위 자체가 서버의 기능인데 모두 논블락(non-block) 비동기로 처리되니깐 말이다. 이를 구현하는 방법 중 가장 기본적인 것이 콜백(callback) 스타일 코딩 기법이고, 이를 개선한 프라미스(Promise)의 사용 그리고 제너레이터(Generator)와 연동한 코루틴(coroutine)등의 방법을 소개하고자 한다.

## 콜백  

아래 콜백 스타일의 비동기 코드부터 시작해 보자.

```javascript
const getId = cb => {
  setTimeout(() => cb(1), 1)
};
const getNameById = (id, cb) => {
  setTimeout(() => cb('chris'), 1)
};

getId(id => {
  getNameById(id, (name => {
    console.log({id, name})
  }));
});
```

* getId() 비동기 함수를 실행하면 사용자 id를 얻을 수 있다.
* getNamebyId() 비동기 함수에 사용자 id를 파라매터로 넘겨주면 사용자 이름를 얻을 수 있다.
* 마지막에 id와 name을 출력하면 {id: 1, name: ‘chris’} 객체를 확인할 수 있다.

비동기 로직이 추가될 때마다 콜백 함수를 계속해서 추가하는 구조이다.

## 프라미스

이번엔 프라미스를 사용해 보자. getId()와 getNameById() 가 프라미스를 반환하도록 변경했다. 이를 사용하는 메인함수에서는 then() 함수로 비동기 호출 결과를 받는다.

```javascript
const getId = () => new Promise(resolve => {
  setTimeout(() => resolve(1), 1);
});
const getNameById = id => new Promise(resolve => {
  setTimeout(() => resolve('chris'), 1);
});

getId().then(id => {
  getNameById(id).then(name => {
    console.log({id, name})
  });
});
```

표면적인 코드의 모습만 봐서는 콜백스타일의 콜백헬을 여전히 해결하지 못한다. 하지만 코드 실행의 주도권을 가지고 있다는 것이 프라미스의 장점이고 그것이 then() 함수가 하는 역할이다. 이 부분은 글의 방향과는 맞지 않기 때문에 별도의 글에서 다루도록 하겠다.

프라미스에 then 체인을 걸어주면 좀 더 우아한 코드를 작성할 수 있다.

```javascript
let id;
Promise.resolve()
    .then(() => getId())
    .then(_id => (id = _id, getNameById(id)))
    .then(name => console.log({id, name}));
```

콜백 스타일의 n단계 들여쓰기의 코드가 한 단계로 평탄화 되어서 가독성이 좋아졌다. 하지만 상단의 let id 코드가 눈에 거슬린다. 마지막 then 함수에서 id를 사용할 것이기 때문에 이러한 then 체인 구조에서는 임시로 저장할 id 변수를 사용하는 것이 불가피했다.

그래서 아예 하나의 객체를 만들어 각 함수의 파라매터로 전해주기도 한다. 즉 메인 데이터(객체)를 만들고 이것을 각 함수들에게 통과시킴으로서 최종 데이터를 얻는 것이다. 마치 유체물질이 파이프라인을 통과하는 구조라고 생각할 수 있겠다.

```javascript
Promise.resolve({})
    .then(obj => getId(obj))
    .then(obj => getNameById(obj))
    .then(obj => console.log(obj));
```

이것이 가능하려면 추가적인 작업이 필요하다. getId()는 {id: 1} 이라는 객체 형식을 반환하는 코드를 추가하고  getNameById()는 파라매터 객체의 obj.id를 읽은 후 {id: 1, naem: ‘chris’} 객체를 반환하는 코드를 추가해야한다.

각 함수들이 객체를 받고, 수정하고 그 객체를 반환하는 구조를 만들게 되면 훨씬 간단한 코드를 만들 수 있다.

```javascript
Promise.resolve({})
    .then(getId)
    .then(getNameById)
    .then(obj => console.log(obj));
```

getId()와 getNameById()의 인터페이스(파라매터, 반환값)을 동일하게 유지했기 때문에 가능한 일이다. 하지만 여기에 getAccountByIdAndName(id, name) 함수를 then 체인에 추가한다면 이러한 단순함을 유지하는 것은 어렵게 된다. 이것이 그동안 프라미스를 이용한 비동기 로직 처리에 있어서 상당한 고민거리였다.

## 제너레이터

제너레이터를 사용하면 뭔가 해결책이 있을 것 같다. 현재 실행중인 함수에서 제너레이터의 next()를 호출하면 제너레이터로 제어권을 넘기고 제너레이터는 본인의 역할을 수행하다가 yield를 실행하면 다시 제어권을 넘겨준 함수로 제어권을 양보하는 구조가 제너레이터의 동작 방식이다.

```javascript
function* gen () {
  const id = yield getId();
  const name = yield getNameById(id);
  console.log({id, name});
}
const g = gen();
g.next();
```

하지만 g.next()를 호출한다고 해도 반환되는 것은 해결되지 않은 프라미스일 뿐이다. getId()가 프라미스를 반환하다는 것을 생각하면 쉽게 이해할 수 있다. 더이상 코드는 진행되지 않는다. 따라서 메인함수에서 프라미스를 해결하고 그 결과를 next()의 파라매터로 넘겨주면서 제어권을 다시 제너레이터로 넘겨주는 코드가 필요하다. 우선 수작업으로 이 코드를 작성해 보자.

```javascript
function* gen () {
  const id = yield getId();
  const name = yield getNameById(id);
  console.log({id, name});
}

const g = gen();
g.next().value.then(id => {
  g.next(id).value.then(name => {
    g.next(name);
  })
})
```

* 메인함수에서 g.next()를 호출하면 제어권이 제너레이터로 넘어간다.
* 제너레이터에서 getId()가 실행되고 프라미스를 반환된다. 그리고 yield 키워드는 {value: Promise, done: false} 객체를 제너레이터 호출한 측, 즉 메인함수로 반환한다.
* 반환된 객체의 value에 있는 프라미스를 해결하기 위해 value.then() 함수를 실행하고 id 값을 얻는다. 그 뒤 g.next(id) 함수를 이용해 다시 제너레이터로 id 값과 제어권을 넘긴다.
* 제너레이터는 메인함수로부터 전달받은 id 값을 id 상수에 저장하고 다음 getNameById(id) 함수를 실행한다. 역시 이는  프라미스를 반환하고 yield 키워드는 {value: Promsie, done: false} 객체를 메인함수로 반환한다.
* 메인함수는 전달받은 프라미스를 해결하고 name 값을 얻는다. 마지막으로 한번 더 제너레이터로 name 값과 제어권을 넘긴다.
* 제너레이터는 받은 name 값을 name 상수에 저장한 뒤 id, name을 출력한다.

제너레이터와 메인함수가 제어권을 서로 주거니 받거니 하는 모습이 그려지는가? 주목할 것은 메인함수에서 프라미스를 해결하고 그 결과값을 다시 제너레이터로 제어권과 함께 넘겨준다는 것이다. 각 함수의 호출 순서를 보면 아래와 같다.

```
next(main) → promise(gen) → yield(gen) → then(main) →  // id 획득
next(main) → promise(gen) → yield(gen) → then(main) → // name 획득
console.log(gen)
```

메인과 sub루틴 사이에서 제어권을 핑퐁하듯이 주고 받고 있는 모습이다. 이것을 코루틴(coroutine)이라고 부른다. [코루틴](https://en.wikipedia.org/wiki/Coroutine)이란 여러개의 함수를 반환값 없이 중단 및 실행 시킬수 있는 제어구조를 말한다. 딱 이 모습이다.

## 코루틴

수동으로 코루틴을 실행하도록 만들었는데 이것을 자동으로 실행시키는 co()라는 함수를 만들어 보자.

```javascript
const co = gen => new Promise(resolve => {
  const g = gen();
  const onFulfilled = res => {
    const ret = g.next(res);
    next(ret);
  }
  const next = ret => {
    if (ret.done) return resolve(ret.value);
    return ret.value.then(onFulfilled)
  }
  onFulfilled();
});

co(gen).then(user => console.log(user));
```

co는 제너레이터를 인자로 받고 프라미스를 반환한다. co를 사용하는 쪽에서는 프라미스를 반환받게 될 것이므로 then()을 이용해 결과값을 얻을 수 있다.

co() 함수를 자세히 들여다 보자.

* 제너레이터를 생성하여 g에 할당한다.
* onFufilled() 함수를 실행한다. 이것은 제너레이터의 next() 함수를 호출하면서 제너레이터로 제어권과 값을 넘기도록하는 함수다.
* 제너레이터에서는 프라미스를 반환할 것이다({value: Promise, done: false}). getId(), getNameById()가 프라미스를 반환하기 때문이다.
* 제너레이터에서 받은 결과({value: Promise, done: false})는 co함수의 내부함수인 next() 함수의 인자로 넘어간다.
* 내부함수 next()는 제너러이터가 반환한 결과를 확인하는데 제너레이터가 종료되었을 경우(done=true) 마지막 값(value)을 resolve() 함수로 넘겨준다.
* 제너레이터가 잠시 멈춘 상태라면(done=false, yeild를 실행한 경우) value에 있는 프라미스를 해결하고 다시 제너레이터로 제어권을 넘겨주는데 그것이 바로 onFulfilled() 함수다.

이는 마치 상호 재귀의 모습과도 유사하다. co() 함수 내에서 onFulfilled()와 next() 함수가 서로 호출하고 있는 모습인데 next() 함수에서 제너레이터의 종료를 확인할때 co() 함수는 종료된다.

이처럼 프라미스를 yield하는 제너레이터를 사용하기 위해서는 제너레이터가 보내준 프라미스를 해결하고 이 값을 다시 제너레이터로 넘겨주는 반복작업을 수행해야 하는데 이러한 기능을 구현한 것이 [tj의 co](https://github.com/tj/co)와 [bluebird의 coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html)이다. 마지막으로 각각의 사용방법을 확인해 보는 것으로 마무리하겠다.

tj/co

```javascript
const co = require('co')

co(function* gen () {
  const id = yield getId();
  const name = yield getNameById(id);
  return {id, name};
}).then(user => console.log(user));
```


bluebird.coroutine

```javascript
const Promise = require('bluebird')

Promise.coroutine(function* gen () {
  const id = yield getId();
  const name = yield getNameById(id);
  return {id, name};
})().then(user => console.log(user));
```
