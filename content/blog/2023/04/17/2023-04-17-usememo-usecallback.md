---
slug: "/2023/04/17/usememo-usecallback"
date: 2023-04-17
title: "리액트 useMemo와 useCallback은 어떤 모습일까?"
layout: post
tags: [react]
---

메모이제이션. 캐시로 성능을 높이는 프로그래밍 기법이다.

이번에는 메모이제이션에 대해 알아본 뒤 리액트의 useMemo와 useCallback을 살펴볼 것이다. 각 훅을 직접 만들어 구조를 파악하면서 리액트 성능 개선에 대한 이해의 기반을 마련하는 것이 목표다.

# 메모이제이션

n이 자연수일 때 1에서 n까지의 곱을 계승 또는 팩토리얼이라고 한다. 알고리즘 문제로 많이 사용하는 것인데 재귀의 단골손님이다.

```js
function factorial(n) {
  if (n === 0) return 1
  return n * factorial(n - 1)
}
```

n을 하나씩 줄여가며 함수를 호출하기 때문에 인자가 조금만 크면 함수를 여러 번 호출할 것이다.

- f(0) = 1
- f(1) = 1 _ **f(0)** = 1 _ 1 → 1번 호출
- f(2) = 2 _ **f(1)** = 2 _ 1 _ **f(0)** = 2 _ 1 \* 1 → 2번 호출
- f(3) = 3 _ **f(2)** = 3 _ 2 _ **f(1)** = 3 _ 2 _ 1 _ **f(0)** = 3 _ 2 _ 1 \* 1 → 3번 호출

