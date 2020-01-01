---
title: '프론트엔드 개발환경의 이해: Babel'
layout: post
summary: '사용하는 말이 달라서 바벨탑이 실패했듯이, 브라우져마다 사용하는 언어가 달라서 프론트엔트 코드는 일관적이지 못할 때가 많다.스팩과 브라우져가 개선되고 있지만, 여전히 인터넷 익스플로러는 프라미스를 이해하지 못한다. 작년까지만 해도 사파리 최신 브라우져는 Promise.prototype.finally 메소드를 사용할 수 없었다. 프론트엔드 개발에서 크로스브라우징 이슈는 코드의 일관성을 해치고 초심자를 불안하게 만든다.'
category: series
seriesId: 1
tags: babel
---

## 1. 배경

### 1.1 크로스 브라우징

사용하는 말이 달라서 바벨탑이 실패했듯이, 브라우져마다 사용하는 언어가 달라서 프론트엔트 코드는 일관적이지 못할 때가 많다.
스팩과 브라우져가 개선되고 있지만, 여전히 인터넷 익스플로러는 프라미스를 이해하지 못한다.
작년까지만 해도 사파리 최신 브라우져는 Promise.prototype.finally 메소드를 사용할 수 없었다.
프론트엔드 개발에서 크로스브라우징 이슈는 코드의 일관성을 해치고 초심자를 불안하게 만든다.
히브리어로 바벨이 '혼돈'이란 뜻인 것처럼 말이다. 

크로스브라우징의 혼란을 해결해 줄 수 있는 것이 바벨이다.
ECMAScript2015+로 작성한 코드를 모든 브라우져에서 동작하도록 호환성을 지켜준다.
타입스크립트, JSX처럼 다른 언어로 분류되는 것도 포함한다.

### 1.2 트랜스파일과 빌드

이렇게 변환하는 것을 "트랜스파일" 한다라고 표현한다.
변환 전후의 추상화 수준이 다른 빌드와는 달리 트랜스파일은 추상화 수준을 유지한 상태로 코드를 변환한다.
타입스크립트 → 자바스크립트, JSX → 자바스크립트처럼 트랜스파일 후에도 여전히 코드를 읽을 수 있다.

요즘에는 이 둘을 구분하지 않고 사용하는 것 같다.

## 2. 바벨의 기본 동작

바벨은 ECMAScript2015 이상의 코드를 적당한 하위 버전으로 바꾸는 것이 주된 역할이다.
이렇게 바뀐 코드는 인터넷 익스프로러나 구버전 브라우져처럼 최신 자바스크립트 코드를 이해하지 못하는 환경에서도 잘 동작한다.

바벨을 이용해 아래 코드를 인터넷 익스플로러가 이해할 수 있는 코드로 바꿔 보겠다.

```js
// src/app.js:
const alert = msg => window.alert(msg);
```

먼저 바벨 최신 버전를 설치한다.
터미널 도구를 사용하기 위해 커맨드라인 도구도 함께 설치하자.

```
npm install @babel/core  @babel/cli
```

설치를 완료후 node_modules/.bin 폴더에 추가된 바벨 명령어를 사용할 수 있다.

```
npx babel app.js
const alert = msg => window.alert(msg);
```

바벨은 세 단계로 빌드를 진행한다. 

1. 파싱(Parsing)
1. 변환(Transforming)
1. 출력 (Printing)

코드를 읽고 추상 구문 트리(AST)로 변환하는 단계를 **"파싱"**이라고 한다. 
이것은 빌드 작업을 처리하기에 적합한 자료구조인데 컴파일러 이론에 사용되는 개념이다.
추상 구문 트리를 변경하는 것이 **"변환"** 단계이다.
실제로 코드를 변경하는 작업을 한다.
변경된 결과물을 **"출력"**하는 것을 마지막으로 바벨은 작업을 완료한다.

그런데...... 결과를 보면 빌드 이전과 변한게 하나도 없다.

