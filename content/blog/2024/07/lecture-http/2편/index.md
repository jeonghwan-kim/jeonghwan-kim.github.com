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

- 자바스크립트를 통한 쿠키 위조. document.cookie
- **HttpOnly**: 자바스크립트가 쿠키에 접근하는 걸 차단. 오직 HTTP 네트워크 요청에만 쿠키 사용.
- `< Set-Cookie: sid=1; httpOnly // http 요청에만 쿠키를 사용하세요.`

## 4.6 서버 라이브러리

- Express.js [res.cookie()](https://github.com/expressjs/express/blob/master/lib/response.js#L884)

```js
// 이름, 값, 옵션을 전달하면 쿠키 문자열를 만들어 Set-Cookie 헤더에 실는다.
res.cookie = function (name, value, options) {
  // ...
  this.append('Set-Cookie', cookie.serialize(name, String(val), options)
  // ...
}
```

- [cookie-parser](https://github.com/expressjs/cookie-parser/tree/master)

```js
// 쿠키 파서 미들웨서 생성 함수
function cookieParser(secret, options) {
  // 쿠키 파서 미들웨어를 반환한다.
  return function coolieParser(req, res, next) {
    // 헤더에서 쿠키 문자열을 조회
    var cookies = req.headers.cookie
    // 문자열을 객체로 파싱
    req.coolies = cookie.parse(coolies, options)
    // 파싱한 객체를 JSON 값으로 변환
    //   'false' → false
    //   '1' → 1
    req.coolies = JSONCookies(req.cookies)
    next()
  }
}
```

- [cookie](https://github.com/jshttp/cookie/tree/master)

```js
it("문자를 객체로 변환한다.", function () {
  assert.deepEqual(cookie.parse("foo=bar"), { foo: "bar" })
})

it("값을 URL 디코딩한다.", function () {
  assert.deepEqual(cookie.parse("email=%20%22%2c%3b%2f"), { email: ' ",;/' })
})

it("값이 없는 쿠키를 제거한다.", function () {
  assert.deepEqual(cookie.parse("foo=bar;fizz  ;  buzz"), { foo: "bar" })
})

it("중복 쿠키를 제거한다", function () {
  assert.deepEqual(cookie.parse("foo=%1;bar=bar;foo=boo"), {
    foo: "%1",
    bar: "bar",
  })
})
```

## 4.7 브라우져 라이브러리

- 브라우져에서 쿠키를 제어한 사례. '오늘 하루 다시 보지 않기'

```js
// 이 브라우져 사용자가 오늘 하루 다시 보지 않기를 선택했다.
document.cookie = "checked=true; MaxAge=86400"
```

- [js-cookie](https://github.com/js-cookie/js-cookie/tree/main)

```js
function set(name, value, attributes) {
  // 만료일 설정
  if (typeof attributes.expires === "number") {
    attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
  }
  if (attributes.expires) {
    attributes.expires = attributes.expires.toUTCString()
  }

  // 옵션 객체를 문자열로 변환
  var stringifiedAttributes = ""
  for (var attributeName in attributes) {
    if (!attributes[attributeName]) continue

    stringifiedAttributes += "; " + attributeName
  }

  // name, value, options 를 한 문자열로 만들어 document.cookie에 할당
  return (document.cookie =
    name + "=" + converter.write(value, name) + stringifiedAttributes)
}
```

```js
// "checked=true; Max-Age: 86400" 쿠키를 설정한다.
Cookie.set('checked', true, { Max-Age : 86400 })
```

```js
function get(name) {
  //;로 파싱한다. 여러개 쿠키를 배열로 만든다.
  var cookies = document.cookie ? document.cookie.split("; ") : []
  var jar = {}
  for (var i = 0; i < cookies.length; i++) {
    // =로 파싱한다. name, value 튜플을 만든다.
    var parts = cookies[i].split("=")
    //
    var value = parts.slice(1).join("=")

    try {
      // name을 디코딩한다.
      var found = decodeURIComponent(parts[0])
      if (!(found in jar)) jar[found] = converter.read(value, found)
      // 요청한 쿠키를 찾았다.
      if (name === found) {
        break
      }
    } catch (e) {
      // Do nothing...
    }
  }

  // 찾은 쿠키를 반환한다.
  return name ? jar[name] : jar
}
```

```js
// 이름 sid의 쿠키 값을 얻는다.
Cookie.get("sid")
```

```js
function remove(name, attributes) {
  set(
    name,
    // 쿠키 값을 빈 문자열로 바꾼다.
    '',
    assign({}, attributes, {
      // 쿠키 만료 시간을 음수로 바꾼다.
      expires: -1
    })
  )
},
```

## 4.8 중간정리

- 무상태 HTTP에 쿠키로 상태를 관리할 수 있다.
- 서버가 전달하면 브라우져가 그대로 다시 요청한다.
- 이름, 값, 디렉티브
- 참고
  - [HTTP 쿠키 | 김정환블로그](/2024/03/04/http-cookie)
  - [HTTP 쿠키 | 위키피디아](https://ko.wikipedia.org/wiki/HTTP_쿠키)
  - HTTP 완벽가이드 > 11.6 쿠키
  - 리얼월드 HTTP > 2.5 쿠키
  - [HTTP 쿠키 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)
  - [쿠키와 document.cookie | JAVASCRIPT INFO](https://ko.javascript.info/cookie)

# 5장. 네트워크 요청

- 코딩하지 않아도 브라우져가 만드는 HTTP 요청에 대해 알아본다.

## 5.1 HTML 요청

- 주소창 입력 -> HTTP 요청 -> HTTP 응답 -> 문서 획득
- 브라우져는 상당히 많은 양의 HTTP 메세지를 보낸다.
- 브라우져 별로 HTTP 메세지가 다르다.
- 사례: 주소창에 URL 입력, 하이퍼링크

## 5.2 HTML 외 요청

- 브라우져는 HTML 렌더(CRP, Critical Rendering Path) 중에 HTTP 요청을 만들 수 있다.
- 자원 별로 요청 헤더를 사용해 HTTP 메세지를 구성한다.
- 사례: 스타일시트, 글꼴, 자바스크립트

## 5.3 img 요청

- 사례: 광고 트래커로서의 img 태그 활용
- 1x1의 작고 투명한 이미지를 사용해 구현한다.
- 서버는 접속 시간, 접속 장소, 접속 단말기, 접속 화면 등을 알 수 있다.

## 5.4 Form 요청

- 사용자가 제출하는 시점에 데이터를 서버로 전송할 수 있다.
- GET 메소드
- POST 메소스. 요청 바디 지원.
- 두 가지 요청 바디: x-www-form-urlencoded, form-data
- 사례: 로그인, 파일 업로드

## 5.5 중간 정리

- 주소창에 URL을 입력하거나 하이퍼링크를 클릭하면 브라우져는 HTTP 요청을 만든다.
- HTML을 렌더링할 때 필요한 자원을 얻기 위해 HTTP 요청을 만든다.
- 데이터를 서버에 전달하기 위해 Form 앨리먼트를 사용해 HTTP 요청을 만들 수 있다.
- 참고
  - [중요 렌더링 경로 | MDN](https://developer.mozilla.org/ko/docs/Web/Performance/Critical_rendering_path)
  - [\<form\> | MDN](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form)
