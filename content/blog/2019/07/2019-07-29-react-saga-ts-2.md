---
slug: "/dev/2019/07/29/react-saga-ts-2.html"
date: 2019-07-29
title: "리덕스 사가 사용하기 (타입스크립트 버전) - 2편"
layout: post
category: 개발
tags: [react, TypeScript]
---

[이전 글](/dev/2019/07/22/react-saga-ts-1.html)에 이어서 리덕스 사가 예제를 몇 가지 만들어 보자.

## 메모 추가: 버튼 상태와 리다이렉션

기존에 만들어 둔 메모 추가 화면은 아래와 같다.

![메모 추가 화면](/assets/imgs/2019/07/29/addmemo.png)

여기에 메모 추가하는 로직을 아래처럼 작성하고 싶다.

- 저장 버튼을 클릭하면
- 메모 추가 버튼을 비활성화해서 추가 입력을 막는다
- 메모 추가 API 요청이 발생하고
- API 응답을 받으면 스토어에 저장한다
- 유저에게 추가한 메모 조회 화면으로 이동함을 피드백 한 뒤
- 추가한 메모 조회 화면으로 이동한다

전부 비동기 로직이다. 이를 어떻게 사가로 제어하는지 알아보자.

먼저 세 가지 액션을 정의한다. actions/types.ts

```ts
export const ADD_MEMO_REQUEST = "ADD_MEMO_REQUEST"
export const ADD_MEMO_SUCCESS = "ADD_MEMO_SUCCESS"
export const ADD_MEMO_FAILURE = "ADD_MEMO_FAILURE"
```

컴포넌트에서 `ADD_MEMO_REQUEST` 액션을 디스패치 할 수 있도록 액션 생성자 함수를 만든다.
actions/index.ts

```ts
export interface AddMemoAction {
  type: typeof types.ADD_MEMO_REQUEST
  payload: Memo
}
ㅍ
export const addMemo = (memo: Memo): AddMemoAction => ({
  type: types.ADD_MEMO_REQUEST,
  payload: memo,
})
```

액션이 디스패치되면 이 액션 타입을 사가에서 감시하고 있다가 비동기 로직이 동작하게끔 만들수 있다.
sagas/index.ts

```ts
import { takeLatest } from 'redux-saga/effects'

export default function* rootSaga() {
  takeLatest(ADD_MEMO_REQUEST, addMemo$),
}

function addMemo$(action: AddMemoAction) {
  // 여기에 메모 추가 로직을 담는다
}
```

`takeLatest()` 함수로 `ADD_MEMO_REQUEST` 액션을 감시하고 있다가 `addMemo$()`를 실행하도록한다.
이 제네레이터는 액션 객체를 인자로 받는데 미리 정의한 `AddMemoAction` 인터페이스를 이용해 전달받은 액션 구조를 정확히 추적할 수 있다.

이 액션 객체를 이용해 메모 추가 로직 작성해 보자.

```ts
function* addMemo$(action: AddMemoAction) {
  const { payload } = action
  if (!payload) return

  try {
    // 메모 추가 api 호출
    const memo = yield call(api.addMemo, payload)

    // 스토어 상태에 메모 저장
    yield put({ type: ADD_MEMO_SUCCESS, payload: memo })

    // 얼럿창으로 유저에게 피드백
    yield put({
      type: SHOW_DIALOG,
      payload: {
        type: "alert",
        text: "메모가 생성되었습니다. 메뉴 수정 화면으로 이동합니다.",
      },
    })

    // 얼럿을 닫을 때까지 대기
    yield take(CONFIRM_DIALOG)

    // 생성된 메모 조회 화면으로 이동
    yield put(push(`/memo/${memo.id}`))
  } catch (err) {
    // 에러 처리
  } finally {
    // API 통신 종료
    yield put({ type: CLEAR_API_CALL_STATUS })
  }
}
```

프라미스를 반환하는 `api.addMemo()` 함수를 `call()` 이팩트로 실행했다.
액션으로 받은 페이로드를 인자로 전달했는데 이것은 `AddMemoAction` 타입의 페이로드가 `Memo` 타입이기 때문이다. (`api.addMemo()`는 `Memo` 타입을 인자로 받는다)

