---
title: 'Prmise.resove()에서 에러 객체를 넘겨줘야하는 이유'
layout: post
tags: [promise, error, javascript]
summary: '...'
---

노드에서는 비동기 코드를 작성할 때가 많다.
그래서 콜백헬, 프라미스 등이 나온다.

프라미스 관련 라이브러리도 상당히 많은데 Q와 bluebird를 가장 많이 사용한다.
그동안 Q를 사용하다가 bluebird를 사용해봤다.

중간에 이러한 워닝이 발생할 때가 있다.

> Warning: a promise was rejected with a non-error

난 왜 reject에 Error 객체를 넘기지 않았을까?

1.

예전에 어디선가 에러를 던질때 Error 객체를 사용하는것 보다 Object를 사용하는 것이 낫나도 들었다.

```javascript
try {
	throw { error: "Ooops!" };
} catch (e) {
	console.log(e); //  { error: 'Ooops!' }
}
```
이유는 생각나지 않는다.
그 후로는 그냥 무심코 이런 코드를 작성했다.
생각해보면 에러가 발생했을 때 스택을 확인할 수 없으니 디버깅할 정보가 부족할 것 같았다.
그동안 뭘했단 말인가?


2.

Promise는 try-catch 로직과 똑같이 동작한다.
그래서 promise 처리중 throw가 발생해도 종료되지 않고 Rejected 상태로 변한다.

```javascript
	Promise(function (resolve, reject) {
		reject({ error: "Ooops!" });
	}).then(function (result) {

	}).catch(function (err) {

	})
}









[문서](https://github.com/petkaantonov/bluebird/blob/master/docs/docs/warning-explanations.md#warning-a-promise-was-rejected-with-a-non-error)에 의하면 ...




