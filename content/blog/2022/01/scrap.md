---
title: "2022-01 스크랩"
date: 2022-01-31
slug: /2022-01-scrap
layout: post
---

# 2022-010-08 금

React Conf 2021 Recap

- React 18
- Server Rendering (by suspense)
- → 영상을 하나씩 보자. 챙겨

# 2022-010-16일

Review2021 프런트엔드, 그리고 2022

- 몰랐던 것이 많구나. 키워드 줍줍

# 2022-010-21금

함수형 컴포넌트와 클래스, 어떤 차아가 존재할까?

- 함수형은 렌더시 값을 유지
- ref의 역할

테크니컬 라이팅 4대 원칙

- 명확, 간결, 정확, 일관

# 2022-010-29토

Formik 문서

- Formik
  - React component, hooks
  - 1. Getting values in and out of form state
  - 2. validation and error message
  - Handling form submission
- A Simple newsletter signup form
  - useFormik
  - id/name attributes
  - handleChange
- Validation
  - html validation has its limitations
    - 1. 브라우져에서만 동작
    - 2. 커스터 에러메시지 어려워/ 불가
    - 3. versy janky 아주 버벅거림?
  - validate(): value와 initialValue와 같은 키를 갖는 객체 반환
    - useFormik 인자로 전달
    - formik.errors에 에러 메시지 할당됨. → 만들어 볼수 있겠다.

# 2022-010-31월

Formik 문서 (계속)

- Schema Validation w/ Yup
  - you을 위한 api → validationSchema
  - formik 핵심 컨셉: 구조를 유지하는 것
  - 공통 스키마는 재활용 불가
- Reducing Boilerplate
  - getFieldProps()
  - Leveraging React context: Formik, Form, Field, ErrorMessage
  - "React is all about composition"
  - useField(): Field + ErrorMessage
- Wrapping Up

GeekNews.

- 오랜만. 번역 요약만 읽음
