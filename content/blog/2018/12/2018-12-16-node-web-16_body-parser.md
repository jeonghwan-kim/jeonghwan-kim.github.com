---
slug: "/series/2018/12/16/node-web-16_body-parser.html"
date: 2018-12-16
title: "[Node.js코드랩] 16. body-parser"
layout: post
category: series
seriesId: series-2018-12-01-weplanet-codelab
tags: [lecture]
---

## 🌳목표

요청 바디 데이터를 처리하는 body-parser를 만듭니다.
그리고 이것을 이용해 포스트 생성 API 개발을 완료합니다.

## 스트림 데이터

지난 시간에 POST 메소드를 갖는 엔드포인트를 라우터에 추가했습니다.
다만 컨트롤러 함수는 비어 있는 채로 남겨 두었는데요.
req.body 값을 로그로 출력하는것 까지만 코딩했습니다.

이 데이터는 어떻게 접근할 수 있을까요?

[노드 문서](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#request-body)에서 요청 바디에 접근하는 방법을 설명하고 있는데요 정리하면 다음 순서를 따릅니다.

- req는 ReadableStream 인터페이스 구현체다
- 이것은 스트림이기 때문에 "data"와 "end" 이벤트를 이용해서 데이터를 수신할 수 있다
- "data" 이벤트와 함께 들어온 데이터는 Buffer 타입이다
- 이것을 문자열로 변환하려면 데이터를 배열로 들고 있다가 "end" 이벤트 시점에 합치면 된다

위 알고리즘을 기술한 것이 아래 샘플 코드입니다.

```js
let body = []
request
  .on("data", chunk => {
    body.push(chunk)
  })
  .on("end", () => {
    body = Buffer.concat(body).toString()
    // 이 시점에 body는 전체 요청 데이터를 문자열 형태로 가지고 있다
    // (at this point, `body` has the entire request body stored in it as a string)
  })
```

API 컨트롤러 함수에서 요청 바디에 쉽게 접근하려면 좋겠는데 매 요청마다 위 코딩을 하는건 미련한 방법처럼 보입니다.

만약 컨트롤러까지 오기 전에 미리 바디 데이터를 파싱하여 req.body에 담아 놓는다면 어떨까요?
이후 모든 컨트롤러에서는 간단히 req.body를 이용하면 데이터에 쉽게 접근할 수 있을 것 같네요.

## 🐤실습 - body-parser를 만들어 보세요

req.path와 req.query도 이런 방식으로 데이터를 미리 가공했었죠?
이것과 비슷하게 req.body에도 미리 가공된 요청 바디를 저장해 보세요.

## 🐤풀이

같이 풀어보겠습니다.
바디 파서를 미들웨어 함수로 만들기로 할게요.
middlewares 폴더에 body-parser.js 파일을 만들어 아래 코드를 입력합니다.

```js
const bodyParser = () => (req, res, next) => {
  let body = []

  req.on('data', chunk => {
    body.push(chunk)
    console.log('data', chunk)
  })

  req.on('end', () => {
    body = Buffer.concat(body).toString()
    console.log('end', body)
  }
}

module.exports = bodyParser;
```

이벤트 기반으로 스트림 데이터 바디를 처리하는 코드는 샘플 코드에서 그대로 배껴 왔습니다.
다만 그 시점에 데이터가 각 각 어떤 모습으로 변하는지 확인하기 위해 터미널에 출력했습니다.

미들웨어를 우리 어플리케이션에 추가해 보지요. app.js를 수정합니다.

```js
const bodyParser = require("./middlewares/body-parser")

app.use(logger())
app.use(bodyParser()) // body-parser를 추가
```

서버를 재구동하고 폼을 다시 전송해 볼까요?

![](/assets/imgs/2018/12/16/result_1.png)

"data" 이벤트가 발생할 때는 버퍼값이 출력되었습니다.
데이터를 모두 수신한 "end" 이벤트가 발생할 때는 버퍼를 문자열로 변경하여 "title=asd&body=sdf"라는 값이 출력되었네요.

가만히 보면 쿼리스트링과 구조가 똑같네요?
네, 그렇습니다.
쿼리스트링을 오브젝트로 파싱한 것처럼,
이 문자열도 자바스크립트 객체로 파싱한 뒤 req.body에 넣어두면 사용하기 편리하겠네요.

body-parser를 더 개발해 보죠.

```js
req.on("end", () => {
  body = Buffer.concat(body).toString()

  body = body.split("&").reduce((body, pair) => {
    if (!pair) return body
    const frg = pair.split("=")
    body[frg[0]] = frg[1]
    return body
  }, {})

  req.body = body
  next()
})
```

특정 문자를 기준으로 파싱하는 부분은 쿼리스트링 파싱과 같은 로직입니다.
파싱한 결과 body에 오브젝트 형태로 데이터가 담기겠지요.
그러면 req.body에 이 객체를 저장합니다.

마지막엔 다음 미들웨어를 실행해 주기 위해 next() 함수를 호출합니다.

![](/assets/imgs/2018/12/16/struct_1.png)

body-parser는 전체 구조도 중 우측 하단의 써드파티 라이브러리 섹션에 위치하는 녀석입니다.

## 🐤실습 - 포스트 추가 API 개발을 완성하세요

req.body 데이터를 이용해 POST /api/posts 엔드포인트를 마져 구현해 보세요.
코드를 미쳐 작성하지 못하신 분은 아래 브랜치로 이동한 뒤 실습을 진행할 수 있습니다.

```
$ git checkout -f middleware/body-parser
```

_힌트: 201 응답, 새로운 데이터를 응답_

## 🐤풀이

잘 풀어 보셨나요? 그럼 같이 진행해 보겠습니다.

routers/api/post.js 파일을 마져 수정하지요.
두 부분으로 나눠 설명하겠습니다.

```js
const create = () => (req, res, next) => {
  const {title, body} = req.body
  const post = {title, body}

  if (!post.title || !post.body) {
    return res.status(400).send('parameter error')
  }
```

객체 해체 문법으로 title과 body를 각 상수값으로 가져옵니다.
그리고 기존 데이터 형식에 맞게 재 가공해서 post 객체를 만듭니다.

만약 title이나 body 값 중 어느 하나라도 부족하면 파라매터 에러를 의미하는 400번 상태코드를 응답하고 함수를 종료합니다.

```js
  posts = [post].concat(posts)

  res.status(201).json(post)
}
```

포스트 추가에 필요한 데이터가 확보되면 포스트를 담고 있는 배열 맨 앞에 추가합니다.

그리고 리소스 생성을 의미하는 201 상태코드와 생성된 포스트 객체를 응답 바디로 전달합니다.

그럼 여기까지 코딩을 마친 뒤 서버를 재구동 합시다.
브라우져를 통해 포스트 생성 폼을 전송해 볼까요?

![](/assets/imgs/2018/12/16/result_2.png)

입력한 post4가 맨 상단에 추가되었습니다.

## 정리

- 이벤트를 이용해 스트림 데이터를 처리하였습니다.
- 요청 바디를 파싱하여 API 컨트롤러에서 손쉽게 사용할수 있도록 하였습니다.
- 포스트 추가 API를 완성하였습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)
