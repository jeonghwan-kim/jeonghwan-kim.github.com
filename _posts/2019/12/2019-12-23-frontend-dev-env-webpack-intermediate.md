---
title: '프론트엔드 개발환경의 이해: 웹팩(심화)'
layout: post
summary: ''
category: series
tags: webpack
---

이전글 [프론트엔드 개발환경의 이해: 웹팩(기본편)]()에서는 웹팩의 개념과 간단한 사용법에 대해 살펴보았다.
웹팩은 프론트엔드 개발 환경을 위한 개발 서버를 제공하고 빌드 결과를 최적화 하는 다양한 방법을 제공하는데 이번글에서 자세히 살펴 보겠다.


## 1. 웹팩 개발 서버

### 1.1 배경

지금까지는 브라우져에 파일을 직접 로딩해서 결과물을 확인했다. 
인터넷에 웹사이트를 게시하려면 서버 프로그램으로 이 파일을 읽고 요청한 클러이언트에게 제공해야 한다.

개발환경에서도 유사한 환경을 갖추는 것이 좋다.
운영환경과 유사하게 함으로서 배포시 잠재적 문제를 미리 확인할 수 있다. 
게다가 ajax 방식의 api 연동은 cors 정책 때문에 반드시 서버가 필요하다. 

프론트엔드 개발환경에서 이러한 개발용 서버를 제공해 주는 것이 webpack-dev-server다.

### 1.2 설치 및 사용 

webpack-dev-server 패키지를 우리 프로젝트에 설치한다.

```
npm i webpack-dev-server
```

node_modules/.bin에 있는 webpack-dev-servr 명령어를 바로 실행해도 되지만 npm 스크립트로 등록해서 사용하겠다.

package.json:
```json
{
  "scripts": {
    "start": "webpack-dev-server"
  }
}
```

npm start 명령어로 실행하면 다음과 같이 서버가 구동되었다는 메시지를 확인할 수 있다. 

```
npm start

> webpack-dev-server

ℹ ｢wds｣: Project is running at http://localhost:8080/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from 
```

로컬 호스트의 8080 포트에 서버가 구동되어서 접속을 대기하고 있다. 
웹팩 아웃풋인 dist 폴더는 루트 경로를 통해 접속할 수 있다. 

브라우져 주소창에 http://localhost:8080 으로 접속해 보면 결과물을 확인할 수 있다. 

소스 코드를 수정하고 저장해 보자.
웹팩 서버는 파일 변화를 감지하면 웹팩 빌드를 다시 수행하고 브라우져를 리프레시하여 변경된 결과물을 보여준다.

![webpack-dev-server-run](/assets/imgs/2019/12/28/webpack-dev-server-run.gif)

이것만으로도 개발 환경이 무척 편리해졌다. 
코드를 수정할때마다 저장하고 브라우져 갱신 버튼을 클릭하는 것은 무척 지난한 일인데 말이다. 

### 1.3 기본 설정

웹팩 설정 파일에 devServer 객체에 개발 서버 옵션을 설정할 수 있다.

```js
// webpack.config.js:
{
  devServer: {
    contentBase: path.join(__dirname, 'dist'), 
    publicPath: '/', 
    host: 'dev.domain.com',
    overlay: true,
    port: 8081,
    stats: 'errors-only',
    historyApiFallback: true,
  }
}
```

**contentBase**: 정적파일을 제공할 경로. 기본값은 웹팩 아웃풋이다.

**publicPath**: 브라우져를 통해 접근하는 경로. 기본값은 '/' 이다.

**host**: 개발환경에서 도메인을 맞추어야 하는 상황에서 사용한다.
예를들어 쿠기 기반의 인증은 인증 서버와 동일한 도메인으로 개발환경을 맞추어야 한다.
운영체제의 호스트 파일에 해당 도메인과 127.0.0.1 연결한 추가한 뒤 host 속성에 도메인을 설정해서 사용한다.

**overlay**: 빌드시 에러나 경고를 브라우져 화면에 표시한다.

**port**: 개발 서버 포트 번호를 설정한다. 기본값은 8080.

**stats**: 메시지 수준을 정할수 있다. 
'none', 'errors-only', 'minimal', 'normal', 'verbose' 로 메세지 수준을 조절한다.

**historyApiFallBack**: 히스토리 API를 사용하는 SPA 개발시 설정한다. 
404가 발생하면 index.html로 리다이렉트한다.


