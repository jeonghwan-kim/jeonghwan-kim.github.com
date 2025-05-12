---
slug: "/2025/05/11/how-react-query-works"
date: 2025-05-11
title: "리액트 쿼리, 내부는 이렇게 움직인다"
layout: post
tags:
  - react
---

이전 글([리액트 쿼리, 늦게 시작했지만 더 확실한 서버 상태 관리](/2025/04/26/react-query))에 이어 리액트 쿼리의 구조와 동작 원리를 분석해 보았다. useQuery()를 시작으로 QueryClient까지 핵심 객체들의 역할을 파악하고, 이들 간의 협업 구조를 이해하면 라이브러리를 사용할 때 훨씬 유리할 것이다.

# query-core와 react-core

초반에는 React Query 였다. 어느 샌가 TanStact Query라는 이름을 사용하기 시작했는데, 리액트 뿐만아니라 Vue, Svelte 등 다른 라이브러리에서도 사용할 수 있게 끔 구조를 개선하고 리브랜딩한 것 같다.

UI라이브러리 의존성을 제거한 핵심 로직을 **query-core** 패키지로 분리하고 플랫폼 별로, 이를테면 리액트에서 사용할 수 있도록 **react-query** 패키지로 분리했다.

# useQuery

가장 먼저 접하는 useQuery() 훅으로 시작해 보았다. react-query 패키지에서 제공하는 훅인데, 50여 줄로 무척 짧은 코드다.

**함수 오버로딩**

함수 오버로딩으로 useQuery()를 다양한 인터페이스로 사용할 수 있게 끔 다형성을 지원한다.

```ts
function useQuery(options: DefinedInitialDataOptions): DefinedUseQueryResult
function useQuery(options: UndefinedInitialDataOptions): UseQueryResult
function useQuery(options: UseQueryOptions): UseQueryResult
```

**함수 본문**

함수 본문은 useBaseQuery()를 호출하는 것 뿐이다. 훅에서 받은 인자와 QueryObserver 클래스를 이 훅의 인자로 전달한다.

```ts
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver, queryClient)
}
```

QueryObserver를 포함해 Query, QueryCache, QueryClient 등이 리액트 쿼리의 핵심 객체 위주로 살펴 볼 것이다.

# useBaseQuery

useBaseQuery()는 QueryObserver 객체를 생성하고, 쿼리 데이터가 변경되면 리액트 렌더링에 통합하는 역할을 한다. useQuery() 뿐만아니라 useInfiniteQuery()와 같은 익숙한 훅들도 내부적으로는 useBaseQuery()를 사용한다.

**QueryClient 획득 및 옵션 정리**

외부에서 받은 queryClient, 혹은 컴포넌트 트리 상단에 있는 컨택스트의 기본값을 사용한다. options 인자에 기본 옵션을 더하여 defaultedOptions을 준비한다.

```ts
const client = useQueryClient(queryClient)
const defaultedOptions = client.defaultQueryOptions(options)
```

**QueryObserver 생성**

이렇게 준비한 client, defaultedOptions로 QueryObserver 인스턴스를 만든다. 쿼리 상태를 추적하고 변경을 알리는 역할을 하는데 객체로써 뒤에서 자세히 살펴 보겠다.

```ts
const [observer] = React.useState(() => new Observer(client, defaultedOptions))
```

QueryObserver 객체를 리액트 상태로 관리했다. 객체를 한 번만 생성할 의도라면, 레프(ref) 객체도 충분할 것 같다. ref.current로 접근하는 게 다소 장황해 보일 수 있어 상태를 선택을 한 것이 아닌가 싶다.

**구독**

QueryObserver의 subscribe()를 통해 쿼리 상태의 변경을 구독한다. 쿼리 상태가 바뀌면 컴포넌트가 리렌더링 될 것이다.

React.useSyncExtenralStore() 훅을 사용해 QueryObserver를 구독하고 컴포넌트를 업데이트 했다. 리액트 19 버전에서 봤던 이 훅을 사용하는 것을 처음 발견해 반갑다. 익혀 두어야지.

```ts
React.useSyncExternalStore(
  onStoreChange => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
  () => observer.getCurrentResult(),
  () => observer.getCurrentResult()
)
```

notifyManager.batchCalls()를 통해 배치 처리를 위임했다. notifyManager도 뒷 부분에서 다루어 보겠다.

**결과 반환**

옵션 인자에 따라 QueryObserver에게 위임하거나 곧장 결과를 반환한다. QueryObserver의 trackResult(reuslt)를 호출해 결과를 추척하는데, 필요한 경우에만 렌더링하려는 최적화 장치로 보인다.

```ts
return !defaultedOptions.notifyOnChangeProps
  ? observer.trackResult(result)
  : result
```

# QueryObserver

