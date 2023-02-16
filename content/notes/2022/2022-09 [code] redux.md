```
wc -l `find ./src -name '*.ts*'`

      88 ./src/applyMiddleware.ts
     369 ./src/createStore.ts
      30 ./src/types/middleware.ts
      61 ./src/types/actions.ts
      79 ./src/types/reducers.ts
     278 ./src/types/store.ts
      17 ./src/utils/actionTypes.ts
      14 ./src/utils/isPlainObject.ts
      70 ./src/utils/kindOf.ts
      18 ./src/utils/warning.ts
      15 ./src/utils/formatProdErrorMessage.ts
      10 ./src/utils/symbol-observable.ts
     201 ./src/combineReducers.ts
      83 ./src/bindActionCreators.ts
      61 ./src/compose.ts
      68 ./src/index.ts
    1462 total
```

# applyMiddleware.ts

// Creates a store enhancer that applies middleware to the dispatch method of the Redux store.
// 스토어 엔핸서를 만들어 리덕스 스토어의 디스패치 메소드에 미들웨어를 적용한다.

func applyMiddleware // 뭔가 미들웨어인것 같은데.. 나중에 다시보자

- return (createStore) =>
  - const store = createStore
  - const middlewareAPI = { getState, dispatch }
  - const chain = middlewares.map(m => m(middlewareAPI))
  - dispatch = compose(...change)(store.dispatch)
  - return { ...store, dispatch }

# bindActionCreators.ts

// 편의를 위한 메소드. store.dispatch(MyActiounCreator.doSomthis()) 으로 사용할수 있다.
func bindActionCreator(actionCreator, dispatch)

- return func(this, ...args)
  - return dispatch(actionCreator.apply(this, args)) // 왜 이렇게 할까?

func bindActionCreators

- const boundActionCreators = {}
- for (const key in actionCreators)
  - const actionCreator = actionCreators[key]
  - 함수일경우: boundActionCreators[key] = bindActionCreator(actionCreator, dipatch)
- return boundActionCreators

# combineReducers.ts

func getUnexpectedStateShapWarningMessage

- 인자 검사
- 경고 메세지 반환

func assertReducerShap(reducers)

- // 초기값은 undefined대신 null을 써야 → 무슨 의미?

func combineReducers(reducers)

- try { assertReduceShap(finalReducers) } catch (e) { shapeAsserionError = e} // assert를 이런식으로 사용하구나
- return func combination(state, action)
  - const nextState = {}
  - for // reduerKey를 순회
    - const nextStateForKey = reducer(previousStateForKey, action) // 계산 결과
    - nextState[key] = nextStateForKey // 저장
    - // 얕은 비교. 무거운 비교연산보다 코딩할 때 규칙을 지키는 방법으로 구현
    - hasChanged = hasChanged || nextStateForKey !== previousStateForKey
  - return hasChanged ? nextState: state // 다음 상태 반환

# compose.ts

// 함수형에서 컴포스 많이 쓰이더라
func compose(...funcs)

