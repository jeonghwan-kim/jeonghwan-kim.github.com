---
slug: "/2025/04/26/react-query"
date: 2025-04-26
title: "리액트 쿼리(TanStack Query), 늦게 시작했지만 더 확실한 서버 상태 관리"
layout: post
tags:
  - react
---

마침내 리액트 쿼리(React Query)를 사용했다.

'서버 상태를 따로 관리하자', '최신 기술 스택으로 바꾸자'는 이야기가 팀에서 꾸준히 나왔지만, 나는 매번 보수적인 태도를 유지해 왔다. 제품이 잘 돌아가고 있는데 굳이 바꿀 필요가 있을까 하는 생각과, 신기술을 학습해야 한다는 부담감이 한 켠에 있었기 때문이다.

팀원들은 포기하지 않고 리액트 쿼리 도입을 계속 주장했다. 기존 기술로 리액트 쿼리의 기능을 흉내 내어, 이걸 도입하면 어떤 식으로 설계하고 얼마나 편할 수 있는지 직접 보여주기도 했다. 게다가 채용 시장에서도 리액트 쿼리 도입과 이를 통한 문제 해결 경험이 점점 중요해지고 있었는데, 사용해보지 않은 나로서는 그 흐름을 온전히 판단할 기준조차 없었다.

어떤 배경에서 이 기술이 등장했을까에 대한 나름의 이해를 정리해 보자. 비록 늦은 감은 있지만, 지금이라도 제대로 이해하고 넘어가려 한다.

# 리액트에서 서버 응답 사용하기

리액트 컴포넌트에서는 네트워크를 통해 서버로부터 데이터를 받아오는 작업을 한다. 이러한 작업은 컴포넌트의 주된 역할인 렌더링과는 달리, 부수 효과로 분류해 따로 처리하는 것이 일반적이다.

```tsx
function useData(url) {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    ;(async function fetchData() {
      const response = await fetch(url)
      const jsonData = await response.json()
      setData(json)
    })()
  }, [url])

  return { data }
}
```

커스텀 훅인 `useData()`는 서버로부터 받은 응답을 저장할 리액트 상태 `data`를 준비한다. 훅이 실행되면 네트웍크 요청을 한 번 보내고, 비동기로 응답을 받은 뒤 `data` 상태를 갱신한다. 마지막으로 갱신된 `data`를 반환하는 역할을 한다.

```tsx
function MyComponent() {
  const { data } = useData("url")

  return <div>{data}</div>
}
```

`MyComonent`는 `useData()`가 제공하는 상태를 렌더링 한다. 컴포넌트가 마운트되면 처음에는 아무것도 표시하지 않다가(`null`) 네트웍 응답을 받으면 이 값을 렌더링할 것이다.

# 로딩

비동기 네트워크 통신이라서 응답을 받기 전까지 사용자는 빈 화면을 볼 수 밖에 없다. 통신 환경이 느리다면 아무것도 없는 것처럼 보일 수도 있다. 이 때, 로딩 표시를 한다면 더 다채로운 UI로 사용자의 관심을 끌 수 있을 것이다.

```tsx
function useData(url) {
  const [data, setData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true) // 로딩중 상태

  React.useEffect(() => {
    ;(async function fetchData() {
      const response = await fetch(url)
      const jsonData = await response.json()
      setData(json)
      setIsLoading(false) // 로딩중 상태 변경
    })()
  }, [url])

  return {
    data,
    isLoading, // 로딩중 상태 반환
  }
}
```

로딩 상태를 나타내기 위해 `isLoading` 상태를 추가했다. 데이터를 부르기 전에는 `true`로 설정하고, 데이터를 받은 후에는 `false`로 변경한다. 이 상태를 `data`와 함께 외부로 반환하면 컴포넌트에서 로딩 상태를 활용할 수 있을 것이다.

```tsx
function MyComponent() {
  const { data, isLoading } = useData("url")

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  return <div>{data}</div>
}
```

이제 사용자는 컴포넌트가 렌더링되기 시작해 네트워크 응답을 받을 때 까지는 "로딩 중..."이란 문구를 먼저 보게 된다. 네트워크 응답을 받은 후에는 비로소 서버에서 받은 데이터를 화면에서 렌더링할 것이다.

# 오류

우리가 희망하듯이 대부분은 네트워크 응답을 받을 수 있겠지만, 언제든지 요청에 실패할 수도 있다. 이럴 경우 예외가 발생하고, 이를 처리하지 않으면 어플리케이션이 멈춰버릴 수 있다. 사용자는 그냥 흰 화면만 보고 아무것도 할 수 없을 것이다.

이런 오류도 꼼꼼히 처리해야 한다.

