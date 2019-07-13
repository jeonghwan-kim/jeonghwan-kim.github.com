---
title: '리액트 리덕스 사용하기 (타입스크립트 버전) '
layout: post
summary: '타입스크립트로 리액트 리덕스 사용하는 방법을 정리합니다'
category: dev
tags: react typescript
date: 2019-07-13
---

## 도입

...

## 패키지 설치 

먼저 리액트 리덕스 패키지를 설치한다.

```
$ npm i react-redux @types/react-redux
```

타입스크립트에서 사용할 타입 정보인 @types/react-redux도 함께 설치한다


## 액션

액션이란 ...

액션 타입을 정의하기 위해 `actions/types.ts` 파일을 만든다.
데이터 요청(패치)을 위한 액션을 만든다.

```ts
export cont FETCH_MEMO_LIST = 'FETCH_MEMO_LIST'
```

이 타입을 생성하는 액션 생성자를 만들기 위해 `actions/index.ts` 파일을 만든다.

```ts
import * as types from './types';
import { Memo } from '../models'

export interface FetchMemoListAction {
  type: typeof types.FETCH_MEMO_LIST
  payload: Memo[]
}
```

액션 생성자의 반환 타입을 `FetchMemoListAction` 인터페이스로 정의한다.
정의한 액션 타입을 이용해 `type` 속성의 형태를 정의했다. 
마찬가지로 `payload`를 정의할 때도 `Memo` 타입을 이용했다. 

이러한 액션반환 타입을 이용해 `fetchMemoList` 액션 생성 함수를 만든다.

```ts
export const fetchMemoList = (memos: Memo[]): FetchMemoListAction => ({
  type: types.FETCH_MEMO_LIST,
  payload: memos
})
```

반환 타입을 정의하였기 때문에 이 액션 생성자는 정의한 type과 payload를 반환한다는 것을 보장할 수 있다.

마지막으로 Memo 액션 생성자들(지금은 하나지만 추가될 경우)이 반환하는 액션 타입의 묶음을 하나의 타입으로 정의한다.

```ts
export type MemoActionTypes = FetchMemoListAction
```

만약 AddModeAction 타입이 있다면 `\` 연산자를 이용해 MemoActionTypes 을 정의할 수 있다.

```ts
export type MemoActionTypes = FetchMemoListAction | AddMemoAction
```


## 리듀서 

리듀서는...

메모 리듀서를 만들기 위해 `reducers/memo.ts` 파일을 만든다. 

```ts
import { Memo } from '../models'
import * as types from '../actions/types'
import { MemoActionTypes } from '../actions'
```

액션을 받아 스토어를 갱신하는 리듀서는 액션에서 정의한 액션 생성자의 리턴 타입을 이용해야한다. 
따라서 모든 액션 타입의 유니온 타입인 MemoActiontypes를 가져왔다.

그리고 `MemoState` 타입을 정의해 보자. 

```ts
export interface MemoState {
  memos: Memo[]
}
```

메모 목록을 위한 `memos` 속성에 `Memo` 배열 타입을 정의해서 `MemoState`를 기술했다.

이 타입에 맞는 초기 스토어 값을 만들어 보자.

```ts
const initialState: MemoState = {
  memos: []
}
```

`MemoState` 타입의 `initialState` 객체를 만들고 `memos` 속성에 빈 배열로 값을 유지했다.

스토어 초기값과 반환 액션타입을 준비했으니 메모 스토어를 갱신하는 메모 리듀서를 만들 차례다.

```ts
const memoReducer = (state = initialState, action: MemoActionTypes): MemoState => {
  switch (action.type) {
    case types.FETCH_MEMO_LIST: 
      return {
        ...state,
        memos: action.payload
      }      
    default:
      return state
  }
}

