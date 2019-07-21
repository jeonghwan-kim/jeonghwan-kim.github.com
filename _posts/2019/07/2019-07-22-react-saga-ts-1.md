---
title: '리액트 사가 사용하기 (타입스크립트 버전) - 1편'
layout: post
summary: '타입스크립트로 리액트 사가 사용하는 방법을 정리합니다'
category: dev
tags: react typescript
---

리덕스의 상태 관리는 일련의 순서로 진행된다. 
액션 객체 생성 → 스토어로 전달 → 리듀서가 액션 객체를 수신 → 액션 타입에 따라 전달받은 패이로드를 가지고 스토어 상태 변경

이러한 일련의 과정은 모두 동기적으로 일어난다. 
가령 API 통신같은 외부 리소스를 가져와야하는 경우에는 리덕스 플로우 만으로는 해결할 수 없다. 

그래서 리덕스는 미들웨어 개념을 이용해서 액션에서 스토어 상태 변경 프로세스 중간에 비동기 로직을 끼워 넣을수 있도록 방법을 마련해 주었다. 
이러한 미들웨어 패키지가 redux-thunk와 redux-saga 같은 리덕스 생태계 패키지다. 

이번 글에서는 타입스크립트로 리덕스 사가를 사용하는 방법에 대해 정리해 보겠다.


## 설치 

리덕스 사가와 타입 패키지를 프로젝트에 설치한다.

```
$ npm i redux-saga @types/redux-saga
```

리덕스 미들웨어이기 때문에 스토어 스토어 생성 로직에 사가를 추가해야한다. 
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

루트 리듀셔를 가져와 스토어를 생성한뒤 리턴하는 `configureStore` 함수가 전부다. 

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

다운받은 리덕스 사가 패키지에 `createSagaMiddleware()` 는 사가 미들웨어를 생성하는 함수다.
이함수로 `sagaMiddleware`를 만들어 리덕스 패키지에서 제공하는 `applyMiddleware()` 함수의 인자로 전달하여 리덕스 미들웨러로 사가 미들웨어를 장착하였다. 
그리고 나서 사가 미들웨어의 `run()` 함수로 루트 사가를 실행해 주면 스토어 작업은 끝난다.

이제는 여기에 전달한 rootSaga 모듈을 만들 차례다. 
sagas/index.ts 파일에 루트 사가 코드를 아래와 같이 작성한다.

```ts
import {takeEvery, call, put} from 'redux-saga/effects'

function* rootSaga() {
  yield console.log('hello world')
}

export default rootSaga 
```

제너레이터로  `rootSaga`를 만들었다. 
어플리케이션을 구동하면 루트 사가가 실행되어 'hello world' 문자열이 콘솔에 찍히는 것을 확인할 수 있다. 


비동기 작업을 세분화 (요청, 성공, 실패)

그럼 사가로 할 수 있는 일은 뭘까? 질문을 좀 바꾸자. 리덕스로 만든 어플리케이션에서 사가의 역할은 뭘까? 

> 사이드 이펙트를 더 쉽게 관리하고 더 효과적으로 실해하고, 더 쉽게 테스트하고 더나은 에레 처리를 할수 있게 만드는 것이 목표 

라고 한다. 

여기서 사이드 이팩트라고 하는건 비동기 작업을 가리키는데 API 통신이나 유저 인터렉션을 말한다. 
하긴 리덕스 동작은 모두 동기적으로 처리해야하는데 이에 반해 이러한 작업은 반하기 때문에 사이드 이펙트라고 명칭했는지 모르겠다. 

어쨌든... 이러한 비동기 작업을 세분화하기 위해서는 먼저 기존의 액션을 더 세분화할 필요가 있다. 
원래는 데이터 가져오는 것을 그져 FETCH_MEMO_LIST 라는 액션으로만 사용했다. 

하지만 비동기는 세 단계로 나눠 볼수 있겠다.

* *_REQUEST: 비동기 요청 (예: FETCH_MEMO_LIST_REQUEST)
* *_SUCCESS: 비동기 요청 성공 (예: FETCH_MEMO_LIST_SUCESS)
* *_FAILURE: 비동기 요청 실패 (예: FETCH_MEMO_LIST_FAILURE)

분류한 기준은 유저 피드백이다. 
_REQUEST 액션타입은 비동기 요청이 시작됨을 보여준다. 
데이터 로딩시까지 화면에 로딩중 메세지를 보여줄수 있을 것이다. 
_SUCCESS 액션타입은 비동기 요청이 성공한 경우다. 
데이터를 화면에 보여줄수 있는 단계다. 
_FAILURE 액션타입은 비동기 요청이 실패한 경우다. 
실패 원인이나 다음 행동을 유저에게 보여줄 수 있을 것이다.

