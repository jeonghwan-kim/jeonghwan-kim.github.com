---
title: '리액트 사가 사용하기 (타입스크립트 버전) - 1편'
layout: post
summary: '타입스크립트로 리액트 사가 사용하는 방법을 정리합니다. 지난 글에서 정리한 것 처럼 리덕스는 다음 순서로 상태를 관리한다. 액션 객체 생성  스토어로 전달. 리듀서가 액션 객체를 수신. 액션 타입에 따라 전달받은 패이로드를 가지고 스토어 상태 변경. 이러한 일련의 과정은 모두 동기적으로 일어난다. 가령 API 통신같은 외부 리소스를 가져오는 경우 동기적인 리덕스 흐름만으로는 해결할 수 없다.'
category: dev
tags: react typescript
---

[지난 글](/dev/2019/07/15/react-redux-ts.html)에서 정리한 것 처럼 리덕스는 다음 순서로 상태를 관리한다.
1. 액션 객체 생성 
1. 스토어로 전달 
1. 리듀서가 액션 객체를 수신
1. 액션 타입에 따라 전달받은 패이로드를 가지고 스토어 상태 변경

이러한 일련의 과정은 모두 동기적으로 일어난다. 
가령 API 통신같은 외부 리소스를 가져오는 경우 동기적인 리덕스 흐름만으로는 해결할 수 없다. 

그래서 리덕스는 미들웨어 개념을 이용해 액션에서 스토어 상태 변경 프로세스 중간에 비동기 로직을 끼워 넣을수 있도록 방법을 마련해 준다.
이러한 미들웨어가 redux-thunk와 redux-saga같은 리덕스 생태계 패키지다. 

이번 글에서는 리덕스 사가로 비동기 처리하는 방법에 대해 정리해 보겠다.


## 설치 

리덕스 사가와 타입 패키지를 프로젝트에 설치한다.

```
$ npm i redux-saga @types/redux-saga
```

리덕스 미들웨어이기 때문에 스토어 스토어 생성 로직에서 사가를 설정할 수 있다.
먼저 기존의 스토어 생성 코드를 보자. 

```ts
import { createStore } from 'redux';
import rootReducer from "../reducers";

const configureStore = () => {
  const store = createStore(rootReducer)
  return store
}

export default configureStore
```

루트 리듀셔를 가져와 스토어를 생성한뒤 리턴하는 `configureStore()` 함수다.
아래 코드와 비교해서 보자.

```ts
import { createStore, applyMiddleware } from 'redux';
import rootReducer from "../reducers";
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware()

const configureStore = () => {
  const store = createStore(
    rootReducer,
    appliyMiddleware(sagaMiddleware)
  )

  sagaMiddleware.run(rootSaga)
  return store
}

export default configureStore
```

리덕스 사가에서 제공하는 `createSagaMiddleware()` 함수는 사가 미들웨어를 생성한다.
이것을 리덕스 패키지에서 제공하는 `applyMiddleware()` 함수의 인자로 전달하여 리덕스 미들웨어로 추가할 수 있다. 
그리고 나서 사가 미들웨어의 `run()` 함수로 루트 사가를 실행해 주면 스토어 작업은 끝난다.

루트 사가 모듈을 만들 차례다. 
`sagas/index.ts` 파일에 루트 사가 코드를 아래와 같이 작성한다.

```ts
function* rootSaga() {
  yield console.log('hello world')
}

export default rootSaga 
```

제너레이터로 `rootSaga()` 함수를 만들었다. 
어플리케이션을 구동하면 실행되어 "hello world" 문자열이 콘솔에 기록될 것이다.


## 비동기 작업을 세분화 (요청, 성공, 실패)

그럼 사가로 할 수 있는 일은 뭘까? 질문을 좀 바꾸자. 리덕스로 만든 어플리케이션에서 사가의 역할은 뭘까? 

> 사이드 이펙트를 더 쉽게 관리하고 더 효과적으로 실행하며 더 쉽게 테스트하고 더 나은 에러 처리를 할 수 있게 만드는 것이 목표 

라고 한다. 

여기서 사이드 이팩트라고 하는건 비동기 작업을 가리키는데 API 통신이나 유저 인터렉션을 말한다. 
하긴 리덕스 동작은 모두 동기적인데 반해, 이러한 작업은 그렇지 않기 때문에 사이드 이펙트라고 명칭했는지 모르겠다. 

