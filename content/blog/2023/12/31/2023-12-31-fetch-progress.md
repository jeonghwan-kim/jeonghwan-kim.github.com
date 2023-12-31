---
slug: "/2023/12/31/fetch-progress"
date: 2023-12-31
title: "Fetch 진행율"
layout: post
tags: [http]
---

Ajax 기법을 사용하면서 진행율을 표시해 보진 않았다. 업로드 혹은 다운로드할 때 시간이 걸리기 때문에 UI로 표시할 필요는 있다. 스핀이나 프로그래스 바로 진행 여부를 나타낸 정도다. 정확한 수치로 진행율을 표시하는 방법이 있을까?

fetch로 간단히 구현할수 있다는 걸 알았다. 물론 XMLHttpRequest(줄여서 xhr) 객체로도 가능하다. 다운로드 시간이 길면 취소할 수도 있다. 무거운 http라면 이 기능을 제공하는 것이 좋겠다. 사용자가 더 좋은 환경을 경험하기 때문이다.

http 진행율과 취소 방법을 정리하겠다.

# 다운로드 진행율

fetch 함수가 반환한 Response 객체는 응답 형식에 따라 전용 메소드가 있다.

- text()
- json()
- blob()
- arrayBuffer()
- formData()

정해진 포맷으로 데이터를 변환하는 역할이다. 데이터는 어디에 저장되어 있을까?

Response 객체의 body 필드가 응답 본문을 알 수 있는 곳이다. 읽기 전용 스트림인 RedableStream 객체를 가리킨다.

스트림(stream)은 데이터가 연이어 흐르는 것을 말한다. 개울에 물이 졸졸 흐르는 것과 같다. 용도에 따라 읽기 전용, 쓰기 전용, 양방향이 있다. body는 http 응답 데이터가 흐르는 곳이다. 브라우져가 받은 데이터를 조회할 수 있기 때문에 읽기 전용 스트림이다.

이걸 이용하면 다운로드 진행율을 계산할 수 있다.

데이터를 조금씩 응답하는 서버를 준비하자.

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

- 응답 헤더에 전체 본문 길이를 지정했다. 브라우져에 전체 길이를 알려줄 것이다.
- 1초씩 지연하면서 8바이트 청크를 5번 응답했다.
- "chunk 1\n"는 마지막 개행문자를 포함해 길이가 8이다.

요청을 받으면 총 5초간 데이터를 조금씩 응답할 것이다.

이제 브라우져에서 다운로드 진행율을 계산해 보자.

```js
// http 요청을 생성한다
const response = await fetch("/chunk")

// 본문의 전체 길이를 구한다.
const totalLength = response.headers.get("content-length")
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
  if (done) break

  // 청크를 저장한다.
  chunks.push(value)
  // 응답 본문의 누적 길이를 갱신한다.
  receivedLength = receivedLength + value.length
  // 다운받은 진행율을 표시한다.
  console.log(`${receivedLength}/${totalLength}바이트 다운로드`, value)
}
```

- 요청을 생성했다.
- 응답 헤더에서 전체 길이를 구한다.
- 읽기 전용 스트림을 얻는다. (전용 메서드를 사용하지 않았다.)
- 스트림에서 데이터를 꺼내 누적 길이를 표시한다. (누적 크기/전체 크기)
- 데이터를 모두 받을 때까지 반복한다.

코드를 실행하면 총 5번에 걸처 응답 본문을 수신하고 기록할 것이다.

```
8/40바이트 다운로드 Unit8Array
16/40바이트 다운로드 Unit8Array
24/40바이트 다운로드 Unit8Array
32/40바이트 다운로드 Unit8Array
40/40바이트 다운로드 Unit8Array
```

스트림으로 얻은 데이터는 Unit8Array 타입이다. 텍스트로 변환해서 활용할 수 있다.

```js
const textDecoder = new TextDecoder("utf-8")
for (const chunk of chunks) {
  // 스트림이 받은 Unit8Array을 문자열로 변환한다.
  const text = textDecoder.decode(chunk)
  console.log(text)
}
```

TextDecoder 객체를 사용했다. utf8 형식으로 문자를 변환했다. json 형식이라면 모든 값을 하나의 텍스트로 모아서 JSON.parse()로 파싱해야할 것이다.

# 다운로드 취소

응답 시간이 길면 사용자는 오래 기다리지 않는다. 브라우져를 끄고 나가거나 방법이 있다면 다운로드만이라도 취소하려고 할 것이다.

브라우져에서는 http 요청 취소를 위한 전용 클래스가 있다.

- AbortController
- AbortSignal

취소 전용 클래스가 AbortController다. signal 필드와 abort() 메소드만 제공하는 매우 단순한 인터페이스다. signal 필드는 취소 이벤트를(abort) 발행할 수 있는 AbortSignal 객체를 참조한다. abort() 메소드가 이 객체에게 요청 취소 이벤트를 발행한다.

