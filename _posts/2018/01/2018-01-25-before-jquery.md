---
title: jQuery 보다 먼저 알았으면 좋았을 것들
layout: post
tags: javascript
summary: 바닐라JS와 제이쿼리 
---

웹개발할 때 난 jquery 부터 사용하기 시작한것 같다. 라이브러리가 주는 편리함 넘어 어떻게 DOM API를 사용하는지는 몰랐다. 앵귤러, 리엑트 같은 프레임웍을 사용할 때도 마찬가지다. 기능을 구현하는데 별다는 어려움은 없었다. 

그러다 보니 다양한 개발 환경에 민첩하게 움직이기 쉽지 않다. 운영중인 서비스에 쉽게 UI 프레임웍을 도입할수 없는 경우. 여러 버전의 제이쿼리를 혼용해서 사용하는 경우. 

라이브러리야 어찌되었듯 DOM API만은 브라우저에서 지원하기 때문에 처한 상황에 관계없이 안심하고 사용할 수 있다. 이럴 때 순수 자바스크립트 개발 역량은 무엇보다 중요하다고 생각한다.

## 다시 기본으로...

우리가 자바 웹 개발을 공부한다고 가정해 보자. 아마 이 순서로 공부거다. 

> 1. 자바문법 공부 -> 2. JSP 서블릿 공부 -> 3. Spring 공부 

같은 방법으로 프론트엔드 개발을 공부한다고 하면 이렇게 되겠지.

> 1. 자바스크립트 문법 공부 -> 2. 브라우져 API 공부 (DOM API) -> 3. 제이쿼리 등의 라이브러리/프레임워크 공부 

3번을 먼저 공부해왔던 나는 라이브러리의 고도로 추상화된 API만 사용하다보니 1, 2는 몰라도 결과물을 만들어 낼수 있었다. 하지만 어느 정도 시간이 지나 한계를 깨닫고 DOM 스크립트에 관심을 갖게 되었다. 

이번 글은 **순수 자바스크립트를 사용했던 경험**을 정리한 내용이다. 

![기초로 돌아가는 사진](/assets/imgs/2018/01/25/this-way.jpg)

## 돔(DOM) 선택하기

돔을 다루는 방법부터 살펴 보겠다. 아래 HTML 코드부터 시작하자.

```html
<div id="app"></div>
```

제이쿼리로 위의 돔을 선택하려면 CSS 스타일의 선택자를 사용할 수 있다.

```js
$('#app')
```

그럼 자바스크립트는?

```js
document.getElementById('app')
document.querySelector('#app')
```

`getelementById()` 함수는 아이디로 돔을 찾는 DOM API다. 가장 많이 쓰이고 많이 알고 있는 듯. 
두번째 `querySelector()`는 제이쿼리와 비슷하게 CSS 스타일의 선택자로 돔을 선택할 수 있다.

돔은 선택에는 아이디 뿐만 아니라 클래스명도 사용될 수 있다.

```html
<div class="container"></div>
```

제이쿼리부터...

```js
$('.container')
```

똑같이 CSS 스타일 선택자를 사용한다.

그럼 자바스크립트는?

```js
document.getElementsByClassName('container')
document.querySelector('.container')
document.querySelectorAll('.container')
```

`getElementsByClassName()`은 클래스 명으로 돔을 찾는 API다. 함수명에 "Elements"라는 복수형에서 알 수 있듯이 여러 개 돔을 유사 배열 형태로 반환한다.

CSS 스타일 선택자를 이용해서 찾으려면 `querySelector()` 함수를 사용하면 된다. 다른 점은 돔 엘리먼트 중에 첫번째만 반환한다는 것. `getElementsByClassName()` 처럼 전부 찾으려면 `querySelectorAll()` 함수를 이용한다.

잘 사용하진 않지만 태그명으로도 돔을 검색해 보자.

```js
$('div')
document.getElementsByTagName('div')
document.querySelector('div')
document.querySelectorAll('div')
```

