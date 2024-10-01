---
slug: "/2024/07/10/lecture-http-part4"
date: 2024-07-10 00:01:00
title: "[HTTP] 4편. 추가 프로토콜"
layout: post
series: "HTTP"
---

_4편 소개_

- HTTP의 비연결성을 극복하는 다양한 기술
- **9장. 폴링**: 클라이언트가 주기적으로 서버에 요청을 보내서 새로운 데이터를 확인하는 방법
- **10장. 롱 폴링**: 폴링 보다 호율적인 통신 기법
- **11장. SSE**: 서버가 클라이언트로 실시간 데이터를 푸시하는 방법
- **12장. 웹 소켓**: 클라이언트와 서버 간의 양방향 통신 프로토콜

# 9장. 폴링

## 9.1 구조

- 지속적인 요청으로 서버와 연결을 유지한다.
- 자원을 낭비할 수 있다.
- 비유: 새로운 소식이 있나요?

## 9.2 서버 구현

- 채팅 어플리케이션 제작
- 채팅 메세지 조회 기능
- 채팅 메세지 전송 기능

## 9.3 클라이언트 구현

```js
/**
 * 주기적으로 서버 자원을 조회한다.
 */
async function pollServer() {
  // 요청 주기
  const INTERVAL_MS = 5000

  // HTTP 요청을 만든다.
  const response = await fetch("/poll")

  // 변경 없는 경우, 다시 연결한다.
  if (response.status === 204) {
    setTimeout(pollServer, INTERVAL_MS)
    return
  }
  // 새로운 데이터 수신
  const message = await response.json()
  render(message)

  // 5초후 다시 요청한다.
  // 즉시 요청하면 서버에 부가를 줄 것이다.
  setTimeout(pollServer, INTERVAL_MS)
}
```

## 9.4 중간정리

- 클라이언트와 서버가 지속적으로 연결하기 위한 HTTP 활용 기법
- 단순하게 구현할 수 있다.
- 한계
  - 데이터와 무관하게 HTTP 요청을 만들다. 비효율.
  - 그만큼 네트웍 비용이 증가할 수 있다.
  - 알림 지연.
