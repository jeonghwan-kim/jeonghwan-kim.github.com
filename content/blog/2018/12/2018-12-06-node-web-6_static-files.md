---
title: "[Node.js코드랩] 6.정적 파일"
layout: post
summary: 정적파일을 처리할 수 있습니다
category: series
seriesId: "555b6438-4a71-51d0-9156-a1d5ca4d5eab"
---

## 🌳목표

서버에 자원 중에서 브라우져에 다운로드하여 화면을 그리는 파일을 정적파일이라고 합니다.
이번에 이 기능을 만들어 봅니다.

## 정적 파일이란?

미리 만들어둔 브랜치로 이동하겠습니다.

```
$ git checkout -f module/static-files
```

public 폴더가 보이죠? 이곳에 모든 정적파일을 모아두었습니다.

```
$ tree public

public
├── css
│   └── style.css
├── imgs
│   └── twitter.png
├── index.html
└── js
    └── script.js
```

이 파일을 브라우저에서 요청을 하면 서버에서는 다운로드 할수 있도록 처리해 주어야 합니다.

## 🐤실습 - 정적 파일 요청에 응답하는 기능 구현 1

클라이언트 요청시 "Hello world" 문자열 대신 public/index.html 파일을 응답하는 기능을 구현하세요.

_힌트: file system 기본 모듈로 파일을 읽고 응답할 수 있습니다._

## 🐤풀이

fs (file system) 모듈을 처음 써 보는데요, 쉽게 해결하셨나요?
그럼 같이 풀어보겠습니다.

기존에 "Hello world"를 응답하는 코드는 src/Application.js에 있었죠?
이 파일을 수정해 보겠습니다.

```js
const path = require("path")
const fs = require("fs")

const Application = () => {
  const server = http.createServer((req, res) => {
    // ...

    const filePath = path.join(__dirname, "../public/index.html")
    fs.readFile(filePath, (err, data) => {
      if (err) throw err

      res.end(data)
    })
  })
}
```

path 모듈의 join을 이용해서 현재경로(\_\_dirname)와 파일이 위치한 상대 경로(../public/index.html)을 계산합니다.
filePath에는 index.html의 절대 경로가 저장 되겠지요.

그리고 나서 fs 모듈의 readFile 함수로 경로의 파일을 읽습니다.
에러를 확인 한뒤 정상이면 data에 파일 내용이 문자열로 들어온 것입니다.

마지막에 res.end() 함수로 파일 내용을 응답해 주고 있습니다.

저장하고 한번 브라우져에서 확인해 볼까요?

![](/assets/imgs/2018/12/06/browser_result_1.png)

HTML 마크업이 그대로 출력되었습니다. 우리가 원하는건 웹페이지로 렌더링 되는건데 말이죠.

이 문제를 해결하려면 HTTP 헤더값 중 하나를 변경해야 합니다.

```js
res.statusCode = 200
res.setHeader("Content-Type", "text/html")
```

파일 내용을 응답하기 전에 Content-Type 헤더를 text/plain 에서 text/html로 설정합니다.

저장하고 다시 브라우져로 확인해 볼까요?

![](/assets/imgs/2018/12/06/browser_result_2.png)

이제야 웹페이지처럼 나오는 것을 확인했네요.

하지만 이미지 부분이 깨져서 나오는데요? 크롬 개발자 도구로 자세히 살펴 볼까요?

![](/assets/imgs/2018/12/06/browser_result_3.png)

index.html은 내부 코드에서 css, js, image 파일을 추가로 요청합니다.
그런데 이 요청에 대한 응답이 전부 index.html 파일의 내용과 똑같네요.

그렇습니다. Application에서 모든 요청에 대해 index.html만 응답하도록 코딩했기 때문이에요.

## 🐤실습 - 정적 파일 요청에 응답하는 기능 구현 2

index.html에서 추가로 요청하는 정적 리소스인 JS, CSS, IMAGE도 제공하는 기능을 구현하세요.

_힌트: mineType, content-type으로 검색해 보세요. req.url로 요청 주소에 접근할 수 있습니다. path.parse().ext로 확장자를 알 수 있습니다._

## 🐤풀이

이번건 조금 어려웠을 수도 있게네요. 그럼 같이 풀어 보겠습니다.

```js
const mimeType = {
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".eot": "appliaction/vnd.ms-fontobject",
  ".ttf": "aplication/font-sfnt",
}
```

먼저 mineType 딕셔너리를 만들어 확장자 키에 마임타임 값을 사용했습니다.
요청 주소를 파싱해서 확장자에 따라 content-type 헤더 값을 동적으로 설정하려고 합니다.

```js
const ext = path.parse(req.url).ext
const publicPath = path.join(__dirname, "../public")
```

req.url을 통해 요청 주소에 접근할 수 있습니다. 이걸 path.parse() 함수의 인자로 넘기면 주소를 파싱하는데 그 결과 ext 키에 확장자 정보가 담겨 있습니다. 이것을 ext 상수에 저장했구요.

정적 파일은 모두 public 폴더에 있기 때문에 절대 경로를 계산해서 publicPath 상수에 저장했습니다.

```js
if (Object.keys(mimeType).includes(ext)) {
  fs.readFile(`${publicPath}${req.url}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
    } else {
      res.statusCode = 200
      res.setHeader('Content-Type', mimeType[ext]);
      res.end(data)
    })
  })
} else {
  res.statusCode = 200;
  // ...
```

요청한 확장자가 mineType 딕셔너리에 있을 경우 첫번째 if 구문을 실행하겠죠.
publicPath와 req.url를 합쳐 정적 파일을 읽습니다.
만약 파일 읽기에 실패한다면(가령 파일이 없을 경우) Not found를 의미하는 404를 응답했구요, 파일이 있다면 memeType[ext]로 content-type 헤더 값을 동적으로 알아내서 응답했습니다.

요청한 확장자가 mineType 딕셔너리에 없다면 이전과 동일하게 index.html을 응답하도록 했구요.

그럼 저장하고 브라우져로 확인해 보겠습니다.

![](/assets/imgs/2018/12/06/browser_result_4.png)

이제야 비로소 웹 페이지가 제대로 보이는군요.

## 정리

- HTML, CSS, JS, IMAGE 처럼 브라우져에서 렌더링 되는 자원을 정적파일이라고 합니다.
- MineType을 설정하여 정적 파일 제공 기능을 구현했습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)
