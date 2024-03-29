---
slug: "/dev/2021/08/09/testing-frontend.html"
date: 2021-08-09
title: 프론트엔드 테스트할 기회가 생겼다
layout: post
category: 개발
tags: [test]
---

백엔드 개발할 때 웬만하면 테스트 코드를 작성했다. 어플리케이션을 출시한 뒤에도 부족한 테스트를 마져 작성했는데 이런 방식이 코딩에 자신감을 주었기 때문이다. 새로운 기능을 만들거나 버그를 수정 하더라도 자동화된 테스트 덕분에 회귀 테스트를 빠르게 반복 할 수 있기 때문이다.

한편 프론프엔드 개발에서는 테스트를 잘 못했다. 초반에 몇 번 시도해 보았지만 최근에는 거의 테스트 코드를 작성하지 않는다. 유틸리티 함수만 조금 테스트하고 대부분의 코드를 차지하는 UI 대해서는 QA에 전적으로 의존한다.

백엔드 개발에서처럼 프론트엔드에도 자동화된 테스트가 항상 아쉽다. 이번에 출시 한지 3년 이상 지난 프로덕트의 운영 업무를 맡았다. 신규 피쳐 개발이 적고 버그를 고치거나 데이터를 확인하는 정도의 일을 하고있는데 프론트엔드 테스트를 다시 시도해 볼 좋은 기회라고 생각한다.

## 테스트 하려는 이유

개발 프로세스에 테스트가 없는 것은 아니다. 개발이 완료되면 전문 QA의 검사가 기다리고 있는데 제품의 버그를 줄이고 일정 수준 이상의 품질을 유지할수 있는 것은 꼼꼼한 테스트 덕분이다. 그럼에도 불구하고 코딩할 때 테스트 하려는 이유는 뭘까? 정확히 얘기하면 "자동화된 테스트"다.

이것은 과거 경험에서 기인하다. 서두에서도 얘기했지만  테스트 코드는 여러 면에서 좋다.

첫째, 만든 구현물에 대한 자신감이 생긴다. 정상 동작하는 것 뿐만 아니라 예외 케이스와 에지 케이스를 테스트하기 때문이다. 수동 테스트는 사람이 직접 수행하지만 자동화된 테스트는 컴퓨터가 실행하기 때문에 언제든지 테스트를 반복할 수 있다. 코드에 변화가 있을 때마다 테스트 하기 때문에 변경한 코드에 대한 자신감이 생기는 것이다.

둘째, 한 번 발생한 버그는 다시 발생하지 않는다. 제품을 운영하다가 버그 리포팅이 들어오면 테스트 코드로 버그를 재현한다. 또 하나의 테스트 케이스가 생기는 셈이다. 테스트 코드로 재현한 버그를 수정한다. TDD에서 말하는 레드, 그린, 블루 패턴을 적용할 수 있다.

셋째, 좋은 코드를 만들 수 있다. 테스트 코드를 한 번이라도 작성해 본 사람은 테스트 케이스를 작성하는데 상당히 많은 제약을 경험했을 것이다. API 호출, 데이터베이스 접근 등 외부 요소에 대해 고려해야 하는데 이러한 제약 덕분에 테스트 하려는 대상의 역할을 조절하다보면 설계에 대한 고민을 하게 된다.

## 테스팅 라이브러리

테스트 하려는 제품이 리액트 기반이다. [리액트 문서 말미](https://ko.reactjs.org/docs/testing.html#tools)에 보면 테스트 도구로 Jest와 [RTL](https://testing-library.com/docs/react-testing-library/intro/)을 소개한다. Jest는 테스트 코드를 실행하는 역할이고 RTL은 "React 컴포넌트를 테스트하게 하는 도구 모음" 정도로 소개한다.

RTL 웹페이지로 이동하면 Testing Library 중 하나의 라이브러리인 것처럼 보인다. Testing Library에는 리액트 뿐만 아니라 여러 프레임워크 뿐만 아니라 바닐라 자바스스크립트 테스트를 위한 도구를 제공한다.

이 라이브러리의 [원칙](https://testing-library.com/docs/guiding-principles/)이 인상 적이다.

> The more your tests resemble the way your software is used, the more confidence they can give you.

소프트웨어가 사용하는 것처럼 테스트 할수록 더 자신감을 가질 수 있다.

[이전에 다른 컴포넌트 테스트 방법](https://jeonghwan-kim.github.io/vue/2017/04/19/vue-component-test.html)을 보면서 '이걸 현실에 맞게 활용할 수 있을까?' 라는 의문을 가졌었다. 컴포넌트의 상태를 체크하는 등 세부 구현을 검증하는 방법이 좀 맘에 들지 않았다. 왜나면 리팩토링 하고나면 구현 방식이 달라질 수 있는데 매번 테스트도 변경해야 하기 때문이다.

반면 소프트웨어가 엔드 유저에게 제공하는 기능을 테스트 한다면 세부 구현에 얽매이지 않을 것이다. RTL에서 말하는 것이 이것이다. 소프트웨어가 사용되는 것처럼 테스트를 만들어 놓으면 코드를 리팩토링 하더라도 테스트가 유지 될 수 있다. 매번 테스트 코드를 고쳐야한다면 테스트 작성자는 얼마가지 않아 지쳐 포기하게 될 것이다.

## 결론

평소 스스로 부족하다고 생각한 분야 중 하나가 테스트다. 이론 뿐만 아니라 경험도 적어서 궁금하던 차에 모처럼 프로트엔드 테스트에 대해 경험할 기회가 생겨서 반갑다.