- 참고
  - [롱 폴링 | JAVASCRIPT.INFO](https://ko.javascript.info/long-polling)

# 10장. 롱 폴링

## 10.1 구조

- 서버에 요청을 보내면, 서버는 새로운 데이터가 생길 때가지 응답을 지연한다.
- 새로운 데이터가 생길 때 응답을 보낸다.
- 이전 방식에 비해 HTTP 요청, 응답을 최소화할 수 있다.
- 클라이언트는 즉시 다음 요청 보낸다. 서버는 변경된 데이터가 있을 경우 응답한다.

## 10.2 서버 구현

```js
/**
 * 응답 대기중인 클라이언트들
 */
let waitingClients = []

function longPoll(req, res) {
  // 데이터가 없는 경우
  if (!message) {
    // 클라이언트 대기열에 추가한다.
    waitingClients.push(res)

    // 10초간 기다리고 408 Reuqest Timeout을 응답한다.
    res.setTimeout(10000, () => {
      res.writeHead(408)
      res.end()
    })

    return
  }

  // 데이터가 있으면 응답하고 비운다.
  res.writeHead(200, {
    "content-type": "application/json",
  })
  res.end(`${message}`)
  message = null
}

function update(req, res) {
  req.on("end", () => {
    // (...)

    for (const waitingClient of waitingClient) {
      waitingClient.writeHead(200, {
        "content-type": "application/json",
      })
      waitingClient.end(`${message}`)
    }

    // 본 요청한 클라이언트에게 응답한다.
    res.end(`${message}`)

    // 메세지와 클라이언트 대기열을 비운다
    message = null
    waitingClients = []
  })
}
```

## 10.3 클라이언트 구현

```js
/**
 * 지속적으로 서버 자원을 조회한다.
 */
async function longPollServer() {
  const response = await fetch("/poll")

  // 타임아웃이 발생하면 다시 연결한다.
  if (response.status === 408) {
    longPollServer()
    return
  }

  // 새로운 데이터 수신
  const message = await response.json()
  render(message)

  // 즉시 다시 요청한다.
  longPollServer()
}
```

## 10.4 중간 정리

- 폴링의 단점을 개선한 것이 롱폴링. 실시간성을 높임
- 알림이 있는 경우만 HTTP 메세지를 전달해서 네트우거 대역 최소화
- 한계
  - 요청을 오랜시간 유지해야한다.
  - 클라이언트가 동시에 연결을 유지할 경우 서버 자원 사용이 증가할 수 있다.
- 참고
  - https://chatgpt.com/c/8d444d7c-b88f-4f64-8689-626adf84e66f
  - https://ko.javascript.info/long-polling

# 11장. SSE

- 폴링은 클라이언트가 지속적으로 서버에 여러번 접속하는 문제가 있다.
- 서버에서 클라이언트로 메세지를 보내는 방법이 있으면 좋겠다.
- Server Sent Event

## 11.1 구조

- HTTP를 기반에 동작하는 HTML5 표준 기술
- 통신 방식
  - 클라이언트가 EventSource 객체로 서버에 접속한다.
  - 서버는 content-type: text/event-stream 헤더를 응답하고 연결을 유지한다.
  - 클라이언트는 언제라도 서버가 보낸 이벤트를 수신할 수 있다.
- HTTP 메세지

```
< Content-Type: text/event-stream

data: Hello

data: Hello again
This is a connected sentence.
```

- 응답 본문 형식
  - data: 보낼 메세지
  - id: 메세지 아이디
  - event: 메세지의 이벤트 이름
  - retry: 재연결 간격 (밀리초 단위)

## 11.2 서버 구현

- GET /subscribe 컨트롤러

```js
/**
 * 이벤트 스트림을 구독한다.
 */
function subscribe(req, res) {
  // 이벤트 스트림 헤더를 실는다.
  res.writeHead(200, {
    "content-type": "text/event-stream",
  })
  // 헤더 끝을 표시한다.
  res.write("\n")

  // 클라이언트 대기열에 넣는다.
  // 종료 응답을 하지않고 클라이언트와 연결을 유지한다.
  waitingClients.push(res)

  // 요청 취소 처리
  req.on("close", () => {
    waitingClients = waitingClients.filter(client => client !== res)
  })
}
```

- POST /update 컨트롤러

```js
function update(req, res) {
  let body = ""

  req.on("data", chunk => {
    body = body + chunk.toString()
  })

  req.on("end", () => {
    const { text } = JSON.parse(body)

    if (!text) {
      res.writeHead(400, {
        "content-type": "application/json",
      })
      res.end(
        JSON.stringify({
          error: "text 필드를 채워주세요",
        })
      )
      return
    }

    // 메세지를 생성한다.
    const message = new Message(text)

    // 대기열에 있는 클라이언트에게 메세지를 응답한다.
    for (const waitingClient of waitingClients) {
      waitingClient.write(`data: ${message}\n\n`)
    }

    // 본 요청한 클라이언트에게 응답한다.
    res.end(`${message}`)
  })
}
```

## 11.3 클라이언트 구현

- 구독함수 정의

```js
function subscribe() {
  // 이벤트 스트림을 구독한다.
  eventSource = new EventSource("/subscribe")

  // 메세지를 수신하면 화면에 출력한다.
  eventSource.addEventListener("message", function (e) {
    render(JSON.parse(e.data))
  })
}
```

## 11.4 재연결

- EventSource 객체는 서버와 연결이 끊기면 다시 연결한다.
- 메세지에 retry로 재연결 시간을 지정할 수 있다.

```js
waitingClient.write(
  [
    // 오류시 10초 후에 재연결한다.
    `retry: 10000\n`,
    `data: ${message.toString()}\n\n`,
  ].join("")
)
```

- 이전에 받은 메세지에 id가 있다면 last-client-id 헤더에 값을 실어서 보낸다.
- 서버는 이 아이디로 클라이언트가 마지막 수신한 메세지를 알 수 있다.

```js
function subscribe(req, res) {
  const lastEventId = req.headers["last-event-id"]
  if (lastEventId) {
    // 클라이언트가 받지 못한 이벤트를 응답한다.
  }
}
```

## 11.5 중간 정리

- `content-type: text/event-stream` 헤더 응답
- EventSource 브라우져 객체
- HTTP 연결 유지, 실패시 재접속 등 간편하게 사용할 수 있다.
- 한계
  - 클라이언트가 많을 경우 서버 자원을 많이 사용한다.
  - 단방향
- 참고
  - https://chatgpt.com/c/77761981-674b-44ff-81c7-03291e7bfcc8
  - SSE 코드 및 설명

# 12장. 웹 소켓

## 12.1 구조

- HTTP는 메세지 전달이 단방향이다.
  - 폴링: 클라이언트 → 서버
  - SSE: 클라이언트 → 서버
- 웹 소켓은 양방향으로 전달한다.
- HTTP 프로토콜이 아니다. 같은 계층의 다른 프로토콜이다. TPC 기반이다.
  - ws, wss
- WS 패킷1. 요청

```
nc localhost 3000

GET /?encoding=text HTTP/1.1
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: P7Kp2hTLNRPFMGLxPV47eQ==
Sec-WebSocket-Version: 13
```

- WS 패킷2. 응답

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fX+lgbZ/+V4eiY0s9Muig1sv880=

안녕
```

- 지속 연결. HTTP 처럼 끊기지 않는다.

## 12.2 서버 구현

```js
const { WebSocketServer } = require("ws")

const wss = new WebSocketServer({ server })
```

```js
/**
 * 웹 소켓 클라이언트 대기열
 * 웹 소켓 연결된 클라이언트들에게 메세지를 전달하기 위한 용도
 */
let webSocketClients = []

wss.on("connection", webScoket => {
  // 클라이언트가 연결되면 대기열에 추가한다.
  webSocketClients.push(webScoket)

  webScoket.on("message", data => {
    // 대기열에 있는 클라이언트에게 메세지를 전달한다.
    for (const webSocketClient of webSocketClients) {
      webSocketClient.send(`${message}`)
    }
  })
})
```

## 12.3 클라이언트 구현

```js
/**
 * 서버와 연결된 웹소켓 인스턴스
 */
let webSocket

/**
 * 웹소켓 인스턴스를 초기화
 */
function subscribe() {
  // 서버와 웹소켓 핸드쉐이킹한다.
  webSocket = new WebSocket("ws://" + location.host)

  // 서버에서 메세지를 받은 경우
  webSocket.addEventListener("message", event => {
    // 받은 메세지를 화면에 출력한다.
    render(JSON.parse(event.data))
  })
}
```

## 12.4 중간 정리

- 서버와 클라이언트의 양방향 프로토콜
- TCP 연결을 유지하고 반복된 헤더를 보내지 않아 효율적으로 데이터 전송
- 한계
  - 연결 관리 직접 해야.
  - 클라이언트가 많을 경우 서버 자원을 많이 사용한다.
- 참고
  - [웹 소켓 | JAVASCRIPT.INFO](https://ko.javascript.info/websocket)
