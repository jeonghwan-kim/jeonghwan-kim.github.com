---
title: '앵귤러로 Todo앱 만들기 5 - ngRepeat'
layout: post
tags:
  angularjs
permalink: /lectures/todomvc-angular/5/
---


## 컨트롤러에 데이터 만들기

우선 데이터가 있다고 가정하자.
우리 프로젝트에서 데이터는 투두 목록이다.
하나의 두투는 식벽자 아이디, 타이틀, 그리고 완료여부를 데이터로 가질수 있고 아래와 같이 표현할 수 있다.

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
      }]
    });
```

스코프변수에 할당된 todos 배열을 템플릿에서 어떻게 출력할수 있을까?
그냥 한번 출력해 보자.
자바스크립트의 console.log() 함수처럼 앵귤러에서 {% raw %}`{{json}}`{% endraw %}으로 출력하면 데이터 내용을 화면에서 볼수 있다.
개인적으로 개발할때 디버깅용으로 사용했다. (물론 크롬 개발자 툴이 많이 있긴하다)

{% raw %}
```html
<div ng-controller="TodomvcCtrl">
      <h1>Todos</h1>
      <pre>{{todos | json}}</pre>
</div>
```
{% endraw %}

![](/assets/imgs/2016/lecture-todomvc-angular-2-result4.png)


## ngRepeat으로 html 만들기

ngRepeat은 자바스크립트 배열을 출력하기 좋은 앵귤러 디렉티브이다.
스코프변수에 할당된 todos 배열을 ngRepeat으로 출력해 보자.

```html
<ul ng-repeat="todo in todos">
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
루프에서는 세 개의 입풋 필드를 만들었다.

체크박스는 완료 여부를 표현하는 todo.completed와 연결시켰다.
ng-model 디렉티브를 사용한 것이 보이는가?
이것은 앵귤러에서 양방향 데이터 바인딩을 가능하게 하는 기능이다.
즉 템플릿에서 사용자가 데이터를 변경하면 컨트롤러 데이터가 변경되고 반대로 컨트롤러 데이터가 변경되면 템플릿에도 그대로 반영된다.
참고롤 단방향 바인딩은 ng-bind를 사용한다.

다음 텍스트 인풋 필드에서는 todo 타이들인 todo.title 데이터와 연결되어 있다.
체크박스오 동일하게 ng-model로 양방향 바인딩 되어 인풋필드를 수정하면 컨트롤러의 스코프데이터에도 바로 반영된다.

마지막에슨 투두를 삭제할수 있는 버튼을 만들었다.
실제 동작하지는 않지만 나중에 ng-click 이라는 디렉티브를 사용하여 이벤트 처리를 구현할 것이다.

결과를 확인해 보자.

![](/assets/imgs/2016/lecture-todomvc-angular-2-result5.png)


관련글:

{% include lecture-todomvc-angular-1-index.html %}