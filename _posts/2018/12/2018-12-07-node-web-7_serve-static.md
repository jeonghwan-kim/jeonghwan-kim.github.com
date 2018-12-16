---
title: '[Node.js코드랩] 7.커스텀 모듈 serve-static'
layout: post
summary: serve-static 모듈을 만듭니다
category: series
---

## 🌳목표 

이전 코드를 리팩토링하여 serve-static 모듈을 만듭니다 

## 🐤실습 - serve-static 모듈 구현 

이전 시간까지 했던 코드로 브랜치 이동하겠습니다.

```
$ git checkout -f modules/serve-static-files
```

src/Application.js에 있는 정적파일 다루는 로직을 src/serve-static.js 파일로 분리하세요. 

## 🐤풀이 

그럼 같이 풀어 볼까요? 

src/serve-static.js 파일을 만들고 아래 코드를 입력합니다.

```js
const path = require('path');
const fs = require('fs');

const serveStatic = (req, res) => {
  const mimeType = {
  // ...

  if (Object.keys(mimeType).includes(ext)) {
    // ...
  }
};
    
module.exports = serveStatic;
```

코드를 그대로 복사해서 가져왔습니다. 
요청한 파일의 확장자가 mimeType 딕셔너리에 있을 경우만 이 모듈에서 처리하죠.
마지막 줄에서는 serveStatic을 모듈로 익스포트 하였습니다.

그럼 src/Application.js에서 이 모듈을 가져다 사용하겠습니다.

```js
const serveStatic = require('./serve-static')
    
const _server = http.createServer((req, res) => {
  serveStatic(req, res) // serve-static 모듈 사용 

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  const filePath = path.join(__dirname, '../public/index.html')
  fs.readFile(filePath, (err, data) => {
    if (err) throw err;

    res.end(data);
  })
});
```

요청이 오는 즉시 serveStatic 모듈에 req, res 인자를 넘겨서 실행했습니다.
js, css, image 파일이 온다면 이 모듈에서 응답해 주겠죠. 

그런데 문제는 serveStatic() 실행후에 다시 index.html를 응답한다는 겁니다.
응답을 했는데 또 응답하는 중복 로직이 생긴다는 말입니다.

실행해보면 이런 에러 메세지를 확인할 수 있습니다. 

```
_http_outgoing.js:491
    throw new Error('Can\'t set headers after they are sent.');
    ^

Error: Can't set headers after they are sent.
```

헤더를 두번 보낼수 없다는 말이네요.

## 한계 - 새로운 구조가 필요한가? 

하나의 요청에는 하나의 응답만 보내야 하는데 그렇지 않아서 생긴 문제입니다.
serveStatic 모듈이 동기 구문이라면 한 파일에 있을때는 if/else로 분기해서 코드를 작성했지만, 모듈로 분리하면서 로직 제어가 힘들어 졌습니다. 

다음 시간에 이 문제를 해결할수 있는 패턴을 알아보겠습니다.

## 정리 

- 정적 파일을 모듈로 리팩토링하는 시도를 했습니다.
- 비동기 로직을 제어하는 현 구조의 한계를 짚어 봤습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)