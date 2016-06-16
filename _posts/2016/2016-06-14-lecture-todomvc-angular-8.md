---
title: '앵귤러로 Todo앱 만들기 8 - Directive'
layout: post
tags:
  angularjs
permalink: /lectures/todomvc-angular/8/
date: 2016-06-14 14:46:00
featured_image: /assets/imgs/2016/todomvc-logo.png
summary: Angular.js, Node.js를 이용해서 Todo앱을 만들어 보자
---

이전 포스트까지 해서 프론트에서 사용할 기능은 대부분 완성했다.
그러고 보니 파일이 좀 길어진것 같다.
앵귤러의 많은 기능 중 템플릿과 컨트롤러만 사용했기 때문에 그렇다.
앵귤러의 장점 중 하나는 모듈화다.
모놀리틱한 구조를 더 작은 단위로 모듈화시켜서 설계할 수 있는데 앵귤러는 그러한 구조를 만들 수 있는 기능을 제공한다.
우리가 사용할 기능은 디렉티브([Directive](https://docs.angularjs.org/guide/directive))와 서비스([Service](https://docs.angularjs.org/guide/services))이다.

간단하게 디렉티브는 템플릿 구조를 모듈화하는 기능이라고 보면된다.
서비스는 자바스크립트 코드를 모듈화하는 것이라고 보면 된다.

이번 포스트에서는 index.html 파일을 모듈화하여 디렉티브로 분리해 내는 방법에 대해 알아보겠다.
그리고 다음 포스트는 서비스를 이용하여 콘트롤러를 분리하는 방법을 진행할 것이다.


## 투두 템플릿을 디렉티브로 분리

`ngRepeat`으로 투두 목록을 출력하는 코드를 `<todo-item>`으로 바꿔보자.

index.html:

```html
<ul ng-repeat="todo in todos | filter:statusFilter" class="list-unstyled">
  <li class="todo-item">

    <!-- 1. 이 부분이 하나의 todo 를 출력하는 부분이다. -->
    <div class="input-group">
      <span class="input-group-addon">
        <input type="checkbox" aria-label="..." ng-model="todo.completed">
      </span>
      <input type="text" class="form-control" aria-label="..." ng-model="todo.title">
      <div class="input-group-btn">
        <button class="btn btn-danger" ng-click="remove(todo.id)">Remove</button>
      </div>
    </div>

    <!-- 2. 위 코드를 아래 한 줄로 바꿔보자!!! -->
    <todo-item></todo-item>
  </li>
</ul>
```

1번 코드를 주석 처리하고 2번 에서 사용한 `<todo-item>` 디렉티브를 만들겠다.
먼저 js/directives/todoItem.js 파일을 만들어 아래 코드를 작성해 보자.

js/directives/todoItem.js:

```javascript
angular.module('todomvc')
    .directive('todoItem', function () {
      return {
        restrict: 'E',
        template: '<div>todoItem</div>'
      };
    });
```

`TodomvcCtrl` 컨트롤러를 만든것과 비슷한 방법으로 디렉티브를 만들 수 있다.
`angular.module()`은 `controller()` 함수 뿐만이 아니라 `directive()` 함수를 제공하는데 이것을 이용해 `todoItem` 디렉티브를 만들어보자.
정의는 `todoItem`으로 했지만 실제 사용할 때는 `<todo-item>` 으로 사용할 수 있다.
`restrict: E`일 경우 엘레먼트로 바로 정의할 수 있다는 의미이다.
`template` 문자열이 실제로 html로 변경할 부분이다.
여기서는 간단히 "todoItem" 문자열만 출력했다.
결과를 보면 정말 단순히 문자열만 보일 것이다.

![](/assets/imgs/2016/lecture-todomvc-angular-2-result11.png)

그럼 컨트롤러의 스코프 변수에 할당되어 있는 todo 데이터를 어떻게 디렉티브에서 사용할 수 있을까?
디렉티브에도 스코프 변수가 있는데 이것을 사용하면된다.
`컨트롤러 스코프변수 -> 템플릿 -> 디렉티브 스코프변수 -> 디렉티브 템플릿`
이런 순서로 데이터가 흘러가는 것이다.

디렉티브를 이렇게 사용해 보자.

```html
<todo-item todo="todo" remove="remove(todo.id)"></todo-item>
```

디렉티브에 todo와 remove 함수를 넘겨줬다.
이것을 디렉티브에서는 자체 스코프 변수에 연결하여 사용할 수 있다.
다시 디렉티브 코드를 보자

js/directives/todoItem.js:

```javascript
angular.module('todomvc')
    .directive('todoItem', function (){
      return {
        restrict: 'E',
        scope: {        // 디렉티브 스코프 설정
          todo: '=',    // 양방향 바인딩
          remove: '&'   // 참고 바인딩. 함수 설정시 사용함
        },
        template:
        '<div class="input-group">' +
          '<span class="input-group-addon">' +
            '<input type="checkbox" aria-label="..." ng-model="todo.completed" ng-click="update(todo)">' +
          '</span>' +
          '<input type="text" class="form-control" aria-label="..."' +
            'ng-model="todo.title" ng-blur="update(todo)">' +
          '<div class="input-group-btn">' +
            '<button class="btn btn-danger" ng-click="remove(todo)">Remove</button>' +
          '</div>' +
        '</div>'
      }
    })
```

디렉티브를 정의할때 `scope` 객체에 사용할 스코프 변수를 설정할 수 있다.
`todo`는 데이터인데 출력 뿐만아니라 수정도 해야하기 때문에 양방향 바인딩 `'='`을 사용했다.
`remove`는 이벤트 핸들러 함수이므로 참고용 `'&'`으로 사용했다.

`todo-item` 디렉티브를 사용하면 인덱스 파일을 훨씬 간단하게 만들 수 있다.
8줄 코드가 1줄로 줄었다.

index.html:

```html
<ul ng-repeat="todo in todos | filter:statusFilter" class="list-unstyled">
  <li class="todo-item">
    <todo-item todo="todo" remove="remove(todo.id)"></todo-item>
  </li>
</ul>
```

![](/assets/imgs/2016/lecture-todomvc-angular-2-result12.png)

다른 것도 디렉티브로 모듈로 분리해보자.

관련글:

{% include lecture-todomvc-angular-1-index.html %}
