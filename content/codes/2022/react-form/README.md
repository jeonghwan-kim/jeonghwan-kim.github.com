# 2022-02-01 React 폼 다루기

## 할 일

- [x] Formik 공식 문서 읽기
- [x] Formik 블로그 읽기
- [x] Formik 사용하기
- [ ] Formik 만들기
- [ ] Yup 만들기

## 문서 읽기

2022-02-05 토 [Painless React Forms with Formik](https://hackernoon.com/painless-react-forms-with-formik-e61b70473c60)

- Formik이 해결할 문제
  1. props -> form state 변환
  1. 검증, 오류 메시지 (with yup)
  1. 폼 제출
- hoc 방식을 사용
- yup.object().shape().when('email', (email) => ...) => 이걸 많이 쓰네
- gif 이미지 때문에 대충 읽음

2022-02-07 월 [Using Formik to Handle Forms in React](https://css-tricks.com/using-formik-to-handle-forms-in-react/)

- components live and breathe through thier state and prop
-

## React만 사용해서 만들기

`<SignupFormDefault>`

values 상태를 만들고 제어 컴포넌트 값으로 사용한다.

errors 상태를 만들고 오류 메세지를 다룬다.

touched 상태를 만들고 오류 메세지 값이 참일 경우 오류 errors 문자열을 렌더한다.

submitted 상태를 만들고 폼 제출 이후에는 필드 값이 변경될 때마다 값을 검증한다.

## formik 라이브러리 사용하기

useFormik() 훅으로 formik 객체를 만든다

- 폼 필드 초기값 `initialValues` 설정
- 검증 함수 `validate` 정의
  - 검증 라이브러리 yum을 사용할수 있게 `validationSchema` 값을 사용할 수 있다
- 폼 제출 이벤트 핸들러 `onSubmit` 정의

formik 객체를 이용해 엘리먼트를 만든다.

- 폼 제출 이벤트 핸들러 `formik.handleSubmit`
- 필드 값을 바인딩 한다 `formik.values[fieldName]`
  - 헬퍼 함수 `formik.getFieldProps(fieldName)`
- 필드 터치 유무와 값을 검증한 결과 오류 메시지를 출력한다. `formik.touched[fieldName]`, `formik.errors[fieldName]`

## 새로 배운 것

`ChangeEventHandler<>`, `FormEventHandler`

- 이벤트 핸들러 타입을 사용하자. 타입스크립트 지원 버전

## 참고 문서

- [Formik](https://formik.org/docs/overview)
-
