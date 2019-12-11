---
title: '프론트엔드 개발환경의 이해: Babel'
layout: post
summary: ''
category: series
tags: babel
---

## 1. 배경

만들었던 코드가 모든 브라우져에서 잘 동작할까? 
최신 버전의 그래 IE 브라우져를 통해 접속해 보자. 
우리는 화살표함수를 사용했는데 IE에서는 인지하지 못하고 에러가 난다. 

![IE에서 에러 화면](/assets/imgs/2019/12/12/caniuse.jpg)

CanIUse에서 보면 화살표함수는 IE 뿐만 아니라 안드로이드용 오페라 브라우져(Opera Mini) 그리고 구버전 삼성 스마트폰에서는 돌아가지 않는다. 

이들도 브라우져기 때문에 자바스크립트를 이해할 수는다. 
그들이 이해하는 버전의 자바스크립트로 변환해야하는 처리가 필요한데 이것을 트랜스 파일이라 한다. 
종종 빌드라는 용어와 함께 사용하는데 정확한 의미는 이렇다. 

* 빌드: 소스 코드를 이진코드로 변경
* 트랜트파일: 상위 코드를 다른 하위 코드로 변경

가령 ES6 코드를 ES5 코드로 변환하는 것이기 때문에 트랜스파일한다라는 표현이 더 정확할 것이다. 

이러한 역할을 하는것이 바벨이다. 바벨은 최신버번의 자바스크립트를 컴파일해서 원하는 버전으로 변경해 주는 도구이다. 

## 2. 사용방법

### 2.1 설치

프로젝트 폴더에 바벨 프로그램을 설치해 보자. 

```
$ npm install babel-cli
$ npm install  @babel/core @babel/cli
```

바벨을 설치하면 기본적으로 세 개의 프로그램이 설치된다. 

* babel
* babel-node
* babel-external-helpers

babel은 es6로 작성한 코드를 변경하는 역할을 한다. 
babel-node는 es6로 작성한 노드 코드를 실행하는 기능이다. 
node와 동일한 기능을 하는데 es6 문법을 완전히 지원한다는 점에서 차이가 있다. 
babel-external-helpers는? 

### 2.2 실행 / 옵션

바벨 명령어로 코드를 컴파일해 보자.

```
$ node_modules/.bin/babel src -d dist 
```

src에 있는 파일이 바벨 처리를 거쳐 dist 폴더로 저장되었다. 

간다히 아래 코드를 변경해 봤다. 

```js
const result = sum(1,2);
```

그런데 변경된 결과도 es6 코드이지 뭔가? 
바벨 명령어를 통해 es6 코드를 es5 코드로 변환하려는 것이 의도인데 이것은 다른 결과다. 

바벨은 별도의 빌드 대상에 따라 플러그인형태로 제공한다. 이것을 설치하자. 

```
$ npm install @babel/preset-env
```

바벨을 실행할때 설치한 프리셋을 지정해서 컴파일할 수 있다. 

```
$ node_module/.bin/babel --help

Usage: babel [options] <files ...>

Options:
  -f, --filename [filename]                   The filename to use when reading from stdin. This will be used in source-maps, errors etc.
  --presets [list]                            A comma-separated list of preset names.
  --
```

실행해 보자.

```
$ node_modules/.bin/babel src -d dist --presets @babel/env
```

결과를 보면 화살표함수가 일반 함수로 변경되었다. 

dist/math.js:
```js
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sum = void 0;

var sum = function sum(a, b) {
  return a + b;
};

exports.sum = sum;
```


바벨은 이것 뿐만 아니라 flow나 typescript 처럼 타입을 지원하는 문법을 갖는 언어를 변환할때도 사용한다. (flow preset, typescript preset) 리액트에서 사용한 jsx 도 변환이 필요한데 물론 프리셋을 제공한다. (preset-react)

### 2.3 설정 파일

바벨 설정에 대해 다 알아보자. babel.config.js 파일을 만들자. 

babel.config.js:
```js
const presets = [
	[
		"@babel/env",
	],
];

module.exports = {
	presets
};
```

이번에 이 설정 파일을 인자로 전달하여 빌드해본다.

```
node_modules/.bin/babel --config-file ./babel.config.js src -d dist   
```

같은 결과물을 확인할 수 있다. 

설정 파일에는 브라우져 버전별로 간편하게 설정할 수도 있다. 

```js
const presets = [
	[
		"@babel/env",
		{
			targets: {
				edge: "17",
				firefox: "60",
				chrome: "67",
				safari: "11.1",
				ie: "11",
			},
		},
	],
];

module.exports = {
	presets
};
```

### 2.4 폴리필

브라우져별로 변경하지 못하는 기능이 있다. 
예를 들어 엣지 17 버전에서는 Promise.prototype.finally() 함수가 없다. 
이를 구현한 코드조각을 폴리필이라고 하는데 이러한 경우에는 폴리필을 옵션을 추가해야한다.

useBuiltIns: “usage”

다시 빌드해보면 다음과 같이 폴리필을 가져오는 코드가 추가 되었다. 

require("core-js/modules/es7.promise.finally");

물론 설정파일에서 해당 브라우져 버전을 제거하고 빌드하면 폴리필을 가져오지 않는다. 크로스 브라우징에서 바벨을 이용한 폴리필 지원을 잘 활용한다면 좋겠다.

## 3. 웹팩으로 통합

바벨을 직접 사용하지는 않는다. 웹팩으로 통합해서 사용해하는데 babel-loader가 그것이다.

webpack.config.js
```js
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		]
	},
```

.js 확장자로 마치는 파일은 babel-loader가 동작하도록 설정했다.  사용하는 써드파티 라이브라리가 많을수록 바벨 로더가 느리게 동작할 수 있는데 node_modules 폴더를 로더가 처리하지 않도록 예외 처리했다. (참고)

웹팩에서 빌드하려면 폴리필 코드도 추가해야한다 (순서가 이게맞나?)

```
$ npm install @babel/polyfill
```

이제 웹팩으로 빌드하면 바벨이 함께 동작한다.

## 4. 정리

바벨은 최신버전의 자바스크립트 코드나 상위 언어를 변환해 주는 녀석이다. 명령어를 직접 사용하는 방법을 알아봤고 환경 설정파일로 분리해서 사용해 보았다. 프론트엔드 프로젝트를 빌드하는 웹팩과 연동하기위해 babel-loader를 사용해서 자동화 해 보았다.

참고
* https://babeljs.io/docs/en/
* https://babeljs.io/docs/en/usage
* https://babeljs.io/docs/en/babel-preset-env

