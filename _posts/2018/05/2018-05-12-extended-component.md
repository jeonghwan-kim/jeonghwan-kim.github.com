---
title: UI 컴포넌트 확장
layout: post
category: dev
permalink: 2018/05/12/extended-component.html
tags: vuejs
summary: DRY한 코드를 유지하기 위한 Vue 컴포넌트 확장 방법에 대해 알아봅니다.
---

![brand image](/assets/imgs/2018/05/12/lego.jpg)

하나의 서비스를 만들다보면 다양한 디바이스에에 동작하는 어플리케이션을 만들어야할 때가 있다.
핸드폰, 테블릿 그리고 데스크탑까지 화면 크기에 따라 다른 컨텐츠와 레이아웃을 제공해야하는 경우가 그렇다.
방법은 두 가지.

> "반응형"과 "분리된 도메인"

**반응형**은 CSS 미디어쿼리 기반으로 디바이스 크기에 따라 스타일시트를 다르게 적용하는 방식이다.
반면 디바이스에 따라 **각 도메인으로 라우팅 하는 방식**도 있는데, 페이스북이나 네이버 같은 경우가 이런 방식을 사용한다.

![페이스북 - 데스크탑 버전](/assets/imgs/2018/05/12/fb-pc.jpg)<br />
<small>-페이스북 데스크탑 버전-</small>

![페이스북 - 모바일 버전](/assets/imgs/2018/05/12/fb-mobile.jpg)<br />
<small>-페이스북 모바일 버전-</small>

두 가지 모두 장단점이 있지만 이 글에서 다룰 후자의 방법은 성능과 유연함이라는 장점을 가지고 있다.

그러나 데스크탑 버전과 모바일 버전의 코드를 두 벌로 유지해야 하는 것은 상당한 부담이다.
하나의 수정이 있을 경우 두 군데 모두 작업해야 하기 때문이다.
반복적인 일은 매우 지난한 일이다.

데스크탑과 모바일 두 가지 버전으로 웹페이지를 개발할 때 어떻게 효율적으로 코드를 관리할 수 있을지 노하우를 정리했다.
이것이 베스트 프렉티스라고 말하긴 어렵지만 코드 절약과 쉬운 유지보수의 경험은 적잖이 재미있는 일이었다.

## OLOO 위임 패턴

"You Don't Know JS" 저자로 유명한 카일 심슨은 그의 책 "this와 객체 프로토타입, 비동기와 성능"에서 클래스 패턴의 한계를 지적한다.
대안으로 자기가 정의한 OLOO 패턴을 주장한다.
OOP를 충분히 지원할 수 없는 자바스크립트에서 장황한 클래스 패턴보다는 객체 위임 패턴,
이른바 OLOO(Object Linked to Other Object)로 구현하는 것이 간단 명료하다는 것이다.

이를 이용해서 데스크탑과 모바일에서 동작하는 코드를 재활용 가능한 방법으로 구현해 보자.

## 모바일 버전

먼저 모바일 버전의 포스트 목록 화면을 만들어 보겠다. 목록 출력을 위한 postView 모듈은 아래와 같이 작성한다.

```js
// mobile/postsView.js

const postsView = {
  init (el) {
    if (!el) throw Error('el')
    this.el = el
    this.data = []
    return this
  },
  setData (data) {
    this.data = data
    return this
  },
  render () {
    this.el.innerHTML = this.html()
  },
  html () {
    return this.data.reduce((html, post) => {
      html += `
        <h2>${post.title}</h2>
        <article>${this.text(post.text)}</article>
       `
      return html
    }, '<div>') + '</div>'
  },
  text (post) {
    return post.substring(0, 100) + '...'
  }
}

export default postsView
```

postsView는 포스트 목록을 출력하는 역할을 하는 모듈이다.
이미 정의된 데이터를 이용해 HTML에서는 아래와 같이 사용할 수 있다.

```js
// mobile/index.html
import postView from './postView.js

postsView.init(document.querySelector('#app'))
api.fetch().then(data => {
  postView.setData(data).render()
})
```

![결과 화면](/assets/imgs/2018/05/12/mobile-result-1.jpg)<br />
<small>-모바일 결과화면-</small>

## 데스크탑 버전

동일한 로직인데 UI만 다른 PC 버전은 어떻게 구현할 수 있을까?
따로 구현하지 않고 **모바일 버전의 postsView를 재활용하는 것이 핵심**이다.

```js
// pc/postsView.js
import postsViewMobile from '../mobile/postsView.js'

const postsView = Object.create(postsViewMobile)

// 오버라이딩: 포스트 문자열을 반환하는 text() 함수로
// 모바일은 100문자를 반환했지만 PC 버번은 300문자를 반환한다.
postsView.text = function (post) {
  return post.substring(0, 300) + '...'
}

export default postsView
```

`Object.create()` 함수는 프로토타입 객체를 이용해 기존 객체를 복제하는 ES6 함수다.
이를 이용해 모바일 버전의 postView 객체를 복제했다.

