---
title: 익스프레스 만들기 Day 3
layout: post
category: series
permalink: 2017/10/06/diy-express-day3.html
tags:
  expressjs
  view-engine
summary: pug와 비슷한 뷰 엔진을 만들어 본다
---

지금까지 만든 페이지가 포스트 조회, 생성임. 편집까지 만들어보자.
아니, 귀찮으니깐 삭제 기능부터 만들자.


## 삭제 기능 구현

조회 페이지의 각 포스트 하단에 삭제 버튼을 만들고 버튼을 클릭할때 호출할
`DELETE /api/posts?id=` API를 만들면 되겠다.
application에 delete 메쏘드 기능도 추가하자. (현제는 post, get까지 구현된 상황임)

```js
const destroy = (path, fn) => {
  if (!path || !fn) throw Error('path and fn is required')
  fn.__method = 'delete'
  use(path, fn)
}

return {
  use,
  get,
  post,
  delete: destroy,
  listen,
  server,
}
```

자바스크립트에서 `delete`는 예약어라서 바로 사용할순 없어서 `destory()`란 이름으로 함수를 만들어
모듈 객체에 `delete` 속성으로 `destory()` 함수를 할당했다.

app.js 에서 라우팅 로직을 추가한다.

```js
app.get('/api/posts', require('./routes/api/post').index)
app.post('/api/posts', require('./routes/api/post').create)

// 삭제 api 추가
app.delete('/api/posts', require('./routes/api/post').destroy)
```


포스트(post) 모듈의 `destory()` 함수도 간단히 만들었다.
디비가 없으니간 디비 역할을하는 `posts` 배열에서 삭제할 포스트를 아이디로 찾아서 제거한다.

```js
const destroy = (req, res, next) => {
  const id = req.params.id * 1
  posts = posts.filter(post => post.id !== id)
  res.status(204).send()
}
```

## 템플릿 엔진

개발한 페이지는 두 개다.

* /index.html
* /new.html

사실 두 페이지는 중복된 마크업을 사용하고 있다. HTML 헤더 부분과 사이트 네비게이션 바가 그렇다.
아무래도 중복된 코드는 재활용할수 있도록 만드는 것이 당연한데... 그래서 템플릿 엔진이 필요하겠군.

템플릿 엔진의 역할은:

* 템플릿 조각들을 모아서 하나의 HTML 코드를 만든다
* 데이터를 이용한 동적 HTML을 만든다

### 서브 템플릿

먼저 템플릿 조각을 모아 나의 html 코드를 생성하는 기능부터 만들어 보자.
만약 이 기능이 지원된다는 난 뷰 코드를 이런식으로 작성하고 싶다.

```html
include 'header.view'

<div>Post list</div>
```

header.view로 분리된 중복 마크업을 include 하여 뷰를 만드는 것이다.

* 우선은 뷰 파일을 읽어서 include 'header.view' 부분을 찾아야겠지
* header.view 파일을 읽어서 이 부분과 바꿔치기 해야한다
* 그리고 이 동작은 재귀적으로 동작해야한다. include 가 없을때까지 계속 뷰 조각들을 읽어 내야하는 거다

먼저는 라우팅 핸들러에서 index.view 파일을 읽어 렌더링 하도록했다.

```js
function (req, res, next) {
  fs.readFile(`${viewPath}/index.view`, (err, file) => {
    if (err) return next(err)

    render(file.toString(), html => {
      res.set('Content-Type', 'text/html').send(html)
    })

  })
}
```

파일 내용을 읽은 후 `render()` 함수로 처리하고 처리 결결 만들어질 HTML 문자열을 `res` 객체로
응답하는 코드다.

뷰 파일을 읽어내는 `render()` 함수를 구현해 보자.

```js
const render = (html, cb) => {
  let {text, partialName} = findPartials(html)

  if (!partialName) return cb(html)

  fs.readFile(`${viewPath}/${partialName}`, (err, file) => {
    if (err) throw err

    text = text.replace(`${partialName}`, file.toString())
    render(text, cb)
  })
}
```

