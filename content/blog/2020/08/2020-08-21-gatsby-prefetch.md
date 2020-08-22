---
title: "개츠비 프리로딩과 프리패치"
layout: post
category: dev
tags: [gatsby, prefetch]
---

브라우져에서 웹 패이지 로딩 성능을 좌우하는 요소 중 하나가 리소스를 다운로드 하는것이다.
이미지, 폰트, 자바스크립트, 스타일시트등 HTML 문서는 다양한 리소스를 조합해서 웹페이지를 만들어내기 때문에 이것들을 외부에서 가져와야한다.

파일이 크기가 페이지 로딩 성능에 영향을 주는 건 당연하다.
그렇기 때문에 이미지 크기를 조절하고, 자바스크립트나 스타일시트를 압축해서 제공한다.
뿐만아니라 한 번 브라우져로 다운받은 파일을 재사용하는 캐쉬 전략도 사용한다.

개츠비에서도 이러한 캐쉬 전략을 사용하고 있다.
더 나아가 프리로딩과 프리패치라는 기술도 사용하는데 한 번 정리해 보아야겠다.

# 프리로드와 프리패치

게츠비로 만든 사이트를 보면 무척 로딩속도가 빠른다는 생각이 든다.
복합적인 원인이 있지만 그중 프리로드(preload)와 프리패치(prefetch)를 눈여겨 보자.

머릿말에 "pre"라고 이름 붙인 것처럼 페이지의 미리 자원을 미리 가져온다.
둘은 조금씩 차이가 있는데 단순하게 말하자면 이렇다.

- 프리로드(preload): 방문**한** 페이지의 리소스를 **빠르게** 다운로드
- 프리패치(prefetch): 방문**할** 페이지의 리소스를 **미리** 다운로드

## 프리로드

자바스크립트를 로딩할때 보통은 바디 안에서 작성한다.

```html
<body>
  <script src="app.js"></script>
</body>
```

브라우져는 문서를 파싱하고 렌더링한 뒤 script 태그를 만나면 서버에 자바스크립트 파일을 요청해서 다운로드 받는다.

반면 프리로드는 좀 다르게 동작한다.
문서 헤드 영역에 link의 rel 속성을 사용하는데 아래처럼 작성할 수 있다.

```html
<head>
  <!-- 이 문서가 사용한 app.js 파일을 가져온다 -->
  <link rel="preload" href="app.js" as="script" />
</head>
<body>
  <script src="app.js"></script>
</body>
```

문서의 헤드 영역 안에 선언된 프리로드는 브라우져가 렌더링하기 전에 리소스를 다운로드 하기 시작한다.
그리고 나서 바디 영역에서 app.js 사용하려고 할 때 이미 다운로드 완료하여 사용할수 있는 상태가 되어 있다.

이전 코드와 다른점은

- 화면의 라이프사이클 초반에 리소스를 다운로드하는 점과
- 다운로드 하면서 화면 렌더링을 차단하지 않는다

는 것이다([참고](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)).

## 프리패치

프리패치는 다음에 사용할 리소스를 미리 다운로드 하는 것이다.

```html
<head>
  <!-- 현재 문서에서는 사용하지 않지만 다음 페이지에서 사용할 리소스를 미리 다운로드 한다 -->
  <link rel="prefetch" href="app.js" />
</head>
```

프리로딩과 달리 rel속성에 prefetch을 설정한 뒤 href 속성에 다운로드할 uri를 넣는 방식이다.

프리로드와 달리 프리패치는 브라우져의 유휴시간(idle time)에 다운로드하기 때문에 비교적 우선순위를 낮게 정한다.
만약 다운로드가 완료된다면 다음 페이지에 진입했을 때 미리 다운로드한 app.js를 사용하기 때문에 화면 로딩속도가 빠른다.

# 개츠비는 어떻게 동작하는가?

