---
title: Vuex, Vue-router, Axios를 이용한 SPA 인증 구현
layout: post
tags: vue
summary: 뷰JS로 싱글페이지 어플리케이션을 개발할때 필수 기능인 인증 플로우에 대한 설명입니다. 
---

웹 서비스를 개발할때 매번 등장하는 것이 바로 **"인증"**이다. 
사용자로부터 아이디, 비밀번호를 입력받아서 서비스 사용을 허가해 주는 기능으로 대부분의 서비스가 가지고 있는 기능이다.

로그인을 통해 인증한 뒤에는 권한에 따라서 각 페이지 접근할 수 있게된다.
이러한 권한에 관리는 라우팅시에 하는데, 권한이 있으면 요청한 화면을 보여주고 그렇지 않으면 적절하게 예외처리 하는 방식이다.

단일 페이지 어플리케이션, 일명 SPA에서는 프론트엔드 측에서 라우팅을 수행하기 때문에 인증도 프론트에서 처리해 주어야 한다.
뷰([Vue](https://kr.vuejs.org/index.html))JS를 선택했다면 
뷰 라우터([vue-router](https://router.vuejs.org/kr/))가 그 역할을 담당하게 될 것이다.

이글은 **뷰JS로 SPA를 개발할 때 인증 구현 방법**에 대해 정리한 내용이다.

![인증](/assets/imgs/2018/03/26/lock.jpg)

## API 준비 

먼저 인증 구현을 위한 3개의 API를 준비하겠다. 서버 기술은 Node.JS의 Express 프레임웍을 사용했다.

아래 저장소를 클론해서 확인해 보자. 

```bash
git clone https://github.com/jeonghwan-kim/vue-auth-sample.git
cd vue-auth-sample 
```

폴더는 server와 client로 분리했고 이 중 server 폴더가 API를 담당한다.<br />
server 폴더로 이동한 뒤 필요한 노드 모듈을 설치하고 서버를 구동해 보자.

```bash
cd server
yarn
yarn dev 
```

### 1) GET /home

메인 화면을 만들때 사용할 데이터를 얻는 API이다. 아래와 같은 형태로 응답하는데... 

```js
{
  greeting: String
}
```
 
문자열은 경우에 따라 두 가지로 응답한다.

로그인 전이면 "Hello Word"를, 로그인 후면 "Hello {Name}"으로 응답한다.<br />
인증 여부에 따라 다르게 응답하기 위해서 이렇게 구현했다. 

서버가 구동된 상태에서 API  요청을 위해 터미널 창을 하나 더 띄우자.  
Curl 명령어로 API를 요청해 보면

```bash 
curl -vs -X GET localhost:3000/home
...
{
  "greeting":"Hello World"
}
```

인증 정보 없이 보냈기 때문에 "Hello world"가 응답된다.

### 2) GET /me

두번째는 인증 후에만 접근할 수 있는 마이 페이지에서 사용할 API다. 
마이페이지에 출력할 데이터를 응답한다.

만약, 인증 정보가 없을 경우 HTTP 상태코드 401 Unauthorized 를 응답한다.

한번 요청해 보면... 

```bash 
curl -vs -X GET localhost:3000/me
...
< HTTP/1.1 401 Unauthorized
...
{
  "error":"No Authorization headers"
}
```

401 상태코드와 헤더 정보가 없다는 본문 메세지를 확인 할수 있다. 

### 3) POST /login {email, password}

마지막으로 로그인 할때 사용하는 API이다.
이메일과 비밀번호를 받아 accessToken을 발급해 주는 역할을 한다.
인증에 실패하면 401 Unauthorized를 응답한다.

요청해 보자.

```bash 
curl -vs -X POST localhost:3000/login -d 'email=test@test.com&password=123123'
...
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ…"
}
```

미리 설정한 이메일과 비밀번호로 로그인 API를 요청했고 엑세스 토큰(accessToken)이 발급되는 것을 확인했다.
인증정보를 잘못 보내면 401 Unauthorized 상태 값이 응답 될 것이다.

### 토큰을 들고 다시 API 요청

발급 받은 토큰을 들고 1), 2) API를 다시 요청해 보겠다.

```bash
curl -vs localhost:3000/home -H 'Authorization: Bearer eyJhbGciO...'
... 
{
  "greeting":  "Hello Chris"
}
```

로그인 전에 호출했을 때는 "Hello World"로 응답했지만, 
토큰을 들고 요청했을 때는 유저 이름이 포함된 "Hello Chris"가 응답되는 것이 차이점이다.

마이페이지 API도 인증 토큰을 들고 요청해 보면 

```bash
curl -vs localhost:3000/me -H 'Authorization: Bearer eyJhbGciO…'
...
{
  "user": {
    "id": 1,
    "name": "Chris",
    "email": "test@test.com",
    "password": "123123"
  },
  "accessLog": [
    {
      "userId": 1,
      "createdAt": "2018-03-26T01:32:17.419Z"
    }
  ]
}
```

로그인한 유저 정보를 응답한다. 접근 로그(accessLog)도 함께 출력한다.

여기까지 API에 대해 충분히 이해했으니 이제 본격적으로 뷰JS로 화면을 만들어 보자!! <br /> 
🏃🏃🏃‍

![시작](/assets/imgs/2018/03/26/ready-to-start.jpeg)

## 시작 코드

[vue-cli](https://github.com/vuejs/vue-cli/tree/master)의 simple-webpack 템플릿으로 시작하겠다.

```bash
vue init simple-webpack client
```

자동 생성된 코드를 정리한 뒤, [vue-router](https://router.vuejs.org/kr/essentials/getting-started.html)로 라우터를 만들고 

```js
// router/index.js

import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Me from '../components/Me.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/me',
      name: 'Me',
      component: Me,
      beforeEnter: requireAuth
    }
  ]
})
```

[Vuex](https://vuex.vuejs.org/kr/)로 스토어를 만든 뒤

```js
// store/index.js

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const resourceHost = 'http://localhost:3000'

export default new Veux.Store({
  state: {
    accessToken: null
  },
  getters: {

  },
  mutations: {
    LOGIN (state, {accessToken}) {
      state.accessToken = accessToken
    },
    LOGOUT (state) {
      state.accessToken = null
    }
  },
  actions: {
    LOGIN ({commit}, {email, password}) {
      return axios.post(`${resourceHost}/login`, {email, password})
        .then(({data}) => commit('LOGIN', data))
    },
    LOGOUT ({commit}) {
      commit('LOGOUT')
    },
  }
}) 
```

Vue에 추가한다.

```js 
// main.js

import App from './App.vue
import router from './router'
import store from './store'

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
```


## Home 화면 

사이트의 홈페이지를 그릴 **Home 컴포넌트**부터 만들겠다. 

```html
// components/Home.vue

<template>
  <div>
    <h2>Home</h2>
    <div>{%raw%}{{greeting}}{%endraw%}</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      greeting: ''
    }
  },
  created() {
    axios.get('http://localhost:3000/home')
      .then(result => this.greeting = result.data.greeting)
  }
}
</script>
```

HTTP 요청 라이브러리 [Axios](https://github.com/axios/axios)로 GET /home 리소스를 요청하고 그 결과를 화면에 보여준다. 
"Hello World" 메세지가 나오는데 이는 아직 인증하지 않았기 때문이다. 

![인증전 홈](/assets/imgs/2018/03/26/home-non-auth.jpg)

## Me 화면 

인증한 유저만 접근할수 있는 마이 페이지(Me 화면)를 만들어 보자. 

vue-router에는 [beforeEnter](https://router.vuejs.org/kr/advanced/navigation-guards.html)라는 인터셉터가 있는데 
라우팅 직전에 실행되는 함수다. 인터셉터 로직에 따라 라우팅을 계속 수행하거나 말거나 할수 있다. 

`requireAuth()` 함수를 추가해서 인증 여부에 따라 /me 라우팅을 결정하도록 하자. 
인증되지 않으면 마이페이지에 접근하지 않도록 하기 위해서다.  
 
```js
// router/index.js

const requireAuth = () => (from, to, next) => {
  const isAuthenticated = false
  if (isAuthenticated) return next()
  next('/login?returnPath=me')
}

export default new Router({
    /* 중략 */
    {
      path: '/me',
      name: 'Me',
      component: Me,
      beforeEnter: requireAuth()
    }
  ]
})
```

beforeEnter 인터셉터는 `from`, `to`, `next` 세 개 인자를 받는 함수다. 
이를 이용해 인증정보가 없을 경우 로그인 화면으로 리다이렉트 하도록 했다. 

현재는 인증되지 않았으므로 로그인 화면으로 이동한다. 

![로그인 화면](/assets/imgs/2018/03/26/login.jpg)


## Login 화면 

로그인 컴포넌트에 로그인 폼을 추가해 보자.

```html
// components/Login.vue

<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="onSubmit(email, password)">
      <input type="text" v-model="email" placeholder="Email Address">
      <input type="password" v-model="password" placeholder="Password">
      <input type="submit" value="Login">
    </form>
    <p><i>{{msg}}</i></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      msg: ''
    }
  },
  methods: {
    onSubmit(email, password) {
      
      // LOGIN 액션 실행 
      this.$store.dispatch('LOGIN', {email, password})
        .then(() => this.redirect())
        .catch(({message}) => this.msg = message)
    },
    redirect() {
      const {search} = window.location
      const tokens = search.replace(/^\?/, '').split('&')
      const {returnPath} = tokens.reduce((qs, tkn) => {
        const pair = tkn.split('=')
        qs[pair[0]] = decodeURIComponent(pair[1])
        return qs
      }, {})

      // 리다이렉트 처리 
      this.$router.push(returnPath)
    }
  }
}
</script> 
```

이메일과 비밀번호를 입력한 뒤 폼을 제출하면 스토어의 `LOGIN` 액션을 실행한다.
액션은 `dispatch()` 함수로 실행 하는데 email과 password 값을 함께 보낸다.

로그인에 실패하면 메세지를 보여주도록 했다.

스토어 파일을 좀 더 살펴보자. `LOGIN` 액션을 보자. 
로그인 API에 성공하면 `commit()` 함수를 이용해 스토어에 액세스 토큰을 저장한다.

```js
// sotre/index.js

actions: {
  LOGIN ({commit}, {email, password}) {
    return axios.post(`${resourceHost}/login`, {email, password})
      .then(({data}) => {

        // LOGIN 변이 실행 
        commit('LOGIN', data)
      })
  }
},

mutations: {
  LOGIN (state, {accessToken}) {

    // 스토어에 액세스 토큰 저장
    state.accessToken = accessToken
  }
}
```

다시 로그인 화면으로 돌아와서...

`LOGIN` 액션이 완료되면 `redirect()` 함수를 실행하는데, 
쿼리문자열에서 returnPath를 얻어내서 로그인 직전 화면으로 리다이렉트 하도록 처리했다.

이전과는 다르게 라우터의 `beforeEnter` 인터셉터를 통과한뒤 Me 화면에 접근할수 있게 되었다.

![마이 페이지](/assets/imgs/2018/03/26/me.jpg) 

## Me 화면 

GET /me API를 요청해서 응답 데이터로 Me 화면을 만들어 보자.

```html
// components/Me.vue

<template>
  <div>
    <h2>Me</h2>
    <div>
      <label>User Info:</label>
      <pre>{%raw%}{{user}}{%endraw%}</pre>
    </div>
    <div>
      <label>Access Log:</label>
      <div v-for="log in accessLog">{%raw%}{{log.userId}}, {{log.createdAt}}{%endraw%}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      user: null,
      accessLog: []
    }
  },
  created() {
    axios.get('http://localhost:3000/me')
      .then(({data}) => (this.user = data.user, this.accessLog = data.accessLog))
  }
}
</script>
```

Me 화면을 그리기 위해 GET /me 리소스를 요청 한뒤 응답이 오면 뷰모델을 만들도록 했다.

하지만 401 Unauthorization 응답이 왔다.

![401 에러](/assets/imgs/2018/03/26/401-error-in-console.jpg)

요청 헤더에 Authorization 필드가 비었기 때문이다. 

![인증 헤더 없음](/assets/imgs/2018/03/26/no-auth-header.jpg)

로그인에서 응답 받았던 토근정보를 요청헤더에 추가해야 한다.

구현 전에 잠시 생각해 보자... 

대부분의 API는 토큰 정보를 요구할 것이다. <br />
때문에 **로그인 이후 발생하는 모든 요청 헤더에 토큰값을 담아** 보내면 더 편할 것 같다.

[Axios 기본 설정값 설정](https://github.com/axios/axios#global-axios-defaults)으로 구현할 수 있다.

```js
// store/index.js

actions: {
  LOGIN ({commit}, {email, password}) {
    return axios.post(`${resourceHost}/login`, {email, password})
      .then(({data}) => {
        commit('LOGIN', data)
        
        // 모든 HTTP 요청 헤더에 Authorization 을 추가한다.   
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      })
  }
}
```

다시 한 번 로그인 한 뒤 마이페이지를 확인해 보자.

![인증 후 마이 페이지](/assets/imgs/2018/03/26/me-after-auth.jpg)


마침내 유저 정보와 액세스 로그가 화면에 출력 되었다!   

API 요청 헤더에도 토큰 정보가 설정 되어 있다.

![인증 헤더](/assets/imgs/2018/03/26/auth-header.jpg)

하지만 화면을 갱신하면? <br />
이런.. 다시 토큰정보가 날아갔다..

스토어에 저장된 토큰정보는 메모리에 있기 때문에 브라우져 화면을 갱신함과 동시에 날아가 버린다. 
영구적인 곳에 저장할 필요가 있다. 로컬 스토리지에 저장하겠다. 

```js
// store/index.js

mutations: {
  LOGIN (state, {accessToken}) {
    state.accessToken = accessToken

    // 토큰을 로컬 스토리지에 저장 
    localStorage.accessToken = accessToken
  }, 
```

`LOGIN` 변이에서 토큰값을 스토어에 저장함과 동시에 로컬스토리지에 accessToken이란 키에도 추가로 저장한다.

화면을 갱신할때 이 로컬 스토리지에 저장된 토큰을 axios 헤더에 설정하는 로직도 추가한다.

```js
// store/index.js

const enhanceAccessToeken = () => {
  const {accessToken} = localStorage
  if (!accessToken) return
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}
enhanceAccessToeken() 
```

다시 한 번 로그인한 뒤 마이페이지에 진입하자. <br />
그리고 리프레시! <br />
오케이, 로컬스토리지에 저장된 토큰이 API 요청 헤더에 담겨서 전송된다.


## 로그아웃

로그아웃은 비교적 간단하다.
상단 메뉴의 로그아웃 버튼 클릭시 실행하는 함수 `onClickLogout()`을 만든다.


```html
// components/Menus.vue

<template>
  <div>
    <router-link to="/">Home</router-link>

    <a href="" v-if="isAuthenticated" @click.prevent="onClickLogout">Logout</a>
    <router-link to="/login" v-else>Login</router-link>

    <router-link to="/me">Me</router-link>
  </div>
</template>

<script>
  import store from '../store'
  
  export default {
    computed: {
      isAuthenticated() {
        return store.getters.isAuthenticated
      }
    },
    methods: {
      onClickLogout() {
        // LOGOUT 변이 실행 후 리다이렉트 
        store.dispatch('LOGOUT').then(() => this.$router.push('/'))
      }
    }
  }
</script>
```

`onClickLogout()` 함수는 `LOGOUT` 액션을 실행한뒤 메인 페이지로 라우팅한다.

액션과 변이 함수도 로그아웃 처리를 해 주자.


```js 
actions: {
  LOGOUT ({commit}) {
    // HTTP 요청 헤더값 제거 
    axios.defaults.headers.common['Authorization'] = undefined
    commit('LOGOUT')
  },
},
mutations: {
  LOGOUT (state) {
    // 토큰 정보 삭제  
    state.accessToken = null
    delete localStorage.accessToken
  },
}
```

`LOGOUT` 액션은 axios 헤더 값을 초기화하여 이후 API 요청에는 토큰 정보를 포함하지 않도록 했다.
`LOGOUT` 뮤테이션은 스토어에 저장된 accessToken 값을 초기화하고 로컬스토리지 값을 삭제한다. 

## 정리  

Vuex와 Vue-Router 그리고 Axios를 이용해서 SPA 인증을 구현해 봤다.

**Vuex**는 서버에서 받은 인증 정보 즉 액세스 토큰을 관리하는 역할을 한다. 
비동기 로직을 담당한 액션 함수에서 인증 API를 호출하고 그 결과를 변이 함수 호출로 위임한다.
변이 함수는 토큰 값을 스토어에 저장한다. 그리고 영구 저장을 위해 로컬 스토리지에 추가로 저장했다.

**Vue-Router**는 라우팅 변경이 일어날때마다 beforeEnter 함수를 먼저 실행한다.
이때 Vuex에 저장된 토큰정보를 기반으로 인증 여부를 체크한다.
인증이 완료되면 해당 페이지로 라우팅 시키고 그렇지 않을 경우 로그인 페이지로 이동토록 하였다.
물론 인증이 필요한 페이지에 한해서 말이다. 

마지막으로 **Axios**는 요청 헤더에 토큰 정보를 추가하는 역할을 한다.
어플리케이션 구동시에는 로컬스토리지에 저장된 토큰을 읽어 요청 헤더에 설정 하기도 한다.
  
참고

* [깃헙 vuex-router-auth0-example](https://github.com/Ridermansb/vuex-router-auth0-example)
* [깃헙 vuejs2-authentication-tutorial](https://github.com/auth0-blog/vuejs2-authentication-tutorial)
* [Persisting user authentication with Vuex in Vue
]()https://medium.com/front-end-hacking/persisting-user-authentication-with-vuex-in-vue-b1514d5d3278)
* [Vuejs 2 Authentication Tutorial](https://auth0.com/blog/vuejs2-authentication-tutorial/)
