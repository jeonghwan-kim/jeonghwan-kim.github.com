---
slug: /2025/01/07/module-federation
date: 2025-01-07
title: 모듈 페더레이션 구조와 동작 원리
layout: post
tags:
  - 빌드도구
---

import 함수는 실행 환경에 따라 전달받은 인자를 해석하여 해당 자원을 불러온다. 예를 들어 Node.js 환경에서는 파일을, 브라우져 환경에서는 HTTP 요청을 통해 자원을 로드한다.

이 특성을 이용하면 애플리케이션 초기 로딩 속도를 개선할 수 있겠다. 초기에는 최소한의 코드만 로드하고, 필요할 때 나머지 코드를 지연 로딩할 수 있기 때문이다.

이 글에서는 동적으로 자바스크립트 코드를 불러오는 기술인 **모듈 페더레이션(Module Federation)** 의 동작 원리를 살펴보겠다.

# 메니페스트를 가져오기

모듈 페더레이션으로 구성한 어플리케이션을 **호스트(Host)** 라고 부른다. 집에 손님을 초대해 파티를 주최하는 사람을 호스트라고 부르는 것과 비슷하다. 호스트는 **원격 모듈(Remote Module)** 이라는 외부 코드를 가져와 어플리케이션을 구성한다.

이를 위해 원격 모듈의 **메니페스트(Manifest)** 파일을 HTTP 요청으로 가져온다.

```js
getManifestJson(manifestUrl, moduleInfo, extraOptions)
```

예를 들어 localhost:3000 에서 구동하는 호스트 어플리케이션은 다음 요청을 통해 원격 모듈의 메니페스트 파일을 가져 온다.

```
GET http://localhost:3001/dist/manifest.json
```

메니페스트는 다음 두 가지 정보를 제공한다.

1. **remoteEntry**: 원격 모듈의 진입점(Entry Point)
2. **exposes**: 노출된 모듈의 정보

remoteEntry에 대해 더 알아보자.

# 원격 진입점 가져오기

원격 메니페스트를 가져온 호스트는 remoteEntry 필드에 있는 이름의 청크를가져온다. 이 파일은 호스트가 원격 모듈과 상호작용하기 위한 진입점이다.

호스트가 getRemoteEntry 를 호출해 RemoteEntry 파일을 불러온다.

```js
function preloadAssets() {
  getRemoteEntry() // "http://localhost:3001/dist/myRemote.js"
}
```

브라우져는 아래와 같은 HTTP 요청을 통해 이 파일을 다운로드 한다.

```
GET http://localhost:3001/dist/myRemote.js
```

# 원격 컨테이너 생성

원격 모듈이 제공한 진입점은 모듈 로더를 제공한다.

```js
// 모듈 맵
var moduleMap = {
  "./math": () => {
    /* ... */
  },
  "./Button": () => {
    /* ... */
  },
}

// 모듈 로더
var get = module => {
  return moduleMap[module]()
}
```

호스트가 get 함수에 모듈 이름을 전달하면 이 코드는 moduleMap에서 해당 청크를 찾는다.

호스트에서 원격 모듈의 특정 모듈을 사용하면 브라우져는 HTTP 요청을 통해 이 청크를 다운로드할 것이다.

```
GET http://localhost:3001/dist/__federation_expose_math.js
```

공유 스코프를 초기화하는 역할도 한다고 하는데 충분히 이해하지는 못했다.

# 원격 모듈을 사용하기

원격 모듈을 사용해 보자.

호스트에서 노출된 math 모듈을 가져온다.

```js
import("myRemote/math").then(mathModule => {
  const math = mathModule.default
  math.add(1, 2) // 3
})
```

import 함수에 원격지 이름과 사용할 모듈 경로를 전달해 실행한다. 브라우져는 HTTP 요청을 만들고 코드 덩어리로 이행되는 프라미스를 반환한다.

```
GET http://localhost:3001/dist/__federation_expose_math.js
```

이 값이 이행되면 모듈 코드를 실행할 수 있다. default 필드에 담겨진 모듈의 원격 모듈의 add() 함수를 호스트에서 실행할 수 있다.