게츠비에서는 이 둘을 적절히 혼합해서 사용하는 것처럼 보인다.
각각 어떻게 구현하고 있는지 궁금했는데 게츠비 문서 [Code Splitting and Prefetching](https://www.gatsbyjs.com/docs/how-code-splitting-works/)을 참고했다.

## 코드 분할

프리패칭을 하기 위해 리소스 준비부터 한다.
하나의 커다란 자바스크립트 혹은 스타일시트파일로 작성한다면 모든 페이지에서 공유하기 때문에 굳이 이런 기술을 사용할 필요가 없겠지.
하지만 초기 다운로드 속도는 무척 포기해야한다.

웹팩은 모듈 의존성에 따라 코드를 분할하는 기능을 가지고 있는데 게츠비는 이걸 이용해서 페이지 단위로 코드를 나누어 여러개 작은 청크(chunk)를 만든다.

그리그 페이지별로 필요한 청크 목록을 page-data.json이란 파일에 만들어 둔다.

빌드 결과물을 보면 구조를 가늠할 수 있다.

```
/public
  /page-data
    /index
      page-data.json
    /page-2
      page-data.json
  /component---src-pages-index-js-c30d7ecfca49b0dee715.js
  /component---src-pages-page-2-c30d7ecfca49b0dee715.js
```

설명을 위해 결과물을 단순하게 정리했다.
두 개 페이지 /index, /page-2 가 있는데 각 페이지가 로딩할 자바스크립트와 둘을 매칭하는 정보인 page-data.json 파일들이 있다.
이제 이걸 가지고 프리로디와 프리패치를 할거다.

## 프리로드

index.html 코드를 보자

```html
<head>
  <!-- 1 -->
  <link
    as="script"
    rel="preload"
    href="/component---src-pages-index-js-c30d7ecfca49b0dee715.js"
  />
  <!-- 3 -->
  <link
    rel="prefetch"
    href="/page-data/page-2/page-data.json"
    crossorigin="anonymous"
    as="fetch"
  />
</head>
<body>
  <!-- 4 -->
  <script id="gatsby-chunk-mapping">
    /*<![CDATA[*/
    window.___chunkMapping = {
      "component---src-pages-index-js": [
        "/component---src-pages-index-js-c30d7ecfca49b0dee715.js",
      ],
      "component---src-pages-page-2-js": [
        "/component---src-pages-page-2-js-ef8c063115e3c48e159a.js",
      ],
    } /*]]>*/
  </script>
  <!-- 2 -->
  <script
    src="/component---src-pages-index-js-c30d7ecfca49b0dee715.js"
    async=""
  ></script>
</body>
```

index 페이지에서 사용할 component---src-pages-index-js-{hash}.js 파일을 프리로딩한다(1번).
그러면 화면 렌더링을 차단하지 않고 파일을 다운로드할 것이다.

리소르를 사용할 시점(2번)에 가서는 파일일 준비되어 있을 것이고 바로 사용할 수 있다.

## 프리패치

게츠비에서 다음 페이지를 불러기오기 위한 프리패치는 두 가지 시점에서 발생한다.

1. 페이지 컴포넌트가 마운트 되었을 때
1. 링크에 hover 이벤트가 발생했을 때

이렇게 동작하는 것은 대부분 게츠비 링크(GAtsbyLink) 컴포넌트의 역할 덕분이다.

### GatsbyLink

reach-router 패키지의 Link 컴포넌트를 확장한 GatsbyLink는 프리패치를 위한 동작이 추가되어 있다.

```js
class GatsbyLink extends React.Component {
  // 1. 컴포넌트 마운트 되었을 때: 로더에 경로를 추가한다(prefetch 유도).
  componentDidMount() {
    ___loader.enqueue(
      parsePath(rewriteLinkPath(this.props.to, window.location.pathname)).pathname
    )
  }

  render() {
    // 2. 링크에 hover 이벤트 발생시: 로더의 hovering() 메소드를 호출한다(prefetch 유도).
    return (
      <Link onMouseEnter={e => ___loader.hovering(parsePath(prefixedTo).pathname)} />
  }
}
```

리액트 SPA를 개발할때 리액트 라우터를 사용하듯이 게츠비 프로젝트 안에서는 이 컴포넌트를 사용해서 링크를 처리한다.
이 컴포넌트가 마운트 완료하면 로더라는(`___loader`)녀석에게 이 라우터에 정의한 경로, 즉 화면 경로를 추가(enqueue)한다.
이 다음에 곧장 보겠지만 로더는 받은 화면 경로에 대해 프리패징 작업을 게시한다.

두번째 프리패칭은 링크에서 hover 이벤트가 발생했을 경우다.
렌더함수에서 리치 라우터의 Link 컴포넌트를 렌더링한다.
이때 onMouseEnter 속성에 로더의 hovering() 메소드를 호출하는 콜백함수를 전달했다.
이것도 마찬가지로 프리패칭 작업을 게시한다.

그럼 게츠비의 로더를 함 살펴보자

### Loader

정확히는 BaseLoader를 상속한 ProdLoader 클래스다.

게츠비링크가 마운트될때 실행하는 enqueue()는 prefetch() 메소드를 호출한다.
함수 호출 깊이가 좀 있긴 하지만 주석에 달아둔 번호대로 따라가 보자.

```js
class BaseLoader {
  // 1. prefetch()
  prefetch(pagePath) {
    this.doPrefetch(findPath(pagePath))
  }
}

class ProdLoader extends BaseLoader {
  // 2. doPrefetch()
  doPrefetch(pagePath) {
    // 2.1 page-data.json 경로를 만든다
    const pageDataUrl = createPageDataUrl(pagePath)

    // 2.2 링크 태그를 돔에 추가해 리소스를 다운로드 한다
    // <link rel="prefetch" herf="page-data.json" as="fetch">
    return prefetchHelper(pageDataUrl, { as: `fetch` }).then(result => {
      // 2.3 page-data에서 받은 청크 이름을 얻는다
      // ???
      const chunkName = result.payload.componentChunkName

      // 2.4 청크 이름과 컴포넌트 매핑테이블로 컴포넌트 리소스 uri를 만든다
      // ???
      const componentUrls = createComponentUrls(chunkName)

      // 2.5 링크 태그를 돔에 추가해 리소스를 다운로드 한다
      // <link>
      return Promise.all(componentUrls.map(prefetchHelper))
    })
  }
}
```

```js
const createPageDataUrl = path => {
  return `${__PATH_PREFIX__}/page-data/${fixedPath}/page-data.json`
}
```

```js
// prefetchHeler.js

const prefetch = function (url, options) {
  supportedPrefetchStrategy(url, options)
}

export default prefetch

const supportedPrefetchStrategy = support(`prefetch`)
  ? linkPrefetchStrategy
  : xhrPrefetchStrategy

const linkPrefetchStrategy = function (url, options) {
  return new Promise((resolve, reject) => {
    const link = document.createElement(`link`)
    link.setAttribute(`rel`, `prefetch`)
    link.setAttribute(`href`, url)

    Object.keys(options).forEach(key => {
      link.setAttribute(key, options[key])
    })

    link.onload = resolve
    link.onerror = reject

    const parentElement =
      document.getElementsByTagName(`head`)[0] ||
      document.getElementsByName(`script`)[0].parentNode
    parentElement.appendChild(link)
  })
}
```

// todo: 설명

두번째 hovering() 메소드를 보자

```js
class BaseLoader {
  // 1. hovering()
  hovering(rawPath) {
    this.loadPage(rawPath)
  }

  // 2. loadPage
  loadPage(rawPath) {
    const pagePath = findPath(rawPath)
    const inFlightPromise = Promise.all([
      this.loadAppData(),
      this.loadPageDataJson(pagePath),
    ])
  }

  // 3
  loadPageDataJson(rawPath) {
    const pagePath = findPath(rawPath);
    return this.fetchPageDataJson({ pagePath })
  }

  // 4.
  fetchPageDataJson(loadObj) {
    const { pagePath, retries = 0 } = loadObj
    const url = createPageDataUrl(pagePath)
    return this.memoizedGet(url)
}
```

- 하이퍼링크에 포커스하면 프리패칭을 시작한다.
- json데이터를 가져온다. 다음 페이지에 필요한 리소스 목록이 담겼다.
- \_\_\_chunkMapping과 조합해서 리소스 uri를 계산한다.
- 다운로드 해서 브라우져 캐쉬에 저장한다. 다음 페이지 진입히 브라우져는 캐쉬를 사용할 것이다.

### GatsbyLink

- 프리패치를 가능케 하는 것이 GatsbyLink 컴포넌트다
- react-ourter의 <Link>를 확장한 것이다.
- <Link mouseEnter={() => ___loader.hovering(parsePath(prefixedTo).pathname)}>
- BaseLoader.hovering: this.loadPage(rawPath)
  - this.loadAppData(),
  - this.loadPageDataJson(pagePath),
  - fetchPageDataJson(loadObj) {
  - memoizedGet(url) {
  - doFetch
- ajax로 호출함
- <EnsureResource>: 리소스 보장? -> 요건 설명이 필요함?

# 결론

- 브라우져 성능을 위한 기술을 계속 발전하는 구나
- 공부 지속해야함.