```tsx
function useData(url) {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false); // 오류 여부 표기

  React.useEffect(()=> {
    (async function fetchData() {
      try {
        const response = await fetch(url)
        const jsonData = await response.json();
        setData(json)
      } catch () {
        setIsError(true) // 오류 있음 표기
      } finally {
        setIsLoading(false)
      }
    })()
  }, [url])

  return {
    data,
    isLoading,
    isError, // 오류 여부 상태 반환
  }
}
```

오류 상태를 관리하기 위해 `isError` 상태를 추가했다. 네트워크 요청 전에는 `false`로 설정하고, 요청에 실패하면 `true`로 변경될 것이다. 이 상태를 다른 상태들과 함께 외부로 반환하면 컴포넌트에서 활용할 수 있을 것이다.

```tsx
function MyComponent() {
  const { data, isLoading, isError } = useData('url')

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  if (isError) {
    return <div>오류가 발생했습니다. 다시 시도해 보세요<div>
  }

  return <div>{data}</div>
}
```

사용자는 컴포넌트가 렌더링되고 네트워크 응답을 받을 때까지 "로딩 중..."이란 문구를 보다가, 만약 요청에 실패하면 "오류가 발생했습니다."란 친절한 문구를 보게 될 것이다. 네트웍 요청에 실패해도 사용자는 당황하지 않을 것이다.

# 캐싱

이 커스텀 훅을 다른 컴포넌트에서도 사용할 수 있게 설계해 보자. 모든 컴포넌트가 마운트 될 때마다 네트워크 호출을 하면 낭비다. 데이터가 잘 변경되지 않다면 굳이 네트워크 비용을 치루지 않아도 되기 때문이다.

어플리케이션에서 한 번만 네트워크 요청을 만들도록 useData()를 개선해보자.

```tsx
const cache = new Map(); // URL을 키로 하는 캐시

function useData(url) {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(()=> {
    (async function fetchData() {
      // 캐시가 있는 경우
      if (cache.has(url)) {
        setData(cache.get(url))
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(url)
        const jsonData = await response.json();
        setData(json)
        cache.set(url, jsonData); // 캐시에 저장
      } catch () {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [url])

  return {
    data,
    isLoading,
    isError,
  }
}
```

`url`을 키로하는 `cache` 맵을 만들었다. 캐시에 이전에 요청한 `url`에 대한 데이터가 있으면, 네트워크 요청없이 바로 이 값을 사용한다.

처음 호출했을 때는 캐시가 비어있을 테니깐 네트워크 요청을 만들고, 응답을 받으면 캐시에 저장한다. 이후에는 같은 `url`에 대해서는 네트워크 요청을 만들지 않을 것이다.

이제는 여러 컴포넌트에서 사용하더라도 네트워크 요청은 한 번만 발생하게 된다.

```tsx
function MyComponent() {
  useData("url")
  // ...
}

function MyComponent2() {
  useData("url")
  // ...
}
```

두 컴포넌트에서 훅을 사용하지만 네트워크 요청은 한 번만 만들고, 이후에는 캐시에 저장한 값을 사용할 것이다.

# 재시도

다양한 원인으로 네트워크 오류가 발생할 수 있다. 예를 들어, 일시적인 네트워크 장애나 공유기가 꺼진 경우, 혹은 서버가 잠시 다운된 경우에 오류가 발생한다.

운이 없게도 일시적인 문제라면, 오류 화면을 보여주는 것이 아쉬울 수 있다. 이럴 때는 한 번 더 시도하면 네트워크 응답을 제대로 받을 수 있는 경우가 많다. 그래서 재시도 기능을 추가해 네트워크 요청에 실패했을 때, 자동으로 요청을 다시 만들 수 있도록 개선해 보자.

```tsx
const cache = new Map();

function useServerData(url) {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  // 재시도 기능이 있는 패치 함수
  async function fetchDataWithRetry(retriesLeft) {
    try {
      const response = await fetch(url)
      const jsonData = await response.json();
      setData(json)
      cache.set(url, jsonData);
    } catch () {
      if (retriesLeft > 0) {
        // 1초 후에 다시 요청
        setTimeout(()=> fetchDataWithRetry(retriesLeft - 1), 1000)
      } else {
        setIsError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(()=> {
    if (cache.has(url)) {
      setData(cache.get(url))
      setIsLoading(false);
      return;
    }

    setLoading(true);
    fetchDataWithRetry(3); // 3회 재시도하는 요청
  }, [url])

  return {
    data,
    isLoading,
    isError,
  }
}
```