- if (funcs.length === 0) return (arg) => arg
- if (funcs.length === 1) return funcs[0]
- return funcs.reduce((a,b) => (...args) => a(b(...args)) // 이런게 곧장 이해안되

# createStore.ts

// 1. 스토어
// 2. dispatch로 변경
// 3. reducer를 정의하고 합쳐

// 하이드레이트: 서버에서 온 값. 세션으로 부터 이전 상태 복구

func createStore(reducer, preloadedState, enhancer)

- // 인자 검사
- currentReducer
- currentState
- currentListeners
- nextListenrs
- isDispatching
- func ensuerCanMutateNextListerns // ?
- func getState
  - return currentState // 현재 상태 반환
- func subscribe(listener)
  - // 인자 검사
  - ensureCanMutateNextListeners() // 다음 리스너를 추가할수 있는지 확인
  - nextListenrs.push(listener) // 리스너 배열에 추가
  - return func unsubscribe
    - // 이미 구독취소한 경우 얼리 리턴
    - // 디스패칭 중이면 오류 발생
    - isSubscribed = false
    - ensucreCanMuteateNextListenrs()
    - const index = nextListenrs.indexOf(listenr)
    - nextListers.splice(index, 1) // 이런 코드는 자주 쓰이더라. 외우자.
    - currentListenrs = null // 삭제?
- func dispatch(action)
  - // 인자 검사
  - // 리슈서를 호출해 다음 상태 계산
  - // 리스터 호출
  - 액션 반환 // 왜?
- func replaceReducer
- func observable
  - [\$\$observable]() { return this } // 심볼을 이렇게 사용하는구나
- const store { dispatch, subscribve, getState, repalceReducer, [$$observable] }
- return store

# index.ts

func isCrushed() {} // 개발 환경에서 압축하면 경고. 기법.

export

- createStore
- combineReducers
- bindActionCreators
- applyMiddleware
- compose

# types/actions.ts

interface Action<T = any>

- type: T

interface AnyAction extends Action // type 이 있는건 어떤 것이라도 무방

- [extraprops: string]: any

// 헷갈리지 말것
// action은 페이로드
// actionCreator는 팩토리
// Sometimes we say _bound action creators_ to mean functions that call an action creator
// and immediately dispatch its result to a specific store instance → 다른 코드에서 봤어
interface ActionCreator<A, P extends any[] = any[]> // 어떤 인자라도 무방

- (...args: P): A

interface ActionCreatorsMapObject<A = any, P extends any[] = any[]> // mapObject란 표현을 쓴는 군

- [key: string]: ActionCreator<A, P>

# types/middleware.ts

interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any>

- dispatch: D
- getState(): S

// 이게 뭐시여?
interface Middleware<\_DispatchExt = {}, S = any, D extends Dispatch = Dispatch>

- (api: MiddlewareAPI<D, S>)
  - return (action: D extends Dispatch<infer A> ? A : never) => any

# types/reducers.ts

이쪽이 무언가 핵심 코드인듯 하다.

주석 요약

- 리듀서(리듀싱 함수) 누적값과 값을 받고 새로운 누적값을 반환
  - 여러 값을 줄여서 하나로 만든다
- 리듀서는 특별한 것이 아니다. 함수형 프로그래밍의 기초다
  - 자바스크립트에도 빌트인 api가 있다
- 리덕스에서 누적값은 상태 객체다. 값은 액션에 의해 누적된다.
  - 리듀서는 이전 상태와 액션에 따라 새로운 상태를 계산한다.
  - 반드시 순수함수여야한다. 부수효과와 무관하기 위해.
  - 핫리로딩이나 시간여행같은 멋진 기능이 가능하다
- 리듀서는 리덕스의 가장 중ㅇy한 개념이다
- 리듀서에서 API를 put 금지

type Reducer<S = any, A extends Action = AnyAction>

- (state: S | undefined, action: A) => S

type ReducersMapObject<S = any, A extends Action = AnyAction>

- [K in keyof S]: Reducer<S[K], A>

// ?
type ReducerFromReducersMapObject<M> = M extends {
[P in keyof M]: infer R
}
? R extends Reducer<any, any)
? R
: never
: never

type ActionFromRedyucer<R> = R extends Reducer<any, infer A> ? A : never

type ActionFromReducersMapObject<M> = M extends ReducersMapObject
? ActionFromRedcuer<ReducerFromREducersMapObject<M>>
: never

# types/store.ts

type ExtendState<State, Extension> = [Extension] extends [naver]
? State
: State & Extendsion

interface EmptyObject

- readonly [$CombinedState]?: undefined
  type CombinedState<S> = EmptyObject & S

# utils/actionTypes.ts

# utils/formatProdErrorMessage.ts

# utils/isPlainObject.ts

# utils/kindOf.ts

# utils/symbol-observable.ts

# utils/warning.ts
