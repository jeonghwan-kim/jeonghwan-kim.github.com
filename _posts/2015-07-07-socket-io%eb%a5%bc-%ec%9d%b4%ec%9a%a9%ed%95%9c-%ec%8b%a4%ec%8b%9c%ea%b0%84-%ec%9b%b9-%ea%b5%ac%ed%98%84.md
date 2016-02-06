---
id: 418
title: Socket.io를 이용한 실시간 웹 구현
date: 2015-07-07T22:14:13+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=418
permalink: /socket-io%eb%a5%bc-%ec%9d%b4%ec%9a%a9%ed%95%9c-%ec%8b%a4%ec%8b%9c%ea%b0%84-%ec%9b%b9-%ea%b5%ac%ed%98%84/
categories:
  - Angular.js
  - Node.js
tags:
  - socket.io
  - Web Socket
  - 실시간웹
---
TCP/IP 소켓프로그래밍이라는 도서가 생각나는가? 인터넷의 다른 컴퓨터와 연결할 수 있다는 사실에 몇번이고 다시 읽었던 책이다. 이러한 소켓을 웹 프로토콜에서도 사용할수 있다. 80번 포트를 그대로 사용하면서 http 핸드쉐이크 과정 없이 데이터를 주고 받을 수 있다. 물론 초기 핸드쉐이크는 한 번 있어야 한다.

웹소켓의 개념과 socket.io의 예제 코드는 이쪽(<a href="http://helloworld.naver.com/helloworld/textyle/1336">링크1</a>, <a href="http://bcho.tistory.com/896">링크2</a>) 설명을 참고하자. 웹소켓 이전에 실시간 웹을 구현하기 위해서 polling, streaming 방식의 ajax 코드를 이용했다. 문제는 각 브라우져마다 구현 방법이 달라 개발이 어렵다는 것. 그래서 웹소켓이란 표준이 나왔고 이것를 구현한 것이 <a href="http://socket.io/">socket.io</a> 모듈이다. socket.io는 하나의 인터페이스로 실시간 웹을 작성할 수 있다.

본 글에서는 angular-fullstack 프레임웍을 사용하여 socket.io를 이용한 실시간 웹을 구현해 본다.
<h1>백엔드</h1>
`yo angular-fullstack`으로 앵귤러 풀스택을 설치한다. 기본적으로 백엔드에는 `GET /api/things`라는 프로토콜을 제공하고 프론트에서 이것을 호출하여 `/`에서 보여주는 샘플 코드이다. new thing을 추가하는 `POST /app/things`와 name으로 삭제하는 `DELETE /api/things/:name`을 추가하자.
<pre class="lang:js decode:true">// server/api/thing/index.js
router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:name', controller.destroy);

// server/api/thing/thing.controller.js
// Get list of things
exports.index = function(req, res) {
  res.json(db);
};

// Create new thing
exports.create = function(req, res) {
  var newThing = {name: req.body.name, info: req.body.info};
  db.push(newThing);
  res.json(201, newThing);
};

// Remove a thing
exports.destroy = function(req, res) {
  _.remove(db, function (n) {
    return n.name === req.params.name
  });
  res.send(204);
};

</pre>
각 리소스가 변경되는 이벤트마다 소켓으로 브로드캐스팅 하는 것이 실시간 API의 핵심이다. 이를 구현하기 위해서는 리소스 변경시 이벤트를 후킹할수 있어야한다. Mongoose, Sequeilize 처럼 데이터베이스를 추상화 해놓은 DAO 모듈에는 CRUD 작업에 대한 이벤트를 제공하므로 이벤트 핸들러에서 소켓 통신을 하면된다.

본 글에서는 임시 데이터베이스 클래스를 만들어 이벤트를 발생할 것이다. 이를 위해서는 노드의 <a href="https://nodejs.org/api/events.html">EventEmitter</a> 를 상속하여 MyDatabase를 먼저 작성해보자.
<pre class="lang:js decode:true">// server/api/thing/db.js
'use strict';

var _ = require('lodash');
var util = require('util');
var events = require('events').EventEmitter;

// EventImitter를 상속하는 MyDatabase 클래스를 정의한다
function MyDatabase() {
  events.call(this);

  this.db = [{
      name : '...',
      info : '...'
  }];
}
util.inherits(MyDatabase, events);

// 데이터베이스 조회 메쏘드
MyDatabase.prototype.findAll = function () {
  return this.db;
};

// 신규 데이터 추가 메쏘드
MyDatabase.prototype.create = function (newThing) {
  this.db.push(newThing);
  this.emit('create', newThing);
  return newThing;
};

