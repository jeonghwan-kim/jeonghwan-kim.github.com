---
title: 익스프레스 만들기 Day 1 
layout: post
tags:
  express
  debug
  static-serve
  middleware
summary: 노드 기본모듈만 사용해 익스프레스 프레임웍를 만들어 보자  
---

이번 추석만 기다리고 있었다. 어느때 보다 긴 연휴라서 그리고 혼자있는 시간이 생겨서 집중해서 해보고 싶은 
일이 있었다. 프레임웍을 사용하지 않고 웹 어플리케이션을 개발하는 것. 
만들게 되면 아마도 노드 익스프레스와 비슷한 구조일 것 같다. 

## 헬로 월드부터 시작하자 

서버 어플리케이션이니깐 app.js에다 헬로 월드 코드부터 만들자.

app.js:

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

음... 어플리케이션 코드에 서버 실행 코드는 빼도 되겠다.
`server.listen()` 호출부분은 bin.js로 분리하자.

app.js: 

```js
const http = require('http')

const app = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
});

module.exports = app
```

bin.js:

```js
const app  = require('./app')
const hostname = '127.0.0.1'
const port = 3000

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

아, 참고로 모든 코드는 TDD로 작성할거다. 
모카 프레임웍만 추가하고 검증은 assert 기본 모듈로 사용해야지. 
나중에 기회가 되면 모카도 구현해 볼거다. 

## Application

헬로월드에서 사용한 http 모듈. 이것을 그대로 사용할 수는 없지. 
한번더 추상화해서 Application 모듈로 감싸자. 익스프레스 Application 기능과 비슷한 거다. 

application.js:

```js
const http = require('http')

const Application = () => {
  const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World\n')
  });

  return {
    listen(port = 3000, hostname = '127.0.0.1', fn) {
      server.listen(port, hostname, fn)
    }
  }
}
```

간단히 `listen()` 함수만 노출시키자. 
익스프레스의 Application은 `use()`, `get()`, `set()` 같은 메소드가 있지만 아직은 필요없으니깐.

app.js에는 요걸 간단히 생성만 하고:

```js
const app = require('./modules/application')()
module.exports = app
```

bind.js에서는 `app.listen()` 메소드를 실행한다:

```js
const app  = require('./app')
const hostname = '127.0.0.1'
const port = 3000

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
``` 

## 디버그 모듈 

[debug](https://github.com/visionmedia/debug) 모듈이 편리한 점은 
태그를 한번 설정하면 자동으로 붙여주는 거다. debug 모듈을 만들어야겠다.

debug.js:

```js
const debug = tag => (...msg) => console.log(tag, ...msg)
module.exports = debug;
```

음... 잠깐. 디버그 모듈은 태그에 색상이 있었잖아. 색상도 추가해 보자. 
[여기](https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color?answertab=active#tab-top)를 
보니깐 `console.log()` 함수에 색상 설정하는 방법이 있네.

debug.js: 

```js
const colors = [
  {name: 'cyan',     value: '\x1b[36m'},
  {name: 'yellow',   value: '\x1b[33m'},
  {name: 'red',      value: '\x1b[31m'},
  {name: 'green',    value: '\x1b[32m'},
  {name: 'magenta',  value: '\x1b[35m'},
]
const resetColor = '\x1b[0m'

const debug = tag => {
  const randIdx = Math.floor(Math.random() * colors.length) % colors.length
  const color = colors[randIdx]

  return (...msg) => {
    console.log(`${color.value}[${tag}]${resetColor}`, ...msg)
  }
}

