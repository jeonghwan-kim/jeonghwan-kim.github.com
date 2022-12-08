```
      24 ./src/next.ts
     170 ./src/types.ts
      23 ./src/alternate-renderers.ts
      23 ./src/index.ts
      63 ./src/exports.ts

       9 ./src/utils/useSyncExternalStore.ts
      17 ./src/utils/isPlainObject.ts
      16 ./src/utils/bindActionCreators.ts
      21 ./src/utils/warning.ts
       5 ./src/utils/reactBatchedUpdates.native.ts
      13 ./src/utils/batch.ts
       5 ./src/utils/useIsomorphicLayoutEffect.native.ts
      19 ./src/utils/useIsomorphicLayoutEffect.ts
     151 ./src/utils/Subscription.ts
       1 ./src/utils/reactBatchedUpdates.ts
      36 ./src/utils/shallowEqual.ts
      14 ./src/utils/verifyPlainObject.ts

     800 ./src/components/connect.tsx
      23 ./src/components/Context.ts
      64 ./src/components/Provider.tsx

      55 ./src/hooks/useDispatch.ts
      90 ./src/hooks/useSelector.ts
      31 ./src/hooks/useReduxContext.ts
      51 ./src/hooks/useStore.ts

     242 ./src/connect/selectorFactory.ts
      14 ./src/connect/mapStateToProps.ts
      14 ./src/connect/invalidArgFactory.ts
     110 ./src/connect/wrapMapToProps.ts
      78 ./src/connect/mergeProps.ts
      26 ./src/connect/verifySubselectors.ts
      25 ./src/connect/mapDispatchToProps.ts
```

# components/connect.ts

800줄 가장 핵심

useSyncExternalStore // 외부 스토어?

initializeConnect // 함수를 위에 저장

EMPTY_ARRY = [null, 0]
NO_SUBSCRIPTION_ARRAY = [null, null]

const stringifyComponent = (Comp: unknown)

func useIsomorphicLayoutEffectWithArgs // 훅 래퍼. 이걸 여기서 쓰는 군. 처음봄

func captureWrapperProps //

func subscribeUpdates // 스토어와 프롭스 변경 감지 후 통지?ㅐ

const initStatusUpdates // EMPTY_ARRAY 반환

func strictEqual // 값 비교

func connect

- const wrapWithConnect // \* 컴포넌트를 받아서 커넥트를 연결
  - func ConnectFunction // 컴포넌트
    - conextValue // 컨택스를 사용하는 것 같은데?
    - store // props 혹은 contextValue에서 가져옴 그런군
  - \_Connect = React.memo(ConnectFunction) // 메모이제이션
  - Connect = \_Connect
  - return histStatics(Connect, WrappedComponent)
- return wrapWithConnect

components/Provider.tsx

components/context.ts

interface ReactReduxContextValue

- store
- subscription: Subscription // ?
- getServerState?

create context (null as any) // any를 이렇게 사용. 괜히 초기값을 넣었네.

connect 인자로 전달

utils/subscription.ts

func createListenerCollection

func createSubscription // 테스트 코드 참고

connect/invalidArgFactory.ts

createInvalidArgFactory // connect 컴포넌트의 이상한 컴포넌트가 들어올 경우 사용

connect/mapDispatchToProps.ts

mapDispatchToPropsFactory(mapDispatchToProps)

- return
  - wrapMapToPropsConstact()
  - wrapMapToPropsFunc()
  - createInvalidArgFactory()

connect/mapStateToProps.ts

mapStateToPropsFacfory(mapStateToPRops)

- return
  - wrapMapToPropsConstant()
  - wrapMapToPropsFunc()
  - createInvalidArgFactory()

# connect/mergeProps.ts

func defaultMergeProps

func wrapMergePropsFunc

- return (dispatch, options) =>
  - func iniMergePropsProxy
    - return func mergePropsProxy
      - return mergedProps

func mergePropsFactory

- return
  - ()=> defaultMergePRops
  - wrapMergePropsFunc(mergeProps)
  - createInvalidArgFactory(mergeProps, 'mergeProps')

# connect/selectorFactory.ts

func prueFinalPropsSelectorFactory

- func handlFirstCall
- func handleNewPropsAndNewState
- func handleNewProps
- func handleNewState
- func handleSubsequentCalls
- return func pureFinalPropsSelector(nextState, nextOwnProps)
  - return
    - handleSubsequentCalls(nextState, nextOwnProps)
    - handleFirstCall(nextState, nextOwnProps)

func finalPropsSelectorFactory

- return prueFinalPropsSleectorFactory(mapStateToProps, mapDispatchToPRps, mergeProps, dispatch, options)

connect/verfiySubselectors.ts

func verify

export func verifySubselectors - verfiy(mapStateToProps, 'mapStateToProps') - verfiy(mapDispatchToProps, 'mapDispatchToProps') - verify(mergeProps, 'mergeProps')

connect/wrapMapToProps.ts

func wrapMapToPRopsConstatnt(getConstant)

- return func initConstantSelector(dispatch)
  - return constantSelector

export func getDependsOnOwnProps(mapToProps)

export func wrapMapToPropsFunc

- return func initProxySelector
  - return proxy

hooks/useDispatch.ts

export func createDispatchHook

