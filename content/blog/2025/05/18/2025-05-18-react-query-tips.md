---
slug: "/2025/05/18/react-query-tips"
date: 2025-05-18
title: "리액트 쿼리 실무팁"
layout: post
tags:
  - react
---

TanStack Query는 서버 상태를 클라이언트에서 효율적으로 다루는 도구다. 처음 접할 때는 useQuery() 정도만 사용해도 충분해 보였고, 실제로 기본 기능만으로도 꽤 많은 일을 할 수 있었다.

실무에서 다양한 API 요청을 다루다 보니 queryKey 설계, 오류 처리, 쿼리 무효화, 로딩 UI 등 고려해야 할 요소들이 훨씬 많았다. 이 때 내부 원리와 세부 기능들을 이해하고 활용한다면, 더 유연하고 안정적인 코드를 작성할 수 있을 것이다.

실무에 적용하면서 경험한 시행착오와 활용 팁을 정리했다. 공식 문서에 명시돼 있지만 자주 간과되는 부분이나, 문서에는 없지만 실무에 꼭 필요한 내용을 중심으로 구성했다.

# queryKey

Query 객체를 식별하는 queryKey는 배열로 지정한다. 필요한 값을 배열에 자유롭게 넣어 사용하면 되지만, 내부 구현을 보면 조금 더 신중하게 다루는 것이 좋다.

TanStack Query는 JSON.stringify()를 사용해 queryKey를 문자열로 바꾼다. 배열 특성 상, 같은 값이라도 순서에 따라 다른 문자열을 만들것이다. 같은 값으로 queryKey 배열을 구성하더라도 순서가 다르다면 다른 Query를 가리키게 된다.

객체를 사용하면 더 안전하다. hashKey() 함수는 객체 키를 오름차순으로 정렬한 뒤, 객체를 재구성해 문자열을 만든다. queryKey에 전달한 값의 순서와 상관없이 일관된 문자열을 만들도록 보장할 수 있다.

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

값이 많으면 queryKey 생성 함수로 관리하는 것이 좋다.

```ts
const todoQueryKey = (userId: number) => {
  return ["PREFIX1", "PREFIX2", { userId }]
}
```

위처럼 대분류/소분류 prefix를 붙이고 의존하는 값을 객체로 구성해 배열을 반환하면, 여러 도메인을 다룰 때 관리하기 편리했다.

# 오류 처리

useQuery()는 예외가 발생하면 이를 상위 스택으로 던지지 않고 error 상태로 관리한다. 이 덕분에 try/catch 없이도 오류 상태에 접근할 수 있어 컴포넌트 렌더링 흐름과 잘 어울린다.

```tsx
const { data, isError, error } = useQuery()

if (isError) return <>Error</>

return <>{data}</>
```

오류 상태에 따라 조건부 렌더링 했다. 만약 try/catch를 썼다면 별도의 상태를 정의해야 한다.

**전역 오류 처리**

