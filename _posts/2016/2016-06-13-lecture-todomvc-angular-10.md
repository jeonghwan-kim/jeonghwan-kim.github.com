---
title: '앵귤러로 Todo앱 만들기 10 - Clear Completed'
layout: post
tags:
  angularjs
permalink: /lectures/todomvc-angular/10/
---

거의 다왔다. 화면구성 마지막 단계다.
버튼을 하나만 하나만 더 추가하자.
투두를 하나씩 완료하면 완료된 투두 목록이 많아질 것이기 때문에 Clear Completed 버튼을 만들어야겠다.
반드시 필요한 기능이다.

사실 이 부분은 별로 설명하지 않아도 잘 따라온 독자라면 혼자서도 구현할수 있어야한다.
총 정리하는 차원에 전체 코드를 실어놓겠다.

index.html:

{% raw %}
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=yes">
  <title>Angular | TodoMVC</title>
  <link rel="stylesheet"
        href="node_modules/bootstrap/dist/css/bootstrap.min.css">
</head>
<body ng-app="todomvc">
<div ng-controller="TodomvcCtrl" class="container">
  <h1>Todos
    <small> {{status}}</small>
  </h1>

  <ul class="list-unstyled">
    <li>
      <form ng-submit="addTodo(newTodo)">
        <div class="input-group">
          <input type="text" ng-model="newTodo" class="form-control"
                 placeholder="Type todos" autofocus>
          <span class="input-group-btn">
            <button class="btn btn-success" type="submit">Add</button>
          </span>
        </div>
      </form>
    </li>
  </ul>

  <ul ng-repeat="todo in todos | filter:statusFilter" class="list-unstyled">
    <li class="todo-item">
      <div class="input-group">
        <span class="input-group-addon">
          <input type="checkbox" aria-label="..." ng-model="todo.completed">
        </span>
        <input type="text" class="form-control" aria-label="..." ng-model="todo.title">
        <div class="input-group-btn">
          <button class="btn btn-danger" ng-click="remove(todo.id)">Remove</button>
        </div>
      </div>
    </li>
  </ul>

  <div class="btn-group" role="group" aria-label="...">
    <button type="button" class="btn btn-default" ng-click="status='completed'">
      Completed
    </button>
    <button type="button" class="btn btn-default" ng-click="status='active'">
      Active
    </button>
    <button type="button" class="btn btn-default" ng-click="status=''">All
    </button>
    <button type="button" class="btn btn-default" ng-click="clearCompleted()">
      Clear Completed
    </button>
  </div>

</div>

<script src="node_modules/angular/angular.js"></script>
<script src="js/app.js"></script>
<script src="js/controllers/TodomvcCtrl.js"></script>

</body>
</html>
```
{% endraw %}

js/app.js:

```javascript
angular.module('todomvc',[]);
```

js/controllers/TodomvcCtrl.js:

```javascript
angular.module('todomvc')
    .controller('TodomvcCtrl', function ($scope) {
      $scope.todos = [{
        id: 1,
        title: '요가 수행하기',
        completed: false
      }, {
        id: 2,
        title: '어머니 용돈 드리기',
        completed: true
      }];

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

      $scope.remove = function (id) {
        if (!id) return;

        var deleltedTodoIdx = $scope.todos.findIndex(function (todo) {
          return todo.id === id;
        });

        if (deleltedTodoIdx === -1) return;

        $scope.todos.splice(deleltedTodoIdx, 1);
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
        var incompleteTodos = $scope.todos.filter(function (todo) {
					return !todo.completed;
				});

				angular.copy(incompleteTodos, $scope.todos);
      }

    });
```

![](/assets/imgs/2016/lecture-todomvc-angular-2-result10.png)



관련글:

{% include lecture-todomvc-angular-1-index.html %}