렌더 함수는 뷰 파일을 읽은 문자열을 `html` 변수로 받는다. 이 문자열을 파싱하는 중에 인클루드된
뷰파일을 읽어야 할수 있기 때문에 비동기로 움직일 것이다. 그래서 콜백 함수 `cb`를 두번째 인자로
받았다.

뷰 파일 내용인 `html` 문자열에서 하위 뷰 파일을 찾아내기 위해 `findPartials()` 함수를 이용한다.
이 녀석은 전달한 문자열 `text`와 하위 템플릿인 `partialName` 문자열을 반환하다.

하위 템플릿이 없으면 곧바로 템플릿 문자열을 반환한다.

하위 템플릿이 있으면 이 파일을 읽는다. 그리고 하위 템플릿 선언부 (`include '.view'`)와
교체한다.

이렇게 처리한 템플릿은 계속해서 반복한다. 하나의 뷰 파일에는 여러개의 하위 뷰 파일이 인클루드 될 수
있기 때문이다.

아래는 `findPartial()` 함수다.

```js
const findPartials = text => {
  let partialName = text.match(/include '.*\.view'/)

  if (!partialName) return {text, partialName}

  partialName = partialName[0].replace(/include '(.*\.view)'/, '$1')
  text = text.replace(/include '(.*\.view)'/, '$1')

  return {text, partialName}
}
```

자 그럼 뷰 파일이 제대로 렌더링 되는지 확인해 볼까?

index.view:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Blog</title>
</head>
<body>
include 'header.view'
include 'header.view'

<div>index view</div>
</body>
</html>
```
header.view:

```html
<div>header view</div>
```
title.view:

```html
include 'title.view'
<div>header view</div>
```

인덱스 뷰는 헤더뷰 두 개를 포함한다. 헤더뷰는 타이틀 뷰를 포함한다.
요청해 보면:

```bash
curl -vs localhost:3000/index2.html

<!DOCTYPE html>
<html>
<head>
    <title>Blog</title>
</head>
<body>
<div>title view</div>
<div>header view</div>

<div>title view</div>
<div>header view</div>