// 데이터 삭제 메쏘드 
MyDatabase.prototype.destroy = function (name) {
  _.remove(this.db, function (thing) {
    return thing.name === name;
  });
  this.emit('destroy', name);
  return name;
};

// 객체를 미리 생성하여 싱글톤으로 구현한다.
var db = new MyDatabase();
exports = module.exports = db;</pre>
데이터베이스에서 이벤트를 발생하도록 만들었다. 각 이벤트마다 헨들러 함수를 등록하고 이 함수 안에서 소켓 통신을 구현하면 된다. 그전에 소켓 통신을 위해서 socket.io 모듈을 설치하자. `npm install --save socket.io socket.io-client`로 서버와 클라이언트에서 사용할 socket.io 모듈을 설치한다. socket.io 모듈은 노드의 http 모듈과 연동하여 사용할 수 있다.
<pre class="lang:js decode:true">// server/app.js
// 소켓과 http 인스턴스(server)을 연결한다.
var socketio = require('socket.io')(server, {
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);

// server/config/socketio.js
module.exports = function (socketio) {
  // 소켓연결이 되었을때 thing 리소스에 대한 소켓 설정을 등록한다.
  // 데이터베이스 이벤트 핸들러에 소켓 통신을 구현하는 것이다.
  socketio.on('connection', function (socket) {
    require('../api/thing/thing.socket').register(socket);
  });
};

// server/api/thing/thing.socket.js
var db = require('./db');

exports.register = function(socket) {
  db.on('create', function (newThing) {
    // 디비에 엔트리가 추가되었을 경우 소켓으로 thing:create 이벤트를 보낸다.
    socket.emit('thing:create', newThing);
  });

  db.on('destroy', function (removedName) {
    // 디비에서 엔트리가 삭제되었을 경우 소켓으로 thing:destroy 이벤트를 보낸다.
    socket.emit('thing:destroy', removedName);
  });
};
</pre>
<h1>프론트엔드</h1>
앵귤러를 사용한 프로트엔드에서는 `bower install --save angular-socket-io` 로 앵귤러용 socket.io를  설치하고 `angular.module('...', [... 'btford.socket-io']);`로 모듈을 주입한다. index.html에서는 백엔드 서버로 부터 socket.io 라이브러리를 다운로드한다.
<pre class="lang:xhtml decode:true ">&lt;!-- index.html --&gt;
&lt;script src="socket.io-client/socket.io.js"&gt;&lt;/script&gt;</pre>
소켓 통신을 위한 전용 앵귤러 서비스를 만들자.  이 서비스는 백엔드와 소켓으로 연결한 뒤 그 객체를 반환하는 역할을 한다.
<pre class="lang:js decode:true ">// client/components/services/socket/socket.service.js

angular.module('realTimeWebBySocketioApp')
    .factory('socket', function (socketFactory) {
      // 백앤드와 소켓으로 연결한다.
      var ioSocket = io('', {
        path: '/socket.io-client'
      });

      // 소켓 서비스 객체를 생성한다.
      var socket = socketFactory({
        ioSocket: ioSocket
      });

      return socket;
    });
</pre>
마지막으로 컨트롤러에서 이 앵귤러 서비스를 사용해 백엔드와 소켓 통신을 구현해 보자.
<pre class="lang:js decode:true">// client/app/main/main.controller.js

angular.module('realTimeWebBySocketioApp') 
    .controller('MainCtrl', function ($scope, $http, socket) {
      // socket 서비스를 주입한다.

      // 서버로부터 리소스를 받아온다.
      $http.get('/api/things').success(function (awesomeThings) {
        $scope.awesomeThings = awesomeThings;
      });

      // 서버에 리소스를 추가하는 프로토콜을 요청한다.
      $scope.create = function (name) {
        var thing = {name: name, info: ''};
        $http.post('/api/things', thing);
        $scope.name = '';
      };
      
      // 서버는 리소스 추가가 완료되면 'thing:create' 이벤트를 보낸다.
      socket.on('thing:create', function (newThing) {
        // 브라우져에서는 이 이벤트를 캐치하여 새로운 리소스를 브라우져에 추가할 수 있다.
        $scope.awesomeThings.push(newThing);
      });

      // 리소스 삭제도 동일한 구조다.
      $scope.destroy = function (thing) {
        $http.delete('/api/things/' + thing.name);
      };

      socket.on('thing:destroy', function (removedName) {
        _.remove($scope.awesomeThings, function (thing) {
          return thing.name === removedName;
        });
      });
    });
</pre>
<h1>테스트</h1>
실제 두 세션으로 연동하여 소켓 동작을 확인할 수 있다.

소스코드: <a href="https://github.com/jeonghwan-kim/real-time-web-by-socket.io">링크</a>