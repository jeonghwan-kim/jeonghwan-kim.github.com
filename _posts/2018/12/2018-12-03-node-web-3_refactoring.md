---
title: '[Node.js코드랩] 3.리팩토링'
layout: post
summary: 헬로월드 코드를 리팩토링 합니다.
category: series
seriesId: 20181201
tags: lecture
---

## 🌳목표 

코드를 유연하고 읽기 쉽게 개선하는 것을 "리팩토링 한다"라고 말하는데요, 
이번 글에서는 이전에 작성한 헬로월드 코드를 리팩토링 해 보겠습니다. 

server.js 파일에 작성한 코드는 두 가지 일을 하고 있습니다.
1. 서버 생성 - `createServer()`
1. 서버 구동 - `listen()`

## 🐤실습 - 역할에 따라 파일을 분리해 보세요 

위에서 나눈 두 가지 역할에 따라 파일을 분리해 보세요. 

지난 시간까지 작성한 코드로 이동하겠습니다.

```
$ git checkout -f module/http-refactoring-spec
```

제가 미리 만들어둔 테스트 코드도 성공적으로 통과해야 합니다.
테스트 코드 실행은 `npm test`라는 걸 있지 마시고요.

*힌트: server.js는 서버 생성, bin.js는 서버 실행*

## 🐤풀이

첫 실습! 어땠나요? 혹시 뭐부터 시작해야할지 전혀 모르겠다고요? 걱정하지 마세요.
처음부터 술술 풀린다면 이 연재글을 보실 자격이 없습니다.

차근차근 풀어 볼게요.

헬로월드 서버의 두 역할중 서버 생성 부분을 server.js 파일에 다시 작성하겠습니다.
코드는 두 부분으로 나눠서 설명합니다.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});
```

http 모듈을 가져와 `createServer()` 함수로 **서버를 생성** 하는 코드입니다.
생성한 서버는 `server` 상수에 저장했구요. 

그럼 이 파일에 있는 서버 객체를 외부의 다른파일에서 사용해야겠습니다.
왜냐하면 서버를 구동하는 파일에서 이 서버 객체를 이용하기 때문이죠. 

따라서 server.js에 있는 서버객체 `server`를 외부에서 사용하도록 "노출"해야 합니다.

```js
module.exports = server
```

노드에서는 `module.exports`에 노출할 객체를 지정하면 다른 파일에서 이를 사용할 수 있습니다.
저는 서버객체 `server`를 바로 지정한 것입니다.

다음은 bin.js 파일을 만든뒤 서버를 가져와 구동해 보겠습니다. 
이것도 두 단계로 설명할게요.

```js
const server  = require('./server');
const hostname = '127.0.0.1'
const port = 3000
```

첫번째 만들었던 server.js 파일을 불러옵니다. 이 파일에서는 서버객체를 모듈로 노출했기 때문에 `require('./server')`로 가져와서 server 상수에 저장할 수 있는 것이죠. 

그리고 사용할 서버 호스트명과 포트를 상수로 지정했습니다.

```js
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

마지막으로 서버를 요청 대기상태로 만들었습니다. 

이제 테스트코드를 돌려볼까요?

```
$ npm test

  server
    ✓ should have listen()

  1 passing (8ms)
```

테스트에 성공했습니다. 서버 모듈만 테스트 코드를 작성했는데요 간단히 listen 메소드를 가져야 한다는 코드입니다. 궁금하신 분은 테스트 코드까지 한 번 살펴 보세요. 

지금까지 우리가 작성한 모듈을 도식화 해보면 이렇습니다.

![](/assets/imgs/2018/12/03/struct.png)

나머지 빈공간은 차츰 개발해 나갈 예정입니다. 

## 정리 

* 역할에 따라 모듈을 분리하여 리팩토링 했습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)