기존의 액션은 이러한 기준으로 쪼개어보자. 
actions/types.ts 파일에 있는 FETCH_MEMO_LIST 액션을 다음과 같이 세개 액션으로 재 정의하자.

```ts
export const FETCH_MEMO_LIST_REQUEST = 'FETCH_MEMO_LIST_REQUEST'
export const FETCH_MEMO_LIST_SUCCESS = 'FETCH_MEMO_LIST_SUCCESS'
export const FETCH_MEMO_LIST_FAILURE = 'FETCH_MEMO_LIST_FAILURE'
```

메모 목록 조회를 요청하기 위한 액션 생성자를 만들겠다. 
actions/index.ts에  아래 코드를 작성한다.

```ts
export interface FetchMemoListAction {
  type: typeof types.FETCH_MEMO_LIST_REQUEST
}

export const fetchMemoList = (): FetchMemoListAction => ({
  type: types.FETCH_MEMO_LIST_REQUEST,
})
`

컴포넌트에서 이 액션 생성자로 메모 목록 패치 요청 액션을 발행하면 이를 리덕스 사가에서 감시할 수 있다. 
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

리덕스 사가 패키지에서 제공하는 다양한 이팩터 함수중에 `takeLatest()` 함수는 스토어에 들어오는 액션을 보고  있다가 특정 액션만 잡아서 로직을 수행해주는 기능을 한다. 
메모 목록 조회 요청 액션이 들어오면 `fetchMemoList$()` 제네레이터를 실행하는 코드다. 

API 호출을 한뒤 결과 값을 받아 리덕스에 데이터 추가하는 순서로 함수 본체를 만들어 보자.

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
전달 받은 함수가 프라미스를 반환하는 경우 프라미스가 처리될때까지 제너레이터를 중지 시킨다. 
프라미스가 리졸브(resolve)되면 그 값으로 제네레이터를 재게하고 리젝트(reject)되면 제네레이터는 에러를 던지는 동작을 한다. 

api.fetchMemoList가 프라미스를 반환하기 때문에 api 성공시 메모 목록을 배열형태로 넘여준다. 
이것을 스토어 상태에 저장하기 위해 그 다음단계 액션인  `FETCH_MEMO_LIST_SUCCESS` 타입에 패이로드로 액션을 발행해야한다.

이팩터 중에 `put()` 함수는 액션을 스토어로 디스패치하는 역할을 한다. 이 함수로 FETCH_MEMO_LIST_SUCCESS 액션을 발행했다. 

여기까지가 fetchMemoList$ 사가 함수의 역할이다. 

패치해온 데이터로 스토어 상태를 갱신하는것은 리듀서의 몫이다. 
새로운 메모 목록 데이터로 스토어 상태를 갱신했던 리듀서는 FETCH_MEMO_LIST 액션이 아니라 FETCH_MEMO_LIST_SUCCESS 액션을 보고 갱신해야한다.

```ts
const memoReducer = (state = initialState, action: MemoActionTypes): MemoState => {
  switch (action.type) {
    case types.FETCH_MEMO_LIST_SUCCESS:
      return {
        ...state,
        memos: action.payload.map(memo => ({ ...memo }))
      }
```

여기까지가 리덕스에서 비동처리의 한 사이클이다. 좀 복잡해 보이니깐 중간 정리해보자.

컴포넌트는 요청 액션을 디스패치해서 스토어에게 비동기 요청을 알린다. 
사가는 스토어로 들어오는 액션을 감시하고 있다가 요청 액션을 발견하면 특정 함수를 실행한다.
이 함수는 제네레이터로서 비동기 로직을 제아하는 역할을 한다.
call() 함수로 API를 호출하고 결과를 받는다.
put() 함수로 받은 데이터를 저장하는 액션을 발행한다.
리듀서는 이 액션을 받아 스토어를 갱신한다.

기본 흐름을 머리에 딱 붙잡고, 예제 몇 가지를 살펴보면서 리덕스 사가 사용법을 익혀보자.


## 메모 조회: API 호출중임을 피드백

첫 번째 예제로 메모 로딩 피드백을 만들어 보겠다. 
컴포넌트가 생성되고 데이터 조회 요청을 시작하면 데이터를 수신할때 까지 화면에 로딩중 메세지를 보여준다. 

