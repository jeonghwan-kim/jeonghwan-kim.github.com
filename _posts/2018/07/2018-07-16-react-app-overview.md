---
title: React로 만든 프로젝트 톺아보기
layout: post
category: dev
permalink: 2018/07/16/react-app-overview.html
tags:
  react
summary: create-react-app부터 react-saga까지 리액트에서 사용하는 기술을 알아보니다
---

![logo](/assets/imgs/2018/07/16/react-logo.png)

최근 이직 후 리액트(React.js) 기반의 어드민 사이트를 만질수 있는 기회가 생겼다. AE(Account Executive)가 사용하는 서비스로 광고 캠페인을 관리하고 효율을 모니터링 할 수 있는 인하우스 어플리케이션이다.

업무 파악겸 리액트 기반의 프로젝트에서는 어떤 기술을 사용하는지 프로젝트에서 사용한 기술을 중심으로 정리해 보았다.

![logo](/assets/imgs/2018/07/16/dashboard.png)

## Create-react-app

ES6, JSX 기술로 구현된 리액트는 직접 웹팩 설정을 구성하여 빌드 환경을 만들어야 한다. 반면 터미널 기반의 코드 제너레이터를 사용하면 이러한 설정을 자동으로 만들어주는데 **[create-react-app](https://github.com/facebook/create-react-app)**이 바로 그러한 도구다. 뷰js 진영의 vue-cli 와 달리 매우 서술적인 이름이 인상적이다.

```
$ npm i -g create-react-app // 설치
$ create-react-app          // 코드 스케폴드 생성
$ npm start                 // 개발 서버 실행
```

npm으로 설치하고 코드 스캐폴딩을 만든 뒤, 개발 서버를 구동하면 아래와 같은 샘플 어플리케이션이 브라우져에 로딩된다.

![logo](/assets/imgs/2018/07/16/create-react-app-result.png)

이 스캐폴딩을 기반으로 간단한 대쉬보드 사이트를 만들어 보겠다.
샘플코드에서 불필요한 부분은 모두 제거하고 아래 코드만 남겨두었다.

```
src
 |-- components
 |   |-- App.js
 |-- index.js
 |-- index.css
```

src/index.js 는 어플리케이션의 엔트리 포인트 역할을 하는데 리액트 루트 컴포넌트를 DOM에 마운팅 하는 역할을 한다.

```js
// src/index.js

import React form 'react'
import ReactDom from 'react-dom'
import './index.css'
import App from './components/App'

ReactDom.render(
  <App />,
  document.querySelector('#root')
)
```

코드 하단에 보면 JSX 문법을 사용하는데 리액트 라이브러리를 로딩하면 이를 해석할 수 있다. 루트 컴포넌트 App을 돔에 마운트하기 위해서는 react-dom 라이브러리의 redner() 함수를 사용한다.  index.css 는 css-loader에 의해 처리되는데 이 모든 것이 create-react-app이 제공해 주는 환경이다. 👍

루트 컴포넌트로 넘어가 보자.

```js
// src/components/App.js

import React, { Component } from 'react'

class App extends Component {
  render() {
    return <h1>App</h1>
  }
}

export default App
```

리액트 라이브러리에서 Component 클래스를 가져와 상속하는 방식으로 App 컴포넌트를 만들수 있다. 화면을 그려주는 render() 메소드를 구현해 컴포넌트를 어떻게 보여줄지 JSX 로 기술했다.

이렇게 하면 브라우져는 App 컴포넌트를 아래처럼 그리게 되는 것이다.

![logo](/assets/imgs/2018/07/16/simple-app-result.png)

## React-app-rewired

create-react-app은 복잡한 웹팩 설정을 감춰주기 때문에 프로젝트를 깔끔하게 시작할 수 있는 장점이 있다. 하지만 직접 웹팩 설정을 변경해야 하는 경우가 있는데 `npm run eject` 명령어를 사용하는 방법을 제공한다. 명령어를 실행하면 node_modules/react-script 폴더에 감춰놓은 온갖 웹팩 설정 파일들을 프로젝트 루트 폴더에 풀어 놓는다.

하지만 어떤 경우에는 create-react-app이 만들어주는 깔끔한 환경을 유지하고 싶을 수도 있다. 이때 사용하는 것이 **[react-app-rewired](https://github.com/timarney/react-app-rewired)**다. 이 툴로 만든 프로젝트는 웹팩 설정을 덮어쓰는(overriding) 하는 방식으로 개발 환경을 개선할 수 있다.

사실 내가 맡은 프로젝트가 이 react-app-rewired로 시작한 것이다. less-loader를 추가하기위해 react-app-rewired와 react-app-rewire-less를 함께 사용했다.

```js
// config-overrides.js

const rewireLess = require('react-app-rewire-less')
module.exports = (config, env) => rewireLess(config, env)
```

## React-router

SPA로 동작하는 이 프로젝트는 **[react-router](https://reacttraining.com/react-router/)**를 통해 브라우져 라우팅을 구현했다.

리액트 라우터는 웹과 리액트 네이티브를 위한 각각의 라이브러리를 지원하는데 (react-router-dom, react-router-native) 여기서는 [react-router-dom](https://github.com/ReactTraining/react-router)을 사용했다.

```
$ npm i react-router-dom
```

설정 방식의 vue-router와 달리 컴포넌트를 이용한 **"선언적(declarative)"** 방식으로 설정하는 것이 차이다.

각 경로에 해당하는 컴포넌트들을 components 폴더에 미리 준비했다.

```
src
 |-- components
 |   |-- App.js
 |   |-- Home.js   // "/"
 |   |-- About.js  // "/about"
 |   |-- Topics.js // "/topics"
 |   |-- Topic.js  // "/topics/:topicId
 |-- index.js
 |-- index.css
```

먼저 루트 컴포넌트에서 라우팅을 정의해 보자.

```js
// src/components/App.js

import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Topics from './Topics'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/topics">Topics</Link></li>
          </ul>
          <hr />
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
        </div>
      </BrowserRouter>
    )
  }
}
```

BrowserRouter 컴포넌트로 감싼뒤 라우팅 로직을 시작할 수 있다.

Lint 컴포는트는 라우트 링크를 만드는 역할을 하는데 to 속성에 이동 경로를 설정한다.

그리고 나서 아래 보면 Route 컴포넌트를 사용하는데 path 속성에 라우팅 경로를, component 속성에는 해당 경로에 렌더링할 컴포넌트를 세팅하는 방식이다. 즉 About 링크를 클릭하면 /about 경로로 이동하는 동시에 About 컴포넌트를 보여주는 방식이다.

아래처럼 브라우저 상에서 라우팅이 동작할 것이다.

![react-router-result-1](/assets/imgs/2018/07/16/react-router-result-1.png)
![react-router-result-2](/assets/imgs/2018/07/16/react-router-result-2.png)

세번째 메뉴를 클릭하면 보여주는 Topics 컴포넌트는 다른 컴포넌트와 달리 하위 경로를 가지고 있다.

* /topics/rendering
* /topics/components
* /topics/props-v-state

루트 컴포넌트에서 이미 라우팅을 선언했지만, /topics 경로에서 렌더링되는 Topics 컴포넌트에 추가로 라우팅을 선언할 수 있다.

```js
// src/components/Topics.js

import React from 'react'
import { Route, Link } from 'react-router-dom'
import Topic from './Topic';

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route exact path={match.url} render={() => <h3>Please select a topic.</h3>}
    />
  </div>
)

export default Topics
```

리액트 라우터에 의해 라우터 전달인자를 받은 Topics 컴포넌트는 match.url를 통해 자신이 렌더링 될때의 경로 값을 알 수 있다. 여기서는 "/topics" 문자열이 변수를 통해 전달될 것이다. 이 값을 가지고 한 번 더 라우팅을 선언할 수 있는데 코드 하단의 `Route` 컴포넌트를 사용한 부분이다.

"/topics/:topicId" 경로를 설정하기 위해 Route 컴포넌트의 path 속성에 경로를, component 속성에는 Topic 컴포넌트를 전달했다. Topic 컴포는트는 topicId 라는 부분을 동적으로 받게될 것이다.

```js
<Route path={`${match.url}/:topicId`} component={Topic} />
```

하위 라우팅이 없을 경우는 다음 h3 태그로 이뤄진 컴포넌트를 보여준다.

```js
<Route exact path={match.url} render={() => <h3>Please select a topic.</h3>} />
```

Topic 컴포넌트는 다음과 같이 topicId 값을 출력하는 단순한 동작을 하도록 했다.

```js
// src/components/Topic.js

import React from 'react'

const Topic = ({ match }) => <h3>{match.params.topicId}</h3>

export default Topic
```

세번째 메뉴인 Topics 링크를 클릭하면 아래와 같이 중첩 라우팅이 동작하는 것을 확인할 수 있다.

![react-router-result-3](/assets/imgs/2018/07/16/react-router-result-3.png)
![react-router-result-4](/assets/imgs/2018/07/16/react-router-result-4.png)
![react-router-result-5](/assets/imgs/2018/07/16/react-router-result-5.png)
![react-router-result-6](/assets/imgs/2018/07/16/react-router-result-6.png)
![react-router-result-7](/assets/imgs/2018/07/16/react-router-result-7.png)


## Redux

Vue도 마찬가지지만 Flux 아키텍처를 따르는 React는 Redux라는 상태관리 솔류션을 사용한다.

리덕스는 단독으로 사용할수 있어서 굳이 리액트가 아니어도 동작한다.
이 프로젝트에서는 리덕스-리액트의 간편한 연동을 위해 [react-redux](https://github.com/reduxjs/react-redux)를 함께 사용했다.

```
npm i redux react-redux
```

상태관리를 위한 전역 저장소를 **"스토어"**라고 하는데 redux의 createStore 함수로 만들 수 있다.

리액트 어플리케이션이 스토어에 접근하기 위해서는 루트 컴포넌트에 이를 넣어주어야 하는데, react-redux의 Provider 컴포넌트가 그러한 역할을 하는 녀석이다.

```js
// src/index.js

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import dashboardApp from './store'

const store = createStore(dashboardApp) // 스토어 생성

ReactDom.render(
  <Provider store={store}> // 리액트 어플리케이션에 스토어를 연결한다
    <App />
  </Provider>,
  document.querySelector('#root')
)
```

createStore함수에 전달한 dashboardApp 인자는 어떻게 구성된 객체일까? 먼저 스토어를 위한 폴더 구조를 만들자.

```
src
 |-- components
 |-- store        // 스토어 폴더
 |   |-- index.js // 여러개 리듀서를 하나로 병합한다
 |   |-- user.js  // 액션 타입, 액션 생성자, 리듀서 정의
 |-- index.js
 |-- index.css
```

store 폴더에 적당한 기준으로 파일을 만들어 관련 코드를 넣는다.
예를 들어 유저 상태를 관리하기 위한 store/user.js 파일을 만들어 보겠다.

```js
// src/store/user.js

// 액션 타입
export const FETCH_USER = 'user/FETCH_USER'
// ...

// 액션 생성자
export const fetchUser = () => ({ type: FETCH_USER })
// ...

// 초기 상태
const initialSatate = {
  users: [],
  isEditing: false,
  editingUser: {}
}

// 리듀서
export default (state = initialSatate, action) => {
  switch(action.type) {
    case FETCH_USER: // ...
    default:
      return state
  }
}
```

스토어에서 사용하는 유저 관련 "액션"과 "액션 생성자 함수" 그리고 "리듀서"를 정의했다.

분류에 따라 user.js 뿐만아니라 다른 파일도 만들 수 있는데, 이를 하나의 스토어로 조합해 주는것이 리덕스의 combineReducers 함수의 역할이다.

```js
// src/store/index.js

import { combineReducers } from 'redux'
import user from './user'

export default combineReducers({
  user,
})
```

리액트에서 좀 특이한건 모든 컴포넌트가 스토어에 직접 접근하지는 않는 것이다. 그렇게 할 수도 있겠지만) 리덕스를 만든 Dan Abramov는 역할에 따라 컴포넌트를 분리하고 상태가 있는 컴포넌트(컨테이너)가 스토어와 커뮤니케이션 하도록하라고 가이드한다. (참고: [Presentational and Container Component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0))

그래서 component 폴더와 별개로 container 폴더도 추가했다.

```
src
 |-- components     // 프리젠테이셔널 컴포넌트
 |   |-- UserList.js
 |-- containers     // 컨테이너 컴포넌트
 |   |-- VisibleUserList.js
 |-- store
 |   |-- index.js
 |   |-- user.js
 |-- index.js
 |-- index.css
```

유저 스토어를 이용해 유저 목록을 보여주는 컴포넌트를 어떻게 컨테이너와 함께 설계할 수 있는지 알아보자.

먼저 보여주는 부분만 담당하는 UserList 컴포넌트를 만들건데 이를 **"프리젠테이셔널 컴포넌트(Presentational Component)"**라고 한다.

```js
// src/components/UserList.js

import React, { Component } from 'react'
import User from './User'

class UserList extends Component {
  onEdit = user => {
    this.props.onEdit(user)
  }
  onDelete = user => {
    this.props.onDelete(user)
  }
  render () {
    const userList = this.props.users.map(user => (
      <User data={ user } key={ user.id }
        onEdit={ this.onEdit }
        onDelete={ this.onDelete } />
    ))
    return <div>{ userList }</div>
  }
}

export default UserList
```

UserList는 마크업과 스타일을 정의하는 등 화면에 출력되는 코드로만 만들어진 컴포넌트다.
유저 목록 데이터를 users 속성으로 받고 이 배열을 이용해 User 컴포넌트를 동적으로 만들어 낸다.
물론 데이터는 이전에 만든 유저 스토어로 부터 받아올 것이다.

이벤트 처리도 하는데 User 컴포넌트의 onEdit과 onDelete 속성에 UserList 컴포넌트에서 정의한 함수들을 각 각 전달한다.
onEdit과 onDelete 함수 구현을 보면 자체 로직은 없고 이 컴포넌트 외부에서 주입한 함수를 실행하는 코드 뿐이다.

```js
onEdit = user => this.props.onEdit(user)
```

실제 수정과 삭제 처리는 다른 녀석의 역할이라는건데 바로 유저 스토어가 될 것이다.

프리젠테이셔널 컴포넌트와 스토어의 중간 연결자 역할을 하는 녀석이 필요한데 이를 **"컨테이너 컴포넌트(Container Component)"** 라고 한다.

VisibleUserList란 컨테이너 컴포넌트를 만들어 보겠다.

```js
// src/containers/VisibleUserList.js

import { connect } from 'react-redux'
import UserList from '../components/UserList'
import { setEditUser, deleteUser } from '../store/user'

const mapStateToProps = state => {
  return {
    users: state.user.users
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onEdit: user => {
      dispatch(setEditUser(true, user))
    },
    onDelete: user => {
      dispatch(deleteUser(user))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList)
```

리액트에서 리덕스를 편하게 사용하도록 돕는 react-redux 라이브러리는 connect라는 함수를 제공하는데 이것이 컨테이너 컴포넌트를 생성하는 기능을 한다.

코드 마지막 부분에 보면 connect 가 함수 목록을 인자로 받아 함수를 반환하는 고차함수(High Order Function)임을 알수 있다.

스토어의 상태(state)와 dispatch 함수를 프리젠테이셔널 컴포넌트의 속성(props)로 연결시키기 위해 두 개 함수를 인자로 받는다.
그것이 mapStateToPros와  mapDispatchToProps 함수다.

mapStateToProps 는 users 키를 갖는 객체를 반환하기 때문에 UserList에서는 비로소 props.users 속성을 통해 스토어의 유저 데이터에 접근할 수가 있다.

mapDispatchToProps는 onEdit 함수에 setEditUser 리듀서를 동작하는 함수를 실행한다. onDelete도 유사하게 동작한다. 때문에 UserList 컴포넌트에서는 props.onEdit(user) 와 props.onDelete(user) 함수로 액션을 스토어에 전달할수 있게 되는 것이다.

마지막으로 connect가 반환한 함수를 실행하는데 스토어와 연결한 프리젠테이셔널 컴포넌트 UserList 컴포넌트를 인자로 전달한다.

## middleware

노드 익스프레스에는 HTTP 요청을 처리하는 일종의 사이클이 있는데 요청 처리 중간에 미들웨어라는 형태로 로직을 끼워 넣어서 기능을 추가할 수 있다. 특히 I/O 작업을 비동기로 처리하는 환경에서는 자신의 일을 마치고 나면 다음 미들웨어를 직접 실행시켜서 (next 함수를 호출한다) 미들웨어 체인 방식을 사용한다.

리덕스도 미들웨어를 지원하는데, 스토어가 액션 객체를 받은 뒤 해당 리듀서를 실행하는 일련의 프로세스 중간에 기능을 추가할수 있다.

미들웨어를 스토어에 추가하려면 먼저 스토어를 생성하는 createStore 함수의 인자로 넘겨주어야 한다.

```js
// src/index.js

import { createStore, applyMiddleware } from 'redux'
import storeLogger from './middlewares/storeLogger'

const store = createStore(
  dashboardApp,
  applyMiddleware(storeLogger)
)
```

redux의 applyMiddleware 함수는 미들웨어를 만들어 주는 함수인데 그 실행 결과값을 createStore 함수의 인자로 넘겨준다.

미들웨어를 위한 middlewares 폴더를 만들어 스토어 로거(storeLogger) 미들웨어를 직접 구현해 보겠다.
폴더 구조는 아래와 같다.

```
src
 |-- components
 |-- containers
 |-- store
 |-- middlewares        // 미들웨어 폴더
 |   |-- storeLogger.js // 스토어로거 미들웨어
 |-- index.js
 |-- index.css
```

sotreLogger.js를 구현해 보자.

```js
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatch', action)
  next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
}

export default logger
```

미들웨어는 함수 형태로 정의할 수 있다. 반환값은 next를 인자로 받는 함수이고 이는 action을 인자로 받는 함수를 다시 반환하다. 중요한 것은 이 마지막 함수에서 next를 호출해야 다음 미들웨어나 스토어 동작이 계속 된다는 점이다.

우리가 만든 스토어로거 미들웨어는 액션 객체와 스토어의 상태 변화를 콘솔에 기록하는 일을 한다.

결과를 확인해 보면 아래와 같다.

![state-loagger-middleware](/assets/imgs/2018/07/16/state-loagger-middleware.png)

user/REQUEST_USER 액션이 디스패치된 후 상태를 로깅했다. `isFetching: true`와 `users: []` 인 상태이다.

다음에 user/RECEIVE_USER 액션이 디스패치된 후 상태는 `isfetching: false`와 `users: [{},{},{}]` 로 갱신된 것을 확인할 수 있다.

이처럼 redux는 스토어 라이프사이클 중간에 어떠한 동작을 넣어 스토어 기능을 확장하도록 미들웨어를 제공한다.

next 는 함수 호출이기 때문에 비동기로 실행해도 동작한다. 따라서 HTTP 요청같은 비동기 로직도 미들웨어 형태로 추가할수 있을 것같다. 바로 이러한 기능을 하는 미들웨어가 다음에 설명할 **[redux-thunk](https://github.com/reduxjs/redux-thunk)** 라이브러리다.

## redux-thunk

리덕스에서 비동기 로직을 추가하기 위해 redux-thunk를 설치하자.

```
npm i redux-thunk
```

redux-thunk는 리덕스 미들웨어이기 때문에 사용하려면 스토어를 생성할때 미들웨어로 추가해야한다.

```js
// src/index.js

import thunk from 'redux-thunk'

const store = createStore(
  dashboardApp,
  applyMiddleware(thunk, storeLogger)
)
```

서버와 HTTP 통신으로 유저 목록을 받아오는 fetchUserApi 함수를 미리 만들어 뒀다. 이 함수가 반환하는 프라미스가 resolve 되어 API 호출을 완료하면, 유저 데이터 수신을 알리는 user/RECEIVE_USER 액션을 디스패치 하는 코드다.

```js
export const fetchUserAsync = () => dispatch => {
  fetchUserApi().then(users => {
    dispatch(receiveUser(users)) // "user/RECEIVE_USER" 액션을 디스패치한다
  })
}
```

이렇게 비동기 로직을 작성할 수 있는 이유는 fetchUserAsync 함수가 다른 액션 크리에이터와 달리 dispatch 를 인자로 받는 함수를 반환하는 **"리덕스 성크"**이기 때문이다.

이를 사용하는 컨테이너인 VisibleUserList 컴포넌트를 한번 보자.

```js
// src/containers/VisibleUserList.js

import { fetchUserAsync } from '../store/user'

const mapDispatchToProps = dispatch => {
  return {
    fetch: () => {
      dispatch(fetchUserAsync())
    }
  }
}
```

일반 액션 생성자처럼 실행후 dispatch 함수 인자로 사용한다.

## redux-saga

회사에서 보고 있는 프로젝트에서는 리덕스 성크보다는 ES6 제너레이터 기반의 **[redux-saga](https://github.com/redux-saga/redux-saga)**를 사용해서 비동기 처리를 한다.

리덕스 사가도 성크처럼 미들웨어의 일종인데 액션 크리에이터를 직접 수정하는 성크와 달리, 액션 크리에이터를 건들지않고 비동기 로직을 추가할수 있다는 점이 다르다.

유저 목록을 가져오는 로직을 redux-saga로 바꿔 보자.
먼저 스토어 생성시 미들웨어로 추가한다.

```js
// src/index.js

import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

const sagaMw = createSagaMiddleware()

const store = createStore(
  dashboardApp,
  applyMiddleware(sagaMw)
)

sagaMw.run(rootSaga)
```

createSagaMiddleware 함수로 사가 미들웨어를 생성한다. 이전과 마찬가지로 redux의 applyMiddleware 함수로 사가 미들웨어를 스토어에 추가한다.

마지막으로 사가 정의 파일이 있는 saga/index.js를 rootSaga라는 이름으로 가져와서 sagaMw.run(rootSaga) 함수의 인자로 전달하면 리덕스에 사가 미들웨어를 사용할 준비가 된 것이다.

프로젝트 구조도 다음과 같이 saga 폴더가 추가되었다.

```
src
 |-- components
 |-- containers
 |-- store
 |-- middlewares
 |-- sagas        // 리덕스 사가
 |   |-- index.js
 |-- index.js
 |-- index.css
```

사가를 본격적으로 만들어 보자

```js
// src/sagas/index.js

import { takeEvery, call, put } from 'redux-saga/effects'
import { FETCH_USER, RECEIVE_USER, REQEUST_USER } from '../store/user'
import { fetchUserApi } from '../api'

export function* takeFetchUser() {
  yield takeEvery(FETCH_USER, fetchUserAsync)
}

function* fetchUserAsync(action) {
  yield put({type: REQEUST_USER})
  const users = yield call(fetchUserApi)
  yield put({type: RECEIVE_USER, users})
}

export default function* rootSaga() {
  yield [
    takeFetchUser()
  ]
}
```

takeFetchUser 제너레이터부터 살펴보자. takeEvery 함수를 이용해 FETTCH_USER 액션을 한다. 함수명이 의미하듯이 이 액션을 감시하고 있다가 디스패치되는 것을 감지하면 fetchUserAsync 제너레이터를 동작하겠다는 의도다. 컴포넌트 측에서는 FETCH_USER 타입의 액션을 전달하고 나머지 로직은 fetchUserAsync 제너레이터에게 위임하는 것이다.

fetchUserAsync 제너레이터는 사가 라이브러리에 의해 스토어의 액션 객체를 주입 받는다.
여기서는 사용하지 않았지만 액션 객체의 페이로드(액션 타입과 함께 전달되는 데이터)에 접근할때 사용하면 될 것 같다.

리덕스 사가는 에팩트(effect)라는 이름으로 몇 개의 유틸리티성 제너레이터를 제공하는데 여기서는 put, call을 사용했다. takEvery도 사가에서 제공하는 이팩트 중 하나다.

put은 리덕스 액션을 디스패치할 때 사용한다. 그래서 REQUEST_USER 액션을 디스패치하여 API 요청시 상태를 변경했다.

다음으로 call을 이용해 fetchUserApi 함수를 호출한다. 그 결과 HTTP API 호출이 일어나고 서버로 부터 밭은 결과값이 users 배열에 담기게 된다.

마지막으로 users를 put 함수로 RECEIVE_USER 액션과 디스패치해서 유저 상태를 갱신한다.

이처럼 제너레이터를 사용하면 액션 생성자를 건들지 않고 비동기 로직을 코딩할수 있어서 가독성 면에서 좋다고 생각한다.

마지막으로 rootSaga 제너레이터를 반환하는데 takeFetchUser 제너레이터를 실행한 결과를 배열에 담아 yield한다.

||Redux|Vuex|
|-|-|-|
|상태 갱신|dispatch	|mutation (commit)|
|비동기 상태 갱신|redux-saga|action (dispatch)|

<br />

Vue.js 진영에서 사용하는 상태관리 솔루션인 Vuex에도 동기/비동기 로직을 처리하는 개념이 있다. 동기적으로 상태를 변경하는 것이 mutation이라는 개념이고 commit 함수로 제공한다. API 통신같은 비동기 로직은 action 이라는 개념이 담당하는데 dispatch 함수로 구현할 수 있다.

액션을 보내 동기적으로 상태를 변경하는 리액트의 dispatch 가 Vuex의  mutation 같고, 비동기 로직을 처리하는 redux-saga가 Vuex의 action과 유사하다는 느낌을 받았다.




## 결론

리액트 프로젝트를 빠르게 시작하려면 create-react-app이란 터미널도구를 사용할수 있다.
react-app-rewired로 시작한 프로젝트라면 깔끔한 개발환경 코드를 유지하면서 확장하는 것도 가능하다.

단일페이지 어플리케이션 개발을 위해 react-router를 사용했고 특히 브라우져 상에서 구현된 react-router-dom을 함께 사용해야 한다.

상태관리를 위해 redux 아키텍쳐를 채택했다. 리액트와의 연동을 위해 react-redux 라이브러리도 같이 사용한다.

리덕스는 미들웨어를 통해 스토어 기능을 확장할 수 있다. 기본적으로 동기 로직인 리덕스에 비동기 로직을 구현하려면
redux-thunk나 redux-saga 같은 미들웨어를 사용하는게 편하다.

샘플 코드: [https://github.com/jeonghwan-kim/lecture-react-app-overview](https://github.com/jeonghwan-kim/lecture-react-app-overview)
