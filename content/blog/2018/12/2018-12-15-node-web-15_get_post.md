---
title: '[Node.js코드랩] 15.라우터 Get, Post'
layout: post
summary: 메소드에 따라 라우팅 합니다.
category: series
seriesId: 20181201
tags: [lecture]
---

## 🌳목표

메소드 이름으로 라우팅하는 기능을 구현합니다.

## POST 메소드 요청

화면을 조금 변경했는데요, 브랜치를 이동하고 확인해 볼까요?

```
$ git checkout -f application/get-post-spec
```

서버를 실행하고 브라우져로 접속합니다.

![](/assets/imgs/2018/12/15/result_1.png)

화면 상단에 입력 폼을 만들었습니다. 여기에 포스트 제목과 내용을 입력하고 submit 버튼을 눌러 볼까요?

![](/assets/imgs/2018/12/15/result_2.png)

"POST /api/posts" 엔드포인트를 요청하고 있네요.
지금까지는 GET 메소드만 요청했지만 폼 전송부터는 POST 메소드를 사용하기 시작합니다.

프론트엔드 코드를 더 살펴 볼까요?

```js
createPost({title, body}) {
  const data = `title=${title}&body=${body}`
  return http('post', '/api/posts', data)
}
```

submit 이벤트가 발생하면 createPost() 함수가 동작하는데 내부적으로 POST 메소드를 사용하고 있네요.

현재 서버에서는 요청 정보를 비교할 때 경로만 비교하고 있습니다. 미들웨어 코드를 살펴 볼까요?

```js
if (nextMw._path) {
  const pathMatched = _req.path === nextMw._path;
  return pathMatched ? nextMw(_req, _res, next) : _run(i + 1)
}
```

경로만 비교하기 때문에 동일한 URL 요청일 경우 메소드에 상관없이 응답하는 것이 현재 서버의 한계입니다.

프론트엔드에서 요청하는 POST 메도드를 지원하려면 경로 뿐만 아니라 **요청 메소드까지 비교**해야 겠지요?

## 🐤실습 - 라우트 등록 함수 post(), get()을 만들어 보세요

어플리케이션의 use() 메소드는 라우트 등록을 위한 녀석입니다. 경로와 컨트롤러 함수를 받아 등록할수 있지요.
이와 유사하게 post()는 요청 메소드 POST까지 등록하는 함수입니다. get()도 마찬가지구요.

메소드 정보까지 등록하는 post()와 get() 메소드를 구현해 보세요.

*힌트: 경로 정보를 _path에 저장한 것처럼 _method란 이름으로 저장*

## 🐤풀이

그럼 같이 풀어 보겠습니다.

어플리케이션 메소드로 추가하니깐 src/Application.js 코드를 수정합니다.
두 부분으로 나눠서 설명할게요.

```js
const get = (path, fn) => {
  if (!path || !fn) throw Error('path and fn is required')
  fn._method = 'get'
  use(path, fn)
}
```

use() 메소드처럼 경로와 컨트롤러 함수를 인자로 취합니다.
인자가 필수로 들어왔는지 점검하고 그렇지 않으면 예외를 던져 프로그램을 중지시킵니다.

미들웨어인 컨트롤러 함수의 _method 속성에 'get' 문자열을 할당하여 요청 메소드를 저장합니다.
그리고 경로와 컨트롤러를 라우트 등록 함수인 use() 메소드 인자로 전달해 주었습니다.

```js
const post = (path, fn) => {
  if (!path || !fn) throw Error('path and fn is required')
  fn._method = 'post'
  use(path, fn)
}

return {
  // ...
   get,
   post,
}
```

post()도 메소드 이름만 다르지 로직은 완전히 동일합니다.

이제 미들웨어를 실행할 때 이 정보를 비교해야겠죠?
src/Middleware.js 파일로 이동합니다.

```js
  if (nextMw._path) {
    const pathMatched = _req.path === nextMw._path &&
      _req.method.toLowerCase() === (nextMw._method || 'get');

    return pathMatched ? nextMw(_req, _res, next) : _run(i + 1)
  }
```

등록된 경로가 있을 경우에 그것과 요청 경로를 비교하는 로직을 개선합니다.
경로 뿐만아니라 등록한 메소드 이름도 함께 비교하는 것이죠.
만약 등록한 메소드가 없으면 기본값인 "get"을 등록한 것으로 합니다.
대소문자와 무관하게 동작하도록 하려고 소문자로 변환하여 비교한 것을 눈여겨 보시기 바랍니다.

## POST 메소들를 지원하는 엔드포인트 만들기

그럼 이를 바탕으로 포스트 생성 API를 만들어 보겠습니다.

포스트 관련 API 컨트롤러 함수를 정의한 routes/api/post.js 파일에 로직을 추가합니다.

```js
const create = () => (req, res, next) => {
  debug(`create() ${req.body}`)
}

module.exports = {
  index,
  create,
}
```

생성을 의미하는 create란 이름으로 함수를 만들었습니다. 실제 로직은 없고 로그만 기록하고 있구요.
외부에서 라우트 등록을 위해 모듈로 노출시켰습니다.

app.js에서 이 컨트롤러 함수를 등록하겠습니다.

```js
app.get('/api/posts', apiPost.index()) // use() 였던 것을 get() 으로 명확히 등록
app.post('/api/posts', apiPost.create()); // post()로 등록
app.use(errors.error404());
// ...
```

use()로 등록했던 포스트 조회 엔드포인트는 get() 메소드로 의미를 더 명확하게 개선했습니다.
뿐만 아니라 post() 메소드로 포스트 생성 엔드포인트까지 추가했구요.

## 정리

* get(), post() 메소드를 만들어 더 명확하게 엔드포인트를 등록할 수 있습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)
