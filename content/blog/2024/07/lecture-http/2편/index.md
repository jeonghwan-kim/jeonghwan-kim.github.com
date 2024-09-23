---
slug: "/2024/07/08/lecture-http-part2"
date: 2024-07-08 00:01:00
title: "[HTTP] 2편. 브라우져"
layout: post
series: "HTTP"
---

# 소개

- 웹 브라우져가 HTTP를 어떻게 사용하는지 이해할수 있습니다.
- **3장. 컨텐츠 협상**: 웹브라우져가 서버와 데이터를 주고 받을 때 최적의 형태로 만들기 위한 매커니즘을 이해하실 수 있습니다.
- **4장. 쿠키**: 서버가 웹 브라우져를 식별하기 위한 방법인 쿠키에 대해 배우실 수 있습니다.
- **5장. 네트워크 요청**: 웹 브라우저에서 발생할 수 있는 HTTP 요청의 종류에 대해 알 수 있습니다.

# 3장. 컨텐츠 협상

- 서버는 다양한 클라이언트에 적합한 자원을 제공해야합니다.
- 컨텐츠 협상에 사용되는 HTTP 헤더와 동작 방식을 공부합니다.

## 3.1 컨텐츠 타입

- Accept 요청 헤더, Content-Type 응답 헤더

```
> Accpet: text/html
< Content-Type: text/html
```

