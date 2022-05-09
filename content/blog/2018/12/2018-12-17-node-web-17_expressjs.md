---
slug: "/series/2018/12/17/node-web-17_expressjs.html"
date: 2018-12-17
title: "[Node.js코드랩] 17. Express.js"
layout: post
category: series
seriesId: series-2018-12-01-weplanet-codelab
tags: [lecture]
---

## 🌳목표

지금까지 만들었던 웹 어플리케이션을 웹 프레임웍을 이용해서 다시 만들어 봅니다.

## Express.js로 다시 만들기

먼저 지난 시간까지 작성한 코드로 이동 하겠습니다.

```
$ git checkout -f route/post-posts
```

우리가 가장 먼저 만들었던 debug 모듈을 기억하시나요?
이제는 NPM에서 다운받아 우리가 만든 것과 교체하겠습니다.

```
$ npm install debug
```

그리고 웹 프레임웍인 Express.js도 NPM에서 다운받습니다.

```
$ npm install express
```

먼저 서버 구동파일인 bin.js를 수정하지요.

```js
const debug = require("debug")("bin") // debug 모듈 교체
// ...
```

다운받은 debug 모듈로 교체하였습니다.

다음으로 어플리케이션 시작점인 app.js를 수정합니다.

```js
const debug = require("debug")("app") // debug 모듈 교체
const express = require("express") // Application 모듈 교체
const app = express()

debug("App is initiated")

module.exports = app
```

debug 모듈 뿐만 아니라 Application 모듈도 다운받은 express로 바꾸었습니다.

여기까지 하고 우선 서버를 구동해 보죠.

debug 모듈은 환경변수 DEBUG를 설정하고 실행해야 로그를 출력합니다.

```
$ DEBUG=* npm start
```

![](/assets/imgs/2018/12/17/result_1.png)

기대한것 보다 훨씬 많은 로그가 출력되는데요?
이건 express 프레임웍도 내부적으로는 debug를 사용하고 있기 때문입니다.

앞에 "express:"로 시작하는 로그는 익스프레스에서 출력하는 메세지들이죠.
그 아래 "app", "bin" 태그가 있는 로그가 우리가 설정한 것입니다.

실전에서는 "app_name:sub_name" 형식으로 태깅해야 로그 필터링하기에 수월하겠죠?

## serve-static

다음으로 정작파일을 다룬 serve-staic 모듈을 교체하겠습니다.

이 기능은 익스프레스 프레임웍에서 제공합니다.
app.js에 바로 코딩해 볼까요?

```js
app.use(express.static("public"))
```

express.static() 메소드를 이용하면 바로 정적파일 제공기능을 활성화 할 수 있어요.

인자로 "public" 문자열을 전달했는데 이건 정적파일을 담고 있는 최 상단 폴더를 지정한 것입니다.
모듈 안에서 하드코딩으로 박아 놓았던 우리 코드보다 더 확장하기 좋은 코드죠?

## morgan

HTTP 요청 기록을 로깅하는 looger 모듈도 바꿔보겠습니다.

NPM에는 이것과 똑같은 기능을 하는 morgan이라는 모듈이 있습니다.

```
$ npm install morgan
```

이것도 미들웨어니깐 app.js에서 어플리케이션에 등록합니다.

```js
const logger = require("morgan")

app.use(logger("dev"))
```

"dev" 인자를 전달하는데요 이것은 로깅 형식을 지정한 것입니다.
"combined", "common" 처럼 미리 등록되어 있는 형식 뿐만아니라 로그를 커스터마징 할 수 있도록 편의를 제공합니다. ([문서](https://github.com/expressjs/morgan#predefined-formats) 참고)

## 포스트 조회

GET 메소드를 이용한 포스트 조회 API를 express 기능으로 바꿔보지요.

라우트 등록을 위해 app.js로 갑니다.

```js
const apiPost = require("./routes/api/post")

app.get("/api/posts", apiPost.index())
```

익스프레스 객체인 app도 우리가 만든것 처럼 get() 메소드를 지원합니다.
기능도 똑같아요.
뿐만아니라 HTTP 메쏘드 이름에 따라 post(), put(), delete() 메소드까지 제공한답니다.

## body-parser

전 시간에 만들었던 body-parser 모듈도 교체해 보죠.

NPM에서 같은 이름으로 모듈을 다운받을 수 있습니다.

```
$ npm install body-parser
```

역시 미들웨어 함수이므로 app.js에서 등록합니다.

```js
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
```

[익스프레스 문서](https://expressjs.com/ko/4x/api.html#req.body)에 따라 urlencoded()와 json() 메소드를 실행합니다.

## 포스트 생성

마지막으로 포스트 생성 API를 익스프레스 기능으로 대체합니다.
라우트 등록을 위해 app.js에 아래 코드를 추가합니다.

```js
app.post("/api/posts", apiPost.create())
```

이상으로 express를 이용해서 기능 기능을 모두 대체했습니다.
어떤가요?
웹 프레임웍과 몇 가지 라이브러리를 사용하니깐 너무 쉽게 끝나 버렸죠?

## 정리

- 익스프레스JS를 이용해 기존 서버를 다시 작성했습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)
