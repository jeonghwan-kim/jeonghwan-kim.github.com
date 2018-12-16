---
title: '[Node.js코드랩] 10.커스텀 모듈 logger'
layout: post
summary: 미들웨어를 활용합니다
category: series
---

## 🌳목표 

요청이 오더라도 서버의 터미널에는 아무런 정보도 남아 있지 않습니다. 
이번 시간에는 서버 로그를 기록하는 미들웨어인 logger를 만들어 보겠습니다.
익스프레스JS 진영의 [morgan](https://github.com/expressjs/morgan)과 유사한 모듈입니다.

## 🐤실습 - Logger 미들웨어를 구현해 보세요 

매 요청마다 메소드명과 URL을 터미널에 찍어 보세요. 

먼저 지난 시간까지 작성한 코드로 이동합니다.

```
$ git checkout -f module/logger-spec
``` 

*힌트: req 객체를 살펴보세요*

## 🐤풀이 

middlewares/logger.js 파일을 만들어 아래 코드를 입력합니다.

```js
const logger = () => (req, res, next) => {
  const log = `${req.method} ${req.url}`
  console.log(log)
  next()
}

module.exports = logger
```

logger도 요청에서 응답 사이에 실행되는 미들웨어 함수이므로 (req, res, next) 인터페이스를 맞추었습니다.
로그 메세지를 메소드명(req.method)과 URL(req.url)을 합쳐서 출력했고요.

미들웨어 함수이기 때문에 다음 미들웨어 호출을 위해 next() 함수를 실행합니다.

이것을 app.js에서 사용해야겠지요.

```js
// ...
const logger = require('./middlewares/logger');

app.use(logger()) // 로그 미들웨어 추가
app.use(serveStatic())
// ...
```

미들웨어 등록함수인 use() 메소드로 logger를 추가했습니다.

서버를 구동하고 요청을 보내볼까요? 

```
$ npm start
GET /
GET /css/style.css
GET /js/script.js
GET /imgs/twitter.png
GET /favicon.ico
```
브라우져에서 index.html을 요청한뒤 순차적으로 정적 파일 요청 내용이 로그로 찍혀 나옵니다. 

## 🐤실습 - 메소드명에 색상도 추가해 보세요 

*힌트: debug모듈 참고*

## 🐤 풀이

debug 모듈에서 색상 출력을 위해 생삭 값을 사용했지요? 
이번에도 비슷한 방법으로 구현하겠습니다.
세 부분으로 나눠서 풀어볼게요.

```js
const colors = {
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
}
```

사용할 컬러 값을 맵으로 만듭니다.

```js
const methodColorMap = {
  get: colors.green,
  post: colors.cyan,
  put: colors.yellow,
  delete: colors.red
}
```

메소드 이름에 따라 사용할 색상을 맵핑하여 methodColorMap을 만듭니다. 

```js
const logger = () => (req, res, next) => {
  const coloredMethod = (method = '') => {
    return `${methodColorMap[method.toLowerCase()]}${method}${colors.reset}`
  } 

  const log = `${coloredMethod(req.method)} ${req.url}`
  console.log(log);
  next();
}
```

색상 코드와 메소드 명을 조합한 문자열을 반환하는 coloredMethod() 함수를 정의했습니다.
이것을 이용해 메소드 이름만 색상을 줘서 출력하도록 한 것이죠. 

그럼 결과를 다시 확인해 볼까요? 

![](/assets/imgs/2018/12/10/result.png)

logger는 우측 하단의 써드 파티 라이브러리로 분류할 수 있습니다.

![](/assets/imgs/2018/12/10/struct.png)

## 정리 

* 요청 정보를 로깅하는 logger 미들웨어를 만들었습니다.


[목차 바로가기](/series/2018/12/01/node-web-0_index.html)