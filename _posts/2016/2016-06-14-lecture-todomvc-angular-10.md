---
title: '앵귤러로 Todo앱 만들기 10 - Express.js로 웹서버 만들기'
layout: post
category: angular
tags:
  angularjs
  lecture
permalink: /lectures/todomvc-angular/10/
date: 2016-06-14 17:42:00
featured_image: /assets/imgs/2016/todomvc-logo.png
summary: Angular.js, Node.js를 이용해서 Todo앱을 만들어 보자
---

이제부터 서버를 만들어 보자.
서버 기능은 두 가지라고 앞서 얘기했다. (참고: [앵귤러로 Todo앱 만들기 1 - 노드 설치노드 설치](/lectures/todomvc-angular/1/))

1. 정적파일 호스팅
2. API 기능

이것을 쉽게 구현할수 있는 것이 [Express.js](http://expressjs.com)라고 하는 웹프레임워크다.
npm으로 익스프레스 엔진을 프로젝트에 추가해보자.

```bash
$ npm install express --save
```

package.json에 express 모듈이 추가 되었을 것이다.
현재 버전으로는 v4.13.4 버전이 설치 되었다.

앞으로 server 폴더 서버 코드를 작성해 하겠다.
express.js 공식 사이트에 있는 [hello world 샘플 코드](http://expressjs.com/en/starter/hello-world.html)를 사용해보자.

server/app.js:

```javascript
// part 1
var express = require('express');
var app = express();

// part 2
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// part 3
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

 설명을 위해 코드을 세 부분으로 나눠서 주석을 달았다.

 part 1에서 express 모듈을 로딩한다.
 그리고 인스턴스를 하나 생성해서 `app` 변수에 저장한다.
 뒤에 `app` 변수를 가지고 서버를 세팅하고 구동시킬 것이다.

 part 2에서는 기본 라우팅 설정을 했다.
 도메인에 접속하면 "Hello World!" 문자열을 출력하도록 했다

 part3에서는 `listen()` 함수로 서버를 구동한다.
 3000번 포트를 사용할 것이며 서버가 구동되는 동시에 "Express app listeing ..." 문구가 서버측 콘솔에 찍힐 것이다.

명령어로 노드 어플리케이션을 실행 시켜보자.

```bash
$ node server/app
Example app listening on port 3000!
```

웹브라우져를 열고 localhost:3000 주소로 접속해 보자.

![](/assets/imgs/2016/lecture-todomvc-angular-13-result1.png)


## NPM으로 간단히 서버 구동하기

이전에 npm의 기능중 서버 구동기능을 언급했다.
package.json에 npm 명령어를 설정할 수 있다.
아래처럼 start 스크립트를 추가해보자.

```json
{
  "scripts": {
    "start": "node server/app"
  },
}
```

그리고 터미널에 `npm start`를 실행하면 동일하게 노드 서버가 구동된다.
앞으로는 npm start으로 서버를 구동시키자.


관련글:

{% include lecture-todomvc-angular-1-index.html %}