이 외에도 개발 서버를 실행할때 명령어 인자로 **--progress**를 추가하면 빌드 진행율을 보여준다. 빌드 시간이 길어질 경우 사용하면 좋다.

메세지 출력 옵션만 설정한 뒤,

```js
// webpack.config.js:
{
  devServer: {
    overlay: true,
    stats: 'errors-only',
  }
}
```

npm 스크립트를 수정해보자.

```json
{
  "scripts": {
    "start": "webpack-dev-server --progress"
  }
}
```

빌드하면 아래와 같이 출력 메세지를 조절할 수 있다. 

![webpack-dev-server-run-2](/assets/imgs/2019/12/28/webpack-dev-server-run-2.gif)

이외에도 다양한 옵션은 [여기]()를 참고하자.

## 2. API 연동

프론트엔드에서는 서버와 데이터 주고 받는 스펙도 필요한데 http 기반의 api를 사용한다.
보통은 api 서버를 어딘가에 띄우고 혹은 로컬호스트에 띄우고 프론트 서버와 함께 개발한다. 
개발 환경에서 이러한 api 서버 구성을 어떻게 하는지 알아 보자.

### 2.1 목업 API 1: devServer.before

웹팩 개발 서버 설정 중 before 속성은 웹펙 서버에 기능을 추가할 수 있는 여지를 제공한다. 
이것을 이해하려면 노드 웹 프레임웍인 Express.js에 사전지식이 있으면 유리한데 간단히 말하면 익스프레스는 미들웨어 형태로 서버 기능을 확장할수 있다. 
이 before가 바로 미들웨어인 것이다. 아래 코드를 보자.

```js
// webpack.config.js
{
  devServer: {
    before: (app, server, compiler) => {
      app.get('/api/keywords', (req, res) => {
        res.json([
          { keyword: '이탈리아' },
          { keyword: '세프의요리' }, 
          { keyword: '제철' }, 
          { keyword: '홈파티'}
        ])
      })
    }
  }
}
```

before에 설정한 함수가 바로 미들웨어다. 이것은 익스프레스에 의해서 app 객체가 전달되는데 이것이 Express 객체이다. 
이 에 라우팅을 추가할수 있다. app.get(url, controller) 형태로 url에 대한 라우팅 컨트롤러 함수를 정의한다. 
컨트롤러에서는 요청 req과 응답 res 객체를 받는데 여기서는 응답객체의 json() 함수로 응답하는 코드다. 

웹팩 개발 서버는 GET /api/keywords 요청시 4개의 엔트리를 담은 배열을 반환할 것이다. 
서버를 다시 구동하고 curl로 http 요청을 보내보자.

```
curl localhost:8080/api/keywords
[{"keyword":"이탈리아"},{"keyword":"세프의요리"},{"keyword":"제철"},{"keyword":"홈파티"}]
```

이런 기능이 왜 필요할까? 
개발 초기에 서버 api가 만들어지기 전 임시로 서버 응답을 프론트에 추가할 때 사용할수 있다. 
익스프레스 사전 지식이 있다면 여기에 다양한 서버 응답을 구현할 수 있다. 

프론트 코드를 수정해서 방금 만든 엔드폰인트를 호출하는 코드로 변경해 보자. 
ajax 라이브러리인 axios를 설치한다.

```
npm install axios
```

프론트엔드의 KeywordModel.js 코드를 다음과 같이 수정한다.

```js
// src/model.js:
import axios from 'axios'

// const data = [
//   {keyword: '이탈리아'}, 
//   {keyword: '세프의요리'}, 
//   {keyword: '제철'}, 
//   {keyword: '홈파티'},
// ]

export default {
  async get() {
    // return data
    
    const result = await axios.get('/api/keywords');
    return result.data;
  }
}
```

기존에는 data에 데이터를 관리했는데 이제는 ajax 호출 후 응답된 데이터를 반환하도록 변경했다. 
화면을 확인해 보면 웹펙에 설정한 응답이 화면에 나오는걸 확인할 수 있다. 

![캡처]() 

### 2.2 목업 API 2: connect-api-mocker

목업 api 작업이 많을때는 connect-api-mocker 라는 패키지의 도움을 받자. 
최근검색어 조회, 검색 api 는 요걸로 추가해 보겠다. 

먼저 이 패키지를 설치한다

```
npm install connect-api-mocker
```

요거는 API 메소드와 경로에 맞게 폴더를 만들고 응답 정보를 json파일로 해당 폴더에 넣으면 자동으로 웹팩 개발 서버가 엔드포인트를 만들어준다. 

