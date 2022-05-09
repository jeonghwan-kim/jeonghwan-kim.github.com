---
slug: "/dev/2020/05/25/supertest.html"
date: 2020-05-25
title: "Node.js로 만든 API 테스트(supertest)"
layout: post
category: dev
tags: [nodejs, test]
---

토이프로젝트를 하면서 테스트 코드를 어떻게 작성할까 고민이다.
보통은 1) 함수나 클래스 단위의 유닛 테스트나 2)기능 단위의 통합 테스트를 한다.
이번에는 유닛 테스트 보다는 통합 테스트를 먼저 시작했다.
학습 목표에 따라 여러가지 대체 기술을 사용하려면 탄탄한 통합테스트가 준비되어 있어야하기 때문이다.

화면을 검증하는 방법에는 마땅히 좋은 아이디어가 떠오르지 않는다.
대신 브라우져에서 서버로 호출하는 **API에 대한 통합 테스트**는 바로 시작할 수 있었다.
요청에 대한 응답이 제대로 나오는지, 그리고 데이터베이스에 예상하는 데이터가 남아있는지 검증하는 방식으로 진행했다.

API 서버를 만들때 HTTP 검증 도구로 슈퍼테스트([supertest](https://github.com/visionmedia/supertest))를 사용하는데 기본 개념과 간단한 활용 방법에 대해 간단히 정리해 본다.

# 슈퍼 테스트(supertest)

HTTP 라이브러리는 각 프레임웍이 제공하는 기본 모듈을 사용해서 구현할 수 있다.
노드js의 http, 브라우져의 XMLHttpRequest 클래스가 그것이다.

이걸 직접 사용하기 보다는 한꺼풀 추상화한 라이브러리를 활용하는 편이다.

- 노드로 백엔드 개발을 할때는 request 모듈을
- 브라우져에서는 제이쿼리나 앵귤러가 자체적으로 제공하는 \$http 서비스를
- 최근 vue.js나 react.js를 사용하면서부터는 axios, superagent를

사용한다.

슈퍼 테스트는 바로 이 슈퍼 에이전트(superagent)를 기반으로한 HTTP 검증 라이브러리다.

> HTTP assertions made easy via superagent.

# 시작하기: request()

슈퍼 테스트의 인터페이스는 노드의 http.Server 객체나 함수를 인자로 받는 형태이다.
인자로 받은 서버 객체가 요청 대기 상태가 아니라면 슈퍼 테스트는 임시로 포트를 열어 서버를 요청 대기 상태로 전환해 준다.

```js
module.exports = function(app) {
  if (typeof app === 'function') {
    app = http.createServer(app);
  }
```

예제코드에 보면 단순히 익스프레스 객체만 전달하는데 바로 이러한 동작이 있기 때문이다.

```js
const request = require("supertest") // 1번
const express = require("express")

const app = express()
app.get("/user", (req, res) => res.json({ name: "alice" }))

request(app) // 2번
  .get("/user") // 3번
  .expect(200, { name: "alice" }) // 4번
```

1번. 슈퍼 테스트 모듈을 가져와서 request 변수에 담았다.
슈퍼에이전트 라이브러리의 영향을 받은 모양이다.

익스프레스에 GET /users 라우팅만 추가하고 HTTP 검증 로직을 작성했다.

2번. 서버 어플리케이션을 구동한다.

3번. get() 함수로 HTTP 요청을 만든다.
물론 메소드에 따라 post(), put(), delete() 함수를 사용할 수 있다.
헤더를 보내려면 set() 함수를 사용한다.
요청 본문을 보내려면 send() 함수를 사용한다.

4번. 마지막 expect() 함수로 응답을 검증하는데, 여기서는 상태 코드와 JSON 형식의 본문을 테스트했다.
expect() 함수는 다양한 인터페이스가 있어서 상황에 맞게 활용할 수 있는데 [expect(statusCode, body)](https://github.com/visionmedia/supertest#expectstatus-body-fn) 형태가 사용하기 편했다.

# 성공과 에러 검증: expect()

좋은 API의 특징중 하나가 "**일관성**"이라고 생각한다.
성공과 에러 응답에 대한 형식이 정의되어 있고, 언제나 이 형식에 맞게 응답하는 API가 클라이언트 입장에서 믿고 사용할 수 있기 때문이다.
그런 점에서 API 개발시 성공과 에러 형식을 함께 검증한다면 더욱 좋겠다.

슈퍼 테스트에서 응답을 검증하는 expect()의 인터페이스 중 콜백 함수를 받는 함수가 있다.

[expect(function(res){})](https://github.com/visionmedia/supertest#expectfunctionres-)

이 콜백 함수의 인자 res를 통해서 테스트한 API 응답 데이터를 엿볼 수 있는데 이런 방식으로 사용한다.

```js
expect(res => {
  console.log(res.status) // 200
  console.log(res.body) // { name: "alice" }
})
```

이걸 이용해 성공과 실패를 응답을 테스트할 수 있는 유틸리티 함수를 만들어 두면 응답 포맷의 일관성을 함께 검증할 수 있을 것 같다.

## 오류 테스트

```js
{
  error: {
    message: String
  }
}
```

위와 같이 API 오류가 문자열 메세지를 가진 본문 형태라고 가정하고 이를 검증하는 헬퍼 함수를 만들어 보자.

```js
function hasError(status, message) {
  // 1번
  return res => {
    // 2번
    assert.equal(res.status, status) // 3번

    assert.euqal(res.body.hasOwnProperty("error"), true) // 4번
    assert.euqal(res.body.error.hasOwnProperty("message"), true)

    assert.equal(res.body.error.message, message) // 5번
  }
}
```

1번. hasError()는 에러 응답인지 검증하는 함수다.
기대하는 http 상태코드와 오류 메세지를 인자로 받는다.

2번. 곧장 함수를 반환하는데 expect() 함수의 인자로 넣을 값이다.

3번. 응답으로 받은 상태 코드 값인 res.status와 기대하는 상태 코드 값 status를 비교한다.

4번. 응답 본문에 error와 message 키가 있는지 각각 확인한다.

5번. message에 기대한 문자열이 있는지 검증한다.

## 성공 테스트

이러한 에러 검증 방식은 성공 함수에서도 동일하게 적용할 수 있다.

```js
{
  data: Object
}
```

위와 같은 API 성공시 오브젝트 형식의 data를 키로 갖는다고 가정하고 이를 검증하는 헬퍼 함수를 만들어 보자.

```js
function hasData(status, callback) {
  // 1번
  return res => {
    // 2번
    assert.equal(res.status, status) // 3번

    if (!body.hasOwnProperty("data")) throw new Error("missing data key") // 4번

    callback(res.body.data) // 5번
  }
}
```

1번. hasData()는 성공 응답인지 검증하는 함수다.
기대하는 http 상태코드와 응답 데이터를 넘겨 받을 콜백함수를 인자로 받는다.

2번. 곧장 함수를 반환하는데 expect() 함수의 인자로 넣을 값이다.

3번. 응답으로 받은 상태 코드 값인 res.status와 기대하는 상태 코드 값 status를 비교한다.

4번. 응답 본문에 data 키가 있는지 확인한다.

5번. data 키의 값을 콜백함수 인자로 전달한다.
이것은 hasData()를 호출하는 측에서 데이터 검증하려는 의도다.
단순히 문자열만 체크하는 hasError()와 달리, 성공 응답에는 다양한 형태의 데이터를 검증해야할 수 있기 때문이다.

사용할때는 이런식으로 사용할 수 있다.

```js
request(app)
  .get("/user")
  .expect(
    hasData(200, data => {
      // 이미 hasData()로 상태코드 200과 본문에 data 키가 있음을 검증했다.
      // 여기서는 데이터의 모습만 검증한다.
      assert.equal(data.hasOwnProperty("name"), true)
      assert.equal(data.name, "alice")
      // ...
    })
  )
```

# 요청을 지속시키는 방법: agent()

토이 프로젝트에서는 세션과 쿠키를 이용한 인증 방식을 사용하고 있다.
로그인을 통해 인증되면 서버에서는 세션 아이디를 만들고 이것를 요청한 브라우져 쿠키에 저장한다.
그리고 이후 브라우저에서 서버로 보내는 모든 요청에서는 쿠키 값을 같이 전송하는 구조다.

따라서 어떤 API는 테스트하기 전에 인증을 선행해야만 한다.
테스트 코드에서 인증을 완료한 뒤 다음 요청을 보내면 인증이 안되어있는 현상이 발생하는데(가령 서버에서 401 UnAuthrized를 응답하는 경우)
**브라우저의 기본 동작을 잘 모르고 있었던 탓**이다.

브라우져는 요청한 응답 헤더에 set-cookie가 있으면 쿠키에 값을 저장하고 있다가 다음 요청부터는 이 값을 전달한다.
반면 curl이나 슈퍼테스트의 request() 로 요청할때는 매번 모든 요청이 새롭게 생성된다.
서버에서 전달한 쿠키값을 사용자가 직접 다음 요청에 전달하지 않은 이상 요청이 지속되지 않는다.
그래서 curl을 사용할 때 -H 옵션으로 헤더에 쿠키를 설정하거나, set() 함수로 쿠키값을 직접 전달해야 했다.

슈퍼테스트에는 브라우저가 쿠키 값을 기본으로 보내는 것처럼 비슷한 행동을 할 수 있는데 agent()라는 함수가 그것이다.
request()와 비슷하지만 **요청을 지속시킬수 있다는 것**이 차이점이다.
요청한 응답에 `set-cookie` 값이 있으면 다음 요청부터 이값을 헤더에 담아 전달한다([참고](https://github.com/visionmedia/superagent/blob/master/src/node/agent.js#L66)).
이것도 [superagaent를 사용](https://github.com/visionmedia/supertest/blob/master/lib/agent.js#L7)한다.

쿠키 기반의 인증을 사용하는 것처럼 하나의 요청을 지속시키기 위해서는 agent() 함수로 테스트 하자.

```js
aganet
  .post('/login')
  .send(credentials)
  .get('/user)
  .expect()
```
