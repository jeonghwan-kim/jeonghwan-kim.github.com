---
title: 익스프레스 만들기 Day 2 
layout: post
tags:
  expressjs
  morgan
  request
  response
  body-parser
summary: 노드 기본모듈만 사용해 익스프레스 프레임웍를 만들어 보자  
---

미들웨어 구조를 만들고 났으니 기능을 추가하는 것 좀더 쉬울것 같다.
우선은 테스트 코드부터 정리하자. 기능만 우선 만들어 본다고 제대로 못했다.

...

오케이 supertest 위주로 완료. 

## 로거 

요청 정보를 터미널에 찍어보자. 메소드, 주소 정도만 찍어도 좋겠다. 
익스프레스의 [morgan](https://github.com/expressjs/morgan) 이랑 비슷한 녀석이다.
미들웨어 형식에 맞게 작성하면 되겠다.

logger.js:

```js
const logger = (req, res, next) => {
  const log = `${req.method} ${req.url}`
  console.log(log)
  next();
}

module.exports = () => logger
```

오케이. 메소드에 따라 색상도 추가해 보자.

logger.js:

```js
const colors = {
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
}
const methodColorMap = {
  get: colors.green,
  post: colors.cyan,
  put: colors.yellow,
  delete: colors.red
}

const logger = (req, res, next) => {
  const coloredMethod = method => {
    return `${methodColorMap[method.toLowerCase()]}${method}${colors.reset}`
  }

  const log = `${coloredMethod(req.method)} ${req.url}`
  // ....
```

미들웨어 패턴에 맞게 하니깐 금방 금방 개발할 수 있군.

![logger](/assets/imgs/2017/10/logger.png)

테스트 환경에서는 출력하지 않도록 하자. `NODE_ENV=development` 일 경우만 미들웨어를 설정한다.

app.js:

```js
if (process.env.NODE_ENV === 'development') {
  app.use(logger())
}
```

## 라우팅 

라우팅 처리를 좀 더 개선해 보자. app.js에서 라우팅 모듈을 가져오서 설정한다.
라우팅 경로를 정의하고 후속처리하는 핸들러를 설정하는 로직을 모두 routes 폴더에 있는 
파일들이 담당하고 있다.

라우팅 정의부는 app.js에서 하고 후속 처리함수만 미들웨어에 남겨놓고 싶다.  
이런 방식으로 될거다.

app.js:

```js
app.use('/', require('./middleware/index'))
app.use('/hello-world', require('./middleware/hello-world'))
```

역할을 분담하자는 거지.

미들웨어 설정 부분을 좀 개선하면 될 것 같다. 

application.js: 

```js
const use = (path, fn) => {
  if (typeof path === 'string' && typeof fn === 'function') {
    fn.__path = path
  } else if (typeof path == 'function') {
    fn = path
  } else {
    throw Error('Usage: use(path, fn) or use(fn)')
  }

  middlewares.push(fn)
}
```

미들웨어 함수에 __path 속성을 추가해서 여기에 설정한 경로 정보를 저장해 뒀다. 나중에 미들웨어 함수를
한번에 돌릴때 이 __path와 클라이언트 요청에 req.url 을 비교해서 미들웨어 함수를 실행할려는 의도다.

```js
const runMw = (middlewares, i, err) => {
  if (i < 0 || i >= middlewares.length) return;

  const nextMw = middlewares[i]

  const next = () => e => runMw(middlewares, i + 1, e)
  if (err) // ..

  if (nextMw.__path) {
    // 요청한 url과 미들웨어에 설정한 경로가 같으면 미들웨어를 실행한다  
    if (req.url === nextMw.__path) return nextMw(req, res, next())
    
    // 경로가 다르면 다음 미들웨어를 시도한다  
    else return runMw(middlewares, i + 1)
  }

  return nextMw(req, res, next())
}
``` 

잘 돌아간다.


## index.html 

요 정도로 해서 웹페이지 개발이 어느정도 준비된것 같군. 
이제는 index.html을 로딩할대 서버 api를 호출해서 블로그 포스트 목록을 요청해보자. 
응답된 데이터를 가지고 돔을 재구성 할거다. 

index.html

```html
<body>
    <div class="posts"><!-- 여기에 돔을 추가할거야 --></div>
</body>
```

여기여 연결되 스크립트는:

```js 
post.list().
    then(data => renderPosts(data)).
    catch(err => console.log(err))
```

post.list()로 ajax 요청을 보내고 응답된 데이터는 renderPosts() 함수에 인자로 전달된다.
그리고 기존 돔에 post 돔을 만들어 추가한다.


ajax 요청시 404 응답되는 것 까지는 확인되는군. 
이제는 `GET /api/posts` 요청에 대한 라우팅 로직을 추가하고 응답만 목업 데이터를 보내도록 하자.
아직은 디비가 없으니깐.. 

app.js:

```js 
app.use('/api/posts', require('./routes/api/post').index)
```

post.js: 

```js
const posts = [
  {title: 'post 3', body: 'this is post 3'},
  {title: 'post 2', body: 'this is post 2'},
  {title: 'post 1', body: 'this is post 1'},
]

const index = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(posts))
}
```

오케이~ 응답되었다. 화면에도 잘 나오는군. 

## Response 

앞으로 만들 ajax용 api는 전두 json 형식으로 응답해야겠다. 
`res.json()`으로 함수를 만들면 좋겠다. 익스프레스 응답객체에도 있는 함수다.

application.js:

```js 
const Application = () => {
  const server = http.createServer((req, res) => {
    res = response(res)

    // ... 
```

어플리케이션에서 모든 요청을 받고 있지. 매번 요청을 받을 때마다 response 객체를 생성하자.
이녀석은 http.createServer가 만든 res를 래핑한 녀석이다. 익스프레스도 그렇다.

response.js: 

```js
const response = res => {
  if (!res) throw Error('res is required')

  res.json = res.json || (data => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  })

  return res
}

module.exports = response 
```

오케이. `status()`, `set()`, `send()` 까지 전부 만들어서 서로 체이닝할수 있게끔 하자.

```js 
const respose = res => {
  if (!res) throw Error('res is required')

  res.status = res.status || (code => {
    res.statusCode = code
    return res
  })

  res.set = res.set || ((key, value) => {
    res.setHeader(key, value)
    return res
  })

  res.send = res.send || (text => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'text/plain')
    }
    res.end(text)
  })

  res.json = res.json || (data => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  })

  return res
}
```

사용할 때는:

```js
res.send('hello world')
res.set('Content-Type', 'text/html').send(data)
res.json(posts)
res.status(404).send('Not Found')
res.status(500).send()
```

오예~ 점점 익스프레스화 되어 가는군. 

## Request 

요청 객체도 래핑해보자. 

application.js:

```js 
const Application = () => {
  const server = http.createServer((req, res) => {
    req = request(req)
    res = response(res)

    // ... 
```

`req.path`, `req.params` 속성을 통해서 정보를 얻을 수 있도록 만들거다. 

request.js:

```js
const request = req => {
  if (!req) throw Error('req is required')

  const partials = req.url.split('?')
  const path = partials[0]
  const qs = partials[1].split('&').reduce((obj, p) => {
    const frag = p.split('=')
    obj[frag[0]] = frag[1]
    return obj
  }, {})

  req.path = req.path || path
  req.params = req.params || qs

  return req
}

module.exports = request
```

좋았어. application의 라우팅 경로 비교하는 부분도 원래는 req.url로 되어있는데
이부분도 `req.path`로 하면 더 정확하겠군. 

application.js:

```js
if (nextMw.__path) {
  // 방금 만든 request 객체의 path 속성으로 비교한다 
  if (req.path === nextMw.__path) return nextMw(req, res, next())
  // ...
}
```

포스트 조회 api에 페이지네이션 쿼리 문자열을 설정해보자 

post.js: 

```js
const index = (req, res, next) => {
  const limit = req.params.limit || 2
  const page = req.params.page || 1

  const begin = (page - 1) * limit
  const end = begin + limit
  
  res.json(posts.slice(begin, end))
}
```

잘 동작한다. 쿼리문자열 파싱하는 작업을 `request` 객체에 맡겨버리고 간단하게 `req.params`로 접근할
수 있게 되었다. 응답도 `res.json()`을 사용했다. 

## 포스트 생성 (new.html) 

폼을 만들고 서밋할 때 `POST /api/posts`를 호출하도록 했다. 

```js 
newForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const title = e.target.title.value || ''
    const body = e.target.body.value || ''

    // POST /api/posts를 호출한다 
    post.create(title, body).
      then(data => {
        alert('saved')
        window.location.href = '/'
    
    // ...  
```
 
POST 메소드를 추가해야하는데... 현재는 `app.use()`로 라우팅 로직을 추가하고 전부 GET 메소드만
가능하다. 

메도드도 설정하는 미들웨어 추가 함수를 만들어야겠다. 
익스프레스는 `app.get()`, `app.post()` 같은게 있으니깐 요거 비슷하게 만들어 보자. 

경로를 `__path`로 기록한 것처럼, 미들웨어 함수에 `__method`에 메소드 정보를 기록해 둬야겠다.  

application.js:

```js
const get = (path, fn) => {
  if (!path || !fn) throw Error('path and fn is required')
  fn.__method = 'get'
  use(path, fn)
};
```

그리고 미들웨어 함수를 실해하는 부분에서 미들웨어에 설정한 메소드와 요청 메도스를 비교하여 
미들웨어 실행 여부를 판단하도록 해야겠다.

```js
if (nextMw.__path) {
  const isMatched = req.path === nextMw.__path && 
    req.method.toLowerCase() === (nextMw.__method || 'get')
  if (isMatched) return nextMw(req, res, next())
  else return runMw(middlewares, i + 1)
}
```

미들웨어 실행여부는 메소드와 경로 두 가지 조건이 있으니깐 `isMatched` 변수로 떼어냈다.

올지. 그럼 `app.js`에는 이렇게 설정할수 있다 

```js
app.get('/api/posts', require('./routes/api/post').index)
app.post('/api/posts', require('./routes/api/post').create)
```

좋군. 이제 `create()` 메소드를 만들어보자 

post.js: 

```js
const create = (req, res, next) => {
  debug('create() req.body:', req.body) // undefined
}
```

`req.body`가 없구나. 
익스프레스에는 폼데이터 파싱해주는 [body-parser](https://github.com/expressjs/body-parser/)가 있다. 
이것과 비슷한 역할을 하는 body-parser 미들웨어를 만들자. 

## body-parser 

[요청 바디에 대한 노드 문서](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#request-body)를 참고.
request 객체는 `ReadableStream` 인터페이스를 구현한 녀석인데 데이터 수신시 `data`이벤트를 
내뿜는다. 데이터 수신을 마치면 `end` 이벤트를 발생하고... 

그러면 간단히 스트림 처리하는 방법으로 구현하면 되겠다.  

body-parser.js:

```js
const bodyParser = (req, res, next) => {
  let data = []
  req.on('data', chunk => {
    data.push(chunk)
    debug('data', chunk)
  })

  req.on('end', () => {
    data = Buffer.concat(data).toString();
    debug('end', data)
  })
}
```

`end` 이벤트에서 요청 바디가 문자열로 찍혔다.

![body daata](/assets/imgs/2017/10/body-data.png)

이것도 json 형식으로 변경해서 `req.body`에 담아주자. 

```js
const bodyParser = (req, res, next) => {
  // ...
  
  req.on('end', () => {
    const body = data.split('&').reduce((body, pair) => {
      if (!pair) return body
      const frg = pair.split('=')
      body[frg[0]] = frg[1]
      return body
    }, {})

    req.body = body
    next()
  })
}
```

이제 라우팅 핸들러 함수에서 `req.body`로 요청 바디에 접근할 수 있게 되었다. 

계속해서 `create()` 함수를 구현해 보자. 

post.js:

```js 
const create = (req, res, next) => {
  const post = {
    title: req.body.title,
    body: req.body.body
  }

  if (!post.title || !post.body) {
    return res.status(400).send('parameter error')
  }
  
  posts = [post].concat(posts)
  res.status(201).json(post)
}
``` 

이제 거의 익스프레스랑 비슷해진 것 같다. 오늘은 여기까지~
