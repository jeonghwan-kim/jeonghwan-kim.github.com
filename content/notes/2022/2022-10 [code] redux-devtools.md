```
wc -l `find ./src -name '*.ts*'`

    173 ./src/createDevTools.tsx
      10 ./src/index.ts
      83 ./src/persistState.ts
     266 total
```

# createDevTools.tsx

func logError(type: string) // console.error(type에 따라 다른 메세지)

interface Props

- store?: EnhancedStore

type Monitor = React.ReactElement

func createDevTools(children: Monitor)

- const monitorElement = Children.only(children) // 자식이 오직 1개인지 확인하는 리액트 api
- const monitorProps
- const Monitor = monitorElement.type // 컴포넌트 타입을 이렇게 조회
- const ConnectedMonitor = connect(state => state)(Monitor as React.ComponentType<any>) // 단순히 스테이트를 반환하는 함수를 넣었는데?
- return class DevTools extends Component
  - static contextType // 컨택스트를 사용
    - store: PropTypes.object // prop-types 패키지에서
  - propTypes =
    - store: PropTypes.object // 컨택스트와 동일하게 프롭도 지정?
  - lifedStore?: LiftedStore
  - static instrument = (options?) =>
    - instrument((state, action) → Monitor.update(), options) // @redux-devtools/instrument 패키지 에서
  - constructor(props, context) // 컴포넌트 두번째 인자가 있었나?
    - if ReactReduxContext // react-redux 패키지에서
      - if this.rpops.store && !this.rpops.store.filftedStore
        - logError('NoLIfedStore')
        - return
      - if !props.store && !context.sotre
        - logError('NOStore')
        - return
        - this.lifedStore// 컨택스트나 프롭스에서 liftedStore를 가져옴,
          - 정적 인자 접근할때 어떨때는 this를 사용할까?
  - render
    - if ReactContext
      - if this.props.store // For react-redux@6 리덕스 6은 여기에 있나보다. 구버전 호환
        - if // 오류 처리, 빠른 반환
        - return <Provider store={this.props.store.liftedStore>
          - <ConnectedMonitor {...monitorProps} />
      - return <ReactReduxContext.Consumer>
        - {props => // 소비자. 렌터프롭
          - // 오류 처리, 빠른 반환
          - return <Propvider store={props.store.liftedStore}> // 왜 또하지?
            - <ConnectedMonotor ...
    - if !this.liftedStore return null
    - return <ConnectedMonitor {...monitorProps} store={this.liftedStore}

# index.ts

export {default as persisState} from './persisState';
export {default as createDevTools, type Monitor} from './createDevTools'

# persisState.ts

로컬 스토리지에 상태를 기록하고 불러오는 로직.

- 이것이 리듀서의 엔핸서로 동작하는가? 즉 미들웨어로 동작하는가?

func persisState(  sessionId,
deserializeState,
deserializeAction,
): StoreEnhancer

- if !sessionId
  - return next => (...args) => next(...args)
- func deserialize(state): LIftedState
  - return
    - ...state,
    - actionsById:
    - committedSate: deserializeState(
    - computedState: state.computedState
- return (next) =>
  - (reducer, initialState) =>
    - const key = `redux-dev-session-${sessionId}`
    - let finalInitialSTate
    - try
      - const json = localStoreage.getItem(key) // 로컬 스토리지에 상태를 저장하는군
      - if json
        - finalInitialState // 디시리얼라이즈한다
        - next(reducer, initialState)
    - catch
      - console.warn(로컬 스토리지에서 디버그 세션을 읽을 수 없다는 메세지)
      - try
        - localStore.removeItem(key)
      - finally
        - finalInitialState = undefined
    - store = next(reducer, finalInitlaState)
    - return
      - ...store,
      - dispatch(action)
        - store.dispatch(action)
        - try
          - localSTore.setItem(key, JSON.stringify(store.getStoate()))
        - catch
          - console.warn(로컬스토리지에 기록할수 없다는 메세지)
        - return action