PC에서는 로직은 같고 화면 출력 부분만 다르기 때문에 이 역할을 하는 `text()` 함수만 새로 정의하면 된다.
그러면 렌더링시 프로토타이핑 체이닝에 의해 PC 버전의 `text()` 함수가 실행되고 모바일 버전의 `text()` 함수는 가려지게 된다.
일종의 자바스크립트에서의 **함수 오버라이딩**이다.

![결과 화면](/assets/imgs/2018/05/12/pc-result-1.jpg)<br />
<small>- PC 결과화면 -</small>

모바일에서는 100자만 출력한 반면 PC에서는 300자를 출력한 것이 다르다.


## 컴포넌트 확장

컴포넌트를 사용하는 경우는 어떻게 구현할 수 있을까?

리액트나 뷰의 경우 컴포넌트 기반으로 구현하는 경우가 많은데,
모바일 버전의 컴포넌트를 어떻게 데스크탑 버전으로 확장할 수 있을까?
각 프레임웍은 이름은 다르지만 이를 위한 몇 가지 방법을 제공한다.

Vue.js에서는 믹스인과 컴포넌트 생성 옵션을 이용해 컴포넌트를 확장하는 수단을 제공한다.<br />
(아마 리엑트도 있겠지?)

## Vue 컴포넌트 - 모바일 버전

먼저 모바일 버전의 Vue 컴포넌트를 만들어 보자.

```js
// vue-mobile/PostComponent.js
import api from '../api.js'

export default {
  template:
    `<div>
    <small v-if="fetching">Loginding...</small>
    <section v-else v-for="post in posts">
      <h2>{{post.title}}</h2>
      <article>{{post.text | excerpt}}</article >
    </section>
  </div>`,

  data () {
    return {
      posts: [],
      fetching: false
    }
  },

  created () {
    this.fetch()
  },

  filters: {
    excerpt (val) {
      console.log('mobile:filter:exceprt')
      return val.substring(0, 100) + '...'
    }
  },

  methods: {
    fetch() {
      this.fetching = true
      api.fetch().then(data => {
        this.fetching = false
        this.posts = data
      })
    },
  }
}
```

이전에 만든 버전과 거의 유사하다.
API 요청시 fetching 상태를 이용해 "Loading..." 메세지를 추가했고,
뷰에 맞게 텍스트 출력을 한 excerpt 필터 함수를 사용한 점이 다르다.

PostsList 컴포넌트는 아래와 같이 사용할 수 있다.

```js
// vue-mobile/index.html
<div id="app"></div>

<script>
  import PostList from './PostList.vue'

  new Vue({
    el: '#app'
    render: h => h(PostList)
  })
</script>
```

![결과 화면](/assets/imgs/2018/05/12/mobile-result-1.jpg)<br />
<small>- Vue - 모바일 결과화면 -</small>

## Vue 컴포넌트 - 데스크탑 버전

모바일 버전의 뷰 컴포넌트를 PC에서는 어떻게 재활용 할수 있을까?
두 가지 방법이 존재한다.

> "믹스인"과 "extends"

**믹스인**은 컴포넌트 설정 생성시 사용하는 옵션 객체를 미리 정의한 뒤, `Vue.extend()` 함수 파라매터 객체의 mixins 속성으로 전달한다.
이렇게 생성된 컴포넌트들은 동일한 옵션 객체를 갖는다.

한편 **extends** 옵션은 기존 객체를 확장하는 방식이다.
우리는 이미 모바일 버전의 PostList 컴포넌트를 만들었기 때문에 이를 확장하는 extends 옵션을 사용해서 구현해 보겠다.

```js
// vue-pc/PostsComponent.js
import PostsComponent from '../vue-mobile/PostsComponent.js'

export default {
  extends: PostsComponent
}
```

모바일 버전의  PostsComponent 를 확장한 PC 버전의 컴포넌트를 만들었다.

이걸 그대로 사용하면 모바일 버전과 똑같은 결과가 나온다.
위에서 했던 것과 마찬가지로 Mobile에서 글자수를 100자만 보여줬던 것을 PC에서는 글자수 300개를 보여주려고 한다.
이를 담당하는 `excerpt()` 필터함수를 오버라이딩 하면 되겠다.

```js
// vue-pc/PostsComponent.js
filters: {
  excerpt (val) {
    return val.substring(0, 300) + '...'
  }
}
```

## 컴포넌트 병합 전략

**데이터,  컴퓨티드, 메소드, 필터는 완벽히 오버라이딩 된다.**
즉 확장된 컴포넌트에서 동일한 이름으로 함수를 재정의하면 기존 함수가 가려져 덮어 씌워지는 효과가 있다.
로그를 찍어 확인해 보자.

```js
// vue-mobile/PostsComponents.vue
filters: {
  excerpt (val) {
    console.log('mobile:filter:exceprt')
    return val.substring(0, 100) + '...'
  }

// vue-pc/PostsComponents.vue
filters: {
  excerpt (val) {
    console.log('pc:filter:exceprt')
    return val.substring(0, 300) + '...'
  }
```

