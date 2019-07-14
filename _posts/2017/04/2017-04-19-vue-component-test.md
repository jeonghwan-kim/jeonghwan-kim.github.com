---
title: Vue 글로벌 컴포넌트 테스트
layout: post
category: dev
permalink: vue/2017/04/19/vue-component-test.html
tags:
  vuejs
  test
---


뷰js의 장점 중 하나는 기존의 프로젝트에 점진적으로 적용할 수 있다는 점이다. 이것은 앵귤러나 리액트를 사용해 본 사람이라면 쉽게 납득할 수 있을 것이다.

앵귤러 2를 사용하려면 타입스크립트를 알아야 한다. 프레임웍이기 때문에 프로젝트 전체 설계를 앵귤러 식으로 변경해야하는 큰 작업이다. 리액트는 ES6, JSX, 웹팩, 바벨 등 새롭게 공부해야할 기술이 한 두 가지가 아니다.

반면 뷰js는 어떤가? 물론 뷰js도 온갖 신기술을 활용한 웹 어플리케이션을 만들어 낼 수 있다. 반드시 그렇게 시작해야 하는게 아니다. 가이드 문서의 헬로월드 코드가 잘 보여주고 있다. 당장 사용하려면 빌드 툴, 새로운 언어 같은 기술이 필요없다. 그동안 사용해 왔던 웹 기술위에서 조용히 동작하는 녀석이 뷰js다.

![vue-logo](/assets/imgs/2017/04/19/vue-logo.png)