Api 응답에 성공하면 메모 데이터를 얻을 수 있는데 이것을 스토어 상태로 저장하기 위해 `ADD_MEMO_SUCCESS` 액션을 발행한다.
사가는 액션만 발행하고 상태 갱신은 리듀서의 몫으로 남겨 두는 것이 사가 작성의 묘미다.

다음은 미리 만들어둔 다이얼로그 액션 `SHOW_DIALOG`을 디스패치하여 팝업창을 띄웠다.
입력한 메모가 생성되었다는 메세지를 피드백한다.

유저가 다이얼로그를 닫으면 `CONFIRM_DIALOG` 액션이 발행하는데 이때까지 사가 로직을 대기하도록 `take()` 이펙트 함수를 사용했다.

유저 피드백 후 생성된 메모 조회 화면 이동하도록 한다.
이것을 위해 `push()` 함수를 사용했는데 주소 이동을 위한 액션 생성자 함수를 반환한다.
connected-redux-router 패키지에서 가져왔다.

사가 함수의 최종 종착지인 `finally` 구문에서는 api 작업 종료를 의미하는 `CLEAR_API_CALL_STATUS` 액션을 발행했다.

이렇게 제네레이터로 작성하는 리덕스 사가함수를 이용하면 비동기 로직을 비교적 간편하게 관리할수 있다.

한편 컴포넌트에서는 어떻게 사용했는지 살펴보자.
containers/AddMemo.tsx

```tsx
interface Props {
  apiCalling: boolean
  addMemo(memos: Memo): AddMemoAction
}

class AddMemoContainer extends React.Component<Props> {
  render() {
    return <AddMemoPage {...this.props} />
  }
}
```

Api 호출 상태를 나타내는 `apiCalling` 과 `ADD_MEMO_REQUEST` 액션을 발행하는 `addMemo()` 함수를 속성으로 받는 `<AddMemoContainer />` 컴포넌트를 정의했다.
컨테이너는 스토어로부터 이 정보를 받아 `<AddMemoPage />` 컴포넌트로 전달하는 역할만 한다.

```ts
const mapStateToProps = (state: RootState) => ({
  apiCalling: state.app.apiCalling,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      addMemo,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMemoContainer)
```

`connect()` 함수로 스태이트의 `apiCalling` 값을 주입하고 `addMemo()` 액션 생성자 함수를 디스패치 하도록 연결했다.

계속해서 메모 추가 페이지 컴포넌트를 보자.
pages/memo/AddMemoPage.tsx

```tsx
interface Props {
  apiCalling: boolean;
  addMemo(memo: Memo): void;
}

class AddMemoPage extends React.Component<Props> {
  handleChange = (evt: React.FormEvent<HTMLTextAreaElement>) => {
    const {value} = evt.currentTarget;
    this.setState({ value })
  }

  handleClickSave = () => {
    const { addMemo } = this.props;
    const {value} = this.state;
    const content = value.trim();
    if (!content) return;

    // ADD_MEMO_REQUEST 타입의 액션을 디스패치 한다
    addMemo({ content })
  }

  render() {
    const {apiCalling} = this.props;
    const {value} = this.state;
    return (
      <React.Fragment>
        <form>
          <textarea
            value={value}
            onChange={this.handleChange}
          />
        </form>
        <Button to="/memo">취소</Button>
        <Button
          // api 요청상태에 따라 버튼을 비활성화 한다
          disabled={apiCalling}
          onClick={this.handleClickSave}
        >저장</Button>
      </React.Fragment>
}
```

속성으로 받은 `apiCalling` 값에 따라 맨 아래 저장 버튼이 비활성화 된다.
저장 버튼을 클릭하면 `handleClickSave()` 메소드가 동작하는데, 속성으로 받은 `addMemo()` 함수를 실행해서 입력한 값을 전달한다.

결과 화면을 같이 살펴보자.

![add01](/assets/imgs/2019/07/29/add01.png)
새로운 메모를 작성중이다.

![add02](/assets/imgs/2019/07/29/add02.png)
`ADD_MEMO_REQUEST` 타입의 액션이 발행되었다.
`apiCalling` 상태값이 세팅되어서 이것과 연결된 저장 버튼이 비활성화 되었다.

![add03](/assets/imgs/2019/07/29/add03.png)
`ADD_MEMO_SUCCESS` 액션과 `SHOW_DIALOG` 액션이 발행되었다.
좌측 메모 목록에 세번째 메모가 추가 되었고 다이얼로그가 보인다.

