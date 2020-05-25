---
title: "[supertest] Node.js로 만든 API 테스트"
layout: post
category: dev
tags: [nodejs, test]
---


토이프로젝트를 하면서 테스트 코드를 어떻게 작성할까 고민이다. 
보통은 1) 함수나 클래스 단위의 유닛 테스트를 하거나 2)기능 단위의 통합 테스트를 한다. 
이번건 유닛 테스트 보다는 통합 테스트를 먼저 해야겠다고 마음먹었다.
학습 목표에 따라 여러가지 대체 기술을 사용하려면 탄탄한 통합테스트가 있어야하기 때문이다.

화면을 검증하는 방법은 마땅히 좋은 아이디어가 떠오르지 않는다. 
대신 화면에서 호출하는 **API에 대한 통합 테스트**는 바로 시작할 수 있겠다.
요청에 대한 응답이 제대로 나오는지, 그리고 데이터베이스에 예상하는 데이터가 남아있는지 검증하는 방식으로 진행한다.

API 서버를 만들때 HTTP 검증 도구로 슈퍼테스트([supertest](https://github.com/visionmedia/supertest))를 사용하는데 기본 개념과 간단한 활용 방법에 대해 정리해보자.

# 슈퍼 테스트

HTTP 라이브러리는 각 프레임웍이 제공하는 기본 모듈을 사용해서 구현할수 있다. 
노드의 http 브라우져의 XMLHttpRequest 클래스가 그것이다. 

이걸 직접 사용하기 보다는 한꺼풀 추상화한 라이브러리를 활용하는 편이다.
- 한참 노드로 백엔드 개발을 할때는 request 모듈을 사용했다. 
- 브라우져에서는 제이쿼리나 앵귤러가 자체적으로 제공하는 $http 서비스를 사용했다.
- 최근 vue나 react를 사용한 뒤부터는 axios나 superagent를 사용한다.

슈퍼 테스트는 바로 http 라이브러리인 슈퍼 에이전트를 기반으로한 HTTP 검증 라이브러리다. 

> HTTP assertions made easy via superagent.

# 시작하기

슈퍼 테스트는 노드의 http.Server 객체나 함수를 인자로 받는 함수다.
인자로 받은 서버가 요청 대기 상태가 아니라면 슈퍼 테스트는 임시로 포트를 열어 서버를 요청 대기 상태로 전환해 준다.

```js
module.exports = function(app) {
  if (typeof app === 'function') {
    app = http.createServer(app);
  }
```

예제코드에 보면 단순히 익스프레스 객체만 전달하는데 바로 이 때문이다.

```js
const request = require('supertest'); // 1번
const express = require('express');

const app = express();
app.get('/user', (req, res) => res.json({name: 'alice'}));

request(app) // 2번
  .get('/user') // 3번
  .expect(200, { name: 'alice' }) // 4번
```

1번. 슈퍼 테스트 모듈을 가져와 request 변수에 담은 것은 슈퍼에이전트 라이브러리의 영향을 받은 모양이다. 

익스프레스에 GET '/users' 라우팅만 추가하고 HTTP 검증 로직을 작성했다.

2번. request() 함수로 서버 어플리케이션을 구동한다.

3번. get() 함수로 요청을 만들어 낸다.
물론 메소드에 따라 post(), put(), delete() 함수를 지원한다.
헤더를 보내야한다면 set() 함수를 사용한다.
요청 본문을 보내야 한다면 send() 함수를 사용한다.

4번. 마지막 exprect() 함수로 상태 코드와 본문을 검증하는 방식이다.
expect() 함수는 다양한 인터페이스가 있어서 상황에 맞게 활용할 수 있는데 [expect(statusCode, body)](https://github.com/visionmedia/supertest#expectstatus-body-fn) 형태가 사용하기 편했다.

# 성공과 에러 검증

좋은 API의 특징중 하나가 **"일관성"**이라고 생각한다.
성공과 에러 응답에 대한 형식이 정의되어 있고, 언제나 이 형식에 맞게 응답하는 API가 클라이언트 입장에서 믿고 사용할 수 있기 때문이다.
그런 점에서 API 개발시 성공과 에러 형식을 함께 검증한다면 좋겠다.

슈퍼 테스트에서 응답을 검증하는 expect()의 인터페이스 중 콜백 함수를 전달하는 형식이 있다.

[expect(function(res){})](https://github.com/visionmedia/supertest#expectfunctionres-)

이 콜백 함수의 인자 res를 통해서 테스트한 API 응답 데이터를 엿볼 수 있다.

```js
expect(res => {
  console.log(res.status) // 200
  console.log(res.body) // {id: …}
})
```

이걸 이용해 일관적으로 성공과 실패를 응답을 테스트할 수 있는 유틸리티 함수를 만들어보면 좋겠다.
API 오류 응답이 특정 상태코드와 `{error: {message: string}}` 형식이라고 했을 때 이를 검증하는 함수를 만들어 보자. 

```js
function hasError(status, message) { // 1번
  return (res) => { // 2번
    assert.equal(res.status, status); // 3번

    assert.euqal(res.body.hasOwnProperty('error'), true); // 4번
    assert.euqal(res.body.error.hasOwnProperty('message'), true);

    assert.equal(res.body.error.message, message); // 5번
  }
}
```

1번. hasError()는 에러 응답인지 검증하는 함수다. 
기대하는 http 상태코드와 오류 메세지를 인자로 받는다.

2번. 곧장 함수를 반환하는데 expect() 함수의 인자로 넣을 값이다.

3번. 응답으로 받은 상태 코드 값 res.status와 기대하는 상태 코드 값 status를 검증한다.

4번. 응답 본문에 error와 message 키가 있는지 확인한다.

5번. message에 기대한 문자열이 있는지 검증한다.


이러한 에러 검증 방식은 성공 함수에서도 동일하게 적용할 수 있다.

```js
function hasData(status, callback) {
  return (res) => {
    assert.equal(res.status, status); 

    if (!body.hasOwnProperty('data')) throw new Error("missing data key");
    callback(res.body.data);
  };
}
```

응답 본문에 data 키가 있는지 확인만 하고 응답 데이터를 콜백함수 인자로 넘겨주는데, 
hasData를 호출하는 측에서 데이터 검증을 하도록 한 것이다. 
문자열만 체크하는 오류 응답과는 달리 성공 응답에는 다양한 형태의 데이터를 검증해야하기 때문이다. 

```js
request(app) 
  .get('/user') 
  .expect(hasData(200, data => {
    // 데이터를 여기서 검증한다.
    assert.equal(data.hasOwnProperty('id'), true);
    assert.equal(data.id, 1)
    // ...
  })) 
```
```

# 요청을 지속시키는 방법 

토이프로젝트에서 세션 아이디를 브라우져 쿠키에 저장해서 사용하고 있다. 
그래서 어떤 API들은 인증이 필요한데 요청 헤더에 쿠키에 저장된 세션 아이디를 받도록 하고 있다. 


브라우저에서 로그인 한 뒤 이러한 인증이 필요한 API를 호출하면 예상하는대로 동작한다.
그렇지만 curl을 이용해서 호출하면 인증이 안된것처럼 동작한다.
원인은 쿠키 값이 없기 때문인데 인증후 얻은 쿠키값을 다음 요청시에서 세팅해 주어야하기 때문이다.
그래서 curl -H 옵션으로 쿠키를 전달하면 브라우져 처럼 동작하는 것이다.

슈퍼테스트도 기본적으로는 이런 헤더 값을 보내지 않는다.
사용자가 직접 set 함수로 쿠키를 설정해야지만 브라우져 처럼 동작한다.
이렇게 인증 후 얻은 쿠키 값을 저장하고 있다가 다음 요청시 헤더에 붙여서 보낼수 있다. 


(브라우저는 요청한 응답 헤더에 set-cookie가 있으면 브라우져 쿠키에 이값을 저장하고 다음 요청부터는 이 쿠키 값을 전달한다. 
request 함수는 매번 요청을 새로 만들기 때문에 이러한 값을 직접 세팅해 주어야 요청을 지속시킬 수 있다.)

하지만 이러한 용도의 agent()라는 함수를 제공한다 제공한다.
테스트 요청이 브라우져처럼 동작하도록 하는 함수인데 쿠키값을 스스로 세팅해서 전달한다.
(참고: [https://github.com/visionmedia/superagent/blob/master/src/node/agent.js#L66](https://github.com/visionmedia/superagent/blob/master/src/node/agent.js#L66))
이것도 [superagaent를 사용](https://github.com/visionmedia/supertest/blob/master/lib/agent.js#L7)한다.

쿠키를 포함해 하나의 요청을 지속시키기 위해서는 agent() 함수를 사용하자. 