동일한 엔드포인트를 만들기 위해서 다음과 같이 폴더를 구성한다.
mocks/api/keywords/GET.json

GET 메소드를 사용하기때문에 GET.json으로 파일을 만들었다. POST, DELETE 등 메소드 명으로도 파일을 만들 수 있다.

GET.json:
```json
[
  { "keyword": "이탈리아" }, 
  { "keyword": "세프의요리" }, 
  { "keyword": "제철" }, 
  { "keyword": "홈파티 "},
]
```

응답 데이터를 json 형식으로 작성하면된다.

이렇게 만든 뒤 devServer.before 에 이 목업 폴더를 가지고 패키지를 추가해야한다.
```js
// webpack.config.js:
{
  devServer: {
    before: (app, server, compiler) => {
      app.use(apiMocker('/api', 'mocks/api'))
    },
  }
}
```

익스프레스 객체인 app은 미들웨어 추가를 위해 use 함수를 제공하는데 apiMocker는 미들웨어이기 때문에 use 함수로 추가했다. 
패키지에 전달한 인자중 첫번째 인자는 설정할 라우우팅 경로로서 /api로 들어온 모든 경로를 설정했다. 
두 번째 인자는 해당경로로 들어왔을 때 이패키지가 응답으로 제공할 목업 파일이 있는 경로이다. 
mocks/api 로 설정했다. 


### 2.3 실제 API 연동: devServer.proxy

이번에는 api 서버를 로컬환경에 실행한다음 목업이 아닌 이 서버에 api 요청을 해보자. 
로컬호스트 8081 포트에 아래와 같이 서버가 구성되었다고 가정해 보자.

```
$ curl localhost:8081/api/keywords
[{"keyword":"이탈리아"},{"keyword":"세프의요리"},{"keyword":"제철"},{"keyword":"홈파티"}]
```

이 api 서버로 요청하도록 코드를 수정해 보겠다.

```js
// src/model.js
export default {
  async get() {
    // const result = await axios.get('/api/keywords');

    const { data } = await axios.get('http://localhost:8081/api/keywords');
    return data;
  }
}
```

웹팩 개발서버를 띄우고 화면을 확인해 보자. 잘 나오는가? 
브라우져 개발자 도구에 보면 다음과 같은 에러 메세지가 출력된다.

![캡쳐]()

http://localhost:8080에서 http://localhost:8081 로 ajax 호출을 하지 못하는데 이유는 CORS 정책 때문이라는 메세지다. 
요청하는 리소스에 ‘Access-Control-Allpw-Origin 헤더가 없다는 말도 한다.

CORS(Cross Origin Resource Shaing)이란 브라우져와 서버간의 보안상의 정책인데 브라우저가 최초로 접속한 서버에서만 ajax 요청을 할수 있다는 내용이다. 
방금같은 경우는 localhost로 같은 도메인이지만 포트번호가 8080, 8081로 달라서 다른 서버로 인식하는 것이다. 

이것을 해결하기 위해서 서버측에서 작업할 수 있다. 
ajax 요청에 응답에 Access-Control-Allop0w-Origiin: * 헤더를 추가한 뒤 응답하면 된다.

```js
// server/index.js
app.get('/api/keywords', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // 헤더를 추가한다 
  res.json(keywords)
})
```

브라우져에서 다시 확인하면 방금같은 에러가 발생하지 않고 정상적은 ajax 호출을 한다.

서버에서 설정하지 않고 프론트엔드 개발활환경에서도 설정할 수있다. 서버 주소를 "**프록싱**"하는 것이다. 
웹팩 개발서버는 proxy 속성으로 이를 지원한다. 

```js
// webpack.config.js
devServer: {
  proxy: {
    '/api': 'http://localhost:8081', // 프록시
  }
}
```

개발서버에 들어온 모든 http 요청중 /api로 시작되는것은 http://localhost:8081로 요청하는 프록시 설정이다. 
api 호출코드를 다시 수정하고 

```js
// src/model.js
export default {
  async get() {
    // const { data } = await axios.get('http://localhost:8081/api/keywords');

    const {data} = await axios.get('/api/keywords');
    return data;
  }
}
```

확인해보면 정상 동작하는 것을 확인할 수 있다. 

클라이어늩에서는 최초로 접속한 8081 포트에 요청하지만 개발서버는 이를 8081포트로 전달한다. 

## 3. 핫 모듈 리플레이스먼트

### 3.1 배경

