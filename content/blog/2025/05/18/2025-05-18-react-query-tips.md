---
slug: "/2025/05/18/react-query-tips"
date: 2025-05-18
title: "리액트 쿼리 사용팁 9가지"
layout: post
tags:
  - react
---

TanStack Query는 서버 상태를 클라이언트에서 효율적으로 다루게 해주는 강력한 도구다. 하지만 상태 관리 라이브러리라는 범주에 속해 있다 보니, 처음 접할 때는 useQuery() 정도만 사용해도 충분하다고 느끼기 쉽다. 실제로 기본 기능만으로도 상당히 많은 일을 할 수 있다.

그러나 실무에서 다양한 API 유청을 다루다 보면 queryKey 설계, 오류 처리 방식, 쿼리 무효화 타이밍, 로딩 상태 구분, 콜백 실행 시점 등 고려해야 할 요소들이 훨씬 많다. 이 때 내부 원리와 세부 기능들을 이해하고 활용하면 더 유연하고 안정적인 코드를 작성할 수 있을 것이다.

이 글은 TanStack Query를 실무에 적용하면서 직접 경험한 시행착오와 활용 팁을 정리한 것이다. 공식 문서에 명시돼 있지만 자주 간과되는 부분이나, 문서에는 없지만 실무에선 꼭 필요한 내요을 중심으로 구성했다.

# queryKey

Query 객체를 식별하는 queryKey는 배열로 지정한다. 처음에는 배열에 필요한 만큼의 값을 자유롭게 넣어 사용하면 되지만, 내부 구현을 보면 조금 더 신중하게 다루는 것이 좋다.

```ts
function hashKey(queryKey) {
  return JSON.stringify(queryKey, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key]
            return result
          }, {} as any)
      : val
  )
}
```

리액트 쿼리는 JSON.stringify()를 사용해 queryKey를 문자열로 바꾼다. 이 때 배열 특성 상 순서에 따라 다른 문자열을 만든다. 즉, 같은 값을 담고 있어도 순서가 다르면 서로 다른 Query로 인식하게 된다.

반면 객체를 사용하면 리액트 쿼리가 더 안전하게 처리한다. hashKey() 함수는 객체 키를 오름차순으로 정렬한 뒤, 객체를 재구성해 문자열을 만든다. queryKey에 전달한 값의 순서와 상관없이 일관된 문자열을 만들도록 보장할 수 있다.

값이 많을 경우, queryKey를 생성하는 함수를 따로 만들어 관리하는 것도 좋다.

```ts
const todoQueryKey = (userId: number) => ["PREFIX1", "PREFIX2", { userId }]
```

위처럼 대분류/소분류 prefix를 붙이고 의존하는 값을 객체로 구성해 배열을 반환하면 여러 도메인을 다룰 때 관리하기 훨씬 편리했다.

# 오류 처리

useQuery()는 예외가 발생해도 상위 스택으로 던지지 않고, 내부에서 처리해 error 상태로 관리한다. 이 덕분에 try/catch 없이도 오류 상태에 접근할수 있어 컴포넌트 렌더링 흐름과 잘 어울린다.

```tsx
const { data, isError, error } = useQuery()

if (isError) return <>Error</>

return <>{data}</>
```

오류 상태에 따라 조건부 렌더링을 할 수 있어 리액트의 흐름과 자연스럽게 맞물린다. 만약 try/catch를 써다면, 별도의 상태를 정의해야 했을 것이다.

**전역 오류 처리**

모든 Query에 공통적인 오류 처리를 적용하려면 QueryClient 인스턴스를 만들 때 defaultOptions에 onError를 지정할 수 있다.

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: error => {
        window.alert(
          error.message ?? "데이터를 불러오는 중 오류가 발생했습니다."
        )
      },
    },
  },
})
```

queryClient 객체는 관리하는 모든 Query 인스턴스에서 fetchFn을 실행할 때 예외가 발생하면 이 핸들러를 호출할 것이다.

토스트, 스낵바, 로깅 등 상황에 맞게 확장할 수 있는 구조다.

# 쿼리 무효화 (invalidateQueries)

서버 데이터를 갱신하는 가장 직관적인 방법은 쿼리를 무효화하는 것이다. QueryCache에서 쿼리를 찾아 stale 상태로 바꾸면 자동으로 refetch하기 때문이다.

서버 데이터를 변경한 뒤 연관된 Query를 갱신할 때 유용하게 사용했다.

```tsx
const queryClient = useQueryClient()

