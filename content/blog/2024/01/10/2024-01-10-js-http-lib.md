---
slug: "/2024/01/10/js-http-lib"
date: 2024-01-10
title: "자바스크립트 http 클라이언트 라이브러리 비교"
layout: post
tags:
  - http
---

브라우저는 http 요청을 위해 xhr과 fetch을 제공한다. 직접 써보진 않았고 좀 더 간소한 인터페이스로 감싸서 사용했다. 요청과 응답 사이에 반복되는 로직을 이 래퍼에 담아 둔다거나 커스터마이징을 위한 인터페이스를 열어 두기도 했다.

이런 요구는 모든 웹 개발 프로젝트의 공통 사항이다. 이미 만들어둔 라이브러리를 가져다 사용하는 게 흔하다. 제이쿼리의 ajax 함수부터 요즘 사용하는 axios까지.

http 클라이언트 라이브러리를 그 동안 경험한 순서대로 정리해 보겠다.

# SuperAgent

제이쿼리의 ajax를 대체할 만한게 필요했다. 당시엔 ajax기법을 사용하려면 브라우져의 xhr 객체뿐이었다. 당연히 라이브러리도 xhr 기반이었다. superagent가 정식 버전이 높고 안정적이었다. 노드 종단간 테스트 라이브러리인 supertest가 익숙해서 선택하기도 했다.

2011년에 0.1.0 버전을 시작으로 지금은 8.1.2까지 출시했다. 초기 버전을 tj가 출시한 듯 한데 영향력에 다시 한 번 감탄한다. 초기엔 콜백 스타일이었지만 지금은 다른 라이브러리처럼 프라미스 기반의 인터페이스를 제공한다. 노드 환경에서도 사용할 수 있고 50KB 용량이다.

## 인터페이스

Http 메소드별로 전용 함수를 제공한다.

```js
// 요청을 위한 전용 메소드를 제공한다.
const response = await superagent.get("/hello")
// 전용 응답 객체를 제공한다.
console.log(response)
```

post, put, delete 함수도 제공하는데 이런 라이브러리들의 공통점이다.

메소드를 호출하면 응답 객체로 이행하는 프라미스를 반환한다. 응답 객체는 사용하기 편하게 상태코드, 헤더, 본문을 함께 담는다.

- status: 상태 코드
- header: 응답 헤더
- text, body: 응답 본문