뭔가 패턴이 보이는가? 난 `querySelector()`와 `querySelectorAll()` 만 사용해도 충분하다고 본다. CSS 스타일의 선택자를 사용할수 있다는 점은 매우 편리하고 (제이쿼리가 그렇게 사용하니깐) 무엇보다 **"일관성"**이 있기 때문이다. [IE8부터 지원](https://developer.mozilla.org/ko/docs/Web/API/Document/querySelector)하고 있으니 안심하고 사용해도 된다.

## 돔에서 데이터 얻기 

돔을 찾는 방법을 알았으니 이것으로 뭔가 해볼수 있을 것 같다. 먼저는 data 속성 (`data-*`) 값을 읽고 써보자. 

그전에 data 속성값을 왜 쓰는지 부터 짚고 넘어가야겠다. 

PHP나 Node.js의 서버는 데이터를 이용해서 HTML을 만든다. 예를 들어 상품명("Guitar") 같은 경우는 텍스트로 만들어 HTML 코드를 만든다. 이것 화면에 출력하기 위한 용도다.

한편 화면에 보이지는 않지만 프론트엔드 자바스크립트 로직에 사용할 데이터가 있다. (예를들어 "G123") 이 경우 data 속성 값을 사용할 수 있다. 

아래 코드를 보면 이해하는데 수월할 것이다.

```html
<div data-product-id="G123">Guitar</div>
```

이 값을 얻으려면 제이쿼리는 `data()` 함수를 사용한다.

```js
$('div').data('product-id')
```

그럼, 자바스크립트는?

```js
document.querySelector('div').dataset.productId // 'G123'
```

`querySelector()` 함수로 얻은 HTMLElement에는 `dataset`이라는 객체가 있고, 이걸 통해서 data 속성 값에 접근할 수 있다. HTML 코드에서는 케밥 케이스로 표기하고 JS 코드에서는 카멜 케이스라는 것이 다르다.

당연히 data 속성 값을 변경할 수도 있다.

```js
document.querySelector('div').dataset.productId = 'G456'
```

하지만 `dataset`은 IE 11 미만에서는 지원하지 않는다. data 속성 값을 다루기 위해서는 일반 속성에 접근하기 위한 함수 `getAttribute()`와 `setAttribute()` 함수를 사용해야 한다.

```js
document.querySelector('div').getAttribute('data-product-id') // 'G123'
```

## 이벤트

이제 이벤트 처리를 보자. 보통 자바스크립트의 시작점은 `ready()` 함수로 설정한다.

```js
$.ready(() => {)
  // start ...
})
```

그럼 자바스크립트는?

```js
document.addEventListener('DOMContentLoaded', () => {
  // start ...
})
```

HTML을 파싱한뒤 DOM 객체를 생성이 완료되면 'DOMContentLoaded' 이벤트가 발생한다. 우리는 이 이벤트에 리스너를 추가하는 방식으로 똑같이 구현할 수 있다.

클릭이벤트도 비슷하다. 제이쿼리부터 보자.

```js
$('a').on('click', evt => {
  // 이벤트 처리 ...
})
```

그럼 자바스크립트는? 

```js
document.querySelector('a').addEventListener('click', evt => {
  // 이벤트 처리 ...
})
```

뭐, 간단하다. 

한편 이벤트를 방출(emit)하는 것은 어떨까? 제이쿼리부터...

```js
$('a').click()
```

그럼 자바스크립트는?

```js
document.querySelector('a').click()
```

똑같은 `click()` 함수를 사용한다.

한편 커스텀 이벤트는 어떻게 사용할까? 제이쿼리는 이렇게 한다.

```js
$('a').trigger('@click')
```

`trigger()` 함수를 이용하면 새로 정의한 '@click' 이벤트를 방출하게 된다.

그럼 자바스크립트는?

```js
const evt = new CustomEvent('@click')
document.dispatchEvent(evt)
```

뭐 그렇게 어렵진 않다. `CustomEvent` 클래스로 이벤트 객체를 만들고 `document.dispatchEvent()`  함수로 이벤트를 방출한다. 이벤트와 더불어 데이터도 넘겨줄 수 있다.

```js
const evt = new CustomEvent('@click', {detail: 'some data'})
document.dispatchEvent(evt)
```

`CustomEvent` 생성시 두번째 인자로 `detail` 키를 갖는 객채만 넘겨주면 수신하는 측에서는 이 값을 사용할 수 있다. 문자열 뿐만 아니라 객체도 가능하다.

```js
document.querySelector('a').addEventListener('@click', evt => {
  evt.detail // 'some data'
})
```

하지만 IE11 이하 버전에서는 `CustomEvent`를 지원하지 않기 때문에 이벤트 생성하는 방법을 달리 해야한다.

```js
const evt = document.createEvent('CustomEvent')
evt.initCustomeEvent('@click', true, false, 'some data')
document.dispatchEvent(evt)
```

`document.createEvent()` 함수로 생성한 이벤트 객체의 `initCustomeEvent()` 함수로 이벤트 명과 전달할 데이터를 설정한다. 매개변수는 순서대로 이벤트명, 버블(bubble)?, 취송가능여부(cancelable)?, 전달할 데이터(detail)를 의미한다. 

## 스타일

돔 엘리먼트에 CSS 클래스를 추가하려면 어떻게 할까?

```js
$('#foo').addClass('active')
```

`addClass()` 로 'active' 클래스를 추가했다. 

그럼 자바스크립트는?

```js
document.querySelector('#foo').classList.add('active');
```

HTMLElement는 `classList`라는 DOMTokenList를 반환한다. 이것은 클래스를 추가하는 `add()` 함수 뿐만 아니라, `remove()`, `toggle()`, `contains()` 같은 유용한 메소드를 제공한다.

하지만 여전히 [IE에서는 메소드 별로 지원 버전이 다르다](https://developer.mozilla.org/ko/docs/Web/API/Element/classList). 때문에 폴리필을 추가하거나 다른 방법을 사용해야 한다.

```js
document.querySelector('#foo').className += ' active';
```

HTMLElement의 `className`은 클래스 이름이 저장된 변수다. 이 문자열을 조작하면 클래스명을 추가/제거할 수 있다.

## 문자열 변경

제이쿼리의 `text()` 함수로 제어하는 문자열은 HTMLElement의 `innerHTML`로 가능하다.

```js
$('#foo').text('Hello Chris')

document.querySelector('#foo').innerHTML = 'Hello Chris'
```

## 비동기 요청 

제이쿼리의 `ajax()` 함수를 이용하면 서버 측에 비동기 요청을 보낼수 있다. 

```js
$.ajax('/resource').then(success, fail)
```

그럼 자바스크립트는?

```js
const req = new XMLHttpRequest()
req.open('GET', '/resource', true);
req.onreadystatechange = () => {
  if (req.readyState === 4) {
    if (req.status === 200) success()
    else faile()
  }
}
req.send(null)
```

`XMLHttpRequest` 객체를 직접 사용하면 가능하다. GET, POST 뿐만 아니라 파일 업로드까지! 

최근에 나온 [fetch api](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API)를 사용해도 되지만 IE 브라우져 호완성이 필요하다면 라이브러리를 사용해야 한다. 제이쿼리의 [ajax()](http://api.jquery.com/jquery.ajax/) 함수나 노드 진영에서 많이 사용하는 [request](https://github.com/request/request) 그리고 Vue.JS에서 추천하는 [axios](https://github.com/axios/axios) 등이 대표적이다.

## 자바스크립트

돔 스크립트 뿐만아니라 자바스크립트 언어에 대해서도 알아야한다. 특히 컬렉션을 다루는 경우 제이쿼리의 유틸리티 함수를 사용했다면, ES5 부터 지원하는 컬렉션 함수는 쉽게 이해할 수 있을 것이다.

제이쿼리에서 여러 엘레먼트 배열을 순회할때는 `each()` 함수를 사용한다.

```js
$('li').each(() => {
  $(this) // li element
})
```

그럼 자바스크립트는?

```js
Array.from(document.querySelectorAll('li')).forEach(li => {
  
})
```

`querySelectorAll()` 함수는 유사배열을 반환한다. Array의 프로토타입 함수를 사용하려면 `Array.form()` 함수를 이용해서 유사배열을 배열로 변환해야한다. 이후에 `Array.protototype.foreEach()` 함수를 이용해 li 엘리먼트를 순회할 수 있다.

`Array.prototype`에는 `map()`, `reduce()`, `every()`, `some()` 등 [lodash](https://lodash.com/docs/4.17.4)같은 유틸리티 라이브러리에서 지원하는 컬렉션 함수가 있다.

객체 메소드도 살펴보자. 두 객체를 합칠때(merge) 제이쿼리는 `extend()` 함수를 사용한다. 

```js
const obj3 = $.extend(obj1, obj2)
```

그럼 자바스크립트는?

```js
const obj3 = Object.assign({}, obj1, obj2)
```

`Object.assign()` 함수를 이용해서 합친 새로운 객체를 만들어 낼수 있다. 

## 결론

지금까지 프론트엔드 개발에 제이쿼리는 필수였다. 크로스브라우져 이슈, 특히나 버전별 IE를 지원하는 것은 개발자에게 너무도 편리한 기능이다. 

하지만 기술은 계속 변한다. 앵귤러, 리엑트등 최신 UI 프레임웍을 사용할 때는 제이쿼리와는 다른 방법으로 접근한다. ES5, ES6에서 제공하는 자바스크립트 문법으로 대체해서 사용하고, 까다로운 UI 작업일 경우는 상대적으로 무거운 제이쿼리보다는 직접 DOM 스크립트를 이용하면 가볍게 구현할 수 있다. 

[2018 프론트엔드 로드맵](https://github.com/kamranahmedse/developer-roadmap)에 jQuery가 제외된걸 보면 기술은 변하고 있다는 말을 실감할 수 있을 것이다. 

![2018 프론트엔드 로드맵](/assets/imgs/2018/01/25/2018-frontend-roadmap.png)

참고
* [You Don't Need jQuery!](https://blog.garstasio.com/you-dont-need-jquery/) 
* [DOM을 깨우치다](http://www.yes24.com/24/Goods/11371306?Acode=101)
* [Can I Use](https://caniuse.com)


