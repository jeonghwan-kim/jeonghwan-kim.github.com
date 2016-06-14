---
title: '앵귤러로 Todo앱 만들기 4 - 컨트롤러'
layout: post
tags:
  angularjs
permalink: /lectures/todomvc-angular/4/
---

사실 앵귤러 로딩을 했다고 해서 우리의 코드가 그리고 웹문서에서 달라진 점은 거의 없다.
자바스크립트 파일 두 개가 더 다운로드 될뿐이다.
앵귤러를 사용하려면 ngController라고 하는 앵귤러 컨트롤러 함수를 사용해야 한다.

참, 한가지 알아둘 것.
앵귤러에서 ngController는 ng-controller와 동일하다.
ngModel이 ng-model과 같은것도 그렇다.


## 컨트롤러 정의

그럼 컨트롤러 함수를 만들어보자.
js/controllers/TodomvcController에 파일을 하나 더 만들자.

```javascript
angular.module('todomvc')
    .controller('TodomvcCtrl', function ($scope) {
      $scope.message = 'Hello world!';
    });
```

컨트롤러는 앵귤러에서 제공하는 controller() 함수로 정의할 수 있다.
위 코드는 "TodomvcCtrl" 컨트롤러를 생성한 것이다.
그런데 코드 앞부분에 `angular.module('todomvc')` 을 추가한 것이 눈에 뜨인다.
이것도 설명하자면 앵귤러는 angular.module() 함수로 앵귤러 모듈을 관리한다.
모듈이라고 하는 것은 앵귤러에서 제공하는 컨트롤러, 서비스, 디렉티브 등의 개념을 묶은 것이다.
우리는 todomvc 하나의 모듈만 정의하고 사용할 것이다.
한번 정의한 모듈을 `angular.module('todomvc)`로 호출할 수 있는데
이 함수의 반환값은 컨트롤러를 정의할 수 있는 controller() 함수를 제공한다.
즉 todomvc 모듈안에 TodomvcCtrl 컨트롤러를 정의하는 것이다.
이렇게 사용하는 이유는 자바스크립트 전역 공간을 사용하지 않기 위함이다.

자 그럼 TodomvcCtrl 컨트롤러는 뭣에 쓰는 것인가?
컨트롤러에서 하나 더 살펴 볼 것이 `$scope` 변수다.
컨트롤러를 하나 생성하면 `$scope` 변수는 자동으로 생성된다.
이것도 앵귤러에서 제공하는 함수이다.
`$scope` 변수를 통해 컨트롤러는 템플릿 (여기서는 index.html)과 데이터 교환을 한다.


## 컨트롤러-템플린 간 연결

index.html에 컨트롤러를 주입해 보자.

{% raw %}
```html
<body ng-app="todomvc">
<div ng-controller="TodomvcCtrl">
  <h1>{{ message }}</h1> <!-- "Hello world!" -->
</div>
</body>
```
{% endraw %}

![](/assets/imgs/2016/lecture-todomvc-angular-2-result3.png)

컨트롤러의 $scope의 message를 우리는 템플릿에서 바로 가져다 사용할수 있다.
{% raw %}`{{ message }}`{% endraw %}는 루비에서도 사용되는 문법인데 인터폴레이션 이라고 부른다.


템플릿과 컨트롤러 만으로도 기본적인 동작을 하는 todo앱을 만들수 있다.
다음 포스트부터는 컨트롤러의 $scope 변수를 이용해 기본적인 todo 앱을 만들어 보자.


관련글:

{% include lecture-todomvc-angular-1-index.html %}