```
3
```

--

리액트 컴포넌트도 불러올 수 있다.

```js
const Button = React.lazy(() => import("myRemote/Button"))

function App() {
  const [theme, setTheme] = React.useState("light")

  function handleClick() {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <>
      <h1>Host</h1>
      <React.Suspense fallback={"Loading..."}>
        <Button theme={theme} onClick={handleClick}>
          Change theme
        </Button>
      </React.Suspense>
    </>
  )
}
```

마찬가지로 import 함수에 원격지 이름과 사용할 모듈 경로를 전달해 실행하면 같은 순서로 HTTP 요청을 만든다.

```
GET http://localhost:3001/dist/__federation_expose_button.js
```

원격지가 제공한 코드를 React.lazy 함수가 LazyComponent 로 조합해 반환할 것이다.

이 컴포넌트를 React.Suspense 컴포넌트와 함께 사용했다. 프라미스가 이행되기 전까지는 fallback 값을 렌더한다. 프라미스가 이행되어 값을 반환하면 호스트가 원격 모듈의 컴포넌트를 수신한 것이다. React.Suspense는 Button 컴포넌트를 그릴 것이다.

# React.lazy와 비교

[앞서 살펴본 리액트의 lazy](/2024/12/18/react-lazy) 함수와 비슷하다. 동적으로 자바스크립트 코드 청크를 불러와 실행중인 어플리케이션과 결합하기 때문이다.

하지만 구조와 쓰임이 다르다.

**1. 별도 프로젝트에서 사용**

lazy는 같은 프로젝트에서만 사용할 수 있다. lazy 함수를 사용할 때 주석으로 청크 이름을 정의한다.

```js
const myModule = React.lazy(() =>
  /* WebpackChunkName: myModule */ import("./myModule.js")
)
```

웹팩은 이 주석을 보고 myModule.js 를 청크를 분리하고 WebpackChunkName에 해당하는 값으로 파일 이름을 만든다.

한편 모듈 페데레이션은 별도 프로젝트에서 원격 모듈을 정의할 수 있다. 호스트와 원격 모듈은 각자의 번들러를 사용해 모듈 페데레이션 빌드도구를 이용해서 코드를 번들한다.

**2. 단독으로 배포**

이러한 구조적 차이로 모듈 페더레이션을 사용하면 호스트와 원격이 서로 단독으로 배포할 수 있다. 모듈 간의 인터페이스만 맞다면 각 프로젝트가 독립적으로 업데이트해 배포할 수 있다.

**3. 컴포넌트를 포함한 자바스크립트**

리액트 lazy는 오직 리액트 컴포넌트만만 동적으로 로드하는 기능을 제공한다. 하지만 모듈 페더레이션은 이에 국한되지 않고, 자바스크립트로 작성한 모듈이라면 어떤 것이든 동적으로 로드할 수 있다.

예를 들어 앞서 살펴본 math 모듈처럼 단순한 유틸리티 함수도 제공할 수 있다. 비지니스 로직, 데이터 모델 등 다양한 종류의 모듈을 동적으로 공유해 로드할 수 있을 것이다.

# 결론

모듈 페더레이션은 import 함수를 이용해 원격 모듈과 호스트 모듈간에 코드 공유 기법이다. 원격 모듈이 모듈 시작점과 각 기능을 청크로 제공해서 누구든이 필요할 때 다운로드해 실행중인 어플리케이션과 동적으로 결합하는 방식이다.

이러한 구조는 React.lazy() 함수와 달리 별도 프로젝트에서 개발할 수 있다. 개발 의존성을 격리할 수 있고 단독으로 배포할 수 있어 더 유연하다.

# 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.io-examples/tree/main/2025-01-02-module-federation)
- [module-federation/core | Github](https://github.com/module-federation/core)
- [Webpack Module Federation 도입 전에 알아야 할 것들 | 카카오 FE 기술블로그](https://fe-developers.kakaoent.com/2022/220623-webpack-module-federation/)
