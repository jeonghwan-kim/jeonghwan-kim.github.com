---
slug: "/2024/03/04/http-cookie"
date: 2024-03-04
title: "HTTP 쿠키"
layout: post
tags: [http]
---

# 서론

유닉스 환경에서 개발할 때 받은 데이터를 그대로 다시 보내는 것을 매직 쿠키라고 한다. 지금으로부터 30년 전 쇼핑 카트를 구현할 해법으로 비슷한 구조를 제안했는데 이것이 바로 '쿠키'의 시초다. 사이트 재 방문 확인 기능이 쿠키를 활용한 첫 사례라고 한다(참고: [HTTP Cookie | MDN](https://en.wikipedia.org/wiki/HTTP_cookie)).

쿠키가 브라우져 저장소 중의 하나라고 생각했다. 서버에서 값을 만들어 네트웍에 실은 뒤 브라우져에 저장하는 구조가 다른 저장소와 다른 점이다. HTTP 헤더, 보안을 위한 옵션 등 HTTP 관점으로 바라보아야 쿠키를 더 정확하게 이해할 수 있었다.

이 글에서 HTTP 쿠키에 대해 정리해 보겠다.

# HTTP 헤더

HTTP 통신은 클라이언트 요청으로 시작해 서버 응답으로 종료한다. 클라이언트가 다시 요청하더라도 서버는 같은 클라이언트를 기억하지 못한다. 다시 말해 HTTP 통신은 상태가 없다(Stateless).

무상태 특성은 확장하기 쉽다. 기억할 내용이 없어서 누구나 요청을 처리할 수 있기 때문이다. 여러 대의 서버 중에 아무나 요청을 처리할 수 있고 더 좋은 성능의 장비로 교체할 수도 있다.

반면 웹 어플리케이션은 상태가 필요하다. 가령 사이트 방문 여부다. 이전 요청을 기억해야 첫 방문 여부를 판단할 수 있다.

서버가 클라이언트 요청에 특정 정보를 표시해서 상태를 저장할 수 있는데 바로 **Set-Cookie** 라는 HTTP 헤더다.

```js
res.setHeader("Set-Cookie", "sid=1")
```

서버에서 Set-Cookie 응답 헤더에"이름=값" 형식으로 문자열을 지정했다.

```
< Set-Cookie: sid=1 // 당신의 세션 아이디(sid)는 1 입니다.
```

Set-Cookie 헤더를 발견한 브라우져는 이 값을 쿠키 저장소에 기록해 둔다. 다음 요청부터는 이 쿠키를 **Cookie**라는 이름의 헤더로 실어 보내야하기 때문이다.

```
> Cookie: sid=1 // 당신이 알려준 제 세션 아이디 입니다.
```

서버는 이 값을 보고 '아하, 이전에 만났던 클라이언트군'이라고 판단할 수 있다. 마치 식사하다가 화장실에 갈 때 옷 소매에 붙여주는 예식장 직원의 빨간 스티커처럼.

Set-Cookie와 Cookie 헤더를 이용해 클라이언트를 식별하는 서버를 만들 수 있다.

```js
const server = http.createServer((req, res) => {
  const cookie = req.headers["cookie"]

  // Cookie 요청 헤더에 sid 값이 있다면
  if (cookie && cookie.includes("sid")) {
    // 이전에 방문한 클라이언트다.
    res.end("Welcome again.")
    return;
  }

  // 요청한 클라이언트에 표시한다.
  res.setHeader("Set-Cookie", "sid=1");
  // 첫 방문한 클라이언트다.
  res.end("Welcom")
}
```

Cookie 요청 헤더가 있고 sid 값이 있다면 이전에 방문한 클라이언트다. 처음 방문하면 서버가 Set-Cookie 헤더에 "sid=1" 텍스트를 응답하고 이후에 브라우져가 다시 요청할 때 헤더에 그대로 실어 보내기 때문이다.

# 범위

Set-Cookie 응답 헤더를 받은 브라우져가 모든 요청에 이 값을 보내지는 않는다. 기본적으로 같은 도메인으로 요청할 때만 전달한다. 브라우져가 쿠키와 도메인을 함께 기억한다는 방증이다.

로컬 환경에서 도메인 식별을 위해 DNS 레코드를 추가하자. 맥OS 기준으로 /private/etc/hosts 파일에 아래 레코드를 추가했다.

```
127.0.0.1 foo.com
127.0.0.1 bar.com
```

브라우져로 http://foo.com:3000 URL을 사용하면 로컬 서버에 접속해 쿠키를 받는다. 브라우져는 이 쿠키가 foo.com에서 받은 것이라고 기억할 것이다. 같은 도메인으로 요청을 보내면 브라우져는 이 쿠키를 헤더에 실을 것이다.

하지만 http://bar.com:3000 URL을 사용하면 브라우져는 더 이상 쿠키를 사용하지 않는다. 클라이언트 식별을 위해 사용한 이 값을 브라우져가 민감하게 생각하기 때문에 도메인을 한정한 것이다.

하지만 다른 도메인에서도 쿠키를 사용해야할 경우도 있다. 가령 싱글 사인온(SSO)이라면 login.foo.com에서 인증하고 foo.com에서도 인증이 유지 되었으면 좋겠다. 한 번의 인증로 다른 사이트도 사용할 수 있기 때문이다.

**Domain**은 쿠키를 공유할 도메인을 지정하는 디렉티브다.

```js
res.setHeader("Set-Cookie", "sid=1; Domain=foo.com")
```

서버가 쿠키 값 뿐만 아니라 요청을 보낼 도메인도 함께 지정했다. foo.com 도메인과 하위 도메인을 지정했다.

```
< Set-Cookie: sid=1; Domain=foo.com  // foo.com 도메인(하위 도메인 포함)에만 쿠키를 전달하세요.
```

브라우져는 foo.com 뿐만 아니라 login.foo.com 도메인으로 요청 할 때도 쿠키를 보낼 것이다. login.foo.com으로 로그인하고 인증 정보를 쿠키로 받으면 foo.com으로 요청할 때도 쿠키에 있는 인증 정보를 자동으로 보내 인증을 공유할 수 있다.

하위 경로로 사이트를 구분한 경우도 있다.

- foo.com/public: 인증 없이 접속
- foo.com/private: 인증하고 접속

/public 에는 인증정보가 담긴 쿠키를 보낼 필요가 없다. 하지만 /private 에는 인증 정보가 필요한 경우다. 같은 도메인이기 때문에 항상 쿠키를 전달할 것이다.

**Path**는 사이트 경로에 따라 쿠키를 제한할 수 있는 디렉티브다.

```js
res.setHeader("Set-Cookie", "sid=1; Path=/private")
```

서버가 쿠키를 보낼 경로를 /private 로 한정했다.

```
< Set-Cookie: sid=1; Path=/private  // /private 경로(하위 경로 포함)에만 쿠키를 전달하세요.
```

응답을 받은 브라우져는 foo.com/private 경로로 요청할 때만 쿠키를 실을 것이다. /public 으로 요청하면 쿠키를 실지 않는다.

# 생명 주기

브라우져는 종료될 때 쿠키를 삭제한다. 브라우져를 다시 실행하고 서버에 접속하면 Cookie 헤더를 실지 않는다. 저장소에 쿠키가 없기 때문이다. 서버와 브라우져 간의 요청 상태를 세션이라고 하는데 이것와 같은 수명을 갖는 쿠키를 **세션 쿠키**라고 한다.

브라우져가 종료되더라도 쿠키를 유지해야 할 경우도 있다. 가령 인증하고 나서 이 값을 쿠키로 받고 브라우져를 종료한 경우다. 브라우져를 다시 실행해 서버에 접속하면 인증 상태가 유지 되어야 하는 게 좋겠다.

**Max-Age**와 **Expires**는 쿠키 수명을 지정하는 디렉티브다. 서버는 브라우저가 쿠키를 얼마나 오래 저장할지 지정할 수 있는데 초 단위로 설정한다.

```js
res.setHeader("Set-Cookie", "sid=1; Max-Age=10")
```

브라우져에게 10초 동안 쿠키를 유지하라고 응답 헤더에 실었다.

```
< Set-Cookie: sid=1; Max-Age=10 // 10초간 쿠키를 유지하세요.
```

응답을 받은 브라우져는 프로그램 종료와 무관하게 10초간 쿠키를 유지할 것이다. 특정일을 지정하려면 Expires 디렉티브를 사용한다.

세션과 상관없이 일정기간 유지하는 쿠키를 **영속적인 쿠키, Permanent cookies**라고 부른다.

# Secure

HTTP로 전달되는 쿠키는 평문을 사용한다. 누구라도 중간에 패킷을 가로채 읽을 수 있다. TCP와 HTTP 중간에 보안 계층 (Transport Layer Security, TLS)을 추가하면 통신 패킷을 가로채도 해석할 수 없는데 바로 HTTPS다.

쿠키를 HTTPS로 전달하면 암호화된 문자를 사용한다. 패킷을 가로채더라도 읽을 수 없다.

**Secure**는 쿠키를 HTTPS 요청에만 사용하도록 지시하는 디렉티브다.

```js
res.setHeader("Set-Cookie", "sid=1; Secure")
```

서버가 브라우져에게 쿠키를 HTTPS를 통해서만 전달하라고 지시했다. 중요한 내용물이라서 일반 우편이 아니라 등기 우편으로 보내라는 것처럼.

```
< Set-Cookie: sid=1; Secure // HTTPS로 쿠키를 보내세요.
```

응답을 확인한 브라우져는 HTTPS 요청에만 이 쿠키를 헤더에 실을 것이다.

HTTP를 사용하면 쿠키를 요청 헤더에 실지 않는다.

```
> Cookie: // http 요청에서는 쿠키를 전달하지 않는다.
```

로컬 환경에서 HTTPS를 사용하기 위해 인증서를 만들자.

```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

인증서 관련한 두 개 파일을 만들었다.

- server.key: PRIVATE KEY
- server.cert: CERTIFICATE

이 파일을 사용해 HTTPS를 사용하는 서버로 바꾸자.

```js
// https 모듈로 대체한다
const https = require("https")
const fs = require("fs")

// 서버에 지정할 인증서 설정
const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
}

const app = (req, res) => {
  /* ... */
}

const server = https.createServer(options, app)
server.listen(3000)
```

브라우져에 https://foo.com:3000 URL을 사용하면 이전에 받은 쿠키를 요청 헤더에 전달한다.

```
> Cookie: sid=1 // 브라우져가 HTTPS 요청에서만 쿠키를 전달한다.
```

# HttpOnly

네트웤 뿐만아니라 쿠키가 탈취될 경로는 더 있다. 바로 document.cookie 문자열이다. 브라우져에서 자바스크립트로 이 값을 조회하거나 변경할 수 있다.

```js
// 서버에서 받은 sid=1을 sid=2로 변경한다.
document.cookie = "sid=2"
```

저장소에 있는 쿠키를 위조하면 브라우져는 바뀐 값을 헤더에 실어 서버에 전달한다.

```
> Cookie: sid=2 // 위조된 쿠키 값이 서버로 전달된다.
```

애초에 자바스크립트로 쿠키 접근을 차단한다면 이러한 악용 시나리오를 예방할 수 있을 것이다.

**HttpOnly**는 자바스크립트로부터 쿠키 접근을 차단하고 오직 HTTP 요청에만 쿠키를 사용할 때 쓰는 디렉티브다.

```js
res.setHeader("Set-Cookie", "sid=1; HttpOnly")
```

서버는 클라이언트에게 HTTP 요청에만 쿠키를 사용하고 지시했다.

```
< Set-Cookie: sid=1; httpOnly // http 요청에만 쿠키를 사용하세요.
```

응답을 받은 브라우져는 쿠키를 HTTP 요청에만 사용한다고 이해한다. 자바스크립트로 document.cookie에 접근하는 것을 차단할 것이다.

document.cookie 값을 조회하면 빈 문자열이다.

```js
document.cookie // ""
```

이 값을 강제로 할당하더라도 다음 요청에 보내는 쿠키 값은 기존에 받았던 값을 사용한다.

```
> Cookie: sid=1 // 오직 http 요청시에만 쿠키가 사용된다.
```

# 서버 라이브러리

서버는 Set-Cookie 응답 헤더로 쿠키를 클라이언트에게 전달한다. 이름, 값, 디렉티브를 하나의 문자열로 표현하기 때문에 코딩할 때에는 각 값을 받아서 하나의 문자열로 만들어 내는 함수를 준비하면 좋다.

서버 프레임웍인 Express.js에서는 [res.cookie()](https://github.com/expressjs/express/blob/master/lib/response.js#L884) 함수를 제공한다. 쿠키의 이름, 값 그리고 옵션 객체를 전달하면 Set-Cookie 헤더에 하나의 문자열로 실을 수 있다.

```js
// 이름, 값, 옵션을 전달하면 쿠키 문자열를 만들어 Set-Cookie 헤더에 실는다.
res.cookie = function (name, value, options) {
  // ...
  this.append('Set-Cookie', cookie.serialize(name, String(val), options)
  // ...
}
```

응답을 받은 클라이언트는 이 값을 그대로 Cookie 헤더에 실어 요청할 것이다. 서버는 이 문자열에서 정보를 찾아 사용한다.

```
> Cookie: sid=1; domain=foo.com; path=/private; Secure; HttpOnly;
```

문자열을 직접 파싱하는 것 보다는 구조화된 데이터가 준비되면 훨씬 다루기 편하다. [cookie-parser](https://github.com/expressjs/cookie-parser/tree/master)는 요청 헤더의 Cookie 문자열을 파싱해 객체로 만들어주는 익스프레스 미들웨어다.

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

요청 헤더에서 쿠키 문자열을 조회하고 이것을 cookie.parse() 함수로 파싱한다. 그리고 다음 미들웨어에서 사용할수 있게끔 req.cookies 필드에 파싱한 쿠키를 담는 것까지가 이 미들웨어의 역할이다.

파싱에 사용된 [cookie](https://github.com/jshttp/cookie/tree/master) 라이브러리 테스트 코드를 보면 동작을 이해할 수 있을 것이다.

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

문자열을 다루는 것 보다 수월하다.

```
req.cookies.sid // 1
```

# 브라우져 라이브러리

HttpOnly 옵션이 없으면 브라우져는 언제든지 자바스크립트로 쿠키를 제어할 수 있다. 서버에서 클라이언트에 표시한 데이터가 쿠키라고 이해했는데 굳이 브라우져에서 쿠키를 조회하거나 변경할 필요가 무엇일까?

가령 팝업을 표시한 뒤 '오늘 하루 다시 보지 않기' 같은 기능을 구현할 경우다. 사용자의 선택을 기억하기 위한 상태 관리 목적으로 쿠키를 활용할 수 있다.

```js
// 이 브라우져 사용자가 오늘 하루 다시 보지 않기를 선택했다.
document.cookie = "checked=true; MaxAge=86400"
```

웹 스토리지가 없던 시절에는 쿠키를 제법 활용했다. 게다가 유효기간이 지나면 파기되는 특성이 이 기능을 만들기에 적합하다.

브라우져에서도 쿠키를 조회하고 변경할 할 필요가 있다. 문자열보다는 객체로 접근하는 게 더 쉬울 것이다. [js-cookie](https://github.com/js-cookie/js-cookie/tree/main)는 이런 라이브러리의 일종이다.

set(name, value, options)은 쿠키를 설정하는 함수다.

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

attributes 인자로 받은 값을 적절한 디렉티브로 대체해 하나의 문자열로 만든다. 쿠키 이름, 값, 디렉티브를 붙여 하나의 문자열로 바꾸고 이 값을 document.cookie에 할당한다.

아래는 set() 함수로 쿠키를 설정하는 방법이다.

```js
// "checked=true; Max-Age: 86400" 쿠키를 설정한다.
Cookie.set('checked', true, { Max-Age : 86400 })
```

get()은 문자열에서 쿠키를 조회하는 함수다.

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

document.cookie에 있는 쿠키 문자열을 파싱해서 구조화된 데이터로 만든다. 복잡해 보이지만 결국 사용하기 수월하게 객체로 만들어 반환한다.

사용하는 모습을 보면 동작을 알 수 있다.

```js
// 이름 sid의 쿠키 값을 얻는다.
Cookie.get("sid")
```

remove()는 set() 함수를 조합해 쿠키를 제거하는 역할이다.

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

만료일을 음수로 설정하면 쿠키를 삭제할 수 있다고 한다.

# 결론

상태가 없는 HTTP에 상태를 추가할 목적으로 쿠키를 사용한다. 서버가 요청에 스티커를 붙여 전달하면 브라우져는 이 스티커를 다음 요청에 그대로 붙여서 전달하는 구조이다.

쿠키는 "이름=값" 형태로 만들고 브라우져가 쿠키를 다루기 위한 정책을 명시하는 디렉티브를 지정한다.

- 범위: Domain, Path
- 생명 주기: Max-Age, Expires
- 보안: Secure, HttpOnly

쿠키의 이름, 값, 디렉티브는 하나의 문자열로 표현된다. 어플리케이션에서 사용할 때는 구조화된 데이터로 준비하는 것이 편하다. 이러한 라이브러리들이 있고 어떻게 동작하는지 살펴 보았다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.io-examples/tree/main/2024-03-04-cookie)
- HTTP 완벽가이드 > 11.6 쿠키
- 리얼월드 HTTP > 2.5 쿠키
- [HTTP 쿠키 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)
- [HTTP cookie | Wikipedia](https://en.wikipedia.org/wiki/HTTP_cookie)
- [쿠키와 document.cookie | JAVASCRIPT INFO](https://ko.javascript.info/cookie)