지금부터는 리액트와 무관한 TanStack Query만의 핵심 로직으로 query-core에 있는 파일들을 살펴 볼 것이다. useBaseQuery()가 리액트와 통합한 QueryObserver는 리렌더링을 제어하는 핵심 객체다. 네트워크 요청을 트리거하고, 상태 변경을 감지한 뒤, 구독자에게 알리는 역할을 한다.

**구독과 해제 관리**

Subscribeable 클래스를 상속해서 구독자들에게 쿼리 데이터가 바뀔 때 알림을 제공한다.

```ts
class QueryObserver extends Subscribable
```

Subscribable에서 제공하는 onSubscribe()/onUnsubscribe() 메소드를 오버라이드하여, 구독을 시작하거나 종료할 때 쿼리와의 연결을 조절한다.

```ts
protected onSubscribe()
protected onUnsubscribe()
```

**옵션 설정 및 쿼리 재구성**

setOptions()는 쿼리 옵션을 설정한다.

```ts
setOptions(options)
```

this.#updateQuery()와 this.#currentQuery.setOptions()를 통해 쿼리를 재구성한다. 구독자가 있다면 this.#excuteFetch()를 통해 데이터를 즉시 패치하고, this.updateResult()를 통해 결과를 갱신한다. 캐시의 stale 시간을 계산하고 리패치 간격을 조정한다.

```ts
#updateQuery()
#currentQuery: Query
#excuteFetch()
updateResult()
```

**낙관적 결과 예측**

데이터 로딩 전에도 예상 결과를 예측해 즉시 사용할 수 있도록 한다. getOptimisticResult()는 패치하지 않고 현재 상태를 기반으로 예상 결과를 리턴한다. fetchOptimistic()은 패치는 하지만 예상 결과를 먼저 받아볼 수 있는 메소드다.

```ts
getOptimisticResult(options): QueryObserverResult
fetchOptimistic(options): Promise<QueryObserverResult>
```

**네트워크 요청 실행**

옵션에 따라 네트워크 요청을 만든다. fetch()와 refetch() 모두 내부 메소드 this.#excuteFetch()를 호출한다. 이 때, Query 객체의 fetch()에게 위임하는데 자세한 로직은 이후에 살펴 보겠다. 쿼리 옵션(throwOnError)에 따라 실패 시 예외를 던지기도 한다.

```ts
protected fetch(fetchOptions: ObserverFetchOptions): Promise<QueryObserverResult>
refetch(options: RefetchOptions): Promise<QueryWbserverResult>
```

**결과 갱신 및 알림**

updateResult()는 패치 결과를 갱신해 this.#currentQuery에 업데이트 한다. 이 결과는 this.#notify()를 통해 구독자들(this.listeners)에게 알림을 전달할 것이다.

```ts
updateResult()
#notify(notifyOptions: { listeners: boolean })
```

notifyManager.batch()로 여러 구독자들에게 알림을 한 번에 전달한다. 이는 리액트와 통합하는 과정에서 불필요한 렌더링을 줄이기 위한 전략인 것 같다.

```ts
notifyManager.batch(() => {
  this.listeners.forEach(listner => listner(this.#currentResult))
})
```

# Query

QueryObserver가 감시하는 Query를 살펴볼 차례다. Query는 라이브러리가 관리하는 **서버 상태의 단위**이다. 쿼리 키(queryKey)로 식별되며 데이터 뿐만 아니라 쿼리 상태를 가지고 있다.

**Removable**

Query는 Removable 추상 클랙스를 구현했다. 사용하지 않는 객체를 메모리에서 안전하게 제거할 수 있도록 가지비 컬렉션 타이밍을 조정하는 역할을 한다.

```ts
class Query extends Removable
```

Query 객체에 구독자가 없고, 일정 시간동안 사용되지 않으면 QueryCache에서 제거하도록 구현되어있다. 가비지컬렉터는 Query 객체가 점유한 메모리를 일정 시간 후에 회수할 것이다.

```ts
prtected optionalRemove()
```

**주요 멤버 변수**

서버 상태, 에러 등을 상태 멤버 변수(this.state)로 관리한다. 이 상태가 변경되면 각 구독자 QueryObserver(this.observers)에게 알림을 전달한다. Query는 이후 살펴볼 QueryCache에 맵 형태로 관리되는데, 자신의 쿼리 키(this.queryKey)를 통해 객체를 식별될 것이다.

```ts
state: QueryState
observers: Array<QueryObserver>
queryKey: TQueryKey
```

**데이터 패치**

QueryObserver가 this.#currentQuery.fetch()를 통해 Query에게 패치를 위임했었다. Query는 외부에서 주입받은 queryFn으로 네트워크 요청을 만들고, 응답받으면 프라미스와 함께 반환할 것이다. 결과에 따라 패치 상태를 업데이트하고 onSuccess(), onError(), onSettled() 콜백을 실행할 것이다. 실패한다면 retry 로직도 여기서 제어한다.