module.exports = debug;
```

debug 모듈과 똑같이 생성시 태그 문자열을 넘겨주고 사용하면 된다.

```js
const debug = require('./gdebug')('app')
debug('app is initiated')
```
![debug result](/assets/imgs/2017/10/debug-result.png)

## 정적 파일 제공

정적 파일이라 불리는 HTML, CSS, 자바스크립트를 제공하는 기능을 만들자. 
물론 이미지, 폰트도 함께 말이다. 
public 폴더를 만들어 정적 파일을 담고 요청이 있으면 이 폴더의 파일을 제공하도록 한다.

파일 작업을 할거니깐 [fs](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html) 모듈을 
사용하면 되겠다. 

먼저 index.html 파일을 읽어서 응답해 보자.

application.js: 

```js
const Application = () => {
  const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')

    const filePath = path.join(__dirname, '../public/index.html')
    fs.readFile(filePath, (err, data) => {
      if (err) throw err
      
      res.end(data)
    })
  });
}
```  

index.html 파일 내용이 터미널에 잘 찍히는군. 
브라우져로 열어보면? 그냥 문자로만 보임. HTML 문서로 보여야하는데... 

'text/plain' 기본 응답 헤더를 변경하자.

```js
res.setHeader('Content-Type', 'text/html')
```

옳지! 이제 HTML 문서로 렌더링 되는군.

css, 자바스크립트는? 흠... 둘다 index.html 파일로 응답되는것 같다. 
이 경로에 대한 라우팅 로직이 없어서 그렇구만. 
단순히 index.html만 보여주는 것으론 부족함. css, js 등 모든 정적 파일을 제공하는 로직을 추가하자.

* 요청 주소 `req.url`을 파싱한다
* 확장자를 추출한다 
* 확장자별로 미리 정의한 http 헤더를 응답에 추가한다 
* 파일을 읽어 응답으로 보낸다 

```js
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
};
const ext = path.parse(req.url).ext;
const publicPath = path.join(__dirname, '../public')

if (Object.keys(mimeType).includes(ext)) {
  fs.readFile(`${publicPath}${req.url}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    res.statusCode = 200
    res.setHeader('Content-Type', mimeType[ext]);
    res.end(data)
  })
  return
}
```

옳지. `/index.html`로 접속하면 index.html 파일을 읽어서 요청측으로 보내준다.
브라우져는 index.html을 렌더링하다가 script.js와 style.css를 추가 요청한다. 서버에서는 
이 파일도 읽어서 보내준다. 

파일 찾기에 실패하면 404 Not found를 응답한다. 

## 리팩토링 

코드가 좀 길어졌다. 이 녀석을 modules 폴더로 이동해서 분리하자. 
stiatc-serve 모듈로 분리. http에서 만들어내는 req, res 객체를 넘겨 받아서 파일을 처리한다.
익스프레스에서 사용한 [serve-static](https://github.com/expressjs/serve-static/)과 
비슷한 녀석이다. 이름이 거꾸로 됐군.  

static-serve.js:

```js
const fs = require('fs')
const path = require('path')
const debug = require('./debug')('static-serve')

const staticServe = (req, res) => {
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };
  const ext = path.parse(req.url).ext;
  const publicPath = path.join(__dirname, '../public')
  debug('ext:', ext)

  if (Object.keys(mimeType).includes(ext)) {
    fs.readFile(`${publicPath}${req.url}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end();
        return;
      }

      res.statusCode = 200
      res.setHeader('Content-Type', mimeType[ext]);
      res.end(data)
    })
    return
  }
}

