---
title: VueJS 폼 검증
layout: post
category: dev
permalink: 2018/05/31/vue-form-validation.html
tags: [vuejs]
summary: VueJS 폼 검증 방법에 대한 내용을 살펴 봅니다
---

![logo](/assets/imgs/2018/05/31/vue-form-validation-logo.jpg)

웹 서비스를 개발할때 사용자 인터랙션이 가장 많은 부분이 **폼 필드**다.
단순한 로그인 화면부터 어드민의 복잡한 상품 등록 화면까지 폼은 사용자의 입력을 받아 서버로 전달하는 역할을 한다.

이 데이터가 API를 통해 서버로 전달되고 일련의 검증 과정을 마친후 비로소 데이터베이스에 들어가는 흐름이다.
입력 데이터 검증을 서버측에서 수행하지만 API를 태우기 전에 프론트 단에서 먼저 검증하는 것이 **네트웍 비용 감소**와 **사용성 개선**이라는 측면에서 좋다.

그렇기 때문에 잘못된 입력에 대해 프론트엔드가 먼저 이를 감지하고 적절한 메세지로 사용자를 안내하는 것이 사용자로 하여금 서비스에 접근하는데 중요한 역할을 한다고 볼 수 있다.

프론트엔드 프레임웍에서는 폼 개발을 중요한 영역으로 취급하고 손쉽게 접근할수 있는 방법을 제공한다. 예를 들어 앵귤러는 `ngForm`이라는 디렉티브를 이용해 폼검증에 사용할 수 있다. (앵귤러 1의 ngForm에 대한 간단한 사용법은 [여기](/tags.html#ngform)를 참고)

VueJS도 마찬가지인데 이번 글에서는 **VueJS로 폼 검증하는 방법**에 대해서 다뤄보겠다.

## 가장 손쉬운 방법

Vue 인스턴만 이용해 간단히 폼을 검증해 볼 수 있다. 이름 입력 필드를 만드는 것으로 시작하자.
```html
<form @submit.prevent="onSubmit">
  <input v-model="name">
  <p v-if="errorBag.name">{{errorBag.name[0]}}</p>
  <button type="submit">Submit</button>
</form>
```

입력을 위해 `name` 데이터를 사용하고, 입력 에러를 위한 `errorBag` 객체를 사용했다.
errorBag.name 키가 있을 경우, 즉 입력 에러가 있을 경우 첫번째 에러 문자열을 출력한다.
그리고 제출 버튼을 클릭하면 `onSubmit()` 메소스를 실행한다.

Vue 인스턴스를 살펴볼까?
```js
export default {
  data () {
    return {
      name: '',
      errorBag: { name: [] }
    }
  },
  watch: {
     name (val) {
       this.errorBag.name = validator.validate('name', val)
     }
   },
  methods: {
     onSubmit () {
       this.errorBag.name = validator.validate('name', this.name)
     }
  }
}
```

입력 필드와 양방향 연결되어 있는 `name()` 감시자를 만들었다. validator.validate() 메소드로 입력한 값을  검증한다.

마찬가지로 폼을 제출할때 실행할 `onSubmit()` 메소드에서도 동일하게 검증하고 결과를 errorBag.name에 저장한다.

validator 객체는 어떻게 구현할수 있을까?
```js
export default {
  validate (key, val) {
    const errors = []

    if (!val) {
      errors.push(`${key} field is required`)
    } else {
      if (val.length < 3) {
        errors.push(`${key} filed should have length of 3`)
      }
    }

    return errors
  }
}
```

검증을 수행하는 `validate()` 메소드는 필드명 key와 입력값 val 변수를 인자로 받는다.

두 단계의 검증 절차가 있는데
* 먼저는 값 입력 여부를 체크한다. 입력값이 없을 경우 에러 문자열을 배열에 추가한다
* 그리고나서 입력 문자열의 길이를 체크한다. 3자 미만이면 에러 문자열을 배열에 추가한다

마지막엔 이 에러 문자열이 담긴 배열을 반환하는 로직이다. <br />
(전체 코드는 [깃헙의 watch 브랜치](https://github.com/jeonghwan-kim/blog-vue-validate/tree/watch)를 참고)

결과를 확인해 보면 다음과 같다.

|-|-|
|![step1](/assets/imgs/2018/05/31/step1.jpg)<center><small>-초기상태-</small></center>|![step2](/assets/imgs/2018/05/31/step2.jpg)<center><small>-제출 버튼 클릭할 경우-</small></center>|
|![step3](/assets/imgs/2018/05/31/step3.jpg)<center><small>-입력하기 시작할 경우-</small></center>|![step4](/assets/imgs/2018/05/31/step4.jpg)<center><small>-3자 이상 입력할 경우-</small></center>

이런 방법은 입력 필드 갯수가 적을때 빠르고 간단하게 검증할 수 있는 장점이 있다. <br />
(자세한 방법은 [Vue 가이드 문서](https://kr.vuejs.org/v2/cookbook/form-validation.html)를 참고)

하지만 입력 데이터를 감시하는 것과 제한된 검증자는 기능 확장에 다소 제한적이라고 생각되지 않나?

## 디렉티브로 만드는 방법

폼 검증을 재활용할수 있도록 코드 개선해 보자. 입력 엘러멘트에 접근하기 때문에 **Vue 디렉티브**로 제공되면 좋을 것 같다.

이런식으로 사용할 생각이다.
```html
<form @submit.prevent="onSubmit">
  <input name="name" v-model="name" v-validate="'required|minLen3'">
  <p v-if="errorBag.name">{{ errorBag.name[0] }}</p>
  <button type="submit">Submit</button>
</form>
```

`v-validate` 디렉티브에 검증자 정보를 문자열 `"required|minLen3"` 형태로 전달하면 선언적 마크업의 모습과 어울린다.

곧장 디렉티브 코드를 작성해 보자.
```js
export default {
  validate: {
    bind (el, binding, vnode) {
      validator.setup(el.name, binding.expression, vnode.context)
    },

    update (el, binding, vnode) {
      const key = el.name
      const errors = validator.validate(key, el.value)
      const s = JSON.stringify

      if (s(errors) === s(vnode.context.errorBag[key])) return

      if (errors.length) {
        vnode.context.$set(vnode.context.errorBag, key, errors)
      } else {
        vnode.context.$delete(vnode.context.errorBag, key)
      }
    }
  }
}
```

디렉티브는 몇 개 훅을 제공한다.

> bind() → inserted() → update() → unbind()

순으로 호출되는데 각 포인트마다 폼 검증을 위한 작업을 추가해서 넣어 봤다.

`bind()` 함수에서는 입력한 검증자 문자열을 파싱하여 사용하기 편하도록 준비한다.
validator.setup()  메소드가 그 역할을 하는데
* 필드 이름인 el.name("name")
* 검증 문자열 binding.expression("required`|`min3")
* 입력한 문자열 el.value

를 인자로 전달한다.

뷰 인스턴스의 데이터의 변화에 컴포넌트 라이브사이클이 구동되고 그 안에 사용한 디렉티브도 갱신되는데, 이때 실행되는 훅이 `update()` 함수다.
아이디어는 이 시점에 입력 값을 검증하는 것이다.

* validateor.validate(key, el.value) 실행 결과, 에러 문자열이 담긴 배열이 반환되는데 이 결과를 뷰 인스턴스의 데이터에 갱신한다
* 물론 에러가 없을 경우는 해당 객체를 삭제한다
* 만약 기존 에러 객체와 같은 경우는 무시한다

검증 역할을 하는 validator 객체도 조금 바꿔야 한다.
```js
const validateFns = {
  required (key, val) {
    if (!val) {
      return `${key} is required`
    }
  },
  minLen3 (key, val) {
    if (!val || val.length < 3) {
      return `${key} should have more than 3 letters`
    }
  }
}

const validator = {
  init () {
    this.errors = {}
    this.validates = new Map()
    return this
  },

  setup (key, expression) {
    const validates = expression.replace(/'/g, '').split('|')
    this.validates.set(key, validates)
  },

  validate (key, value) {
    const validates = this.validates.get(key)
    const errors = validates
        .map(v => validateFns[v](key, value))
        .filter(v => !!v)
    return errors
  }
}

export default validator.init()
```

먼저 검증하는 함수를 각각 만들어`validateFn` 객체의 메소드 형태로 만들었다. 입력한 값을 검증한 후 에러 문자열을 반환하는 동작을 한다.

validator 객체에는 메소드 두 개를 더 추가했다.

* `init()` 은 검증결과를 저장한 errors 객체와 검증자를 관리할 validates를 맵으로 초기화하는 코드다
* 디렉티브 생성시 `setup()`을 호출하는데 디렉티브에 전달한 검증자 문자열을 파싱하여 validates 맵에 준비해 놓는 역할을 한다

required와 minLen3만 검증하는 기존의 제한적인 validate() 메소드를 좀 더 유연하게 개선했다.
validates 맵에서 검증자를 가져와 해당하는 검증함수를 validateFn에서 찾아 호출하고 에러 문자열을 배열로 반환한다.

이를 사용하기 위한 컴포넌트 코드를 살펴보자.
```js
import directives from './MyDirectives'
import validator from './validator'

export default {
  directives,
  data () {
    return { name: '', errorBag: {} }
  },
  methods: {
    onSubmit() {
      const errors = validator.validate('name', this.name)

      if (errors) {
        this.$set(this.errorBag, 'name', errors)
      } else {
        this.$delete(this.errorBag, 'name')
      }
    }
  }
}
```

컴포넌트에서 v-directive를 사용하려면 객체 생성인자 `directives`로 방금 만든 디렉티브 코드를 전달해야 한다.

폼 제출 후 onSubmit() 에서는 validator.validate() 메소드로 입력값을 검증하고 결과를 errorBag에 갱신한다.

이때 `this.$set()` 함수를 사용한 점이 중요하다.
errorBag의 name 은 초기화 되어 있지 않기 때문에 단순히 `this.errorBag.name = errors` 코드로는 변경을 감지하지 못한다.

**이를 극복하기 위한 수단이 `$set`, `$delete` Vue 전역 함수**다. 이 함수로 상태를 갱신함으로써 Vue가 데이터의 변화를 감지하도록 하고 컴포넌트 렌더링 사이클를 돌릴수 있는 것이다. <br />
(전체 코드는 [깃헙의 directive 브랜치](https://github.com/jeonghwan-kim/blog-vue-validate/tree/directive) 참고)

결국 화면에 에러 문구가 출력된다.

## 플러그인으로 만드는 방법

디렉티브로 개선했음에도 불구하고 몇 가지 눈에 거슬리는 코드가 보인다.
* errorBag은 폼 검증을 위한 v-validate 디렉티브와 더 관련 있어 보인다. 컴포넌트 코드와는 다른 분위기다
* onSubmit() 함수도 마찬가지. errorBag을 갱신하는 코드를 다른 곳으로 옮겨야하지 않을까?

**Vue 플러그인**은 이러한 역할을 수행하는데 안성맞춤이다. 이 부분을 플러그인 코드로 옮겨보자.
```js
import MyDirectives from './MyDirectives'
import validator from './validator'

export default {
  install (Vue) {
    Vue.directive('validate', MyDirectives.validate)

    Vue.mixin({
      data() { return { errorBag: {} } }
    })
  }
}
```

컴포넌트에서 디렉티브를 등록 부분을 플러그인으로 옮겼다. 나중에 플러그인만 설정하면 디렉티브까지 자동으로 로딩하게될 것이다.

믹스인(mixin)은 컴포넌트에 옵션 객체를 추가할수 있는 방법이다. 컴포넌트 생성시 데이터나 계산된 속성 따위를 여기서 정의할 수 있는데, 여기서는 errorBag 데이터를 옮겨놨다.

이어서 계산된 속성도 추가한다.
```js
computed: {
  $errors () {
    const errorBag = this.errorBag || {}

    return {
      has(key) { return !!errorBag[key] },
      first(key) { return errorBag[key][0] }
    }
  },

  $validator () {
    const context = this

    return {
      validateAll() {
        for (const key of validator.validates.keys()) {
          const errors = validator.validate(key, context[key])

          if (errors.length) context.$set(context.errorBag, key, errors)
          else  context.$delete(context.errorBag, key)
        }
      }
    }
  }
}
```

$errors와 $validator 계산된 속성을 추가했다.

`$errors`는 has()와 first() 메소드로 구성된 객체를 반환하는데 `has()`는 errorBag에서 특정 필드의 검증 결과 유무를 반환하고 `first()`는 첫번째 에러 메세지를 반환한다. 뷰 컴포넌트의 템플릿에서는 계산된 속성이 반환하는 메소드를 통해 에러 메세지를 출력할 용도로 쓰인다.

한편 `$validator` 속성은 `validateAll()` 함수를 갖는 객체를 반환하는데 이건 입력 폼을 모두 검증해서 errorBag에 결과를 저장한다. validator 객체를 통해 검증 대상과 검증자를 모두 가져와 에러를 체크한다. 결과는 errorBag에 담아둔다.

플러그인은 루트 컴포넌트 생성시 설정한다.
```js
import Vue from 'vue'
import MyPlugin from './MyPlugin'
import App from './App.vue'

Vue.use(MyPlugin)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

`Vue.use(MyPlugin)` 하나의 코드로 줄었다. 이것으로
* v-validate 디렉티브를 등록하고
* 에러를 담는 errorBag 데이터를 만들고
* 템플릿 출력을 위한 $errors와 onSubmit()에서 호출할 $validator 계산된 속성을 추가한다

결국 컴포넌트 코드를 이렇게 절약할 수 있다.
```html
<template>
  <div id="app">
    <form @submit.prevent="onSubmit">
      <input type="text" name="name" v-model="name" v-validate="'required|minLen3'">
      <p v-if="$errors.has('name')">{%raw%}{{ $errors.first('name') }}{%endraw%}</p>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return { name: '' }
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll()
    }
  }
}
</script>
```

입력 필드에는 v-validate 디렉티브로 어떤 검증자를 둘것인지 선언적으로 표현했다.

에러 문구는 errors 계산된 속성의 반환 객체를 이용해 has()로 에러 여부를 체크하고 first() 로 첫번째 에러 메세지를 출력한다.

마지막으로 폼제출시 실행되는 onSubmit()에서는 $validator 계산된 속성의 validateAll() 함수로 입력 필드 검증을 수행한다.

어떤가? 훨씬 읽기 쉬운 코드다. (전체 코드는 [깃헙의 plugin 브랜치](https://github.com/jeonghwan-kim/blog-vue-validate/tree/plugin) 참고)

## vee-validate

이러한 흐름의 연장선으로 [vee-validate](https://baianat.github.io/vee-validate/) 라이브러리를 이해했으면 좋겠다.
(사실 여기까지가 이글에서 말하고 싶은 점이다)

![vee-validate](/assets/imgs/2018/05/31/vee-validate.jpg)

Vue에서 폼 검증시 가장 많이 사용하는 이 툴은 플러그인 형태로 제공되기 때문에 `Vue.use()`로 설치한다.
```js
import Vue from 'vue'
import VeeValidator from 'vee-validate'

Vue.use(VeeValidator)
```

그리고 나서 컴포넌트에서는 이렇게 사용할 수 있다.
```html
<template>
  <div id="app">
    <form @submit.prevent="onSubmit">
      <input type="text" name="name" v-model="name" v-validate="'required|min:3'">
      <p v-if="errors.has('name')">{%raw%}{{errors.first('name')}}{%endraw%}</p>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return { name: '' }
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll()
    }
  }
}
</script>
```

우리가 구현했던 플러그인과 사용방법과 대동소이하다.
(v-validate의 검증자 설정하는 부분만 조금 다르다: "minLen3" → "min:3")

구체적인 사용법은 [공식 문서](https://baianat.github.io/vee-validate)와 [Vue 한국 사용자 모임](http://vuejs.kr/vue/vee-validate/2017/04/01/using-vee-validate/)에서 친절하게 설명해 준다.
(전체 코드는 [깃헙의 페이지](https://github.com/jeonghwan-kim/blog-vue-validate/) 참고)

## 결론

사용자 입력을 직접 처리하는 부분인 폼은 입력 데이터에 대한 검증을 선제적으로 체크해야 하는 부분이다. 지금까지 VueJS를 이용한 입력 필드 검증 방법에 대해 단계적으로 살펴 보았다.

* 매우 단순한 입력 필드라면 **뷰 인스턴스만을 이용해서 데이터 기반으로 구현**할 수 있다.
* 복잡한 입력 필드와 검증 조건이 필요하다면 **디렉티브와 플러그인 형태**로 구현해서 사용할 수 있다. 이러한 방법이 코드를 재사용하는 DRY한 방법이기 때문이다.
* 뿐만아니라 이미 이러한 형태로 구현해 놓은 **써드파티 라이브러리**를 찾는 것이 더 효율적일수 있는데 vee-validate 가 대표적이다.