api 요청중임을 알수 있는 apiCalling 이라는 스토어 상태값을 추가한다. 
api 요청등 어플리케이션 전반에서 사용되는 스토어 상태를 recuers/app.ts 에 정의하자.

```ts
export interface AppState {
  apiCalling: boolean
}

const initialState: AppState = {
  apiCalling: false
}
```

_REQUEST 요청이 오면 상태를 apiCalling을 true로 변경해서 api 통신 중임을 알리수 있다. 
반대로 false로 변경하기 위해서 CLEAR_API_CALL_STATUS 액션 타입을 별도로 사용하겠다.

```ts
type AppActionTypes = ClearApiCallStatusAction

const appReducer = (state: AppState = initialState, action: AppActionTypes): AppState => {
  switch (action.type) {
    case types.FETCH_MEMO_LIST_REQUEST:
      return {
        ...state,
        apiCalling: true
      }
    case types.CLEAR_API_CALL_STATUS:
      return {
        ...state,
        apiCalling: false
      }
  }
}

export default appReducer
```

`FETCH_MEMO_LIST_REQUEST` 액션이 들어오면 `apiCalling`을 true로 변경한다. 
반대로 CLEAR_API_CALL_STATUS 액션이 오면 false로 변경한다. 

FETCH_MEMO_LIST_REQUEST 액션이 발행되면 이제는 두 가지 행동이 일어난다. 
사가에서 감시하고 있어서 fetchMemoList$() 제네레이터 함수가 동작하고 동식에 리듀서에서 apiCalling이 true로 변경된다.

그럼 CLEAR_API_CALL_STATUS 액션은 언제 디스패치 될까? 눈치 빠른 독자라면 사가 함수라는 것을 알것이다. 

```ts
function* fetchMemoList$() {
  try {
    const memos = yield call(api.fetchMemoList)
    yield put({ type: FETCH_MEMO_LIST_SUCCESS, payload: memos })
  } catch (err) {
    // 실패 로직: 나중에 작성할 것임 
  } finally {
    yield put({ type: CLEAR_API_CALL_STATUS })
  }
}
```

try 구문에서 정상 로직이 수행된 catch 구문에서 실패 로직이 수행된다. 
두 로직은 결국엔 finally 구문으로 수렴하는데 이때 api 요청이 끝났음을 알리는 CLEAR_API_CALL_STATUS 액션을 발행하면 된다.

그럼 이것을 컴포넌트에서 가져와 화면에 그려보자.
스토어와 연결된 메모 목록 컨테이너를 먼저 보겠다. containers/MemoList.tsx

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

apiCalling과 memos 배열, fetchMemoList 액션 생성 함수를 프로퍼티로 받는다. 
컴포넌트 마운트 후에는 이 액션을 발행해서 스토어가 메모 목록을 패치하도록 요청한다.
리듀서에 의해 apiCalling은 true로 변경되고 fetchMemoList$ 제네레이터 함수에 의해 api 요청이 일어날 것이다. 

컨테이너 컴포넌트와 스토어를 바인딩한다.

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

변경된 apiCalling 의 true 값은 connect 함수에 전달한 mapStateToProps 함수에 의해 컴포넌트에 연결될 것이다. 
api 요청으로 획득한 메모목록도 컨테이너의 memos 속성에 연결되어 들어가게 된다.

그럼 이것을 가지고 출력하는 메모 목록 페이지 컴포넌트에 피드백을 추가해 보자
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
그렇지 않을 경우는 두 가지 인데 api 요청중이라면 요청 중임을 나타내는 Skellon 을 출력한다. 아니면 데이터가 없을 경우이므로 null을 반환해서 출력하지 않도록한다.

결과를 보자. 

![](/assets/imgs/2019/07/22/fetch01.png)

FETcH_MEMO_LIST_REQUEST 액션이 발행되고 리듀서에 의해 apiCalling이 true로 세팅되었다. 
컴포넌트에서는 이 상태를 보고 로딩중임을 렌더링한다.

![](/assets/imgs/2019/07/22/fetch02.png)

api 조회응답이 오면 fetch_memo_list_success가 디스패치되어 스토어 상태에 api 응답값이 저장된다.
컴포넌트에서는 데이터를 렌더링한다.

![](/assets/imgs/2019/07/22/fetch03.png)

최종적으로 api 요청을 완료하는 clear_api_CALL_STATUS 가 발행되고 apiCalling 상태가 false 로 변경된다.


여기까지만 작성해야겠다. 나머지는 다음 글에서 설명해야겠다.

## 정리 