- 사례) 깃헙 사례
- 라이브러리) [express.js의 res.format](https://github.com/expressjs/express/blob/master/lib/response.js#L562)

## 3.2 압축

- Accept-Encoding 요청 헤더, Content-Encoding 응답 헤더

```
> Accept-Encoding: gzip
< Content-Encoding: gzip
```

- 사례) 깃헙
- 라이브러리) [compression](https://github.com/expressjs/compression#readme)

## 3.3 언어

- Accept-Language 요청 헤더

```
> Accept-Language: ko
```

- 사례) 유투브
- 라이브러리) [express.js req.acceptLanuages()](https://expressjs.com/en/5x/api.html#req.acceptsLanguages), [accepts](https://github.com/jshttp/accepts/blob/master/index.js#L195), [negotiator](https://github.com/jshttp/negotiator/blob/master/index.js#L63)

## 3.4 사용자 에이전트

- User-Agent 요청 헤더

```
> User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15
```

- 사례) 구형 브라우져 감지
- 라이브러리) [express-useragent](https://github.com/biggora/express-useragent/blob/master/lib/express-useragent.js)

## 3.6 중간 정리

- 컨텐츠 협상은 HTTP 헤더를 기반으로 동작
- 경험했던 사례 소개

### 참고

- [컨텐츠 협상 | 김정환블로그](/2024/05/04/content-negotiation)
- [사용자 에이전트를 사용한 브라우저 감지 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Browser_detection_using_the_user_agent#mobile_device_detection)
- [expressjs/express | 깃헙](https://github.com/expressjs/express)
- [expressjs/compression | 깃헙](https://github.com/expressjs/compression)
- [jshttp/accepts | 깃헙](https://github.com/jshttp/accepts/)
- [jshttp/negotiator | 깃헙](https://github.com/jshttp/negotiator)
- [biggora/express-useagent | 깃헙](https://github.com/biggora/express-useragent/blob/master/lib/express-useragent.js)

# 4장. 쿠키

- 쿠키의 시초: 매직 쿠키. 쇼핑카트
- HTTP 관점으로 보아야 쿠키를 제대로 이해할 수 있습니다.

## 4.1 헤더

- 무상태 HTTP
- Set-Cookie 응답 헤더와 Cookie 요청 헤더

```
< Set-Cookie: sid=1
> Cookie: sid=1
```

- 클라이언트를 식별할 수 있는 서버 제작

## 4.2 범위

- Domain 쿠키 디렉티브

```
< Set-Cookie: sid=1; Domain=foo.com
```

- Path 쿠키 디렉티브

```
< Set-Cookie: sid=1; Path=/private
```

## 4.3 생명주기

- 세션 쿠키(Session Cookie)
- Max-Age와 Expries 쿠키 디렉티브

```
< Set-Cookie: sid=1; Max-Age=10
```

- 영속적인 쿠키(Permanent Cookie)

## 4.4 Secure

- 쿠키는 평문이라 유출될 수 있다.
- Secure 쿠키 디렉티브

```
< Set-Cookie: sid=1; Secure
```

## 4.5 HttpOnly

- 자바스크립트로 쿠키를 위조할 수 있다.
- HttpOnly 쿠키 디렉티브

```
< Set-Cookie: sid=1; httpOnly
```

## 4.6 쿠키 라이브러리(서버)

- 쿠키 데이터를 문자열로 변환하는 함수 : Express.js [res.cookie()](https://github.com/expressjs/express/blob/master/lib/response.js)
- 문자열을 쿠키 데이터로 변환하는 함수: [cookie-parser](https://github.com/expressjs/cookie-parser/tree/master)

## 4.7 쿠키 라이브러리(브라우져)

- 브라우져에서 쿠키를 제어하는 사례. '오늘 하루 다시 보지 않기'
- 쿠키 데이터를 변경/조회/삭제하는 라이브러리: [js-cookie](https://github.com/js-cookie/js-cookie/tree/main)

## 4.8 중간정리

- 상태가 없는 HTTP에 상태를 추가할 목적으로 쿠키를 사용합니다.
- 쿠키 유효범위를 지정하는 디렉티브: Domain, Path
- 쿠키 생명 주기를 지정하는 디렉티브: Max-Age, Expires
- 쿠키 생명 주기를 지정하는 디렉티브: Secure, HttpOnly
- 쿠키 라이브러리

### 참고

- [HTTP 쿠키 | 김정환블로그](/2024/03/04/http-cookie)
- [HTTP 쿠키 | 위키피디아](https://ko.wikipedia.org/wiki/HTTP_쿠키)
- [HTTP 쿠키 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)
- [쿠키와 document.cookie | JAVASCRIPT INFO](https://ko.javascript.info/cookie)
- 도서) HTTP 완벽가이드 > 11.6 쿠키
- 도서) 리얼월드 HTTP > 2.5 쿠키

# 5장. 네트워크 요청

- 브라우져에서 발생하는 HTTP 요청의 종류와 특징을 알아보겠습니다.

## 5.1 HTML 요청

- 사용자가 **URL**을 입력하면 HTTP 요청을 만든다.
- 브라우져에 따라 **파비콘**을 얻기 위해 HTTP 요청을 만든다.
- 사용자가 웹 문서의 **링크**를 클릭하면 HTTP 요청을 만든다.

## 5.2 HTML 외 요청

- **CSS 로딩 태그**를 만나면 HTTP 요청을 만든다.
- **글꼴 로딩 태그**를 만나면 HTTP 요청을 만든다.
- **JS 로딩 태그**를 만나면 HTTP 요청을 만든다.

## 5.3 img 요청

- **img 태그**를 만나면 HTTP 요청을 만든다.
- 광고 효과를 높이기 위한 도구로 활용한다.
- img 태그를 이용해 광고 픽셀을 만들어 데이터를 수집한다.

## 5.4 Form 요청

- **form 태그**는 사용자가 원하는 시점에 HTTP 요청을 만든다.
- GET 메소드 방식
- POST 메소드 방식
- application/x-www-form-urlencoded과 multipart/form-data

## 5.5 중간 정리

- 브라우져는 HTML을 얻기 위해 HTTP 요청을 만듭니다.
- 브라우져는 HTML 렌더링 과정에 필요한 HTTP 요청을 만듭니다.
- 브라우져는 img 태그를 만나면 HTTP 요청을 만듭니다.
- 브라우져는 form 태그를 만나면 HTTP 요청을 만듭니다.

### 참고

- [중요 렌더링 경로 | MDN](https://developer.mozilla.org/ko/docs/Web/Performance/Critical_rendering_path)
- [\<form\> | MDN](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form)