AbortSignal은 요청 취소 상태를 관리하는 클래스다. EventTarget을 상속한다. 이벤트 처리기에서 봤던 그 event.target이다. aborted 필드에 요청 취소 여부를 기록한다.

fetch 함수의 옵션 인자는 signal 필드에 AbortSignal 객체를 받는다. 어디선가 취소 이벤트를 발생하면 이 객체의 aborted 필드에 기록될 것이다. fetch 함수는 이 값을 보고 http 요청을 취소할 것이다.

AbortSignal 객체의 참조를 가진 AbortContrller가 바로 이벤트 발행자다. abort() 메소드로 취소 이벤트를 발행해 fetch 요청을 취소할 수 있다.

```js
// AbortController 객체를 준비한다.
const controller = new AbortController()

// abortSignal 객체에 취소(abort) 이벤트 처리기를 붙인다.
controller.signal.addEventListener("abort", () =>
  console.log("abort 이벤트 수신함")
)

const response = await fetch("/chunk", {
  // abortSignal 객체를 전달해 fetch를 실행한다.
  signal: controller.signal,
})

// 요청을 취소한다.
controller.abort()
```

- AbortController 객체를 준비한다. http 요청을 취소할 용도다.
- AbortSignal 객체에 취소(abort) 이벤트 처리기를 붙인다.
- AbortSignal 객체를 옵션 인자로 전달해 fetch 함수를 실행한다. 네트웍 요청이 생성될 것이다.
- AbortController 객체의 abort 메소드로 요청을 취소한다.

브라우져는 http 요청을 생성한 즉시 취소할 것이다. AbortController가 이를 취소했기 때문이다.

```
Uncaught (in promise) DOMException: The operation was aborted.
```

요청 취소는 예외를 발생시키기 때문에 fetch 함수를 실행할 때 try/catch 문으로 감싸써 예외를 적절히 처리해 주는게 좋겠다.

# 업로드 진행율

아쉽게도 fetch는 업로드 진행율을 알 수 없다. 각 문서나 튜토리얼에서는 xhr 객체를 사용하라고 안내한다.

```js
// 입력한 파일을 폼데이터로 구성한다.
const formData = new FormData()
formData.append("file", document.querySelector("input[type=file]").files[0])

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

// 요청
xhr.open("POST", "/upload")
xhr.send(formData)
```

- 진행율을 표시하기 위해 용량이 큰 파일을 얻으려고 파일을 폼 데이터로 구성했다.
- xhr 객체를 준비한다.
- 업로드 이벤트(progress)가 발생할 때마다 이벤트 객체의 loaded와 total로 진행율을 계산한다.

테스트해 보면 100%만 찍힐것이다. 루프백 네트웍(localhost)이라 속도가 빠르기 때문이다. 브라우져 시뮬레이션으로 네트웍 속도를 줄여서 테스트해 보자.

```
Upload Progress: 27%
Upload Progress: 54%
Upload Progress: 81%
Upload Progress: 100%
```

# 왜 업로드 진행율을 지원하지 않을까?

라이브러리의 업로드 진행율 기능이 궁금했다.

axios는 onUploadProgress란 api로 업로드 진행율을 확인할 수 있다. superagent도 progress 이벤트를 직접 처리해서 구현할 수 있다. 두 라이브러리는 xhr을 이용해 업로드 진행율을 제공한다.

한편 fetch 기반으로 구현된 wretch나 ky는 지원하지 않는다.

- [Add upload progress callback | ky](https://github.com/sindresorhus/ky/issues/183)

response.body처럼 요청을 스트림으로 만들면 진행율을 계산할수 있다고 한다. 하지만 모든 브라우져가 스트림 API를 지원하지는 않는다. 더 중요한 것은 현재 주로 사용하는 HTTP/1.1에서 동작하지 않는다는 점이다. 브라우져와 웹 환경이 좀 더 개선될 때까지는 당분간 지원하지 않을 것 같다.

# 결론

fetch 함수를 이용해 진행율을 계산하는 방법을 정리했다.

다운로드 진행율은 fetch 함수가 반환한 Response 객체의 body 필드를 사용하면 된다. 읽기 전용 스트림에 데이터가 들어올 때마다 그만큼 누적해서 계산하는 방식이다.

다운로드를 취소할 때는 AbortController를 사용한다. signal 필드에 AbortSignal 객체의 참조를 fetch 함수에 전달해 취소 가능한 요청을 만든다. AbortController의 abort() 메소드를 사용하면 HTTP 요청을 취소할 수 있다.

fetch에서 업로드 진행율은 표시할 수 없다. 기존의 xhr을 사용하라.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.com/tree/master/content/codes/2023/fetch-progress)
- https://ko.javascript.info/fetch-progress
- https://developer.mozilla.org/ko/docs/Web/API/ReadableStream
- https://ko.javascript.info/fetch-abort
- https://developer.mozilla.org/ko/docs/Web/API/AbortController
- https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
- https://ko.javascript.info/xmlhttprequest
