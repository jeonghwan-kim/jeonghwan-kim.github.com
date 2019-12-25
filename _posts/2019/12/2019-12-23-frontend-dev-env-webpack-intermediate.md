---
title: '프론트엔드 개발환경의 이해: 웹팩(심화)'
layout: post
summary: ''
category: series
tags: webpack
---

## 1. 웹팩 개발 서버

### 1.1 배경

지금까지는 index.html 파일을 직접 브라우져에서 읽어서(브라우져 주소 경로에 파일 경로를 입력해서) 결과물을 확인했다. 
결국에 이 파일은 인터넷에 연결된 어느 컴퓨터에서 서버 프로그램에 의해서 클라이언트에 제공될 것이다. 

개발환경에서도 운영환경과 같은 이와 비슷한 환경에서 개발하는 것이 유리한 점이 있다. 
실제 운영환경과 같게 함으로서 배포했을 때의 잠재적 문제를 미리 확인할 수 있다. 
뿐만 아니라 ajax 방식의 api 연동은 cros 같은 문제 때문에  반드시 서버가 필요하다. 

프론트엔드 개발환경에서 이러한 개발용 서버를 제공해 주는 것이 webpack-dev-server 패키지다. 

### 1.2 설치 및 사용 

webpack-dev-server 패키지를 우리 프로젝트에 설치한다.

```
npm i webpack-dev-server
```

node_modules/.bin에 있는 webpack-dev-servr 명령어를 바로 실행해도 되지만 npm 스크립트로 등록해서 사용하겠다.

package.json:
```
{
  "scripts" {
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

로컬 호스트의 8080 포트에 서버가 구동되어서 접속을 대기하고 있다. 웹팩 아웃풋인 dist 폴더는 루트 경로를 통해 접속할 수 있다. 

브라우져 주소창에 http://localhost:8080 으로 접속해 보면 결과물을 확인할 수 있다. 

소스 코드를 수정하고 저장해 보자.
웹팩 서버는 파일 변화를 감지하면 웹팩 빌드를 다시 수행하고 브라우져를 리프레시하여 변경된 결과물을 보여준다.
이것만으로도 개발 환경이 무척 편리해졌다. 코드를 수정할때마다 저장하고 브라우져 갱신 버튼을 클릭하는 것은 무척 지난한 일인데 말이다. 

### 1.3 기본 설정

웹팩 설정 파일에 다음과 같이 devServer  객체로 구성한다.

```js
webpack.config.js:
devServer: {
  contentBase: './', // webpack is served from here
  publicPath: '/', // webpack output is served from here
  host: ‘dev.domain.com’,
  overlay: true,
  port: 8081,
  stats: ‘errors-only’,
  progress: true,
  historyApiFallback: true,
},
```

contentBase: 정적파일을 제공할 경로 기본값은 devServer.publicPath를 사용한다
publicPath: 브라우져를 통해 접근하는 경로. 기본값은 ‘/’ 이다.
=> 요거 두개 넣으니깐 파일이 제공안됨 

host: 도메인을 맞추어야 하는 상황에서 사용. 예를 들어 세션과 쿠기 기반의 인증이라고 하면 쿠기가 유효한 도메인으로 설정해야 하는 경우가 있다. 이때 운영체제의 host에 해당 도메인과 127,.0.0.1 설정을 추가하고 host에 도메인을 설정해서 사용한다.

overlay: 빌드시 에러나 경고를 브라우져 화면에 표시

port: 개발 서버 포트 번호를 변경

stats: 메시지 수준을 정할수 있다. 'none' | 'errors-only' | 'minimal' | 'normal' | 'verbose' 로 설정. 좀더 깔끔하게 메세지 설정
	
progress: 빌드 진행율 표시. 커맨드라인에서만 사용 

historyApiFallBack: SPA 개발시 history API 사용시 true로 설정한다. 404가 발생하면 index.html로 리다이렉트한다.

## 2. API 연동

다음 실습을 위한 브랜치로 옮긴다
git checkout wepback-심화

지금가지는 정적파일을 어떻게 다루는지에 대해 설명했다. 프론트엔드에서는 서버와 데이터 주고 받는 스펙도 필요한데 HTTP 기반의 API 호출로 일어난다. 보통은 api 서버를 어딘가에 띄우고 혹은 로컬호스트에 띄우고 프론트 서버와 함께 개발한다. 개발 환경에서 이러한 api 서버 구성을 어떻게 하는지 알아 보자.

### 2.1 목업 API 1: devServer.before

웹팩 개발 서버 설정 중 before 속성은 웹펙 서버에 기능을 추가할수 있는 여지를 제공한다. 
이것을 이해하려면 노드 웹 프레임웍인 Express.js에 사전지식이 있으면 유리한데 간단히 말하면 익스프레스는 미들웨어 형태로 서버 기능을 확장할수 있다. 
이  before가 바로 미들웨어인 것이다. 아래 코드를 보자.

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

이렇게 하면 우리의 웹팩 dev 서버는 /api/keywords 란 요청에대서 위와 같은 4개의 엔트리를 담은 배열을 반환할 것이다. 
서버를 다시 구동하고 curl로 http 요청을 보내보자.

```
curl localhost:8080/api/keywords
// 결과 
```

이런 기능이 왜 필요할까? 개발 초기에 서버 api가 만들어지기 전 임시로 서버 응답을 프론트에 추가할때 사용할수 있다. 익스프레스 사전 지식이 있다면 여기에 다양한 서버 응답을 구현할 수 있다. 

프론트 코드를 수정해서 방금 만든 엔드폰인트를 호출하는 코드로 변경해 보자. ajax 라이브러리인 axio를 설치한다.

```
npm install axios
```

프론트엔드의 KeywordModel.js 코드를 다음과 같이 수정한다.

```js
// src/models/KeywordModel.js:
import axios from 'axios'

