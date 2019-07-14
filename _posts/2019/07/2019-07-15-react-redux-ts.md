---
title: '리액트 리덕스 사용하기 (타입스크립트 버전) '
layout: post
summary: '타입스크립트로 리액트 리덕스 사용하는 방법을 정리합니다'
category: dev
tags: react typescript
date: 2019-07-13
---

## 도입

단일 페이지 어플리케이션 구현을 위해 지난 시간 리액트 라우터의 사용법에 대해 간단히 정리했다.
브라우져에서 하나의 페이지로 어플리케이션을 구현하려면 라우팅 뿐만아니라 데이터도 다루어야 하는데 리덕스를 많이 사용한다.
리덕스는 전역 데이터를 단순한 방법으로 사용할수 있는 일명 '상태 관리 도구'이다. 

이번 글에서는 타입스크립트를 이용해 리액트에서 리덕스를 사용하는 방법을 정리해 보자.

## 패키지 설치 

리덕스는 프레임웍에 무관하게 사용할수 있는 상태관리 솔루션이다.
직접 사용하는 방법도 있지만 리액트에 맞게 제공되는 패키지인 react-redux를 사용하는 것이 더 단순하다.

리액트 리덕스 패키지를 설치하자.

```
$ npm i react-redux @types/react-redux
```

타입스크립트에서 사용할 타입 정보인 @types/react-redux도 함께 설치한다.


## 액션

액션이란 어플리케이션이 스토어로 보내는 데이터 묶음이다. 
스토어는 수신한 데이터 묶음을 열어보고 데이터를 변경한다. 
데이터 묶음에는 액션 타입과 데이터가 있는데 바로 이 액션 타입에 따라 데이터를 다루는 방식이다.


먼저 액션 타입을 정의해 보자. 
`actions/types.ts` 파일을 만들어 데이터 요청(패치)을 위한 액션 타입을 하나 만든다.

```ts
export cont FETCH_MEMO_LIST = 'FETCH_MEMO_LIST'
```

단순한 문자열 상수다.
이 타입의 데이터 묶음을 만드는 액션 생성자를 만든다.
`actions/index.ts` 파일에 아래 내용을 추가한다.

```ts
import * as types from './types';
import { Memo } from '../models'

export interface FetchMemoListAction {
  type: typeof types.FETCH_MEMO_LIST
  payload: Memo[]
}
```

액션 생성자를 만들기 전에 생성자의 반환 타입부터 정의했다.
`FetchMemoListAction` 인터페이스인데 액션 타입을 가져와 `type` 속성의 형태를 정의했다. 
마찬가지로 `payload`를 정의할 때도 `Memo` 타입을 이용했다. 
액션 생성자는 타입과 페이로드를 갖는 데이터 묶을을 반환한다는 말이다.

이것을 이용해 `fetchMemoList` 액션 생성 함수를 만든다.

```ts
export const fetchMemoList = (memos: Memo[]): FetchMemoListAction => ({
  type: types.FETCH_MEMO_LIST,
  payload: memos
})
```

인터페이스로 정의한 타입을 리턴 타입으로 사용했기 때문에 이 액션 생성자는 타입과 패이로드로 구성된 데이터 묶음을 반환한다는 것을 보장할 수 있다.

지금은 액션 생성자가 하나지만 추가될 경우 여러 생성자들이 반환하는 액션 타입의 묶음을 하나의 타입으로 묶어서 정의한다.

```ts
export type MemoActionTypes = FetchMemoListAction
```

가령 메모 추가 액션 탕입 `AddMemoAction`이 있다면 유니온 연산자를 이용해 메모 액션 타입을 정의할 수 있다.

```ts
export type MemoActionTypes = FetchMemoListAction | AddMemoAction
```


## 리듀서 

액션을 받은 스토어는 액션 타입에 따라 저장소를 갱신해야하는데 이 역할을 리듀서가 한다.

메모 데이터만 관리하는 메모 리듀서를 만들기 위해 `reducers/memo.ts` 파일을 만든다. 

```ts
import { Memo } from '../models'
import * as types from '../actions/types'
import { MemoActionTypes } from '../actions'
```