모든 Query의 오류를 공통으로 처리하려면, QueryClient 인스턴스를 생성할 때 onError 콜백을 지정한다.

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 모든 Query의 오류를 공통으로 처리한다.
      onError: error => {
        window.alert(
          error.message || "데이터를 불러오는 중 오류가 발생했습니다."
        )
      },
    },
  },
})
```

이 queryClient 객체는 자신이 관리하는 모든 Query가 fetchFn을 실행할 때 예외가 발생하면 onError()를 호출할 것이다.

토스트, 스낵바, 로깅 등 상황에 맞게 활용하면 좋다.

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

Query를 무효화한 뒤 refetch가 비동기로 동작한다. useInfiniteQuery()를 사용한다면 사용자가 다음 페이지를 클릭한 뒤, 목록이 순간 보이지 않을 수 있다.

이런 땐 placeholderData를 활용해 UX를 개선할 수 있다.

```tsx
const { data, isFetching } = useInfiniteQuery({
  // 이전 페이지 데이터를 유지
  placeholderData: prevData => prevData,
})
```

이전 데이터를 유지해 레이아웃 시프트(Layout Shift)현상을 막는다.

네트워크가 느릴 경우, 사용자가 다음 페이지를 클릭했는데도 여전히 이전 데이터만 보일 수 있다. 이를 위해 로딩 UI로 사용자에게 피드백을 주어 데이터를 가져오는 중이라는 메세지를 전달했다.

```tsx
return (
  <>
    {isFetching && <>로딩중 ...</>}
    {data}
  </>
)
```

# isLoading과 isFetching

TanStack Query는 로딩 상태를 isLoading과 isFetching으로 나누어 제공한다.

- **isLoading**: 최초 로딩 상태 (초기 요청)
- **isFetching**: 이후 백그라운드에서 진행되는 요청

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

Query를 감시하는 QueryObserver는 두 가지 상태로 관리한다.

```ts
type QueryStatus = "pending" | "error" | "success"
type FetchStatus = "fetching" | "paused" | "idle"
```

QueryStatus는 네트워크 요청을 보내고 응답을 받을 때까지의 상태를 'pending'으로 표현한다. 응답을 받은 후 성공/실패에 따라 'success'/'error'로 표현한다.

FetchStatus는 더 세부적인 상태다. fetchFn이 네트워크 요청을 보냈는지, 중단했는지, 아무것도 하지 않고 대기 중인지를 표현한다.

- **QueryStatus**: data에 관한 정보
- **FetchStatus**: fetchFn에 관한 정보

QueryObserver는 두 상태를 이용해 아래처럼 계산한다.

```ts
const isFetching = fetchStatus === "fetching"
const isLoading = status === "pending" && isFetching
```

# 테스트 환경

테스트 환경에서도 어플리케이션에 적용한 것과 동일한 방식으로 TanStack Query를 설치한다. 테스트 케이스의 독립성을 고려한다면, 테스트 케이스마다 QueryClient를 인스턴스를 만들어 주입하는 것이 좋다.

```tsx
const createTestQueryClient = () => {
  return new QueryClient()
}

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)
```

서버 API의 4XX이나 5XX 응답을 테스트한다면, retry 옵션을 조정해 주는 것이 좋다. 서버의 실패 응답에 대해 3회 재시도하는 것이 기본값인데, 재시도로 인한 지연으로 전체 테스트 피드백 루프를 늦추기 때문이다.

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

테스트 환경에서는 retry 옵션을 껏지만, 어플리케이션 환경에서는 기본 옵션을 그대로 사용했다. 재시도 요청을 통해 어플리케이션이 더 안정적으로 동작하도록 기대했기 때문이다.

그러나 이것이 문제의 원인이 되는 경우도 있다.

서버 API가 어떠한 원인(가령 슬로우 쿼리)으로 늦게 응답했다. CPU와 메모리 점유율이 오르고 타임아웃이 발생하는 문제를 겪었다. 이 때 브라우져의 재시도 요청도 원인에 기여했다고 보았다. 서버 자원이 부족해 실패 응답을 보냈는데, 브라우져에서는 눈치없이 계속 API를 요청했기 때문이다.

재시도 요청을 보낼 때는 타이밍을 조절하는 것이 좋다. 실패했는데 곧장 재 요청하는 것 보다는, 잠시 기다렸다 다시 요청하는 것이 성공 응답을 받을 확율이 높을 것이다. TanStack Query는 이를 위해 백오프 지연(back-off delay) 전략을 사용한다.

시간을 지수배로 늘려 요청하는 것이 기본 설정이다. 처음에는 1000ms(1초)로 시작해서 시도 횟수마다 2배씩 증가하여, 최대 30초를 넘기지 않는다.

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      // 백오프 지연 함수 (기본값)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

- 재시도 1회: 1초 지연
- 재시도 2회: 2초 지연
- 재시도 3회: 4초 지연

TanStack Query를 사용하기 전까지는 이러한 기능을 몰랐는데, 라이브러리를 도입하고나서 백오프 지연 전략의 재시도 요청이 기본값이 된 셈이다. 어플리케이션 기능을 유지한 채 라이브러리만 교체하는 수준이라면, 서버를 포함한 어플리케이션 전반의 사이드 이펙트를 고려해 retry 옵션을 끄는 것이 현명할 수도 있겠다.

# endabled

조건부 쿼리를 실행을 위한 옵션이다. 이 옵션 설정한 조건에 따라 queryFn 함수가 동적으로 실행될 것이다.

```tsx
const { data } = useQuery({
  queryKey: ["user", userId],
  queryFn: fetchUser,

  // userId가 없을 때는 쿼리 실행하지 않음
  enabled: !!userId,
})
```

그러나 enabled 옵션은 주의해서 사용해야 한다.

이 옵션은 마운트 시점, 그러니깐 초기에만 동작한다. 한 번 마운트되고 나면 enabled 값과 상관없이 queryKey와 캐시 전략에 따라 호출된다.

언제든지 쿼리를 특정 조건에 따라 동적으로 실행하고 싶다면 refecth를 사용하는 방법이 있다.

```tsx
const { data, refetch } = useQuery({
  queryKey: ['someData'],
  queryFn: fetchData,

  // 처음엔 실행하지 않음
  enabled: false,
})

// 버튼 클릭 시, refetch()로 수동 실행
<button onClick={() => refetch()}>데이터 불러오기</button>
```

# 결론

TanStack Query는 단순한 데이터 패칭 도구를 넘어, 서버 상태를 체계적으로 관리할 수 있게 해주는 도구다. 핵심 동작 원리와 세부 옵션을 이해하면 복잡한 요구사항도 깔끔하게 해결할 수 있을 것이다. 정리한 몇 가지 팁이 실무에서 이 라이브러리를 제대로 활용하는 데 도움이 되었으면 좋겠다.

--

이렇게 3부로 글을 통해 TanStack Query을 정리했다.

1. [리액트 쿼리(TanStack Query), 늦게 시작했지만 더 확실한 서버 상태 관리](/2025/04/26/react-query)
2. [리액트 쿼리, 내부는 이렇게 움직인다](/2025/05/11/how-react-query-works)
3. [리액트 쿼리 활용팁](/2025/05/18/react-query-tips)
