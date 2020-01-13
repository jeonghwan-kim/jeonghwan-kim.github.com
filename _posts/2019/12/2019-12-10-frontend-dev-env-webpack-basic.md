---
title: '프론트엔드 개발환경의 이해: 웹팩(기본)'
layout: post
category: series
seriesId: 1
tags: webpack
---

# 1. 배경 

먼저 모듈에 대해 이야기 해보자. 
문법 수준에서 모듈을 지원하기 시작한 것은 ES2015부터다.
import/export 구문이 없었던 모듈 이전 상황을 살펴보는 것이 웹팩 등장 배경을 설명하는데 수월할 것 같다.

아래 덧셈 함수를 보자.

math.js:
```js
function sum(a, b) { return a + b; } // 전역 공간에 sum이 노출 
```

app.js:
```js
sum(1, 2); // 3
```

위 코드는 모두 하나의 HTML 파일 안에서 로딩해야만 실행된다. 
math.js가 로딩되면 app.js는 이름 공간에서 'sum'을 찾은 뒤 이 함수를 실행한다.
문제는 'sum'이 전역 공간에 노출된다는 것.
다른 파일에서도 'sum'이란 이름을 사용한다면 충돌한다.

## 1.1 IIFE 방식의 모듈

이러한 문제를 예방하기 위해 스코프를 사용한다. 
함수 스코프를 만들어 외부에서 안으로 접근하지 못하도록 공간을 격리하는 것이다.
스코프 안에서는 자신만의 이름 공간이 존재하므로 스코프 외부와 이름 충돌을 막을 수 있다. 

math.js:
```js
var math = math || {}; // math 네임스페이스 

(function() {
  function sum(a, b) { return a + b; }
  math.sum = sum; // 네이스페이스에 추가 
})();
```

같은 코드를 즉시실행함수로 감싸서 다른 파일에서 이 안으로 접근할 수가 없다.
심지어 같은 파일일지라도 말이다.
자바스크립트 함수 스코프의 특징이다. 
'sum'이란 이름은 즉시실행함수 안에 감추어졌기 때문에 외부에서는 같은 이름을 사용해도 괜찮다. 
전역에 등록한 'math'라는 이름 공간만 잘 활용하면 된다.

## 1.2 다양한 모듈 스펙 

이러한 방식으로 자바스크립트 모듈을 구현하는 대표적인 명세가 AMD와 CommonJS다. 