어쨌든... 이러한 비동기 작업을 세분화하기 위해서는 먼저 기존의 액션을 더 세분화할 필요가 있다. 
원래는 데이터 가져오는 것을 `FETCH_MEMO_LIST` 액션 하나로만 정의해서 사용했다.

하지만 비동기는 세 단계로 나눠 볼수 있겠다.

* `*_REQUEST`: 비동기 요청
* `*_SUCCESS`: 비동기 요청 성공 
* `*_FAILURE`: 비동기 요청 실패

이렇게 분류한 기준은 유저 피드백이다. 

* `*_REQUEST` 액션타입은 비동기 요청이 시작됨을 보여준다. 데이터 로딩시까지 화면에 로딩중 메세지를 보여줄수 있을 것이다. 
* `*_SUCCESS` 액션타입은 비동기 요청이 성공한 경우다. 데이터를 화면에 보여줄수 있는 단계다. 
* `*_FAILURE` 액션타입은 비동기 요청이 실패한 경우다. 실패 원인이나 다음 행동을 유저에게 안내할 수 있을 것이다.

이러한 기준으로 기존 액션을 쪼개보자.
actions/types.ts 파일에 있는 `FETCH_MEMO_LIST` 액션을 다음과 같이 세 개 액션으로 재정의 한다.

```ts
export const FETCH_MEMO_LIST_REQUEST = 'FETCH_MEMO_LIST_REQUEST'
export const FETCH_MEMO_LIST_SUCCESS = 'FETCH_MEMO_LIST_SUCCESS'
export const FETCH_MEMO_LIST_FAILURE = 'FETCH_MEMO_LIST_FAILURE'
```

메모 목록 조회 요청을 위한 액션 생성자를 만든다.
actions/index.ts에 아래 코드를 작성한다.

```ts
export interface FetchMemoListAction {
  type: typeof types.FETCH_MEMO_LIST_REQUEST
}

export const fetchMemoList = (): FetchMemoListAction => ({
  type: types.FETCH_MEMO_LIST_REQUEST,
})
```

컴포넌트에서 이 액션 생성자로 메모 목록 패치 요청 스토어로 디스패치하면 이를 리덕스 사가에서 잡아낼 수 있다.
sagas/index.ts의 루트 사가 코드를 작성할 차례다

```ts
import { takeLatest } from 'redux-saga/effects'

export default function* rootSaga() {
  takeLatest(FETCH_MEMO_LIST_REQUEST, fetchMemoList$),
}

function fetchMemoList$() {
  // FETCH_MEMO_LIST_REQUEST 액션이 들어오면 이 함수를 실행한다 
}
```

리덕스 사가 패키지는 사이드 이펙트를 다루는 몇가지 함수를 제공한다.
이들 중 `takeLatest()` 함수는 스토어에 들어오는 액션을 보고 있다가 특정 액션만 잡아서 로직을 수행해주는 기능을 한다. 
메모 목록 조회 요청 액션이 들어오면 `fetchMemoList$()` 제네레이터를 실행하는 코드다. 

API 호출 뒤 결과를 받아 리덕스에 데이터 추가하는 순서로 함수 본체를 만들어 보자.

```ts
function* fetchMemoList$() {
  try {
    const memos = yield call(api.fetchMemoList)
    yield put({ type: FETCH_MEMO_LIST_SUCCESS, payload: memos })
  } catch (err) {
    // 실패 로직: 나중에 작성할 것임 
  } 
}
```

이팩터 중에 `call()` 함수는 인자로 받은 함수를 실행해 주는 역할을 한다. 
전달 받은 함수가 프라미스를 반환하는 경우 프라미스가 처리될 때까지 제너레이터를 중지 시킨다. 
프라미스가 리졸브(resolve)되면 그 값으로 제네레이터를 다시 시작하고 리젝트(reject)되면 제네레이터는 에러를 던지는 동작을 한다. 

`api.fetchMemoList()` 함수가 프라미스를 반환하기 때문에 성공시 메모 목록을 넘여준다. 
이것을 스토어 상태에 저장하기 위해 그 다음단계 액션인 `FETCH_MEMO_LIST_SUCCESS` 타입에 패이로드로 액션을 디스패치한다.

이팩터 중에 `put()` 함수는 액션을 스토어로 디스패치하는 역할을 한다. 이 함수로 `FETCH_MEMO_LIST_SUCCESS` 액션을 발행했다. 