![add04](/assets/imgs/2019/07/29/add04.png)
다이얼로그의 확인 버튼을 클릭하면 `CONFIRM_DIALOG` 액션이 발행되어 다이얼로그 창이 닫힌다.

![add05](/assets/imgs/2019/07/29/add05.png)
새로 만든 메모 조회 화면(/memos/3) 으로 이동했다.

## 비동기 처리 실패 피드백: 토스트 띄우기

지금까지 사가함수에서 실패처리는 비어있는 `catch` 구문으로 남겨 두었다. 모두 api 통신을 다루는 함수 였는데 실패한다면 어떻게 처리하는 것이 좋을까?

![toast gif](/assets/imgs/2019/07/29/toast00.png)

실패 메세지를 우측에 보이는 토스트로 보여주는 기능을 만들어 보자.

먼저 토스트를 리덕스로 관리하기 위한 모델부터 정의한다.
models/index.ts

```ts
export interface Toast {
  id: number
  text: string
}
```

토스트는 한 개 이상 보일수 있기 때문에 식별할 수 있는 `id`를 갖도록 했다.
각 토스트의 메세지는 `text` 변수에 저장한다.

스토어 상태에 토스트 배열을 담기 위한 `toasts` 상태를 추가한다.
토스트도 `apiCalling` 상태와 비슷하게 어플리케이션 전방에 사용하는 것이므로 reducers/app.ts 에 정의한다.

```ts
export interface AppState {
  apiCalling: boolean
  toasts: Toast[] // 토스트 배열을 상태로 추가한다
}

const initialState: AppState = {
  apiCalling: false,
  toasts: [], // 초기 값은 빈 배열이다
}
```

토스트 상태를 관리한 세 가지 액션 타입을 정의한다.

- `SHOW_TOAST`: 토스트를 보여준다
- `ADD_TOAST`: 스토어 상태에 토스트를 추가한다
- `REMOVE_TOAST`: 스토어 상태에서 토스트를 제거한다

상태를 갱신하는 리듀서부터 추가해 보자.
reducers/app.ts

```ts
const appReducer = (
  state: AppState, initialState,
  action: AppActionTypes
): AppState => {
  switch (action.type) {

    // ADD_TOAST 액션
    case types.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      }

    // REMOVE_TOAST 액션
    case types.REMOVE_TOAST:
      const toastId = action.payload;
        return {
          ...state,
          toasts: state.toasts.filter(toast => toast.id !== toastId)
        }
```

토스트 추가 액션은 기존 배열에 새로운 토스트 객체를 추가한다.
반대로 토스트 제거 액션은 특정 아이디의 토스트를 배열에서 제거한다.

리듀서 로직을 작성했으면 `SHOW_TOAST` 액션 타입을 위한 사가 함수를 만들 차례다.
sagas/index.ts

```ts
import { takeEvery } from "redux-saga/effects"

export default function* rootSaga() {
  // 모든 SHOW_TOAST 액션을 감시한다
  yield takeEvery(SHOW_TOAST, showToast$)
}

export interface ShowToastAction {
  type: typeof types.SHOW_TOAST
  payload: string
}

function* showToast$(action: ShowToastAction) {
  // 토스트 출력 로직을 작성한다
}
```

최신 발행된 액션 타입만 감시하는 `takeLatest()` 이팩터와 달리 `takeEvery()`는 발행되는 모든 액션 타입을 감시한다.
`SHOW_TOAST`가 여러개 디스패치 되더라도 모두 잡아내서 `showToast$()` 제네레이터를 실행하도록 설정했다.

이 함수는 `action` 인자를 받는데 `ShowToastAction` 타입으로 정의했다.
토스트에 출력할 문자열만 패이로드로 받는다.

사가를 마져 작성하자.

```ts
// 토스트 아이드로 사용한다
let _id: number = 0

function* showToast$(action: ShowToastAction) {
  const nextId: number = _id + 1
  _id = nextId

  const text: string = action.payload

  // 토스트를 상태에 추가한다
  yield put({ type: ADD_TOAST, payload: { id: nextId, text } })

  // 3초 대기한다
  yield delay(3000)

  // 토스트를 상태에서 제거한다
  yield put({ type: REMOVE_TOAST, payload: nextId })
}
```

