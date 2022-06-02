---
title: "앵귤러로 Todo앱 만들기 12 - APIs"
layout: post
category: 연재물
seriesId: "앵귤러로 Todo앱 만들기"
tags: [expressjs, lecture]
slug: /lectures/todomvc-angular/12/
date: 2016-06-14 09:00:12
---

이번엔 서버의 두 번째 기능 API를 만들어 보자.

API는 왜 만들어야할까?
클라이언트와 통신하기 위해서다.
그럼 무슨 목적으로 클라이언트와 서버는 통신을 하는가?
데이터다.
일반적으로 데이터는 서버에서 관리한다.
서버에 데이터베이스를 운영한다던지 써드파티 API를 이용해 데이터를 서버로 가져온다던지...
결국은 클라이언트 입장에서 데이터 관리는 서버에게 **요청** 해야 한다.

우리가 만들었던 앵귤러 프로그램이 데이터를 어떻게 처리했는지 잠깐 생각해보자.

- 템플릿에서는 데이터를 보여줬다.
- 컨트롤러에서는 데이터를 가져와서 보여줬다.
- 서비스에는 컨트롤러로 데이터를 보내주는데 서비스 내에 특정 변수에 배열 형태로 저장되어 있었다. 이것이 `todos` 변수다.

js/services/todoStorage.js:

```javascript
angular.module("todomvc").factory("todomvcStorage", function () {
  var storage = {
    todos: [
      {
        // <-- 바로 요 변수가 데이터다
        id: 1,
        title: "요가 수행하기",
        completed: false,
      },
      {
        id: 2,
        title: "어머니 용돈 드리기",
        completed: true,
      },
    ],
  }
})
```

사실 앵귤러 서비스는 데이터를 가지고 있으면 안된다.
사용자의 브라우져에 있는 것이기 때문에 민감한 정보라면 서버에서 관리해야 한다.
이전에는 서버 개발 전이기 때문에 그냥 그렇게 진행했지만 이번에는 서버로 이 데이터를 가져올 것이다.
그럼 기존의 앵귤러 서비스는 어떤 역할을 하게 될까?
백엔드 서버 API를 이용해 데이터를 요청하는 기능을 하게될 것이다.
이젠 앵귤러 서비스의 데이터 관리를 백엔드로 위임한다고 보면 된다.

## REST APIS

많이 들어봤음직한 용어다.
REST API란 서버 자원 단위로 설계되어진 API를 의미하는데 과거 규칙없는 API 네이밍에 비교하여 이해하면 쉽다.
예를 들어 사용자 정보를 조회하는 API를 어떻게 이름지어야 할까?
getUsers 라고 할수 있을 것이다. 메쏘드도 POST, GET을 혼용해서 사용하기도 했다.
그러나 REST API라고 불리려면 `GET /users` 라고 해야한다.
사용자를 조회하기 때문에 GET 메소드를 사용하고 URL에는 명사만 와야한다.
왜냐하면 리소스는 명사이기 때문이다.

좀더 자세한 사항은 [서버 개발자 입장에서 바라본 모바일 API 디자인](/2016/03/29/mobile-rest-api.html)을 참고하시라.

같은 원칙으로 우리가 만들 API 목록은 다음과 같다.

| method | url            | function       |
| ------ | -------------- | -------------- |
| POST   | /api/todos     | todo 생성      |
| GET    | /api/todos     | todo 목록 조회 |
| PUT    | /api/todos/:id | todo 갱신      |
| DELETE | /api/todos/:id | todo 삭제      |

## GET /api/todos 만들기

server/app.js:

```javascript
// 앵귤러 서비스쪽에 있던 배열을 노드 코드로 옮겼다.
var todos = [
  {
    id: 1,
    title: "todo 1",
    completed: false,
  },
  {
    id: 2,
    title: "todo 2",
    completed: false,
  },
  {
    id: 3,
    title: "todo 3",
    completed: true,
  },
]

// GET /api/todos 라우팅 설정
app.get("/api/todos", function (req, res) {
  res.json(todos)
})
```

서비스에 있던 todos 배열을 서버 코드로 옮겨왔다.
그리고 app.get으로 라우팅 설정했다.
app.get() 함수는 get 메쏘드 요청에 대한 라우팅을 설정할수 있다.
첫번째 파라메터로 url 경로를 문자열로 설정한다.
두번째 파라메터는 해당 요청이 왔을 경우 실행되는 콜백 함수이다.
콜백함수는 다시 두 개 파라매터를 가지고 온다.
`req`는 클라이언트의 요청(Request) 정보를 담는 객체로서 쿼리스트링, 경로의 파라메터, 바디데이터에 접근할 수 있다.
`res`는 서버의 응답(Response) 정보를 담고있는 객체로서 문자열이나 파일 그리고 json으로 응답할 수 있다.
우리는 todos 를 json으로 응답하는 코드를 작성했다.

## Postman

백엔드 개발할때 api를 테스트하는 경우가 많은데 postman은 이때 사용하는 툴이다.
[여기](https://www.getpostman.com)에서 다운로드 받아 설치해 두자.
서버 주소를 입력하고 요청 url과 메쏘드를 입력한뒤 send 버튼을 누르면 서버의 응답결과를 바로 확인할 수 있다.
앞으로 백엔드 개발시 자주 사용할 것이기 때문에 반드시 사용법을 알아두자!

![](/assets/imgs/2016/lecture-todomvc-angular-15-result1.png)

## BodyParser

`POST /api/todos`를 만들어 보자.
post 메쏘드는 데이터를 보낼때 http 바디에 그 정보를 저장한다.
하지만 express에서는 이 바디 데이터에 접근할 방법이 없다.
[body-parser](https://github.com/expressjs/body-parser)는 익스프레스에서 http 요청 바디에 접근할 수 있도록하는 미들웨다.
원래는 express 자체 모듈에 있었지만 v4 부터는 별도의 모듈로 떨어져 나왔다.
좀더 express를 가볍게 가져가기 위함이고 개발자 필요에 따라 추가하도록 한 것 같다.

body-parser를 추가한다.

```bash
$ npm isntall bady-parser --save
```

서버 코드에 설치한 모듈을 추가하고 익스프레스에 미들웨어로 추가한다.

```javascript
var bodyParser = require("body-parser")

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
```

라우트 핸들러 함수에서 req.body를 통해 바디 데이터에 접근할 수 있다.

## POST /api/todos

todo를 추가하는 api를 만들어 보자.
기본 로직은 서비스 로직과 동일하다.
서비스와는 다르게 1) 타이틀이 없는 경우 400 에러를 반환하는 부분이 추가되었고 2) 새로 생성된 todo를 json으로 응답한다.

```javascript
app.post("/api/todos", function (req, res) {
  if (!req.body.title) {
    return res.status(400).send()
  }

  var newId = !todos.length ? 1 : todos[todos.length - 1].id + 1

  var newTodo = {
    id: newId,
    title: req.body.title,
    completed: false,
  }

  todos.push(newTodo)

  res.json(newTodo)
})
```

Delete와 PUT은 직접 작성해보자!

이것으로 서버의 두 가지 기능을 모두 구현했다.

1. Static File
1. APIs