리듀서는 수신하는 액션의 타입을 알아야 데이터 묶음을 열어 볼 수 있다.
따라서 모든 메모 액션 타입의 유니온 타입인 `MemoActiontypes`를 가져왔다.

액션 타입에 따라 갱신할 스토어 상태 구조를 정의하는 `MemoState` 인터페이스를 정의해 보자. 

```ts
export interface MemoState {
  memos: Memo[]
}
```

메모 목록을 저장하는 `memos` 속성에 `Memo[]` 배열 타입을 정의해서 메모 스테이트 타입을 정의했다.

이 타입을 이용해 초기 스토어 값을 설정한다.

```ts
const initialState: MemoState = {
  memos: []
}
```

액션 반환 타입과 스토어 초기값이 준비되었다.
이제는 스토어를 갱신하는 리듀서를 만들 차례다.

```ts
const memoReducer = (state = initialState, action: MemoActionTypes): MemoState => {
  switch (action.type) {
    case types.FETCH_MEMO_LIST: 
      return {
        ...state,
        memos: action.payload.map((memo: Memo) => ({
          ...memo,
        })),
      }      
    default:
      return state
  }
}

export default memoReducer
```

스테이트와 액션을 받는 리듀서 인자에 `state` 초기값을 기본값으로 설정하고 메모 액션 타입으로 `action` 인자를 받도록 했다. 
리듀서가 반환하는 것은 미리 정의한 메모 스테이트 타입이다. 
타입에 제약을 설정함으로서 리듀서가 받는 액션의 모습을 예측할 수 있다.
뿐만 아니라 스토어 조작 후 반환하는 스토어의 타입도 그대로 임을 보장할 수 있다.

여기까지 메모 목록을 패치하는 액션에 대한 상태 갱신 로직을 만들었다.

메모 리듀서같은 하위 리듀서를 총괄하는 루트 리듀서를 만들자. 
`reducers/index.ts` 파일을 만든다. 

```ts
import { combineReducers } from 'redux'
import memo, { MemoState } from './memo'

export interface RootState {
  memo: MemoState
}
```

메모 리듀서에서 정의한 `MemoState`를 가져와 루트 리듀서 타입 `RootState`의 타입을 만드는데 사용했다. 
이렇게 매번 하위 리듀서를 만들 때마다 스태이트 타입을 정의하고 루트 리듀서 타입 생성지 활용할 수 있다.

루트 스테이트는 컨테이너 컴포넌트와 스토어 연결할 경우 사용할 수 있다. 
컴포넌트에서는 스테이트의 구조를 정확히 추적할 수 있는 효과가 있다.

리듀서를 모아주는 `combineReducers()` 함수로 루트 리듀서를 만들어 외부 모듈로 노출시킨다.

```ts
const rootReducer = combineReducers({
  memo
})

export default rootReducer
```

## 스토어 

다른 포스트에 비해 비교적 코드가 많은 듯한 느낌인데 폴더 별로 중간 정리를 해보자. 
두 개 폴더를 만들었다.

**`actions` 폴더**
* 액션 타입과 액션 생성자를 정의했다
* 액션 생성자의 반환 타입을 만들어 이를 받은 리듀서가 값을 정확히 파악하도록 했다

**`reducers` 폴더**
* 하위 리듀서인 메모 리듀서를 만들었다
* 메모 스테이트의 타입을 정의하고 이를 이용하여 루트 스테이트 타입까지 정의했다
* 하위 리듀서를 묶어 루트 리듀서를 만들었다 

액션과 리듀서를 준비하면 비로소 스토어 만들수 있는 준비가 된 것이다.

엔트리 포인트 파일에서 직접 생성할수도 있겠지만 리덕스 미들웨어 추가 같은 코드를 담기 위해 스토어 설정 파일을 만드는게 더 좋겠다. 
`store/configureStore.ts` 파일을 만든다. 

```ts
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducers'

const configureStore = () => 
  //  스토어를 생성한다 
  createStore(
    // 루트 리듀서를 전달한다
    rootReducer,

    // 미들웨어 형태의 리덕스 개발 도구를 추가한다 
    composeWithDevTools(
      applyMiddleware(
        createLogger(),
      ),
    ),
  )

export default configureStore
```

