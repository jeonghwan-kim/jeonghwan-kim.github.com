```
     397 ./packages/react-router/lib/hooks.tsx
     640 ./packages/react-router/lib/router.ts
      57 ./packages/react-router/lib/context.ts
     322 ./packages/react-router/lib/components.tsx
    1416 total
```

# hooks.tsx

interface MemoryRouterProps // 공통으로 쓰는건가?

- baseName?: string
- children?: ReactNode
- initialEntries?: initialEntry[]
- initialIndex?: number

func MemoryRouter

- let historyRef = useRef()
- if hisotryRef.current == null
  - historyRef.current = createMEmoryHistory() // 이런식으로 ref를 관리한다. 함수 밖으로 뺄수도 있을텐데?
- let history = historyRef.current
- let [state, setState] = useState({ // 호출시마다 값을 상태로 동기화하려고 한것이구나. 그래도 함수 밖으로 뺄수 있을텐데?
  - action: history.action
  - location: history.location

# router.ts

# context.ts

# components.tsx