모바일은 로그가 찍히지 않고 PC 컴포넌트만 로그를 확인할 수 있다.

```bash
pc:filter:exceprt
```

한편, **라이프사이클 훅은 순서대로 모두 호출된다.**
기본 컴포넌트의 라이프사이클 훅이 실행된 뒤 확장된 컴포넌트의 라이프사이클이 훅이 순서대로 호출된다.<br />
이것도 로그로 확인해 보자.

```js
// vue-mobile/PostsComponents.vue
created () {
  console.log('mobile:created')
}

// vue-pc/PostsComponents.vue
created () {
  console.log('pc:created')
}
```

모바일 컴포넌트, PC 컴포넌트 순으로 `created()` 훅이 실행되는 것을 알 수 있다.

```bash
mobile:created
pc:created
```

## 컴포넌트 확장 활용

이러한 컴포넌트 확장 특징을 어떻게 적용해 볼 수 있을가?

위 리스트 예제를 계속 이어가는게 좋겠다.
* 모바일의 경우 아래로 스크롤 하면 추가로 목록을 로딩 해보자.
* 반면 데스크탑은 페이제네이션을 이용해 추가 목록을 확인할 수 있다.

코드를 재활용하는 방법을 유지하면서 컴포넌트 확장 방법으로 구현해 보자.

먼저 모바일 버전이다. 스크롤을 감지하여 추가 데이터를 패치한다.

```js
// vue-mobile/PostsComponents.vue
created () {
  this.fetch()
  this.enableScroll()
},

methods: {
  enableScroll() {
    window.addEventListener('scroll', () => {
      console.log('load more')
    })
  }
}
```

스크롤 할때 마다 로그가 찍힌다.

```bash
load more
load more
load more
load more
...
```

이를 확장한 PC용 컴포넌트에서는 페이지네이션을 보여줘야한다.<br />
어떻게 구현할 수 있을까?

```js
// vue-pcPostsComponents.vue
created () {
  this.setPagination()
},

methods: {
  enableScroll() {
    // Overriding: NOP
  },
  setPagination() {
    console.log('setPagination')
  }
},

template:
  `<div>
    <small v-if="fetching">Loginding...</small>
    <section v-else v-for="post in posts">
      <h2>{{post.title}}</h2>
      <article>{{post.text | excerpt}}</article>
    </section>
    <div ref="pagination">1, 2, 3</div>
</div>`,
```

`created()` 훅은 모든 두 컴포넌트에서 순서대로 호출된다.
모바일 컴포넌트에서 실행한 `fetch()`와 `enableScroll()` 함수가 모두 실행될 것이다.
하지만 PC 컴포넌트에서 `enableScroll()`  함수는 불필요하다.
우리는 스크롤 감지로 추가 패치를 하는 것이 아니기 때문이다.

따라서 이 함수를 빈 함수로 오버라이딩한다.
`methods`는 extends로 확장하면 완벽히 가려지기 때문이다.

대신에 페이지네이션을 위한 작업인 `setPagination()`을 실행할 수 있다.

`template`의 경우 모바일 버전과 한 문자라도 차이가 있다면 모두 다시 정의해야 한다.
기존 템플릿 문자열과 페이지네이션을 위한 `div` 엘레맨트를 추가했다.

![결과 화면](/assets/imgs/2018/05/12/vue-pc-result-1.jpg)<br />
<small>- Vue - PC 결과화면 -</small>


## 결론

반응형 웹이 아닌 PC, 모바일 코드를 각각 유지해야 하는 경우 코드 재활용 방법에 대해 정리해 봤다.

`Object.create()` 함수로 기존 모듈을 복제해서 모든 기능을 그대로 사용할 수 있다.
기능을 재정의 해야할 경우 함수를 오버라이딩 하는 방법으로 구현할 수 있었다.

Vue 컴포넌트도 컴포넌트를 확장하여 복제하는 방법을 제공하는데 믹스인과 extends 생성 옵션이다.

믹스인은 둘 다 하나의 공통 객체를 둔 상태에서 여러 컴포넌트가 이를 공유하는 방식이다.

extends 생성 옵션은 기존 컴포넌트가 있는 상태에서 이를 확장하는 방법이다.

Vue 내부의 머지 전략에 따라 대부분의 기능은 오버라이딩 된다.
단 라이프사이클 훅은 순서대로 모두 호출되는 것이 다른 점이다.

Vue의 이러한 특징을 적절히 사용하면 적은 코드로 두 가지 플래폼에서 동작하는 코드를 만들 수 있다.
적은 코드인 만큼 유지보수에도 적잖은 도움이 될수 있었다.

참고 문서
* [Vue Mixins](https://kr.vuejs.org/v2/guide/mixins.html)
* [Vue extends](https://kr.vuejs.org/v2/api/#extends)
* [Extending VueJS Components](https://medium.com/js-dojo/extending-vuejs-components-42fefefc688b)
* [Extending Vue Components with Mixins](https://scotch.io/tutorials/extending-vue-components-with-mixins)