웹팩 개발서버는 코드의 변화를 감지해서 전체 화면을 갱신하기 때문에 개발 속도를 높일 수 있다. 
하지만 어떤 상황에서는 전체 화면 갱신이 좀 불펴한 경우도 있다.
싱글페이지어플리케이션은 브라우져에서 데이터를 들고 있기 때문에 리프레시 후에 모든 데이터가 초기화 되어 버린다.
다른 부분을 수정했는데 입력한 폼 값이 날아가 버리는 경우도 있고 말이다.

전체 화면 갱신 하지 않고 변경한 모듈만 바꿔치기 한다면 어떨까?

핫 모듈 리플레이스먼트는 이러한 목적으로 제공되는 웹팩 개발서버의 한 기능이다. 

### 3.2 설정

설정은 간단하다. hot 속성을 켠다.

```js
// webpack.config.js:
{
  devServer = {
    hot: true,
  },
}
```

view.js를 사용하는 컨트롤러 코드를 잠깐 읽어보자.

```js
// src/controller.js
import model from "./model";
import { render } from "./view";

const controller = {
  async init(el) {
    this.el = el;
    const data = await model.get()
    render(data, el);
  }
}

export default controller;
```

컨트롤러는 모델과 view 모듈의 의존성이 있다.
모델로 데이터를 가져와 뷰로 데이터를 그린다.
만약 view.js 모듈에 변화가 있을 경우 전체 화면을 갱신하지 않고 모듈만 갈아 치우도록 해보자.

컨트롤러 하단에 다음과 같이 추가해 보자.

```js
// src/controller.js

/**
 * 중략
 */

export default controller;

if (module.hot) {
  console.log('핫모듈 켜짐')

  module.hot.accept('./view', async () => {
    console.log('view 모듈 변경됨')
    render(await model.get(), controller.el)
  }) 
}
```

devServer.hot 옵션을 켜면 웹팩 개발 서버 위에서 module객체의 hot 객체가 생성된다.
이 객체의 accept() 메소드는 감시할 모듈과 콜백 함수를 인자로 받는다.

이 콜백함수에서 변경된 모듈을 사용하는 코드를 추가했다. 
모델로 데이터를 부르고 다시 변경된 렌더 함수를 실행했다.

view.js 코드를 변경하고 저장하면 브라우져 갱신 없이 화면이 바뀌는 것을 알수 있다.

![.gif]()


### 3.3 핫로딩을 지원하는 로더 

이처럼 "hot 인터페이스를 따른다"라고 표현하고 이러한 것들이 핫 로딩을 지원하다.
웹팩 로더 중에 핫 로딩을 지원하는 것이 style-loader다. 
잠깐 코드를 보면 hot.accept() 함수를 사용한 것을 알 수 있다.

![코드 캡쳐]()

