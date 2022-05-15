---
title: "2021-07 스크랩"
date: 2021-07-31
slug: /2021-07-scrap
layout: post
---

# 2021-07-W1

총 13, 기술 12

## 2021-07-01목

[The Document Culture fo Amazon](https://www.justingarrison.com/blog/2021-03-15-the-document-culture-of-amazon/)

- 문서기반 회의. 회의전 문서 반드시 공유해야
- 조용히 문서 읽는 것으로 회의 시작
- 아무도 회의전에 문서를 읽지 않기 때문
- 문서의 양식보다 사용 방법이 흥미로움

## 2021-07-02 금

[How to use React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)

- 좋은 문서다
- 가지치기: 공식문서, jest-dom, aria-label attributes

Using the aria-label attribute - MDN

- WAI-ARI Roles- MDN

## 2021-07-03 토

[레이저 집중](https://www.thestartupbible.com/2021/07/laser-focus.html)

- 한 가지를 잘 해야 성공
- 세상은 넓고, 하지 말아야 할 일은 많다

[Encoding Data for POST requests](https://jakearchibald.com/2021/encoding-data-for-post-requests/)

- URLSearchParams() → application/x-www-form-urlencoded
- URL.#.searchParams()
- FormData() → multipart/form-data

## 2021-07-04 일

[Open work, 카카오의 일하는 방식](https://tech.kakao.com/2021/07/02/openwork-agile/)

- 투명해야

# 2021-07-W2

총 14, 기술 10

## 2021-07-05 월

[Introducing Web Containers: Run Node.js](https://blog.stackblitz.com/posts/introducing-webcontainers/)

- Natively in your browser
- Faster. Debugging in Browser. Secure
- Github

[답은 데이터에 있다](https://www.thestartupbible.com/2021/07/its-all-about-data.html)

## 2021-07-06 화

[좋은 프로덕트 팀과 반대 팀의 17가지 차이](https://brunch.co.kr/@ashashash/101)

- 제품 비젼
- 이런 글은 별로다. 마치 좋은 말만 있는 자기 계발서 같다

[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

- 유지 가능한 테스트
- Rect-dom, react-dom/test-utils 위에서 동작
- "The more your tests resemble the way your software is used, the more confidence ..."

[RTL > Example](https://testing-library.com/docs/react-testing-library/example-intro)

- mow: Mock Service Worker
- Arrange - Act -Assert

[RTL > Setup](https://testing-library.com/docs/react-testing-library/setup)

- custom render. test-utils.jsx
- jest.config.js
- tsconfig.js

## 2021-07-08 목

[RTL > API](https://testing-library.com/docs/react-testing-library/api)

- DOM Testing Library + alpha
- Render. Wrapper → RootComponent ?

[RTL > API](https://testing-library.com/docs/react-testing-library/api)

- toBeVisible, toHaveValue

[RTL > Examples (계속)](https://testing-library.com/docs/react-testing-library/example-intro)

- React Context. toHaveTextContent
- useReducer
- Formik. waitFor(() => expect().to...)
- React Intl
- React Router
- React Transition Group

## 2021-07-09 금

[Tes Isolation with React](https://kentcdodds.com/blog/test-isolation-with-react)

- mutable state
- 기능 보다는 유스케이스를 테스트해야
- Better → Event Better (better) → 최고

## 2021-07-10 토

[Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

- 좋은 사례들이 많다. 글을 공유.

[Testing React components using render props](https://kentcdodds.com/blog/testing-components-using-render-props)

- 이것도 좋구나
- Context 사용할 때 테스트하는 법

## 2021-07-11 일

[Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)

- 세부 사항을 테스트하지 말 것
- 엔드 유저로서 테스트할것 (유저, 개발자)

[AHA Testing](https://kentcdodds.com/blog/aha-testing)

- 테스트에도 추상화해서 가독성 올려야

# 2021-07-W3

총 15, 기술 8

## 2021-07-12 월

재택 근무 방식을 다시 생각해 보기 - 이기호

모르는게 약이다

[Avoid Nesting when you're Testing](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing)

- it/test 구분
- 변수 추적 복잡. AHA로 개선해야

[AHA Programing](https://kentcdodds.com/blog/aha-programming)

- Avoid Hasty Abstraction - Sandi Mets
- "Prefer duplication over the wrong abstraction"
- jsinspect. 중복 코드 검색 도구

## 2021-07-13 화

[최선을 다한다는 것](https://ppss.kr/archives/243506)

- 재능, 노력, 연습 필요
- 요구없어도 스스로 일하는 마음가짐
- 책을 쓰거나 프로그래밍 하루 5시간 한계

[원래 그런 것](https://www.thestartupbible.com/2021/07/the-only-constant-is-change-itself.html)

[Common Testing Mistakes](https://kentcdodds.com/blog/common-testing-mistakes)

- 내 수업 놓친 것
- 세부 구현 테스트
- 100% 커버리지
- 반복, 로그인, 회원 가입

## 2021-07-14 수

[Demystifying Testing](https://kentcdodds.com/blog/demystifying-testing)

- 테스트 개념을 잘 설명할 수 있나?
- Teach-an-engineer-to-fish 운동?
- You don't need any tools to write a simple test
- 이렇게 해서 지금 듣는 강의를 만들었나?

## 2021-07-16 금

[Effective snapshot testing](https://kentcdodds.com/blog/effective-snapshot-testing)

- 스냅샷 단접 by Justin
- 그럼에도 필요해
- 콘솔로그 스냅샷
- Css-in-js. 스타일에 민감한 컴포넌트 테스트
- 스냅샷 쓰지 말아야할 것
- 큰 스냅샷. 관리 안돼. 누구도 안봐
- 더 효과적인 스냅샷 위해
- 커스텀 직렬화
- 스냅샷 차이 비교. snapshot-diff

## 2021-07-17 토

[How to add testing to an existing project](https://kentcdodds.com/blog/how-to-add-testing-to-an-existing-project)

- 정적 테스트
- E2e xptmxm
- Unit eest
- 더 작성해라
- 내 강의를 사라

[Static. Unit. Integration. E2E Testing for FE apps](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)

- 테스트하는 이유: 자신감

[The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

## 2021-07-18 일

[UI Testing Myths](https://kentcdodds.com/blog/ui-testing-myths)

- 코드수정, 테스트 실패 → 세부구현 테스트 때문
- 리덕스 연결된 컴포넌트 테스트 어려워 → 연결해서 테스트
- E2e 느려 → 느리게 작섣하기 때문

[Why you've been bad about testing](https://kentcdodds.com/blog/why-youve-been-bad-about-testing)

- 무엇을 테스트할지
- 고장나면 심각한 것
- 범위를 좁혀라

# 2021-07-W4

총 10,기술 8

## 2021-07-19 월

[Why your team needs TestingJavaScript.com](https://kentcdodds.com/blog/why-your-team-needs-testing-javascript-com)

- 너무 대 놓고 홍보
- 코드 품질 관리 자동화 해야

[Introducing the react-esting-library](https://kentcdodds.com/blog/introducing-the-react-testing-library)

- enzyme 버려
- 세부사항 테스트는 안돼. 기능 테스트 해야

## 2021-07-21 수

개발자 온보딩 가이드

- 회사. 제품. 고객에 대해 학습
- 테스트 계정 만들어 주기
- 피드백 받아 온보딩 프로그램 개선
- 온보딩 성과측정. 질문들

[Gatsby v3 release notes . March 2021](https://www.gatsbyjs.com/docs/reference/release-notes/v3.0/)

- 2018이후 첫 메이져 업데이트. 3년만
- 점진적 빌드 in OSS
- 더 빠른 Refresh. React-hot-loader 제거
- ESLint 강제
- 웹팩 5
- React 17
- GraphQL 15

[Migrating from v2 to v3. Gatsby](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/)

- 해볼까?

## 2021-07-22 목

[페이스북 공화국](https://www.thestartupbible.com/2021/07/the-republic-of-facebook.html)

[Github Copilot: 첫인상](https://news.hada.io/topic?id=4639)

[애플카, 그리고 우리가 알던 자동차 산업의 종언](https://newspeppermint.com/2021/07/19/applecarautoindustry/)

- "소프트웨어가 모든 산업을 집어 삼키고 있어... 다음은 자동차"

[When I follow TDD](https://kentcdodds.com/blog/when-i-follow-tdd)

- 버그 고칠 때 사용. 테스트로 버그 재현. Fixing a bug? Try TDD
- 순수 함수 작성할 때
- 잘 정의된 UI 개발할 때

## 2021-07-23 금

[Should I write a test or fix a bug?](https://kentcdodds.com/blog/should-i-write-a-test-or-fix-a-bug)

- 우선순위 따져라. 돈. 고객

[Stop Mocking fetch](https://kentcdodds.com/blog/stop-mocking-fetch)

- msw를 소개.

## 2021-07-24 토

백신 예약 서버가 터지는 이유...

- 줄서기 우회할 수 있어
- 정적파일 무거워. 3MB (폰트 0.6MB)

Colocation

- 주석
- Html/view
- Css
- Tests
- State
- "Reusable" utility fields
- 예외. E2e 테스트

## 2021-07-25 일

육아는 꼭 그렇게 힘들어야 할까?

- 강박증 내려 놓아야

[Improve test error messages of your abstractions](https://kentcdodds.com/blog/improve-test-error-messages-of-your-abstractions)

- 추상화 했을 때 스택 트레이스 제대로 보여주기
- 에러를 다시 던짐
- Error.capturestacktrace() 뭐 이런게 있나 보구먼. node.js api

# 2021-07-W5

## 2021-07-26 월

[디지털 권력은 어떻게 우리를 지배하는가](https://www.hani.co.kr/arti/culture/book/1004794.html)

- "우리의 적들은 시스템을 알고 있다" 추천서

[팀이 회사 그 자체다](https://www.thestartupbible.com/2019/02/the-team-you-recruit-will-become-the-company-that-you-will-build.html)

- 좋은 사람들이 풍기는 아우라
- 에버노트의 필리번, 경령 관련 사례

[How to test custom React hooks](https://kentcdodds.com/blog/how-to-test-custom-react-hooks)

- @testing-library/react-hooks 배경 설명
- 수업에서도 잠시 볼것

[Make your test fail](https://kentcdodds.com/blog/make-your-test-fail)

- 테스트 올바로 작성해야
- preferr-inline-snapshot

## 2021-07-27 화

[Fix the "not wrapped in act(...)" warning](https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning)

- 잘 모르겠다

[Write fewer, longer test](https://kentcdodds.com/blog/write-fewer-longer-tests)

- "One assertion per test" → 원래는 실패 원인 파악이 어려워서 나온 말. 하지만 jest는 쉽게 찾을 수
- 여러 개 테스트를 하나로 묶어라

## 2021-07-28 수

[Write tests not too many. Mostly Integration](https://kentcdodds.com/blog/write-tests)

- 통합 테스트가 비용과 속도의 균형
- 너무 많이 목킹 말라

[Avoid the test user](https://kentcdodds.com/blog/avoid-the-test-user)

- Test implementation detail X

## 2021-07-30 금

[How to know what to test](https://kentcdodds.com/blog/how-to-know-what-to-test)

- 테스트 이유. 자신감. 코드보다는 유스케이스
- 코드커버리지 < 유스케이스 커버리지
- 코드 커버리지는 테스트 필요를 알려줌. 중요한 것은 모름
- 어떤 유스케이스가 이 코드를 사용하는지. 어떤 테스트가 이 유스케이스를 사용하는지 알아야
- 앱의 어떤 부분이 고장나면 속상
- 하나의 e2e 해피 패쓰

[Confidently shipping code](https://kentcdodds.com/blog/confidently-shipping-code)

- 테스트가 자신감. 속도 올림. 경험상 그래.
