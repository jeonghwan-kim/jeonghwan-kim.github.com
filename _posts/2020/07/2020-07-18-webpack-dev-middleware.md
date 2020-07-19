---
title: "webpack-dev-middleware"
layout: post
category: dev
tags: [webpack]
---

이제 프론트엔드 개발에 웹팩은 항상 달고 다닌다. 
ES6+ 뿐만 아니라 타입스크립트를 사용하려면 이것 없이는 쉽지 않다. 

웹팩과 더불어 필수로 사용하는 것이 webpack-dev-server 이다. 
잼스택(JAM Stack)으로 개발된 결과물을 바로 바로 확인하려면 개발용 웹서버가 필요한데 바로 webpack-dev-server의 역할이다.

번들링한 JS, CSS 따위의 정적파일을 서비스하고 접속한 브라우져가 화면을 그릴 수 있도록 자원을 제공한다.
데이터에 접근하기 위해 API를 사용할 때는, CORS를 해결해 주기도 한다.

정적파일 제공과 API 프로싱, 이 두 기능을 하는 webpack-dev-server만으로는 부족하다면, [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)를 고려해야할 시점이다. 

# webpack-dev-middleware

webpack-dev-middleware는 웹팩으로 빌드한 정적파일을 처리하는 녀석인데 익스프레스 스타일의 미들웨어다. 
webpack-dev-server도 익스프레스와 이 미들웨어를 사용한다(https://github.com/webpack/webpack-dev-server/blob/master/package.json#L68).


웹팩 패키지가 제공하는 함수를 실행하면 Compiler타입의 인스턴스를 반환한다.
인자로 웹팩 설정 객체를 전달하는데 보통은 설정 파일(webpack.config.js)에 있는 코드를 가져다 사용한다.

```js
const webpack = require('webpack');

// 웹팩 옵션을 webpack() 함수 인자로 넘겨 compiler를 얻는다
const compiler = webpack({
  // webpack options
});
```

그리고 이 객체를 webpack-dev-middleware 인자로 전달하는데, 미들웨어 안에서 빌드하려는 의도인 것 같다.
익스프레스 미들웨어로 설정한다.

```js
const middleware = require('webpack-dev-middleware');

// webpack-dev-middleware에 컴파일러를 절달하고 이걸 익스프레스 미들웨어로 설정한다.
app.use(
  middleware(compiler, {
    // webpack-dev-middleware options
  })
);
```

이렇게 만든 서버를 띄우면 webpack-dev-server와 비슷한 것이 된다.

# 언제 webpack-dev-middleware를 사용할까?

그럼 webpack-dev-middleware는 언제 사용할까?
프론트엔드 작업만 한다면 webpack-dev-server만으로도 개발 환경을 만들기에 충분하다. 
하지만 프로젝트에 서버 코드가 들어 간다면 필요할지도 모른다.

가령 모바일과 데스크탑 버전 두 벌을 만들 경우, 서버 코드가 포함된 프로젝트일 경우가 그렇다. 
각각 어떻게 활용할 수 있을지 정리해 보자.

# 사용예1: 유저 에이전트에 따라 정적 파일을 제공할 경우

반응형이 아니다. 모바일 버전과 데스크탑 버전 두 벌을 제공해야 하는 경우를 말한다.
서버에서는 요청한 브라우저에 따라 크기에 맞는 페이지를 제공하는데,
요청한 유저 에이전트(User Agent)를 분석해 브라우져 타입에 따라 최적화된 화면을 내보낸다.

익스프레스 미들웨어중에 유저 에이전트 문자열을 분석해서 사용하기 쉽게 만든것이 express-device다. 
이걸 이용해 식별하면 되겠다.

- 모바일일 경우: 이에 맞는 mobile.html을 제공한다.
- 데스크탑일 경우: 이에 맞는 desktop.html을 제공한다.


```js
const device = require('express-device');

//  유저에이전트에서 디바이스 정보를 추출한다. req.device 에 기록해 둔다.
app.use(device.capture());

// 요청한 유저 에이전트(User Agent)를 분석해 브라우져 타입에 따라 최적화된 화면을 내보낸다.
app.get('*', (req, res) => {
  // 디바이스가 desktop일 경우 desktop.html을 제공한다.
  if (req.device.type === 'desktop') {
      res.sendFile(path.resolve(__dirname, `../public/desktop.html`));
      return;
  }

  // 그렇지 않으면 모바일 버전 mobile.html을 제공한다.
  res.sendFile(path.resolve(__dirname, '../public/mobile.html'))
})
```

# 사용예2: 웹서버 코드와 함께 있을 경우 

가끔 웹서버가 함께 있는 프로젝트를 만들 때도 있다. 
이 경우 웹팩 개발 서버, 웹 서버 두 개의 프로세스를 실행해서 사용했다.
게다가 ajax 통신을 해야하는 두 서버는 사용하는 포트가 가각 다르다.
때문에 CORS 문제 해결을 위해 웹팩 개발서버에서 프로시 설정도 추가했다.

이렇게 개발환경을 구성하는 것이 다소 번거로웠다.
하나의 서버에 배포하는데 왜 개발 환경에서는 두 개 서버를 띄워야하는가?

webpack-dev-middleware를 이용하면 서버 하나로 통합해서 개발 환경을 만들 수 있겠다.

웹팩 개발 서버를 제거하고 웹서버 안에 webpack-dev-middleware를 추가한다.
단 개발 환경일 경우만 이 미들웨어가 만든 정적 파일을 서비스한다.
프론트엔드 코드가 변경된다면 매번 이 미들웨어에 의해 웹팩을 실행할 것이다.

```js
// 노드 환경변수로 개발/운영 환경을 식별한다(기본값: development).
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// 개발환경일 경우 웹팩이 빌드한 결과물을 정적파일로 제공한다
if (process.env.NODE_ENV === 'development') {
  // 웹팩 설정
  app.use(
      '/dist',
      middleware(compiler, {
          // webpack-dev-middleware options
          watch: true
      })
  );
}
```

반면 운영환경일 경우는 조금 다르다. 
이미 웹팩으로 빌드한 결과물을 public 폴더에 담아두고 이 것을 정적파일로 제공하도록 한다.

```js
// 운영환경일 경우 이미 빌드한 결과물인 public 폴더를 정적파일로 제공한다.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../public')))
}
```

이후에 API 라우팅등 서버의 고유 역할을 계속 진행할 수 있다. 

```js
app.get('/api/greeting', (req, res) => {
  res.json({data: 'Hello world!'});
})
```

## 사용예3: html-webpack-plugin을 사용하고 있다면 

웹팩에서 js, css, 이미지 파일을 대상으로 번들링 작업을 한 뒤 html 파일에서 이를 로딩한다.
html 파일까지도 웹팩 빌드 프로세스에 추가하려면 html-webpack-plugin을 사용한다.

webpack-dev-middleware를 사용해 서버를 구성할 때 HTML 파일을 서비스하는데 웹팩이 처리한 HTML파일의 위치를 찾아야 한다.
webpack() 함수가 반환한 compiler객체는 outputFileStem 객체를 가지고 있다.
빌드한 결과물을 위한 별도의 파일 시스템 인터페이스인 셈이다.

이 객체 메소드중에 파일을 읽는 readFile()로 웹팩이 빌드한 결과물의 내용을 읽을 수 있는데 이 데이터를 응답해 주면 된다.

```js
// 개발 환경일 경우,
if (process.env.NODE_ENV === 'development')  {
  // 웹팩이 처리한 html 경로를 찾는다.
  const filename = path.join(compiler.outputPath, 'index.html');
  // 그 경로에에서 html 파일을 읽는다.
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) return next(err);
    res.set('content-type','text/html').end(result);
  });
  return;
} 

// 운영 환경일 경우,
if (process.env.NODE_ENV === 'production') {
  // 이미 빌드한 html를 제공한다.
  res.sendFile(path.join(__dirname, "../public/index.html"));
}
```

# 정리

간단한 샘플 코드를 정리해 두었다.
- 코드 참고: https://github.com/jeonghwan-kim/post_webpack-dev-middleware

사실 회사에서는 웹서버로 스프링을 더 많이 사용한다.
그렇기 때문에 웹팩 개발서버와 스프링 서버 두 개로 개발환경을 만드는데...
그럼 노드가 아닌 다른 서버환경, 이를테면 스프링에서는 이런 방식으로 세팅할 수 없을까?
