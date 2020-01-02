---
title: '[Node.js코드랩] 11.라우터 use'
layout: post
summary: 라우터 기능을 하는 use 메소드를 만듭니다
category: series
seriesId: 20181201
tags: lecture
---

## 🌳목표 

라우터 기능을 만들어 다양한 경로를 처리할 수 있습니다.

## 기존 라운팅의 한계 

지금까지 우리가 만든 어플리케이션은 정적파일을 제외한 모든 요청을 index 미들웨어가 처리합니다.

```js
app.use(logger())
app.use(serveStatic())
app.use(index)
app.use(error404)
app.use(error)
```

"GET /foo" 로 요청하더라도 index 미들웨어가 동작해서 index.html 파일을 제공하는 것이죠. 아, 물론 에러가 발생하면 다르지만요. 

만약 아래와 같이 코딩할 수 있다면 어떨까요?
 
```js
app.use('/', indexController)
app.use('/foo', fooController)
```

특정 주소("/")의 요청이 있을 경우만 설정한 미들웨어(indexController)를 실행하도록 하는 방법입니다. 물론 "/foo" 경로로 요청하면 fooController가 동작는 거지요. 

## use() 메소드에 라우터 기능 추가 

미들웨어 등록 함수인 use를 조금 확장해 보겠습니다. 
경로까지 인자로 추가해 볼까요?
미들웨어를 실행할 때 등록한 경로와 지금 들어온 요청 주소가 일치할 때만 그 미들웨어 함수를 실행하도록 하는 것입니다.

## 🐤실습 - 라우터 기능 구현

먼저 지난 시간까지 작성한 코드로 이동합니다.

```
$ git checkout -f module/logger-color
```

app.use(path, fn)으로 메소드를 확장해 보세요.

*힌트: fn._path에 path를 저장*

## 🐤 풀이

같이 풀이 보죠. use() 메소드가 정의된 src/Application.js 파일을 먼저 수정합니다.

```js
const use = (path, fn) => {
  if (typeof path === 'string' && typeof fn === 'function') {
    fn._path = path;
  } else if (typeof path == 'function') {
    fn = path;
  } else {
    throw Error('Usage: use(path, fn) or use(fn)');
  }

  _middleware.add(fn);
}
```

path 인자는 선택사항이기 때문에 이 부분을 유연하게 처리해 주어야 하는데 if/else 구문이 그 코드입니다.

중요한 것은 두번째 미들웨어 인자 fn의 _path 속성에 경로를 저장한 부분입니다. 
이 후 미들웨어를 실행할 때 이 문자열과 요청URL를 비교한 뒤 함수를 실행할 것이 거든요.
참고로 자바스크립트 함수는 이렇게 객체 형식으로 프러퍼티를 추가 할 수 있습니다.

이제 run() 메소드가 정의된 src/Middleware.js 파일로 이동하겠습니다.

```js
const _run = (i, err) => {
  // ...
  
  if (nextMw._path) { // 경로를 비교한다 
    const pathMatched = _req.url === nextMw._path;
    return pathMatched ? nextMw(_req, _res, next) : _run(i + 1)
  }

  nextMw(_req, _res, next);
}
```

use() 메소드에서 저장한 경로정보는 nextMw._path를 통해 접근할수 있습니다. 
실제 요청 URL(_req.url)과 비교해서 경로가 같으면 미들웨어를 실행합니다.
그렇지 않으면 다음 미들웨어를 찾는 방식이죠. (_run(i + 1))

## 라우터 사용 

app.js에 있는 index 미들웨어와 error 미들웨어를 모듈로 분리하겠습니다.

먼저 routers/index.js 파일에 index 미들웨어를 옮깁니다. 

```js
const path = require('path')
// ...

const listPosts = () => (req, res, next) => {
  const publicPath = path.join(__dirname, '../public');
  // ...
}

module.exports = {
  listPosts
}
```

포스트 목록을 보여준다는 의미에서 listPosts 라는 이름의 함수를 만들어 모듈로 노출하였습니다.

middlewares/errors.js에 error404, error 미들웨어도 옮기겨 보지요.

```js
const error404 = () => (req, res, next) => {
  // ...
}

const error = () => (err, req, res, next) => {
  // ...
}

module.exports = {
  error404,
  error,
}
```

마지막으로 app.js 가 얼마나 단순하게 개선되었는지 확인해 봅시다. 

```js
const serveStatic = require('./middlewares/serve-static');
const logger = require('./middlewares/logger');
const errors = require('./middlewares/errors');
const index = require('./routes/index');
const App = require('./src/Application');
const app = App();

app.use(logger());
app.use(serveStatic());
app.use('/', index.listPosts());
app.use(errors.error404());
app.use(errors.error());

module.exports = app;
```

Application 인스턴스를 만들고 여기에 미들웨어를 추가하는 코드만 들어 있죠. 
이것만 보더라도 서버 어플리케이션이 어떤 동작을 하는지 가늠할 수 있을 것 같습니다.

뿐만아니라 기능도 미세하게 달라 집니다. 이젠 제대로 404 응답을 할 수 있죠. 

만약 정의 되지 않은 경로,  가령 "/foo"로 요청을 한다고 합시다.
서버에서는 logger -> serveStatic 미들웨어까지 가다가 index.listPost는 건너 뛰어 버리겠죠. 경로가 맞지 않으니깐요. erros.error404 미들웨어를 만나게 되고 비로 Not Found 문자열을 응답하게 될 것입니다.

## 정리 

* 경로에 따라 컨트롤러를 설정하는 use() 메소드를 구현했습니다.
* 어플리케이션 코드를 단순하게 개선하였습니다.


[목차 바로가기](/series/2018/12/01/node-web-0_index.html)