export default memoReducer
```

상태와 액션을 받는 리듀서의 인자에 `initialState`로 기본 상태값을 설정하고 `MemoActionTypes` 타입으로 `action` 인자를 받도록 했다. 
그리고 이 리듀서가 반환하는 타입은 미리 정의한 `MemoState` 타입이다. 
이렇게  타입에 제약을 설정함으로서 리듀서가 받는 액션을 예측하고 상태 갱신후 반환하는 상태의 타입을 강제할 수 있다. 

메모 목록을 불러오는 `FETCH_MEMO_LIST` 액션에 대한 상태 갱신 로직을 만들었다.

메모 리듀서 따위의 하위 리듀서를 총괄하는 루트 리듀서를 만들자. 
`reducers/index.ts` 파일을 만든다. 

```ts
import { combineReducers } from 'redux'
import memo, { MemoState } from './memo'

export interface RootState {
  memo: MemoState
}
```

메모 리듀서에서 정의한 `MemoState를` 가져와 루트 리듀서 타입 RootState를 정의하는데 사용했다. 
이렇게 매번 하위 리듀서를 만들때 스태이트 타입을 정의하고 루트 리듀서 타입을 정의할 때 가져와 사용할 수 있다. 

`RootState` 타입은 나중에 컨테이너 컴포넌트에 스테이트를 주입할 경우 사용할 수 있다. 
이 타입을 주입받을 때 스테이트의 구조를 코드 단에서 정확히 추적할 수 있는 장점이 있는 것이다.

리듀서를 모아주는 `combineReducers()` 함수로 루트 리듀서를 만들어 외부 모듈로 노출시킨다.

```ts
const rootReducer = combineReducers({
  memo
})

export default rootReducer
```

## 스토어 

지금가지 두 개 폴더를 만들었다.

`actions` 폴더에서는 액션 타입과 액션 생성자를 정의했다. 
뿐만아니라 액션 생성자의 반환 타입까지 만들어서 리듀서가 타입이 전달해준 값을 정확히 추적하도록 했다 

`reducers` 폴더에서는 하위 리듀서인 메모 리듀서를 만들었다. 
메모 스테이트의 타입을 정의하고 이를 이용하여 루트 스테이트 타입까지 정의했다. 
마지막엔 하위 리듀서를 모두 모다 루트 리듀서를 생성했다.

액션과 리듀서를 준비하면 스토어 생성할 수 있다. 
엔트리 포인트 파일에서 직접 생성할수도 있겠지만 리덕스 미들웨어를 추가할 때 필요한 코드들을 기술하기 위해 스토어 설정 파일을 만드는게 더 좋겠다. 
`store/configureStore.ts` 파일을 만든다. 

```ts
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducers'

const configureStore = () => 
  createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(
        createLogger({ collapsed: true }),
      ),
    ),
  )

export default configureStore
```

루트 리듀서를 가져와 스토어 생성함수인 `createStore()` 에 전달하여 스토어를 만들었다. 
추가로 리덕스 개발 도구인 redux-logger와 redux-devtools-extention를 미들웨어를 넣었다. 


## 컴포넌트에 스토어 주입

마지막으로 스토어를 어플리케이션 루트 컴포넌트에 주입할 차례다.
어플리케이션 엔트리 포인트인 `index.tsx`.

```ts
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Root from './routes'
import configureStore from './store/configureStore'

