---
title: '앵귤러로 Todo앱 만들기 5 - 새로운 투두 추가하기'
layout: post
category: series
seriesId: 20160611
tags: [angularjs, lecture]
permalink: /lectures/todomvc-angular/5/
featured_image: /assets/imgs/2016/todomvc-logo.png
summary: Angular.js, Node.js를 이용해서 Todo앱을 만들어 보자
date: 2016-06-12 09:00:05
---

이번에는 `ngSubmit` 디렉티브를 이용해 투두를 추가하는 방법에 대해 알아보자.


## 템플릿 작성

입력을 위해 텍스트 입력 필드와 추가 버튼을 만들자.
입력필드는 마찬가지로 `ngModel` 디렉티브로 양방향 데이터 바인딩을 설정했다.
`<input type="text" ng-model="newTodo">`
컨트롤러에서는 `newTodo`를 통해 데이터를 확인할수 있다.

버튼이 좀 눈여겨 볼만한다.
`<button type="submit">Add</button>`
이전에 사용했던 `ngClick`을 이용해 이벤트 핸들러를 걸어야 할것 같지만 그러지 않았다.
간다하게 `submit` 타입으로 지정했다.
대신 두 입력필드를 감싸는 `form` 태그에 `ng-submit`으로 이벤트 핸들러를 설정할 수 있다.

```html
<form ng-submit="addTodo(newTodo)">
  <input type="text" ng-model="newTodo" placeholder="Type todos" autofocus>
  <button type="submit">Add</button>
</form>
```

이렇게 사용하는 이유는 폼 데이터를 입력하고 엔터를 입력했을 경우
브라우져에서는 submit 이벤트가 발생하고 앵귤러는 `ng-submit`에 바인딩된 함수를 구동하는 것이다.
간단히 말하면 입력하고 엔터키를 치면 바로 동작하도록 하기 위해 `ng-submit` 디렉티브를 사용한 것이다.

화면을 확인해 보자.

![](/assets/imgs/2016/lecture-todomvc-angular-2-result6.png)


## 컨트롤러 작성

컨트롤러에서 투두를 추가하는 함수를 만들어 보자.
템플릿에서 컨트롤러에 있는 함수를 사용하기 위해서는 역시 스코프 변수에 함수를 정의해야 한다.
`$scope.addTodo` 함수를 정의해보자.

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

기존 투두목록에서 새로운 식별자 `newId`를 만들어 투두를 추가하는 간단한 로직이다.
결과를 확인해 보자!


![](/assets/imgs/2016/lecture-todomvc-angular-2-result7.png)