여기까지가 사가 함수의 역할이다. 
불러온 데이터로 스토어 상태를 갱신하는 것은 리듀서의 몫이다. 
메모 목록으로 스토어 상태를 갱신했던 리듀서는 `FETCH_MEMO_LIST` 액션을 바라보았지만,
액션을 쪼게 후로는 `FETCH_MEMO_LIST_SUCCESS` 액션을 보고 처리해야한다.
reducers/memo.ts 파일을 보자.

```ts
const memoReducer = (state = initialState, action: MemoActionTypes): MemoState => {
  switch (action.type) {
    // 새로 정의한 액션 타입으로 스토어 상태를 갱신한다 
    case types.FETCH_MEMO_LIST_SUCCESS:
      return {
        ...state,
        memos: action.payload.map(memo => ({ ...memo }))
      }
```

여기까지가 리덕스에서 비동처리의 한 사이클이다. 
좀 복잡해 보이니깐 중간 정리해보자.

* **컴포넌트**는 요청 액션을 디스패치해서 스토어에게 비동기 요청을 알린다
* **사가**는 스토어로 들어오는 액션을 감시하고 있다가 요청 액션을 발견하면 특정 함수를 실행한다
  * 이 함수는 비동기 로직을 제아하는 제네레이터다
  * `call()` 함수로 API를 호출하고 결과를 받는다
  * `put()` 함수로 받은 데이터를 저장하는 액션을 발행한다
* **리듀서**는 이 액션을 받아 스토어를 갱신한다

기본 흐름을 머리에 딱 붙잡고, 예제 몇 가지를 살펴보면서 리덕스 사가 사용법을 익혀보자.


## 메모 조회: 데이터 로딩 피드백

첫 번째 예제로 메모 목록을 로딩중임을 피드백하는 기능을 만들어 보겠다.
컴포넌트가 마운트된 후 데이터 조회 요청을 시작하면 데이터를 받을 때까지 화면에 로딩중 메세지를 보여주는 기능이다.

Api 요청 중임을 식별할 용도로 `apiCalling` 상태를 스토어에 추가한다. 
어플리케이션 전반에서 사용되는 상태이기 때문에 recuers/app.ts 에 정의했다.

```ts
export interface AppState {
  apiCalling: boolean
}

const initialState: AppState = {
  apiCalling: false
}
```

`*_REQUEST` 요청이 오면 `apiCalling`을 `true`로 변경해서 api 통신 중임을 스토어에 기록해 둘 수 있다.
Api 통신이 끝나면 `apiCalling`을 `false`로 변경해야하는데 이것은 `CLEAR_API_CALL_STATUS` 액션 타입을 별도로 사용하겠다. actions/types.ts

```ts
export const CLEAR_API_CALL_STATUS = 'CLEAR_API_CALL_STATUS'
```

다시 recuers/app.ts로 돌아와 앱 리듀서 함수 본체를 다음과 같이 만든다.

```ts
type AppActionTypes = ClearApiCallStatusAction

const appReducer = (
  state: AppState = initialState, 
  action: AppActionTypes
): AppState => {

  switch (action.type) {
    // 메모 목록 요청시: apiCalling=true 설정
    case types.FETCH_MEMO_LIST_REQUEST:
      return {
        ...state,
        apiCalling: true
      }

    // API 호출 상태 해제시: apiCalling=false 설정
    case types.CLEAR_API_CALL_STATUS:
      return {
        ...state,
        apiCalling: false
      }
  }
}

export default appReducer
```

`FETCH_MEMO_LIST_REQUEST` 액션이 들어오면 `apiCalling` 상태를 설정한다.
반대로 `CLEAR_API_CALL_STATUS` 액션이 오면 이를 해제한다.

`FETCH_MEMO_LIST_REQUEST` 액션이 발행되면 이제는 두 가지 행동이 일어난다. 
사가에서 이 액션 타입을 감시하고 있기 때문에 `fetchMemoList$()` 제네레이터 함수가 동작할 것이고, 동시에 리듀서에서는 `apiCalling` 상태가 설정될 것이다.

그럼 `CLEAR_API_CALL_STATUS` 액션은 누가, 언제 발행해야 할까? 사가 함수라는 것을 눈치챘을지 모르겠다.

```ts
function* fetchMemoList$() {
  try {
    const memos = yield call(api.fetchMemoList)
    yield put({ type: FETCH_MEMO_LIST_SUCCESS, payload: memos })
  } catch (err) {
    // 실패 로직: 나중에 작성할 것임 
  } finally {
    // API 호출 종료를 설정한다 
    yield put({ type: CLEAR_API_CALL_STATUS })
  }
}
```

