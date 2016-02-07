---
id: 143
title: Hapi 시작하기
date: 2015-02-14T16:15:06+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=143
permalink: /start-with-hapi/
categories:
  - Hapi.js
  - Node.js
tags:
  - hapi
  - javascript
  - nodejs
---
Node.js에서 서버 구현은 대부분 Express.js 프레임웍으로 개발했다. Express.js 3.x에서 4.x대로 업그레이드 되면서 개선된 성능과 사용 편의성에서 만족하고 있었다. 이제 막 익스프레스 프레임웍이 손에 익을 무렵 <a href="http://hapijs.com/" target="_blank">Hapi</a>라는 신규 노드 페레임웍에 대한 글을 접한게 되었다. (<a href="http://blog.recopick.com/69" target="_blank">Hapi.js로 Node.js를 시작하세요. - 1부 Why Hapi.js</a>)

Hapi를 스터디한 동기는 코드의 간격함이다. <a href="http://hapijs.com/tutorials#creating-a-server" target="_blank">튜터리얼</a>에 보면 단 네 문장으로 서버를 설정하고 구동할수 있다. 익스프레스 보다는 코드가 간결하고 모듈화하기 쉽다는 것을 실감한다. 라우팅을 별도로 모듈화할 수 있다는 점, 프로토콜 파라메터 검증이 용이한 점(Joi), 로깅(Good) 등.

아래 코드를 보자.  (index.js)

<pre class="theme:github lang:js decode:true">/* index.js */

var Hapi = require('hapi');

// 서버 객체 생성 및 컨넥션 정보 설정
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// 라우팅 설정 ('/')
server.route({
    method: 'GET',
    path:'/',
    handler: function (req, reply) {
        reply('server is running');
    }
});

// 서버 구동
server.start(function () {
    console.log('Hello, hapi server is running in ' + server.info.uri);
});</pre>

홈페이지에 나온 샘플 코드다. 코드만 봐도 '나는 Api 서버를 구현하는 놈이요'라는 걸 알수 있다. 서버 객체를 생성하고 바로 라우팅 설정 후 서버를 구동한다. 이후에 할것은 Api 서버의 목적에 맞게 필요한 프로토콜을 route() 함수로 추가하는 일이다.

<h2>라우팅</h2>

라우팅을 좀 더 살펴보자. server객체의 <code>route()</code> 함수로 라우팅을 설정한다. <code>method</code>에 'GET', 'POST', 'PUT', 'DELTE'를 설정하고 <code>path</code>에 라우팅 경로를 설정한다. 그리고 <code>handler</code>에 라우팅 로직 함수를 연결한다. 핸들러 함수는 두 파라매터를 받는데 첫번째 <code>req</code> 변수가 프로토콜 요청에 대한 정보를 담는 객체다. 이 request 객체를 통해 파라매터 등을 받아 비지니스 로직을 처리하면 된다.  파라매터는 세 가지 형식으로 받는다.

<ul>
    <li>`req.params`: url의 리소스 구분자('/')분을 통해 입력받은 값, 예( /users/Chris일 경우 Chris를 입력받을수 있음)</li>
    <li>`req.query`: url의 '?'이하 '&amp;'로 구분하여 입력받은 값 (보통 GET 메소드를 통해 얻는 파라매터)</li>
    <li>`req.payload`: POST 메소드를 통해 얻는 파라메터</li>
</ul>

다음 포스트에서 설명하겠지만 Hapi는 request객체를 통해 얻는 파라매터를 검증하는 강력한 모듈(<a href="https://github.com/hapijs/joi" target="_blank">Joi</a>)을 제공한다.

<span style="line-height: 1.42857143;">두 번째 파라매터 <code>reply</code> 객체는 비지니스 로직 처리후 클라이언트 응답을 위해 사용한다. 파라메터로 문자열을 넣으면 Plane Text를, 자바스크립트 객체를 넘겨주면 Json형식으로 반환한다. <code>reply.code()</code>로 http statusCode를 보낼 수도 있다. 함수 체이닝을 이용해 <code>reply().code()</code>로 사용할수도 있다.</span>

라우팅 설정을 server객체의 route() 함수가 담당하므로 server 객체를 넘겨주면 라우팅 모듈만 별도로 분리할 수 있다. 모듈화를 위해 reoutes.js라는 파일로 라운팅을 분리하자.

<pre class="theme:github lang:js decode:true">/* index.js */

var Hapi = require('hapi');