토스트 식별자를 위해 `_id` 변수를 두었다.
제네레이터가 실행될 때마다 하나씩 증가하여 새로운 토스트의 아이디로 사용한다.

아이디와 액션 패이로드로 받은 문자열로 `ADD_TOAST` 액션을 발행했다.
3초 후에 `REMOVE_TOAST` 액션을 발행해서 토스트를 상태에서 제거했다.
리덕스 이팩터 중 `delay()`함수는 실행을 지연시키는 역할을 한다.

이렇게 해서 토스트 관리 로직을 준비했다.
이걸 이용해 api 실패시마다 토스트에 적절한 메세지를 뿌리도록 구현해 보자.

모든 api는 `_FAILURE` 로 끝나는 액션을 발행하는 점을 이용해 이를 감시하는 제네레이터를 만든다.

```ts
export default function* rootSaga() {
  yield takeEvery(SHOW_TOAST, showToast$)

  // 모든 실패 액션을 처리한다
  yield takeEvery((action: any) => {
    return action.type.endsWith("_FAILURE")
  }, handleFailure$)
}
```

`takeEvery()` 이팩터는 액션 타입 문자열을 받지만 타입의 패턴을 계산하는 함수를 받을 수도 있다.
`_FAILURE` 로 끝나는 액션타입을 모두 감지해서 `handleFailure$()` 제네레이터를 실행하도록 했다.

```ts
function* handleFailure$(action: { payload: any }) {
  const { payload } = action

  if (isString(payload)) {
    yield put({ type: SHOW_TOAST, payload })
  }
}
```

실패 액션은 패이로드로 여러 가지를 받을 수 있더록 `any`로 받았다.
패이로드가 문자열일 경우 `SHOW_TOAST` 액션을 발행하고 토스트를 띄우도록 했다.

그럼 메모 추가 사가 함수의 비어있는 `catch` 구문에 에러 문자를 토스트로 띄우도록 해보자.

```ts
function* addMemo$(action: AddMemoAction) {
  try {
    // ...
  } catch (err) {
    yield put({
      type: ADD_MEMO_FAILURE,
      payload: "메모 추가에 실패했습니다.",
    })
  }
}
```

`ADD_MEMO_FAILURE` 액션을 발행했는데 `_FAILURE` 로 끝나는 액션 타입이기 때문에 이를 감시하고 있는 사가함수에 의해 `handleFailure$()` 사가가 동작할 것이다.

이제 스토어에 있는 토스트 상태와 컴포넌트를 연결한다.

전체 화면을 제어하는 레이아웃 컴포넌트에 토스트 리스트 컴포넌트를 추가한다.
compoentns/Layout.tsx

```tsx
const Layout: React.FC = props => {
  <React.Fragment>
    // 토스트 리스트 컨테이너를 추가한다
    <ToastListContainer />
    <div>{props.children}</div>
  </React.Fragment>
```

토스트 리스트 컨테이너를 살펴 보자.
containers/ToastList.tsx

```tsx
interface Props {
  toasts: Toast[]
}

class ToastListContainer extends React.Component<Props> {
  render() {
    return <ToastList {...this.props} />
  }
}

export default connect(
  (state: RootState) => ({
    // 스토어에 있는 toasts 상태를 컨테이너 속성으로 연결한다
    toasts: state.app.toasts,
  }),
  {}
)(ToastListContainer)
```

스토어의 `toast` 상태를 컴포넌트와 연결하고 나머지는 토스트 목록 컴포넌트에 위임한다.

토스트 목록 컴포넌트를 보자.
components/ToastList.tsx

```tsx
interface Props {
  toasts: Toast[]
}

const ToastList: React.FC<Props> = props => {
  ;<div>
    {props.toasts.map((toast, idx) => {
      return <ToastItem toast={toast} key={idx} />
    })}
  </div>
}
```

속성으로 받은 토스트 배열을 화면에 그려주는 역할이다.

그럼 화면으로 확인해 보자.

![toast01](/assets/imgs/2019/07/29/toast01.png)
새로운 메모를 작성한다.

![toast02](/assets/imgs/2019/07/29/toast02.png)
메모 추가에 실패하여 `ADD_MEMO_FAILURE` 액션 타입과 에러 메세지로 구성된 액션 객체가 스토어로 디스패치 된다.

![toast03](/assets/imgs/2019/07/29/toast03.png)
실패 액션 타입을 감시한 사가에 의에 `SHOW_TOAST` 액션이 발행된다.