참고: [https://github.com/webpack-contrib/style-loader/blob/master/src/index.js#L34](https://github.com/webpack-contrib/style-loader/blob/master/src/index.js#L34)

이 외에도 리액트를 지원하는 react-hot-loader, 파일을 지원하는 file-loader는 핫 모듈 리플레이스먼트를 지원한다. 
추가로 지원하는 로더 목록은 [여기](https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks)서 확인할 수 잇다.


## 4. 최적화

코드가 많아지면 번들링된 결과물도 커지기 마련이다. 
거의 메가바이트 단위로 커질수도 있는데 브라우져 성능에 영향을 줄 수 있다. 
파일을 다운로드하는데 시간이 많이 걸리기 때문이다. 
이번 섹션에서는 번들링한 결과물을 어떻게 최적화 할수 있는지 몇가지 방법에 대해 알아보겠다.

### 4.1 production 모드

웹팩에 내장되어 있는 최적화 방법중 mode 값을 설정하는 방식이 가장 기본이다. 
세 가지 값이 올 수 있는데 지금까지 설정한 **"development"**는 다음과 같은 동작을 한다.

디버깅 편의를 위해 다음 2개 플로그인을 켠다.

- NamedChunksPlugin 
- NamedModulesPlugin

DefinePlugin을 사용한다면 process.env.NODE_ENV 값을 "development"로 자동 설정된다.

반면 mode를 "**production**" 값으로 설정하면 다음과 같은 동작을 한다. 

자바스크립트 결과물을 최소화 하기 위해 다음 7개 플러그인을 켠다.

- FlagDependencyUsagePlugin
- FlagIncludedChunksPlugin
- ModuleConcatenationPlugin
- NoEmitOnErrorsPlugin
- OccurrenceOrderPlugin
- SideEffectsFlagPlugin
- TerserPlugin: 자바스크립트 최소화

DefinePlugin을 사용한다면 process.env.NODE_ENV 값을 "production" 으로 설정한다.

환경변수 NODE_ENV 값에 따라 모드를 설정하도록 웹팩 설정 코드를 다음과 같이 고쳐보았다.

```js
// webpack.config.js:
const mode = process.env.NODE_ENV || 'development'; // 기본값을 development로 설정

module.exports = {
  mode,
```

웹팩 빌드시에 이를 운영 모드로 설정하여 실행하도록 npm 스크립트를 추가한다.

package.json:
```json
{
  "scripts": {
    "start": "webpack-dev-server --progress",
    "build": "NODE_ENV=production webpack"
  }
}
```

start는 개발 서버를 구동하기 때문에 환경변수를 설정하지 않고 기본값 development를 사용할 것이다.
배포용으로 만들 build는 환경변수를 production으로 설정했고 웹팩 mode에 설정된다.

빌드한 뒤 결과물을 확인해 보자.

```
npm run build
```

![캡쳐]()

main.js 파일이 최소화 되었다. 

development로 설정해서 빌드한 결과물과 비교해 보면 확연한 차이를 알 수 있다.

![캡쳐]()

### 4.2 optimazation 속성으로 최적화 

빌드 과정을 커스터마지징할 수 있는 여지를 제공하는데 그것이 바로 optimazation 속성이다.

HtmlWebpackPlugin이 html 파일을 압축한것 처럼 css 파일도 빈칸을 없애는 압축을 하려면 어떻게 해야할까? 
[optimize-css-assets-webpack-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)이 바로 그것이다.

플러그인을 다운로드 하고,

```
npm i optimize-css-assets-webpack-plugin
```

웹팩 설정을 추가한다. 
```js
// webpack.config.js:
{
  optimization: {
    minimizer: mode === 'production' ? [
      new OptimizeCSSAssetsPlugin(),
    ] : [],
  },
}
```

optimization.minimizer는 웹팩이 결과물을 압축할때 사용할 플러그인을 넣는 배열이다.
설치한 OptimizeCSSAssetsPlugin을 전달했다.

빌드하뒤 확인하면 css 파일도 압축되었다.

![]()



mode=production일 경우 사용되는 TerserWebpackPlugin은 자바스크립트 코드를 난독화하고 debugger 구문을 제가한다.
[기본 설정]() 외에도 콘솔 로그를 제가하는 옵션도 있다. 
배포 버전에는 콘솔 로그가 불필요하기 때문이다.

```js
// webpack.config.js:
const TerserPlugin = require('terser-webpack-plugin');

{
  optimization: {
    // minimize: true, 꼭 넣어야하나?
    minimizer: mode === 'production' ? [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 콘솔 로그를 제거한다 
          }
        }
      }),
    ] : [],
  },
}
```


### 4.3 코드 스플리팅

코드를 압축하는 것 외에도 아예 결과물을 여러개로 쪼개면 좀 더 브라우져 다운로드 속도를 높일 수 있다. 
큰 파일 하나를 다운로드 하는것 보다 작은 파일 여러개를 동시에 다운로드하는 것이 더 빠르기 때문이다.

가장 단순한 것은 엔트리를 여러개로 분리하는 것이다.

```js
// webpack.config.js
module.exports = {
  entry: {
    main: "./src/app.js",
    controller: "./src/controller.js",
  }
}
```

빌드하면 엔트리가 두 개 생성되었다. 물론 하나보다 용량이 조금 줄었다.

![]()

모듈을 어떻게 분리하는냐에 따라 이 결과물의 크기를 조절할 수 있는데 지금은 거의 변화가 없다.
HtmlWebpackPlugin에 의해 html 코드에소 두 파일을 로딩하는 코드도 추가되었다.

하지만 두 파일을 비교해 보면 중복코드가 있다. axios 모듈인데 main에서 axios를 사용하고 models에서도 axios를 사용하기 때문이다.

[SplitChunksPlugin]()은 코드를 분리할때 중복을 예방하는 플러그인이다.
optization.splitChucks 속성을 설정하는 방식이다.

```js
// webpack.config.js:
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}
```

다시 빌드해보자.

![]()

main.js, controller.js외에도 vendors~main-controller.js 파일도 생겼다. 
마지막 파일은 두 엔트리의 중복 코드를 담은 파일이다. 
axios로 검색하면 main.js와 controller.js에서는 없고 vendors-main-controller.js에만 있다. 

이런 방식은 엔트리 포인트를 적절히 분리해야기 때문에 손이 많이 가는 편이다.
반면 자동으로 변경해 주는 방식이 있는데 이를 "다이나믹 임포트"라고 부른다.

기존 컨트롤러 코드를 보면 이렇다.

```js
import controller from './controller';

document.addEventListener('DOMContentLoaded', () => {
  controller.init(document.querySelector('#app'))
})
```

import/from으로 컨트롤러 모듈을 가져와서 사용했다.

이를 동적으로 임포트하려면 다음처럼 변경한다.

```js
function getController() {
  return import(/* webpackChunkName: "controller" */ './controller').then(m=> {
    return m.default
  })
}

document.addEventListener('DOMContentLoaded', () => {
  getController().then(controller => {
    controller.init(document.querySelector('#app'))
  })
})
```

getController() 함수를 정의했는데 컨트롤러 모듈을 가져는 함수다. 
import() 함수로 가져올 컨트롤러 모듈 경로를 전달하는데 주석으로 webpackHunkName: "controller"를 전달했다.
이것은 웹펙이 이 파일을 처리할때 청크로 분리하는데 그 청그 이름을 설정한 것이다.

그리고 나서 프라미스를 반환하는 getController() 함수로 모듈을 가져와 사용하였다.

변경한 웹팩 설정 파일도 다시 복구해야 한다.
엔트리 포인트를 다시 main만 남겨두고 optimization 에 설정한 SplitChunksPlugin 옵션도 제거한다.

빌드하면 자동으로 파일이 분리되었다.

![]()

엔트리를 분리하지 않아도 controller와 app의 중복코드를 vendors~...js 파일로 분리한다. 
다이나믹 임포트로 모듈을 가져오면 단일 엔트리를 유지하면서 코드를 분리할 수 있다. 


### 4.4 externals

조금만 더 생각해 보면 최적화해 볼수 있는 부분이 있다. 바로 axios같은 써드파티 라이브러리다.
패키지로 제공될때 이미 빌드 과정을 거쳤기 때문에 빌드 프로세스에서 제외하는 것이 좋다.
웹팩 설정중 externals가 바로 이러한 기능을 제공한다.

```js
// webpack.config.js:
module.exports = {
  externals: {
    axios: 'axios',
  },
}
```

externals에 추가하면 웹팩은 코드에서 axios를 사용하더라도 번들에 포함하지 않고 빌드한다.
대신 이를 전역 변수로 접근하도록하는데 키로설정한 axios가 그 이름이다.

axios는 이미 node_modules에 위치해 있기 때문에 이를 웹팩 아웃풋에 옮기고 index.html에서 로딩해야한다.
파일을 복사하는 CopyPlugin을 설치한다.

```
npm i copy-webpack-plugin
```

플로그인을 사용해서 라이브러리를 복사한다.

```js
plugins: [
  new CopyPlugin([{
    from: './node_modules/axios/dist/axios.min.js',
    to: './axios.min.js' // 목적지 파일에 들어간다
  }])
]
```

마지막으로 index.html에서는 axios를 로딩하는 코드를 추가한다. 

```html
<!-- src/index.html -->
  <script type="text/javascript" src="axios.min.js"></script>
</body>
</html>
```

axios는 이렇게 직접 추가했지만 번들링한 결과물은 htmlwebpacplugin이 주입해 주는 것을 잊지말자.

이렇게 써드파티 라이브러리를 externals로 분리하면 용량이 감소뿐만 아니라 빌드시간도 줄어들고 덩달아 개발 환경도 가벼워진다.

## 5. 정리

웹팩 최적화 방법에 대해 알아보았다. mode 옵션을 production으로 설정하면 웹팩 내장 프러그인이 프로덕션 모드로 동작한다. 번들링 결과물 크기가 커지면 브라우져에서 다운로딩하는 성능이 떨어질수 있는데 코드 스플리트 기법을 사용해서 해결할 수 있다. 엔트리 포인트를 쪼개고 중복 코드를 분리하는 방식인데 이걸 자동화하는게 동적 임포트 방식이다. 마지막으로 써드파티 라이브러리는 externals로 옮겨 놓을 수 있다. 

참고
- https://webpack.js.org/configuration/dev-server/
- https://github.com/muratcorlu/connect-api-mocker
- https://webpack.js.org/configuration/dev-server/#devserverhot
- https://webpack.js.org/plugins/hot-module-replacement-plugin/
- https://webpack.js.org/configuration/externals/
