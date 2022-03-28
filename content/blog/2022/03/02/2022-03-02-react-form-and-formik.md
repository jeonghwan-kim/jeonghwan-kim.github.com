---
title: "리액트로 폼(Form) 다루기"
layout: post
category: dev
featuredImage:
---

# 서론

리액트 만으로 폼을 만들면 한계? 이제 정말 한계일까?

폼 기본 요구사항 정리 → formik의 역할 방향

- 값을 필드에 바인딩할 수 있다.
- 폼 제출을 처리할 수 있다.
- 폼 제출전에 필드 값을 검증할수 있다. 오류 메시지도 필드에 출한다.

직접 구현해보자. formik의 역할을 구현하는 것

# 로그인 폼 만들기

## 입력값 바인딩과 제출 이벤트 처리하기

_values, handleChage, handleSubmit_

간단한 로그인 폼을 만들어 보자.

```jsx
const LoginForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  })

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    alert(JSON.stringify(values, null, 2))
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={values.password}
        onChasnge={handleChange}
      />
      <button type="submit">로그인</button>
    </form>
  )
}
```

이메일과 비민번호를 입력받는 필드를 추가하고 values 상태를 정의해서 값을 연결했
다. 필드가 변경되면 handleChange() 함수가 values를 갱신한다. 폼이 제출되기만을기
다리는 handleSubmit() 함수는 이 값을 출력한다. 간단한 컴포컴넌트라서 머릿속에쉽
게 UI를 떠올릴 수 있다.

![이런 화면이 머릿속에 떠오를 것이다]()

## 필드 값을 검사하고 오류 메세지 보여주기

_errors, validate_

이번에는 폼을 제출하기 전에 필드 값을 검사하자. 오류가 있으면 오류 메세지를 보여
줄 것이다.

```jsx
const LoginForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  })

  // 오류 메세지를 담는다
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    // 필드 검사 후 잘못된 값이면 제출 처리를 중단한다.
    if (!validate()) {
      return
    }
    alert(JSON.stringify(values, null, 2))
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {/* 이메일 오류메시지를 출력한다 */}
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
      />
      {/* 비밀번호 오류메시지를 출력한다 */}
      {errors.password && <span>{errors.password}</span>}

      <button type="submit">로그인</button>
    </form>
  )
}
```

각 필드의 오류 메세지를 관리하기 위해 errors 상태를 정의했다. 이 값을 필드 아래
에 출력하는 리액트 앨리먼트도 추가했다.

폼을 제출하면 handleSubmit() 함수가 동작하는데 입력한 필드값을 검사하기 위해
validate() 함수를 호출한다. 검증에 통과하지못하면 폼을 제출하지 않는다.

입력한 필드값(values)를 검사한 뒤 기준에 맞지 않으면 오류 메세지를 errors 상태에
추가하는 기능이 남았다. 바로 validate() 함수의 역할이다. 아래 함수 정도로 구현할
수 있겠다.

```jsx
const LoginForm = () => {
  /* 생략 */

  // 필드값을 검증한다.
  const validate = () => {
    const nextErrors = {
      email: "",
      password: "",
    }

    if (!values.email) {
      nextErrors.email = "이메일을 입력하세요"
    }
    if (!values.password) {
      nextErrors.password = "비밀번호를 입력하세요"
    }

    // 오류 메세지 상태를 갱신한다
    setErrors(nextErrors)

    // 오류 여부를 반환한다
    return Object.values(nextErrors).every(v => !v)
  }

  /* 생략 */
}
```

필드값이 있는지 검사해서 없는 필드에 대한 오류 메세지를 추가한다. 모든 필드가 제
대로 입력 되었는지도 반환한다.

이메일이나 비밀번호 필드를 입력하지 않고 로그인 버튼을 누르면 오류 메시지가 각필
드 아래 노출될 것이다. 모든 필드를 채우고 로그인 버튼을 누르면 오류 메세지가 사
라질 것이다.

![오류 메세지를 노출한다]()

## 오류 메세지를 더 일찍 보여주기

_touched, handleBlur_

사용자는 입력할 필드가 많은 폼을 마주하면 부담스러워 한다. 수많은 필드를 거치며
제출 제출 버튼을 향해 묵묵히 필드에 값을 채워나가야 하는 의무가 있기 때문이다.

필드에 잘못된 값을 입력할때 바로 오류 메세지를 보여준다면 사용자가 쉽게 폼을 사
용할수 있어서 더 나은 UX다. 다만 사용자가 필드에 값을 다 채우기도 전에 오류 메세
지를 보여주는 것 이상하다. 사용자를 재촉하고 무례하기 때문이다.

사용자가 필드 입력을 마쳤다는 상태를 알고 있다면 이 값에 따라 오류 메세지를 노출
하면 되겠다. 입력했다는 상태는 언제 갱신할까? 사용자가 필드를 입력하고 다음 필드
로 넘어가는 시점에 발생하는 blur 이벤트를 사용하면 되겠다.

```jsx
const LoginForm = () => {
  /* 생략 */

  // 필드 방문 상태를 관리한다
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  // blur 이벤트가 발생하면 touched 상태를 true로 바꾼다
  const handleBlur = e => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {/* 필드에 방문하면 이메일 오류메시지를 출력한다 */}
      {touched.email && errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
      />
      {/* 필드에 방문하면 비밀번호 오류메시지를 출력한다 */}
      {touched.password && errors.password && <span>{errors.password}</span>}

      <button type="submit">로그인</button>
    </form>
  )
}
```

