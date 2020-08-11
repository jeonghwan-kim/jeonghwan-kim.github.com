---
title: "[Node.js코드랩] 9.미들웨어 활용"
layout: post
summary: 미들웨어를 활용합니다
category: series
seriesId: "555b6438-4a71-51d0-9156-a1d5ca4d5eab"
tags: [lecture]
---

## 🌳목표

Middleware 모듈을 활용하여 serve-static의 문제를 해결합니다.
기존 코드도 미들웨어 형태로 개선합니다.

## Middleware로 Application.use() 메소드 구현

이전 시간까지 작성한 코드로 체크아웃 하겠습니다.

```
$ git checkout -f application/use-spec
```

어플리케이션에서 미들웨어 함수를 등록해야 하는데요 Application.use() 메소드가 그 역할을 하도록 하겠습니다. 이 메소드는 내부적으로 미들웨어의 add() 메소드를 호출하겠죠?

좀 더 자세히 보기 위해 테스트 파일을 살펴 보지요.

src/Application.spec.js 파일을 봅니다.

```js
describe("use()", () => {
  it("Middleware 모듈 인스턴스의 add() 메소드를 실행한다", () => {
    const spy = sinon.spy()
    app._middleware.add = spy
    const mw1 = () => null

    app.use(mw1)

    should(spy.called).be.equal(true)
  })
})
```

use() 메소드는 "Middleware의 add() 메소드를 실행한다"는 테스트 케이스 입니다.
어플리케이션 내부 변수인 \_middleware의 add에 스파이를 심었습니다.

그리고 app.use()를 실행한 결과 이 스파이 함수가 실행되는지 점검하는 것이죠.

src/Application.js 파일을 수정해 보겠습니다. 세 부분으로 나눠 진행합니다.

```js
const Middleware = require('./Middleware');

const Application = () => {
  const _middleware = Middleware();
```

Middleware 모듈을 가져옵니다. 그리고 Application 클로져 변수에 Middleware 인스턴스를 하나 만들었습니다. 이 코드는 어플리케이션이 구동되는 동안 딱 한 번만 실행 되겠죠?

```js
const _server = http.createServer((req, res) => {
  _middleware.run(req, res)
})

const use = fn => _middleware.add(fn)
```

함수타입 fn를 인자로 받는 use() 메소드 입니다. 클로져 변수 \_middleware의 add 함수를 실행해서 인자로 받은 함수를 미들웨어 배열에 추가합니다.

그리고 요청이 올때마다 \_middleware.run() 메소드를 실행해 모든 미들웨어 함수를 실행시킵니다.

```js
return {
  _milldeware, // 테스트용
  _server,
  use, // use 노출
  listen,
}
```

마지막으로 클로져 변수와 use 메소드를 노출해서 외부에서 사용하도록 처리합니다.

여기까지가 미들웨어를 사용하기 위한 준비 작업이었습니다.

![](/assets/imgs/2018/12/09/struct.png)

드디어 익스프레스JS의 두 번째 모듈(초록색)을 구현한 것이죠.

## 🐤실습 - serve-static 미들웨어로 변경

src/serve-static.js를 middlewares/serve-static.js 파일로 옮겨 미들웨어 함수 형태로 구현하세요.

방금까지 작성한 코드로 브랜치를 이동합니다.

```
$ git checkout -f application/use
```

_힌트: 미들웨어 함수 인터페이스는 (req, res, next) => { /_ ... _/}_

## 🐤풀이

그럼 함께 풀어 볼까요?

middlewares/serve-static.js 파일을 만들어 기존 코드를 옮깁니다.

```js
const path = require('path')
// ...

const serveStatic = () => (req, res, next) => { // 미들웨어 함수 인터페이스
   const mimeType = {
     '.ico': 'image/x-icon',
    // ...
    if (Object.keys(mimeType).includes(ext)) {
      // ...
    } else {
      next() // 다음 미들웨어를 수행
    }
 }

module.exports = serveStatic;
```

미들웨어 함수는 세 개 인자를 받기 때문에 (req, res, next)로 함수 인터페이스를 변경합니다.

이전과는 달리 이제는 if/else로 비동기 로직을 제어할 수 있게 되었습니다. mimeType 딕셔너리에 있을 경우에는(if) 기존처럼 응답하고, 그렇지 않을 경우(else) 다음 미들웨어를 호출(next()) 합니다.

app.js는 어떻게 달라 질까요?

```js
const app = App()
const serveStatic = require("./middlewares/serve-static")

app.use(serveStatic())
```

use() 메소드로 미들웨어 함수를 간단히 등록했습니다. 익스프레스의 그것과 매우 비슷하네요.

![](/assets/imgs/2018/12/09/struct2.png)

써드 파티 라이브러리로 serve-static이 추가된것을 확인할수 있겠죠?

## 나머지도 미들웨어 함수로 추가

index.html를 처리하는 부분도 미들웨어 함수로 만들어 보겠습니다.
app.js에서 바로 코딩할게요.

```js
// ...
const app = App()
const path = require("path")
const fs = require("fs")

const index = (req, res, next) => {
  const publicPath = path.join(__dirname, "./public")

  fs.readFile(`${publicPath}/index.html`, (err, data) => {
    if (err) throw err

    res.statusCode = 200
    res.setHeader("Content-Type", "text/html")
    res.end(data)
  })
}

app.use(serveStatic())
app.use(index)
```

에러 처리 미들웨어도 추가하겠습니다.

```js
const error404 = (req, res, next) => {
  res.statusCode = 404
  res.end("Not Found")
}

const error = (err, req, res, next) => {
  res.statusCode = 500
  res.end()
}

app.use(serveStatic())
app.use(index)
app.use(error404)
app.use(error)
```

## 정리

- 미들웨어를 이용해서 serve-static과 기본적인 라우팅을 구현했습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)
