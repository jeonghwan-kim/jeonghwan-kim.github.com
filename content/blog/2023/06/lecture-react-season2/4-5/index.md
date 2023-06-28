---
slug: "/2023/06/24/lecture-react-season2-part4-ch5"
date: 2023-06-24 00:04:05
title: "[리액트 2부] 4편 최종정리"
layout: post
series: 리액트 2부
tags: [react]
---

마침내 마지막 4편을 정리할 시간이다.

1장. 레프훅

- 리랜더링과 무관하게 지속할 수 있는 값을 제공
- 상태 훅과 비슷하지만 리랜더징 하지않음
- Diloag, OrderForm 활용

2장. 제어폼

- 제어컴포넌트 이해
- 제어컴포넌트 폼을 재사용하기 위한 MyForm
- useForm, getFieldProps
- Form, Field, ErrorMessage
- OrderForm 활용

3장. 리듀서 훅

- 배경. 상태 관리 복작해질 경우 사용
- 상태관리로직 재사용
- 스토어. 스토어 구독시 리랜더 구조
- MyForm을 리듀서 버전으로 추가 구현

4장. 메모이제이션 훅

- 메모이제이션 기법
- 컴포넌트 메모이제이션: useMemo, useCallback, memo
- OrderStatusCard, useParams 활용