// 스토어를 생성한다
const store = configureStore()
```

`congifureStore()` 함수로 스토어를 생성한다. 
어플리케이션에 사용된 모든 컴포넌트에서 이 스토어를 사용하려면 생성된 스토어를 루트 컴포넌트에 주입하는 과정이 필요한데 `[Provider](https://react-redux.js.org/api/provider)` 컴포넌트가 이 역할을 한다. 
react-redux 패키지에서 제공하는 컴포넌트다. 

```tsx
ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('app')
);
```

라우터로 구성되는`Root` 컴포넌트를 `Provider` 컴포넌트로 감싸고 `store` 프로퍼티에 생성한 스토어를 연결했다.  
그 결과 하위 모든 컴포넌트에서는 `connect()` 함수를 통해 스토어에 접근할 수 있다. 


## 컨테이너 컴포넌트

react-redux 패키지에서 제공하는 [`connect()`](https://react-redux.js.org/api/connect) 함수는 컨테이넌 컴포넌트를 생성하는 역할을 하는 고차 함수다. 
컴포는트를 받아 스토어 데이터가 연결된 컴포넌트를 반환한다. 
뿐만아니라 액션 생성자 함수도 컴포넌트에 주입해 주는 기능을 한다. 

컨테이너의 역할은 리덕스 원작자인 댄 아브라모브(Dan Abramov)의 [Presentational and Container Componets](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)를 참고하자. [번역 글](https://blueshw.github.io/2017/06/26/presentaional-component-container-component/)도 있다.

요약하면 컨테이너는 어떻게 **동작하는지**를 담당하고 프리젠테이션 어떻게 **보여지는지**를 담당하는 컴포넌트다. 

`connect()` 함수로 스토어와 연결된 컨테이너는 스태이트 데이터와 스테이트 데이터를 변경하는 액셩 생성자를 다른 컴포넌트에 주입할수 있다. 
뿐만아니라 이외의 부가적인 행동도 나름의 메소드로 정의해서 컴포넌트로 넣어줄수 있다. 

메모목록 리스트의 동작을 담당하는 `MemoListContainer`를 `containers/MemoList.tsx` 파일에 만들어 보자. 

```ts
import { RouteComponentProps } from 'react-router'
import { Memo } from '../models';
import { FetchMemoListAction } from '../actions'

interface Props {
  memos: Memo[]
  fetchMemoList(memos: Memo[]): FetchMemoListAction
}

class MemoListContainer extends React.Component<Props> {

}
```


`React.Component<>` 제네릭으로 컴포넌트를 만들기 때문에 Props 타입을 먼저 정의 했다. 
메모 목록을 출력하기 위해 메모 배열을 memos 속성으로 받았다. 

메모 목록을 가져오기 위해 `fetchMemoList()` 함수도 속성으로 받았다. 
이것은 스토어에 데이터를 넣어주기 위한 함수있데 바로 액션 생성자다. 
`actinos/index.ts` 에 정의한 액션 생성자 중 `fetchMemoList()` 함수와 같은 함수다. 

이 `Props` 타입으로 만든 `MemoListContainer`는 아래 `connect()` 함수가 반환하는 함수의 인자로 전달해서 컨테이너를 만든다. 

```ts
import {connect} from 'react-redux'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemoListContainer)
```

`connect()` 함수는 스테이트를 컴포넌트의 속성으로 연결하는 `mapStateToProps()` 함수와 액션 생성자 디스패처를 속성으로 연결하는 `mapDispatchToProps()` 함수를 이자를 받는다.

인자로 사용되는 두 함수는 다음과 같이 정의한다.

```ts
const mapStateToProps = (state: RootState) => ({
  memos: state.memo.memos
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({
    fetchMemoList
  }, dispatch)
```

`mapStateToProps()` 함수는 인자로 스태이트를 `connect()` 함수를 통해 전달 받는다. 
이것은 앞서 래핑한 `Provider` 컴포넌트에 주입한 `store` 객체이다. 
우리는 이를 `reducers/index.ts` 에서 이미 정의 했다. 
따라서 이 타입으로 `state`를 받으면 스태이트 구조를 정확히 추적할 수 있다.
여기서는 메모 리스트를 담고 있는 `state.memo.memos` 를 컨테이너 프롭스 `memos`에 바인딩했다.

`mapDispachToProps는()` 디스패치 함수를 인자로 받는다.
액션을 디스패치하는데 `bindActionCreators()` 함수를 이용하면 액션 생성자 함수를 디스패치할수 있는 형태로 변환할 수 있다.

이렇게 스토어가 연결된 컨테이너는 속성을 통해서 스토어에 접근하거나 제어할 수 있다. 

컴포넌트가 마운트되었을 때 데이터를 불러와 스토어에 저장하는 로직을 만들어 보자.

```ts
class MemoListContainer extends React.Component<Props> {
  componentWillMount() {
    const { fetchMemoList } = this.props
    const memos = api.fetchMemoList()
    fetchMemoList(memos)
}
```

api를 통해서 얻은 메모 목록을 스토어에 저장하기 위해 `props`로 받은 `fetchMemoList()` 를 실행했다. 
그 후에는 스토어에 메모 목록이 저장되고 이와 바인딩 되어있는 이 컴포넌트는 `props.memos` 를 통해 갱신된 데이터를 받을 수 있다. 

그럼 이 데이터를 출력하는 렌더 함수를 작성해 보자. 

```tsx
class MemoListContainer extends React.Component<Props> {
  // componentWillMount() { /* 생략 */ }

  render() {
    const { memos } = this.props
    return <MemoListPage memos={memos} />
  }
}
```

컨테이너는 어떻게 동작하는지만 알고 있는 컴포넌트다. 
메모 목록가지 얻었기 때문에 컨테이너의 역할은 여기까지다. 
어떻게 보여지는지는 다른컴포넌트 `MemoListPage` 컴포넌트의 역할이므로 데이터만 이쪽으로 전달해 준다. 


## 컴포넌트 

`memos` 속성에 데이터를 전달받아 메모 목록을 출력하는 `MemoListPage` 컴포넌트를 `pages/MemoList.tsx` 파일에 만들어 보자. 

```ts
import { Memo } from '../models'

interface Props {
  memos: Memo[]
}

const MemoListPage: React.FC<Props> = props => {
  const { memos } = props
  return (
    /* 메모 목록 출력 */
  )
}
```

메모 배열을 `memos` 키로 갖는 `Props` 인터페이스를 만들어 `React.FC<>` 제네릭에 전달해서 컴포넌트를 만들었다. 
출력만 하기 때문에 리액트 함수형 컴포넌트로 `MemoListPage`를 만들었다. 
만약 라이프사이클에 따를 로직이 필요하다면 이것도 일반 컴포넌트로 만들 수 있다. 


## 정리 

역할에 따라 폴더를 나누었는데 각 기능을 정리하면 다음과 같다.

**`actions`**: 액션 타입과 이를 포함한 액션 객체를 생성하는 액션 생성자 함수를 정의한다. 

**`reducers`**: 스토어 타입과 초기값을 설정해서 스토어 구조를 만든다. 
액션에 따라 스토어를 갱신하는 리듀서를 정의한다.

**`store`**: 리듀서를 가져와 스토어를 만든다. 
이렇게 만든 스토어는 루트 컴포넌트에 주입되는데 `Provider` 컴포넌트를 이용한다.

**`containers`**: 액션 생성자 디스패처와 스토어 상태가 연결된 컴포넌트를 정의한다. 
이것은 행동을 정의하는 컴포넌트다. 

**`pages`**: 컨테이너에 의해 주입받은 데이터를 출력한다. 
상황에 따라 재활용하는 공통 컴포넌트는 `components` 폴더에 놓을 수도 있다. 

이렇게 해서 하나의 액션과 이를 통해 생성되는 데이터를 만들었고 이 데이터를 출력하는 컴포넌트를 만들어 보았다. 
어플리케이션에서는 수많은 액션 타입과 디스패쳐 함수를 통해 스토어를 변경한다. 
변경된 스토어 상태는 각 컴포넌트에 주입되어 화면에 렌더링된다. 
메모장 예제를 참고하면서 전체 어플리케이션에서 redux가 움직이는 그림을 그려보기 바란다.

전체코드: 링크 