<div>index view</div>
</body>
```

오예~ 아주 잘 움직이구만!

### 동적 템플릿

뷰 파일에 데이터을 넣어서 HTML을 생성하는 기능도 추가해보자. 먼저는 템프릿에 데이터는 {%raw%}{{ }}{%endraw%}로
설정할 거다.

```html
<div>{%raw%}{{msg}}{%endraw%}</div>
```

이 코드에 넣은 데이터 객체는 뷰 파일을 파싱하는 `render()` 함수의 인자로 전달한다.

```js
const data = {msg: 'hello world'}
render(file.toString(), data, html => {
  res.set('Content-Type', 'text/html').send(html)
})
```

템플릿을 파싱하는 부분에서 모든 서브 템플릿을 합친 문자열 `html`에 데이터 내용을 교체한다.

```js
render(file.toString(), data, html => {

  // 데이터로 동적인 HTML을 생성한다
  Object.keys(data).forEach(key => {
    html = html.replace(RegExp(`{%raw%}{{${key}}}{%endraw%}`, 'g'), data[key])
  })

  res.set('Content-Type', 'text/html').send(html)
})
```
옳지! 제대로 동작한다.

### 리팩토링

좋아. 좀 더 편리하게 사용할 수 있게 리팩토링 해보자.
뷰 렌더 함수는 요청에 대해 적적한 뷰 파일을 찾아 응답하는 것이기 때문에 응답 객체의 역할이
맞다. `res.render('index')` 형태로 사용하고 싶다.

response.js:

```js
const respose = (res, appData) => {
  res.render = res.render || ((view, data) => {
    if (!appData.views) throw Error('views path is required')

    const render = (html, cb) => { /* .... */ }

    const findPartials = text => { /* .... */ }

    fs.readFile(`${appData.views}/${view}.view`, (err, file) => {
      if (err) return next(err)
      render(file.toString(), html => {

        Object.keys(data).forEach(key => {
          html = html.replace(RegExp(`{%raw%}{{${key}}}{%endraw%}`, 'g'), data[key])
        })

        res.set('Content-Type', 'text/html').send(html)
      })
    })
  })

  // ...
}
```

응답 객체에 `render()` 함수로 코드를 옮겼다. 뷰 렌더링을 모두 마치면 알아서 `res.send()` 함수로
응답하도록 처리했다.

response 생성시 `appData` 변수를 받고 있는데 어플리케이션 객체에서 넘어온 데이터다.

application.js:

```js
const Application = () => {
  const appData = {}

  const server = http.createServer((req, res) => {
    req = request(req)
    res = response(res, appData)

    // ...
  })

  // ...

  const set = (key, value) => {
    appData[key] = value
  }

  return {
    // ...
    set,
  }
}
```

`set()` 함수로 어플리케이션 설정 정보를 저장할 수 있다. 우선은 뷰를 위한 뷰 폴더 경로를 설정하기
위해 사용했다.

app.js:

```js
app.set('views', path.join(__dirname, './views'))
```

정리하자면...

* `app.set()`으로 뷰 템플릿 경로를 설정하고
* `res.render()`로 html을 생성하고 응답할수 있게 되었다


잘되는군... 흠~ 그런데..

`/`, `/index.html` 처럼 하나의 핸들러함수를 공유하는 경우 404 에러가 나온다.

```js
app.get('/index.html', index.listPost)
app.get('/', index.listPost)
```

뭐가 문제지?

...

미들웨어 함수 fn의 `fn.__path`, `fn.__method` 사용하는 코드 때문이다.

index.listPost.__path 를 설정하는데

* `app.get('/index.html', index.listPost)` 코드에서 `index.listPost.__path = '/index.html'`로 설정하고
* `app.get('/', index.listPost)` 코드에서 `index.listPost.__path = '/'`로 덮어 씌워버린다.

결국 `/index.html`로 요청하면 404 에러 코드를 응답하게되는 거다.

함수를 복제하자. `clone()` 폴리필을 추가해서 해결했다.

application.js:

```js
// clone 폴리필
Function.prototype.clone = function() {
  var that = this;
  var temp = function temporary() { return that.apply(this, arguments); };
  for( key in this ) {
    temp[key] = this[key];
  }
  return temp;
}
```

핸들러 함수를 수정하는 코드가 나오면 클론해서 복제본을 사용했다.

application.js:

```js
const get = (path, fn) => {
  if (!path || !fn) throw Error('path and fn is required')
  fn = fn.clone()
  fn.__method = 'get'
  use(path, fn)
};
```

## 기존 마크업 -> 뷰 파일로 변경

기존 마크업을 뷰 템플릿으로 렌더링 할 준비가 됐다.

header.view:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="header">
    <div class="container">
        <h1><a href="/">Blog</a></h1>
        <nav>
            <ul>
                <li>
                    <a href="/new.html">New</a>
                </li>
            </ul>
        </nav>

    </div>
</div>
```

footer.view:

```html
<script type="module" src="{{scriptPath}}"></script>
</body>
</html>
```

공통으로 사용할 헤더 템플릿이다. title과 scriptPath를 데이터를 주입받아서 렌더링하게 된다.

index.view:

```html
include 'header.view'

<div class="content">
    <div class="container">
        <div class="posts"></div>
    </div>

    <div class="container">
        <div class="pagination"></div>
    </div>
</div>

include 'footer.view'
```

header.view와 footer.view를 인클루드 했다.

new.view:

```html
include 'header.view'

<div class="content">
    <div class="container">

        <form id="new-form">
            <p>
                <input type="text" name="title" placeholder="title" autofocus>
            </p>
            <p>
                <textarea name="body" placeholder="type something..."></textarea>
            </p>
            <p>
                <button type="submit">Save</button>
                <button type="reset">Cancel</button>
            </p>
        </form>
    </div>
</div>

include 'footer.view'
```

마찬가지로 header.view와 footer.view 인클루드 했다.

```js
const listPost = (req, res, next) => {
  debug('listPost()')
  const data = {
      title: 'Blog',
      scriptPath: 'js/index.js'
    }
  res.render('index', data)
}

const newPost = (req, res, next) => {
  const data = {
      title: 'New Post',
      scriptPath: 'js/new.js'
    }
  res.render('new', data)
}
```

오늘은 여기까지!
