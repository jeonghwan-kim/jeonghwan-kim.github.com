---
title: '앵귤러로 Todo앱 만들기 16 - $http'
layout: post
tags:
  angularjs
permalink: /lectures/todomvc-angular/16/
date: 2016-06-16 01:50:00
---

이번엔는 서버와 통신하는 앵귤러 서비스를 수정할 차례다.
지난 포스트에서 언급했듯이 앵귤러 서비스는 백엔드 api와 http 통신하면서 데이터를 주고 받는 역할을 한다.
그리고 컨트롤러에서는 이 서비스를 이용해 데이터를 가져와 템플릿에 뿌려주는 역할이다.

데이터베이스 -> 벡엔드 api -> 앵귤러 서비스 -> 앵귤러 컨트롤러 -> 앵귤러 템플릿

각각의 인터페이스를 모두 작성했고 api와 서비스 간의 연결만 구현하면 된다.

## ngHttp

자바스크립트에서는 ajax 기술을 이용해 http 요청을 한다.
jquery에는 $ajax 를 이용한다.
마찬가지로 앵귤러도 ajax를 위한 서비스를 제공하는데 $http와 $resource다.
이 포스트에서는 기본적인 $http를 이용해 백엔드 api와 통신한는 서비스를 만들어 볼 참이다.
이후에 $resource를 이용해 좀더 추상화된 api 통신을 사용하는 것도 도전적인 일이다.

$http의 사용법은 제이쿼리의 그것과 유사하다.

```javascript
angular.module('todomvc')
    .factory('todomvcStorage', function ($http) {
      var storage = {

        todos: [],

        get: function (callback) {
          $http.get('/api/todos')                 // GET /api/todos 요청
              .then(function success(response) {  // 성공
                console.log(response);
                callback(null, angular.copy(response.data, storage.todos));
              }, function error(err) {            // 실패
                console.error(err);
                callback(err);
              });
        },
      };
    });
```

$http 는 메쏘드에 따라 get(), post(), put(), delete() 함수를 제공한다.
첫번째 파라메터는 요청 url을 입력한다.
post와 put함수는 두번째 파라메터로 요청 바디를 추가할 수 있는데 다음과 같은 형시으로 객체를 넘겨준다.

```javascript
$http.post('/api/todos', {title: 'new todo'});
```

$http는 기본적으로 프라미스를 지원한다.
따라서 각 함수를 실행하면 프라미스를 리턴하기 때문에 then 함수를 이용해 결과 처리를 할수 있다.
then의 첫번째 파라매터는 성공시 함수이고 둘째 파라매터는 실패시 파라메터다.
우리는 성공시 data를 서비스의 todos 변수에 복사했다.
그리고 서비스의 get 함수의 파라메터로 넘어온 callback 함수를 실행했다.
http 요청은 비동기 요청이기 때문에 이러한 콜백 구조가 필요하다.

그럼 이 서비스를 이용하는 컨트롤러를 살짝 변경해 보자.

```javascript
angular.module('todomvc')
    .controller('TodomvcCtrl', function ($scope, todomvcStorage) {

      // 비동기 함수이미로 콜백 함수를 파라매터로 넘겼다.
      todomvcStorage.get(function (err, todos) {
        if (err) return;
        $scope.todos = todos;
      });

    });

```

기존에는 서비스에 있는 데이터를 바로 받았다.
동기식 코드였다.
그러나 http 요청을 하는 서비스는 비동기 록직이므로 콜백함수를 파라매터로 넘겼다.

보통 콜백함수는 두개의 파라매터를 사용하도록 구현한다. 첫번째는 에러, 둘째는 성공시 응답이다.
그래서 콜백 함수 결과를 확인할때 에러를 체크한 뒤 성공 응답을 확인하는 것이 일반적이다.


## 나머지는 직접 구현해보자

전체 코드는 [todomvc-angular](https://github.com/jeonghwan-kim/todomvc-angular)를 참고하길 바란다.

관련글:

{% include lecture-todomvc-angular-1-index.html %}
