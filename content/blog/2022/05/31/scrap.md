---
slug: "/2022/05/31/scrap"
date: 2022-05-31
title: "2022-05 스크랩"
layout: post
---

# 5/3 화

[한 개의 메소드만 갖는 계층형 컨트롤러/서비스 패키지 스타일](https://johngrib.github.io/wiki/article/hierarchical-controller-package-structure/)

- 이런 이름의 제한은 유지보수할 사람에게 강력한 힌트 제공
- 소리치는 아키텍쳐 "나는 영업 어드민이야!"

# 5/5 목

[React Router v6](https://remix.run/blog/react-router-v6)

- hooks 때문에 출시. 코드양 줄고, 용량 줄어 4kb
- useParams, useLocation
- 라이프 사이클의 전형적 불편함
- 중첩 라우팅 -> 다시 읽자.
- Switch 대신 Routes

# 5/15 일

[Dont't sync state. Derive it!](https://kentcdodds.com/blog/dont-sync-state-derive-it)

- Remix는 뭘까?
- 파생된 생태
- state 여러개 -> 변경을 한 곳에서 처리
- Getter 같은 것? 상태는 1개. 나머지는 계산해서 사용
- 성능이 걱정이라면 useMemo, useComputedValue -> 구현 코드 참고
- 좀 어렵다.

# 5/17 화

B2B와 B2C 영업

- 사람 -> 기업 -> 제품 순으로 판매.
- 둘 다 본질을 건드려야

[React 18 types #56210](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210)

- implicit(절대의) children 제거
- ReactFragment 제거
- this.context를 unkown 타입. 이전에는 any
- 미지원 타입 제거

[Removal of Implicit Children](https://solverfox.dev/writing/no-implicit-children/)

- 리액트 v17 부터 제거 준비. 이유를 설명

# 5/21 토

[When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)

- useCallback/useMemo 사용시 성능과 비용 고려해야
- 참조동일성, Referential Equality
- 비용이 많이 드는 계산
- 모든 추상화(성능 최적화)에는 비용이 든다.
- [번역글](https://goongoguma.github.io/2021/04/26/When-to-useMemo-and-useCallback/)

[Announing TypeScript 4.7 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7-rc/)

- Improved Function Interface in Objects & Methods
