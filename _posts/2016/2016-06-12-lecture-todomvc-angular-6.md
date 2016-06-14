---
title: '앵귤러로 Todo앱 만들기 6 - ngClick'
layout: post
tags:
  angularjs
permalink: /lectures/todomvc-angular/6/
---


## ngClick으로 버튼 이벤트 핸들러 만들기

이전에 만들었던 todo 목록에서 Remove 버튼에 대해 삭제 기능을 구현해보자.
기억하는가?
우리는 클릭 이벤트를 받기위해 ng-click 디렉티브를 사용해야 한다.

```html
<ul ng-repeat="todo in todos">
  <li>
      <input type="checkbox" ng-model="todo.completed">
      <input type="text" ng-model="todo.title">

      <!-- ng-click 디렉티브로 컨트롤러의 remove() 함수와 연결했다. -->
      <button type="button" ng-click="remove(todo.id)">Remove</button>
  </li>
</ul>
```
ng-click 디렉티브로 컨트롤러의 remove() 함수와 연결했다.
그리고 삭제할 투두의 id를 파라메터로 넘겨 줬다.
우리는 컨트롤러에서 remove() 함수만 만들면 삭제 기능을 구현할 수 있다.

```javascript
angular.module('todomvc')
    .controller('TodomvcCtrl', function ($scope) {

      $scope.remove = function (id) {
        if (!id) return;

        // 배열에서 제거할 인덱스를 검색
        var deleltedTodoIdx = $scope.todos.findIndex(function (todo) {
          return todo.id === id;
        });

        if (deleltedTodoIdx === -1) return;

        // 배열에서 제거
        $scope.todos.splice(deleltedTodoIdx, 1);
      }

    });

```


관련글:

{% include lecture-todomvc-angular-1-index.html %}