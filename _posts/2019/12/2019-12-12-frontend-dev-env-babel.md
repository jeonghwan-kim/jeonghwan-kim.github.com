---
title: '프론트엔드 개발환경의 이해: Babel'
layout: post
summary: ''
category: series
tags: babel
---

## 1. 배경

아래 코드가 모든 브라우져에서 잘 동작할까? 

src/index.js
```js
const alert = msg => window.alert(msg);
alert('알림창입니다.');
```

IE 브라우져로 확인해 보자. 
화살표 함수를 사용했는데 브라우져는 이걸 해석하지 못해서 에러가 발생한다.

![IE에서 에러 화면]()

브라우져별로 언어의 스펙을 지원하는지를 확인하는 [CanIUse](https://caniuse.com/#feat=arrow-functions)에서 확인해 보자.

![caniuse](/assets/imgs/2019/12/12/caniuse.jpg)

IE 뿐만 아니라 안드로이드용 오페라 브라우져(Opera Mini) 그리고 구버전 삼성 스마트폰용 브라우져에서도 화살표 함수는 동작하지 않는다.

이들 브라우져가 이해하는 버전의 자바스크립트로 변환해야하는 처리가 필요한데 이것을 **트랜스 파일(transpile)**이라 한다. 

### 1.1 트랜스파일

하나의 언어를 다른 언어로 변환하는 것을 총칭해서 빌드라고 한다. 
예를 들어 gcc는 c 언어로 작성된 소스코드를 이진 파일을 변환하는데 이것이 빌드다. 

트랜스파일도 마찬가지로 하나의 언어를 다른 언어로 변환하는 과정이다. 
빌드와 다른 점은 변환 전후의 추상화 수준이 비슷하다는 것이다.
타입스크립트를 자바스크립트로 변환하는 것을 트랜스파일이라고 부른다. 
빌드 결과는 읽기 어렵지만 트랜스파일의 결과는 추상화 수준이 비슷하기 때문에 코드를 읽을 수 있다.

요즘에는 이 두 용어를 구분하지 않고 사용하는 것 같다.

자바스크립트의 언어 명세인 ECMASCript는 여러 버전이 있다.
ES5, ES6, ES7 ...... 이러한 버전별로 언어를 변환하는 것도 트랜스파일의 일종이다.
바벨은 상위 버전의 언어를 하위 버전으로 변환하기 위한 도구다.

## 2. 사용방법

### 2.1 설치 및 실행

프로젝트에 [바벨을 설치](https://babeljs.io/setup#installation)해 보자.

```
$ npm install @babel/core @babel/cli
```

테미널에서 바벨을 사용하려면 두 개의 패키지를 사용해야 한다.

* @babel/core: 바벨 핵심 모듈 
* @babel/cli: 터미널에서 바벨을 사용할 수 있도록 한다 

바벨 명령어로 코드를 컴파일해 보자.

```
$ node_modules/.bin/babel src -d dist 
```

src에 있는 파일이 바벨 처리를 거쳐 dist 폴더로 저장되었다. 

![dist/app.js 캡쳐]()

그런데 바벨로 처리한 코드가 그대로다.
ES6 코드를 ES5 코드로 트랜스파일 하려고 했는데 말이다.

바벨은 별도의 빌드 대상에 따라 플러그인 형태로 제공한다. 
적당한 플러그인 을 설치하자.
다양한 플러그인이 있다.... 복잡함.


가장 편한게 [prevet-evn](https://babeljs.io/docs/en/babel-preset-env) 플러그인이다.

```
$ npm install @babel/preset-env
```

바벨 사용법을 확인해 보자.

```
$ npx babel --help
  --presets [list]                            A comma-separated list of preset names.
```

`--presets` 옵션을 추가하면 바벨을 실행할때 설치한 플러그인으로 제공되는 프리셋을 지정해서 컴파일 할 수 있다.
방금 설치한 env 프리셋으로 다시 시도해 보자.

```
$ npx babel src -d dist --presets @babel/env
```

이번엔 좀 다른 결과가 나왔다. 

![dist/app.js 캡쳐 2]()

화살표 함수가 일반 함수로 변경되었다.
뿐만 아니라 const가 var로 변경되었고 ES5에서 사용하는 "use strict" 구문도 상단에 추가되었다.

ECMAScript 외에도 바벨은 flow나 typescript처럼 타입 언어를 변환할때도 사용한다.(flow preset, typescript preset). 
리액트에서 사용한 jsx도 트랜스파일이 필요한데 물론 프리셋을 제공한다(preset-react).

### 2.2 설정 파일

웹팩의 설정 파일에 자세한 세팅 정보를 기록한 것처럼 바벨도 설정 파일을 지원한다.

```
$ npx babel --help
  --config-file [path]                        Path to a .babelrc file to use.
```

.babelrc 파일을 경로에 사용하는 방식이다. 
[문서](https://babeljs.io/docs/en/configuration)에 보면 자바스크립트 포맷을 추천한다.

babel.config.js:
```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
    ]
  ]
};
```

이 파일을 인자로 바벨 명령어 전달하여 빌드해 보자.

```
$ npx babel --config-file ./babel.config.js src -d dist
```


같은 결과물을 확인할 수 있다. 

설정 파일에는 브라우져 버전별로 간편하게 설정할 수도 있다. 

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          // edge: '17',
          firefox: '60',
          chrome: '67',
          // safari: '11.1',
          // ie: '11',
        }
      },
    ]
  ],
};
```

### 2.3 폴리필

<!-- TODO: -->
바벨이 변경 못하는 것과 폴리필은 무슨 관계?

브라우져별로 변경하지 못하는 기능이 있다. 
<!-- 예를 들어 엣지 17 버전에서는 Promise.prototype.finally() 함수가 없다.  -->
예를 들어 인터넷 익스플로러에는 Promise를 사용할수 없다. 
이를 구현한 코드조각을 폴리필이라고 하는데 이러한 경우에는 폴리필을 옵션을 추가해야한다.

babel.config.js:
```js
module.exports = {
  presets: [
    '@babel/env',
    {
      targets: {
        edge: '17',
        firefox: '60',
        chrome: '67',
        safari: '11.1',
        ie: '11',
      },
      useBuildIns: 'usage', // 폴리핑 사용
      corejs: {
        version: 3, // 폴리필로 사용할 corejs의 버전 명시 
      }
    },
  ],
}
```

[useBuildIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins)는 ...

[corejs](https://babeljs.io/docs/en/babel-preset-env#corejs)는 ...
2와 3의 차이는 뭔가?

빌드해 보면 다음과 같이 폴리필을 가져오는 코드가 추가 되었다. 

![캡처]()

물론 설정파일에서 IE 브라우져 버전을 제거하고 빌드하면 폴리필을 가져오지 않는다. 
크로스 브라우징에서 바벨을 이용한 폴리필 지원을 잘 활용한다면 좋겠다.

## 3. 웹팩으로 통합

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

웹팩에서 빌드하려면 폴리필 코드도 추가해야한다 (순서가 이게맞나?)

```
$ npm install @babel/polyfill
```

이제 웹팩으로 빌드하면 바벨이 함께 동작한다.

## 4. 정리

바벨은 최신버전의 자바스크립트 코드나 상위 언어를 변환해 주는 녀석이다. 
명령어를 직접 사용하는 방법을 알아봤고 환경 설정파일로 분리해서 사용해 보았다. 
프론트엔드 프로젝트를 빌드하는 웹팩과 연동하기위해 babel-loader를 사용해서 자동화 해 보았다.

참고
* https://babeljs.io/docs/en/
* https://babeljs.io/docs/en/usage
* https://babeljs.io/docs/en/babel-preset-env