```ts
fetch(options: QueryOptions): Promise<TData>
```

**상태 변경과 알림**

네트워크 응답에 따라 액션을 리듀서로 전달해 상태(this.state)를 갱신한다.

```ts
#dispatch(action: Action<TData, TError>): QueryState<TData, TError>
```

상태를 갱신하고 나면, Query를 구독하고 있는 각 QueryObserver에게 알린다. 이 때도 notifyManager.batch()를 통해 배치 처리하는데, 렌더링 최적화를 의도한 설계다.

```ts
notifyManager.batch(() => {
  this.observers.forEach(observer => observer.onQueryUpdate())
  this.#cache.notify({ query: this, type: "updated", action })
})
```

**브라우져 이벤트 핸들러**

브라우져 포커스나 네트워크 연결 이벤트가 발생할 때 사용할 핸들러를 제공한다. 이 핸들러는 QueryObserver(this.observers)에서 해당 이벤트 발생하면 다시 패치해야하는 옵저버를 찾아서 refetch() 함수를 호출하는 역할을 한다.

```ts
onFocus()
onOnline()
```

# QueryCache

Query 객체를 만드는 곳이 QueryCache다. 쿼리를 캐싱하고 조회, 삭제, 알림를 처리한다.

**Subscribeable**

Subscribeable를 상속하는데 이 부모 클래스의 this.listeners 멤버 변수와 this.subscribe() 메서드를 통해 외부에 구독 기능을 제공한다.

```ts
class QueryCache extends Subscribable
```

**Query 인스턴스 저장소**

#queries: QueryStore 멤버 변수를 갖고 있는데 실제로는 Map 객체다. 맵의 키는 queryHash, 값은 Query 객체이며 캐시 저장소로 사용하는 곳이다.

```ts
this.#queries = new Map<string, Query>()
```

**Query 인스턴스 생성**

저장소에서 Query 인스턴스를 찾아 반환한다. 없을 경우에는 인스턴스를 만들어 저장소에 추가한 뒤 반환한다. 맵에 사용하는 queryHash는 queryKey와 options를 이용해 만든다. queryKey만으로만 캐시를 관리할 줄 알았는데, options도 관여한다는 점을 알았다.

```ts
build(client, options, state): Query
```

**Query 객체 추가 및 제거**

저장소에 쿼리를 추가하거나 삭제하는 기능을 제공한다. 추가/삭제 후에는 this.notify()를 통해 QueryObserver(this.listeners)에게 알림을 전달한다.

```ts
add(query: Query);
remove(query: Query);
```

**이벤트 알림**

위 이벤트가 발생하면 각 구독자들이 등록한 콜백 함수를 호출해 이벤트를 전달한다. Query에서 사용한 것처럼 notifyManager를 통해 배치로 처리한다.

```ts
notify(event) {
  notifyManager.batch(()=> {
    this.listeners.forEach(listener => listener(event))
  })
}
```

**Query 객체 검색 메소드**

저장소에서 Query 객체를 검색할 수 있는 메소드를 제공한다. get(), getAll(), find(), findAll()인데, 마치 ORM 메소드 같다.

```ts
get(queryHash): Query | undefined
getAll(): Array<Query>
find(filters): Query | undefined
findAll(filters):  Array<Query>
```

**브라우져 이벤트 핸들러**

Query처럼 브라우져 포커스나 네트워크 연결 이벤트에 사용할 핸들러를 제공한다. 저장소에 있는 모든 Query 객체의 onFocus()/onOnline() 메소드를 호출하는 역할을 맡는다.

```ts
onFocus()
onOnline()
```

# QueryClient

리액트 쿼리는 컴포넌트 트리 상단에서 QueryClient 객체를 컨택스트를 통해 주입한다. QueryClient는 어플리케이션 전역으로 사용할 수 있는데
useQuery를 사용하면 UI 앨리먼트와 반응형(Reactive)으로 동작한다. 하지만 리액트 컴포넌트 외부의 콜백이나 일반 함수에서 사용하려면 명령형(Impretive) 방식의 API가 필요하다. QueryClient는 이러한 명령형 방식의 메소드를 제공하는 전역 인스턴스로 사용되는 클래스다.

**쿼리 읽기/쓰기**

QueryCache에 직접 접근하여 최신 데이터의 쿼리를 가져올 수 있다. get에 대응하는 set 메소드도 제공해 데이터를 직접 변경할 수도 있다.

```ts
getQueryData(queryKey)
setQueryData(queryKey, updater, options)
getQueriesData(filters)
setQueiresData(queryKey, updater, options)
getQueryState(queryKey)
```

**쿼리 데이터 패치**

