---
title: 익스프레스 만들기 Day 4
layout: post
category: series
seriesId: "f301d537-b1a9-5ed7-8175-0ea58ee80a70"
permalink: 2017/10/21/diy-express-day4.html
tags: [expressjs, authentication]
summary: 쿠키, 세션 기능을 만들고 인증을 구현해 본다
---

이제 인증 기능을 만들어 보자. 쿠키, 세션, 로그인 순서로 진행하면 되겠다.

## 쿠키

먼저 쿠키부터 시작하자.
[문서에 노드의 쿠키설정](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_response_setheader_name_value) 방법을 찾았다. `Set-Cookie` 헤더를 설정해 주면 되는군.

익스프레스에서는 헤더에 쿠키를 설정하기 위해 응답객체 메소드로 형태로 [req.cookie()](http://expressjs.com/en/4x/api.html#res.cookie) 함수를 제공한다. 그럼 내가 만든 response.js에도 `cookie()`란 이름으로 함수를 추가하면 비슷하게 구현될 것 같다.

response.js:

```js
res.cookie = (name, value) => {
  res.set("Set-Cookie", [`${name}=${value}`])
  return res
}
```

쿠키 이름인 name과 값 value를 받아서 HTTP 응답 헤더에 담아 전송하도록 했다.
미들웨어 함수에서는 응답객체를 이용해 `res.cookie('viewCount', 3)`처럼 코딩할 수 있다.

간단하게 뷰 카운터 엔드포인터를 만들어 보자.

```js
app.get("/viewCount", (req, res, next) => {
  res.cookie("viewCount", 3).send()
})
```

`GET /viewCount` 요청이 들어오면 쿠키에 `"viewCount=3"`이란 문자열을 담아서 응답하는 기능이다.

curl로 요청하면 쿠키 정보가 헤더로 응답되는 것을 확인할 수 있다.

```bash
curl -vs localhost:3000/viewCount
< HTTP/1.1 200 OK
< Set-Cookie: viewCount=3
```

크롬 브라우져의 개발자 도구로 보면 쉽게 확인할 수 있다.
Application 탭의 Storage > Cookie 메뉴다.

![cookie result](/assets/imgs/2017/10/cookie-result.png)
ㅓ
cookie-parser.js:

## cookie-parser 미들웨어 만들기

`res.cookie()` 함수로 설정한 쿠키값을 브라우져에 보내면, 브라우져가 다음 요청시에는 이 쿠키 정보를 헤더에 담아서 보낼 것이다. 이 값은 노드 서버에 어떤 형태로 들어올까?

```js
const cookieParser = (req, res, next) => {
  console.log(req.headers.cookie) // "viewCount=3"
}
```

요청 객체의 `req.headers.cookie` 객체에 쿠키 값이 들어오는데 `"name=value"` 형태의 문자열이다.
보통 서비스에서 쿠키는 여러 개를 사용하는데 이럴 땐 어떤 형태로 들어올까?
크롬 개발자도구에서 `foo`라는 이름에 `"bar"`라는 값을 가진 쿠키를 추가하고 요청해 보자.

```js
const cookieParser = (req, res, next) => {
  console.log(req.headers.cookie) // "viewCount=3; foo=bar"
}
```

쿠키 헤더의 마지막에 `"foo=bar"` 형태로 들어왔다.
쿠키가 2개 이상일 경우에는 세미콜론(`";"`) 구분자를 사용하는 것을 확인할 수 있다.

서버 어플리케이션에서 이 쿠키값을 쉽게 사용하려면 어떻게 할 수 있을까?
쿠키에 접근할 때마다 문자열을 규칙에 맞게 파싱해서 사용할 수도 있겠지만 이 역할을 수행하는 전용 미들웨어를 만들자.

어플리케이션이 수행되면 이 미들웨어는 서버에 세팅될 것이다.
모든 요청마다 쿠키 헤더에 접근해서 미리 파싱해 주면, 이후 수행되는 미들웨어는 이미 파싱된 쿠키 정보에 손쉽게 접근할 수 있지 않을까?

쿠키 문자열을 key/value 형식의 자바스크립트 객체로 파싱하여 `req.cookies`에 할당하는 것이 바로 cookie-parser 미들웨어의 역할이다.
익스프레스의 [cookie-parser](https://github.com/expressjs/cookie-parser)도 그런 역할을 한다.

그럼 cookie-parser 미들웨어를 구현해 보자.

cookie-parser.js:

```js
const parseCookie = req => {
  if (!req.headers.cookie) return {}

  return req.headers.cookie.split(';').reduce((obj, pair) => {
    pair = pair.trim()
    const k = pair.split('=')[0].trim()
    const v = pair.split('=')[1].trim()
    obj[k] = v
    return obj
  }, {})
}

const cookieParser = (req, res, next) => {
  if (!req.cookies) {req.cookies = parseCookie(req)
  next()
}

module.exports = () => cookieParser
```

이 미들웨어를 어플리케이션(app.js)에 설정하고:

```js
app.use(cookieParser())
```

요청객체를 살펴보면:

```js
debug(req.cookies) // { viewCount: '3', foo: 'bar' }
```

헤더에 문자열로 전달된 쿠키 정보가 자바스크립트 객체로 변환된 것을 확인할 수 있다.

## 쿠키 응용: pageview-counter

쿠키 기능을 이용해 pageview-counter 미들웨어를 만들어 보자.
pageview-counter는 클라이언트가 서버에 접속할 때마다 브라우져가 보내는 헤더의 쿠키에 저장된 카운터 값을 읽어 증가 시킨다.
그리고 이 증가한 값을 헤더에 담아 요청한 클라이언트로 응답하는 구조다.

pageview-counter.js:

```js
const pageviewCounter = () => {
  return (req, res, next) => {
    const views = req.cookies.views ? req.cookies.views * 1 + 1 : 1
    req.cookies.views = views
    res.cookie("views", views)

    next()
  }
}

module.exports = pageviewCounter
```

페이지 뷰 카운터 미들웨어를 어플리케이션에 추가하면 매 요청시마다 카운터가 증가하는 것을 확인할 수 있다.

- 첫번째 페이지 접속: ![pageview counter 1](/assets/imgs/2017/10/pageview-counter-1.png)
- 세번째 페이지 접속: ![pageview counter 3](/assets/imgs/2017/10/pageview-counter-3.png)
- 일곱번째 페이지 접속: ![pageview counter 7](/assets/imgs/2017/10/pageview-counter-7.png)

## 세션

쿠키에 저장된 데이터는 노출해도 무방한 정보여야 한다. 방금 만든 페이뷰 카운터처럼 말이다.

하지만 서버에서만 관리해야하고 브라우져에 남아서는 안되는 데이터는 어떻게 해야할까?
접속한 유저의 개인정보 같은 것들 말이다.

이러한 문제를 해결하는게 **세션 저장소**다. 클라이언트의 민감한 정보를 저장해야하는 용도로 사용하는 것이다.

자바스크립트 Map 객체를 만들어 타임스탬프를 아이디로 하는 세션 저장소를 만들겠다.
이것도 미들웨어로 구현하자.

session.js:

```js
const session = () => {
  const storage = new Map()

  const generateSession = () => {
    const sid = `s${Date.now()}`
    storage.set(sid, { sid })
    return sid
  }

  return (req, res, next) => {
    let sid = req.cookies.sid

    if (!storage.has(sid)) {
      sid = generateSession()
      res.cookie("sid", sid)
    }

    req.session = storage.get(sid) || {}
    next()
  }
}

module.exports = session
```

세션 데이터 중 세션 아이디(`sid`)만 쿠키에 저장했다.
매 요청이 들어오면 쿠키에서 `sid`를 읽는다. 세션 저장소인 Map 객체에서 `sid`로 세션 객체를 찾을 경우 `req.session`에 객체를 할당한다. 찾지 못할 경우에는 새로운 `sid`를 생성하고 쿠키에 `sid`와 세션 객체를 저장한다.

## 세션 응용: pageview-counter 개선

pageview-counter는 카운터 정보를 쿠키에 직접 저장했다.
이번에는 이 카운터를 세션에 저장해 보겠다(민감한 정보가 아니긴하지만).
다만 세션 아이디만 쿠키에 저장해서 클라이언트를 식별하도록 하겠다.

pageview-counter.js:

```js
const pageviewCounter = () => {
  return (req, res, next) => {
    req.session.views ? req.session.views++ : (req.session.views = 1)
    next()
  }
}
```

- 요청시 브라우져에는 세션 아이디만 남는다.
  ![session result in browser](/assets/imgs/2017/10/session-result-1.png)

- 서버의 세션 저장소에는 카운터 데이터가 증가되었다.
  ![session result in server](/assets/imgs/2017/10/session-result-2.png)

## 인증 만들기

예제라서 그렇지, 사실 페이지뷰 카운터는 쿠키에 저장해도 무방하다.
그럼 실제 사례가 될만한 인증 기능을 세션과 쿠키를 이용해 구현해 보자.

## 로그인폼

템플릿 엔진이 파싱해줄 header.view를 먼저 만든다.

login.view:

```html
include 'header.view'

<div class="content">
  <div class="container">
    <form id="login-form">
      <p>
        <input type="email" name="email" placeholder="Email" autofocus />
      </p>
      <p>
        <input type="password" name="password" placeholder="Password" />
      </p>
      <p>
        <button type="submit">Login</button>
      </p>
    </form>
  </div>
</div>

include 'footer.view'
```

이메일과 비밀번호 입력 필드를 추가했다.
브라우져에서 동작할 자바스크립트에서는 로그인 버튼을 클릭하여 발생할 submit 이벤트에 로그인 api를 요청하도록 구현했다.

login.js:

```js
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = e.target.email.value || ''
    const password = e.target.password.value || ''

    auth.login(email, password).
      then(data => {
        alert('success login')
        window.location.href = '/'
      }).
      catch(err => {
        alert('Login failed. Try again')
```

## 로그인 API

브라우져의 로그인 폼에서 요청한 로그인 api는 `POST /api/auth/login`으로 정했다.
그럼 서버에 이 엔드포인트를 구현해 보겠다.

먼저는 어플리케이션에 라우팅 로직을 추가해야겠다. app.js:

```js
app.post("/api/auth/login", require("./routes/api/auth").login)
```

그리고 auth.js 미들웨어를 구현한다. auth.js:

```js
const users = [{ id: 1, email: "ej88ej@gmail.com", password: "123" }]

const login = (req, res, next) => {
  const { email, password } = req.body

  const user = users.filter(user => {
    return user.email === email && user.password === password
  })[0]

  if (user) req.session.user = user

  res.status(user ? 200 : 401).send()
}
```

아직은 데이터베이스가 없으니깐 목업 디비인 `users` 배열을 임시로 만들었다.

로그인 미들웨어 함수에서는 요청 바디에서 이메일과 비밀번호를 알아내고, 이 정보를 `users` 디비에서 찾는다한다.
유저를 찾은 경우는 세션의 `req.session.user` 객체에 디비의 유저 정보를 저장한다.
그리고 이 정보를 200 상태코드와 함께 응답한다.

결과적으로 session 미들웨어에 의해 세션 아이디만 쿠키에 저장되고 브라우져에 노출될 것이다.

다음 요청부터는 `req.session.user` 객체를 통해 어떤 유저가 접속한 브라우져인지 식별할 수 있게 된 것이다.

![session user](/assets/imgs/2017/10/session-user.png)

## 로그아웃 API

로그아웃 기능은 간단하다. 세션의 유저 정보를 삭제하기만 하면된다.
`DELETE /api/auth/logout` 엔드포인트로 만들어보자.

auth.js

```js
const logout = (req, res, next) => {
  delete req.session.user
  res.redirect("/")
}
```

## 접근제어

아직 로그인, 로그아웃 구현으로는 인증 기능을 실감하지 못하겠다.

실제 이 클라이언트가 인증되었다면 인가된 페이지에 접속할수 있도록 해야 한다.
만약 그렇지 않다면 페이지 접속을 차단해야한다.

이것을 **접근 제어**라고 하는데 간단한 접근 제어 기능을 구현해 보자.
핵심은 `req.session.user` 객체를 사용하는 것이다.

로그인한 유저만 `/new.html`에 접속할수 있도록 구현해 보겠다.

```js
const newPost = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login.html")

  res.render("new", {
    title: "New Post",
    scriptPath: "js/new.js",
  })
}
```

newPost 미들웨어 함수가 new.html를 렌더링하는 역할을 한다.
`res.render()` 함수가 그 역할을 하는데, 그 전에 로그인 여부를 확인할 수 있다.

`req.session.user` 객체가 설정되어 있지 않으면 로그인 되지 않았다고 판단할 수 있다.
그러한 요청은 로그인 페이지로 리다이렉트 시켜버린다.

리다이렉트 함수는 아직 미구현이고 익스프레스 프레임웍크처럼 함수 호출 코드만 작성했다.

## 리다이렉트

응답 관련된 기능이니깐 response.js에 추가하는게 적절해 보인다. `res.redirect(path)` 형태로 사용할 함수를 만들자.

HTTP 리다이렉트 관련해서는 [MDM Redirect 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)를 확인하면 되고, 노드에서는 [이런식](https://stackoverflow.com/questions/4062260/nodejs-redirect-url?answertab=active#tab-top)으로 구현한다.

우리 response.js에서는 이렇게 구현할 수 있다. response.js:

```js
res.redirect = path => {
  res.status(302).set("Location", path).end()
}
```

여기까지 익스프레스 프레임웍의 주요 기능을 직접 구현해 봤다. 사실 추석기간에 마치려고 했는데 좀 늦어졌다.

다음 포스팅이 마지막이 될 것 같다. 익스프레스와는 별개로 [시퀄라이즈 ORM](http://docs.sequelizejs.com/)를 간단히 구현해서 실제 디비까지 붙여 보겠다.