`try` 구문에서 정상 로직이 수행되고 `catch` 구문에서 실패 로직이 수행된다. 
두 로직은 결국엔 `finally` 구문으로 수렴하는데 이 때 api 요청이 끝났음을 알리는 `CLEAR_API_CALL_STATUS` 액션을 발행하면 된다.

그럼 이것을 컴포넌트에서 가져와 화면에 그려보겠다.
스토어와 연결된 컨테이너 컴포넌트를 먼저 보자. containers/MemoList.tsx

```tsx
interface Props {
  apiCalling: boolean
  memos: Memo[]
  fetchMemoList(): FetchMemoListAction
}

class MemoListContainer extends React.Component<Props> {
  componentDidMount() {
    const {fetchMemoList} = this.props;
    fetchMemoList()
  }

  render() {
    return <MemoListPage {...this.props} />
  }
}
```

`apiCalling`과 `memos`배열, 그리고 `fetchMemoList()` 액션 생성자를 속성으로 받는다. 
컴포넌트 마운트 후에는 이 액션을 발행해서 스토어가 메모 목록을 불러오도록 한다.
그러면 리듀서에 의해 `apiCalling` 상태가 설정될 것이고 사가에 의해 `fetchMemoList$()` 제네레이터 함수가  api 호출을 시작할 것이다.

다음은 이 컨테이너를 스토어와 연결한다.

```ts
const mapStateToProps = (state: RootState) => ({
  memos: state.memo.memos,
  apiCalling: state.app.apiCalling
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({
    fetchMemoList
  }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemoListContainer)
```

변경된 `apiCalling` 상태는 `connect()` 함수에 전달한 `mapStateToProps()` 함수에 의해 컴포넌트에 연결될 것이다. 
Api 요청으로 획득한 메모 목록도 컨테이너의 `memos` 속성에 연결되어 들어가게 된다.

마지막으로 메모 목록 페이지 컴포넌트에 피드백을 추가해 보자.
pages/memo/MemoList.tsx 파일이다.

```tsx
interface Props {
  apiCalling: boolean
  memos: Memo[]
}

const MemoListPage: React.FC<Props> = props => {
  const { memos, apiCalling } = props;
  const hasMemos = memos.length > 0;

  return (
    <Layout>
      <Sidebar>
        {hasMemos
          ? <MemoList {...props} />
            : apiCalling
            ? <Skelton style={%raw%}{{margin: '10px'}}{%endraw%} />
              : null
        }
      </Sidebar>
      <Main />
    </Layout>
  );
}

export default MemoListPage
```

메모가 있을 경우 메모 목록을 출력한다. 
그렇지 않을 경우는 두 가지 인데 
* Api 요청중이라면 요청 중임을 나타내는 `<Skellon />` 을 출력한다
* 아니면 데이터가 없을 경우이므로 null을 반환해서 출력하지 않도록한다

결과를 보자.

![](/assets/imgs/2019/07/22/fetch01.png)

`FETCH_MEMO_LIST_REQUEST` 액션이 발행되고 리듀서에 의해 `apiCalling`이 세팅되었다. 
컴포넌트에서는 이 상태를 보고 로딩중임을 렌더링한다.

![](/assets/imgs/2019/07/22/fetch02.png)

Api 조회응답이 오면 `FETCH_MEMO_LIST_SUCCESS`가 디스패치되어 스토어 상태에 api 응답값이 저장된다.
컴포넌트에서는 데이터를 렌더링한다.

![](/assets/imgs/2019/07/22/fetch03.png)

최종적으로 api 요청을 완료하는 `CLEAR_API_CALL_STATUS`가 발행되고 `apiCalling` 상태가 해제된다.


## 정리 

비동기적으로 리덕스에서 상태를 관리할 수 잇는 리덕스 사가 패키지 사용법에 대해 알아 보았다. 

비동기 작업을 요청, 성공, 실패라는 단위로 쪼게에 액션 타입을 정의했다.
이 액션 타입에 따라 리듀서와 사가가 협동하여 상태를 관리할 수 있다. 

예제로 데이터 로딩 중임을 알릴수 있는 메모 목록 조회하는 기능을 만들어 보았다. 
좀더 다양한 예제는 다음 글에서 다시 정리하도록 하고 이글은 여기서 마무리 하겠다.

전체 코드: [https://github.com/jeonghwan-kim/study-react-ts/tree/master/redux-saga](https://github.com/jeonghwan-kim/study-react-ts/tree/master/redux-saga)