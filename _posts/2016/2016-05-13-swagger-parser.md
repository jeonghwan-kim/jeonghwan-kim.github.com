---
title: '스웨거 문서 문법 체크하기'
layout: post
summary: 'swagger-parser로 스웨거 문법을 체크하는 방법'
tags: [swagger]
featured_image: /assets/imgs/2016/swagger-logo.png
---

팀에 스웨거(swagger)를 도입한 이후 개발 패턴이 많이 변했다.

이전에는 API문서를 주로 깃헙 위키나 Apidoc으로 작성하고 포스트맨(Postman)으로 테스트했다.
문서 작성 시간이 많을 뿐만 아니라 수많은 파라매터를 일일이 입력해야 하는데 상당히 번거로웠다.

스웨거를 사용하면서 이 두 가지 작업이 한 곳에서 이뤄졌다.
작성한 문서를 보고 바로 테스트 할 수 있게되었다.
실제로 동작하는 파라매터를 기본값으로 세팅할 수 있어서 API 테스트하는데도 꽤 수월하다.

며칠전 다른 개발자가 내가 만든 스웨거 페이지가 제대로 안 보인다고 얘기했다.
사파리는 보이고 크롬은 안보이는 문제였다.
사실 사파리에서 보이긴 하지만 swagger-ui 상단에 메세지가 있었다.

> fetching resource list: http://localhost:3000/swagger-document; Please wait.

## swagger-parser

[Swagger 2.0 Parser and validator](http://bigstickcarpet.com/swagger-parser/www/index.html)는
웹에서 스웨거 문서 문법체크를 할 수 있는 사이트다.

![swagger-parser-001](/assets/imgs/2016/swagger-parser-001.png)

작성한 문서의 주소(url)나 텍스트를 폼에 입력한 뒤  "Validate it"을 클릭하면 문법 체크를 수행한다.
문서에서 문법 에러를 발견하면 결과를 보여 준다.


## 노드용 모듈

이 사이트는 검증 모듈을 깃헙으로 제공한다.
[노드용 모듈](https://github.com/BigstickCarpet/swagger-parser)이 있는데
이것을 이용하면 스웨거 문서 로딩시 검증 로직을 수행할 수 있을 것 같다.

먼저 설치하고

```
$ npm install swagger-parser --save
```

모듈을 로딩한다.

```javascript
const SwaggerParser = require('swagger-parser');
```

스웨거 문서를 JSON 형식으로 응답하는 API에 검증 로직을 추가한다.
참고로 익스프레스(Express.js)를 사용했다.

```javascript
app.get('/swagger-document', (req, res) => {
  let document = '' // 여기에 스웨거 문서를 로딩한다

  SwaggerParser.validate(docuemtn, (err, api) => {

    // 문법 에러
    if (err) {
      console.error(err);
      res.json({error: err}); // 에러 메세지를 보낸다
    }

    // 문법 검증 통과
    else {
      res.json(api); // 문서를 보낸다
    }
  })
});

```

swagger-parser로 검증된 경우에만 스웨거 문서를 응답하고 그렇지 않을 경우 에러 메세지를 응답하도록 했다.

기존 스웨거 문서에 적용해 보니 에러가 쏟아진다.
대부분 파라매터 바디에 required 옵션을 잘못 추가한 것이 원인이었다.

[스웨거 스펙](http://swagger.io/specification/)을 꼼꼼하게 읽어보지 못한 탓이다.
하지만 누가 스펙을 다 읽어보고 개발할까?
그런점에서 swagger-parser는 참 유용한 것 같다.