module.exports = staticServe
```

application 모듈에서는 static-serve에 `req`, `res` 객체를 전달해서 실행한다 

application.js:

```js
const Application = () => {
  const server = http.createServer((req, res) => {
    staticServe(req, res)
  });

  return {
    listen(port = 3000, hostname = '127.0.0.1', fn) {
      debug('listen()')
      server.listen(port, hostname, fn)
    }
  }
}
``` 

간단하게 application 코드를 유지하고 정적 파일을 처리하는 역할은 static-serve로 분리완료.


## 루트경로 접속시에 index.html을 제공  

`/` 로 요청시 `index.html`를 제공하도록 하자. 보통은 그렇게 만드니깐. 

application.js:

```js
const Application = () => {
  const server = http.createServer((req, res) => {
    staticServe(req, res)

    const publicPath = path.join(__dirname, '../public')
    fs.readFile(`${publicPath}/index.html`, (err, data) => {
      if (err) throw err

      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html');
      res.end(data)
    })
  })
}
```

정적 파일 요청이 아니면 index.html를 호출하도록 한것이다.
`/`로 요청하면 index.html이 응답된다.  

하지만... `/index.html`로 요청하면 에러발생!

```
Error: Can't set headers after they are sent.
```

`/index.html`로 요청하면 헤더를 다시 보낼수 없다는 에러가 발생한다. 이런 상황인것 같다.

* `/index.thml`로 요청이 들어온다 
* static-serve 모듈이 먼저 동작한다 
* 요청 url을 가지고 확장자를 추출한다  
* 정적파일을 찾고 응답한다 
* application으로 돌아와서 index.html 파일을 한번 더 읽는다
* `res` 객체로 한번 더 응답하려고 한다
* 헤더를 다시 보낼수 없다는 에러가 발생한다 

static-serve 모듈로 분리전에는 잘 동작했는데 리팩토링한 후에는 실패하는 이유가 뭘까?
전에는 return 문으로 로직을 제어할 수 있었다. 별도 파일(모듈, 함수)로 분리되면서 
application에서 return 문 제어가 동작하지 않는 것이다 

게다가 문제는 더 있다. 
static-serve가 로직을 수행하다가 에러를 만나면 어떻게 처리해야 할까? 
정적 파일을 찾지 못하는 경우 말이다. 
여기서는 404를 응답하도록 res 객체를 사용해 버린것인데... 
application 으로 나오면 다시 res 객체를 사용해서 index.html을 위한 작업을 또 하게된다.
헤더를 두번 읽는다는 에러가 또 나오겠지.

뭔가 큰 구조 변경이 필요하다.

## 미들웨어 

그렇지. [미들웨어 패턴](https://blog.risingstack.com/fundamental-node-js-design-patterns/#middlewarespipelines)을 사용하면 될것 같다. 
익스프레스 프레임웍의 4가지 주요 기능중에 하나가 [미들웨어](http://expressjs.com/en/guide/writing-middleware.html)다.

* 어플리케이션 객체에 미들웨어 함수를 추가하는 방식으로 기능을 확장할 수 있다 
* 에러가 발생하면 연결된 미들웨어간에 파라매터로 전달할 수 있는 특징이 있다 

미들웨러를 추가하는 방식의 `application.use()` 함수로 추가한다. 클라이언트 요청이 들어오면 
미들웨어로 추가한 함수를 모두 실행하도록 한다.  

코딩중...

오마이가앗~ 좀 복잡하군. 여튼 해결했다. 

에러 처리가 좀 복잡했다. 
파라매터 갯수로 에러를 처리하도록 했다. 
3개를 받으면 일반 미들웨어 4개를 받으면 에러미들웨어로 처리했다. 익스프레스 엔진에서는 다른 방법으로
구현한게 확실하다. 갯수에 의존적이지 않으니깐.  

application.js:

```js
const Application = () => {
  
  // 클라이언트 요청이 들어오면 이미 설정한 미들웨어들을 순차적으로 실행한다 
  const server = http.createServer((req, res) => {
    const runMw = (middlewares, i, err) => {
      if (i < 0 || i >= middlewares.length) return;

      const nextMw = middlewares[i]
      const next = () => e => runMw(middlewares, i + 1, e)

      if (err) {
        const isErrorMw = mw => mw.length === 4
        if (isErrorMw(nextMw)) nextMw(err, req, res, next())

        // 에러가 있고, 다음에 실행할 미들웨어가 에러 처리기가 아니면 그 다음 미들웨어를 찾는다 
        return runMw(middlewares, i + 1, err)
      }

      return nextMw(req, res, next())
    }

    runMw(middlewares, 0, null)
  })

  let middlewares = []

  return {
    // 미들웨어를 추가한다
    use(fn) {
      middlewares.push(fn)
    },
    listen(port = 3000, hostname = '127.0.0.1', fn) {
      server.listen(port, hostname, fn)
    }
  }
}
```

이 구조에 따라 static-serve, hello-world, index 로직도 변경해야 한다.

```js
const staticServe = (req, res, next) => { /*... */ }
const index = (req, res, next) => { /*... */ }
  
const error404 = (req, res, next) => {
  res.statusCode = 404
  res.end('Not Found')
}

const error = (err, req, res, next) => {
  debug('err mw:', err.message || err)
  res.statusCode = 500
  res.end()
}

app.use(staticServe())
app.use(index)
app.use(error404)
app.use(error)
```

나이스. 이제 좀 익스프레스처럼 코딩하는 것 같다. 오늘은 여기까지
 