최적화하기 위한 방법으로 [메모이제이션](https://en.wikipedia.org/wiki/Memoization)이 있다. 이미 호출한 값을 미리 저장해 두어 다음 호출 시 이 값을 곧장 반환하는 것이다.

```js
// 조회 테이블을 만들었다. 호출한 값을 저장해둘 용도.
const lookupTable = {}
function factorial(n) {
  if (n === 0) return 1

  // 조회 테이블에 값이 있으면 즉시 반환한다.
  if (lookupTable[n]) return lookupTable[n]

  // 조회 테이블에 값이 없으면 함수를 호출한다.
  const v = n * factorial(n - 1)
  // 조회 테이블에 이 값을 저장해둔다. 언젠가 사용할 용도다.
  lookupTable[n] = v
  return v
}
```

계산한 값을 저장해 두었다가 나중에 사용할 용도로 조회 테이블(lookupTable)을 만들었다. 언젠가 같은 인자로 함수를 호출하면 다시 계산하지 않고 여기에 저장한 값을 찾아 반환할 용도이다.

이전과 함수 호출 횟수를 비교해 보자.

- f(0) = 1
- f(1) = 1 \* 1(f(0)을 조회 테이블에서 찾았다.) → 1번 호출, 조회 테이블 갱신 {1: 1}
- f(2) = 2 \* 1(f(1)을 조회 테이블에서 찾았다.) → 1번 호출, 조회 테이블 갱신 {1: 1, 2: 2}
- f(3) = 3 \* 2(f(2)를 조회 테이블에서 찾았다.) → 1번 호출, 조회 테이블 갱신 {1: 1, 2: 2, 3: 6}

f(n-1)을 호출하기 전에 조회 테이블에서 미리 계산한 값을 찾아 사용한다. 함수 호출 횟수가 줄어든 만큼 이로 인한 시간 비용을 줄일 수 있는 것이 메모이제이션의 장점이다.

# 컴포넌트에서 메모이제이션. useMemo

이러한 메모이제이션 기법은 컴포넌트 안에서도 사용할 수 있다. 컴포넌트 인자를 이용해 어떤 값을 계산하는 함수가 내부에 있을 경우 이를 어딘가에 캐쉬해 사용하는 방법이다.

게시물 목록을 필터링해서 보여주는 보드(Board)컴포넌트 예시를 떠올려 보자.

```jsx
function Board = ({ posts,  query }) => {
  // posts가 많고 query가 복잡하다면 무거운 계산이 될 수 있다.
  function filterPosts () {
    return posts.filter(post => query.tag ? post.tag === query.tag : true)
  }

  const filteredPosts = filterPosts()

  // 필터링한 게시물을 이용, 리액트 앨리먼트를 만든다.
  return (
    <ul>
      {filteredPosts.map(post => (
        <li key={post.id}>{post}</li>
      ))}
    </ul>
  )
}
```

게시판 컴포넌트는 포스트 목록과 쿼리를 인자로 받는데 쿼리로 포스트 목록을 필터링하는 내부 함수(filterPosts)를 가진다. 필터링된 게시물(filteredPosts)로 리액트 앨리먼트를 반환하는 것이 이 컴포넌트의 역할이다.

게시물의 양에 따라서 컴포넌트는 리액트 앨리먼트를 늦게 반환하는데 바로 필터링 함수의 영향이다. 포스트가 많아질수록 필터 함수는 오래 실행될 것이다. 게다가 쿼리에 따라 비교 조건도 늘어나기 때문에 그 만큼 계산양도 늘어난다. 인자가 바뀔 때마다 계산하기 때문에 컴포넌트는 매 랜더링마다 리액트 앨리먼트를 늦게 반환할 것이다.

매번 컴포넌트가 필터링하지 않고 어딘가 저장해 둔 값을 사용한다면 훨씬 빠르게 리액트 앨리먼트를 반환할 수 있을 것이다. 성능개선한 팩토리얼 함수처럼.

정리하면 컴포넌트가 실행될 때마다 필터링 계산을 할지 말지 정해야하는 문제다. 리랜더링시 일관된 비교 로직을 만들어야하기 때문에 이전처럼 훅으로 분리하는 게 적당해 보인다. 훅에서 인자를 기억하고 있다가 같으면 캐쉬 값을 사용하고 다르면 다시 계산하는 것이다.

리액트에서는 이러한 용도로 useMemo 훅을 제공하는데 같은 이름으로 MyReact 모듈안에 만들어 보겠다.

```js{3,9-32}
const MyReact = (function MyReact() {
  // 한 컴포넌트에서 훅을 여러번 사용할수 있게 배열로 정의했다.
  const memorizedStates = []
  let cursor = 0

  function resetCursor() {
    cursor = 0
  }

  // 캐쉬할 계산 함수와 의존성 배열을 받는다.
  function useMemo(nextCreate, deps) {
    // 캐쉬값이 없을 경우. 값을 계산하고 캐시에 저장한다.
    if (!memorizedStates[cursor]) {
      const nextValue = nextCreate()
      memorizedStates[cursor] = [nextValue, deps]
      cursor = cursor + 1
      return nextValue
    }

    // 의존 값이 같을 경우. 캐시 값을 반환한다.
    const nextDeps = deps
    const [prevValue, prevDeps] = memorizedStates[cursor]
    if (prevDeps.every((prev, idx) => prev === nextDeps[idx])) {
      cursor = cursor + 1
      return prevValue
    }

    // 의존값이 변경될 경우. 다시 계산한다.
    const nextValue = nextCreate()
    // 캐시를 갱신한다.
    memorizedStates[cursor] = [nextValue, nextDeps]
    cursor = cursor + 1
    return nextValue
  }

  return {
    resetCurosr,
    useMemo,
  }
})()
```

메모이제이션 관련한 값을 저장하기 위해 memorizedStats 배열을 정의했다. 컴포넌트에서 사용한 각 훅의 캐시 저장소 배열이다. 커서(cursor)로 현재 훅에서 사용할 값을 가리킬수 있다. 팩토리얼 예제의 조회 테이블과 같은 역할을 할 것이다.

memorizedState가 비어있으면 처음 실행되는 것이다. 비싼 계산을 하고 그 값을 여기에 저장한다. 이후 훅이 호출될 경우 캐시 값 사용 여부를 정해야하는데 기준으로 삼을 의존성 배열 deps도 함께 저장했다. 첫 호출이니깐 곧장 계산한 값을 반환한다.

다음 호출부터는 의존성이 바뀌었는지를 확인할 것이다. 이전 캐시 값(prevValue)과 이전 의존성(prevDeps)을 조회 테이블에서 가져왔다. 다음 의존성 배열과 비교해 변한 게 없다면 캐쉬를 반환한다.

의존성 배열에 있는 값이 변경되었다면 다시 비싼 계산을 하고 결과를 캐시에 저장한다. 이 값을 곧장 반환해 새로운 값을 사용하도록 외부에 알린다.

훅을 사용해보자.

```jsx{9}
function Board = ({ posts,  query }) => {
  resetCursor()

  function filterPosts() {
    return posts.filter(post => query.tag ? post.tag === query.tag : true)
  }

  // filterPosts를 메모이제이션 했다.
  const filteredPosts = MyReact.useMemo(filterPosts, [posts, query])


  // 필터링한 게시물을 이용, 리액트 앨리먼트를 만든다.
  return (
    <ul>
      {filteredPosts.map(post => (
        <li key={post.id}>{post}</li>
      ))}
    </ul>
  )
}
```

필터 함수를 바로 호출하지 않고 useMemo로 메모이제이션 했다. 의존성으로 전달한 포스트와 쿼리가 변하지 않으면 필터 함수를 다시 호출하지 않고 캐시 값을 즉시 반환할 것이다. 두 값이 달라졌을 때만 필터 함수를 실행해 새로운 계산 결과를 내놓을 것이다.

# 컴포넌트 렌더링 최적화. memo

useMemo로 컴포넌트 내부함수를 메모이제이션 했다. 이전에는 컴포넌트를 실행할 때마다 계산했지만 이제는 단 한 번만 계산하고 이후 인자가 변하지 않는한 캐쉬 값을 사용할 것이다.

이번에는 **리랜더링 관점**에서 최적화 해보자. useMemo로 비싼 필터 함수를 메모이제이션했지만 컴포넌트의 로직에 따라서는 반환하는 리액트 앨리먼트가 달라질 수도 있는데 리액트는 이 컴포넌트를 다시 렌더링할 것이다.

useMemo로 비싼 계산 결과를 메모이제이션 했기 때문에 이 값을 사용한 리액트 앨리먼트도 최적화했으면 좋겠다. 항상 같은 리액트 앨리먼트를 반환할 것이 뻔한데 다시 렌더링하는 것은 낭비기 때문이다. 우리가 이런 낭비를 두고 볼 수만은 없지 않은가?

이것을 재현할 수 있는 코드를 추가해 보자.

```jsx{5,21-26}
function Board = ({posts, query}) => {
  MyReact.resetCursor()

  // 다크 모드 여부
  const [darkTheme, setDarkTheme] = React.useState(false)

  function filterPosts() {
    return posts.filter(post => (query.tag ? post.tag === query.tag : true))
  }

  const filteredPosts = MyReact.useMemo(filterPosts, [posts, query])

  return (
    <>
      <div>
        {/* 테마를 표시하고 변경한다. */}
        <div>{darkTheme ? "어두운 테마" : "밝은 테마"}</div>
        <button onClick={() => setDarkTheme(!darkTheme)}>테마 변경</button>
      </div>
      <hr />
      {/* 테마만 변경해도 이부분이 다시 렌더링 될 것이다. */}
      <ul>
        {filteredPosts.map(post => (
          <li key={post.id}>{post.content}</li>
        ))}
      </ul>
    </>
  )
}

```

다크테마 여부를 기억할 상태(darkTheme)를 추가했다. 이 값을 출력한 뒤 토글할 수 있는 버튼을 두었다. 이 상태가 바뀌면 컴포넌트는 다시 그려질 것이다.

리랜더링될 때 메모이제이션한 값인 filteredPosts로 리액트 앨리먼트를 만드는 부분도 다시 그려질 것이다. 비싼 비용의 필터 함수 결과를 캐시해놨는데 다른 상태의 변경에 쉽게 영향 받는 게 아깝다.

컴포넌트 자체도 메모이제이션 하자. 인자를 받고 앨리먼트를 반환하는 함수이기 때문에 비슷한 구조로 다룰 수 있겠다. 리액트처럼 memo라는 이름의 함수를 정의하겠다.

```js{3-23}
const MyReact = (function MyReact() {
  // 생략
  function memo(Component) {
    return (nextProps) => {
      // 처음 실행한 경우. 계산한 값을 캐슁하고 반환한다.
      if (!Component.memorizedState) {
        const nextValue = React.createElement(Component, nextProps)
        Component.memorizedState = [nextValue, nextProps]
        return nextValue
      }

      // 다음 실행 부터는 캐시한 상태를 활용한다.
      const [prevValue, prevProps] = Component.memorizedState
      // 인자를 같을 경우. 캐시를 반환한다.
      if (JSON.stringify(nextProps) === JSON.stringify(prevProps))
        return prevValue

      // 인자가 바뀌었을 경우. 다시 계산하고 캐싱한뒤 반환한다.
      const nextValue = React.createElement(Component, nextProps)
      Component.memorizedState = [nextValue, nextProps]
      return nextValue
    }
  }

  return {
    resetCursor,
    useMemo
    memo
  }
})();
```

memo는 컴포넌트를 인자로 받아 실행하고 리액트 앨리먼트를 반환하는 함수를 반환한다. 고차함수다. 이 컴포넌트가 받을 이름을 nextProps라고 정하고 이 인자를 받는 함수를 반환했다.

컴포넌트의 memorizedState 속성을 추가해 메모이제이션할 값을 저장했다. 컴포넌트를 처음 렌더링할 때에는 값이 비었기 때문에 컴포넌트를 실행한 리액트 앨리먼트와 인자를 캐시했다. 곧장 이 리액트 앨리먼트를 반환한다.

다음 렌더링에서는 캐쉬한 값을 사용한다. 이전 인자와 현재 인자를 비교해 같다면 캐시 값을 곧장 반환한다. 이전과 같은 객체를 반환하기 때문에 리액트는 이 컴포넌트를 다시 그리지 않을 것이다.

인자가 바뀌었다면 컴포넌트를 실행해 리액트 앨리먼트를 다시 계산할 것이다. 이 값으로 캐시를 갱신하고 반환한다.

memo를 사용해 컴포넌트를 메모이제이션 해보자.

```jsx
const FilteredPosts = React.memo(function FilteredPosts({ value }) {
  return (
    <ul>
      {(value || []).map(post => (
        <li key={post.id}>{post.content}</li>
      ))}
    </ul>
  )
})
```

포스트 목록을 렌더링하는 리액트 앨리먼트를 FilteredPosts란 이름의 컴포넌트로 떼어냈다. 이 컴포넌트는 useMemo로 메모이제이션했던 filteredPosts를 인자로 받을 것이다. memo 함수로 이 컴포넌트를 감쌌기 때문에 인자가 변하지 않는한 리액트 앨리먼트는 캐시한 값을 사용할 것이다.

메모이제이션한 컴포넌트를 기존의 보드 컴포넌트에서 사용하자.

```jsx{10,18-19}
function Board = () => {
  MyReact.resetCursor()

  const [darkTheme, setDarkTheme] = React.useState(false)

  function filterPosts() {
    return posts.filter(post => (query.tag ? post.tag === query.tag : true))
  }

  const filteredPosts = MyReact.useMemo(filterPosts, [posts, query])

  return (
    <>
      <div>{darkTheme ? "어두운 테마" : "밝은 테마"}</div>
      <button onClick={() => setDarkTheme(!darkTheme)}>테마 변경</button>
      <hr />

      {/* filteredPost가 변하지 않으면 이 앨리먼트를 다시 렌더링하지 않는다 . */}
      <FilteredPosts value={filteredPosts} />
    </>
  )
}

```

메모이제이션한 값를 메모이제이션한 컴포넌트의 인자로 전달했다. 이 컴포넌트는 테마가 변경되어 보드 컴포넌트를 다시 그리더라도 메모이제이션한 컴포넌트만큼은 다시 그리지 않을 것이다. 메모이제이션한 인자가 바뀌지 않는한 memo 함수에 의해 항상 같은 리액트 앨리먼트를 반환하기 때문이다.

# 함수 메모이제이션. useCallback

이벤트 핸들러를 추가해 보자.

```jsx{2-5,8-9}
function Board = () => {
  // 리랜더링마다 새로운 값이 할당된다.
  const handleClick = (postId) => {
    console.log('handleClick', postId)
  }

  return (
    {/* handleClick이 바뀌니깐 이 앨리멘트는 변경될 것이다. */}
    <FilteredPosts value={filteredPosted} onClick={handleClick} />
  )
}

```

useMemo와 memo 비싼 함수와 컴포넌트를 메모이제이션 했지만 handleClick을 추가하면서 다시 불필요한 리랜더링이 발생할 수 있다. handleClick은 보드 컴포넌트가 렌더링될 때마다 새로운 값으로 할당되기 때문이다. 객체 리터럴처럼 함수 리터럴도 매번 새로운 값을 만들어 컴포넌트의 프롭으로 전달할 것이다. memo는 이를 새로운 값을로 인지하고 리액트 앨리먼트를 다시 계산할 것이다.

함수도 값이기 때문에 useMemo로 이 값을 메모이제이션할 수 있다.

```jsx{2-5,9-10}
function Board = () => {
  // 딱 한번 함수값을 할당한 뒤 캐쉬한 값을 사용할 것이다.
  const handleClick = useMemo(() => (postId) => {
    console.log('handleClick', postId)
  }, [])

  return (
    {/* 생략 */}
    {/* handleClick이 바뀌지 않아서 이 앨리멘트는 캐시될 것이다. */}
    <FilteredPosts value={filteredPosted} onClick={handleClick} />
  )
}
```

handleClick 함수 리터럴을 메모이제이션했다. 의존성 배열이 비었기 때문에 리액트는 항상 초기 값만 사용할 것이다.

useMemo는 메모이제이션할 값을 반환하는 팩토리 함수를 첫 인자로 받는데 여기서는 함수를 메모이제이션할 것이기 때문에 고차 함수 형태로 전달했다. 읽는데 헷갈리니깐 함수를 전용 메모이제이션 훅을 제공하는 것이 낫겠다. 리액트처럼 useCallback훅을 MyReact에 추가하자.

```js{3-7}
const MyReact = (function MyReact() {
  // 생략
  // 메모이제이션할 콜백을 인자로 받느다.
  function useCallback(callback, deps) {
    // useMemo에 콜백 인자를 생성하는 함수를 인자로 전달했다.
    return useMemo(() => callback, deps)
  }

  return {
    resetCursor,
    useMemo
    memo,
    useCallback,
  }
})();
```

이름에서 알 수 있듯이 콜백을 메모이제이션한다. 값을 반환하는 팩토리가 아니라 콜백을 바로 받았다. 캐시 값 사용여부를 비교하기 위한 의존성 배열도 함께 받았다.

함수 본문은 useMemo를 조합했다. 첫 번째 인자가 메모이제이션할 값을 반환하는 함수이기 때문에 콜백을 반환하는 함수 형태로 전달했다.

이 훅을 사용해 좀 더 간편하게 콜백을 메모이제이션할 수 있다.

```jsx{3}
function Board = () => {
  // 메모이제이션할 함수를 전달한다.
  const handleClick = useCallback((postId) => {
    console.log('handleClick', postId)
  }, [])

  return (
    {/* 생략 */}
    <FilteredPosts value={filteredPosted} onClick={handleClick} />
  )
}
```

고차 함수를 전달하지 않고 메모이제이션할 함수를 전달했다. 한결 코드 읽기가 수월하다.

# 균형 (Trade-off)

팩토리얼 함수를 최적화하기 위해 모든 함수 호출을 기록해서 캐쉬했다. 함수를 호출할 때마다 조회 테이블에 기록해 한 번이라도 호출했던 함수와 인자는 캐쉬값을 그 결과로 사용했다.

반면 useMemo는 최근 이전값 하나만 캐시에 저장했는데 이 부분이 서로 다르다. 호출한 모든 값을 기록하면 성능이 더 좋을텐데 왜 이렇게 구현했을까? 리액트도 이런 식이다(참고: [mountMemo](https://github.com/facebook/react/blob/dd5365878da2fe88a34dcdbb07d8297a78841da4/packages/react-reconciler/src/ReactFiberHooks.js#L2297), [updateMemo](https://github.com/facebook/react/blob/dd5365878da2fe88a34dcdbb07d8297a78841da4/packages/react-reconciler/src/ReactFiberHooks.js#L2311)).

```js{5-6,13-14,22-23}
function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const nextValue = nextCreate()
  // 튜플 형태로서 최근 하나의 값만 캐시한다
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}

function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  // 캐시한 값이 하나 뿐이다.
  const prevState = hook.memoizedState
  if (nextDeps !== null) {
    const prevDeps: Array<mixed> | null = prevState[1]
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0]
    }
  }
  const nextValue = nextCreate()
  // 값이 변경되면 이전 캐시값을 최근 계산한 값으로 교체한다.
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}
```

두 가지 이유라고 생각한다. 첫번째는 의존성 배열을 기준으로 캐시여부를 계산하는 구조 때문이다. 훅 인터페이스에 따라 의존성은 배열 리터럴을 사용하는데 컴포넌트를 렌더링 할 때마다 새로운 값을 받을 것이다. 따라서 이 값을 기준으로 캐시 여부를 판단할 수는 없다. 의존성 배열 안에 있는 값을 하나씩 비교해야 한다.

두번째는 성능과 관련 있을 것이라고 생각한다. 메모이제이션은 속도는 빠르지만 그만큼 자원을 더 사용한다. 캐시한 값을 메모리에 저장하기 때문이다. 모든 함수 결과를 캐시한다면 메모리 공간이 크게 증가할 것이다. 속도와 메모리 사이의 균형을 맞추기 위해 캐시를 하나만 둔다는 트레이드오프의 산물이 아니었을까?

## 결론

메모이제이션에 대해 알아보았다. 재귀 함수를 최적화하기 위해 함수 결과를 캐시해서 함수 호출 비용을 줄일 수 있었다(팩토리얼 예제).

리액트 컴포넌트에서는 useMemo로 함수 계산 값을 캐시할 수 있다. 리액트 앨리먼트를 반환하기 전에 실행할 비싼 계산을 메모이제이션했다.

메모이제이션 한 값을 리액트 앨리먼트에 사용하면 해당 앨리먼트를 다시 그리지 않아도 된다. 앨리먼트를 컴포넌트로 분리하고 메모이제이션한 값을 인자로 전달했다. 이 컴포넌트는 인자가 변하지 않으면 항상 같은 리액트 앨리먼트를 반환하도록 최적화할 수 있는데 memo 함수를 사용했다.

컴포넌트 내부의 콜백도 값이기 때문에 useMemo로 메모이제이션할 수 있다. 좀 더 간단한 인터페이스를 위해 useCallback이란 훅을 제공한다.

최적화는 반드시 필요한 곳에만 사용하자. 속도와 비용의 균형을 잡아야한다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.com/tree/master/content/codes/2022/react-hooks/src/useMemo)
- [팩토리얼](https://ko.wikipedia.org/wiki/계승)
- [메모이제이션](https://en.wikipedia.org/wiki/Memoization)
- [리액트 문서](https://react.dev/reference/react/useMemo#usage)
- [리액트 코드](https://github.com/facebook/react/blob/dd5365878da2fe88a34dcdbb07d8297a78841da4/packages/react-reconciler/src/ReactFiberHooks.js)