- useStore // 훅을 사용. 이걸 봐야겠구나
- return func useDispatch
  - store = useStore() // 스토어를 가져와서
  - return store.dispatch // 디스패치를 반환

export useDispatch = /_#**PURE**_/createDispatchHook() // 위에 함수를 호출. 주석은 뭘까?

# hooks/useReduxContext.ts

export func useReduxContext

- return useContext(ReactReduxContext) // 컨택스를 사용한다는 방증이다. 그럼 어떻게 이걸 최적화하는지가 중요. 이 기술의 핵심이겠구나.

# hooks/useSelector.ts

let useSyncExternalStoreWithSelector
export const initialzeUseSelector = (fn) =>

- useSyncExternalStoreWithSelector = fn // 위 변수에 할당. 어디선가 호출한다는 얘기군

const refEquality = (a, b) => a === b

export func createSlectorHook

- useReduxContext
- return func useSelector
  - {store, subscription, getServerState} = useReduxContext()
  - selectorState = useSyncExternalStoreWithSelector() // 여기가 핵심인듯
  - return selectedState

export const useSelector = /_#**PURE**_/createSelectorHook() // 호출하는군. 같은 주석인데 뭘까?

# hooks/useStore.ts

export func createStoreHook

- useReduxContext
- return func useStore
  - {store} = useReduxContext() // 그렇잖아? 컨택스트를 사용해
  - return store

export const useStore = /_#**PURE**_/ createStoreHook() // 같은 패턴이다.

# utils/batch.ts

func defaultNoopBatch(callback)

- callback()

let batch = defaultNoopBatch

export const setBatch = (netBatch) => (batch = newBatch)

export const getBatch = () => batch

// 너무 간단한데?

# utils/bindActionCreators.ts

export default func bindActionCreators(actionCreators, dispatch)

- boundActionCreators = {}
- for (const key in actionCreators)
  - actionCreator = actionCreators[key]
  - boundActionCreators[key] = (...args) => dispatch(actionCreator(...args)) // actionCreator가 함수일 경우 실행
- return boundActionCreators

# utils/isPlainObject.ts

func isPlainObject(obj: unknown) // 여기서 언노운을 사용. 참고하자

- proto = Object.getPrototypeOf(obj)
-

# utils/reactBatchedUpdates.native.ts

// 단순 react-native 패키지 사용

# utils/reactBatchedUPdates.ts

export { unstable_batchedUpdates } from 'react-dom' // 단순 react-dom 패키지 사용

# utils/utils/shallowEqual.ts

func is(x: unknown, y: unknown) // 두 값을 비교. 좀 특이하다.

func shallowEqual(objA: any, objB: any) // 여서는 any를 사용하네? 왜 언노운을 안썼을까?

# utils/Subscription.ts

// 리덕스에도 Subscrition이 있었다. 그것과 어떻게 다른지 보자.
// 웬지 이 파일이 핵심인 것 같다

type Listener // 마치 연결 리스트처럼

- callback: VoidFun
- next: Listener | null
- prev: Listner | null

func createListenrCollection

- batch = getBatch()
- first, last
- return // 객체 리터럴 반환
  - clear() // first = null, last = null
  - notify()
    - batch() // first에 연결된 모든 리스너를 실행한다. 이것이 배치구나
  - get() // 모든 리스너를 배열에 담아 반환한다
  - subscribe()
    - // 연결 리스트 사이에 리스너를 끼워넣고
    - return func unsubscribe // 이런 패턴은 항상 지켜야해
      - 연결리스트에 연결만 바꾸는 구나. 딱히 뭘 삭제하는 건 없다. 그것은 브라우져가 하겠구나

const nullListenrs

- notify() {},
- get:() => []

func createSubscription(store, parentSub?)

- let unsubscribe
- let listeners
- func addNestedSub(listenr)
  - trySubscribe() // 이건 뭐지?
  - return listners.subscribe(listern) // 리스너를 추가
- func notifyNestedSubs() // 위에 추가한 리스너를 모두 실행한다. batch 함수 참고
- func handleChangeWrapper // 언젠가 등록하나보지
- func isSubscribed // unsubscribe 값을 비교, 위
- func trySubscribe
  - // unsubscribe을 검사하고
  - // 리덕스 서브스크라입 호출하는군
  - listenrs = createListenrCollection() // 여기서 사용한다
- func tryUnsubscribe
- return {addNestedSub, notifyNestedSubs, handleChangeWrapper, isSubscribed, trySubscribe, tryUnsubscribe, getListenrs: () => listenrs}

# utils/useIsomorphicLayoutEffect.native.ts

// 단순 react-native 패키지 사용

# utils/useIsomorphiicLayoutEffect.ts

// 돔을 사용할수 있으면 useLayoutEffect, 아니면 useEffect를 반환한다.

# utils/useSyncExternalStore.ts

// use-sync-external-store 패키지를 사용한다. 잘 모르겠다.

# utils/verifyPlainObject.ts

func verifyPlainObject(value, displayName, methodName

- !isPlainObject(value) 일 경우 경고 warning()

# utils/warning.ts

func warning(message: string)

- try { throw new Error(message) } catch (e) {} // 자주 사용하는 패터

---

# alternate-renderrs.ts

# exports.ts

# index.ts

# next.ts

# types.ts
