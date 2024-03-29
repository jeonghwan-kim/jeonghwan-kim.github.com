---
title: 에러 처리를 위한 익스프레스 가이드
layout: post
category: 개발
slug: /node/2017/08/17/express-error-handling.html
date: 2017-08-17
tags: [expressjs, 번역]
videoId: "video-inflean-nodejs"
---

> 원문: http://thecodebarbarian.com/80-20-guide-to-express-error-handling.html

[익스프레스의 에러 처리 미들웨어](http://expressjs.com/en/guide/error-handling.html)는 HTTP 응답 로직을 견고하게 만드는 파워풀한 도구입니다. 아래는 익스프레스 코드로 작성한 코드입니다.

```js
app.get("/User", async function (req, res) {
  let users
  try {
    users = await db.collection("User").find().toArray()
  } catch (error) {
    res.status(500).json({ error: error.toString() })
  }
  res.json({ users })
})
```

한 두 개 엔드포인트라면 이런 패턴이 잘 동작할테지만 여러 개를 유지해야한다면 금새 혼란스러워 질 것입니다. HTTP 응답코드중 500번 보다 503이 더 적합하다고 해보죠. 그럼 여러분은 모든 엔드포인드를 수정해야 합니다. 여러분의 개발환경에서 에러응답에 스택 트레이스를 추가해야 한다면요? 진심으로 모든 HTTP와 데이터베이스 요청 코드 주위에 `try/catch`를 추가하기 원하시나요? 물론 "책임있고" "잘 훈련된" 일이지만, 실제 프로그래밍에서는 확장하기 어려운 코드입니다. 익스프레스의 오류 처리 미들웨어와 함께 더 좋은 코드를 만들어 보겠습니다.

## 에러 처리 미들웨어 정의하기

익스프레스 미들웨어는 인자의 갯수에 따라 여러가지 유형이 있습니다. 4개의 인자를 취하는 미들웨어를 "오류 처리 미들웨어"라고 부르는데 오류 발생시에만 호출됩니다.

```js
const app = require("express")()

app.get("*", function (req, res, next) {
  // 이 미들웨어가 에러를 던지면 익스프레스는 곧바로 다음 오류 처리기로 이동합니다
  throw new Error("woops")
})

app.get("*", function (req, res, next) {
  // 이 미들웨어는 오휴 처리기가 아닙니다 (3개 인자만 취함)
  // 이전 미들웨어에서 에러가 발생했기 때문에 익스프레스는 이 미들웨어를 스킵할 것입니다.
  console.log("this will not print")
})

app.use(function (error, req, res, next) {
  // 이 서버로 들어온 모든 요청은 여기에 올 것이고
  // 에러 메세지 'woops'와 함께 HTTP 응답을 보낼 것입니다
  res.json({ message: error.message })
})

app.listen(3000)
```

미들웨어에서는 익스프레스로 에러를 알리는 가지 방법이 있습니다. 하나는 위에서 보았듯이 동일 틱(tick)에서 예외를 던지는 것입니다. 자바스크립트의 비동기 본성 때문에 이것은 그렇게 쓸모 있지 못합니다. 에러를 비동기로 던질 경우 서버는 망가지게 될 것입니다.

```js
const app = require("express")()

app.get("*", function (req, res, next) {
  // 모든 HTTP 요청에 서버를 망가뜨릴 것입니다
  setImmediate(() => {
    throw new Error("woops")
  })
})

app.use(function (error, req, res, next) {
  // 익스프레스는 위 에러를 잡지 못하기 때문에 여기에 도달하지 못합니다
  res.json({ message: error.message })
})

app.listen(3000)
```

에러 처리를 사용하기 위헤 익스프레스로 에러를 알리는 유일한 방법은 일반적인 미들웨어로 세번째 인자 `next()`를 사용하는 것입니다. 평범한 라우트 처리기 (`app.get('/User', function(req, res) {})` 같은)는 `next()` 함수를 인자로 취할 수 있습니다.

```js
const app = require("express")()

app.get("*", function (req, res, next) {
  // 비동기 오류를 보고하려면 반드시 next()를 통과해야 합니다
  setImmediate(() => {
    next(new Error("woops"))
  })
})

app.use(function (error, req, res, next) {
  // 여기에 도달할 것입니다
  res.json({ message: error.message })
})

app.listen(3000)
```

익스프레스는 **순서대로** 실행된다는 것을 기억하세요. 오류 처리기를 다른 모든 미들웨어의 뒤에 정의해야 합니다. 그렇지 않으면 오류 처리기는 호출되지 않을 것입니다.

```js
const app = require("express")()

app.use(function (error, req, res, next) {
  // 호출되지 않을 것입니다.
  // 에러 본문의 error.toString()를 반환하는
  // 익스프레스 기본 오류 처리기를 사용할 것입니다.
  console.log("will not print")
  res.json({ message: error.message })
})

app.get("*", function (req, res, next) {
  setImmediate(() => {
    next(new Error("woops"))
  })
})

app.listen(3000)
```

## Async/Await 사용하기

프라미스(promise)와의 귀찮은 통합은 익스프레스 API에서 균열이 나타나기 시작했습니다. 익스프레스는 ES6가 나오기 전인 2011-2014년에 거의 작성되었고 [async/await keyword](http://thecodebarbarian.com/80-20-guide-to-async-await-in-node.js)를 다루는 방법에 대한 좋은 답변이 여전히 부족합니다. 예를 들어, 아래 서버는 절대 HTTP 응답을 성공적으로 보내지 못할 것입니다. [프라미스 리젝션이 절대 처리되지 않을 것이기 때문](http://thecodebarbarian.com/unhandled-promise-rejections-in-node.js)이죠.

```js
const app = require("express")()

app.get("*", function (req, res) {
  // 비동기 오류는 next() 를 통해 보고 해야 합니다
  return new Promise((resolve, reject) => {
    setImmediate(() => reject(new Error("woops")))
  })
})

app.use(function (error, req, res, next) {
  // 호출되지 않을 것입니다.
  // 에러 본문의 error.toString()를 반환하는
  // 익스프레스 기본 오류 처리기를 사용할 것입니다.
  console.log("will not print")
  res.json({ message: error.message })
})

app.listen(3000)
```

하지만, 작은 헬퍼 함수로 익스프레스 오류 처리 미들웨어에서 async/await을 사용할 수 있습니다. `async` 함수는 프라미스를 반환한다는 것을 기억하세요 그리고 모든 에러는 `.catch()`로 잡고 `next()` 로 전달하세요.

```js
function wrapAsync(fn) {
  return function (req, res, next) {
    // 모든 오류를 .catch() 처리하고 체인의 next() 미들웨어에 전달하세요
    // (이 경우에는 오류 처리기)
    fn(req, res, next).catch(next)
  }
}
```

모든 비동기 미들웨어 함수에서 `wrapAsync()` 를 호출하면 모든 비동기 예외가 익스프레스 오류 처리기에서 종료됩니다.

```js
const app = require("express")()

app.get(
  "*",
  wrapAsync(async function (req, res) {
    await new Promise(resolve => setTimeout(() => resolve(), 50))
    // 비동기 에러
    throw new Error("woops")
  })
)

app.use(function (error, req, res, next) {
  // wrapAsync() 때문에 호출될 것입니다
  res.json({ message: error.message })
})

app.listen(3000)

function wrapAsync(fn) {
  return function (req, res, next) {
    // 모든 오류를 .catch() 처리하고 체인의 next() 미들웨어에 전달하세요
    // (이 경우에는 오류 처리기)
    fn(req, res, next).catch(next)
  }
}
```

이것이 오류 처리 미들웨어의 진짜 힘입니다. ([Golang](https://blog.golang.org/error-handling-and-go) 같은) 다른 언어에서는 모든 I/O 작업에서 반드시 오류를 체크 해야하고 수동으로 버블링해야 합니다. 이런 지루한 연습은 프로그래밍 소양을 기르는 습관이라고 확신하지만, 실제로는 코드를 복잡하고 리펙토링하기 어렵게 합니다.

`wrapAsync()`를 이용하면 오류 처리 미들웨어에서 모든 비동기 오류를 처리할 수 있습니다. "모든 검증오류는 HTTP 400을 응답한다", "모든 데이터베이스 오류는 HTTP 503을 응답한다" 라는 규칙을 정의할 수 있게 되었습니다.

```js
const { AssertionError } = require("assert")
const { MongoError } = require("mongodb")

app.use(function handleAssertionError(error, req, res, next) {
  if (error instanceof AssertionError) {
    res.status(400).json({
      type: "AssertionError",
      message: error.message,
    })
  }
  next(error)
})

app.use(function handleDatabaseError(error, req, res, next) {
  if (error instanceof MongoError) {
    res.status(503).json({
      type: "MongoError",
      message: error.message,
    })
  }
  next(error)
})
```

개별 라우트에서 일회용으로 오류 처리를 정의하는 대신 거대한 `handleError()` 함수에서 구별된 처리기를 정의해서 특정 오류를 담당하도록 할 수 있습니다. API가 데이터베이스에 연결할수 없을 때, 유저 요청이 스키마에 맞지 않을 경우, 외부 API가 실패할 때 발생하는 것에 대한 오류 처리를 정의할 수 있습니다.

## 계속하기

익스프레스 오류 처리 미들웨어는 최대한 관심사를 분리(separation of concerns)하는 방법으로 오류를 다룰수 있도록 합니다. `try/catch`를 사용하지 않고 `async/awat`을 사용하면 비지니스 로직에서 오류를 처리하지 않아도 됩니다. 이런 오류는 오류 처리기로 버블링되어 요청에 어떤 응답을 줄지 결정할 수 있습니다. 다음 익스프레스 어플리케이션에서 이런 파워풀한 기능의 장점을 사용해 보세요.

_만약에 노드 6을 사용하지만 async/awati을 사용해야 한다면 [co, The 80/20 Guide to ES2015 Generators](http://es2015generators.com/)를 읽어보세요 (유사글: [제너레이터와 프라미스를 이용한 비동기 처리](/2016/12/15/coroutine.html)) Co/yield는 노드 버전 4 이상에서 플래그 없이 async/await을 대체할 수 있습니다. async/await과 co/yield 두 패러다임은 일부 고급 사용법을 제외하고는 대체 가능합니다._
