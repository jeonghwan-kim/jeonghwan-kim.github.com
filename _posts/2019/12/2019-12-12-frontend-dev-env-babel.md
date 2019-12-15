---
title: '프론트엔드 개발환경의 이해: Babel'
layout: post
summary: ''
category: series
tags: babel
---

## 1. 배경
바벨탑 이야기

트랜스파일 vs 빌드  

## 2 바벨의 기본 동작
바벨은 ECMAScript 2015 이상의 코드를 적당한 하위 버번으로 변경하는 것이 주된 역할이다. 인터넷 익스프로러나 하위버전의 브라우져처럼 최신 자바스크립트 코드를 이해하지 못하는 환경을 지원하기 때문이다. 

바벨을 이용해 아래 코드를 IE가 인식하는 코드로 변환시켜 보겠다.

src/app.js:
```js
const alert = msg => window.alert(msg);
```

먼저 바벨 최신버전를 설치한다.

```
$ npm install @babel/core  @babel/cli
```

터미널 도구를 사용하기 위해 커맨드라인 도구도 설치한다.

설치를 완료후 node_modules/.bin 폴더에 추가된 바벨 명령어를 사용해 보자.

```
$ npx babel app.js
const alert = msg => window.alert(msg);
```

바벨은 세 단계로 빌드를 진행한다. 

1. 파싱(Parsing)
1. 변환(Transforming)
1. 출력 (Printing)

하지만 결과는 빌드 이전과 변한게 없다.

## 3. 플러그인

기본적으로 바벨은 코드를 받아서 코드를 반환하는 동작을 수행한다. 바벨 함수를 정의한다면 이런 모습이 될 것이다.

```js
const babel = code => code;
```

파싱하는 것 까지는 바벨이 처리하지만 변환하는 작업은 다른 녀석이 해야하는데 이것을 **"플러그인"** 이라고 부른다. 

### 3.1 커스텀 플러그인

