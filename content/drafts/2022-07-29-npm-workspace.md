---
slug: "/2022/07/09/sessionstorage-localstorage-and-usage"
title: "세션/로컬스토리지와 활용"
date: 2022-07-09
layout: post
---

## 서론

최근에 좀 새로운 일을 했다. API로 데이터를 가져고오고 UI로 그리는 것이 일하는 것의 대부부분.
이번에는 브라우저의 여러 탭중에 하나의 탭에서만 소켓을 연결해야하는 요구사항이다.

처음엔 단순히 워커를 떠올렸다. 싱글톤으로 동작하겠지라고 생각했기 때문이다.
웹팩에 워커 설정을 하고서 테스트해 보니 그렇지 않았다. 내가 풀어야할 문제에 적당한 도구가 아니다.

다음으로 웹스토리지를 생각했다. 브라우져 탭 간에 공유하는 데이터를 담는 로컬 스토리를 사용하면 탭을
식별할수 있지 않을까? 조금 더 찾아보니 세션 스토리지는 브라우져 탭의 생명주기와 같았다.
이 둘을 잘 사용하면 여러 탭중에 소켓에 연결하는 역할을 하는 메인탭을 지정할 수 있겠다.

이번 글에서는 문제 풀이 과정에서 배운 웹스토리지의 특성을 정리하고 이것을 활용해 어떻게 문제를 해결했는지
간단한 슈도 코드로 정리할 것이다.

## 웹스토리지

웹 스토리지는 문자열 키와 값으로 이뤄진 배열이다.

> 이 API는 문자열 키와 값을 대응시킨 영속적인 연관 배열인 로컬 스토리지와 세션 스토리지 객체로 구성 -
> 출처: 자바스크립트 완벽가이드

로컬 스토리지와 세션 스토리지를 아울러서 웹 스토리지라고 부른다.
이 두 객체는 Window 객체의 프로퍼티로 접근할 수 있다.

- window.localStorage
- window.sessionStorage

Window객체에 localStorage와 sessionStoarge 프로퍼티가 Storage 객체를 가리킴

로컬스토리지는 영구적/ 세션스토리는 브라우져 탭 생명주기와 같다

- 예외1: 로컬 스토리지는 브라우져 제조사 마다 다르다
- 예외2: 최신 브라우져의 최근에 닫읍 탭 다시 열기하면 세션 스토리지가 복구된다.

스토리지 api는 복사본을 사용한다

- setItem
- getItem

스토리지 이벤트가 발생한다

- 궁금한점: 세션 스토리지도 이벤트가 발생되나?
- 이벤트 객체: Key, newValue, oldValue, storageArea, url

## 활용. 브라우져 탭 관리자

개요만 설명하고 (슈도코드) 깃헙 링크만 제공하자.

## 탭 스토리지

```js
const createTabStorage = () => {
  const TABS_KEY = "tabStorage.tabEntityList"

  let tabEntityList = [] // { id, role: 'main' | 'sub' }

  const sync = () => localStorage.setItem(TABS_KEY, tabEntityList)

  const create = tabEntity => {
    tabEntityList.push(tabEntity)
    sync()
  }

  const findById = id => tabEntityList.find(tabEntity => tabEntity.id === id)
  const findByRole = role =>
    tabEntityList.find(tabEntity => tabEntity.role === role)
  const findAll = () => tabEntityList

  const update = updatedTabEntity => {
    tabEntityList = tabEntityList.map(tabEntity => {
      return tabEntity.id === updatedTabEntity.id ? updatedTabEntity : tabEntity
    })
    sync()
  }

  const remove = removedTabEntity => {
    tabEntityList = tabEntityList.filter(tabEntity => {
      return tabEntity.id !== removedTabEntity.id
    })
    sync()
  }

  return {
    create,
    find,
    update,
    remove,
  }
}
```

## 탭 이벤트 에미터

```js
const createTabEventEmitter = () => {
  const MAIN_TAB_KEY = "tabEventEmitter.mainTabKey"
  let mainTabChangedCallback

  window.addEventListener("storage", storageEvent => {
    const { key, newValue } = storageEvent
    if (key == MAIN_TAB_KEY) {
      mainTabChangedCallback(newValue)
    }
  })

  const onMainTabChanged = callback => (mainTabChangedCallback = callback)

  const emitMainTabChanged = mainTabId =>
    localStorage.setItem(MAIN_TAB_KEY, mainTabId)

  return {
    onMainTabChanged,
    emitMainTabChanged,
  }
}
```

## 탭 매니저

```js
const createTabId = () => {
  let tabId = sessionStorage.getItem(KEY)
  if (!tabId) {
    tabId = Date.now()
    sessionStorage.setItem(KEY, tabId)
  }
  return tabId
}

const createTabManager = () => {
  const storage = createTabStorage()
  const eventEmitter = createTabEventEmitter()

  const tabEntity = {
    id: createTabId(),
    role: storage.findByRole("main") ? "sub" : "main",
  }

  storage.create(tabEntity)

  eventEmitter.onUnloadTab = () => {
    storeage.remove(tabEntity)
    if (!storage.findByRole("main")) {
      const candidate = storage.findAll()[0]
      if (candidate) {
        storage.update({
          ...candidate,
          role: main,
        })
        eventEmitter.emitMainTabChanged(candiate.id)
      }
    }
  }

  const isMainTab = () => storage.findById(tabEntity.id) === "main"
  const onMainTabChanged = callback => eventEmitter.onMainTabChanged(callback)

  return {
    isMainTab,
    onMainTabChanged,
  }
}

const tabManager = createTabManager()

tabManager.isMainTab() // true | false
tabManager.onMainTabChanged(tabId => {
  tabManager.isMainTab() // true | false
})
```

# 결론

- 여러 탭중 하나에서만 리소스를 생성해야할 경우.
- 하나의 탭에성 다른 탭으로 메세지를 전달할 경우.

- 예제 코드:
