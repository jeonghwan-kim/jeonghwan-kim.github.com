---
slug: "/dev/2020/08/21/gatsby-prefetch.html"
date: 2020-08-21
title: "개츠비 프리로딩과 프리패치"
layout: post
category: dev
tags: [gatsby, prefetch, react]
---

브라우져에서 웹 페이지 로딩 성능을 좌우하는 요소 중 하나가 리소스를 다운로드 하는것이다.
이미지, 폰트, 자바스크립트, 스타일시트 등 HTML 문서는 다양한 리소스를 가지고 웹페이지를 만들어내기 때문에 미리 다운로드 해야한다.

다운로드할 파일의 크기가 페이지 로딩 성능에 영향을 주는 것은 인터넷 환경에서 자명하다.
그렇기 때문에 이미지 크기를 줄이고 코드를 압축하는 등 대역폭을 아끼려고 한다.
한 번 다운받은 파일을 브라우져가 재사용하도록 캐쉬를 사용하기도 한다.

개츠비에서도 이러한 노력을 한다.
특별히 "프리로드"과 "프리패치"가 눈에 띄였는데 한 번 정리해 보아야겠다.

# 프리로드와 프리패치

개츠비로 만든 사이트를 보면 로딩 속도가 꽤 빠른다는 느낌이 든다.
복합적인 원인이 있지만 그 중에 프리로드(preload)와 프리패치(prefetch)라는 기술을 사용한다.

머릿말에 "pre"라고 이름 붙인 것처럼 페이지에서 사용할 자원을 미리 가져오는 것을 말한다.
이 둘은 조금 차이가 있는데 아주 단순하게 정리하면 이렇다.

- 프리로드(preload): 방문**한** 페이지의 리소스를 **빠르게** 다운로드
- 프리패치(prefetch): 방문**할** 페이지의 리소스를 **미리** 다운로드

## 프리로드(preload)

자바스크립트 파일은 보통 body 태그 안에서 가져올 uri를 선언한다.

```html
<body>
  <script src="page-1.js"></script>
</body>
```

브라우져는 문서를 파싱하고 렌더링하다가 script 태그를 만나면 그 안에 있는 스크립트를 실행한다.
src 속성에 선언한 uri가 있다면 외부 자바스크립트 파일을 다운로드한 뒤에 실행한다.

이 다운로드 시점을 앞당길 수 있는 것이 프리로드다.
문서 head 영역에 link 태그를 사용해 아래처럼 작성한다.

```html
<head>
  <!-- body에서 사용할 page-1.js 파일을 미리 다운로드 한다. -->
  <link rel="preload" href="page-1.js" as="script" />
</head>
<body>
  <script src="page-1.js"></script>
</body>
```

rel="preload" 로 선언한 프리로드는 브라우져가 렌더링하기 전에 리소스를 다운로드하기 시작한다.
그리고 나서 바디 영역의 script 태그에서 page-1.js 사용하려고 할 때 이미 다운로드 완료한 page-1.js를 바로 실행할 수 있다.

이전 코드와 달리 다음과 같은 효과가 있다([참고](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)).

- 화면 라이프사이클 초반에 리소스를 다운로드 함
- 다운로드 도중 화면 렌더링을 차단하지 않음

## 프리패치(prefetch)

프리패치는 유저가 다음에 방문할 것으로 예측하는 페이지의 리소스를 미리 다운로드 하는 것이다.

```html
<head>
  <!-- (현재 문서에서는 사용하지 않지만) 다음 페이지에서 사용할 리소스를 미리 다운로드 한다 -->
  <link rel="prefetch" href="page-2.js" />
</head>
```

프리로드와 달리 rel="prefetch"로 선언했다.

프리패치는 브라우져의 유휴시간(idle time)에 다운로드하기 때문에 프리로드에 비해 다운로드 우선순위가 좀 낮다.
만약 다운로드가 완료된다면 다음 페이지에 진입했을 때 미리 다운로드한 page-2.js를 사용하기 때문에 화면 로딩 속도가 빠르다.

유저가 다음에 방문할 것을 어떻게 예측할까?
아마도 다음 두 가지 일 것 같다.

- 문서 안에 있는 하이퍼링크 주소
- 유저가 마우스로 포커스한 하이퍼링크 주소

# 개츠비는 어떻게 동작하는가?

개츠비에서는 프리로드와 프리패치를 적절히 섞어서 사용한다.
각각 어떻게 구현하고 있는지 궁금했는데 개츠비 문서 [Code Splitting and Prefetching](https://www.gatsbyjs.com/docs/how-code-splitting-works/)가 도움이 되었다.

## 코드 분할

프리패칭을 하기 전에 먼저 리소스부터 준비한다.
하나의 커다란 자바스크립트 혹은 스타일시트 파일만 있다면, 모든 페이지에서 하나의 파일만 사용하기 때문에 굳이 이런 기술을 사용할 필요가 없겠지.
대신 초기 다운로드 속도는 포기해야할 것이다.

웹팩은 모듈 의존성에 따라 코드를 분할하는 기능을 가지고 있는데 이를 코드 분할(code splitting)이라고 부른다.
개츠비는 이 기능을 이용해 페이지 단위로 코드를 나눈다.

이것을 청크(chunk)라고 부르는데 페이지별로 필요한 청크 목록을 page-data.json이란 특별한 파일에 담아 둔다.

빌드 결과물이 있는 public 폴더를 보면 이런 구조다.

```
/public
  /page-data
    /page-1
      page-data.json
    /page-2
      page-data.json
  /component---src-pages-page-1-js-c30d7ecfca49b0dee715.js
  /component---src-pages-page-2-js-c30d7ecfca49b0dee715.js
```

설명을 위해 결과물을 단순하게 정리했다.
두 개 페이지 /page-1, /page-2 가 있는데 각 페이지가 로딩할 자바스크립트가 생성된다.

- component---src-pages-{페이지 이름}-js-{해쉬}.js

그리고 화면과 청크의 매핑정보를 담은 page-data.json 파일을 page-data 폴더에 담아 두었다.

- /page-data/{페이지 이름}/page-data.json

여기까지해서 프리로드와 프리패치 준비를 마쳤다.

## 개츠비 프리로드

빌드 결과물 중에 page-1.html 파일을 보면 프리로드 관련한 코드를 발견할 수 있다.

```html
<head>
  <!-- 1. 이 화면에서 사용할 청크를 미리 다운로드한다(프리로드). -->
  <link
    as="script"
    rel="preload"
    href="/component---src-pages-page-1-js-c30d7ecfca49b0dee715.js"
  />
</head>
<body>
  <!-- 2. 이 화면에서 사용할 청크를 실행한다. -->
  <script
    src="/component---src-pages-page-1-js-c30d7ecfca49b0dee715.js"
    async=""
  ></script>
</body>
```

page-1에서 사용할 component---src-pages-page-1-js-{해쉬}.js 파일을 프리로드한다(1).
브라우져는 화면 렌더링을 차단하지 않고 파일을 다운로드 할 것이다.

리소를를 사용할 시점에 가서는 이 파일의 다운로드가 완료되어 있을 것이고, 그래서 바로 실행할 수 있다(2).

## 개츠비 프리패치

비교적 단순한 프리로드와 달리 프리패치는 두 가지 시점에서 발생한다.

1. 링크 컴포넌트(`<Link>`)가 마운트 되었을 때
1. 링크 컴포넌트에 hover 이벤트가 발생했을 때

개츠비 프리패치에서는 **개츠비링크(GatsbyLink)** 컴포넌트와 **로더(BaseLoader, ProdLoader)** 클래스가 주요 인물이다.

### 링크 컴포넌트 마운트 시

#### GatsbyLink

reach-router 패키지의 Link 컴포넌트를 확장한 GatsbyLink는 프리패치를 유발하는 코드를 두 군데 가지고 있다.

```jsx
class GatsbyLink extends React.Component {
  // 1. 컴포넌트가 마운트 되었을 때: 로더에 경로를 추가한다
  // -> prefetch 유도
  componentDidMount() {
    ___loader.enqueue(
      parsePath(
        rewriteLinkPath(this.props.to, window.location.pathname)
      ).pathname
    )
  }

  render() {
    // 2. hover 이벤트 발생시: 로더의 hovering() 메소드를 호출한다
    // -> prefetch 유도
    return (
      <Link
        onMouseEnter={e => (
          ___loader.hovering(parsePath(prefixedTo).pathname)
        )}
      />
  }
}
```

리액트로 SPA를 개발할 때 리액트 라우터를 사용하듯, 개츠비 프로젝트 안에서는 GatsbyLink 컴포넌트로 링크를 표현한다.
이 컴포넌트가 마운트 완료하면 로더라는(`___loader`) 녀석에게 화면 경로를 전달한다(enqueue).
곧 보겠지만 로더는 전달 받은 경로를 이용해 프리패치 작업을 시작할 것이다(1).

두번 째 프리패치는 링크에서 hover 이벤트가 발생했을 경우다.
렌더함수에서 리치 라우터의 Link 컴포넌트를 렌더하는데, onMouseEnter 속성에 로더의 hovering() 메소드를 호출하는 콜백함수를 전달했다.
이것도 마찬가지로 로더가 프리패칭 작업을 시작할 것이다(2).

이렇게 프리패치 트리거 포인트를 확인했으니 실제로 프리패치 작업을 하는 로더를 만나보자.

#### Loader

로더라고 불렀지만 정확히는 BaseLoader를 상속한 ProdLoader 클래스다.
두 클래스의 메소드가 프리패치를 하는 구조다.

개츠비 링크가 마운트될 때 실행하는 enqueue()는 BaseLoader#prefetch() 메소드를 호출한다.
함수 호출 깊이가 좀 있긴 하지만 주석으로 순서를 매겨놓았다.

```js
class BaseLoader {
  // 1. enqueue()가 prefetch()를 호출한다
  prefetch(pagePath) {
    this.doPrefetch(findPath(pagePath))
  }
}

class ProdLoader extends BaseLoader {
  doPrefetch(pagePath) {
    // 2. page-data.json 경로를 만든다
    //    /page-data/page-2/page-data.json
    const pageDataUrl = createPageDataUrl(pagePath)

    // 3. 링크 태그를 돔에 추가해 리소스를 다운로드 한다
    //    <link rel="prefetch" herf="page-data.json" as="fetch">
    return prefetchHelper(pageDataUrl, { as: `fetch` }).then(result => {
      // 4. page-data.json에서 청크 이름을 조회한다
      //    /component---src-pages-page-2-js.js
      const chunkName = result.payload.componentChunkName

      // 5. 청크 이름과 컴포넌트 매핑테이블로 컴포넌트 리소스 uri를 만든다
      //    /component---src-pages-page-2-js-ef8c063115e3c48e159a.js
      const componentUrls = createComponentUrls(chunkName)

      // 6. 링크 태그를 돔에 추가해 리소스를 다운로드 한다
      //    <link
      //      rel="prefetch"
      //      href="/component---src-pages-page-2-js-ef8c063115e3c48e159a.js">
      return Promise.all(componentUrls.map(prefetchHelper))
    })
  }
}
```

개츠비 링크는 로더의 prefetch() 메소드를 호출하는데 이는 곧장 doPrefetch() 메소드를 호출한다(1).

다음 페이지 링크의 경로를 인자로 받는데 이걸 이용해서 다음 페이지와 관련된 page-data.json 파일의 uri를 계산한다(2).

```js
const createPageDataUrl = path => {
  return `${__PATH_PREFIX__}/page-data/${fixedPath}/page-data.json`
}
```

빌드한 public 폴더를 보면 있는 public/page-data/page-2/page-data.json 이 위치해 있는데 이 파일을 가리키는 주소다.
이걸 프리패치하는 것이 prefetchHelper() 함수의 역할이다(3).

이 함수는 문서 head에 link를 동적으로 삽입해서 브라우져가 프리패치 하도록 한다.

```js
const linkPrefetchStrategy = function (url, options) {
  return new Promise((resolve, reject) => {
    // rel="prefetch herf="{url}"로 구성된 link 요소를 만든다
    const link = document.createElement(`link`)
    link.setAttribute(`rel`, `prefetch`)
    link.setAttribute(`href`, url)

    // as="fetch" 따위의 속성을 추가한다
    Object.keys(options).forEach(key => {
      link.setAttribute(key, options[key])
    })

    // 페이지 로드/오류 이벤트에 프라미스를 해결한다
    link.onload = resolve
    link.onerror = reject

    // 문서에 요소를 추가한다
    const parentElement =
      document.getElementsByTagName(`head`)[0] ||
      document.getElementsByName(`script`)[0].parentNode
    parentElement.appendChild(link)
  })
}
```

이렇게 해서 미리 다운로드한 page-data.json 데이터는 다음과 같은 형식이다.

```json
{
  "componentChunkName": "component---src-pages-page-2-js",
  "path": "/page-2/",
  "result": {
    "pageContext": {}
  }
}
```

page-2 화면이 사용할 청크 이름(componentChunkName)을 찾을 수 있다.
이걸 이용해 다음 화면에서 사용할 청크를 미리 가져오려는 의도다.

하지만 빌드된 청크이름 형식을 보면 뒤에 맨 마지막에 해쉬값이 따라온다.
이 해쉬값까지 더해 주어야 비로소 유효한 uri를 완성할 수 있는데, 이 때 사용하라고 개츠비는 빌드시 매핑 테이블을 미리 준비해 두었다.
브라우져 개발자 도구로 window.\_\_\_chunkMapping 값을 확인하며 이것이 바로 매핑 테이블이다.

```js
{
  "component---src-pages-page-2-js": [
    "/component---src-pages-page-2-js-ef8c063115e3c48e159a.js"
  ]
}
```

이 테이블을 이용해 uri를 구성하는 코드가 createComponentUrls() 함수다(5).

```js
const createComponentUrls = componentChunkName =>
  (window.___chunkMapping[componentChunkName] || []).map(
    chunk => __PATH_PREFIX__ + chunk
  )
```

page-data.json을 프리패치 해온 것 처럼 완성한 청크 uri들을 마지막으로 한 번 더 프리패치 한다(6).

간단히 정리하면 개츠비링크는 마운트 시점에 이런 순서로 동작한다.

- 링크에 연결된 화면의 페이지 데이터(pgae-data.json)를 가져와 그 화면에서 사용할 청크 이름을 조회 한다
- 맵핑 테이블로 청크 uri(component---src-pages-{페이지 이름}-{해쉬})를 계산하고 이 리소스를 다운로드 한다

### 링크에 hover 이벤트 발생 시

두 번째, 링크에 마우스를 올려 hover 이벤트가 발생했을 때 실행되는 로더의 hovering() 메소드는 어떻게 동작할까?

```js
class BaseLoader {
  // 1.
  hovering(rawPath) {
    this.loadPage(rawPath)
  }

  loadPage(rawPath) {
    const pagePath = findPath(rawPath)
    const inFlightPromise = Promise.all([
      this.loadAppData(),

      // 2. page-data.json을 가져온다
      this.loadPageDataJson(pagePath),
    ])
    const result = allData[1]

    // 3. 청크 이름을 조회한다
    const { componentChunkName } = result.payload

    // 4. 청크를 프리패치한다
    const componentChunkPromise = this.loadComponent(componentChunkName).then(
  }
}
```

외부에 호출된 hovering()은 곧장 loadPage() 메소드를 호출한다(1).

이것도 마찬가지로 다음 페이지에서 사용할 청크 이름을 가져오기 위해 page-data.json을 가져온다(2).

가져온 데이터에서 청크 이름을 추출한 뒤(3), 청크를 가져온다.

브라우저에서 동작하는 모습을 보면 이전과 비슷하게 프리패치하는 것 같은데 loadComponent()의 역할인 듯 하다.
loadComponent()의 정확한 원리는 잘 모르겠다.

# 결론

개츠비에서 화면 로딩 속도를 끌어 올리기위해 프리로드와 프리패치 두 개를 모두 사용하는 걸 보았다.

MDN 문서에서 나온 기본 원리를 따르고 있지만 개츠비만의 노하우도 있었다.
화면 별로 사용할 정적 자원을 작은 코드 조각으로 먼저 나누어 두었다.
그리고나서 페이지를 방문하거나 멀지 않은 미래에 방문할 것이라 판단되면 이 작은 코드 조각들을 미리 가져온다.
다운로드할 파일을 쪼개어 놓았기 때문에 기본적으로 다운로드 속도가 빠르다.
게다가 미리 미리 자원을 확보하기 때문에 화면 로딩도 빠르게 느껴진다.

이렇게 브라우져 성능을 위한 기술은 계속 발전하는 것 같다.
웹 서비스를 만들때 기능 구현에만 빠져있다보니 성능 관련한 처리는 다루어볼 기회가 많지 않았다.
물론 처음부터 성능을 챙겨갈 수 있는 형편은 못되지만 미리 알고 준비해 두어야겠다.