**[CommonJS](http://www.commonjs.org/)**는 자바스크립트를 사용하는 모든 환경에서 모듈을 하는 것이 목표다.
exports 키워드로 모듈을 만들고 require() 함수로 불러 들이는 방식이다. 
대표적으로 서버 사이드 플래폼인 Nodejs에서 이를 사용한다.

math.js:
```js
exports function sum(a, b) { return a + b; }
```

app.js:
```js
const sum = require('./math.js');
sum(1, 2); // 3
```

**[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)**(Asynchronous Module Definition)는 비동기로 로딩되는 환경에서 모듈을 사용하는 것이 목표다.
주로 브라우져 환경이다.

**[UMD](https://github.com/umdjs/umd)**(Universal Module Definition)는 AMD기반으로 CommonJS 방식까지 지원하는 통합 형태다. 

이렇게 각 커뮤니티에서 각자의 스펙을 제안하다가 **[ES2015에서 표준 모듈 시스템](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)**을 내 놓았다. 
지금은 바벨과 웹팩을 이용해 모듈 시스템을 사용하는 것이 일반적이다.
ES2015 모듈 시스템의 모습을 살펴보자.

math.js:
```js
export function sum(a, b) { return a + b; }
```

app.js:
```js
import * as math from './math.js';
math.sum(1, 2); // 3
```

`export` 구문으로 모듈을 만들고 `import` 구문으로 가져올 수 있다. 

## 1.3 브라우져의 모듈 지원

안타깝게도 모든 브라우져에서 모듈 시스템을 지원하지는 않는다. 
인터넷 익스플로러를 포함한 몇 몇 브라우져에서는 여전히 모듈을 사용하지 못한다.
가장 많이 사용하는 크롬 브라우져만 잠시 살펴보자.
([버전 61부터 모듈시스템을 지원](https://developers.google.com/web/updates/2017/09/nic61#modules) 한다)

index.html:
```html
<script type="module" src="app.js"></script>
```

`<script>` 태그로 로딩할 때 `type="text/javascript"` 대신 `type="module"`을 사용한다.
app.js는 모듈을 사용할 수 있다.

그러나 브라우져에 무관하게 모듈을 사용하고 싶은데...... 이제야 웹팩이 나올 차례다.

# 2. 엔트리/아웃풋

[웹팩](https://webpack.js.org/)은 여러개 파일을 하나의 파일로 합쳐주는 번들러(bundler)다. 
하나의 시작점(entry point)으로부터 의존적인 모듈을 전부 찾아내서 하나의 결과물을 만들어 낸다.
app.js부터 시작해 math.js 파일을 찾은 뒤 하나의 파일로 만드는 방식이다.

간단히 웹팩으로 번들링 작업을 해보자.

번들 작업을 하는 [webpack](https://github.com/webpack/webpack) 패키지와 웹팩 터미널 도구인 [webpack-cli](https://github.com/webpack/webpack-cli)를 설치한다.

```
$ npm install -D webpack webpack-cli
```

설치 완료하면 `node_modules/.bin` 폴더에 실행 가능한 명령어가 몇 개 생긴다.
webpack과 webpack-cli가 있는데 둘 중 하나를 실행하면 된다. 
`--help` 옵션으로 사용 방법을 확인해 보자.

```
$ node_modules/.bin/webpack --help

  --mode                 Enable production optimizations or development hints.
                                     [선택: "development", "production", "none"]
  --entry      The entry point(s) of the compilation.                   [문자열]
  --output, -o                  The output path and file for compilation assets
```

--mode, --entry, --output 세 개 옵션만 사용하면 우선 번들링 할 수 있다.

```
$ node_modules/.bin/webpack --mode development --entry ./src/app.js --output dist/main.js 
```

* `--mode`는 웹팩 실행 모드는 의미하는데 개발 버전인 development를 지정한다 
* `--entry`는 시작점 경로를 지정하는 옵션이다
* `--output`은 번들링 결과물을 위치할 경로다

위 명령어를 실행하면 dist/main.js에 번들된 결과가 저장된다.

![웹팩 번들 결과](/assets/imgs/2019/12/11/webpack-bundle-result.jpg)

이 코드를 index.html에 로딩하면 번들링 전과 똑같은 결과를 만든다.

index.html:
```html
<script src="dist/main.js"></script>
```

옵션 중 `--config` 항목을 보자.

```
$ node_modules/.bin/webpack --help

  --config               Path to the config file
                         [문자열] [기본: webpack.config.js or webpackfile.js]
```

이 옵션은 웹팩 설정파일의 경로를 지정할 수 있는데 기본 파일명이 webpack.config.js 혹은 webpackfile.js다. 
`webpack.config.js` 파일을 만들어 방금 터미널에서 사용한 옵션을 코드로 구성해 보자. 

webpack.config.js:
```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./dist'),
  },
}
```

터미널에서 사용한 옵션인 mode, entry, ouput을 설정한다. 

* `mode`는 'development' 문자열을 사용했다. 
* `entry`는 어플리케이션 진입점인 src/app.js로 설정한다. 
* `ouput`에 설정한  '[name]'은 entry에 추가한 main이 문자열로 들어오는 방식이다. 
  * `output.path`는 절대 경로를 사용하기 때문에 path 모듈의 resolve() 함수를 사용해서 계산했다. (path는 노드 코어 모듈 중 하나로 경로를 처리하는 기능을 제공한다)

웹팩 실행을 위한 NPM 커스텀 명령어를 추가한다.

package.json:
```json
{
  "scripts": {
    "build": "./node_modules/.bin/webpack"
  }
}
```

모든 옵션을 웹팩 설정 파일로 옮겼기 때문에 단순히 webpack 명령어만 실행한다.
이제부터는 `npm run build`로 웹팩 작업을 지시할 수 있다.

# 3. 로더 

## 3.1 로더의 역할

웹팩은 모든 파일을 모듈로 바라본다. 
자바스크립트로 만든 모듈 뿐만아니라 스타일시트, 이미지, 폰트까지도 전부 모듈로 보기 때문에 import 구문을 사용하면 자바스크립트 코드 안으로 가져올수 있다.

이것이 가능한 이유는 웹팩의 **로더** 덕분이다.
로더는 타입스크립트 같은 다른 언어를 자바스크립트 문법으로 변환해 주거나 이미지를 data URL 형식의 문자열로 변환한다.
뿐만아니라 CSS 파일을 자바스크립트에서 직접 로딩할수 있도록 해준다.

## 3.2 커스텀 로더 만들기

로더를 사용하기 전에 동작 원리를 이해하기 위해 로더를 직접 만들어 보자. 

myloader.js:
```js
module.exports = function myloader (content) {
  console.log('myloader가 동작함');
  return content;
};
```

함수로 만들수 있는데 로더가 읽은 파일의 내용이 함수 인자 content로 전달된다. 
로더가 동작하는지 확인하는 용도로 로그만 찍고 곧장 content를 돌려 준다.

로더를 사용하려면 웹팩 설정파일의 `module` 객체에 추가한다.

webpack.config.js:
```js
module: {
  rules: [{
    test: /\.js$/, // .js 확장자로 끝나는 모든 파일
    use: [path.resolve('./myloader.js')] // 방금 만든 로더를 적용한다 
  }],
}
```

`module.rules` 배열에 모듈을 추가하는데 test와 use로 구성된 객체를 전달한다.

`test`에는 로딩에 적용할 파일을 지정한다. 
파일명 뿐만아니라 파일 패턴을 정규표현식으로 지정할수 있는데 위 코드는 .js 확장자를 갖는 모든 파일을 처리하겠다는 의미다.

`use`에는 이 패턴에 해당하는 파일에 적용할 로더를 설정하는 부분이다. 
방금 만든 myloader 함수의 경로를 지정한다. 
 
이제 `npm run build`로 웹팩을 실행해 보자. 

![웹팩 번들 결과](/assets/imgs/2019/12/11/custom-loader-result.jpg)

터미널에 'myloader가 동작함' 문자열이 찍힌다. 
myloader() 함수가 동작한 것이다. 

빌드결과를 살펴보면 이전과 동일하다. 
로더가 뭔가를 처리하기 위해서 간단한 변환 작업을 추가해 보자. 
소스에 있는 모든 console.log() 함수를 alert() 함수로 변경하도록 말이다.

myloader.js:
```js
module.exports = function myloader (content) {
  console.log('myloader가 동작함')
  return content.replace('console.log(', 'alert('); // console.log( -> alert( 로 치환 
};
```

빌드후 확인하면 다음과 같이 console.log() 함수가 alert() 함수로 변경되었다.

![웹팩 번들 결과](/assets/imgs/2019/12/11/custom-loader-result-2.jpg)

# 4. 자주 사용하는 로더

로더의 동작 원리를 살펴 보았으니 이번에는 몇몇 자주 사용하는 로더를 소개하겠다.

## 4.1 css-loader

웹팩은 모든것을 모듈로 바라보기 때문에 자바스크립트 뿐만 아니라 스타일시트로 import 구문으로 불러 올수 있다.

app.js:
```js
import './style.css'
```

style.css: 
```css
body {
  background-color: green;
}
```

CSS 파일을 자바스크립트에서 불러와 사용하려면 CSS를 모듈로 변환하는 작업이 필요하다.
[css-loader](https://github.com/webpack-contrib/css-loader)가 그러한 역할을 하는데 우리 코드에서 CSS 파일을 모듈처럼 불러와 사용할 수 있게끔 해준다.

먼저 로더를 설치 하자.

```
$ npm install -D css-loader
```

웹팩 설정에 로더를 추가한다. 

webpack.config.js:
```js
module.exports = {
  module: {
    rules: [{
      test: /\.css$/, // .css 확장자로 끝나는 모든 파일 
      use: ['css-loader'], // css-loader를 적용한다 
    ]}
  }
}
```

웹팩은 엔트리 포인트부터 시작해서 모듈을 검색하다가 CSS 파일을 찾으면 css-loader로 처리할 것이다.
use.loader에 로더 경로를 설정하는 대신 배열에 로더 이름을 문자열로 전달해도 된다.

빌드 한 결과 CSS코드가 자바스크립트로 변환된 것을 확인할 수 있다. 

![웹팩 번들 결과](/assets/imgs/2019/12/11/css-loader.jpg)

## 4.2 style-loader

모듈로 변경된 스타일 시트는 돔에 추가되어야만 브라우져가 해석할 수 있다. 
css-loader로 처리하면 자바스크립트 코드로만 변경되었을 뿐 돔에 적용되지 않았기 때문에 스트일시트가 적용되지 않았다.
[style-loader](https://github.com/webpack-contrib/style-loader)는 자바스크립트로 변경된 스타일시트를 동적으로 돔에 추가하는 로더이다. 
CSS를 번들링하기 위해서는 css-loader와 style-loader를 함께 사용한다.

먼저 스타일 로더를 다운로드 한다.

```
$ npm install -D style-loader
```

그리고 웹팩 설정에 로더를 추가한다.

package.json:
```js
module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'], // style-loader를 앞에 추가한다 
    ]}
  }
}
```

배열로 설정하면 뒤에서부터 앞으로 로더가 동작한다.  
위 설정은 모든 .css 확장자로 끝나는 모듈을 읽어 들여 css-loader를 적용하고 그 다음 style-loader를 적용한다.

![웹팩 번들 결과](/assets/imgs/2019/12/11/style-loader.jpg)

## 4.3 file-loader

CSS 뿐만 아니라 소스코드에서 사용하는 모든 파일을 모듈로 사용하게끔 할 수 있다.
파일을 모듈 형태로 지원하고 웹팩 아웃풋에 파일을 옮겨주는 것이 [file-loader](https://github.com/webpack-contrib/file-loader)가 하는 일이다. 
가령 CSS에서 url() 함수에 이미지 파일 경로를 지정할 수 있는데 웹팩은 file-loader를 이용해서 이 파일을 처리한다.

style.css:
```css
body {
  background-image: url(bg.svg)
}
```

배경 이미지를 bg.svg 파일로 지정했다.

웹팩은 엔트리 포인트인 app.js가 로딩하는 style.css 파일을 읽을 것이다. 
그리고 이 스타일시트는 url() 함수로 bg.svg를 사용하는데 이때 로더를 동작시킨다.

webpack.config.js:
```js
module.exports = {
  module: {
    rules: [{
      test: /\.png$/, // .png 확장자로 마치는 모든 파일
      loader: 'file-loader', // 파일 로더를 적용한다
    }]
  }
}
```

웹팩이 .png 파일을 발견하면 file-loader를 실행할 것이다.
로더가 동작하고 나면 아웃풋에 설정한 경로로 이미지 파일을 복사된다. 
아래 그림처럼 파일명이 해쉬코드로 변경 되었다. 
캐쉬 갱신을 위한 처리로 보인다.

![웹팩 번들 결과](/assets/imgs/2019/12/11/file-loader.jpg)

하지만 이대로 index.html 파일을 브라우져에 로딩하면 이미지를 제대로 로딩하지 못할 것이다. 
CSS를 로딩하면 background-image: url(bg.svg) 코드에 의해 동일 폴더에서 이미지를 찾으려고 시도할 것이다. 
그러나 웹팩으로 빌드한 이미지 파일은 output인 dist 폴더 아래로 이동했기 때문에 이미지 로딩에 실패할 것이다.

file-loader 옵션을 조정해서 경로를 바로 잡아 주어야 한다.

```js
module.exports = {
  module: {
    rules: [{
      test: /\.png$/, // .png 확장자로 마치는 모든 파일
      loader: 'file-loader',
      options: {
        publicPath: './dist/', // prefix를 아웃풋 경로로 지정 
        name: '[name].[ext]?[hash]', // 파일명 형식 
      }
    }]
  }
}
```

`publicPath` 옵션은 file-loader가 처리하는 파일을 모듈로 사용할 때 경로 앞에 추가되는 문자열이다. 
output에 설정한 'dist' 폴더에 이미지 파일을 옮길 것이므로 publicPath 값을 이것으로로 지정했다. 
파일을 사용하는 측에서는 'bg.png'를 'dist/bg.png'로 변경하여 사용할 것이다. 

또한 `name` 옵션을 사용했는데 이것은 로더가 파일을 아웃풋에 복사할때 사용하는 파일 이름이다.
기본적으로 설정된 해쉬값을 쿼리스트링으로 옮겨서 'bg.png?6453a9c65953c5c28aa2130dd437bbde' 형식으로 파일을 요청하도록 변경했다. 

![파일로더 결과 2](/assets/imgs/2019/12/11/file-loader-2.jpg)

이렇게 스타일시트에서 불러온 파일이 동작한다.

![파일로더 결과 3](/assets/imgs/2019/12/11/file-loader-3.jpg)

## 4.4 url-loader

사용하는 이미지 갯수가 많다면 네트웍 리소스를 사용하는 부담이 있고 사이트 성능에 영향을 줄 수도 있다. 
만약 한 페이지에서 작은 이미지를 여러개 사용한다면 [Data URI Scheme](https://en.wikipedia.org/wiki/Data_URI_scheme)을 이용하는 방법이 더 낫다.
이미지를 Base64로 인코딩하여 문자열 형태로 소스코드에 넣는 형식이다. 
[url-loader](https://github.com/webpack-contrib/url-loader)는 이러한 처리를 자동화해주는 녀석이다. 

먼저 로더를 설치한다.
```
$ npm install -D url-loader
```

그리고 웹팩 설정을 추가한다.
webpack.config.js:
```js
{
  test: /\.png$/,
  use: {
    loader: 'url-loader', // url 로더를 설정한다
    options: {
      publicPath: './dist/', // file-loader와 동일
      name: '[name].[ext]?[hash]', // file-loader와 동일
      limit: 5000 // 5kb 미만 파일만 data url로 처리 
    }
  }
}
```

file-loader와 옵션 설정이 거의 비슷하고 마지막 `limit` 속성만 추가했다. 
모듈로 사용한 파일중 크기가 5kb 미만인 파일만 url-loader를 적용하는 설정이다. 
만약 이보다 크면 file-loader가 처리하는데 옵션 중 [fallback](https://github.com/webpack-contrib/url-loader#options) 기본값이 file-loader이기 때문이다. 

빌드 결과를 보면 small.png 파일이 문자열로 변경되어 있는 것을 확인 할 수 있다.
반면 5kb 이상인 bg.png는 여전히 파일로 존재한다.

![url 로더 결과 1](/assets/imgs/2019/12/11/url-loader-1.jpg)

브라우저에서도 확인하면 스타일스트에 small.png가 Data url형태로 변환되어 있다. 

![url 로더 결과 2](/assets/imgs/2019/12/11/url-loader-2.jpg)


아이콘처럼 용량이 작거나 사용 빈도가 높은 이미지는 파일을 그대로 사용하기 보다는 Data URI Scheeme을 적용하기 위해 url-loader를 사용하면 좋겠다.

# 5. 플러그인

## 5.1 플러그인의 역할

웹팩에서 알아야 할 마지막 기본 개념이 플러그인이다. 
로더가 파일 단위로 처리하는 반면 플러그인은 번들된 결과물을 처리한다. 
번들된 자바스크립트를 난독화 한다거나 특정 텍스트를 추출하는 용도로 사용한다.

이것도 사용하기에 앞서 동작 원리를 이해하기 위해 플러그인을 직접 만들어 보자.

## 5.2 커스텀 플러그인 만들기

웹팩 문서의 [Writing a plugin](https://webpack.js.org/contribute/writing-a-plugin/)을 보면 클래스로 플러그인을 정의 하도록 한다. 
[헬로월드 코드](https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture)를 가져다 그대로 실행 붙여보자.

myplugin.js:
```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('My Plugin', stats => {
      console.log('MyPlugin: done');
    })
  }
}

module.exports = MyPlugin;
```

로더와 다르게 플러그인은 클래스로 제작한다. 
apply 함수를 구현하면 되는데 이 코드에서는 인자로 받은 compiler의 tap 함수를 사용했다. 
플러그인 작업이 완료되는(done) 시점에 로그를 찍는 코드인것 같다.

플러그인을 웹팩 설정에 추가한다.

webpack.config.js:
```js
const MyPlugin = require('./myplugin');

module.exports = {
  plugins: [
    new MyPlugin(),
  ]
}
```

웹팩 설정 객체의 `plugins` 배열에 설정한다.
클래스로 제공되는 플러그인의 생성자 함수를 실행해서 넘기는 방식이다. 

웹팩으로 빌드해 보자.

![myplugin](/assets/imgs/2019/12/11/myplugin.jpg)

로그가 찍힌걸 보니 플러그인이 동작했다.

그런데 파일이 여러개인데 로그는 한 번만 찍혔다. 
모듈은 설정한 파일 하나 혹은 여러 개에 대해 동작하지만, 플러그인은 그것을 하나로 번들링한 결과물을 대상으로 한다. 
우리 예제에서는 main.js로 결과물이 하나이기 때문에 플러그인이 한번만 동작한 것이다. 

그러면 어떻게 번들 결과에 접근할 수 있을까? 
웹팩 내장 플러그인 [BannerPlugin 코드](https://github.com/lcxfs1991/banner-webpack-plugin/blob/master/index.js)를 참고하자.

myplugin.js:
```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('My Plugin', stats => {
      console.log('MyPlugin: done');
    })

    compiler.plugin('emit', (compilation, callback) => { // compiler.plugin() 함수로 후처리한다
      const source = compilation.assets['main.js'].source();
      console.log(source);
      callback();
    })
  }
}
```

compiler.plugin() 함수의 두번재 인자 콜백함수는 emit 이벤트가 발생하면 실행되는 녀석인 모양이다. 
번들된 결과가 compilation 객체에 들어 있는데 compilation.assets['main.js'].source() 함수로 접근할 수 있다. 
실행하면 터미널에 번들링된 결과물을 확인할 수 있다. 

![myplugin](/assets/imgs/2019/12/11/myplugin-2.jpg)

이걸 이용해서 번들 결과 상단에 아래와 같은 배너를 추가하는 플러그인으로 만들어 보자.

myplugin.js:
```js
class MyPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const source = compilation.assets['main.js'].source();
      compilation.assets['main.js'].source = () => {
        const banner = [
          '/**',
          ' * 이것은 BannerPlugin이 처리한 결과입니다.',
          ' * Build Date: 2019-10-10',
          ' */'
        ].join('\n');
        return banner + '\n\n' + source;
      }
 
      callback();
    })
  }
}
```

번들 소스를 얻어오는 함수 source()를 재정의 했다. 
배너 문자열과 기존 소스 코드를 합친 문자열을 반환하도록 말이다.

빌드하고 결과물을 확인해 보면 다음과 같다. 

![myplugin 3](/assets/imgs/2019/12/11/myplugin-3.jpg)

# 6. 자주 사용하는 플러그인

개발하면서 플러그인을 직접 작성할 일은 거의 없었다. 
웹팩에서 직접 제공하는 플러그인을 사용하거나 써드파티 라이브러리를 찾아 사용하는데 자주 사용하는 플러그인에 대해 알아보자.

## 6.1 BannerPlugin

MyPlugin와 비슷한 것이 [BannerPlugin](https://webpack.js.org/plugins/banner-plugin/)이다. 
결과물에 빌드 정보나 커밋 버전같은 걸 추가할 수 있다. 

webpack.config.js:
```js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.BannerPlugin({
      banner: '이것은 배너 입니다',
    })
  ]
```

생성자 함수에 전달하는 옵션 객체의 banner 속성에 문자열을 전달한다. 
웹팩 컴파일 타임에 얻을 수 있는 정보, 가령 빌드 시간이나 커밋정보를 전달하기위해 함수로 전달할 수도 있다.

```js
new webpack.BannerPlugin({
  banner: () => `빌드 날짜: ${new Date().toLocaleString()}`
})
```

배너 정보가 많다면 별로 파일로 분리하자.

```js
const banner = require('./banner.js');

new webpack.BannerPlugin(banner);
```

빌드 날짜 외에서 커밋 해쉬와 빌드한 유저 정보까지 추가해 보자.

banner.js:
```js
const childProcess = require('child_process');

module.exports = function banner() {
  const commit = childProcess.execSync('git rev-parse --short HEAD')
  const user = childProcess.execSync('git config user.name')
  const date = new Date().toLocaleString();
  
  return (
    `commitVersion: ${commit}` +
    `Build Date: ${date}\n` +
    `Author: ${user}`
  );
}
```

빌드한뒤 플러그인이 처리한 결과는 다음과 같다.

![BannerPlugin](/assets/imgs/2019/12/11/banner-plugin.jpg)

## 6.2 DefinePlugin

어플리케이션은 개발환경과 운영환경으로 나눠서 운영한다. 
가령 환경에 따라 API 서버 주소가 다를 수 있다. 
같은 소스 코드를 두 환경에 배포하기 위해서는 이러한 환경 의존적인 정보를 소스가 아닌 곳에서 관리하는 것이 좋다.
배포할 때마다 코드를 수정하는 것은 곤란하기 때문이다.

웹팩은 이러한 환경 정보를 제공하기 위해 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)을 제공한다. 

webpack.config.js
```js
const webpack = require('webpack');

export default {
  plugins: [
    new webpack.DefinePlugin({}),
  ]
}
```

빈 객체를 전달해도 기본적으로 넣어주는 값이 있다. 
노드 환경정보인 process.env.NODE_ENV 인데 웹팩 설정의 mode에 설정한 값이 여기에 들어간다.
"development"를 설정했기 때문에 어플리케이션 코드에서 process.env.NODE_ENV 변수로 접근하면 "development" 값을 얻을 수 있다.

app.js
```js
console.log(process.env.NODE_ENV) // "development"
```

이 외에도 웹팩 컴파일 시간에 결정되는 값을 전역 상수 문자열로 어플리케이션에 주입할 수 있다.

```js
new webpack.DefinePlugin({
  TWO: '1+1',
})
```

TWO라는 전역 변수에 `1+1` 이란 코드 조각을 넣었다.
실제 어플리케이션 코드에서 이것을 출력해보면 2가 나올 것이다.

app.js
```js
console.log(TWO); // 2
```

코드가 아닌 값을 입력하려면 문자열화 한 뒤 넘긴다.
```js
new webpack.DefinePlugin({
  VERSION: JSON.stringify('v.1.2.3')
  PRODUCTION: JSON.stringify(false),
  MAX_COUNT: JSON.stringify(999),
  'api.domain': JSON.stringify('http://dev.api.domain.com'),
})
```

app.js:
```js
console.log(VERSION) // 'v.1.2.3'
console.log(PRODUCTION) // true
console.log(MAX_COUNT) // 999
console.log(api.domain) // 'http://dev.api.domain.com'
```

빌드 타임에 결정된 값을 어플리이션에 전달할 때는 이 플러그인을 사용하자.  

## 6.3 HtmlTemplatePlugin

이번엔 써드 파티 패키지에 대해 알아보자. 
[HtmlTemplatePlugin](https://github.com/jantimon/html-webpack-plugin/)은 HTML 파일을 후처리하는데 사용한다. 
빌드 타임의 값을 넣거나 코드를 압축할수 있다.

먼저 패키지를 다운로드 한다.

```
$ npm install -D html-webpack-plugin
```

이 플러그인으로 빌드하면 HTML파일로 아웃풋에 생성될 것이다.
index.html 파일을 src/index.html로 옮긴뒤 다음과 같이 작성해 보자.

src/index.html:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>타이틀<%= env %></title>
  </head>
  <body>
    <!-- 로딩 스크립트 제거 -->
    <!-- <script src="dist/main.js"></script> -->
  </body>
</html>
```

타이틀 부분에 ejs 문법을 이용하는데 `<%= env %>` 는 전달받은 env 변수 값을 출력한다.
HtmlTemplatePlugin은 이 변수에 데이터를 주입시켜 동적으로 HTML 코드를 생성한다.

뿐만 아니라 웹팩으로 빌드한 결과물을 자동으로 로딩하는 코드를 주입해 준다.
때문에 스크립트 로딩 코드도 제거했다.

webpack.config.js:
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 템플릿 경로를 지정 
      templateParameters: { // 템플리셍 주입할 파라매터 변수 지정
        env: process.env.NODE_ENV === 'development' ? '(개발용)' : '', 
      },
    })
  ]
}
```

환경 변수에 따라 타이틀 명 뒤에 "(개발용)" 문자열을 붙이거나 떼거나 하도록 했다. 
NODE_ENV=development 로 설정해서 빌드하면 빌드결과 "타이틀(개발용)"으로 나온다. 
NODE_ENV=production 으로 설정해서 빌드하면 빌드결과 "타이틀"로 나온다.

![HtmlTemplatePlugin](/assets/imgs/2019/12/11/html-template-plugin.jpg)

개발 환경과 달리 운영 환경에서는 파일을 압축하고 불필요한 주석을 제거하는 것이 좋다.

webpack.config.js:
```js
new HtmlWebpackPlugin({
  minify: process.env.NODE_ENV === 'production' ? { 
    collapseWhitespace: true, // 빈칸 제거 
    removeComments: true, // 주석 제거 
  } : false,
}
```
([문서에는 minifiy 옵션이 웹팩 버전 3 기준으로 되어 있다](https://github.com/jantimon/html-webpack-plugin/issues/1094))

환경변수에 따라 minify 옵션을 켰다.
`NOE_ENV=production npm run build`로 빌드하면 아래처럼 코드가 압축된다.
물론 주석도 제거 되었다.

![HtmlTemplatePlugin 2](/assets/imgs/2019/12/11/html-template-plugin-2.jpg)

정적파일을 배포하면 즉각 브라우져에 반영되지 않는 경우가 있다.
브라우져 캐쉬가 원인일 경우가 있는데 이를 위한 예방 옵션도 있다.

webpack.config.js:
```js
new HtmlWebpackPlugin({
  hash: true, // 정적 파일을 불러올때 쿼리문자열에 웹팩 해쉬값을 추가한다
})
```

`hash: true` 옵션을 추가하면 빌드할 시 생성하는 해쉬값을 정적파일 로딩 주소의 쿼리 문자열로 붙여서 HTML을 생성한다.

![HtmlTemplatePlugin 3](/assets/imgs/2019/12/11/html-template-plugin-3.jpg)

## 6.4 CleanWebpackPlugin

[CleanWebpackPlugin](https://github.com/johnagan/clean-webpack-plugin)은 빌드 이전 결과물을 제거하는 플러그인이다. 
빌드 결과물은 아웃풋 경로에 모이는데 과거 파일이 남아 있을수 있다. 
이전 빌드내용이 덮여 씌여지면 상관없지만 그렇지 않으면 아웃풋 폴더에 여전히 남아 있을 수 있다. 

임시로 아웃풋 폴더에 foo.js 파일을 만든 후 다시 빌드해 보자...... 파일이 남아 있다.

![CleanWebpackPlugin](/assets/imgs/2019/12/11/clean-webpack-plugin.jpg)

이러한 현상을 CleanWebpackPlugin으로 해결해 보자.
먼저 패키지를 설치한다.

```
$ npm install -D clean-webpack-plugin
```

웹팩 설정을 추가한다.

webpack.config.js:
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
  ]
}
```

빌드 결과 foo.js가 깨끗히 사라졌다. 
아웃풋 폴더인 dist 폴더가 모두 삭제된후 결과물이 생성되었기 때문이다.

## 6.5 MiniCssExtractPlugin

스타일시트가 점점 많아지면 하나의 자바스크립트 결과물로 만드는 것이 부담일 수 있다.
번들 결과에서 스트일시트 코드만 뽑아서 별도의 CSS 파일로 만들어 역할에 따라 파일을 분리하는 것이 좋다.
브라우져에서 큰 파일 하나를 내려받는 것 보다, 여러 개의 작은 파일을 동시에 다운로드하는 것이 더 빠르다.

개발 환경에서는 CSS를 하나의 모듈로 처리해도 상관없지만 프로덕션 환경에서는 분리하는 것이 효과적이다. 
[MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin)은 CSS를 별로 파일로 뽑아내는 플러그인이다. 

먼저 패키지를 설치한다.

```
$ npm install -D mini-css-extract-plugin
```

웹팩 설정을 추가한다.

webpack.config.js:
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    ...(
      process.env.NODE_ENV === 'production' 
      ? [ new MiniCssExtractPlugin({filename: `[name].css`}) ]
      : []
    ),
  ],
}
```
프로덕션 환경일 경우만 이 플러그인을 추가했다. 
`filename`에 설정한 값으로 아웃풋 경로에 CSS 파일이 생성될 것이다.

개발 환경에서는 css-loader에의해 자바스크립트 모듈로 변경된 스타일시트를 적용하기위해 style-loader를 사용했다.
반면 프로덕션 환경에서는 별도의 CSS 파일으로 추출하는 플러그인을 적용했으므로 다른 로더가 필요하다.

```js
module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        process.env.NODE_ENV === 'production' 
        ? MiniCssExtractPlugin.loader  // 프로덕션 환경
        : 'style-loader',  // 개발 환경
        'css-loader'
      ],
    }]
  }
}
```

플러그인에서 제공하는 MiniCssExtractPlugin.loader 로더를 추가한다.

`NODE_ENV=production npm run build`로 결과를 확인해보자. 

![MiniCssExtractPlugin](/assets/imgs/2019/12/11/mini-css-extract-plugin.jpg)

dist/main.css가 생성되었고 index.html에 이 파일을 로딩하는 코드가 추가되었다. 

# 7. 정리

ECMAScript2015 이전에는 모듈을 만들기 위해 즉시실행함수와 네임스페이스 패턴을 사용했다. 
이후 각 커뮤니티에서 모듈 시스템 스펙이 나왔고 웹팩은 ECMAScript2015 모듈시스템을 쉽게 사용하도록 돕는 역할을 한다.

엔트리포인트를 시작으로 연결되어 었는 모든 모듈을 하나로 합쳐서 결과물을 만드는 것이 웹팩의 역할이다.
자바스크립트 모듈 뿐만 아니라 스타일시트, 이미지 파일까지도 모듈로 제공해 주기 때문에 일관적으로 개발할 수 있다.

웹팩의 로더와 플러그인의 원리에 대해 살펴보았고 자주 사용하는 것들의 기본적인 사용법에 대해 익혔다.
