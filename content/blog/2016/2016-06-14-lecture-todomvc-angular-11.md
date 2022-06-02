---
title: "앵귤러로 Todo앱 만들기 11 - Static Files"
layout: post
category: 연재물
series: "앵귤러로 Todo앱 만들기"
tags: [expressjs, lecture]
slug: /lectures/todomvc-angular/11/
date: 2016-06-14 09:00:11
---

사실 우리 싸이트의 홈페이지로 접속하면 angular로 만들었던 index.html 페이지가 로딩되는 것이 자연스럽니다.
결국은 서버에 있는 프론트엔드 코드들이 브라우져로 다운로드 되어야 하는데
이러한 파일들을 우리는 정적파일(Static Files) 이라고 부르고 express.js는 그러한 기능을 제공한다.

## static file 설정하기

express 사이트에 [static file 설정하는 방법](http://expressjs.com/en/starter/static-files.html)이 잘 나와있으니 이것을 참고하자.

`app.use(express.static('폴더명'));` 코드를 작성하면 된다.
우리는 이럴줄 알고 정적파일을 모두 client 폴더로 이동해 놨다.
서버 코드에 `app.use(express.static('../client'));`를 추가하면 된다.

그러나 경로를 계산하는데 조금 까다로울 수 있다.
서버의 절대 경로를 계산해서 설정하는 것이 확실하다.
그래서 path 모듈과 `__dirname` 글로벌 변수를 사용하여 절대 경로를 계산한다.

```javascript
app.use("/", express.static(path.join(__dirname, "../client")))
```

그리고 "hello world!"" 문자열을 보내줬던 라우팅 설정도 변경한다.
`sendfile()` 함수롤 index.html 파일을 보내도록 설정한다.

```javascript
app.get("/", function (req, res) {
  res.sendfile("index.html")
})
```

이 코드를 추가하고 서버를 재구동한 뒤 브라우져로 접속해 보자.
index.html은 보이는것 같지만 뭔가 깨져 보인다.
왜일까?

증상을 보면 스타일시트가 재대로 안먹었고 앵귤러 라이브러리도 다운로드 되지 않은 것같다.
브라우져 개발자 툴로 확인해봐라.
다운로드 되지 않은 파일들은 node_modules 폴더에 있는 것들이다.
브라우져에서 서버의 node_modules 폴더에 접근할수 없기 때문인것 같다.
따라서 node_moudles 폴더도 정적파일로 설정해 주어야 한다.

```javascript
app.use(
  "/node_modules",
  express.static(path.join(__dirname, "../node_modules"))
)
```

서버를 재구동하고 다시 접속해서 확인해보자.
우리가 만들었던 앵귤러 페이지가 제대로 보일 것이다.

![](/assets/imgs/2016/lecture-todomvc-angular-14-result1.png)
