---
title: '앵귤러로 Todo앱 만들기 7 - ngSubmit'
layout: post
tags:
  angularjs
permalink: /lectures/todomvc-angular/7/
---

지난 시간에는 ngClick을 이용해 이벤트 핸들러 구현하는 방법에 대해 알아봤다.
이번에는 ngSubmit 디렉티브를 이용해 투두를 추가하는 방법에 대해 알아보자.


## 템플릿 작성

입력을 위해 텍스트 입력 필드와 추가 버튼을 만들자.
입력필드는 마찬가지로 ngModel 디렉티브로 양방향 데이터 바인딩을 설정했다.
`<input type="text" ng-model="newTodo">`
컨트롤러에서는 newTodo를 통해 데이터를 확인할수 있다.

버튼이 좀 눈여겨 볼만한다.
`<button type="submit">Add</button>`
이전에 사요했던 ngClick을 이용해 이벤트 핸들러를 걸어야 할것 같지만 그러헤게 하지 않았다.
간다한게 submit 타입으로 지정했다.
대신 두 입력필드를 감싸는 form 태글에 ngSubmit으로 이벤트 핸들러를 설정할 수 있다.

```html
<form ng-submit="addTodo(newTodo)">
  <input type="text" ng-model="newTodo" placeholder="Type todos" autofocus>
  <button type="submit">Add</button>
</form>
```

이렇게 사용하는 이유는 폼데이터를 입력하고, 여기서는 텍스트 인풋필드를 입력하고 엔터를 입력했을 경우
브라우져에서는 submit 이벤트가 발생하고 앵귤러는 ngSubmit에 바인딩된 함수를 구동하는 것이다.
간단히 말하면 입력하고 엔터키를 치면 동작하도록 하기 위해 ngSubmit 디렉티브를 사용한 것이다.

화면을 확인해 보자.

![](/assets/imgs/2016/lecture-todomvc-angular-2-result6.png)


## 컨트롤러 작성

이제 실제 투두를 추가하는 함수를 컨트롤레에서 작성해 보자.

```javascript
angular.module('todomvc')
    .controller('TodomvcCtrl', function ($scope) {

        $scope.addTodo = function (todoTitle) {
          todoTitle = todoTitle.trim();
          if (!todoTitle) return;

          var newId = !$scope.todos.length ?
              1 : $scope.todos[$scope.todos.length - 1].id + 1;

          var newTodo = {
            id: newId,
            title: todoTitle,
            completed: false
          };

          $scope.todos.push(newTodo);
        };
      });
```

기존 투두목록에서 새로운 식별자 newId를 만들어 투두를 추가하는 간단한 로직이다.
결과를 확인해 보자!


![](/assets/imgs/2016/lecture-todomvc-angular-2-result7.png)


관련글:

{% include lecture-todomvc-angular-1-index.html %}