// 서버 객체 생성 및 컨넥션 정보 설정
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// 라우팅 설정 ('/')
require('routes.js')(server);

// 서버 구동
server.start(function () {
    console.log('Hello, hapi server is running in ' + server.info.uri);
});


/* routes.js */

module.exports = function (server) {

    server.route({
        method: 'GET',
        path:'/',
        handler: function (req, reply) {
            reply('server is running');
        }
    });

    server.route({
        method: 'GET',
        path:'/hello/{name}',
        handler: function (req, reply) {
            reply('hello ' + req.params.name);
        }
    });

};
</pre>

기존 index.js 파일에서는 라우팅 모듈을 불러와서 server 객체를 넘겨준다. routes.js 모듈에서는 이 server객체를 이용하여 라우팅 설정을 한다.

<h2>라우팅 모듈화</h2>

좀 더 확장해 보면 리소스명으로 폴더를 만들고 각 폴더에 server 객체를 받는 라우팅 모듈을 구현할 수 있다. 기존 index.js 는 라우팅 설정만 변경한다. 모듈을 분리한 routes/index.js 파일을 불러와서 server 객체를 넘겨 준다.

<pre class="theme:github lang:js decode:true">/* index.js */
// 서버 객체 생성 및 컨넥션 정보 설정 ...

// 라우팅 설정 ('/')
require('routes')(server);

// 서버 구동 ...
</pre>

routes/index.js에서는 index.js에서 넘겨받은 server 객체를 이용해 하위 라우팅을 위해 다시 server 객체를 전달한다.

<pre class="theme:github lang:js decode:true">/* routes/index.js */
module.exports = function (server) {

    // 각 폴더에 라우팅을 위해 server 객체를 넘겨줌
    require('users')(server);
    require('posts')(server);
    // ...
};
</pre>

리소스 단위로 만든 routes 하위폴더에 각 각 index.js 파일을 만들고 넘겨받은 server 객체를 통해 라우팅 설정을 한다. 만약 하위 리스소를 가지고 있다면 동일하게 server 객체를 넘겨준다.

<pre class="theme:github lang:js decode:true">/* routes/users/index.js */
module.exports = function (server) {

    // 라우팅 설정 ...

    // 하위 라우팅을 위해 하위 폴더에 server 객체를 넘김 
    require('users 하위폴더1')(server);
    require('users 하위폴더2')(server);
    // ...
    
};&lt;br&gt;</pre>

&nbsp;

<h2>라우팅 헬퍼</h2>

지금까지 코드를 보면 폴더별로 하위 폴더에 대한 라우팅을 위해 server 객체를 넘기는 코드가 중복이다. 이 부분을 <code>routeHelper</code> 모듈로 분리해 보자.

<pre class="theme:github lang:js decode:true">/* reouteHelper.js */

exports.route = function(server, _path) {
  if (!server || !_path) throw Error();

  fs.readdirSync(_path).forEach(function (dir) {

    // Ignore files. Only folders
    if (/.js/.test(dir)) return;

    require(path.resolve(_path,  dir))(server);
  });
};</pre>

<code>server</code>객체를 첫번째 파라매터로 받고, 두번째 파라매터인 <code>_path</code>에 호출 측 경로를 전달 받는다. 이것을 통해 하위 폴더에 라우팅을 위한 server 객체를 전달할 수 있다. 아래는 routeHelper로 대체한 코드다.

<pre class="theme:github lang:js decode:true">/* index.js */
// 서버 객체 생성 및 컨넥션 정보 설정 ...

// 라우팅 설정 ('/')
require('routes')(server);

// 서버 구동 ...


/* routes/index.js */
module.exports = function (server) {

    // 각 폴더에 라우팅을 위해 server 객체를 넘겨줌
    routeHelper.route(server, __dirname);
};


/* routes/users/index.js */
module.exports = function (server) {

    // 라우팅 설정

    // 하위 라우팅을 위해 하위 폴더에 server 객체를 넘김 
    routeHelper.route(server, __dirname);
};


/* routes/posts/index.js */
module.exports = function (server) {
    // 라우팅 설정 ...

    // 하위 라우팅을 위해 하위 폴더에 server 객체를 넘김
    routeHelper.route(server, __dirname);
};</pre>

전체 코드: <a href="https://github.com/jeonghwan-kim/hapi_study/tree/05_routeHelper" target="_blank">https://github.com/jeonghwan-kim/hapi_study/tree/05_routeHelper</a>

&nbsp;

&nbsp;

&nbsp;