루트 리듀서를 가져와 스토어 생성 함수인 `createStore()`에 전달하여 스토어를 만들었다. 
추가로 리덕스 개발 도구인 redux-logger와 redux-devtools-extention를 미들웨어를 넣었다. 


## 컴포넌트와 스토어 연결 

생성한 스토어를 어플리케이션 루트 컴포넌트에 넣어줄 차례다.
어플리케이션 엔트리 포인트인 `index.tsx`에서 스토어를 만든다.

```ts
import configureStore from './store/configureStore'

// 스토어를 생성한다
const store = configureStore()
```

준비한 `congifureStore()` 함수로 스토어를 생성한다. 

어플리케이션에 사용된 모든 컴포넌트에서 이 스토어를 사용하려면 생성된 스토어를 루트 컴포넌트에 주입하는 과정이 필요한데 [`<Provider />`](https://react-redux.js.org/api/provider) 컴포넌트가 이 역할을 한다. 
react-redux 패키지에서 제공하는 컴포넌트다. 

```tsx
ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('app')
);
```

라우터로 구성된 `<Root />` 컴포넌트를 `<Provider />` 컴포넌트로 감싸고 `store` 속성에 스토어를 연결했다.  
그 결과 하위 모든 컴포넌트에서는 `connect()` 함수를 통해 스토어에 접근할 수 있다. 


## 컨테이너 컴포넌트

react-redux 패키지에서 제공하는 [`connect()`](https://react-redux.js.org/api/connect) 함수는 컨테이넌 컴포넌트를 생성하는 역할을 하는 고차 함수다. 
컴포는트를 받아 스토어 데이터가 연결된 컴포넌트를 반환하는 기능을 한다.
뿐만아니라 액션 생성자 함수를 컴포넌트가 디스패치할 수 있도록 해 주는 것이 커넥트 함수의 역할이다.

컨테이너의 역할은 리덕스 원작자인 댄 애브라모브(Dan Abramov)의 [Presentational and Container Componets](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)를 참고하자. [번역 글](https://blueshw.github.io/2017/06/26/presentaional-component-container-component/)도 있다.

> 요약하면 컨테이너는 어떻게 **동작하는지**를 담당하고 프리젠테이션 어떻게 **보여지는지**를 담당하는 컴포넌트다. 

커넥트 함수로 스토어와 연결된 컨테이너는 스토어와 이를 변경하는 액셩 생성자 디스패쳐를 다른 컴포넌트에 주입할수 있다. 
뿐만아니라 이외의 부가적인 행동도 나름의 메소드로 정의해서 컴포넌트로 넣어줄수 있다. 

메모 리스트의 동작을 담당하는 `<MemoListContainer />`를 `containers/MemoList.tsx` 파일에 만들어 보자. 

```ts
import { Memo } from '../models';
import { FetchMemoListAction } from '../actions'

interface Props {
  memos: Memo[]
  fetchMemoList(memos: Memo[]): FetchMemoListAction
}

class MemoListContainer extends React.Component<Props> {

}
```

`Component<>` 제네릭으로 컴포넌트를 만들기 위해 `Props` 인터페이스 먼저 정의 했다. 
메모 리스트 출력을 위해 메모 배열을 `memos` 속성으로 받았다. 

메모 목록을 가져오기 위해 `fetchMemoList()` 함수도 속성으로 받았다. 
`actinos/index.ts` 에 정의한 액션 생성자와 같은 함수 시그니쳐다. 

이 타입으로 만든 메모 리스트 컨테이너는 아래 커넥트 함수가 반환하는 함수의 인자로 전달해서 컨테이너를 만든다. 

```ts
import { connect } from 'react-redux'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemoListContainer)
```

커넥트 함수는 스테이트를 컴포넌트의 속성으로 연결하는 `mapStateToProps()` 함수와, 액션 생성자 디스패처를 속성으로 연결하는 `mapDispatchToProps()` 함수를 인자로 받는다.

인자로 사용되는 두 함수는 다음과 같이 정의할 수 있다.

```ts
const mapStateToProps = (state: RootState) => ({
  memos: state.memo.memos
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({
    fetchMemoList
  }, dispatch)
```

`mapStateToProps()` 함수는 커넥트 함수로부터 스태이트 전달 받는다. 
이것은 앞서 래핑한 프로바이더 컴포넌트에서 주입한 스토어 객체이다. 
우리는 이 타입 `RootState`를 이미 리듀서에서 정의 했기 때문에 가져와서 사용할수 있는 것이다.

여기서는 메모 리스트를 담고 있는 `state.memo.memos` 를 컨테이너 프롭스 `memos`에 바인딩했다.

`mapDispachToProps()`는 디스패치 함수를 인자로 받는다.
[`bindActionCreators()`](https://deminoth.github.io/redux/api/bindActionCreators.html) 함수를 이용하면 액션 생성자 함수를 디스패치할 수 있는 형태로 변환할 수 있다.

스토어가 연결된 컨테이너는 속성을 통해서 스토어에 접근하거나 액션을 발행할 수 있게 되었다.

컴포넌트가 마운트되었을 때 데이터를 불러와 스토어에 저장하는 로직을 만들어 보자.

```ts
class MemoListContainer extends React.Component<Props> {
  componentWillMount() {
    const { fetchMemoList } = this.props
    const memos = api.fetchMemoList()
    fetchMemoList(memos)
}
```

Api를 통해서 얻은 메모 리스트를 스토어에 저장하기 위해 `fetchMemoList(memos)`를 실행했다. 
그러면 스토어에 메모 목록이 저장되고, 컴포넌트는 `props.memos`를 통해 갱신된 데이터를 받을 수 있다.

이 데이터를 출력하는 렌더 함수를 작성해 보자. 

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
API로 얻어온 메모 리스트를 스토어에 저장하고 이를 다시 스토어로 부터 얻어 오는 것이 컨테이너의 역할이다.

어떻게 보여지는지는 `<MemoListPage />` 컴포넌트의 역할이므로 데이터만 전달해 주는 것으로 컨테이너의 역할을 마무리 하겠다.


## 컴포넌트 

컨테이너로 부터 메모 리스트를 전달받아 이를 보여주는 `<MemoListPage />` 컴포넌트를 만들어 보자.
`pages/MemoList.tsx` 파일에 아래 내용을 보자.

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

메모 배열을 갖는 `Props` 인터페이스를 만들어 `FC<>` 제네릭에 전달해서 컴포넌트를 만들었다. 
출력만 하고 다른 라이프사이클이 필요없기 때문에 리액트 함수형 컴포넌트를 이용했다.
필요하다면 이것도 일반 컴포넌트로 만들 수 있다. 


## 정리 

역할에 따라 폴더를 나누었고 정리하면 다음과 같다.

**`actions`**: 액션 타입과 이를 포함한 액션 객체를 생성하는 액션 생성자 함수를 정의한다. 

**`reducers`**: 스토어 타입과 초기값을 설정해서 스토어 구조를 만든다. 
액션에 따라 스토어를 갱신하는 리듀서를 정의한다.

**`store`**: 리듀서를 가져와 스토어를 만든다. 
스토어는 루트 컴포넌트에 주입되는데 프로바이더 컴포넌트를 이용한다.

**`containers`**: 액션 생성자 디스패처와 스토어 상태가 연결된 컴포넌트를 정의한다. 
이것은 행동을 정의하는 컴포넌트다. 

**`pages`**: 컨테이너에 의해 전달받은 데이터를 출력한다. 
상황에 따라 재활용하는 공통 컴포넌트는 `components` 폴더에 놓을 수도 있다. 

이렇게 해서 하나의 액션과 이를 통해 생성되는 데이터를 만들었고 이것을 동작시키고 보여주는 컴포넌트를 만들어 보았다. 

어플리케이션에서는 수많은 액션 타입과 디스패쳐 함수를 통해 스토어를 관리한다.
변경된 스토어 상태는 각 컴포넌트에 주입되어 화면에 렌더링된다. 
이러한 흐름을 더 자세히 보고 싶다면 아래 메모장 예제를 참고하길 바란다. 
전체 어플리케이션에서 redux가 움직이는 모습을 떠올릴 수 있을 것이다.

전체코드: 링크 
