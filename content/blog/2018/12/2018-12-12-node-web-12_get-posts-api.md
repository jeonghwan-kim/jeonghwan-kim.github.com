---
title: '[Node.js코드랩] 12.포스트 조회 API'
layout: post
summary: 포스트 조회 API를 구현합니다
category: series
seriesId: "555b6438-4a71-51d0-9156-a1d5ca4d5eab"
tags: [lecture]
---

## 🌳목표

이전 시간에 구현한 라우터 기능을 이용해서 API를 하나 만들어 보겠습니다.

## 어떤 API죠?

먼저 실습을 위한 브랜치로 이동해 볼까요?

```
$ git checkout -f route/get-posts-spec
```

서버를 구동하고 브라우져로 접속해보세요.

![](/assets/imgs/2018/12/12/result_1.png)

"Loading..." 메세지가 사라지지 않네요.
뭔가를 로딩하고 있는데 잘 안되는가 봅니다.

![](/assets/imgs/2018/12/12/result_2.png)

크롬 개발자 도구를 확인하면 "GET /api/posts" 요청을 보냈는데 404 Not Found 응답을 받았군요.

프론트엔드 코드를 살펴보면 정확한 원인을 알 수 있을것 같군요.

```js
const loadTimeline = el => {
  el.innerHTML = 'Loading...'

  api.getPosts()
    .then(data => {
      // ...
    })
    .catch(err => {
      // ...
    })
}
```

loadTimeline은 페이지가 로드될때 실행되는 함수입니다.
"Loading..." 문자열을 돔에 출력하고 getPosts() 호출하고 응답을 기다리고 있네요.

```js
const api {
  getPosts() {
    return http('get', '/api/posts')
  }
}

const http = (method, url, data = null) => new Promise((resolve, reject) => {
  const req = new  XMLHttpRequest()
  req.open(method, url, true)
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.onreadystatechange = evt => // ...
  req.send(data)
}
```

getPosts() 메소드는 http 요청을 보내고 있구요.
GET 메소드와 "/api/posts" 주소로 AJAX 요청을 보내는 것을 확인할 수 있습니다.

서버에서는 이 엔트포인트가 없기 때문에 404로 응답한 것이 문제의 원인입니다.

## 🐤실습 - 포스트 조회 API를 구현해 보세요.

"GET /api/posts" 엔드포인트를 구현하세요.

*힌트: route/api/post.js 파일에 구현, 아래 목업 데이터 사용*

```js
const posts = [
  {title: 'post 3', body: 'this is post 3'},
  {title: 'post 2', body: 'this is post 2'},
  {title: 'post 1', body: 'this is post 1'},
]
```

## 🐤풀이

그럼 같이 풀어 보겠습니다.

routes/api 폴더에 posts.js 파일을 먼저 만듭니다.
여기에 코드를 작성하데 두 부분으로 나눠서 설명할게요.

```js
const posts = [
  {title: 'post 3', body: 'this is post 3'},
  {title: 'post 2', body: 'this is post 2'},
  {title: 'post 1', body: 'this is post 1'},
]
```

데이터를 저장할 posts 배열을 만들었습니다.
힌트에 있는 목업 데이터를 그대로 사용합니다.

```js
const index = () => (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(posts))
}

module.exports = {
  index
}
```

"/posts" 요청에 대한 컨트롤러 함수를 만들 것이기 때문에 미들웨어 함수로 인터페이스를 맞추었습니다.

API는 JSON 형식을 사용하기 때문에 Content-Type 헤더를 "application/json"으로 맞추었구요.
문자열을 보낼때는 JSON.stringfiy() 함수를 이용해 자바스크립트 객체를 문자열로 변환하였습니다.

그럼 이 컨트롤러를 등록해야하는데요 어디서 할까요?
네, 맞습니다. 이것도 미들웨어 함수이기 때문에 app.js에서 use() 메소드로 등록해야겠지요.

그리고 이 index 함수를 모듈로 노출해 줍니다.
기본적인 조회 기능이기 때문에 함수 이름을 index로 정했답니다.

```js
// ...
const apiPost = require('./routes/api/post');

app.use('/', index.listPosts())
app.use('/api/posts', apiPost.index()) // 라우트 컨트롤러를 추가합니다
app.use(errors.error404())
```

"/" 라우트를 추가한 방법과 동일하게 "/api/posts" 라우트도 그 아래 추가합니다.

그럼 서버를 재실행하고 확인해 볼까요?

![](/assets/imgs/2018/12/12/result_3.png)

API로 응답받은 데이터를 화면에 잘 뿌려주었습니다.

우리가 만들었던 API 컨트롤러는 비지니스 로직 섹션으로 왼쪽 아랫 부분으로 구분했습니다.

![](/assets/imgs/2018/12/12/struct.png)


## 정리

* 포스트 조회 API를 구현했습니다.
* JSON 형식의 응답을 알아 보았습니다.


[목차 바로가기](/series/2018/12/01/node-web-0_index.html)