export default {
  async list() {
    const result = await axios.get('/api/keywords');
    return result.data;
  }
}
```

기존에는 배열로 저장했던 데이터를 ajax 호출후 응답된 데이터로 변경했다. 
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

GET /api/history 엔드포인트를 만들기 위해서 다음과 같이 폴더를 구성한다.
mock/api/history/GET.json

GET 메소드를 사용하기때문에 GET.json으로 파일을 만들었다. POST, DELETE 등 메소드 명으로 파일을 만들 수 있다.

GET.json:
```json
[
  {
    "keyword": "검색기록2",
    "date": "12.03"
  },
  {
    "keyword": "검색기록1",
    "date": "12.02"
  },
  {
    "keyword": "검색기록0",
    "date": "12.01"
  }
]
```

단순히 응답 데이터를 json 형식으로 작성하면된다.

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

익스프레스 객체인 app은 미들웨어 추가를 위해 use 함수를 제공하는데 apiMocker는 미들웨어이기때문에 use 함수로 추가했다. 
패키지에 전달한 인자중 첫번째 인자는 설정할 라우우팅 경로로서 /api로 들어온 모든 경로를 설정했다. 
두 번째 인자는 해당경로로 들어왔을때 이패키지가 응답으로 제공할 목업 파일이 있는 경로이다. mocks/api 로 설정했다. 

서버를 재구동하고 curl로 목업 api가 동작하는지 확인해 보자. 

```
curl localhost:8081/api/history
// 결과
```

제대로 응답 된다. HistoryModel도 만든 이 api 호출로 변경해보자. 

![캡처]()

[실습] 검색 api도 비슷하게 만들어 보자

### 2.3 실제 API 연동: devServer.proxy

이번에는 api 서버를 로컬환경에 실행한다음 목업이 아닌 이 서버에 api 요청을 해보자. 미리 만들어 놓은 server 폴더에 들어가 서버를 실행한다.

```
cd server
npm start
```

서버가 구동되었습니다. localhost:8082

8082 포트에 api 서버가 구동 되었다. curl로 요청해 보면 json 형식으로 응답되는걸 확인할 수 있다. 

```
$ curl localhost:8082/api/keywords
[{"keyword":"이탈리아"},{"keyword":"세프의요리"},{"keyword":"제철"},{"keyword":"홈파티"}]
```

그럼 프론트에서 목업서버에 요청하는것을 제거하고 실제 http://localhost:8082 호스트로 요청을 보내도록 코드를 수정해 보자. KeywordModel쪽을 수정해 보겠다. 

```js
// src/models/KeywordModel.js
export default {
  async list() {
    const data = await request('get', 'http://localhost:8082/api/keywords');
    console.log(data)
    return data;
  }
}
```

웹팩 개발서버를 띄우고 화면을 확인해 보자. 잘 나오는가? 브라우져 개발자 도구에 보면 다음과 같은 에러 메세지가 출력된다.

![캡쳐]()

http://localhost:8081에서 http://localhost:8082 로 ajax 호출을 하지 못하는데 이유는 CORS 정책 때문이라는 메세지다. 
요청하는 리소스에 ‘Access-Control-Allpw-Origin 헤더가 없다는 말도 한다.

CORS(Cross Origin Resource Shaing)이란 브라우져와 서버간의 보안상의 정책인데 브라우저가 최초로 접속한 서버에서만 ajax 요청을 할수 있다는 내용이다. 
방금같은 경우는 localhost로 같은 도메인이지만 포트번호가 8080, 8081로 달라서 다른 서버로 인식하는 것이다. 

이것을 해결하기 위해서 서버측에서 작업할 수 있다. ajax 요청에 응답에 Access-Control-Allop0w-Origiin: * 헤더를 추가하면 된다. 
간단히 서버코드를 수정해 보자. 

```js
// server/index.js
app.get('/api/keywords', (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  res.json(keywords)
})
```

주석부분을 제거하면 /api/keywords api 호출에 대한 응답에 저 헤더를 보낸다. 
브라우져에서 다시 확인하면 방금같은 에러가 발생하지 않는다. 정상 동작한다. 

서버뿐만 아니라 프론트엔드 개발활환경에서도 설정할 수있다. 서버 주소를 프록싱하는 것이다. 
웹팩 개발서버는 proxy 속성으로 이를 지원한다. 

```js
// webpack.config.js
devServer: {
  proxy: {
      '/api': 'localhost:8082'
  }
}
```

개발서버에 들어온 모든 http 요청중 /api로 시작되는것은 localhost:8082로 요청하는 프록시 설정이다. 
다시 확인해보면 정상 동작하는 것을 확인할 수 있다. 
클라이어늩에서는 최초로 접속한 8081 포트에 요청하지만 개발서버는 이를 8082포트로 전달한다. 
서버 로그에도 api 요청이 들어오는 것을 확인할 수있다.

## 3. HotModuleReplacement

### 3.1 배경

필요한 이유: 전체 화면 갱신 하지 않고 모듈만 변경, ajax 데이터 유지, 개발 생산성을 높인다
원리: 모듈 의존성에 따라서 갱신하는 것인데… 확실히 모르겠다.
웹팩에서 모듈은 자바스크립트 뿐만아니라 스타일 시트, 이미지, 폰트까지 모듈로 처리한다. 이것들의 변화가 있으면 즉시 사용하는 모듈을 갱신한다

### 3.2 사용 방법

웹팩 환경 설정 중 devServer와 plugins 를 추가한다.

```js
// webpack.config.js:
{
  devServer = {
    hot: true,ㅓ
  },
  plugins: [
    ...(
      process.env.NDOE_ENV === 'development' 
        ? [new webpack.HotModuleReplacement()]
        : []
    )
  ]
}
```

개발서버에 핫 모율 리플레이스먼트를 활성화하기위해 hot을 ture로 설정한다.  
웹팩 내장 플러그인중 HotModuleRplacement 플러그인을 추가하면 설정할 수 있다.

요것은 개발용이기 때문에 빌드 환경에 따라 설정하는 것이 좋다. 
자바스크립트 배열의 나머지 연산으로 개발 모드일 경우만 추가하도록 설정했다.

핫 모듈 리플래이스먼트를 지원하는 로더인가를 확인하는 것도 중요하다. 
우리가 사용한 MiniCssExtractPlugin.loader도 이를 지원하지 않는다. 따라서 빌드 환경에 따라 설정해야할 필요가 있다. 
우리는 이미 분기 코드를 만들어 두었다.

```js
// webpack.config.js:
{
  module: {
    rules: [
      {
        test: /\.scss$/, 
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader', 
          'sass-loader',
        ]
      },
    ]
  }
}
```

js 파일을 처리하는 babel-loader와 이미지를 처리하는 file-loader는 핫 모듈 리플레이스먼트를 지원한다. 
추가로 지원하는 로더 목록은 [여기](https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks)서 확인할 수 잇다.

## 4. 최적화

결과를 저장하는 코드도 만들자 
output을 server/public으로 변경

### 4.1 production 모드

웹팩에 내장되어 있는 최적화 방법중 mode 값을 설정하는 방식이 가장 기본이다. 
세 가지 값이 올수 있는데 지금까지 설정한 development는 다음과 같은 동작을 한다.

DefinePlugin에서 process.env.NODE_ENV 값을 ‘development’로 설정
개발환경에서 디버깅 편의를 위해 다음 2개 플로그인을 켠다.

- NamedChunksPlugin 
- NamedModulesPlugin

반면 mode를 production 값으로 설정하면 다음과 같은 동작을 한다. 

DefinePlugin에서 process.env.NODE_ENV 값을 ‘production’ 으로 설정
다음 7개 플러그인을 켠다.

- FlagDependencyUsagePlugin
- FlagIncludedChunksPlugin
- ModuleConcatenationPlugin
- NoEmitOnErrorsPlugin
- OccurrenceOrderPlugin
- SideEffectsFlagPlugin
- TerserPlugin: 자바스크립트 최소화

자바스크립트를 최소화하는 플러그인이다. 
이를 노드 환경변수중 NODE_ENV 값에 딸라 모드를 설정하도록 웹팩 설정 코드를 수정해보자.

```js
// webpack.config.js:
const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
```

웹팩 빌드시에 이를 운영 모드로 설정하여 실행하도록 npm  스크립트를 수정한다.

package.json:
```json
{
  "scripts": {
    "build": "NODE_ENV=production webpack",
    "start": "webpack-dev-server --progress"
  }
}
```

NODE_ENV 값을 production으로 설정한 뒤 webpack 명령어를 실행하는 스크립트다. 
이제 빌드한 뒤 결과물을 확인해 보자.

```
npm run build
```

![캡쳐]()

빌드 결과물중 main.js 파일이 최소화 되었다. 

development로 설정해서 빌드한 결과물과 비교해보면 확연한 차이를 알 수 있다.

![캡쳐]()

### 4.2 optimazation 속성으로 최적화 

프로덕션 모드로 설정해서 최적화한것을 커스터마지징할수 있는 여지를 제공하는데 그것이 바로 optimazation 속성이다. -> 사용 경험 없음 

optimize-css-assets-webpack-plugin 
html 파일처럼 css 파일도 빈칸을 없애는 압축을 하려면 어떻게 해야할까? 
[optimize-css-assets-webpack-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)을 사용할 수 있다.

플러그인을 다운로드 한다.

```
npm install optimize-css-assets-webpack-plugin
```

웹팩 설정을 추가한다. 
```js
// webpack.config.js:
{
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
    ]
  },
}
```

optimization.minimizer에 추가한다.

[uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)

```
npm install uglifyjs-webpack-plugin
```

```js
// webpack.config.js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: process.env.NODE_ENV === 'production' ? [
      new OptimizeCSSAssetsPlugin(),
      new UglifyJsPlugin(),
    ] : [],
  },
}
```

운영 환경에서만 압축하도록 추가했다. 빌드 후 결과를 보면 다음 처럼 한줄로 코드가 압축되었다.

!function(n){var t={};function r(e){if(t[e])return t[e].exports;var o=t[e]={i

console.log/debug 도 자동 제거됨

### 4.3 코드 스플리팅

엔트리를 여러개로 쪼게기 

```js
// webpack.config.js
module.exports = {
  entry: {
    main: ./src/app.js,
    mainController: ./src/controllers/MainController.js,
  }
}
```

![]()

main.js와 mainControllerl.js가 생겼다. 

하지만 중복이 생기네? axios 모듈이 중복되었다. main에서 axios를 사용, models에서도 axios를 사용하기 때문 
main -> models -> axios

SplitChunksPlugin으로 중복 방지 

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

빌드 결과를 보자 

![]()

main.js, mainController.js외에도 vendors~main-mainController.js 파일도 생겼다. 
두 엔트리의 중복 코드를 담은 파일이다. axios로 검색하면 main.js와 models.js에서는 없고 vendors-main-models.js에만 있다. 

이런 방식은 엔트리 포인트를 분리해야하는 수작업이 필요한데 자동으로 변경해 주는 방식이 있다. 

다이나믹 임포트

엔트리 포인트를 다시 main 만 남겨두고 optimization 에 설정한 SplitChunksPlugin 옵션도 제거한다.

![]()

엔트리를 분리하지 않아도 mainController와 app의 중복코드를 vendors~...js 파일로 분리한다. 코드가 추가되더라도 자동으로 빌드 결과를 최적화 해준다.

### 4.4 externals

axios 같은 써트 파티 라이브러리는 이미 처리했기 때문에 빌드 프로세스에서 제외하는 것이 좋을 수도 있다. 
cdn에서 직접 사용하는 것 처럼 이미 node_modules 폴더에 있는 라이브러리 배포 버전을 핸들링하여 우리 결과물에서 제외할 수 있다. 

```js
// webpack.config.js:
module.exports = {
  externals: {
    axios: 'axios',
  },
  plugins: [
    new CopyPlugin([{
      from: './node_modules/axios/dist/axios.min.js',
      to: './axios.min.js' // 목적지 파일에 들어간다
    }])
  ]
}
```

externals에 추가하면 빌드 결과물에 axios 라이브러리가 전역변수 axios로 설정된다. 

![]()

copy-weppack-plugin을 이용해서 node_mdoules에 있는 axios 배포파일을 번들 아웃풋으로 복사한다. 
그리고 index.html에서는 axios를 로딩하는 코드를 추가한다. 

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