플러그인을 직접 만들면서 동작이 이해해 보겠다. 
myplugin.js 라는 파일을 다음과 같이 만들어 보자(출처: [바벨 홈페이지의 예제 코드](https://babeljs.io/docs/en/plugins#plugin-development)). 

myplugins.js:
```js
module.exports = function myplugin() {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;
        console.log(‘Identifier() name:’, name) // 로그 추가
        path.node.name = name
          .split("")
          .reverse()
          .join("");
      }
    },
  };
}
```

플러그인은 visitor 객체를 가진 함수를 반환하는 형식을 가진다. 
반환된 이 객체는 바벨의 첫번재 작업인 파싱의 결과물인 추상 구문 트리(AST)에 접근할수 있는 메소드를 제공한다. 
그중 Identifier() 메소드의 동작 원리를 살펴보는 코드다. 

결과부터 확인해 보자. 

```
$ npx babel --help 
  --plugins [list]                            A comma-separated list of plugin names.
```

플러그인을 사용하려면 --plugins 옵션에 플러그인을 추가하면 된다.

```
$ npx babel app.js --plugins ./myplugin.js
Identifier() name: alert
Identifier() name: msg
Identifier() name: window
Identifier() name: alert
Identifier() name: msg
const trela = gsm => wodniw.trela(gsm);
```

Identifier() 메소드로 들어온 인자 path에 접근하면 코드 조각에 접근할 수 있는 것 같다. 
path.node.name의 값을 변경하는데 문자를 뒤집는 코드다. 
결과의 마지막 줄에서 보는것 처럼 이 코드는 모두 문자 순서가 역전되었다. 

우리가 하려는것은 ECMASCript2015 로 작성한 코드를 IE 브라우져에서 돌리는 것이다. 
먼저 const 코드를 var로 변경하는 플러그인을 만들어 보자.

myplugin.js:
```js
module.exports = function myplugin() {
  return {
    visitor: {
      // https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-block-scoping/src/index.js#L26
      VariableDeclaration(path) {
        console.log(‘VariableDeclaration() kind:’, path.node.kind); // kind
        if (path.node.kind === 'const') {
          path.node.kind = 'var'
        }
      },
    },
  };
}
```

이번에는 vistor 객체에 VariableDeclaration() 메소드를 정의했다. 
인자 path에 접근해 보면 키워드가 잡히는걸 알수 있다. 
path.node.kind가 const 일 경우 var로 변환하는 코드다.

이 플러그인으로 빌드해보자.

```
$ npx babel app.js --plugins ./myplugin.js
VariableDeclaration() kind: const
var alert = msg => window.alert(msg);
```

const 코드가 var로 변경되었다. 

### 3.2 플러그인 사용하기 
이러한 동작을 하는것이 [block-scoping](https://babeljs.io/docs/en/babel-plugin-transform-block-scoping) 플러그인이다. 
const, let 처럼 블록 스코핑을 따르는 예약어를 함수스코핑을 사용하는 var 예약어로 변경한다.

npm 패키지로 제공하는 플러그인을 설치하자.

``` 
$ npm install @babel/plugin-transform-block-scoping
```

설치한 플러그인을 이용한다.

```
$ npx babel app.js --plugins @babel/plugin-transform-block-scoping
var alert = msg => window.alert(msg);
```

커스텀 플러그인과 같은 결과를 볼수 있다. 

IE 브라우져는 화살표 함수도 지원하지 않는데 이걸 변환하는 것이 [arrow-functions](https://babeljs.io/docs/en/babel-plugin-transform-arrow-functions) 플러그인이다. 
이것도 설치해서 사용해 보자. 

```
$ npm install @babel/plugin-transform-arrow-functions
$ npx babel app.js --plugins @babel/plugin-transform-block-scoping \
  --plugins @babel/plugin-transform-arrow-functions

var alert = function (msg) {
  return window.alert(msg);
};
```

화살표 함수가 일반함수로 변경되었다. 

ES5에는 엄격모드를 사용하는 것이 좋은데 ‘use strict’ 구문을 추가해야한다. 
[strict-mode](https://babeljs.io/docs/en/babel-plugin-transform-strict-mode) 플러그인이 이 역할을 한다. 
이것도 추가해 보겠다. 

그전에 커맨드라인 명령어가 점점 커지기 때문에 설정 파일로 분리하는 것이 낫겠다. 
웹팩인 webpack.config.js를 기본 설정파일로 사용하듯 바벨도 [babel.config.js(https://babeljs.io/docs/en/config-files#project-wide-configuration)]를 사용한다.

프로젝트 루트에 babel.config.js 파일을 아래와 같이 작성하자.

babel.config.js:
```
module.exports = {
  plugins: [
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-strict-mode", 
  ]
}
```

커맨드라인에서 사용한 block-scoping, arrow-functions 플러그인을 설정 파일로 옮겼는데 plugins 배열에 추가하는 방식이다. strict-mode 플러그인을 마지막에 추가했다. 

다시 빌드해보자. 

```
$ npx babel app.js
"use strict";

var alert = function (msg) {
  return window.alert(msg);
};
```

상단에 "use strict" 구문이 추가되어 엄격모드가 활성화 되었다. 이제야 비로소 IE 브라우져에서 구동하는 코드로 변환하였다. 

이처럼 변환을 위한 플러그인 목록은  공식 문서의 [Plugins](https://babeljs.io/docs/en/plugins) 페이지에서 확인할 수 있다. 

## 4. 프리셋

ECMAScript2015 이상 버전으로 코딩할때 플러그인을 하나씩 선택해서 바벨을 설정하는 일은 무척 지루해질 것이다. 
코드 한줄 작성하는데도 세개 플러그인 세팅을 햇으니 말이다. 
여러 플러그인을 목적에 맞게 모아놓은 것을 바벨에서는 **"프리셋"**이라고 한다. 

### 4.1 커스텀 프리셋

지금까지 사용한 세개 플러그인을 하나의 프리셋으로 만들어 보겠다.
mypreset.js 파일을 다음과 같이 작성하자.

mypreset.js:
```js
module.exports = function mypreset() {
  return {
    plugins: [
      "@babel/plugin-transform-arrow-functions",
      "@babel/plugin-transform-block-scoping",
      "@babel/plugin-transform-strict-mode",
    ]
  }
}
```

plugins 배열을가지는 객체를 반환하는 함수를 만들었다. 그동안 사용한 세개의 플러그인을 배열에 담았다. 

프리셋을 사용하기위해 바벨 설정파일을 수정한다.

babel.config.js:
```js
module.exports = {
  presets: [
    './mypreset.js'
  ]
}
```

플러그인 세팅 코드를 제거하고 presets 에 방금만든 mypreset.js를 추가했다. 실행해보면 동일한 결과를 나타낸다. 

```
$ npx babel app.js
"use strict";

var alert = function (msg) {
  return window.alert(msg);
};
```

### 4.2 프리셋 사용하기 

이처럼 바벨은 목적에 따라 [프리셋](https://babeljs.io/docs/en/presets)을 제공하는데 다음과 같다. 

* preset-env
* preset-flow
* preset-react
* preset-typescript

preset-env는 ECMAScript2015 이상을 변환하는 용도이다. 
바벨 7버전 이전에는 각 연도별로 프리셋을 제공(babel-reset-es2015, babel-reset-es2016, babel-reset-es2017, babel-reset-latest)했지만 최신버번에는 env 하나로 합쳐졌다. 

preset-flow/react/typescript는 flow, 리액트, 타입스크립트를 변환하기 위한 프리셋이다. 

IE 브라우져용 코드 변환을 위해 env 프리셋을 사용해 보자. 먼저 패키지를 다운로드한다.

```
$ npm instll @babel/preset-env
```

설치한 env 프리셋을 바벨 설정 파일에 추가한다.

babel.config.js:
```js
module.exports = {
  presets: [
    '@babel/preset-env'
  ]
}
```

```
 npx babel app.js
"use strict";

var alert = function alert(msg) {
  return window.alert(msg);
};
```
우리가 만든 mypreset.js 와 동일한 결과를 만들어 냈다. 

## 5. env 프리셋 설정과 폴리필

기존에 제공하는 프리셋을 사용해본적이 있다면 다소 까다롭고 헷갈리는 설정에 애를 먹었을지도 모르겠다. env 프리셋은 무척 단순하고 직관적인 설정 방법을 제공한다. 

### 5.1 타겟 브라우져 

만약 우리 코드가 Chrome 최신버전(2019년 12월 기준)만 지원하다고 하자. 그렇다면 ie를 위한 코들 변환은 필요없는 작업이 될 것이다. target 옵션에 브라우져 버전명을 지정하면 env 프리셋은 이에 맞는 플러그인들을 이용해 최적의 코드를 생성한다.

babel.config.js 
```js
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
$ npx babel app.js
"use strict";

const alert = msg => window.alert(msg);
```

크롬은 const와 화살표 함수를 지원하는 브라우져이기 때문에 이러한 코드를 결과물로 만든다. 
크롬을 포함한 IE 브라우져도 지원한다면 target에 브라우져 정보를 추가하면 된다.

babel.config.js :
```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '79',
          ie: ‘11’ // ie 11까지 지원하는 코드를 만든다
        }
      }
    ]
  ]
}
```

### 5.2 폴리필

ECMASCript2015 스펙중에 Promise 객체를 사용하는 코드를 추가한 뒤 빌드해 보자.

app.js:
```js
new Promise()
```

```
$ npx babel app.js
"use strict";

new Promise();
```

env 프리셋을 통과했지만 결과는 그대로다. 이걸 IE 브라우져에서 돌려보자.

![promise-error-in-ie]()

브라우져는 Promise 객체를 모르기 때문에 함수 호출로 다룬다. 당연히 Promise란 전역 함수가 없기 때문에 타입에러를 발생하고 프로그램이 죽는다. 

이처럼 ...을 폴리필이라고 한다. 바벨 플러그인은 이처럼 ...을 처리하지 못하다. 이런 것을 해결하는 것을  ‘폴리필'이라고 한다. 

env 프리셋은 어떤 폴리필을 사용할까를 지정할수 있다. 

babel.config.js:
```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: '11',
        },
        useBuiltIns: 'usage',
        corejs: {
          version: 2
        }
      },
    ],
  ],
};
```

useBuiltIns는 어떤 폴리 필을 사용할지 설정하는 옵션이다. "usage" , "entry", false 세가지 값을 사용하는데 기본값이 false이므로 폴리필이 동작하지 않았던 것이다. usage나 entry를 설정하면 env 프리셋이 폴리필인 core-js 모듈을 가져온다(이전에 사용하던 babel/polyfile은 바벨 7.4.0에서 디프리케이트 됨).

폴리필로 사용하는 corejs 모듈의 버전도 명시하는데 기본값이 2이다. 

자세한 폴리필 옵션은 바벨 문서의 [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins)와 [corejs](https://babeljs.io/docs/en/babel-preset-env#corejs) 섹션을 참고하자.

## 6. 웹팩으로 통합

프론트엔드 개발환경에서는 바벨을 직접 사용하는 것보다 웹팩으로 통합해서 사용해하는데 [babel-loader](https://github.com/babel/babel-loader)가 그것이다.
자바스크립트 파일단위로 코드를 변환시키기 때문에 웹팩의 로더 타입으로 제공한다.

먼저 패키지를 설치한다.

```
$ npm install babel-loader
```

웹팩 설정에 로더를 추가한다.

webpack.config.js:
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ]
  },
}
```

.js 확장자로 마치는 파일은 babel-loader가 동작하도록 했다.
사용하는 써드파티 라이브라리가 많을수록 바벨 로더가 느리게 동작할 수 있는데 node_modules 폴더를 로더가 처리하지 않도록 예외 처리했다([참고](https://github.com/babel/babel-loader#babel-loader-is-slow)).

## 7. 정리

바벨을 사용하는 배경
바벨은 그냥 
플러그인은
프리셋은
env 프리셋
웹팩

### 7.1 참고 