## 왜 글로벌 컴포넌트를 테스트 하는가?
유닛 테스트 관점에서 바라보자. 테스트에 대한 가이드 문서는 좀 부족하다( [단위 테스팅 — Vue.js](https://kr.vuejs.org/v2/guide/unit-testing.html) ). 단일파일 컴포넌트 테스트 방법 설명하고 있다. 운영중인 프로젝트에 뷰js를 도입할라치면 이런 기술을 녹여내기가  마당찮다.

때문에 템플릿과 뷰 컴포넌트가 분리된 형태로 사용해야 하고 글로벌 컴포넌트로 등록하여 사용하게 되었다. 이런 구조 상에서 테스트 하는 방법이 필요했다. 문서에는 잘 나와 있지 않은 글로벌 컴포넌트 테스트 방법에 대해 정리한 글이다.

## 테스트 환경 구성
테스트 방법을 이해하기 위해 개발 환경을 좀더 설명하자면,

* 기존에 운영중인 프로젝트는 php 기반이다
* 모놀리틱 웹 페이지로 구성된다
* 라우팅마다 리소스를 별도로 로딩한다 (SPA가 아닌 MPA이다)

각 페이지에서는 뷰js 라이브러리와 이를 이용한 뷰 컴포넌트 파일을 로딩하는 구조다. 뷰 컴포넌트는 모두 글로벌 컴포넌트로 등록한 뒤 사용한다.

테스트는 자스민과 카르마로 구성한다. ([자스민으로 프론트엔드 테스트 코드 작성하기](/tool/2017/03/28/jasmine.html) 참고)

테스트 환경 구성후 section-title이란 컴포넌트를 만들어 보겠다. 문자열을 넘겨주면 타이틀 형식으로 출력하는 컴포넌트다.

app.js:
```js
Vue.component('section-title', {
  template: '#section-title',
  props: ['title']
});
```

index.html:
```js
<div id="app">
  <section-title title="제목1"></section-title>
</div>

<script id="section-title" type="text/x-template">
  <h2>{{title}}</h2>
</script>

<script src="node_modules/vue/dist/vue.js"></script>
<script src="app.js"></script>
```

글로벌 컴포넌트로 등록한 section-title은 템플릿으로  `#section-title` 선택자를 사용하고 이것은 index.html에 script 태그로 선언했다. title 속성에 문자열을 넘겨주면 h2 태그로 감싼 엘레먼트를 생성할 것이다. `<section-title title="제목1">` 형식으로 사용할 수 있다.

컴포넌트를 테스트 해보자.

test/appSpec.js
```js
describe('<section-title>', ()=> {
  it('뷰 모델을 생성한다',()=>{
    const SectionTitle = Vue.component('section-title');
    const vm = new SectionTitle().$mount();
    expect(vm).not.toBe(null);
  });
});
```

컴포넌트 등록시 사용한 `Vue.component()` 함수는 파라매터 1개만 전달하면, 등록한 컴포넌트 이름을 문자열로 넘겨주면, 등록한 컴포넌트 생성자 함수를 불러온다( [Vue Component](https://kr.vuejs.org/v2/api/#Vue-component) ).  new 키워드로 인스턴스를 만들고 $mount() 함수로 템플릿에 마운트시켜 뷰모델을 만들어 낼수 있다. 마지막 라인은  뷰모델이 유효한지 검증하는 코드다.

하지만 카르마로 실행하면 아래와 같은 에러 메세지가 뜬다.

```
ERROR: '[Vue warn]: Cannot find element: #section-title '
ERROR: '[Vue warn]: Template element not found or is empty: #section-title
(found in <Root>)'
ERROR: '[Vue warn]: Failed to mount component: template or render function not defined.
(found in <Root>)'
```

section-title 컴포넌트가 마운팅할 대상 즉  `#section-title` 셀렉터로 템플릿을 찾을 수 없다는 의미다.  이것은 단일 컴포넌트가 아니라 템플릿과 뷰 컴포넌트가 분리된 파일에 있다. 템플릿 역할을 하는 html 파일도 테스트 환경에 로딩하는 과정이 필요하다. 테스트의 픽스쳐(fixture)를 이용해 템플릿 파일을 로딩할 수 있다.

### 템플릿 픽스쳐 로딩

> 픽스쳐란 테스트를 위해 필요한 모든 자원을 뜻한다.

카르마에서는 html, json 파일같은 픽스쳐를 테스트 환경에 로드해 주는 플러그인이 있다.  karma-fixture라는 플러그인을 사용하겠다( [GitHub - billtrik/karma-fixture: A plugin for the Karma test runner that loads .html and .json fixtures](https://github.com/billtrik/karma-fixture) ) .

`npm i karma-fixture --save-dev` 로 다운로드하고 카르마 환경설정 파일인 karma.config.js 파일에 플러그인 로딩을 설정한다.

karma.config.js:
```js
frameworks: ['jasmine', 'fixture'], // fixture 추가
files: [
  // 픽스처 로딩
  'src/index.html',
],
preprocessors: {
  // html을 js로 변경
  '**/*.html': ['html2js']
},
```

프레임워크에 fixture를 추가한다. 테스트에 필요한 파일을 로딩하는데 픽스쳐 파일 경로도 추가한다.  마지막으로 전처리를 해야하는데 html 코드를 자바스크립트로 변경해야 한다. 전처리 후에는 window 객체를 통해 텍스처 엘레맨트에 접근할 수 있는데 자바스크립트로 작성하는 테스트 코드에서 window 객체를 통해 픽쳐스에 접근할 수 있다 . html2js는 html 코드를 window.__html__ 에 html 엘레먼트 형식으로 변환하여 추가한다.  `npm i karma-html2js-preprocessor --save-dev` 명령어로 html2js를 다운로드 한다.

여기까지가 픽스처 사용을 위한 카르마 설정이다. 다음은 window.__html__에 로딩한 텍스처 객체를 테스트 케이스에 로딩하는 단계다. 아래 추가한 테스트 코드를 보자.

```js
describe('<section-title>', ()=> {
  const SectionTitle = Vue.component('section-title');

  beforeEach(()=> {
    // 텍스쳐 로딩
    fixture.setBase('src');
    fixture.load('index.html');
  });

  // 로딩한 텍스쳐 제거
  afterEach(()=> fixture.cleanup());

  it('뷰 모델을 생성한다',()=>{
    const vm = new SectionTitle().$mount();
    expect(vm).not.toBe(null);
  });
});
```

beforeEach 훅에서 픽스처를 로딩한다. setBase() 함수로 텍스쳐 루트 경로를 설정하고 곧 이어 load() 함수로 테스트에 필요한 텍스처 파일을 로딩한다. load() 함수는 window.__html__에 설정한 텍스처 객체를 로딩할 것이다.

돌아다니는 샘플 코드를 보면 대부분 픽스쳐를 위한 경로를 따로 가져간다. 아마도 테스트 전용 html을 별도로 관리하는 것 같다. 이 부분은 제대로 픽스쳐의 용도를 이해한 것인지 의문이 남는다.

이전 테스트와는 다르게 $mount() 함수를 호출하면 뷰 컴포넌트는 마운팅한 템플릿을 정상적으로 찾은 뒤 뷰 모델을 생성한다. 뷰 모델의 not.toBe() 매쳐로 검증했다.

여기까지가 컴포넌트 테스트를 위한 환경설정이다. 이후 부터는 몇 개 테스트 시나리오늘 가지고 뷰 컴포넌트 테스트 방법에 대해 소개하겠다.

## 속성 테스트: 내가 준 props 값을 잘 사용하고 있는가?

section-title을 제대로 테스트하려면 title 속성으로 넘겨준 값을 제대로 렌더링 하는지까지 확인해야 한다. 그 동안 컴포넌트를 인스턴스를 만들때는 html 코드에서 선언했고 필요하면 속성 값을 함께 설정했다. 아래 코드처럼 말이다.

```html
<section-title title="타이틀1"></section-title>
```

그러나 자스민으로 작성하고 있는 테스트 코드는 자바스크립트다. section-title을 자스민에서 테스트하려면 자바스크립트로 section-title 인스턴스를 만들수 있어야 한다.

이전 섹션에서도 잠깐 봤겠지만 컴포넌트 생성자 함수를 이용할수 있다. new 키워드로 생성한뒤 $mount() 함수를 호출하면 컴포넌트 인스턴스를 만들수 있다. 속성값을 추가하려면 생성자의 파라매터 객체중 **propsData**에 키/밸류 쌍으로 넘기면 속성을 전달할 수 있다. ( [Best way to pass data to a component · Issue #64 · vuejs/Discussion · GitHub](https://github.com/vuejs/Discussion/issues/64))

```js
const title = '타이틀1';
const vm = new SectionTitle({
  propsData: {
    title: title
  }
}).$mount();
```

이렇게 만든 뷰모델은 vm.$el 객체를 통해 돔 엘레먼트에 접근할 수 있다. 이제 돔 API로 테스트 대상을 찾아 바인딩된 데이터를 검증할 수 있다.

```js
const expectedText = vm.$el.childNodes[0].textContent;
expect(expectedText).toBe(title);
```


## 비동기/이벤트 테스트: 사용자 인터렉션을 제대로 처리하고 있는가?
컴포넌트 데이터를 업데이트하고 나면 이 데이터와 바인딩된 부분에 바로 반영되지 않는다. 뷰 라이프 사이클이 동작해야 변경된 데이터가 돔에 반영되는데 앵귤러, 리엑트와 비슷한 방식이다.

![vue-component-lifecycle](/assets/imgs/2017/04/19/vue-component-lifecycle.png)

뷰 라이프 사이클에 의존하는 테스트는 비동기로 처리해야 한다. 자바스크립트에서 비동기는 setTimer()를 사용하거나 노드에서는 process.nextTick()을 사용한다. 뷰js도 비슷한 이름의 **$nextTick()** 함수를 사용한다. 내부적으로는 setTimeout(function, 0) 으로 구현되어 있다. ( [vue/env.js at a150317324fec0968edd66dc434eaff7a4bc065a · vuejs/vue · GitHub](https://github.com/vuejs/vue/blob/a150317324fec0968edd66dc434eaff7a4bc065a/src/core/util/env.js#L65))

search-form 컴포넌트를 만들어 보겠다. 인풋요소에 버튼이 두 개 있고 검색어를 입력한 뒤 검색 버튼을 눌러 사용한다. 초기화 버튼을 클릭하면 입력한 검색어를 제거한다. 아래는 컴포넌트 생성 코드다.

```js
Vue.component('search-form', {
  template: '#search-form',
  data: function () {
    return { query: '' };
  },
  computed: {
    isEmptyQuery: function () {
      return this.query.length === 0;
    },
  },
  methods: {
    onSearch: function () {
      this.$emit('search', {query: this.query});
    },
    onReset: function () {
      this.query = '';
    }
  }
});
```

입력한 문자열을 저장하는 용도로 query 데이터를 설정했다. 검색어 유무에 반응하는 버튼을 만들기 위해 isEmptyQuery라는 계산된 속성을 추가했는데 템플릿 코드에서 버튼의  disabled 속성과 바딩할 것이다. 메소드는 두 가지다. 검색 버튼의 클릭 이벤트 핸들러인 onSearch는 부모 컴포넌트로 'search' 이벤트를 발생시키고 입력한 검색어를 담은 객체를 넘겨준다. 초기화 버튼의 클릭 이벤트 핸들러인 onReset은 query 문자열을 초기화한다.

컴포넌트와 연결된 템플릿 코드는 아래와 같다.

```html
<script id="search-form" type="text/x-template">
  <form name="searchForm" @submit.prevent="onSearch">
    <input name="query" type="text" v-model.trim="query" />
    <button type="submit" :disabled="isEmptyQuery">검색</button>
    <button type="button" :disabled="isEmptyQuery" @click="onReset">검색</button>
  </form>
</script>
```

이것을 사용하는 것은 간단하다.
```html
<search-form @search="onSearch"></search-form>
```

하지만 내가 하고 싶은것은 자동화된 테스트다.  테스트 항목은 이렇다.

* 검색 문자열을 입력하면 검색 버튼의 disabled 속성이 제거된다.
* 초기화 버튼 클릭시 인풋 필드 값을 빈 문자열로 초기화한다.
* 검색 버튼 클릭시 search 이벤트를 발생한다.

첫 번째 요구사항부터 테스트 해보겠다.

### 검색 문자열을 입력하면 검색 버튼의 disabled 속성이 제거된다

세 가지 테스트는 모두 검색어가 입력된 상황을 가정하고 진행된다. 훅에서 미리 설정하는 것이 코드 중복을 방지하는 방법이다. beforeEach() 함수에서 뷰모델을 이용해 문자열을 입력한다.

```js
describe('<search-form>', ()=> {
  // 픽스처 로딩

  describe('검색 문자열을 입력', ()=> {
    let insertedText;

    beforeEach(done => {
      insertedText = 'abc';
      vm.query = insertedText; // 입력 문자 설정

      // 뷰 라이프사이클에 의해 다음 코드 실행 시점에 데이터가 반영된다.
      vm.$nextTick(()=> {
        expect(vm.query).toBe(insertedText);
        done();
      });
    });
  });
});
```

설정한 문자열은 뷰 컴포넌트 라이프사이클을 거치기 때문에 다음 코드 실행시에 데이터가 돔에 반영된다. 뷰모델의 $nextTick() 함수의 콜백함수에서 입력한 데이터를 검증했다.

텍스트를 입력하면 검색 버튼에 설정한 disabled 속성이 제거 되었지는 확인하는 코드다.

```js
it('검색 버튼의 disabled 속성이 제거된다', () => {
  const searchBtn = vm.$el.querySelectorAll('button')[0];
  expect(searchBtn.getAttribute('disabled')).toBe(null);
});
```

뷰모델의 $el 객체는 돔 엘레먼트를 담고 있어서 돔 API로 원하는 요소에 접근할 수 있다. querySelectorAll() 함수로 갬색 버튼을 찾아 getAttribute() 함수로 disabled 속성이 제거 되었는지 검증했다.

### 초기화 버튼 클릭시 인풋 필드 값을 빈 문자열로 초기화 한다

검색어가 입력된 뒤 초기화 버튼을 클릭한 상황을 코드로 묘사해야한다. $el 객체를 통해 돔API로 클릭 이벤트를 발생할 수 있다. ( [How can I trigger a JavaScript event click - Stack Overflow](http://stackoverflow.com/questions/2381572/how-can-i-trigger-a-javascript-event-click))

```js
it('초기화 버튼 클릭시 인풋 필드 값을 빈 문자열로 초기화한다', done => {
  const resetBtn = vm.$el.querySelectorAll('button')[1];
  resetBtn.click(); // 클릭 이벤트 발생

  // 뷰 라이프사이클에 의해 다음 코드 실행 시점에 클릭한 결과가 반영된다.
  vm.$nextTick(() => {
    const expectedText = '';
    expect(vm.query).toBe(expectedText);
    done();
  });
});
```

버튼 요소의 click() 함수 실행은 뷰 라이브사이클에 따라 다음 코드 실행시에 이벤트 핸들러 함수가 동작한다. $nextTick() 함수의 콜백함수에서 이를 검증할 수 있는데 여기서는 검색어가 비어있는지 검증했다.

### 검색 버튼 클릭시 search 이벤트를 발생한다.
검색어 입력 후 검색 버튼을 클릭하면 search-form 컴포넌트는 임의로 정한 search 이벤트를 발생한다. 검색 버튼의 click 이벤트 핸들러로 onSearch를 바인딩했는데 이 함수는 뷰 모델의 $emit() 메소드를 사용해서 이벤트를 발생시킨다. 이벤트와 더불어 입력한 검색어를 담은 객체 {query: this.query}도 전달한다.

```js
onSearch: function () {
  this.$emit('search', {query: this.query});
},
```

여기서 테스트 하고 싶은 것은 검색 버튼을 클릭했을 때 search 이벤트와 관련 데이터를 부모 컴포넌트로 전달하냐는 것이다. 함수 호출 여부를 검증하기 위해서는 스파이 객체를 이용한다. 뷰 모델은 $on() 메소드를 이용해 특정 이벤트에 핸들러 함수를 바인할수 있는 방법이 있다. 핸들러 함수 대신 스파이 객체를 전달해서 테스트할 수 있다.

```js
it('검색 버튼 클릭시 search 이벤트를 발생하고 검색 데이터를 전달한다', done => {
  const searchBtn = vm.$el.querySelectorAll('button')[0];
  const spy = jasmine.createSpy('onSearch'); // 스파이 함수 생성
  vm.$on('search', spy); // 뷰모델의 search 이벤트와 spy 함수 바인딩

  searchBtn.click(); // 버튼 클릭

  // 뷰 라이프사이클에 의해 다음 코드 실행 시점에 클릭한 결과가 반영된다.
  vm.$nextTick(() => {
    const expectedObj = {query: insertedText};

    // 스파이 함수가 실행되었고 검색어 데이터가 전달되었는지 검증한다.
    expect(spy).toHaveBeenCalledWith(expectedObj);
    done();
  });
});
```

자스민의 createSpy() 함수로 스파이 함수를 만들어 뷰모델의 search 이벤트와 연결했다. 그리고 버튼 객체의 click() 함수로 이벤트를 발생시킨다. 실제 이벤트는 $nextTikc()에 전달한 콜백함수 실행시에 발생한다. search 이벤트와 바인딩된 스파이 함수가 호출된것을 자스민의 toHaveBeenCalledWith() 로 체크하고 데이터가 전달되었는지도 확인할 수 있다.

## 결론
HTML이나 PHP로 작성한 템플릿 파일과 컴포넌트 파일이 나눠진 컴포넌트를 테스트해 봤다. 자바스크립트가 아닌 템플릿을 테스트 환경에 로딩해 주어야 하는데 카르마 픽스처 플러그인으로 해결했다.

테스트를 위해 사용한 뷰js의 API는 다음과 같다.

* Vue.component(): 등록한 글로벌 컴포넌트의 생성자 함수를 가져온다
* vm.$mount(): 컴포넌트에 템플릿을 마운트한다.
* vm.$el: 마운팅된 컴포넌트의 돔 엘레멘트다
* vm.$nextTick(): 컴포넌트 라이프 사이클에 맞춰 비동기 작업에 쓰인다
* vm.$on(): 컴포넌트에 이벤트와 핸들러 함수를 바인딩 한다.

사용한 전체 코드는 다음 깃 저장소에서 확인할 수 있다.

* [GitHub - jeonghwan-kim/vue-unit-test](https://github.com/jeonghwan-kim/vue-unit-test)