![toast04](/assets/imgs/2019/07/29/toast04.png)
`ADD_TOAST` 액션에 의해 토스트 상태가 추가 되고 화면에 토스트가 나온다.

![toast05](/assets/imgs/2019/07/29/toast05.png)
설정한 3초 경과후 `REMOVE_TOAST` 액션이 발행되어 상태에서 토스트가 제거되고 화면에서도 사라진다.

## 사가 모듈화

지금까지 작성한 사가 모듈을 한 번 보자.
sagas/index.ts

```ts
export default function* rootSaga() {
  // 메모 사가
  yield takeLatest(FETCH_MEMO_LIST_REQUEST, fetchMemoList$),
    yield takeLatest(ADD_MEMO_REQUEST, addMemo$),
    // 어플리케이션 사가
    yield takeEvery(SHOW_TOAST, showToast$),
    yield takeEvery((action: any) => {
      return action.type.endsWith("_FAILURE")
    }, handleFailure$)
}
```

액션이 많아질수록 사가 함수 갯수도 늘어날텐데 이런식으로 하나의 제네레이터로만 관리하면 한계에 이른다.
메모 관련한 사가와 어플리케이션 사가로 나누었는데 이 녀석들을 서브 사가 함수로 분리할 수 있다.

먼저 메모 사가를 sagas/memo.ts 파일에 분리해 보자.

```ts
export default function* memoSaga() {
  yield takeLatest(FETCH_MEMO_LIST_REQUEST, fetchMemoList$),
  yield takeLatest(ADD_MEMO_REQUEST, addMemo$),
}
```

모두 `yield` 할 것이 아니라 `all()` 이펙트로 동시에 처리하자.

```ts
import { all } from "redux-saga/effects"

export default function* memoSaga() {
  yield all([
    takeLatest(FETCH_MEMO_LIST_REQUEST, fetchMemoList$),
    takeLatest(ADD_MEMO_REQUEST, addMemo$),
  ])
}
```

어플리케이션 사가도 같은 방식으로 sagas/app.ts로 분리한다.

```ts
export default function* appSaga() {
  yield all([
    takeEvery(SHOW_TOAST, showToast$),
    takeEvery((action: any) => {
      return action.type.endsWith("_FAILURE")
    }, handleFailure$),
  ])
}
```

이렇게 분리한 서브 사가를 루트 사가에서 합칠수 있다.
sagas/index.ts

```ts
import { all, fork } from "redux-saga/effects"
import memoSaga from "./memo"
import appSaga from "./app"

export default function* rootSaga() {
  yield all([memoSaga(), appSaga()])
}
```

이렇게 작성할수도 있지만 공식 가이드 문서에 나온 [Setting up your root Saga](https://redux-saga.js.org/docs/advanced/RootSaga.html)에서는 `fork()` 함수를 사용하도록 안내한다.

```ts
export default function* rootSaga() {
  yield all([fork(memoSaga), fork(appSaga)])
}
```

둘의 차이점은 1) `fork()`는 비봉쇄(non-blocking)으로 동작하기 때문에 포크한 작업을 종료하지 않아도 후속작업을 진행한다는 점과 2) `fork()` 는 반환값을 이용해 태스크를 취소할 수 있다는 점이다.

예제에서 서브 태스크로 분리할 때는 이러한 차이점과 무관하게 동작한다.

## 정리

사가 함수를 이용한 예제를 살펴 보았다.
비동기 제어를 담당하는 사가는 다양한 함수를 통해 마치 동기 코드처럼 관리할 수 있는데 이를 이펙터라고 부른다.

- `put()`: 액션을 발행한다
- `call()`: 함수를 실행한다
- `take()`: 액션 발행을 대기한다
- `delay()`: 실행을 지연한다
- `all()`: 사가 함수를 동시에 실행한다

Api 통신과 유저 인터렉션 코드를 사가로 작성하면 비교적 쉽게 로직을 작성할 수 있다.

설명이 부족한 부분은 아래 전체 코드를 보면서 확인해 보도록하고 리덕스 이쯤해서 사가 사용법에 대한 글을 마무리하겠다.

전체 코드: [https://github.com/jeonghwan-kim/study-react-ts/tree/master/redux-saga](https://github.com/jeonghwan-kim/study-react-ts/tree/master/redux-saga)
