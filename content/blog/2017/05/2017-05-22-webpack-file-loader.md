---
title: 웹팩의 file-loader와 url-loader
layout: post
category: 개발
slug: /js/2017/05/22/webpack-file-loader.html
date: 2017-05-22
tags: [webpack]
---

웹팩에서 이미지나 폰트같은 파일을 다루는데 file-loader와 url-loader를 많이 사용하는 것 같다. 뷰JS를 시작할 때 vue-cli를 이용해서 코드 스캐폴딩을 만들어 내는데 이 중 웹팩 설정파일에 보면 나온다. 파일을 처리하는 file-loader와 파일 내용을 모듈에 문자열 형태로 추가하는 url-loader에 대해 정리해 보자.

## file-loader

이름 그대로 파일을 로딩하는 녀석.

그런트나 걸프의 copy 플러그인과 다른점은 실제 사용되는 파일만 복사한다는 점이다. 웹팩은 모든 것을 모듈로 처리한다고 했는데 CSS 파일도 모듈로 다룬다. CSS에서 url() 함수에 파일명을 지정할수 있는데 이를 모듈에서 발견하면 웹팩은 file-loader를 통해 파일을 복사한다.

웹팩의 entry를 'src/main.js'로 설정하고 같은 폴더에 style.css 파일을 다음과 같이 작성한다고 하자.

style.css:

```css
body {
  background-image: url(bg.svg);
}
```

backgorund-image를 동일폴더에 있는 bg.svg 파일로 설정했다.

엔트리 포인트인 main.js 파일에서 style.css 파일을 불러온다.

main.js:

```js
require("./style.css")
```

웹팩에서는 main.js를 읽은 뒤 style.css 파일을 읽을 것이다. 그리고 url에 설정한 파일인 bg.svg를 발견하는데 이때 로더 설정에 svg 파일 규칙을 추가할 수 있다. 아래처럼 말이다.

webpack.config.js:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: "file-loader",
      },
    ],
  },
}
```

확장자가 svg인 파일을 발견하면 file-loader를 적용하라는 의미다. 웹펙으로 빌드하면 기본적으로 `output`에 설정한 'dist' 경로로 이미지 파일을 복사한다. 아래 그림처럼 파일명을 해쉬코드로 대체한다. 캐쉬 갱신을 위한 처리로 보인다.

![file-loader-1](/assets/imgs/2017/05/webpack-file-loader-1.jpg)

하지만 이대로 index.html 파일을 브라우져에 로딩하면 이미지를 제대로 로딩하지 못할 수 있다. CSS를 로딩하면 `background-image: url(bg.svg)` 코드에 의해 동일 폴더에서 이미지를 찾으려고 시도할 것이다. 그러나 웹팩으로 빌드한 이미지 파일은 output인 dist 폴더 아래로 이동했기 때문에 이미지 로딩에 실패할 것이다.

file-loader 옵션을 조정해서 경로를 바로 잡아 주어야 한다.

```js
{
  loader: 'file-loader',
  options: {
    publicPath: './dist/'
    name: '[name].[ext]?[hash]',
  }
}
```

`publicPath` 옵션은 파일을 사용할 때 경로 앞에 추가되는 문자열이다. `output`에 설정한 'dist' 폴더에 이미지 파일을 옮겨질 것이니깐 `publicPath` 값을 './dist/'로 설정했다. 이 파일을 사용하는 측에서는 'bg.svg'를 'dist/bg.svg'로 변경하여 사용할 것이다. file-loader가 하는 역할이다.

![file-loader-2](/assets/imgs/2017/05/webpack-file-loader-2.jpg)

또한 `name` 옵션을 추가했는데 이것은 파일명을 변경하는 것이다. 기본적으로 설정된 해쉬값을 퀴리스트링으로 옮겨서 'bg.svg?b08916f341839041bb8a5d07051ef13c' 형식으로 파일을 요청하도록 변경했다.

전체 코드는 다음 링크에서 확인할 수 있다.

- [https://github.com/jeonghwan-kim/study.webpack/tree/blog-webpack-file-loader/file-loader](https://github.com/jeonghwan-kim/study.webpack/tree/blog-webpack-file-loader/file-loader)

## url-loader

뷰cli에서 자동 생성한 웹팩 설정을 보다가 url-loader라는 녀석을 발견했다. 작은 이미지나 글꼴 파일은 복사하지 않고 문자열 형태로 변환하여 번들 파일에 넣어버리는 놈이다. [Data URI Scheme](https://en.wikipedia.org/wiki/Data_URI_scheme)을 이용하는 것이다. ([참고](http://cocosoft.kr/364))

코드를 보면 `toString("base64")` 함수 호출결과를 모듈로 익스포트하는 것을 할 수 있다.

- [https://github.com/webpack-contrib/url-loader/blob/master/index.js#L16](https://github.com/webpack-contrib/url-loader/blob/master/index.js#L16)

10Kb 미만인 svg 파일을 url-loader로 처리하도록 변경했다.

webpack.config.js:

```js
{
  test: /\.svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]?[hash]',
      publicPath: './dist/',
      limit: 10000 // 10kb
    }
  }
}
```

빌드 결과 bundle.js 파일을 보면 bg.svg 파일이 문자열로 변경되어 있는것을 확인할 수 있다.

![url-loader-1](/assets/imgs/2017/05/webpack-url-loader-1.jpg)

브라우저에서 확인해도 스타일시트에 이 문자열이 설정되어 있다.

![url-loader-2](/assets/imgs/2017/05/webpack-url-loader-2.jpg)

아이콘 처럼 용량이 작거나 반복해서 사용하지 않는 이미지는 Data URI Scheme을 적용하기 위해 url-loader를 사용하면 좋겠다.

전체 코드는 다음 링크를 참고하자.

- [https://github.com/jeonghwan-kim/study.webpack/tree/blog-webpack-url-loader/file-loader](https://github.com/jeonghwan-kim/study.webpack/tree/blog-webpack-url-loader/file-loader)
