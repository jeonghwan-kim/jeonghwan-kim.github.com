---
title: '앵귤러로 Todo앱 만들기 9 - $watch'
layout: post
tags:
  angularjs
permalink: /lectures/todomvc-angular/9/
---

우리가 ngRepeat 디렉티브를 이용해 todos 배열 데이터를 출력해 봤다.
이번에는 출력된 리스트를 필터링해 보겠다.

필터링할 수 있는 기준은 아래와 같다.

* completed: 완료된 투두 리스트
* active: 미완료된 투두 리스트
* all: 모든 투두 리스트

ngRepeat는 기본적으로 필터기능을 지원한다.
완료된 투두 리스트만 필터링 한다고 하면 아래와 같은 코드를 작성하면 된다.

```html
<ul ng-repeat="todo in todos | filter:{completed: false}">
```

반대로 미완료된 투두만 필터링 할경우에는 `filter:{complted: true}`로 할것이다.
모든 투두 리스트를 보여줄 경우 즉 필터링하지 않을 경우에는 `filter:{}`처럼 빈 객체를 필터에 추가하면 된다.

자 다시 생각해 보자.
필터기능을 어떻게 UI랑 함께 구현할 수 있을까?


## UI 구성

화면은 버튼을 만들자. completed, active, all 세개를 버튼을 만들어서 각각 클릭할때 마다 필터링한다.

```html
<div class="btn-group" role="group" aria-label="...">
  <button type="button" class="btn btn-default" ng-click="status='completed'">
    Completed
  </button>
  <button type="button" class="btn btn-default" ng-click="status='active'">
    Active
  </button>
  <button type="button" class="btn btn-default" ng-click="status=''">All
  </button>
</div>
```

![](/assets/imgs/2016/lecture-todomvc-angular-2-result9.png)

상태정보: 필터에 관련된 정보를 스코프변수 `$scope.status`에 저장하자.
버튼을 클릭할때마다 이 값은 변경될 것이다.
왜냐하면 각 필터버튼에 ng-click 핸들러를 추가했기 때문이다.
ngClick은 함수뿐만이 아니라 자바스크립트 명령문도 올 수 있다.

필터정보: ng-repeat을 사용할때 filter에 적당한 필터 정보를 설정해야 하는데... 이게 동적으로 동작해야한다.
```<ul ng-repeat="todo in todos | filter:statusFilter">`
사용자가 어던 필터 버튼을 클릭하느냐에 따라 이 값이 다르게 변경되어야 한다는 것이다.

앵귤러에서 가장 많이 사용하지만 남용되어서는 안될 변수가 있는데 바로 $watch 함수다.
이것은 스코프변수의 변경을 감지하고 그때마사 사용자가 정의해놓은 함수를 실행하는 기능을 한다.
물론 많이 사용하면 메모리 자원도 그만큼 많이 사용하때문에 적당히 써야한다.

우리는 $watch변수를 통해 status 변수를 감시하고 이에따라 필터 문자열을 변경해 주면된다.


TodomvcCtrl.js:

```javascript
$scope.$watch('status', function () {
  if ($scope.status === 'completed') {
    $scope.statusFilter = {completed: true};
  } else if ($scope.status === 'active') {
    $scope.statusFilter = {completed: false};
  } else {
    $scope.statusFilter = {};
  }
})
```

화면을 다시 리로딩하여 필터가 동작하는 것을 확인해 보자.



관련글:

{% include lecture-todomvc-angular-1-index.html %}