전체 응답 객체는 [여기](https://ladjs.github.io/superagent/#response-properties)를 확인하라.

실패하면 오류 객체를 던진다. 프라미스를 반환하기 때문에 try/catch 문으로 오류를 감지할 수 있다.

```js
try {
  const response = await superagent.get("/hello")
} catch (err) {
  // 전용 오류 객체를 제공한다.
  console.log(err)
}
```

- status: 상태코드
- response: 응답 객체

Error 클래스를 확장한 오류 객체다. status 필드로 http 상태 코드를 조회할 수 있다. 4xx, 5xx 상태코드를 식별해서 오류를 처리하면 되겠다.

실패할 때도 response 객체를 얻는다. 서버에서 상태 코드와 함께 오류 데이터를 응답 본문으로 전달하기 때문이다. 이 객체의 text 혹은 body 필드에 접근해 오류 상세 정보를 얻어낼 수 있다.

나름의 요청, 응답, 오류 인터페이스를 정의하고 이에 맞게 xhr을 래핑한 http 클라이언트 라이브러리다.

## 확장

요청이나 응답을 가로채 그 사이에 커스텀 로직을 넣을 필요가 있다. 이 때 사용할 수 있는 게 플러그인이다.

"superagent-" 로 시작하는 패키키지들이다. 가령 superagent-prefix는 요청 경로의 앞자리를 지정하는 플러그인이다.

```js
superagent
  // 프러그인을 추가한다.
  .use(superagentPrefix("api"))
  // GET /api/hello 요청을 만들 것이다.
  .get("/hello")
```

전체 목록은 [여기](https://github.com/ladjs/superagent#plugins)를 참고하라.

커스텀 플러그인을 만들 수 있게 열어 두었다. 인터페이스는 단순하다.

```js
const attachCustomeHeader = => (request) => {
  request.header['X-Foo'] = 'foo';
  return request;
}
```

요청 객체를 인자로 받고 이를 반환하는 함수다. attachCustomeHeader는 요청 객체의 header 필드에 커스텀 헤더를 덧붙이는 역할이다.

use 함수로 추가한다.

```js
// 커스텀 헤더를 추가한 요청을 만들 것이다.
const response = await superagent
  .get("/hello")
  // 플러그인을 추가한다.
  .use(interceptRequest)
```

커스텀 헤더를 실고 GET /hello 요청을 만들 것이다.

# Axios

그 다음 사용한 것이 axios다. 새로운 프로젝트에서 누군가 이걸 들고 왔던 것 같다. 회사에서 점점 많이 쓰는 추세였다.

2014년에 0.1.0 버전을 시작으로 지금은 1.6.3까지 출시했다. "Promise based XHR library" 프라미스 기반인 것을 강조했던 게 기억난다. 지금은 대부분의 라이브러리가 이런 스타일이다. 노드 환경에서도 사용할 수 있고 33KB 용량이다.

이름이 좀 특이해서 찾아봤는데 그리스 신화의 강의 신 이름과 같다. http 위에서 흐르는 데이터를 강으로 보는 봤던 것일까?

## 인터페이스

마찬가지로 http 메소드 별로 전용 함수를 제공한다.

```js
// 요청을 위한 전용 메소드를 제공한다.
const response = await axios.get("/hello")
// 전용 응답 객체를 제공한다.
console.log(response)
```

함수를 호출하면 응답 객체로 이행하는 프라미스를 반환한다. 응답 객체는 사용하기 편하게 상태코드와 헤더 본문을 담는다.

- status: 상태 코드
- headers: 응답 헤더
- data: 응답 본문

전체 모습은 [여기](https://github.com/axios/axios#response-schema)를 확인하라.

실패하면 오류 객체를 던진다.

```js
try {
  const response = await axios.get('/hello')
} catch (err) {
  // 전용 오류 객체 AxiosError 를 제공한다.
  console.log(err)
```

- message: 오류 메세지
- code: 오류 코드
- response: 응답 객체

AxiosError의 message와 code에 라이브러리가 정의한 오류 메세지와 코드를 넣어 준다. 실패할 때도 response 객체를 얻는데 여기서 상태 코드, 헤더, 본문에 접근할 수 있다.

전체 인터페이스는 [여기](https://github.com/axios/axios/blob/6d4c421ee157d93b47f3f9082a7044b1da221461/index.d.ts#L399)를 확인하라.

모양은 조금 다르지만 axios만의 요청, 응답, 오류 인터페이스를 정의하고 xhr를 래핑해서 사용한다는 점이 이전 라이브러리와 비슷하다.

## 확장

요청과 응답 사이에 커스텀 로직을 넣을 용도로 인터셉터(interceptor)를 제공한다.

- axios.interceptors.request: 요청 전에 참여
- axios.interceptors.response: 응답 후에 참여

각각 요청 전, 응답 후에 커스텀 로직을 넣을 수 있는 인터셉터 객체 배열이다.

```js
// 커스텀 헤더를 넣는 인터셉터
function customeHeaderInterceptor(config) {
  config.headers["X-Foo"] = "foo"
  return config
}

// 요청 인터셉터를 추가한다.
axios.interceptors.reqeust.use(customeHeaderInterceptor)

// 커스텀 헤더를 실고 GET /hello 요청을 보낼 것이다.
axios.get("/hello")
```

인터셉터는 config 객체를 인자를 받고 이를 반환하는 형태다. 이 객체를 통해 커스텀 헤더를 지정해 반환했다. use 메소드로 인터셉터를 추가하면 요청을 만들 때 커스텀 헤더가 실릴 것이다.

# Ky

2015년부터 주요 브라우져에서는 fetch를 제공한다. 여전히 xhr 기반의 라이브러리를 사용하고 있지만 fetch 기반의 라이브러리도 좀 찾아 봤다. ky가 인기가 많았다.

2018년에 0.1.0 버전을 시작으로 지금은 1.1.3까지 출시했다. fetch 를 간편하게 사용할수 있게 래핑한 라이브러리다. 노드는 18버전(fetch 지원) 이상에서 사용할 수 있고 0.9KB로 비교적 작은 용량이다. 타입스크립트로 작성되었다.

이름은 그냥 랜덤으로 만들었다고 한다([What dos ky mean?](https://github.com/sindresorhus/ky/#what-does-ky-mean)). 충분히 이해한다.

## 인터페이스

Http 메소드별로 전용 함수를 제공한다.

```js
// 요청을 위한 전용 메소드를 제공한다.
const response = ky.get("/hello")
// 전용 응답 객체 KyResponse 를 제공한다.
console.log(response)
```

응답 객체는 fetch의 Response를 확장한 KyResponse 타입을 정의했다. fetch의 Response는 본문을 얻기 위해 text(), json() 같은 본문 조회용 메서드를 호출해서 프라미스가 이행되어야 데이터를 얻을 수 있다.

ky.get()는 프라미스가 아니라 곧장 KyResponse 객체를 반환한다. 이 객체는 본문 타입에 따른 본문 조회용 메서드를 제공하는데 text, json, blob 처럼 Response 의 것과 이름이 같다. 이 녀석들이 데이터로 이행되는 프라미스를 반환한다.

fetch는 프라미스 두 개를 사용하지만 ky는 하나만 사용할 수 있도록 간편화한 것이다.

```js
const response = await ky.get("/hello").text()
console.log(response)
```

ky.get() 함수가 반환한 KyResponse 객체의 text() 함수를 호출했다. 곧장 응답 본문으로 이행되는 프라미스를 반환한다.

오류는 try/catch 문으로 잡는다.

```js
try {
  const response = await ky.get("/hello").text()
} catch (err) {
  // 오류 전용 객체 HTTPError 를 제공한다.
  console.log(err)
}
```

Error 클래스를 확장한 HTTPError 클래스를 정의한다. 오류가 발생하면 이 클래스로 오류 객체를 만드는 방식이다.

- message: 상태 코드와 메세지
- name: "HTTPError"
- response: 응답 객체

message 필드에 디버깅을 위한 오류 메세지를 확인할 수 있다.

실패할 때도 response 객체를 얻는다. status로 상태 코드를 확인하고 본문 조회 메서드로 오류 내용을 조회할 수 있다.

요청, 응답, 오류 인터페이스를 정의하고 fecth를 래핑한 라이브러리다.

## 확장

요청과 응답을 가로챌수 있는 훅을 제공한다.

```js
// 커스텀 헤더를 넣는 훅
function attachCustomeHeaders(request) {
  request.header.set('X-Foo', 'foo')
}

ky.get('/hello', {
  // 훅을 추가한다.
  hooks: {
    beforeReqeust: [ attachCustomeHeaders ],
  }
}
```

요청 객체를 인자로 받는 함수다. 이 객체를 이용해 커스텀 헤더를 추가했다. 요청 메소드의 두 번째 인자의 hooks 필드에 추가한다. 커스텀 헤더를 실고 GET /hello 요청을 보낼 것이다.

다양한 시점의 훅을 추가할 수 있다.

- beforeRequest: 요청 전
- afterResponse: 응답 후
- beforeRetry: 재시도 전
- beforeError: 실패 전

# Wretch

fetch를 래핑한 라이브러리를 하나만 알기엔 아쉬워 더 찾은게 wretch다. "Wrapping Fetch".

2017년에 0.1.0 버전을 시작으로 지금은 2.8.0까지 출시했다. 노드 18 버전부터 사용할수 있고 2.8KB 용량이다. 타입스크립트로 만들었다.

## 인터페이스

http 메소드별로 전용 함수를 제공한다.

```js
// 요청을 위한 전용 메소드를 제공한다.
const response = wretch().get("/hello")
// 전용 응답 객체 WretchResponseChain을 제공한다.console.log(response)
```

전용 요청 객체 WretchResponseChain을 사용한다. 본문을 얻기 위해 text, json, blob 같은 함수를 제공하는데 ky처럼 함수 체이닝으로 사용하라는 것 같다.

```js
const response = await wretch().get("/hello").text()
console.log(response)
```

get() 함수가 반환한 WretchResponseChain 객체의 text() 함수를 호출했다. 곧장 응답 본문으로 이행되는 프라미스를 반환한다.

오류는 try/cacht문으로 잡는다.

```js
try {
  const response = await wretch().get('/hello').text()
} catch (err) {
  // 오류 전용 객체 WretchError를 제공한다.
  console.log(err)
```

Error 클래스를 확장한 WrechError 클래스의 객체다.

- status: 상태 코드
- response: 응답 객체
- text, json: 오류 데이터

text나 json에 응답 본문 데이터를 미리 담아 주는 게 특징이다.

wretch는 4xx, 5xx 오류를 처리하는 별도 함수를 체이닝으로 제공한다.

```js
wretch()
  .get("/hello") // 오류 전용 캐처. 404 오류를 처리하는 함수를 등록할 수 있다.
  .notFound(err => err.text)
  .text()
```

자주 사용하는 http 오류 코드를 처리할 수 있는 오류 캐처(catcher)를 제공한다. notFound() 함수로 404 오류 처리기를 설정했다. 오류 메세지 err.text를 반환하는 로직이다. 이 요청은 404 응답을 받더라도 예외를 던지지 않고 이 메세지를 응답할 것이다.

상태 코드별로 제공하는 전체 캐처는 [이곳](https://github.com/elbywan/wretch/tree/master#catchers-)을 참고하라.

## 확장

요청과 응답 사이에 커스텀 로직을 넣을수 있게 미들웨어를 제공한다.

가령 retry는 요청실패 시 재시도하는 미들웨어다.

```js
wretch().middlewares([retry()])
```

전체 미들웨어는 [여기](https://github.com/elbywan/wretch#middlewares)를 참고하라.

커스텀 미들웨어를 만들 수 있도록 인터페이스를 열어두었다.

```js
function attachCustomeHeader(next) {
  return (url, options) => {
    options.headers = { "X-Foo": "foo" }
    return next(url, options)
  }
}
```

다음 미들웨어를 실행하는 next 인자를 받는 함수다. 이 함수는 url과 options 요청인자를 받는 함수를 반환한다. 여기서 요청과 응답에 관여할 수 있다. 커스텀 헤더를 추가해 다음 미들웨어를 호출하는 함수다.

middlewares() 함수로 미들웨어를 추가한다.

```js
wretch()
  // 미들웨어를 추가한다
  .middlewares([attachCustomeHeader])
  .get("/hello")
  .text()
```

커스텀 헤더를 실고 GET /hello 요청을 보낼 것이다.

애드온이란 개념도 있다. 미들웨어가 요청, 응답 사이의 로직을 담당하는 역할이라면 애드온은 라이브러리 기능을 확장하는 역할이다. 예들들어 다운로드 진행율, 요청 취소 같은 기능이다.

```js
wretch()
  // 다운로드 진행율 애드온을 추가한다.
  .addon(ProgressAddon())
  .get("/hello")
  // 진행율을 표시한다.
  .progress((loaded, total) =>
    console.log(`${((loaded / total) * 100).toFixed(0)}%`)
  )
```

addon 함수로 필요한 애드온을 추가하면 이 라이브러리는 progress 함수를 체이닝 중에 사용할수 있다. 다운로드 진행율을 표시했다.

필수 기능만 코어 로직으로 담고 부가적인 기능을 애드온으로 빼논 셈이다.

전체 목록은 [여기](https://github.com/elbywan/wretch/tree/master#addons)를 참고하라.

# 결론

네 가지 라이브러리를 비교해 봤다.

신기하게도 비슷한 점이 많았다.

- get, post, put, delete 처럼 요청을 위한 전용 메소드를 제공한다.

- 이 메소드는 프라미스를 반환하는데 각자가 정의한 응답 객체 모양으로 값을 반환한다. 여기에는 상태코드, 헤더, 본문이 담겨 있다. 각 라이브러리의 형식을 파악하고 이에 맞게 활용하면 된다.

- 오류 응답을 받으면 각자 정의한대로 오류 객체를 던진다. try/catch 문으로 잡아서 처리하면 되겠다.

- 확장하는 구조와 이름이 다를뿐 역할은 비슷하다. 인터셉터, 플러그인, 훅, 미들웨어.

라이브러리만의 독자적인 특징도 있었다.

- superagent는 가장 오래된 라이브러리로 크로스브라우징을 지원하는게 장점이었다.

- 하지만 이것도 옛말이라 이후에 나온 라이브러리인 axios를 많이 사용한다. axios는 프라미스 기반의 xhr이란 점을 강조한다.

- fetch 표준이 나오고 각 브라우져에서 지원하면서 이를 기반으로한 라이브러리도 나왔다. 그중 ky는 간편하게 사용할 수 있다는 것을 내세운다. 두 개 프라미스를 사용해야하는 기본 함수에 비해 ky는 하나의 프라미스만으로 요청을 보내고 받을 수 있다.

- 비슷한게 wretch다. 이것도 간편하게 사용할수 있다. 뿐만 아니라 오류 전용 캐처 함수를 제공하는 편의를 제공한다. 특이한 것은 핵심 코드만 남기고 부가적인 코드는 애드온이라는 것으로 분리해 놓았다. 아마도 번들러의 트리쉐이킹을 의도해 번들 사이즈를 더 줄일수 있는게 아닌가 싶다.

당장 라이브러리를 바꿀 필요는 없다고 생각한다. 이미 잘 동작하고 있고 크로스브라우징도 지원하는 이런 라이브러리를 바꿔서 얻을 이익이 무엇일지 면밀히 검토해야 할 것이다.

xhr에 비해 fetch만의 기능은 다음과 같다. 캐시 제어, 리다이렉트 제어, 서비스 워커 지원. 제품을 만들 때 이러한 기능이 필요하다면 fetch 기반의 라이브러리를 사용해 보는 것이 좋겠다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.com/tree/master/content/codes/2024/js-http-clients)
- [superagent](https://github.com/ladjs/superagent)
- [axios](https://github.com/axios/axios)
- [ky](https://github.com/sindresorhus/ky)
- [wretch](https://github.com/elbywan/wretch)