useMutation(updateTodo, {
  onSuccess: () => {
    // todos 리스트를 다시 불러옴
    queryClient.invalidateQueries(["todos"])
  },
})
```

# placeholderData

Query를 무효화하면 refetch가 비동기로 동작한다. 이 과정에서 UI는 잠시 이전 캐시 상태를 보여줄 수 있다. 특히 useInfiniteQuery()처럼 페이지네이션 구조라면 목록이 사라져 보일 수 있다.

이런 땐 placeholderData를 활용해 UX를 개선할 수 있다.

```tsx
const { data, isFetching } = useInfiniteQuery({
  // 이전 페이지 데이터를 유지
  placeholderData: prevData => prevData,
})
```

이전 데이터를 유지해 레이아웃 시프트(Layout Shit)현상을 막을 수 있다.

--

다만, 네트워크가 느릴 경우 사용자가 다음 페이지를 클릭했는데도 계속 이전 데이터만 보일 수 있다. 이럴 때는 로딩 표시를 함께 제공해 사용자에게 피드백을 주는 데 활용했다.

```tsx
return (
  <>
    {isFetching && <>로딩중 ...</>}
    {data}
  </>
)
```

# isLoading과 isFetching

리액트 쿼리는 로딩 상태를 isLoading과 isFetching으로 나눠 제공한다.

- isLoading: 최초 로딩 상태 (초기 요청)
- isFetching: 이후 백그라운드에서 진행되는 요청

```tsx
const { data, isLoading, isFetching } = useQuery()

if (isLoading) {
  return <p>처음 데이터를 불러오는 중입니다...</p>
}

return (
  <>
    {isFetching && <p>백그라운드 업데이트 중...</p>}
    <p>{data}</p>
  </>
)
```

내부적으로 QueryObserver는 두 가지 상태를 별도로 관리한다.

```ts
type QueryStatus = "pending" | "error" | "success"
type FetchStatus = "fetching" | "paused" | "idle"
```

QueryStatus는 네트워크 요청을 보내고 응답을 받을 때까지의 상태를 'pending'으로 표현한다. 응답을 받은 후 성공/실패에 따라 'success'/'error'로 표현한다.

fetchFn의 동작 상태를 FetchStatus로 나타낸다. fetchFn이 네트워크 요청을 보냈는지, 중단했는지, 아무것도 하지 않고 대기 중인지를 표현한다.

- QueryStatus: data에 관한 정보
- FetchStatus는 fetchFn에 관한 정보

최종적으로 QueryObserver는 두 상태를 이용해 아래처럼 계산한다.

```ts
const isFetching = fetchStatus === "fetching"
const isLoading = status === "pending" && isFetching
```

# onSuccess, onError, onSettled 콜백 사용 시점

위에서 사용한 쿼리옵션 onSuccess 외에도 onError, onSettled를 사용할 수 있다.

성공하면 onSuccess, onSettled 순으로 실행된다. 실패하면 onError, onSettled 순으로 실행된다. 마치 try/catch/finally 같다.

onSuccess는 성공적으로 데이터를 가져온 경우에 호출된다. 이 데이터 기반으로 후속작업을 할 때 사용할 수 있다. 상태 갱신, 알람 전송, 리다이렉션 등.

onError는 데이터를 가져오는 중에 오류가 발생한 경우 호출된다. 에러 로깅, 사용자에게 오류 메세지 표시 등. 뮤테이션이라면 서버에서 유효성 검증 실패 시 후속처리에 사용할 수 있다.

--

글로벌 오류를 onError에서 처리했던 것 처럼, queryClient에 설정한 콜백과 useQuery에 설정한 콜백은 같은 이름다. 글로벌 콜백이 먼저 실행된 후 훅에 설정한 콜백 순서로 실행된다.

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onSuccess: () => console.log("1. 글로벌 onSuccess"),
      onError: () => console.log("1. 글로벌 onError"),
      onSettled: () => console.log("1. 글로벌 onSettled"),
    },
  },
})

useQuery({
  queryKey: ["example"],
  queryFn: fetchSomething,
  onSuccess: () => console.log("2. 로컬 onSuccess"),
  onError: () => console.log("2. 로컬 onError"),
  onSettled: () => console.log("2. 로컬 onSettled"),
})
```

# 테스트 환경

쿼리에 접근할 수 있는 전역 객체로 사용되는 QueryClient 테스트 케이스 용으로 생성한 뒤, 테스트하고자 하는 컴포넌트에 컨택스트를 통해 값을 주입할 수 있다. 테스트 케이스의 독립성을 고려한다면 매 테스트 케이스마다 QueryClient를 새로 만들어 주입하는 것이 좋겠다.

```tsx
const createTestQueryClient = () => new QueryClient()

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)
```

