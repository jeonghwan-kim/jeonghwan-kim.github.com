```
wc -l `find ./src -name '*.ts*'`
      91 ./src/types.ts
      53 ./src/index.ts
     144 total
```

# types.ts

interface ThunkDispatch

- 1. <ReturnType>(thunkAction: ThunkAction): ReturnType // 이게 무슨 문법이지?
- 2. <Action extends BasicAction>(action: Action): Action
- 3. <ReturnType, Action extends BasicAction>(action): Action | ReturnTyep

type ThunkAction = (dispatch, getState, extraArgument) => ReturnType

type ThunkActionDispatch = (...args) => ReturnType

type ThunkMiddleware = Middleware<...>

# index.ts

func createThunkMiddleware(extraArgument)

- const middleware = ({ dispatch, getState }) =>
  - next =>
    - action =>
      - if action 함수라면
        - return action(dispatch, getState, extraArgument)
      - return next(action) // 미들웨어 채인에 전달
- return middleware

const thunk = createThunkMiddleware() // 만들어서
export default thunk // 곧장 모듈로

그런데 왜 생성 함수로 만들었을까?

---

- [ ] 블로그에 정리한 성크 글을 다시 읽어봐야겠다.
- [ ] 내가 성크를 잘 모르는구나. 성크를 잘 사용하지 않았어. 성크와 사가의 차이는 뭘까?
