---
slug: "/2024/02/08/http-caching"
date: 2024-02-08
title: "HTTP 캐싱"
layout: post
tags: [http]
---

# 서론

캐시는 데이터를 미리 복사해 놓은 저장소다. 반복 작업을 줄이고 어플리케이션 성능을 높이는 역할이다.

멀리 떨어진 자원을 클라이언트로 얼마나 빨리 가져오느냐가 웹 어플리케이션 성능을 좌우한다. 한 번 다운로드한 파일을 브라우저 캐시에 저장하면 성능을 눈에 띄게 높일 수 있다. 이러한 기법을 [HTTP 캐싱](https://developer.mozilla.org/ko/docs/Web/HTTP/Caching)이라고 한다.

캐싱 매커니즘은 브라우져와 서버가 서로 협력해 움직인다. 자원을 소유한 서버는 캐싱 정책을 정하고 브라우져는 이에 따라 동작하는 방식이다. 둘은 HTTP 헤더를 이용한 메세지를 주고 받는다.

HTTP 캐싱에 대해 알아보자.

# 시간 기반

두 가지 방식이다.

- 시간 기반
- 내용 기반

서버는 파일을 제공할 때 클라이언트가 가진 파일이 신선한지(fresh) 부패했는지를(stale) 판단한다. 기준은 시간과 내용이다.

서버가 클라이언트로 응답할 때 파일 수정일을 표시하는 것부터 시작한다.

```js{12,13,25,26}
// 요청한 파일
const filePath = "./index.html"

// 파일의 정보를 읽는다.
fs.stat(filePath, (err, stat) => {
  if (err) {
    res.writeHead(500);
    res.end()
    return
  }

  // 파일 수정 시간을 얻는다.
  const modified = state.mtime;

  // 파일 내용을 읽는다.
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end();
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html",
      // 마지막 수정일을 헤더에 실는다.
      "Last-Modified": modified.toUTCString();
    })
    res.end(content)
  })
})
```

브라우저에서 GET / 을 요청하면 서버는 이 파일을 읽어 본문에 내용을 실는다. 더불어 Last-Modified 헤더에 파일 수정 시간도 실어 응답한다. HTTP/1.0에서 정의된 헤더다.

```
< Last-Modified: Sun, 28 Jan 2024 09:00:00 GMT // 수정일입니다.
```

응답 받은 브라우져는 캐싱을 시작한다. Last-Modified 헤더를 확인했기 때문이다. 이 파일의 메소드, URL 그리고 수정일을 기억한다. 이후 같은 URL을 요청할 때 헤더에 수정일을 함께 실는다.

```
> If-Modifed-Since: Sun, 28 Jan 2024 09:00:00 GMT // 이 날짜 이후로 바뀐게 있나요?
```

If-Modified-Since 헤더에 브라우져가 기억하고 있는 파일의 수정일을 전달한다. 서버에게 '이 시점 이후로 바뀐 게 있나요?'라고 묻는다.

서버는 두 가지 행동 중 하나를 선택한다.

- 파일이 바뀌었으면: 변경된 파일을 응답한다.
- 파일이 바뀌지 않으면: 변경되지 않았다고 말한다.

```js{1-4,6-10,14,15}
// 시간 기반 캐싱: If-Modified-Since 헤더가 있는 경우
if (req.headers["if-modified-since]) {
  // 요청 헤더에서 수정일을 조회한다.
  const modifiedSince = new Date(req.headers["if-modified-since"])

  // 파일 수정일과 비교한다.
  const isFresh = !(
    Math.floor(modifiedSince.getTime() / 1000) <
    Math.floor(modified.getTime() / 1000)
  )

  // 수정일이 같을 경우
  if (isFresh) {
    // 자원이 바뀌지 않음(Not Modified)헤더를 실는다
    res.writeHead(304);
    res.end()
    return;
  }
}

// 수정일이 다를 경우: 변경된 파일을 응답한다.
```

서버는 요청 헤더를 보고 파일의 수정일과 비교한다. 요청한 파일 수정일이 서버 파일의 수정일과 같다면 변경되지 않았다고 판단한다. 파일을 다시 제공할 필요가 없다. 응답 헤더에 304 Not Modified 상태코드를 실는다. 본문은 비워 작고 빠르게 응답한다.

```
< 304: 변경되지 않았습니다.
```

브라우져는 캐시가 신선하다는 답변을 받았다. 캐시에 저장한 파일을 사용할 것이다.

한 편 수정일이 갱신되었다면 서버는 파일이 변경되었다고 판단하고 200 OK 상태코드를 실는다. 새로운 파일 내용을 본문에 실어 응답할 것이다. 캐시를 위해 갱신된 Last-Modified 헤더도 같이 실는다.

```
< 200: 네(OK). 다른 버전이 있습니다, 이걸 쓰세요.
```

브라우져는 캐시에 저장된 파일이 오래된것으로 판단한다. 파일 본문과 Last-Modified를 새로 받은 값으로 교체한다.

이러한 일련의 순서로 브라우져와 서버는 시간 기반 캐싱 시스템을 움직이다.

# 내용 기반

시간 기반의 캐시는 한계가 있다.

- 파일을 에디터로 저장만하면 수정일은 바뀐다. 수정일은 다르지만 캐시를 사용할 수 있는 경우다. 내용은 바뀌지 않았기 때문이다.

- Last-Modified는 1초 미만을 같은 값으로 판단한다. 내용이 다르지만 캐싱하는 경우다. 1초 내에 변경한 파일의 Last-Modified가 같기 때문이다.

파일 자체를 비교하는 방법을 ETag라고 한다. Entity Tag의 약자다. 파일 내용의 해시 값, 수정일의 해시 값, 혹은 버전으로 태그를 만들어 식별하는 방식이다. HTTP/1.1에서 정의한 헤더다.

서버가 etag 값을 계산해 응답 헤더에 실는 것 부터 시작한다.

```js{12,13,25,26}
// 요청한 파일
const filePath = "./index.html"

// 파일 정보를 읽는다
fs.state(filePath, (err, stat) => {
  if (err) {
    res.writeHead(500)
    res.end()
    return
  }

  // 파일 수정 시간과 크기로 etag 값을 만든다.
  const etag = `${state.mtime.toString(16)}-${stat.size.toString(16)}`

  // 파일 내용을 읽는다.
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end()
      return
    }

    res.writeHead(200, {
      "Content-Type": "text/html",
      // ETag를 헤더에 실는다.
      ETag: etag,
    })
    res.end(content)
  })
})
```

브라우저에서 GET / 을 요청하면 서버는 index.html 파일의 수정일과 길이를 기반으로 해시 값을 만든다. 응답을 만들 때 헤더의 Etag에 이 값을 함께 실을 것이다.

```
< Etag: 18d42f59d54-12f // 이 파일의 etag 입니다.
```

Etag 응답을 확인한 브라우져는 캐싱을 시작한다. URL과 etag를 기억하고 있다가 이후에 요청에 etag를 함께 전달한다.

```
> If-None-Match: 18d42f59d54-12f // 이 파일의 etag와 일치하는 것이 없나요?
```

If-None-Match 헤더에 브라우져가 기억하고 있는 지원의 etag를 전달한다.'이 파일의 etag와 일치하는 것이 없나요?'라고 서버에게 묻는다.

서버는 두 가지 행동 중 하나를 선택한다.

- etag가 다르면: 새로운 파일을 응답한다.
- etag가 같으면: 같다고 말한다.

```js{1-4,6,7,11,12}
// 내용 기반 캐시 : If-None-Match 헤더가 있는 경우
if (req.headers["if-none-match]) {
  // 요청 헤더에서 태그를 조회한다.
  const noneMatch = req.headers["if-none-match"];

  // 파일의 etag 값과 비교한다.
  const isFresh = noneMatch === etag

  // etag 값이 같으면
  if (isFresh) {
    // 바뀌지 않음(Not Modified)헤더를 실는다
    res.writeHead(304);
    res.end()
    return;
  }
}

// 시간 기반 캐시: If-Modified-Since 헤더가 있는 겨우
// ...

// etag 값이 다르면: 변경된 파일을 응답한다.
```

서버는 요청 헤더를 보고 파일의 etag 값과 비교한다. 같다면 파일이 바뀌지 않았다고 판단한다. 응답 헤더에 304 Not Modified 상태코드만 실는다.

```
< 304: 변경되지 않았습니다.
```

브라우져는 캐시가 유효하다고 판단해 이 파일을 사용할 것이다.

etag가 다르면 파일 내용이 바뀌었다고 판단해 200 OK 상태코드를 실는다. 본문에 새로운 파일 내용을 실어 브라우져에 응답할 것이다. 물론 캐싱를 위해 갱신된 ETag 헤더도 같이 실는다.

```
< 200: 네(OK). 다른버전이 있습니다. 이걸 쓰세요.
```

브라우져는 새로운 ETag 값을 받았다. 캐시의 파일이 되었기 때문에 새로 받은 파일과 etag로 교체할 것이다.

# 캐시 제어

캐싱 프로세스는 브라우져가 서버에 접속해 캐시 헤더를 받은 다음 동작한다. 서버에 접속하지 않고 캐싱한 파일만 사용한다면 성능을 극대화할 수 있을 것이다. 그만큼 네트웍 비용을 줄일 수 있기 때문이다.

Cache-Control은 더 구체적으로 캐싱 정책을 표현할 수 있는 HTTP 헤더다. HTTP/1.1에 정의되었다. 이 헤더를 사용해 응답하면 브라우져의 캐싱 프로세스를 더 세밀하게 제어할 수 있다.

Cache-Control에 사용할 수 있는 주요 값이다.

- max-age
- no-store
- no-cache

브라우져가 자원을 일정기간 캐싱하고 서버에 접속하지 않게 하려면 서버는 'max-age=초' 형식의 값을 전달한다.

```
< Cache-Control: max-age=5 // 5초간 사용할 수 있습니다.
```

서버가 어떤 파일에 대해 Cache-Control: max-age=5 로 응답하면 브라우져는 5초간 이 파일을 캐싱한다. 5초 안에 다시 사용할 경우 서버에 접속하지 않고 캐시에 저장된 파일을 사용한다.

Cache-Control: max-age=0은 유효기간이 없다는 의미다. 브라우져는 매번 서버에 접속해야 한다. 같은 의미로 no-cache 값을 사용한다.

```
< Cache-Control: no-cache // 캐시가 유요한지 매번 물어보세요.
```

브라우져는 파일을 캐시에 저장했지만 캐시가 신선한지는 매번 서버에 접속해 확인해야 한다. 서버는 요청 헤더에 전달된 If-None-Macth나 If-Since-Modified 헤더값으로 자원의 신선도를 판단한다. 앞서 본 etag와 파일 수정일이다.

아예 캐시에 저장하지 않게 지정할 수도 있다.

```
< Cache-Control: no-store // 캐싱하지 마세요.
```

no-store는 이 자원을 캐싱하지 말라는 의미의 값이다. 브라우져는 해당 파일은 캐싱하면 안된다고 기억한다. 다음에 요청하면 캐시 관련 헤더를 아예 보내지 않을 것이다.

캐시 컨트롤의 전체 값은 [여기](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control)를 확인하라.

# 기타

## Expires

서버가 파일의 만료일을 지정하기 위한 헤더다. HTTP/1.0에서 정의한다.

```
< Expires: Tue, 31 Dec 2024 15:00:00 GMT // 이 날짜까지 사용할 수 있습니다.
```

서버가 파일 유효기간을 정하고 Expries 헤더에 이 값을 전달한다. 브라우져는 다음 요청부터는 서버에 접속하지 않고 캐시에 저장된 파일을 사용할 것이다.

시간 캐시 헤더 두 개와 비교하면 이렇다.

- Last-Modified는 매번 서버에 접속해 캐시 신선도를 검증하지만 Expires는 서버에 접속하지 않고 캐싱한다.

- Cache-Control: max-age=초 와 같은 방식으로 동작한다. Expires는 만료 날짜를 지정하고 Cache-Control은 초 단위 값을 사용한다.

## Vary

Vary는 서버가 클라이언트에게 캐시 키를 전달하기 위한 헤더다.

같은 요청이라도 요청한 accept-language에 따라 서버는 해당하는 언어의 컨텐츠를 제공할 수 있다. ko는 한글 문서, en는 영어 문서. 이를 [컨텐츠 협상(Content Negotiation)](https://developer.mozilla.org/ko/docs/Web/HTTP/Content_negotiation)이라고 한다.

다음 예시를 보자.

- 브라우져가 한글 문서로 자원을 요청하고 캐시에 저장한다. (브라우저 언어가 한글인 경우)
- 브라우저가 영문 문서로 자원을 다시 요청한다. (브라우저 언어가 영어인 경우)
- 브라우져는 캐시 저장소에 있는 한글 문서를 사용한다.

영문으로 보여야할 파일 내용이 한글로 보이는 게 문제다. 브라우져가 캐시를 구성할 때 언어 설정값 accept-language를 키로 사용한다면 해결할 수 있을 것이다. 이 때 사용하는 것이 바로 Vary 헤더다.

```
< Vary: accept-language // accept-language 별로 캐시를 구성하세요.
```

브라우져는 캐시를 구성할 때 accept-language도 캐시 키로 사용할 것이다.

캐시 구성

- URL, en, 영문 파일
- URL, ko, 한글 파일

Vary에는 accept-language 뿐만 아니라 accept-language, user-agent 등 컨텐츠 협상하는 기준에 따라 값을 전달할 수 있다. 브라우져는 이 값을 기준으로 캐시 저장소를 구성할 것이다.

## meta 태그

HTML 문서에 meta 태그로 캐시 설정한 경우를 본적이 있다.

```html
<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
```

응답 헤더에서 설정한 값과 비슷해서 무척 헷갈렸던 부분이다.

이러한 방식은 좋지 않다(참고: [Is there a <meta> tag to turn off caching in all browsers | 스택오버플로우](https://stackoverflow.com/questions/1341089/is-there-a-meta-tag-to-turn-off-caching-in-all-browsers)). 중복된 http-equiv 설정 값에 의해 이전에 정의한 코드는 무시될 수 있기 때문이다. 브라우져나 웹서버 사이의 프록시 서버의 캐싱 동작도 보장할 수 없다고 한다.

항상 HTTP 응답 헤더의 값을 사용해 캐싱 정책을 전달하는 게 좋다.

# 활용

## HTML이 아닌 파일

캐싱을 최대한 활용해 웹 어플리케이션의 성능을 올리는 방법은 찾아봤다. 캐싱 성능이 좋다는 것은 네트웍 요청을 하지 않는다는 것이다.

캐시에 다운로드한 자원을 사용하도록 Cache-Control의 max-age 값을 최대로 설정하면 되겠다. 바뀌지 않을 파일이라도 최대 1년의 캐시를 권장한다고 한다. (참고: [RFC 2068](https://datatracker.ietf.org/doc/html/rfc2068))

> To mark a response as "never expires," an origin server should use an Expires date approximately one year from the time the response is sent. HTTP/1.1 servers should not send Expires dates more than one year in the future.

corejs나 react도 이 정도 기간을 설정한다.

- [corejs](https://cdnjs.cloudflare.com/ajax/libs/core-js/3.35.1/minified.js): Cache-Control: max-age=30672000 // 355일
- [react](https://unpkg.com/react@18.2.0/umd/react.production.min.js): Cache-Control: max-age=31536000 // 365일

Cache-Control 헤더에 max-age=31536000 를 실어 클라이언트가 1년간 캐시해 네트웍 요청을 하지 않도록 응답했다.

```js
res.setHeader("Cache-Control", "max-age=31536000")
```

한편 배포할 때 만큼은 브라우져의 캐시를 사용하면 안된다. 배포한 파일을 브라우져가 다운로해야 한다.

1년간 캐시 자원을 사용할 브라우져가 배포할 때만큼은 서버에 접속하게 하는 방법은 뭘까? 바로 캐시 키인 URL를 바꾸는 것이다. 브라우져는 다른 URL을 요청하기 때문에 캐시를 사용하지 않고 서버에 접속할 것이다.

웹팩은 번들링한 뒤 파일을 만들어 내는데 이 파일명을 동적으로 만드는 옵션이 있다([output](https://webpack.js.org/configuration/output/#outputfilename)). 파일 경로에 빌드시 생성되는 해시 값을 사용한다.

- [hash]: 번들 해시. 번들링 할 때 마다 바뀐다.
- [contentHash]: 파일 내용 해시. 파일 내용이 다르면 바뀐다.

이 문자를 사용해 파일명을 지정하면 동적으로 파일 이름을 만들어 낼 수 있겠다.

```js
module.exports = {
  output: {
    filename: "[name][contenthash].[ext]",
  },
}
```

번들링한 파일을 웹서버에 배포하면 브라우져는 기존에 저장된 캐시를 사용하지 않는다. 새로운 URL로 요청할 것이다. 물론 이 파일은 다시 1년간 캐싱될 것이다.

## HTML 파일

이 방법을 적용할 수 없는 자원도 있다. 바로 HTML이다. 웹문서는 항상 index.html이나 post.html 이어야한다. 배포할 때마다 파일 이름이 바뀌면 곤란하다.

캐시 시간을 짧게 하거나 매번 캐시 신선도를 확인하기 위해 서버에 접속하는 방법을 사용한다고 한다.

```js{2}
if (isHtml) {
  res.setHeaders("Cache-Control", "no-cache")
} else {
  res.setHeaders("Cache-Control", "max-age=31536000")
}
```

서버는 HTML 파일 요청에 응답할 때 헤더에 no-cache 설정을 실을 것이다.

# 결론

브라우져와 서버가 캐싱 매커니즘을 위해 사용한 HTTP 헤더는 다음과 같다.

- Last-Modified (HTTP/1.0)
- If-Modified-Since (HTTP/1.0)
- ETag (HTTP/1.1)
- If-None-Match (HTTP/1.1)
- Cache-Control (HTTP/1.1)
- Expires (HTTP/1.0)
- Vary (?)

요청과 관련있는 응답 헤더를 같이 기억하면 좋겠다.

HTTP 캐싱 매커니즘을 다시 정리해 보자.

- 캐시된 자원이 없을 경우: 서버로 요청을 보낸다. 응답 헤더에 캐시 관련 헤더인 Cache-Contorl, ETag, Last-Modified 가 있다면 이를 URL과 함께 저장한다.

- 캐시된 자원이 있을 경우: Cache-Control을 확인한다.

  - no-store: 캐시를 사용하지 않기 때문에 항상 서버로 요청할 것이다. 이전에 no-store를 응답 받았다면 캐싱 자체를 하지 않았기 때문에 Cache-Control 헤더도 없었을 것이다.

  - no-cache: 서버에 캐시 유효성을 검사한다.

    - 이전에 받은 헤더 중 ETag가 있다면 이 값을 If-None-Match 헤더에 실는다.
    - Last-Modified 헤더가 있다면 이 값을 If-Modified-Since 헤더에 실는다.
    - 서버는 이 두 값을 우선 순위에 따라 현재 자원과 비교해 응답할 것이다.
      - 304를 응답하면 캐시가 유효한 것이고
      - 200을 응답하면 캐시가 실효한 것이다. 새로운 응답으로 캐시 데이터를 갱신한다.

  - max-age: 유효기간에 따라
    - 경과하지 않으면: 캐시가 유효한 것이다. 캐싱 데이터를 응답으로 사용하고 서버로 접속하지 않는다.
    - 시간이 경과했다면: 캐시가 실효된 것으로 판단하고 다시 서버로 요청을 보낸다.

--

캐시를 설정할 때는 신중해야한다. 반드시 갱신해야할 자원인데 브라우저가 캐싱해 버리면 난감하기 때문이다. 브라우져에서 의도적으로 캐시를 비우지 않는한 네트웍 요청을 하지 않을 것이다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.io-examples/tree/main/2024-02-08-http-cache)
- HTTP 완벽가이드 > 7장 캐시
- 리얼월드 HTTP > 2.8 캐시
- [HTTP 캐싱 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Caching#유효성freshness)
- [캐시로 불필요한 네트워크 요청 방지 | web.dev](https://web.dev/articles/http-cache?hl=ko#examples)
- [HTTP 캐시로 불필요한 네트워크 요청 방지 | web.dev](https://web.dev/articles/http-cache?hl=ko)
- [HTTP 캐싱 동작 구성 | web.dev](https://web.dev/articles/codelab-http-cache?hl=ko)
