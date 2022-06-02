---
title: "앵귤러로 Todo앱 만들기 7 - 투두 목록 필터링"
layout: post
category: 연재물
seriesId: "앵귤러로 Todo앱 만들기"
tags: [angularjs, lecture]
slug: /lectures/todomvc-angular/7/
date: 2016-06-13 09:00:07
---

우리가 ngRepeat 디렉티브를 이용해 todos 배열 데이터를 출력해 봤다.
이번에는 출력된 리스트를 필터링해 보겠다.

필터링할 수 있는 기준은 아래와 같다.

- completed: 완료된 투두 리스트
- active: 미완료된 투두 리스트
- all: 모든 투두 리스트

ngRepeat는 기본적으로 필터기능을 지원한다.
완료된 투두 리스트만 필터링 한다고 하면 아래와 같은 코드를 작성하면 된다.

```html
<ul ng-repeat="todo in todos | filter: {completed: true}"></ul>
```

반대로 미완료된 투두만 필터링 할경우에는 `filter: {completed: false}`로 할것이다.
모든 투두 리스트를 보여줄 경우 즉 필터링하지 않을 경우에는 `filter: {}`처럼 빈 객체를 필터에 추가하면 된다.

자 다시 생각해 보자.
필터기능을 어떻게 UI랑 함께 구현할 수 있을까?

## 필터 버튼 만들기

completed, active, all 세개를 버튼을 만들어서 각각 클릭할때 마다 필터링 로직이 동작하도록 하자.

```html
<div class="btn-group" role="group" aria-label="...">
  <button type="button" ng-click="status='completed'">Completed</button>
  <button type="button" ng-click="status='active'">Active</button>
  <button type="button" ng-click="status=''">All</button>
</div>
```

![](/assets/imgs/2016/lecture-todomvc-angular-2-result9.png)

## 상태정보: \$scope.status

필터에 관련된 정보를 스코프변수 `$scope.status`에 저장한다.
버튼을 클릭할 때마다 이 값은 변경될 것이다.
왜냐하면 각 필터버튼에 `ng-click` 핸들러를 추가했기 때문이다.

```html
<button ng-click="status='completed'"></button>
```

`ng-click은` 함수뿐만이 아니라 자바스크립트 명령문도 올 수 있다.

## 필터정보: \$scope.statusFilter

`ng-repeat`을 사용할때 `filter`에 적당한 필터 정보를 설정해야 하는데...
이게 동적으로 동작해야한다.
그럼 필터값에 변수를 할당하면 어떨까?

```html
<ul ng-repeat="todo in todos | filter:statusFilter"></ul>
```

사용자가 어던 필터 버튼을 클릭하느냐에 따라 필터에 설정된 변수 `statusFilter`의 값이 변경될 것이다.

## \$watch

앵귤러에서 가장 많이 사용하지만 남용되어서는 안될 함수가 있는데 바로 `$watch` 함수다.
이것은 스코프 변수의 변경을 감지하고 그때마다 사용자가 설정한 함수를 실행한다.
물론 많이 사용하면 메모리 자원도 그만큼 많이 사용하 때문에 이점을 조심해야 한다.

우리는 `$watch`변수를 통해 버튼클릭으로 변경되 `status` 변수를 감시하고
그 값에 따라 `statusFilter` 값을 변경해 주면 필터가 동작할 것이다.

TodomvcCtrl.js:

```javascript
// 필터버튼을 클릭하고 status 값이 변경되면 $watch()에 등록한 함수가 동작한다.
$scope.$watch("status", function () {
  if ($scope.status === "completed") {
    // Completed 클릭시
    $scope.statusFilter = { completed: true } // 필터를 설정한다.
  } else if ($scope.status === "active") {
    // Active 클릭시
    $scope.statusFilter = { completed: false } // 필터를 설정한다.
  } else {
    // All 클릭시
    $scope.statusFilter = {} // 필터를 해제한다.
  }
})
```

화면을 다시 리로딩하여 필터가 동작하는 것을 확인해 보자.

## Clear All 버튼 추가하기

거의 다왔다. 화면구성 마지막 단계다.
버튼을 하나만 하나만 더 추가하자.
투두를 하나씩 완료하면 완료된 투두 목록이 많아질 것이기 때문에 "Clear Completed" 버튼을 만들어야겠다.

사실 이 부분은 별로 설명하지 않아도 잘 따라온 독자라면 혼자서도 구현할수 있어야 한다.
총 정리하는 차원에 전체 코드를 실어놓겠다.

index.html:

{% raw %}

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=yes"
    />
    <title>Angular | TodoMVC</title>
    <link
      rel="stylesheet"
      href="node_modules/bootstrap/dist/css/bootstrap.min.css"
    />
  </head>
  <body ng-app="todomvc">
    <div ng-controller="TodomvcCtrl" class="container">
      <h1>
        Todos
        <small> {{status}}</small>
      </h1>

      <ul class="list-unstyled">
        <li>
          <form ng-submit="addTodo(newTodo)">
            <div class="input-group">
              <input
                type="text"
                ng-model="newTodo"
                class="form-control"
                placeholder="Type todos"
                autofocus
              />
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
              <input
                type="checkbox"
                aria-label="..."
                ng-model="todo.completed"
              />
            </span>
            <input
              type="text"
              class="form-control"
              aria-label="..."
              ng-model="todo.title"
            />
            <div class="input-group-btn">
              <button class="btn btn-danger" ng-click="remove(todo.id)">
                Remove
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div class="btn-group" role="group" aria-label="...">
        <button
          type="button"
          class="btn btn-default"
          ng-click="status='completed'"
        >
          Completed
        </button>
        <button
          type="button"
          class="btn btn-default"
          ng-click="status='active'"
        >
          Active
        </button>
        <button type="button" class="btn btn-default" ng-click="status=''">
          All
        </button>
        <button
          type="button"
          class="btn btn-default"
          ng-click="clearCompleted()"
        >
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
angular.module("todomvc", [])
```

js/controllers/TodomvcCtrl.js:

```javascript
angular.module("todomvc").controller("TodomvcCtrl", function ($scope) {
  $scope.todos = [
    {
      id: 1,
      title: "요가 수행하기",
      completed: false,
    },
    {
      id: 2,
      title: "어머니 용돈 드리기",
      completed: true,
    },
  ]

  $scope.addTodo = function (todoTitle) {
    todoTitle = todoTitle.trim()
    if (!todoTitle) return

    var newId = !$scope.todos.length
      ? 1
      : $scope.todos[$scope.todos.length - 1].id + 1
    var newTodo = {
      id: newId,
      title: todoTitle,
      completed: false,
    }

    $scope.todos.push(newTodo)
  }

  $scope.remove = function (id) {
    if (!id) return

    var deleltedTodoIdx = $scope.todos.findIndex(function (todo) {
      return todo.id === id
    })

    if (deleltedTodoIdx === -1) return

    $scope.todos.splice(deleltedTodoIdx, 1)
  }

  $scope.$watch("status", function () {
    if ($scope.status === "completed") {
      $scope.statusFilter = { completed: true }
    } else if ($scope.status === "active") {
      $scope.statusFilter = { completed: false }
    } else {
      $scope.statusFilter = {}
    }
  })

  $scope.clearCompleted = function () {
    var incompleteTodos = $scope.todos.filter(function (todo) {
      return !todo.completed
    })
    angular.copy(incompleteTodos, $scope.todos)
  }
})
```

![](/assets/imgs/2016/lecture-todomvc-angular-2-result10.png)