## 3. 플러그인

기본적으로 바벨은 코드를 받아서 코드를 반환한다.
바벨 함수를 정의한다면 이런 모습이 될 것이다.

```js
const babel = code => code;
```

바벨은 파싱과 출력만 담당하고 변환 작업은 다른 녀석이 처리하데 이것을 **"플러그인"** 이라고 부른다. 

### 3.1 커스텀 플러그인

플러그인을 직접 만들면서 동작이 원리를 살펴 보겠다.
myplugin.js 라는 파일을 아래처럼 만들어 보자(출처: [바벨 홈페이지의 예제 코드](https://babeljs.io/docs/en/plugins#plugin-development)). 

```js
// myplugins.js:
module.exports = function myplugin() {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;

        // 바벨이 만든 AST 노드를 출력한다
        console.log('Identifier() name:', name) 
        
        // 변환작업: 코드 문자열을 역순으로 변환한다
        path.node.name = name
          .split("")
          .reverse()
          .join("");
      }
    },
  };
}
```

플러그인 형식은 visitor 객체를 가진 함수를 반환해야 한다.
이 객체는 바벨이 파싱하여 만든 추상 구문 트리(AST)에 접근할 수 있는 메소드를 제공한다. 
그중 Identifier() 메소드의 동작 원리를 살펴보는 코드다. 

플러그인 사용법을 알아보자.

```
npx babel --help 

  --plugins [list]                            A comma-separated list of plugin names.
```

`--plugins` 옵션에 플러그인을 추가하면 된다.

```
npx babel app.js --plugins ./myplugin.js

Identifier() name: alert
Identifier() name: msg
Identifier() name: window
Identifier() name: alert
Identifier() name: msg

const trela = gsm => wodniw.trela(gsm);
```

Identifier() 메소드로 들어온 인자 path에 접근하면 코드 조각에 접근할 수 있는 것 같다.
path.node.name의 값을 변경하는데 문자를 뒤집는 코드다.
결과의 마지막 줄에서 보는것 처럼 이 코드의 문자열 순서가 역전되었다.

우리가 하려는것은 ECMASCript2015로 작성한 코드를 인터넷 익스플로러에서 돌리는 것이다. 
먼저 const 코드를 var로 변경하는 플러그인을 만들어 보겠다.

```js
// myplugin.js:
module.exports = function myplugin() {
  return {
    visitor: {
      // https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-block-scoping/src/index.js#L26
      VariableDeclaration(path) {
        console.log('VariableDeclaration() kind:', path.node.kind); // const
        
        if (path.node.kind === 'const') {
          path.node.kind = 'var'
        }
      },
    },
  };
}
```

이번에는 vistor 객체에 VariableDeclaration() 메소드를 정의했다. 
path에 접근해 보면 키워드가 잡히는 걸 알 수 있다.
path.node.kind가 const 일 경우 var로 변환하는 코드다.

이 플러그인으로 다시 빌드해보자.

```
npx babel app.js --plugins ./myplugin.js

VariableDeclaration() kind: const

var alert = msg => window.alert(msg);
```

마지막 줄에 보면 const 코드가 var로 변경되었다.

### 3.2 플러그인 사용하기 

이러한 결과를 만드는 것이 [block-scoping](https://babeljs.io/docs/en/babel-plugin-transform-block-scoping) 플러그인이다. 
const, let 처럼 블록 스코핑을 따르는 예약어를 함수 스코핑을 사용하는 var 변경한다.

NPM 패키지로 제공하는 플러그인을 설치하고,

``` 
npm install @babel/plugin-transform-block-scoping
```

설치한 플러그인을 사용해보면,

```
npx babel app.js --plugins @babel/plugin-transform-block-scoping

var alert = msg => window.alert(msg);
```

커스텀 플러그인과 같은 결과를 보인다. 

인터넷 익스플로러는 화살표 함수도 지원하지 않는데 [arrow-functions](https://babeljs.io/docs/en/babel-plugin-transform-arrow-functions) 플러그인을 이용해서 일반 함수로 변경할 수 있다.

```
npm install @babel/plugin-transform-arrow-functions

npx babel app.js \
  --plugins @babel/plugin-transform-block-scoping \
  --plugins @babel/plugin-transform-arrow-functions

var alert = function (msg) {
  return window.alert(msg);
};
```

ECMAScript5에서부터 지원하는 엄격 모드를 사용하는 것이 안전하기 때문에 `"use strict"` 구문을 추가해야 겠다.
[strict-mode](https://babeljs.io/docs/en/babel-plugin-transform-strict-mode) 플러그인을 사용하자.

그전에 커맨드라인 명령어가 점점 길어지기 때문에 설정 파일로 분리하는 것이 낫겠다. 
웹팩 webpack.config.js를 기본 설정파일로 사용하듯 바벨도 [babel.config.js](https://babeljs.io/docs/en/config-files#project-wide-configuration)를 사용한다.

프로젝트 루트에 babel.config.js 파일을 아래와 같이 작성하자.

```js
// babel.config.js:
module.exports = {
  plugins: [
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-strict-mode", 
  ]
}
```

커맨드라인에서 사용한 block-scoping, arrow-functions 플러그인을 설정 파일로 옮겼는데 plugins 배열에 추가하는 방식이다. strict-mode 플러그인을 마지막 줄에 추가했다. 

다시 빌드해보자. 

```
npx babel app.js

"use strict";

var alert = function (msg) {
  return window.alert(msg);
};
```

상단에 "use strict" 구문이 추가되어 엄격모드가 활성화 되었다. 이제야 비로소 인터넷 익스플로러에서 안전하게 동작하는 코드로 트랜스파일하였다.

이처럼 변환을 위한 플러그인 목록은 공식 문서의 [Plugins](https://babeljs.io/docs/en/plugins) 페이지에서 확인할 수 있다. 

## 4. 프리셋

ECMAScript2015+으로 코딩할 때 필요한 플러그인을 일일이 설정하는 일은 무척 지난한 일이다.
코드 한 줄 작성하는데도 세 개 플러그인 세팅을 했으니 말이다. 
목적에 맞게 여러가지 플러그인을 세트로 모아놓은 것을 **"프리셋"**이라고 한다. 

### 4.1 커스텀 프리셋

사용한 세 개 플러그인을 하나의 프리셋으로 만들어 보겠다.
mypreset.js 파일을 다음과 같이 작성하자.

```js
// mypreset.js
module.exports = function mypreset() {
  return {
    plugins: [
      "@babel/plugin-transform-arrow-functions",
      "@babel/plugin-transform-block-scoping",
      "@babel/plugin-transform-strict-mode",
    ],
  }
}
```

plugins 배열에 사용한 세 개 플러그인을 담았다. 

프리셋을 사용하기 위해 바벨 설정을 약간 수정한다.

```js
// babel.config.js
module.exports = {
  presets: [
    './mypreset.js'
  ],
}
```

플러그인 세팅 코드를 제거하고 presets에 방금 만든 mypreset.js를 추가했다. 
실행해보면 동일한 결과를 출력할 것이다.

### 4.2 프리셋 사용하기 

이처럼 바벨은 목적에 따라 몇 가지 [프리셋](https://babeljs.io/docs/en/presets)을 제공한다.

* preset-env
* preset-flow
* preset-react
* preset-typescript

preset-env는 ECMAScript2015+를 변환할 때 사용한다.
바벨 7버전 이전에는 연도별로 각 프리셋을 제공했지만(babel-reset-es2015, babel-reset-es2016, babel-reset-es2017, babel-reset-latest) 지금은 env 하나로 합쳐졌다. 
무척 맘에드는 부분이다.

preset-flow, preset-react, preset-typescript는 flow, 리액트, 타입스크립트를 변환하기 위한 프리셋이다. 

인터넷 익스플로러 지원을 위해 env 프리셋을 사용해 보자. 
먼저 패키지를 다운로드한다.

```
npm instll @babel/preset-env
```

설치한 바벨 설정을 조금만 더 바꿔본다.

```js
// babel.config.js:
module.exports = {
  presets: [
    '@babel/preset-env'
  ]
}
```

그리고 빌드하면,

```
npx babel app.js

"use strict";

var alert = function alert(msg) {
  return window.alert(msg);
};
```

우리가 만든 mypreset.js와 같은 결과를 출력한다.

## 5. env 프리셋 설정과 폴리필

과거에 제공했던 연도별 프리셋을 사용해 본 경험이 있다면 까다롭고 헷갈리는 설정 때문에 애를 먹었을지도 모르겠다. 
그에 비해 env 프리셋은 무척 단순하고 직관적인 사용법을 제공한다. 

### 5.1 타겟 브라우져 

우리 코드가 Chrome 최신버전(2019년 12월 기준)만 지원하다고 하자. 
그렇다면 인터넷 익스플로러를 위한 코드 변환은 불필요하다.
`target` 옵션에 브라우져 버전명만 지정하면 env 프리셋은 이에 맞는 플러그인들을 찾아 최적의 코드를 출력해 낸다.

```js
// babel.config.js 
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '79', // 크롬 79까지 지원하는 코드를 만든다
        }
      }
    ]
  ]
}
```

```
npx babel app.js

"use strict";

const alert = msg => window.alert(msg);
```

크롬은 블록 스코핑과 화살표 함수를 지원하기 때문에 코드를 변환하지 않고 이러한 결과물을 만들었다.
만약 인터넷 익스플로러도 지원해야 한다면 바벨 설정에 브라우져 정보만 하나 더 추가하면 된다.

```js
// babel.config.js :
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '79',
          ie: '11' // ie 11까지 지원하는 코드를 만든다
        }
      }
    ]
  ]
}
```

### 5.2 폴리필

이번엔 변환과 조금 다른 플리필에 대해 알아보자.

ECMASCript2015의 Promise 객체를 사용하는 코드다.

```js
// app.js:
new Promise();
```

바벨로 처리하면 어떤 결과가 나올까? 

```
npx babel app.js

"use strict";

new Promise();
```

env 프리셋으로 변환을 시도했지만 Promise 그대로 변함이 없다.
target에 ie 11을 설정하고 빌드한 것인데 인터넷 익스플로러는 여전히 프라미스를 해석하지 못하고 에러를 던진다.

![promise-error-in-ie](/assets/imgs/2019/12/22/ie-promise-error.jpg)

브라우져는 현재 스코프부터 시작해 전역까지 Promise라는 이름을 찾으려고 시도할 것이다.
그러나 스코프 어디에도 Promise란 이름이 없기 때문에 레퍼런스 에러를 발생하고 프로그램이 죽은 것이다.

플러그인이 프라미스를 ECMAScript5 버전으로 변환할 것으로 기대했는데 예상과 다르다.
바벨은 ECMAScript2015+를 ECMAScript5 버전으로 변환할 수 있는 것만 빌드한다.
그렇지 못한 것들은 "**폴리필**"이라고 부르는 코드조각을 추가해서 해결한다. 

가령 ECMAScript2015의 블록 스코핑은 ECMASCript5의 함수 스코핑으로 대체할 수 있다.
화살표 함수도 일반 함수로 대체할 수 있다. 
이런 것들은 바벨이 변환해서 ECMAScript5 버전으로 결과물을 만든다. 

한편 프라미스는 ECMAScript5 버전으로 대체할 수 없다. 
다만 ECMAScript5 버전으로 구현할 수는 있다(참고: [core-js promise](https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.promise.js)). 

env 프리셋은 폴리필을 지정할 수 있는 옵션을 제공한다.

```js
// babel.config.js:
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // 폴리필 사용 방식 지정
        corejs: { // 폴리필 버전 지정
          version: 2
        }
      },
    ],
  ],
};
```

`useBuiltIns`는 어떤 방식으로 폴리필을 사용할지 설정하는 옵션이다. 
"usage" , "entry", false 세 가지 값을 사용하는데 기본값이 false 이므로 폴리필이 동작하지 않았던 것이다. 
반면 usage나 entry를 설정하면 폴리필 패키지 중 core-js를 모듈로 가져온다(이전에 사용하던 babel/polyfile은 바벨 7.4.0부터 사용하지 않음).

corejs 모듈의 버전도 명시하는데 기본값은 2다. 
버전 3과 차이는 확실히 잘 모르겠다. 
이럴 땐 그냥 기본값을 사용하는 편이다.

자세한 폴리필 옵션은 바벨 문서의 [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins)와 [corejs](https://babeljs.io/docs/en/babel-preset-env#corejs) 섹션을 참고하자.

폴리필이 추가된 결과물을 확인해 보자.

```
npx babel src/app.js
"use strict";

require("core-js/modules/es6.promise");
require("core-js/modules/es6.object.to-string");

new Promise();
```

core-js 패키지로부터 프라미스 모듈을 가져오는 임포트 구문이 상단에 추가되었다.
이제야 비로소 인터넷 익스플로러에서 안전하게 돌아가는 결과물을 만들었다.

## 6. 웹팩으로 통합

실무 환경에서는 바벨을 직접 사용하는 것보다는 웹팩으로 통합해서 사용하는 것이 일반적이다.
로더 형태로 제공하는데 [babel-loader](https://github.com/babel/babel-loader)가 그것이다.

먼저 패키지를 설치하고,

```
npm install babel-loader
```

웹팩 설정에 로더를 추가한다.

```js
// webpack.config.js:
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader', // 바벨 로더를 추가한다 
      },
    ]
  },
}
```

.js 확장자로 끝나는 파일은 babel-loader가 처리하도록 설정했다.
사용하는 써드파티 라이브라리가 많을수록 바벨 로더가 느리게 동작할 수 있는데 node_modules 폴더를 로더가 처리하지 않도록 예외 처리했다([참고](https://github.com/babel/babel-loader#babel-loader-is-slow)).

웹팩으로 빌드하면,

```
npm run build

> webpack

Hash: a30cff5fbf53027423a0
Version: webpack 4.41.2
Time: 718ms
Built at: 2019. 12. 16. 오전 8:52:05
  Asset      Size  Chunks             Chunk Names
main.js  59.7 KiB    main  [emitted]  main
Entrypoint main = main.js
[./src/app.js] 166 bytes {main} [built]
```

미리 등록해 놓은 NPM build 스크립트의 webpack 명령어가 동작한다.
./src/app.js의 엔트리 포인트가 바벨 로더에 의해 빌드되고 결과물이 dist/main.js로 옮겨졌다.

```
cat ./dist/main.js | grep 'var alert' -A 5

var alert = function alert(msg) {
  return window.alert(msg);
};

new Promise();
```

웹팩으로 번들링되면서 변경된 부분 찾기가 어려울수 있는데 grep으로 변경되 부분만 확인했다.

## 7. 정리

바벨은 일관적인 방식으로 코딩하면서, 다양한 브라우져에서 돌아가는 어플리케이션을 만들기 위한 도구다.

바벨의 코어는 파싱과 출력만 담당하고 변환 작업은 플러그인이 처리한다.

여러 개의 플러그인들을 모아놓은 세트를 프리셋이라고 하는데 ECMAScript+ 환경은 env 프리셋을 사용한다.

바벨이 변환하지 못하는 코드는 폴리필이라 부르는 코드조각을 불러와 결과물에 로딩해서 해결한다.

babel-loader로 웹팩과 함께 사용하면 훨씬 단순하고 자동화된 프론트엔드 개발환경을 갖출 수 있다.

