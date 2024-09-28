---
slug: "/2024/07/09/lecture-http-part3"
date: 2024-07-09 00:01:00
title: "[HTTP] 3편. AJAX"
layout: post
series: "HTTP"
---

# 6장. 업로드와 응답

# 소개

- 직접 만들 수 있는 HTTP 요청
- **6장. AJAX 요청과 응답**: fetch 함수 사용법에 대해
- **7장. AJAX 진행율과 취소**: AJAX 진행율을 계산하는 방법과 요청을 취소하는 방법에 대해
- **8장. AJAX 라이브러리**: fetch와 XHR 객체 기반의 주요 AJAX 라이브러리

## 6.1 AJAX

- From 요청은 비교적 느림
- AJAX, Asynchronous JavaScript and XML
- XHR과 fetch

## 6.2 Fetch API

- fetch(url, [options]) 함수
- Request 객체
- 로그인 POST 요청 제작
- JSON 형식

## 6.3 Response 객체

- fetch()는 응답 객체로 이행하는 프라미스를 반환
- 응답 헤더
- 응답 본문

## 6.4 중간정리

- 웹 페이지 전체를 요청하지 않고 데이터만 서버에 전달하는 기법을 AJAX라고 한다.
- 브라우져는 XHR 객체나 **fetch** 함수를 제공한다.
- fetch 함수는 Request 객체로 요청을 만들 수 있다.
- fetch 함수는 Response 객체로 이행하는 프라미스를 반환한다.
- 참고
  - [Fetch API | MDN](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API)
  - [HTTP 상태 코드 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)
  - [Fetch | 모던 자바스크립트 튜토리얼](https://ko.javascript.info/fetch)

# 7장. 진행율과 취소

- fetch 함수로 다운로드 진행율을 표시하는 방법
- fetch 함수로 다운로드를 취소하는 방법
- xhr 객체로 업로드 진행율을 표시하는 방법

## 7.1 다운로드 진행율

- Response.body는 응단 본문을 읽을 수 있는 읽기 전용 스트림이다.
- 응답 본문을 청크로 5번 실어 보내는 서버 코드

```js
// 5번 쪼게서 응답할 것이다.
const iterateCount = 5

// 헤더 응답.
res.writeHead(200, {
  "content-type": "text/plain",
  // 응답 본문의 전체 길이다.
  "content-length": iterateCount * 8,
})

// 1초씩 지연하면서 8바이트 청크를 5번 응답한다.
for await (const i of Array(iterateCount).keys()) {
  res.write(`chunk ${i}\n`)
  await new Promise(res => setTimeout(res, 1000))
}

// 응답 종료.
res.end()
```

- 클라이언트에서 수신한 응답 바디의 길이를 계산해 진행율을 표시한다.

```js
document.addEventListener("DOMContentLoaded", async () => {
  // http 요청을 생성한다
  const response = await fetch("/chunk")

  // 본문의 전체 길이를 구한다.
  const totalLength = Number(response.headers.get("content-length"))
  // 응답 본문 청크를 저장할 것이다.
  const chunks = []
  // 응답 받을 때 다 본문의 누적 길이다.
  let receivedLength = 0

  // 본문 조회 전용 메서드 대신
  // 읽기 전용 스트림을 얻는다.
  const reader = response.body.getReader()

  // 본문이 끝날 때까지 반복한다.
  while (true) {
    // 스트림에 도착한 데이터를 읽는다.
    const { done, value } = await reader.read()

    // 본문을 모두 다운로드하면 반복을 마친다.
    if (done) {
      const el = document.createElement("pre")
      el.textContent = "Done."
      document.body.appendChild(el)

      const textDecoder = new TextDecoder("utf-8")
      const textList = []
      for (const chunk of chunks) {
        // 스트림이 받은 Unit8Array을 문자열로 변환한다.
        textList.push(textDecoder.decode(chunk))
      }
      const responseTextEl = document.createElement("div")
      responseTextEl.textContent = textList.join("")
      document.body.appendChild(responseTextEl)
      break
    }

    // 청크를 저장한다.
    chunks.push(value)
    // 응답 본문의 누적 길이를 갱신한다.
    receivedLength = receivedLength + value.length
    // 다운받은 진행율을 표시한다.
    const el = document.createElement("pre")
    console.log(receivedLength, totalLength)
    el.textContent = `${receivedLength}/${totalLength} byte downloaded.`
    document.body.appendChild(el)
  }
})
```

## 7.2 다운로드 취소

- AbortController는 AbortSignal에게 "abort" 이벤트를 발행을 요청하는 역할.
- AbortSignal은 "abort" 이벤트를 발행하는 역할
- fetch 함수에 전달된 AbortContorller의 abort 메소드를 실행하면 AbortSignal이 "abort" 이벤트를 발행, fetch가 이를 감지해 http 요청을 취소한다.

```js
// AbortController 객체 생성
const controller = new AbortController()

// 버튼을 클릭하면 "abort" 이벤트를 발행한다.
abortButton.addEventListener("click", async () => {
  controller.abort()
})

// fetch는 signal에서 abort 이벤트를 감지하면 http 요청을 취소한다.
fetch(url, {
  signal: controller.signal,
})

// "abort" 이벤트 핸들러를 추가할 수있다.
controller.signal.addEventListener("abort", () =>
  console.log("abort 이벤트 수신함")
)
```

## 7.3 업로드 진행율

- 아직은 XHR 객체로 업로드 진행율을 표시한다.

```js
// xhr 객체를 준비한다.
const xhr = new XMLHttpRequest()

// 업로드 진행율
let uploadProgress = 0

// 업로드 진행 이벤트 처리기
const handleProgress = event => {
  if (event.lengthComputable) {
    // 업로드 진행율을 갱신한다.
    uploadProgress = (event.loaded / event.total) * 100
    // 업로드 진행율을 표시한다.
    console.log(`업로드 진행율: ${uploadProgress}%`)
  }
}
// 업로드 이벤트(progress)를 처리한다.
xhr.upload.addEventListener("progress", handleProgress)
```

## 7.4 중간정리

- 다운로드 진행율은 Reponse.body 스트림을 사용해 계산한다.
- 다운로드 취소는 AbortController와 AbortSignal을 사용해 취소 가능한 HTTP 요청을 만든다.
- 업로드 진행율은 fetch에서 지원하지 않는다. XHR 객체와 "progress" 이벤트를 사용한다.
- 참고
  - [Fetch Progress | JAVASCRIPT.INFO](https://ko.javascript.info/fetch-progress)
  - [ReadableStream | MDN](https://developer.mozilla.org/ko/docs/Web/API/ReadableStream)
  - [Fetch Abort | MDN](https://ko.javascript.info/fetch-abort)
  - [AbortController | MDN](https://developer.mozilla.org/ko/docs/Web/API/AbortController)
  - [AbortSignal | MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
  - [XMLHttpRequst | JAVASCRIPT.INFO](https://ko.javascript.info/xmlhttprequest)

# 8장. 라이브러리

- 브라우져 API를 래핑해서 사용하는게 일반적이다.
- XHR기반, fetch 기반 라이브러리 네 개를 비교한다.

## 8.1 SuperAgent

- XHR 기반. 2011년 출시. 콜백 스타일. 50Kb
- HTTP 메소드별 전용 함수
- Error 클래스를 확장한 전용 오류 클래스
- 플러그인으로 확장

## 8.2 Axios

- XHR 기반. 2014년 출시. 프라미스 기반. 33Kb
- HTTP 메소드별 전용 함수
- AxiosError
- 인터셉터로 확장

## 8.3 Ky

- fetch 기반. 2018년 출시. 0.9Kb. 타입스크립트
- HTTP 메소드별 전용 함수
- 프라미스 사용을 간소화
- Error 클래스를 확장한 HTTPError
- 훅으로 확장

## 8.4 Wretch

- fetch 기반. 2017년 출시. 2.8Kb. 타입스크립트
- HTTP 메소드별 전용 함수
- Error 클래스 확장한 WrechError
- 미들웨어, 애드온으로 확장

## 8.5 중간정리

- 비슷한 점
  - HTTP 메소드별로 함수를 제공한다.
  - 일관된 응답 객체를 제공한다.
  - 일관된 오류 객체를 제공한다.
  - 구조와 이름만 다를 뿐 확장하는 인터페이스를 제공한다.
- 다른 점
  - SuperAgent: 가장 오래됨. 크로스브라우져
  - Axios: xhr 기반. 프라이스 인터페이스 제공
  - Ky: fetch 기반. 프라미스 사용 간소화
  - Wretch: 오류 전용 캐처, 미들웨어, 애드온 등 편의 제공
- 참고
  - [SuperAgent | Github](https://github.com/ladjs/superagent)
  - [Axios | Github](https://github.com/axios/axios)
  - [Ky | Github](https://github.com/sindresorhus/ky)
  - [Wretch | Github](https://github.com/elbywan/wretch)
