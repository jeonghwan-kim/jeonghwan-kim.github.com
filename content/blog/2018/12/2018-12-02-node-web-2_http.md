---
title: '[Node.js코드랩] 2.기본 모듈 http'
layout: post
summary: 헬로월드 서버를 만들어 봅니다
category: series
seriesId: "555b6438-4a71-51d0-9156-a1d5ca4d5eab"
tags: [lecture]
---

## 🌳목표

노드의 기본 모듈 중 네트웍 기능을 제공하는 http 모듈을 알아 봅니다.
헬로월드 코드로 http모듈을 이용한 서버 어플레케이션을 만드는 것이 목표입니다.

## 왜 http 모듈부터 시작하나요?

우리는 웹 어플리케이션을 만들어 볼겁니다. 웹 서버를 만들기 위해서는 꽤 많은 네트웍 지식을 알고 있어야 합니다. 가령 tcp, listen, 3way handshaking 처럼 컴퓨터공학에서 배우는 전문 지식들이죠.

노드에서는 이러한 개념들을 구현한 http 모듈을 기본으로 제공합니다. 네트웍 기술을 구현한 것이 이 기본 모듈인데요, 우리는 이것을 이용해서 좀 더 편리하게 웹 어플리케이션을 개발할 수 있습니다.

## 문서를 같이 살펴 볼까요?

노드를 학습하기 위한 교과서는 노드 공식 홈페이지의 문서입니다. 기본 모듈이 어떻게 있나 한 번 살펴 볼까요?

[노드 기본 모듈 목록](https://nodejs.org/dist/latest-v10.x/docs/api/)

자주 사용하는 것만 짚어 볼게요.
* Console: 콘솔 로깅
* Crypto: 암호화
* Events: 이벤트 관리
* File System: 파일 관리
* **Http: 네트웍 기능**
* OS: 운영체제 정보
* Path: 경로 관리
* Stream: 스트림 관리

우리가 사용할 http 모듈에 대해 더 알아 봅시다.

[http 기본 모듈](https://nodejs.org/dist/latest-v10.x/docs/api/http.html)
* http.createServer(): 서버 인스턴스를 만들어 반환
* http.server: 서버 클래스
* server.listen(): 서버를 클라이언트 요청 대기 상태(listen)로 만듬

위 세 개 API만으로 간단한 헬로월드 서버를 만들수 있습니다.
아래 링크에서 확인해 볼까요?

[hello world](https://nodejs.org/dist/latest-v10.x/docs/api/synopsis.html)

## Hello word

링크에 있는 코드를 우리 프로젝트에서 실행해 보겠습니다.
먼저 지난 글에서 작성한 코드를 미리 저장해 놓은 브랜치로 이동 하겠습니다.

```bash
$ git checkout -f scaffolding/unittest
```

코드를 제대로 따라오신분은 체크아웃(브랜치 이동)하지 않고 계속 진행하시고요.
그렇지 않은 분은 체크아웃 한 뒤 이어서 코딩하시기 바랍니다.

링크에 있는 코드를 복사해서 우리 프로젝트의 server.js에 붙여 넣어 봅시다.

```js
const http = require('http'); // 노드 모듈을 가져온다

const hostname = '127.0.0.1'; // 사용할 서버 호스트네임
const port = 3000; // 사용할 서버 포트

// 서버를 만든다
const server = http.createServer((req, res) => { // 요청이 오면 실행되는 콜백 함수
  res.statusCode = 200; // 응답 상태값 설정
  res.setHeader('Content-Type', 'text/plain'); // 응답 헤더 중 Content-Type 설정
  res.end('Hello, World!\n'); // 응답 데이터 전송
});

// 서버를 요청 대기 상태로 만든다
server.listen(port, hostname, () => { // 요청 대기가 완료되면 실행되는 콜백 함수
  // 터미널에 로그를 기록한다
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

추가로 달아놓은 주석을 자세히 읽어보세요. 충분히 이해할 수 있을 겁니다.

저장하고 터미널에서 서버를 실행해 보죠.

```bash
$ node server.js
Server running at http://127.0.0.1:3000/
```

이런 메세지가 나오죠? 서버가 구동된 것입니다. http.server 인스턴스가 만들어 져서 127.0.0.1 컴퓨터(내 컴퓨터)의 3000번 포트에서 요청 대기하고 있는 상태인 것이죠.

그럼 curl 명령어로 서버에 요청해서 응답을 확인해 볼까요?

```bash
$ curl localhost:3000
Hello, world
```

"Hello, world" 문자열이 제대로 오네요.

`-v` 옵션을 추가하고 curl 요청을 보내면 http 헤더까지 볼 수 있습니다.

```bash
curl localhost:3000 -v
* Rebuilt URL to: localhost:3000/
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET / HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/plain
< Date: Wed, 12 Dec 2018 10:48:33 GMT
< Connection: keep-alive
< Content-Length: 14
<
Hello, World!
```

`>` 문자로 시작하면 요청 정보이고 `<` 문자로 시작하면 응답 정보 입니다.
응답 부분을 보면 200 상태코드와 text/plain 헤더가 오는 것을 확인할 수 있습니다.

## 정리

* 노드 기본 모듈인 http를 살펴 봤습니다.
* http로 헬로월드 서버를 만들었습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)