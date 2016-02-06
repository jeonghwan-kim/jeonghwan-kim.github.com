---
id: 868
title: 기존 프로젝트와 Swagger-ui 연동하기
date: 2015-11-24T20:33:24+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=868
permalink: /%ea%b8%b0%ec%a1%b4-%ed%94%84%eb%a1%9c%ec%a0%9d%ed%8a%b8%ec%99%80-swagger-ui-%ec%97%b0%eb%8f%99%ed%95%98%ea%b8%b0/
categories:
  - Swagger
tags:
  - swagger
  - swagger-spec
  - swagger-ui
---
모바일 API를 개발하면서 클라이언트 개발자와 협업하기 위해 API 문서를 작성한다. 보통은 깃헙 위키를 사용하는데 쉽게 편집하고 공개할수 있는게 장점이 다. 한 때는 [APIDOC](http://apidocjs.com/)을 사용하기도 했다. 코드에 주석으로 문서를 작성하면 html 파일로 문서를 생성한다. 이를 서버에 올려 호스팅하는 방식으로 사용했다. 모바일 개발자 입장에서는 문서를 보면서 포스트맨(Postman)으로 API를 테스트했다.

스웨거([Swagger](http://swagger.io/))는 문서와 포스트맨을 합쳐놓은 것이라고 볼 수 있다. 여러 툴이 있지만 [Swagger-ui](https://github.com/swagger-api/swagger-ui)에 대해 알아보자. 이것은 자바스크립트와 스타일시트를 사용하는 html 파일이다. 서버에 올려서 호스팅하면 웹 브라우져로 문서를 볼 수 있다. 하지만 문서를 표현할 데이터가 없기때문에 껍떼기만 보일 뿐이다. 실제 문서 데이터는 json 형식으로 어디선가 불러와야 하는데 이를 [Swagger-spec](https://github.com/swagger-api/swagger-spec)이라고 한다. 스웨거는 이렇게 Swagger-spec 이라는 형식의 문서 데이터를 Swagger-ui라는 툴로 보여주는 구조다.

## 기존 프로젝트에 연동

여기 ExpressJS로 만들어 놓은 API 서버가 있다. 이 위에 스웨거를 적용해보자. 두 가지 순서로 진행한다.

* Swagger-ui 설치
* Sqggeer-spec API 개발

## Swagger-ui 설치

```
$ npm install swagger-ui --save
```

Swagger-ui를 설치하면 `node_modules/swagger-ui/dist` 폴더에 html 파일이 저장된다. 이것을 express 라우팅에 추가한다.

```javascript
// app.js
app.use('/swagger-ui', express.static(path.join(__dirname, './node_modules/swagger-ui/dist')));
```

웹 브라우져를 열고 http://localhost:3000/swagger-ui에 접속해보자.

<a href="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-24-오후-7.49.29.png"><img class="alignnone size-large wp-image-875" src="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-24-오후-7.49.29-1024x670.png" alt="스크린샷 2015-11-24 오후 7.49.29" width="640" height="419" /></a>

아직 swagger-spec 문서를 만들지 않았지만 기본적으로 설정된 url를  ajax로 호출해서 보여준다. 상단 인풋 텍스트 필드 값을 확인하면 아래와 같은 json 데이터를 볼 수 있다.

[http://petstore.swagger.io/v2/swagger.json](http://petstore.swagger.io/v2/swagger.json)

Swagger-ui에서 어떤식으로 저 주소를 로딩할까?

```javascript
// node_modules/swagger-ui/dist/index.html
 33       if (url && url.length > 1) {
 34         url = decodeURIComponent(url[1]);
 35       } else {
 36         url = "http://petstore.swagger.io/v2/swagger.json";
 37       }
```

주소에서 url 파라메터의 값을 사용한다. 그럼 기존 라우팅에 스웨거 데이터를 json으로 응답하는 api를 하나 더 만들어 `/swagger-ui?url=` 형식으로 접속하면 될 것같다.

## Swagger-spec

이제 api를 하나 더 만들어 보자.

```
// app.js
app.use('/v1/swagger.json', function(req, res) {
  res.json(require('./swagger.json'));
});
```

`/v1/swagger.json`으로 접속하면 Swaager 데이터를 Json으로 응답한다. 이제 `http://localhost:3000/swagger-ui?url=/v1/swaager.json/`으로 접속해 보자. 우리가 정의한 데이터가 Swagger-ui에서 보일 것이다.

<a href="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-24-오후-8.08.01.png"><img class="alignnone size-large wp-image-876" src="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-24-오후-8.08.01-1024x670.png" alt="스크린샷 2015-11-24 오후 8.08.01" width="640" height="419" /></a>

마지막으로 리다이렉션를 설정하여 `http://localhost:3000/swagger`로 접속하도록 하자.

```
// app.js
app.use('/swagger', function (req, res) {
  res.redirect('/swagger-ui?url=/v1/swagger.json');
});
```

## 참고
* 예제 코드: [https://github.com/jeonghwan-kim/swagger-on-the-express](https://github.com/jeonghwan-kim/swagger-on-the-express)
* [http://stackoverflow.com/questions/27724803/serve-out-swagger-ui-from-nodejs-express-project](http://stackoverflow.com/questions/27724803/serve-out-swagger-ui-from-nodejs-express-project)