blur 이벤트가 발생하면 사용자가 특정 필드에 입력을 마쳤다고 볼 수 있겠다.
touched 상태는 각 필드의방문여부를 나태내는변수다.

handleBlur() 함수는 blur 이벤트를 발생한 필드의 touched 상태를 true 값으로 변경
한다. 이 핸들러는 각필드의 onBlue 콜백함수로 등록했다.

필드 입력중에 검증을 하고 오류 메세지를 생성해야 필드 방문 후에 오류 메세지가 표
시될 것이다.

```jsx
const LoginForm = () => {
  // 입력 값이 변경될 때마다 검증한다.
  useEffect(() => {
    validate()
  }, [state, validate])

  const handleSubmit = () => {
    e.preventDefault()

    // 모든 필드에 방문했다고 표시한다.
    setTouched({
      email: true,
      password: true,
    })

    if (!validate()) {
      return
    }

    alert(JSON.stringify(values, null, 2))
  }
}
```

필드 입력값이 변경될 때마다 필드 값을 검증하도록 했다. 뿐만 아니라 폼 제출을 처
리할 때도 모든 필드에 방문했다고 표시했다. 오류 메세지가 있을 경우 보여주기 위해
서다.

이제 사용자가 각 필드에 값을 입력한 뒤 다른 필드로 커서를 옮기면 검증한 오류메세
지를 곧장 노출한다.

전체 코드를 보면서 정리해 보자.

```jsx
const LoginForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  // 필드 방문 상태를 관리한다
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  // blur 이벤트가 발생하면 touched 상태를 true로 바꾼다
  const handleBlur = e => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()

    // 모든 필드에 방문했다고 표시한다.
    setTouched({
      email: true,
      password: true,
    })

    // 필드 검사 후 잘못된 값이면 제출 처리를 중단한다.
    if (!validate()) {
      return
    }

    alert(JSON.stringify(values, null, 2))
  }

  // 필드값을 검증한다.
  const validate = useCallback(() => {
    const nextErrors = {
      email: "",
      password: "",
    }

    if (!values.email) {
      nextErrors.email = "이메일을 입력하세요"
    }
    if (!values.password) {
      nextErrors.password = "비밀번호를 입력하세요"
    }

    // 오류 메세지 상태를 갱신한다
    setErrors(nextErrors)

    // 오류 여부를 반환한다
    return Object.values(nextErrors).every(v => !v)
  }, [values])

  // 입력값이 변경될때 마다 검증한다.
  useEffect(() => {
    validate()
  }, [values, validate])

  return (
    <>
      <h1>3단계. 오류 메세지를 더 일찍 보여주기 </h1>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/* 이메일 오류메시지를 출력한다 */}
        {touched.email && errors.email && <span>{errors.email}</span>}

        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/* 비밀번호 오류메시지를 출력한다 */}
        {touched.password && errors.password && <span>{errors.password}</span>}

        <button type="submit">Login</button>
      </form>
    </>
  )
}
```

# 재활용 가능한 형태로 개선하기

이렇게 해서 폼의 요구사항을 어찌어찌 구현은 했다.

- 값을 필드에 바인딩할 수 있다. (values, handleChange)
- 폼 제출을 처리할 수 있다. (handleSubmit)
- 폼 제출전에 필드 값을 검증할수 있다. 오류 메시지도 필드에 출한다. (errors,
  touched, handleBlur)

하지만 이런 방식은 생산적이지 못하다. 코드를 다시 사용할 수 없기 때문이다. 이번
에는 재사용 가능한 형태로 개선해 보자.

## useForm 훅으로 분리

로그인 폼은 두 가지 역할이 섞여 있다. 폼을 다루는 어플리케이션 기능과 로그인이라
는 도메인 기능이다. 폼은 로그인 폼 뿐만 아니라 다양한 목적을 위한 폼을 만드는데
다시 쓰일수 있다. 기존 로그인 코드에서 폼 기능만 쏙 빼서 useForm 이라는 훅으로분
리해 보자.

```jsx
// useForm은 폼 기능을 제공한다
function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  const handleBlur = e => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()

    setTouched(
      Object.keys(values).reduce((touched, field) => {
        touched[field] = true
        return touched
      }, {})
    )

    const errors = validate(values)
    setErrors(errors)

    if (Object.values(errors).some(e => e)) {
      return
    }

    onSubmit(values)
  }

  const runValidator = useCallback(() => validate(values), [values])

  useEffect(() => {
    const errors = runValidator()
    setErrors(errors)
  }, [values, runValidator])

  // 훅을 사용하는 쪽에 제공하는 api다
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
```

## getFieldProps 유틸 함수 제공

getFieldProps()

## 리액트 컨택스트 사용하기

_<Form> <Field> <ErrorMessage>_

# Formik 소개

## Hello world

## useForm, useField, use

## Context: Form, Field, ErrorMessage

# 결론

정리: 구현 → 재활용 → 최적화 →

formik api 소개

---

ref를 사용하는 이유는 뭘까? 상태로 저장하지 않는걸?

useCallback은?

useMemo는?

yup. 선언형 밸리데이터