만약 서버 API의 4xx 이나 5xx 응답을 테스트한다면 기본 옵션을 조정해 주는 것이 좋다. 리액트 쿼리는 기본적으로 서버로부터 실패 응답을 받으면 3회 재시도 하는 옵션을 가진다. 아무런 설정 없이 테스트 케이스를 실한한다면 재시도로 인한 지연이 발생해, 전체 테스트 피드백 루프를 느리게 만들것이다.

retry 옵션을 통해 테스트 환경에서는 재시도하지 않도록 조정해 주었다.

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      // 테스트에서 재시도 하지 않음
      retry: 0,
    },
  },
})
```

# 재시도

테스트환경에서는 retry 옵션을 껏지만, 어플리케이션 환경에서는 기본옵션을 그대로 사용했다. 실패할 경우 3회 재지도 한 다면 의도한 기능을 사용자에게 전달할 수 있겠다라고 생각했기 때문이다.

하지만 이것이 문제의 원이이 되는 경우도 있다. 한 번은 서버 API가 모연의 원인(가령 슬로우 쿼리)으로 늦게 응답하기 시작하게 CPU와 메모리 점유율이 높아져 끝내는 타임아웃이 발생하는 문제를 겪었다. 문제의 원인을 수정해서 고치긴했지만, 이후에 여러 군데에서 문제에 영향을 준 요소를 찾아보니 리액트 쿼리의 재시도 행동도 어느정도 기여했다고 판단했다. 서버 자원이 부족해 실패 응답을 보냈는데, 눈치없이 브라우져에서는 두 번더 같은 API를 요청하고 있었기 때문이다.

이렇게 브라우져에서 재시도 목적으로 보내는 요청은 어느정도 시간 간격을 조율해야할 필요가 있다. 가령 실패했는데 곧장 재 요청하는 것 보다는 어느정도 시간을 둔 뒤에 다시 요청하는 것이 성공 응답을 받을 확율이 높다. 리액트 쿼리는 이를 위해 백오프 지연(back-off delay) 전략을 사용할 수 있다.

기존은 각 재시도마다 시간이 점점 늘어나도록 설정되어 있다. 처음에는 1000ms(1초)로 시작해서 시도 횟수마다 2배씩 증가하여, 최대 30초를 넘기지 않다록 함수로 지정할 수 있다.

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

예를 들어 재시도가 발생할 경우, 딜레이는 다음과 같이 증가할 것이다.

재시도 1회: 1초 지연
재시도 2회: 2초 지연
재시도 3회: 4초 지연

리액트 쿼리를 도입하기 전에 이러한 기능을 구현하진 않았지만 직접 마련해볼수 있는 것도 가능한 일이다. 하지만 기존부터 없던 기능인데 리액트 쿼리를 도입하면서 백오프 지연 전략의 재시도 요청이 기본값이 된 셈이다. 라이브러리를 교체하는 수준이라면 서버를 포함한 어플리케이션 전반의 사이드이펙트를 고려서 retry와 retryDelay 옵션을 끄는 것이 현명할 수 있다.

# endabled

조건부로 쿼리를 실행하기 위해 사용한 것이 enabled 옵션이다. useQuery가 특정 조건에만 queryFn을 실행하게 하려고 enabled에 조건을 명시에 전달하면 된다.

```tsx
const { data } = useQuery({
  queryKey: ["user", userId],
  queryFn: fetchUser,
  enabled: !!userId, // userId가 없을 때는 쿼리 실행하지 않음
})
```

하지만 주의해야할 것이 있다. 이 옵션은 마운트 시점, 그러니깐 초기에만 동작한다는 특징이다. 한 번 마운트되고 나면 enabled가 false → true, 또는 ture → false 로 바뀌더라도 queryKey와 캐시 전략에 따라 호출된다.

쿼리를 특정 조건에 실행, 이를테면 동적으로 실행하려면 refecth를 사용하는 방법이 있다.

```tsx
const { data, refetch } = useQuery({
  queryKey: ['someData'],
  queryFn: fetchData,
  enabled: false, // 처음엔 실행하지 않음
})

// 어떤 버튼 클릭 시 수동 실행
<button onClick={() => refetch()}>데이터 불러오기</button>
```

# 결론

리액트 쿼리는 단순한 데이터 패칭 도구를 넘어, 서버 상태를 체계적으로 관리할 수 있게 해주는 실무 필수 도구다. 핵심 동작원리와 세부 옵션을 이해하면 복잡한 요규사항도 깔끔하게 해결할 수 있다. 이 글의 팁이 실무에서 리액트 쿼리를 더 깊이 있게 활용하는 데 도움이 되었으면 좋겠다.
