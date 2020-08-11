---
title: "Angular2 Quickstart에서 사용하는 라이브러리는 왜 이렇게 많을까?"
layout: post
category: dev
tags: [angularjs]
summary:
permalink: /2016/08/23/about-angular2-quickstart-libraries.html
---

앵귤러2 공식 문서를 보기 시작했다. [퀵스타트](https://angular.io/docs/ts/latest/quickstart.html#!#index)를 하나씩 따라하고 있는데 아무래도 [index.html](https://angular.io/docs/ts/latest/quickstart.html#!#index)에서 로딩하는 외부 라이브러리의 쓰임새를 모르고서는 학습을 진행하기가 여간 껄끄럽지 않다. 대충 각 라이브러리가 어떤 역할을 하는지 그 사용 목적을 파악해야 겠다는 생각에 좀 조사해 보았다.

## core-js/shim

```html
<!-- Polyfill(s) for older browsers -->
<script src="node_modules/core-js/client/shim.min.js"></script>
```

[core-js](https://github.com/zloirock/core-js)라는 것은 자바스크립트 라이브러리인데 지금까지의 기본 스펙이었던 ECMAScript 5, 최근 리엑트와 함께 떠오른 ECMAScript 6, 그리고 앞으로 나오게 될 차세대 버전인 ECMAScript 7에 제안된 스펙을 포함한다.

그 중에 shim.js 라이브러리만 사용하는데 주석에서는 오래된 브라우져를 위한 폴리필(Polyfill)이라고 말한다. 최근들어 아니 예전에도 가끔 폴리필이란 단어를 종종 접했는데 뭔지 모른상태로 그냥 지나쳤고 여전히 이에 대해서는 아는바가 없다.

> A polypill is a shim for a browser API

폴리필은 브라우져 API를 위한 shim이라고 위키피디아(https://en.wikipedia.org/wiki/Polyfill)에서는 말한다. 그럼 shim은 또 무엇일까?

> In computer programming, a shim is a small library that transparently intercepts API calls and changes the arguments passed, handles the operation itself, or redirects the operation elsewhere

컴퓨터 프로그래밍의 개념이라고 할 수 있는데 API를 가로채고, 파라매터를 변경하고, 동작 자체를 변경하는 것을 말한다고 한다. 웹에 적용해 본다면 구버전 혹은 표준 스펙과 다르게 구현된 브라우져(대표적으로 IE라 할수 있겠다)의 API를 가로채서 표준에 맞게 변경하는 것을 말한다고 이해했다.

실제 Shim은 틈새를 메우거나 물건을 수평으로 하기 위해 사용하는 나뭇조각이나 금속 조각 등을 의미한다.

![shim](/assets/imgs/2016/about-angular2-queickstart-libraries-shim.png)

그러면 이렇게 정리해 볼 수 있겠다. 폴리필은 브라우져간의 차이를 매꾸는 것을 말하고 이 기능을 사용하기 위해 이 프로젝트에서는 core-js 라이브러리의 shim.js 파일을 이용한다.

## zone.js

```html
<script src="node_modules/zone.js/dist/zone.js"></script>
```

이 라이브러리에 대해 [zone.js](https://github.com/angular/zone.js/) 문서를 읽어 봤으나 도통 무슨 얘기를 하는 모르겠다. 대신 아래 글을 통해 이해할 수 있었다.

[Angular 2 Change Detection의 시작 Zone.js](http://blog.naver.com/PostView.nhn?blogId=jjoommnn&logNo=220694733512)

앵귤러는 모델과 뷰가 연결되어 있고 모델 값이 변경될 때마다 뷰도 함께 변경된다. 나는 이렇게 할 수 있는 이유는 앵귤러가 모델을 감시하기 때문이라고 생각할 수 있는데, 그것이 아니라 모델이 변경될 만한 상활을 감지하는 구조라고 한다. 어찌 되었든 모델이 변경되면(혹은 변경될 것을 감지하면) 앵귤러에서는 "Digest Loop"를 통해 뷰에 변경된 내용을 반영하게 되어 있다. 중요한 것은 모델이 변경될 때마다 Digest Loop를 실행 시켜야 하는데 그러기 위해서는 앵귤러에서 제공하는 도구를 사용해야한다.

예를 들어 버튼 클릭 이벤트에는 `ngClick` 디렉티브로 이벤트 핸들러를 연결해야 Digest Loop를 수행한다. 그러나 `click` 디렉티브에 연결하면 Digest Loop이 제대로 동작하지 않을 수 있는 위험이 있다.

그러나 앵귤러2로 넘어오면서 이러한 제한이 없어졌다. 그것이 가능한 것은 zone.js 라이브러리 때문이며 이것은 앵귤러2 와는 별도의 라이브러리로 제공된다.

결국 zone.js를 사용하면 `ngClick` 뿐만 아니라 `click`를 사용할 수 있고, `$http` 서비스 뿐만 아니라 jQuery의 `ajax()` 함수를 사용할 수 있고, `$timeout` 서비스 뿐만 아니라 자바스크립트의 `setTimeout()` 함수까지 사용할 수 있다는 의미가 된다. 개인적으로는 이게 좋은 점인지는 잘 모르겠다.

## reflect-metadata

```html
<script src="node_modules/reflect-metadata/Reflect.js"></script>
```

reflect-metadata(https://github.com/rbuckton/ReflectDecorators)는 ECMAScript 7에서 제안한 데코레이터 문법을 사용하기 위한 라이브러리이다. 데코레이터 문법은 앵귤러2에서 다음과 같이 사용하는데 `@Component`가 데코레이션이고 일종의 신테스 슈거(syntax sugar)하고 한다. ([참고](http://stackoverflow.com/questions/30539571/can-anyone-explain-what-es7-reflect-metadata-is-all-about))

```javascript
@Component({
  selector: 'my-app',
  template: '<h1>My First Angular 2 App</h1>'
})
```

## systemjs

```html
<script src="node_modules/systemjs/dist/system.src.js"></script>
```

마지막으로 알 것 같으면서도 조금만 들어가면 여전히 잘 모르는 것이 [systemjs](https://github.com/systemjs/systemjs) 라이브러리다. 아래 코드가 이 라이브러리를 사용하는 부분인데 첫번째 출에서 systemjs를 위한 환경 설정 파일을 로딩하고 그 다음에 프로젝트에서 구현한 자바스크립트를 로딩하는 과정이다.

```html
<script src="systemjs.config.js"></script>
<script>
  System.import("app").catch(function (err) {
    console.error(err)
  })
</script>
```

전체 파일에 대해선 systemjs.config.js 에서 설정하고 그 다음 코드에서는 위에서 설정한 정보를 바탕으로 모든 자바스크립트 코드를 한번에 로딩하는 것으로 추측할 수 있다.

## 결론

앵귤러1은 간단히 `ngApp`, `ngInit` 디렉티브만 설정하면 된다. 리엑트는 react, react-dome 라이브러리를 로딩하는 것으로만 헬로 월드 코드를 만들어 낼 수 있었다. 이에 비해 앵귤러2는 왜 이렇게도 외부 라이브러리를 비교적 여러개 로딩해야하는지 솔직히 좀 불만이다. 아마 이것이 타입스크립트라는 ECMAScript 6보다는 좀 더 미래적인 언어를 사용하는 것과, 아직은 RC 버전이기 때문에 그것까지 세심히 신경쓰지 못한 탓이 아니가 싶다. 아마도 앵귤러2 릴리즈 버전이 공개되면 좀 더 사용하기 편하게 다가오지 않을까 기대한다.
