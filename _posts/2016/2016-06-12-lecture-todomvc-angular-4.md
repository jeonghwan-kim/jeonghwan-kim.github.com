---
title: '앵귤러로 Todo앱 만들기 4 - 투두 목록 출력하기'
layout: post
category: series
seriesId: 20160611
tags:
  angularjs
  lecture
permalink: /lectures/todomvc-angular/4/
featured_image: /assets/imgs/2016/todomvc-logo.png
summary: Angular.js, Node.js를 이용해서 Todo앱을 만들어 보자
---


## 컨트롤러에 배열 데이터 만들기

우선 데이터가 있다고 가정하자.
우리 프로젝트에서 데이터는 투두 목록이다.
하나의 두투는 아이디(id), 타이틀(title), 그리고 완료여부(completed)를 데이터로 가질 수 있고
컨트롤러에서 아래와 같이 표현할 수 있다.

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

    });
```

스코프변수에 할당된 todos 배열을 템플릿에 어떻게 출력할 수 있을까?
그냥 한번 출력해 보자.
자바스크립트의 `console.log()` 함수처럼 앵귤러에서 {% raw %}`{{json}}`{% endraw %}으로 출력하면 데이터 내용을 직접 화면에서 볼 수 있다.
개인적으로 디버깅용으로 많이 사용한다. (물론 앵귤러를 위한 크롬 개발자 툴이 있긴하다.)

index.html:

{% raw %}
```html
<div ng-controller="TodomvcCtrl">
      <h1>Todos</h1>
      <pre>{{todos | json}}</pre>
</div>
```
{% endraw %}

![](/assets/imgs/2016/lecture-todomvc-angular-2-result4.png)


## ngRepeat으로 배열 출력하기

`ngRepeat`은 자바스크립트 배열을 출력하기 좋은 앵귤러 디렉티브이다.
스코프변수에 할당된 todos 배열을 `ngRepeat`으로 출력해 보자.

index.html:

```html
<ul ng-repeat="todo in todos track by $index">
  <li>
      <input type="checkbox" ng-model="todo.completed">
      <input type="text" ng-model="todo.title">
      <button type="button">Remove</button>
  </li>
</ul>
```

문법이 조금 복잡하게 보일지 모르겠으나 이렇게 사용하는 것이 맞다.

`ng-repeat="todo in todos"`는 자바스크립트의 for/in 문법과 비슷하다.
그리고 그 반복문 안에서 todo는 배열안의 하나의 todo 데이터와 동일하다.
루프에서는 checkbox, text, button 세 개의 입력 필드를 만들었다.

체크박스는 완료 여부를 표현하는 `todo.completed`와 연결시켰다.
`ng-model` 디렉티브를 사용한 것이 보이는가?
이것은 앵귤러에서 양방향 데이터 바인딩을 가능하게 하는 기능이다.
즉 템플릿에서 사용자가 데이터를 변경하면 컨트롤러 데이터가 변경되고, 반대로 컨트롤러 데이터가 변경되면 템플릿에도 그대로 반영된다.
참고롤 단방향 바인딩은 `ng-bind`를 사용한다.

다음 텍스트 인풋 필드에서는 todo 타이들인 `todo.title` 데이터와 연결되어 있다.
체크박스와 동일하게 `ng-model`로 양방향 바인딩 되어 인풋필드를 수정하면 컨트롤러의 스코프 변수에 바로 반영된다.

마지막에는 투두를 삭제할수 있는 버튼을 만들었다.
실제 동작하지는 않지만 나중에 `ng-click` 이라는 디렉티브를 사용하여 이벤트 처리를 구현할 것이다.

결과를 확인해 보자.

![](/assets/imgs/2016/lecture-todomvc-angular-2-result5.png)

## ngClick으로 삭제기능 만들기

각 투두에 삭제 버튼을 추가해 보자.
기억하는가?
우리는 버튼 클릭 이벤트를 받기위해 `ng-click` 디렉티브를 사용할 수 있다.

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
`ng-click` 디렉티브로 컨트롤러의 `remove()` 함수와 연결했다.
그리고 삭제할 투두의 `id`를 파라메터로 넘겨 줬다.
여기서 `todo.id`에 접근할 수 있는 것은 `ng-repeat` 반복문 안에 있기 때문이다.

이제 컨트롤러에서 `remove()` 함수를 만들어 만들면 삭제 기능을 구현할 수 있다.
그리고 템플릿에서 사용할 수 있으려면 todos 배열과 마찬가지고 스코프 변수에 추가해야 한다.

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
