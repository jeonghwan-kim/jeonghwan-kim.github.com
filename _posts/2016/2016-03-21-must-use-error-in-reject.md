---
title: 'Promise.reject()에 에러 객체를 넘겨줘야하는 이유'
layout: post
category: dev
tags: [promise, error, javascript]
summary: '노드에서는 비동기 코드를 작성할 때가 많다. 그래서 콜백헬, 프라미스 키워드가 자주 등장한다. 콜백헬의 대안으로 프라미스를 사용한다는 글도 있지만 꼭 그런것도 아니다. 콜백헬과 프라미스는 그냥 별도의 개념들이다'
permalink: /2016/03/21/must-use-error-in-reject.html
---

노드에서는 비동기 코드를 작성할 때가 많다. 그래서 콜백헬, 프라미스 키워드가 자주 등장한다.
콜백헬의 대안으로 프라미스를 사용한다는 글도 있지만 꼭 그런것도 아니다.
콜백헬과 프라미스는 그냥 별도의 개념들이다.

프라미스는 비동기 코드를 작성할 때 사용하는 개념이다.
프라미스 관련 라이브러리도 상당히 많은데 [Q](https://github.com/kriskowal/q)와
[bluebird](http://bluebirdjs.com/docs/getting-started.html)대표적이다.
그동안 Q를 사용하다가 bluebird를 사용해봤다.

bluebird를 사용하면서 가끔 이러한 워닝이 발생할 때가 있다.

> Warning: a promise was rejected with a non-error

프라미스 내에서 reject() 할때 에러가 아닌것을 넘겼다는 것이다.
난 왜 reject에 Error 객체를 넘기지 않았을까?

## #1.

어디선가 에러를 던질때 Error 객체를 사용하는것 보다 Object를 사용하는 것이 낫다고 들었다.

```javascript
try {
  // 에러가 아닌 객체를 던졌다
  throw { error: "Ooops!" };
} catch (e) {
  console.log(e); //  { error: "Ooops!" }
}
```

이유는 생각나지 않는다. 그 글을 읽은 후로는 그냥 무심코 이런 코드를 작성했다.
생각해보면 에러가 발생했을 때 스택을 확인할 수 없으니 디버깅할 정보가 부족할 것 같았다.
그동안 뭘했단 말인가?


## #2.

Promise는 try-catch 로직과 똑같이 동작한다.
그래서 promise 처리중 throw가 발생해도 종료되지 않고 프로미스만 Rejected 상태로 변한다.

```javascript
Promise(function (resolve, reject) {
  reject({ error: "Ooops!" });
}).then(function (result) {

}).catch(function (err) {
  console.log(err); // { error: "Ooops!" }
});
```


throw 할때 에러가 아닌 객체를 던진 것처럼, reject 할때 에러가 아닌 객체를 던진 것이다.

워닝 메세지에 대한 [bluebird 문서](https://github.com/petkaantonov/bluebird/blob/master/docs/docs/warning-explanations.md#warning-a-promise-was-rejected-with-a-non-error)에는
다음과 같이 설명한다.

* 자바스크립는 에러를 던질때 어떤 값이라도 던질수 있다.
* Promise/A+는 이러한 관례를 수용하여 reject할때 에러뿐만 아니라 아무 값이라도 허용하도록 했다.
* 그러나 에러가 아닌 값을 reject할 경우 디버깅이 어려워 질 수 있다. (Error 객체의 stack 정보를 얻을 수 없다)

에러를 던질때나 reject 할때 반드시 에러 객체를 반환하자.
필요한 경우 Error를 상속하여 커스텀 에러 객체를 만들어 사용하자.
