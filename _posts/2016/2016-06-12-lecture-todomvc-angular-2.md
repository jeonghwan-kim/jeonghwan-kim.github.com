---
title: '앵귤러로 Todo앱 만들기 2 - 앵귤러 로딩'
layout: post
category: AngularJS
tags:
  angularjs
  lecture
permalink: /lectures/todomvc-angular/2/
featured_image: /assets/imgs/2016/todomvc-logo.png
summary: Angular.js, Node.js를 이용해서 Todo앱을 만들어 보자
---


## index.html

기본 html 파일부터 작성해 보자.

```bash
$ touch index.html
```

index.html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=yes">
  <title>Angular | TodoMVC</title>
</head>
<body>
</body>
</html>
```

모바일에서 잘보이도록 하기위해 뷰포트를 설정하고 타이틀만 있는 간단한 문서다.
브라우져로 열어보면 브라우저 탭에 타이트만 출력된다.

![](/assets/imgs/2016/lecture-todomvc-angular-2-result1.png)

우리는 이 파일에 앵귤러 라이브러리를 로딩할 것이다.
그런데 앵귤러를 로딩한다는 것은 뭘까?
제이쿼리 스크립트를 html 페이지에서 `<script>` 태그로 삽입하듯이 앵귤러도 마찬가지다.
그럼 앵귤러는 어디서 다운받아야할까?
물론 제이쿼리처럼 CDN을 제공하기는 하나 우리는 NPM을 통해 직접 프로젝트 폴더에 다운받아 볼 셈이다.


## 앵귤러 설치

```bash
$ npm install angular --save
```

npm 명령어를 이렇게 사용하면
1) 앵귤러 라이브러리가 node_modules 폴더 아래에 다운로드 되고,
2) package.json 파일에 관련 정보가 추가된다. (--save 옵션 때문)
1에서 다운받은 앵귤러는 index.html에 추가하면 될것인데 package.json 파일에 추가한 이유는 뭘까?

만약 이 프로젝트 소스를 다른 개발자와 함께 개발한다고 가정해 보자.
보통 소스코드에는 추가한 라이브러리 코드는 넣지 않는다.
인터넷 어딘가에 라이브러리 코드를 저장한 저장소가 있기 때문에 굳이 내 저장소 용량을 늘릴 필요가 없기 때문이다.
그리고 두번째 이유는 최신버전 라이브러리(버그가 수정된)를 사용할 수 있기 때문이다.

내 코드를 클론한 다른 개발자는 프로젝트에서 사용한 외부 라이브러리 설치를 해야하는데 이때 package.json 파일이 그 정보를 제공한다.
다른 개발자는 npm 명령어 한 줄로 해당 프로젝트에서 사용한 외부 모듈을 한 번에 설치할 수 있다.
그것도 버그가 수정된 최신 버전의 소스로 말이다.

```bash
$ npm install
```


## 앵귤러 로딩

다운받은 앵귤러 라이브러리는 html 파일에서 로딩한다.

index.html:

```html
<!-- ng-app으로 todomvc 앵귤러 모듈 사용을 브라우저에게 알린다 -->
<body ng-app="todomvc">

<!-- 앵귤러 로딩 -->
<script src="node_modules/angular/angular.js"></script>

<script src="js/app.js"></script>
</body>
```

앵귤러는 라이브러리를 로딩한뒤 `ng-app` 디렉티브를 설정함으로써 앵귤러 사용을 브라우져에게 알린다.
우리가 사용할 앵귤러 모듈은 "todomvc" 모듈이다.
그럼 이 모듈은 어디에 정의 되어 있고 누가 정의할까?
바로 우리가 만들 js/app.js에 정의 되어 있다.

js/app.js:

```javascript
angular.module('todoapp', []);
```

브라우져에서 index.html 파일을 띄우면 angular.js와 app.js 파일이 함께 다운로드되는 것을 확인할 수 있다.

![](/assets/imgs/2016/lecture-todomvc-angular-2-result2.png)



관련글:

{% include lecture-todomvc-angular-1-index.html %}
