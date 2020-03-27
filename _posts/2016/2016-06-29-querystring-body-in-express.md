---
title: '노드에서는 쿼리스트링 인코딩을 어떻게 처리할까?'
layout: post
category: dev
tags:
  expressjs
featured_image:
summary: 'Nodejs, Expressjs, Request모듈에서 쿼리스트링 인코딩을 어떻게 처리하고 있을까? 그리고 어떻게 사용해야 할까?'
permalink: /2016/06/29/querystring-body-in-express.html
videoId: 4
---

디비가 없는 서버를 만들고 있다. 디비가 없다니 무슨말인가 싶을 것이다.
운영중인 웹서비스에 모바일 서비스를 추가하기위한 중계서버를 만들고 있다.
모바일 요청을 그대로 메인 서버로 전달하는 역할이다.
따라서 http 요청을 많이 하는데 url에 대한 인코딩 이슈로 몇 일간 고생한 적이 있다.

> 그런데 왜 URL을 인코딩 해야 하는거죠?

어떻게 설명해야 비개발자인 그를 쉽게 이해 시킬수 있을까?
할머니에게 설명할 수 있을 정도가 되어야 제대로 알고 있는 것이라고 했는데......
난 url 인코딩에 대해 정확히 모르고 있었다.


## URL 인코딩하는 이유

주소를 인코딩 이유는 [regularmotion 블로그](http://regularmotion.kr/url-encoding-url/)에 잘 설명되어 있다.
간단히 정리하면 URL은 아스키코드로 이뤄져야하기 때문에 그 외의 문자는 "%"와 16진수 문자를 조합해 인코딩 한다는 것이다.
이것을 **이스케이프(escape) 처리된 url** 이라고도 한다.

노드에서도 [querystring](https://nodejs.org/dist/latest-v4.x/docs/api/querystring.html)모듈에서 제공하는 함수 중에는 `escape()`, `unescape()`가 있어 문자열을 인코딩/디코딩할 수 있다.

```javascript
var qs = require('querystring');
var str = 'apple 쥬스';
var encodedStr = qs.escape(str);          // 'apple%20%EC%A5%AC%EC%8A%A4'
var decodedStr = qs.unescape(encodedStr); // 'apple 쥬스'
assert.equal(str, decodedStr);
```

자 그럼 몇 가지 궁금한게 생겼다.

> 노드 엔진에서는 url을 어떻게 처리할까?

> 익스프레스 엔진에서는?

> Request 모듈에서는?

자주 사용하는 라이브러리이기 때문에 이번 기회에 다시한번 짚어보자.


## http 모듈의 쿼리스트링

노드 [http](https://nodejs.org/dist/latest-v4.x/docs/api/http.html) 모듈은 어떻게 url을 처리할까?  
간단하게 서버를 구동하여 curl로 테스트 해보자.

```javascript
require('http').createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`${req.url}\n`);
}).listen(3000, 'localhost', () => {
  console.log('server is listening 3001 port');
});
```

http 모듈은 `createServer()` 함수의 첫번째 파라매터 `req`를 통해 클라이언트의 요청 정보에 접근할 수 있다.
`req.url`은 클라이언트가 서버에 요청한 url 문자열이 저장되어 있다.

curl로 요청해서 url이 어떻게 처리되는지 확인해보자.

```bash
$ curl -X GET "http://localhost:3001?q=apple주스"
/?q=appleì£¼ì¤
```

인코딩 처리없이 보내는 경우 http 모듈은 예상치 못한 문자열로 데이터를 수신한다.
curl 요청하는 클라이언트와 http 모듈로 작성한 서버간에 아스키 문자가 아닌 것은 이상하게 변경되는 것을 확인했다.
그럼 이번엔 쿼리스트링을 인코딩하여 보내보자.

```bash
$ curl -X GET "http://localhost:3000?q=apple%20%EC%A5%AC%EC%8A%A4"
/?q=apple%20%EC%A5%AC%EC%8A%A4
```

보낸 데이터를 그대로 응답한다.
http 모듈은 인코딩한 쿼리스트링에 대해 아무런 작업을 하지 않는 것을 확인했다.
**따라서 http 모듈은 요청 데이터를 사용할 때 이를 디코딩해서 사용해야 한다.**

```javascript
var qs = require('querystring');
var decodedUrl = qs.unescape(req.url);
```

## express 모듈의 쿼리스트링

익스프레스 모듈에서는 쿼리스트링을 어떻게 처리할까?

```javascript
var express = require('express');
var app = express();

app.get('/', (req, res) => {
  console.log(req.url);
  console.log(req.query);
})

app.listen(3001, () => console.log('express server is listening 3001'));
```

위 서버를 구동하여 동일하게 curl 요청을 해보자.

```bash
/?q=apple%20%EC%A5%AC%EC%8A%A4
//{ q: 'apple 쥬스' }
```

express는 http 모듈을 내부적으로 사용하고 있기 때문에 `req.url` 변수에 http 모듈로 테스트했을 때와 동일한 값이 들어간다.
그러나 이를 디코딩하고 파싱하여 `req.query` 변수에 객체를 할당해 준다.
**express 프레임웍에서는 별도의 디코딩 작업 없이 `req.query` 변수를 통해서 요청값에 접근하면 된다.**


## request 모듈의 쿼리스트링

그럼 반대로 서버에서 다른 서버로 요청을 할때는 쿼리스트링을 어떻게 처리해야 할까?
자주 사용하는 [request](https://github.com/request/request) 모듈을 살펴보자.

우선 쿼리스트링 인코딩없이 리퀘스트를 날려보자.

```javascript
const request = require('request');
const qs = require('querystring');
let url = 'http://localhost:3001?q=apple 쥬스';

request.get(url, (err, res) => {
    if (err) throw err;
    console.log(res.body); // {"q":"apple l¤"}
});
```

http 모듈에서는 이러한 요청에 대해 깨진 문자열로 받는다.
익스프레스 엔진도 req.url를 사용하니깐 제대로 데이터를 파싱하지 못했다.

```
req.url = "/?q=apple%20l¤"
req.query = {
  q: "apple l¤"
}
```

이번에 쿼리스트링 인코딩 후 리퀘스트를 날려보자.

```javascript
const request = require('request');
const qs = require('querystring');
let url = `http://localhost:3001?q=${qs.escape('apple 쥬스')}`; // 쿼리스트링 인코딩 처리

request.get(url, (err, res) => {
    if (err) throw err;
    console.log(res.body); // {"q":"apple 쥬스"}
});
```

"%" 문자와 16진수 문자로 디코딩되어 제대로 전달되었다.
익스프레스 엔진도 이 문자열을 파싱하여 유니코드로 제대로 디코딩하였다.

```
req.url = "/?q=apple%20%EC%A5%AC%EC%8A%A4"
req.query = {
  q: "apple 쥬스"
}
```

**따라서 request 모듈을 사용해 http 리퀘스트 요청을 할때는 쿼리스트링에 대해 에스케이프 처리를 해줘야한다.**
