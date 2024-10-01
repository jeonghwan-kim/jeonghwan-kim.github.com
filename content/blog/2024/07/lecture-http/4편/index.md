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
- 네트웍 대역폭과 서버 자원을 낭비할 수 있다
- 비유: 새로운 소식이 있나요?

## 9.2 서버 구현

- 채팅 어플리케이션 제작
- 채팅 메세지 조회 기능
- 채팅 메세지 전송 기능

## 9.3 클라이언트 구현

- 지속적으로 요청을 생성
- 수신한 메세지를 출력

## 9.4 중간정리

- HTTP 연결을 유지하기 위해 주기적으로 요청을 만드는 기법
- 특징: 단순한 구현
- 주의사항 1: 네트웍과 서버 자원을 낭비할 수 있다.
- 주의사항 2: 지연 시간

### 참고

- [롱 폴링 | JAVASCRIPT.INFO](https://ko.javascript.info/long-polling)

# 10장. 롱 폴링

## 10.1 구조

- 서버에 요청하고 데이터가 올 때까지 대기한다.
- 서버 자원을 낭비할 수 있다.
- 비유: 새로운 소식이 있나요? 잠깐 기다려 보세요.

## 10.2 서버 구현

- 클라이언트 대기열 준비
- 채팅 메세지 조회 기능
- 채팅 메세지 추가 기능

## 10.3 클라이언트 구현

- 지속적으로 요청 생성
- 수신한 메세지를 출력

## 10.4 중간 정리

- HTTP 연결을 유지하기 위해 응답을 지연하는 기법
- 특징: 실시간성
- 주의사항 : 서버 자원을 낭비할 수 있다.

### 참고

- [롱 폴링 | JAVASCRITP.INFO](https://ko.javascript.info/long-polling)

# 11장. SSE

## 11.1 구조

- 서버가 실시시간으로 메세지를 보낸다.
- 리소스를 효율적으로 사용할 수 있다.
- 비유: 새 소식이 오면 알려주세요.

## 11.2 서버 구현

- 클라이언트 대기열 준비
- 알림 구독 기능
- 채팅 메세지 추가 기능

## 11.3 클라이언트 구현

- EventSource
- 수신한 메세지를 출력

## 11.4 재연결

- EventSource 객체는 서버와 연결이 끊기면 다시 연결. retry로 설정
- 이전에 받은 메세지가 있다면 last-event-id 헤더에 값을 실어서 보낸다.

## 11.5 중간 정리

- 클라이언트와 서버 연결 유지 및 실시간 메세지 전송 기법
- EventSource
- 특징: 실시간 알림을 위한 프로토콜
- 주의사항: 단방향 메세지

### 참고

- [Server Sent Events | JAVASCRIPT.INFO](https://ko.javascript.info/server-sent-events)

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