`fetchDataWithRetry()` 함수는 재시도 횟수를 인자로 받아 패치하는 역할이다. 이 함수는 `retiresLeft` 횟수만큼 자신을 재귀적으로 호출한다. 네트워크 요청에 실패하면 1초 후에 다시 요청을 시도한다. 만약 재시도 횟수 내에 여전히 실패한다면, `isError` 상태를 `true`로 설정해 진짜 오류로 간주할 것이다.

이제 각 컴포넌트에서는 오류가 한 번 발생했다고 바로 오류 메세지를 표시하지 않는다. 최대 3초 동안, 3번의 네트워크 요청을 시도하는 동안 UI는 "로딩 중..." 메세지를 표시한다. 세 번의 시도 후에도 네트워크 요청을 못한다면 그제야 "오류..." 메세지를 표시하게 된다.

# useQuery로 대체

지금까지 리액트에서 네트워크 요청이라는 부수 효과를 어떻게 처리하는지 살펴보았다. 이를 위해 `data`, `isLoading`, `isError` 상태를 관리했다. 캐시 맵을 사용해 네트워크 요청을 최소화했고, 타이밍을 조절해 재시도 요청을 만들었다.

**리액트 쿼리는 이 모든 상태 관리와 네트워크 최적화를 간편하게 처리해주는 라이브러리**다. 지금까지 우리가 구현한 기능은 아래와 같은 코드로 작성할 수 있다.

```ts
function useData(url) {
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetch(url)
      return response.json()
    },
    retry: 3,
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}
```

설정 값을 함수에 객체로 전달하는 방식인데, 절차적 표현 없이 선언적으로 설정할 수 있다. 각 설정은 다음과 같은 의미를 갖는다.

- **queryKey**: 캐쉬 키로 사용하는 고유 식별자
- **queryFn**: 네트워크 호출을 수생하는 함수. 프라미스를 반환하는 인터페이스
- **retry**: 네트워크 요청 실패 시 재시도 횟수. 기본값 3회
- **cacheTime**: 캐시가 메모리에 유지되는 시간. Infinity면 앱이 종료 시까지 유지
- **staleTime**: 데이터를 "신선한 상태"로 간주하는 시간. Infinity면 캐시를 무기한 유지

# 기존 상태관리 도구와 비교

그동안 리덕스(Redux)와 모빅스(MobX)로 상태를 관리했다. 이들 라이브러리는 어플리케이션 전역 상태를 관리하는 역할로, UI 상태를 관리하거나 서버로부터 받은 API 응답을 저장하는 용도로 사용한다.

그렇다면 **리액트 쿼리가 이들과 어떻게 차별화되고, 왜 "서버 상태 관리"라고 부르는지** 궁금하다. 전역 상태는 다양한 요소에 의해 변경되는데, 예를 들어 어플리케이션 테마나 장바구니에 상품이 추가되는 것은 사용자 인터렉션이 트리거다. 이에 비해 서버 상태는 네트워크 요청을 통해 갱신된다. 네트워크 요청을 보내고 응답을 받은 후, 그 데이터를 상태로 업데이트 하는 방식이다. 바로 이 점에서 서버 상태 관리라고 구분해서 표현하는 것 같다.

리액트 쿼리는 서버 상태 관리에 최적화된 도구다. 앞서 살펴본 것처럼 네트워크 상태, 캐싱, 재시도 등의 기능을 설정 객체 기반으로 관리할 수 있어, 훨씬 수월하게 유지보수 할 수 있다.

# 결론

서버 상태 관리 도구를 선택할 때, SWR도 함께 고려해보았지만 리액트 쿼리는 그 이상으로 많은 기능을 제공했다. 다양한 플래폼을 지원하고 TanStack에서 적극적으로 다른 라이브러리를 지원하는 점에서, 향후 더 오랫동안 지원할 가능성이 크다고 생각한다.

배민셀프서비스에서는 그동안 모빅스를 기반으로 상태를 관리했지만, 이번에 리액트 쿼리를 도입하면서 서버 상태 관리 역할을 리액트 쿼리에게 위임하는 작업을 진행 중이다. 상태를 관리하는 몇몇 스토어에서는 서버 상태를 덜어내고 보니, 더 이상 역할이 없어 스토어 자체를 폐기하기도 했다. 이런 변화를 경험하면서 시스템이 한층 간결해지는 걸 보고, 이 방향이 맞았다는 확신과 함께 시원한 만족감을 느꼈다.

훅 기반의 구조를 사용하는 것에 대해 리액트 사고방식에 너무 의존하는 것 아닌가 하는 불안감도 있다. 이제는 대부분의 UI 라이브러리들에서도 비슷한 접근법을 사용하고 있는만큼, 적극적으로 이해하고 활용해보는 것이 중요할 것 같긴하다.
