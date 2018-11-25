---
title: '앵귤러로 Todo앱 만들기 9 - Service'
layout: post
category: series
tags:
  angularjs
  lecture
permalink: /lectures/todomvc-angular/9/
date: 2016-06-14 14:47:00
featured_image: /assets/imgs/2016/todomvc-logo.png
summary: Angular.js, Node.js를 이용해서 Todo앱을 만들어 보자
---

다른 것도 디렉티브로 만들어 봤는지 모르겠다.
웬만하면 직접 해보는 것이 유익하다.

이번에는 컨트롤러를 쪼개 보자.
컨트롤러 스코프 변수에는 `todos` 변수가 있는데 이것은 투두 목록을 담고 있는 것이다.
그리고 `remove()`, `add()` 같은 것들은 투두 목록을 삭제하거나 사용자가 입력한 데이터를 투두 목록에 추가할수 있다.
자세히 보면 컨트롤러에는 두 종류의 기능이 섞여있다.

1. 사용자 이벤트를 감지하고 템플릿에 데이터를 보내주는 역할, 즉 **템플릿과 직접 연결되는 부분**
1. 그리고 todos 배열에서 투두를 제거하거나 추가하는 역할, 즉 **데이터를 핸들링 하는 부분**

우리는 1번 로직은 컨트롤러에 남겨두고 2번 로직을 **서비스** 라는 개념으로 분리할 것이다.


## 컨트롤러에서 서비스를 분리하자

앵귤러는 서비스라는 개념이 있는데 데이터 저장소, 그러니깐 여기서는 `todoStorage`를 만들때 사용할 수 있다.
우리는 `angular.factory()` 함수를 이용해 서비스를 만들 것이다.
사실 이 외에도 서비스를 만들 수 있는 함수는 세 가지나 더 있지만 사용할 때마다 헷갈린다.
팩토리만 사용해도 웬만한 기능은 구현할 수 있다.

js/services/todoStorage.js:

```javascript
angular.module('todomvc')
    .factory('todomvcStorage', function () {

      var storage = {
        todos: [{
          id: 1,
          title: '요가 수행하기',
          completed: false
        }, {
          id: 2,
          title: '어머니 용돈 드리기',
          completed: true
        }],

        get: function () {
          return storage.todos;
        },

      return storage;
    });
```

`factory()` 함수로 `todomvcStorage`라는 앵귤러 서비스를 정의했다.
서비스는 싱글톤이라 `todomvc` 모듈 내에서는 하나의 객체만 생성된다.
`todos`가 실제로 데이터베이스 역할을 하고 데이터 접근은 `get()` 함수를 통해 이뤄진다.
그럼 이 서비스를 사용할 컨트롤러 코드를 살펴보자.

js/controllers/TodomvcCtrl.js:

```javascript
angular.module('todomvc')
    .controller('TodomvcCtrl', function ($scope, todomvcStorage) {

      $scope.todos = todomvcStorage.get();

    });
```
`todomvcStorage` 서비스를 주입하고 기존 `$scope.todos`에 설정했던 배열을 제거했다.
대신 서비스에서 정의한 `get()` 함수를 통해 투두 목록 데이터를 가져왔다.

데이터 조회 기능을 만들었으니 추가, 삭제 기능도 만들어 보자.
먼저 서비스 코드다.

js/services/todoStorage.js:

```javascript
angular.module('todomvc')
    .factory('todomvcStorage', function () {

      var storage = {
        todos: [{
          id: 1,
          title: '요가 수행하기',
          completed: false
        }, {
          id: 2,
          title: '어머니 용돈 드리기',
          completed: true
        }],

        get: function () {
          return storage.todos;
        },

        post: function (todoTitle) {
          var newId = !storage.todos.length ?
              1 : storage.todos[storage.todos.length - 1].id + 1;
          var newTodo = {
            id: newId,
            title: todoTitle,
            completed: false
          };
          storage.todos.push(newTodo);
        },

        delete: function (id) {
          var deleltedTodoIdx = storage.todos.findIndex(function (todo) {
            return todo.id === id;
          });
          if (deleltedTodoIdx === -1) return;
          storage.todos.splice(deleltedTodoIdx, 1);
        },

        deleteCompleted: function () {
          var incompleteTodos = storage.todos.filter(function (todo) {
            return !todo.completed;
          });
          angular.copy(incompleteTodos, storage.todos);
        }
      }

      return storage;
    })

```

`post()` 함수는 새로운 투두를 추가하고 `delete()`는 기존 투두목록에서 삭제하는 함수다.
이 서비스 함수를 이용해서 컨트롤러 함수를 다시 작성해 보자.

js/controllers/TodomvcCtrl.js:

```javascript
angular.module('todomvc')
    .controller('TodomvcCtrl', function ($scope, todomvcStorage) {

      $scope.todos = todomvcStorage.get();

      $scope.addTodo = function (todoTitle) {
        todoTitle = todoTitle.trim();
        if (!todoTitle) return;
        todomvcStorage.post(todoTitle)
      };

      $scope.remove = function (id) {
        if (!id) return;
        todomvcStorage.delete(id);
      }

      $scope.$watch('status', function () {
        if ($scope.status === 'completed') {
          $scope.statusFilter = {completed: true}
        } else if ($scope.status === 'active') {
          $scope.statusFilter = {completed: false}
        } else {
          $scope.statusFilter = {}
        }
      });

      $scope.clearCompleted = function () {
        todomvcStorage.deleteCompleted();
      }

    });
```

데이터 변수와 이를 조작하는 함수는 모두 `todomvcStorage` 서비스로 위임했다.
컨트롤러는 템플릿과 연결된 기능만 있다.
이렇게 기능별로 코드를 모듈화 하는 것이 코드 읽기에 편할 뿐만 아니라 유지보수 하는데도 훨씬 좋다.


## 중간 정리

여기까지 프론트 작업은 거의 다했다.
다음 시간부터는 백엔드 작업을 진행할 예정이다.
노드 위에 익스프레스 엔진을 얹고 우리가 만든 앵귤러 앱을 호스팅할 것이다.
그리고 프론트에서 관리했던 데이터를 백엔드로 가져올 것이다.

폴더 구조를 변경하자.
`client` 폴더에 우리가 작성한 앵귤러 코드를 옮겨놓고,
`server` 폴더에는 앞으로 작성할 노드 코드를 추가할 예정이다.

![](/assets/imgs/2016/lecture-todomvc-angular-12-result1.png)


[📖 목차 바로가기](/series/2016/06/11/lecture-todomvc-angular-index.html)