this.#queryCache를 이용해 쿼리를 조회한 뒤, 쿼리 인스턴스의 fetch()를 호출한다. ensureQueryData()는 쿼리 캐시에 데이터가 없으면 패치하고, 있으면 stale 시간을 비교해 쿼리를 프리패치해서 데이터를 반환한다.

```ts
ensureQueryData()
fetchQuery()
prefetchQuery()
prefetchInfiniteQuery()
```

**쿼리 무효화/취소/재요청/제거**

캐시에 있는 쿼리 데이터를 제거하거나, 쿼리 상태만 초기화 할 수 있다. 네트워크 요청 중인 쿼리를 찾아 취소하는 메소드도 제공한다. 캐시에 저장된 쿼리를 stale 상태로 만들면 패치를 유도할 것이다. 아예 특정 쿼리만 다시 패치할 수도 있다. useQuery()가 반환한 refertch를 사용했는데, 상황에 따라서는 명령형으로 사용할 수도 있겠다.

```ts
removeQuery(filters)
resetQueries(filters, options)
cancleQueries(filters, options)
invalidateQueries(filters, options)
refetchQueries(filters, options)
```

이러한 메소드는 notifyManager.batch()를 통해 배치 실행한 뒤, 각 구독자에게 알리는 역할까지 한다.

**마운트 관리**

mount()는 한 번만 실행되는 함수인데, focusManager와 onlineManager를 구독해 브라우져 포커스 이벤트가 발생하거나 네트워크에 연결되는 경우 동작 처리를 담당한다. 중단된 뮤테이션을 다시 시작하고 QueryCache의 onFocus(), onOnline() 함수를 호출해 쿼리 리패치를 유발시킬 것이다.

```ts
mount()
unmount()
```

# notifyManager

그 동안 각 객체는 불필요한 렌더링을 줄일 목적으로 notifyMnager.batch()를 사용했다. 이 메소드는 트랜잭선을 걸고 콜백을 실행한 뒤, 마지막 트랜잭션일 경우 flush()를 호출한다.

flush()는 내부 변수 queue에 있는 콜백(알람)을 실행한다. 렌더링을 방해하지 않게 sechduleFn()으로 실행하는데, 기본값이 setTimeout(callback, 1)이다. 외부에서 주입해 변경할 수도 있다.

schedule()이 queue에 등록하는 함수다. 트랜젝션 중이면 queue에 추가하고 그렇지 않으면 scheduleFn()으로 다음 틱에 예약한다.

schedule() 함수는 어디에서 호출할까? 바로 우리가 시작 부분에 보았던 useBaseQuery()다.

```ts
React.useSyncExternalStore(
  (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
  () => observer.getCurrentResult(),
  () => observer.getCurrentResult(),
```

React.useSyncExternalStore()를 통해 QueryObserver가 Query 변경을 감지하면 onStoreChange 함수가 바뀐다. 이 때 notifyManager.bachCalls()에 이 함수를 등록하는데, 여기서 schedule()로 queue에 등록한다. 쿼리 데이터가 여러 번 바뀌더라도 불필요한 렌더링을 없애기 위한 성능 보장 전략인 것이다.

# 결론

useQuery()에서 시작해 query-core 패키지까지 이어지는 전체 흐름을 따라가며, 각 구성 요소들이 무슨 책임을 지고 어떠한 방식으로 협력하는지를 분석해 보았다. 특히 Query는 서버 상태의 단일 진실(source of truth)로써의 역할을 하며, 이것을 구독하는 QueryObserver는 컴포넌트에 데이터를 안전하게 공급하는 가교 역할을 한다.

각 구성 요소의 역할과 협업 방식을 정리하자.

_react-query_:

- **useQuery**: useBaseQuery를 호출하여 QueryObserver를 생성
- **useBaseQuery**: useQuery, useInfiniteQuery, useQueries 의 기반으로, QueryObserver를 초기화하고, 이 옵저버의 상태를 useSyncExternalStore로 구독해 리액트 렌더링과 동기화

_query-core_:

- **QueryObserver**: 하나의 Query 객체를 구독하고, 컴포넌트가 관심 갖는 상태(예: isFetching, data, error)를 파생(trigger)시켜 전달. Query과 1:N 구조로 동일한 Query를 여러 컴포넌트에서 구독할 수 있음
- **Query**: 서버 상태를 표현한 단위. fetchFn를 트리거하고 결과를 전파
- **QueryCache**: 모든 Query 객체 보관. 쿼리 키로 접근 가능한 중앙 저장소.
- **QueryClient**: QueryCache를 보유하고 있으며, prefetchQuery, invalidateQueries 등의 전역 API 제공.
- **notifyManager**: QueryObserver에게 상태 변경을 알릴 때, 배치 처리로 성능 최적화에 기여.
