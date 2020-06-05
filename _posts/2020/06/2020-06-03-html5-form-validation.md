---
title: "HTML5 Form Validation"
layout: post
category: dev
tags: []
---

# 도입
검증이 가장 어렵더라 

# 검증 속성(Validation attributes)

이미 브라우져에는 폼 검증 기능이 구현되어 있어서 API를 제공하고 있다. 
이메일 입력 필드에 `required` 속성을 추가해보자.

```html
<form>
  <input name="email" placeholder="이메일을 입력하세요" required />
  <button>제출</button>
</form>
```

폼 컨트롤에 required 하나만 추가해도 브라우져에서는 이 필드 입력을 필수로 이해하고 검증로직을 태운다.
값을 입력하고 제출하기 버튼을 클릭하면 폼이 전송된다.
그러나 아무것도 입력하지 않고 제출하기 버튼을 클릭하면 다음과 같은 결과를 보여준다.

![result1]()

입력하지 않았기 때문에 폼을 전송하지 않는다.
게다가 "입력해야 한다"는 오류 메세지도 툴팁으로 띄워서 사용자에게 바른 입력을 하도록 유도하기까지 한다.

이처럼 HTML5 폼 컨트롤은 required 같은 검증 속성(validation attributes)을 가지고 있는데 다음 7가지 속성이 컨트롤 검증에 사용되는 것들이다.

- required
- minlength / maxlength
- min / max
- type
- pattern

# CSS 가상 클래스 

브라우져가 폼 컨트롤을 검증한 결과는 툴팁과 폼 제출 제어 뿐만 아니라 스타일에도 영향을 준다. 
브라우져는 required 속성을 붙인 요소에 `:valid`, `:invalid` 가상 클래스를 붙여준다.

![css-pseudo-calss]()

폼 컨트롤에 입력한 값의 유효성을 표시하기 위해 이 가상클래스를 활용하면 좋겠다.

```css
input:invalid {
  border-color: red;
}
```

잘못된 값이 들어 있는 경우 붉은색 테두리로 표시했다. 
트위터 부트스트랩 등 여러 라이브러리에서 이런 방식의 UI를 사용한다.

![result2]()

정리하면 HTML5 스펙을 따르는 모던 브라우져는 폼 검증을 다음 방식으로 동작한다. 

- 사용자가 데이터 전송을 시도한다.
- 입력값이 규칙에 맞으면 폼을 제출한다.
- 입력값이 규칙에 어긋나면 폼 전송을 차단한다.
- 차단 후 오류 문구를 툴팁 형태로 노출한다.


# 보채지 말자 

폼 검증을 개발하다 보면 이런 경우가 빈번하게 발생한다.
화면에 로딩하고 입력 필드에 값을 넣기도 전에 결과를 먼저 보여주는 경우가 그렇다.
마치 이전 결과처럼 말이다. 

이게 결코 좋은 모습은 아니라고 생각하는데 이제 막 입력하려고 하는데 붉은 색으로 피드백을 주는 것이 사용자에게 스트레스를 준다고 생각한다.
사용자가 폼 제출을 시도한 뒤에 결과를 알려주는 것이 공손하게 들리는 것 같다.

사용자가 제출 버튼을 클릭해서 submit 이벤트를 발생하면 폼을 검증한 뒤 맞지 않으면 invalid 이벤트를 발생한다. 
// todd 이벤트 호출 순서 확인 필요

이때 폼이 검증되었다는 표시를 해두면 될 것같다.
폼 요소에 클래스명을 추가하는 방식을 사용해 보자.

```js
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('invalid', () => {
    // 폼 검증 후 폼 요소에 was-validated 클래스로 표시해 둔다.
    document.forms[0].classList.add('was-validated')
  })
})
```

폼이 유효하지 않을 경우 폼 엘레먼트에 `.was-validated` CSS 클래스를 추가했다.
그럼 이 클래스가 있을 경우에만 `:invalid` 가상 클래스가 동작하도록 스타일 정의를 수정하자.

```css
form.was-validated input:invalid {
  border-color: red;
}
```

화면이 로딩되고 제출 버튼을 클릭하기 전까지는 `.was-validated` 클래스가 없다. 
따라서 입력 컨트롤에 검증 가상 클래스가 있더라고 이를 표시하지 않을 것이다. 

![result3]()

제출한 뒤에는 이렇게 검증 결과가 붉은 색으로 표시된다.

# Constraint Validation API

브라우져의 검증 시스템은 생각보다 많은 일을 해준다.
일곱가지 검증 규칙에 대한 검사하를 하고 입력이 옳지 않을 경우 알맞은 문구를 툴팁 형태로 띄워 준다.
현재 버전의 크롬에서는 입력할 때마다 실시간으로 사용자에게 가이드라인 메세지를 주어서 올바로 입력하도록 안내하는 역할도 하고 있다.

![message]()

만약 브라우져 로케일 정보가 한글이 아닌 영문, 혹은 일본어라면 메세지는 해당 언어로 번역되어 나온다.

![message-i18n]()

이러한 기본 동작이 개발 요구사항에 맞으면 몰라도 그렇지 않은 경우가 많은 것 같다. 
툴팁 스타일을 변경하고 싶거나, 브라우져 로케일과 무관하게 서비스 언어 제공에 따라 메세지를 보여주고 싶은 경우에 말이다. 

Constraint Validation API를 사용하면 검증 메시지를 요구사항에 맞게 커스터마이징 할 수 있다. 

이 API의 인터페이스는 다음 두 가지 모습을 갖추어야 한다.

- 폼 컨트롤 요소가 가질수 있는 검증 상태(ValidaityState)
- 제약 사항을 만족하지 못하면 invalid 이벤트를 발행

이미 사용했던 HTMLInputElement를 포함한 다음 7개 요소가 이 인터페이스를 따른다.

- HTMLButtonElement
- HTMLFieldsetElement
- HTMLInputElement
- HTMLObjectElement
- HTMLOutputElement
- HTMLSelectElement
- HTMLTextAreaElement

위 요소들은 일반 요소와 검증 상태를 나타내는 속성을 가지고 있다.

- validity: ValidityState를 나타내는 객체 
- validationMessage: 검증 결과 메세지
- willValidate: ?

또한 검증을 수행하고 invalid 이벤트를 발행하는 메소드도 가지고 있다.

- checkValidity(): 폼 입력 값을 검증하고 유효하지 않으면 invalid 이벤트를 발생한뒤 false를 반환
- reportValidity(): 상동? 
- setCustomValidity(message): message 툴팁을 띄움

자세한 내용은 다음 문서를 참고: https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation

# 커스텀 메세지 사용하기

검증 상태를 나타내는 validity 객체를 좀 들여다 보자.

```js
input.addEventListener('invalid', () => {
  console.log(input.validity) // todo 
})
```

입력 값에 대해 검증한 뒤 유효하지 않으면 invalid 이벤트를 발행하는데 그때의 input.validty 상태를 통해 검증 결과에 접근할 수 있는 것 같다. 

각 키가 오류를 나타내는 오류 메세지 맵을 맞들고 메세지 게터를 만들면 커스텀 메세지를 관리할 수 있을것 같다.

```js
const validityMessage = {
  // badInput: '잘못된 입력입니다',
  // patternMismatch: '_patternMismatch',
  // rangeOverflow: '_rangeOverflow',
  // rangeUnderflow: '_rangeUnderflow',
  // stepMismatch: '_stepMismatch',
  // tooLong: '_tooLong',
  // tooShort: '6자 이상 입력하세요',
  typeMismatch: '[커스텀 메세지] 이메일 주소 형식으로 입력하세요',
  valueMissing: '[커스텀 메세지] 이메일을 반드시 입력하세요',
}

// validity 객체를 받아 메세지 맵에서 커스텀 요류 메세지를 반환한다
function getMessage(validity) {
  for (const key in validityMessage) {
    if (validity[key]) {
      return validityMessage[key]
    }
  }
}
```

그럼 invalid 시점이 이 메세지 함수를 이용해서 오류 메세지를 지정해 주면 되겠다. 

```js
function showError(input) {
  /**
    * 커스텀 메세지: setCustomValidity()
    * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity
    * - 오류가 있으면 문자열 전달 
    * - 오류가 없으면 빈 문자열 전달
    */
  input.setCustomValidity(getMessage(input.validity) || '')
}

input.addEventListener('invalid', () => {
  // 커스텀 에러메세지 설정
  showError(input)
})
```

`setCustomeValidity(message)` 메소드는 오류가 있으면 문자열을 전달해서 브라우져 툴팁을 띄운다.
오류가 없으면 빈문자열을 전달해서 오류가 없다는 결과를 알리는 역할을 한다.

![result?]()

폼 검증 이후 입력이 있을 때도 알리기 위해 input 이벤트에도 이 로직을 추가하자.

```js
input.addEventListener('input', () => {
  // 커스텀 에러메세지 설정 
  showError(input)
})
```

# 커스텀 메세지 스타일링

오류메세지를 변경하는 것은 이렇게 하면 되지만 이걸 표현하는 방식은 여전히 브라우져 의존 적이다.

![custom-messages]()



# 결론 

폼을 작성할때 보통 이걸 끄고 라이브러리에서 제공하는 폼만 사용하다 보니 이것의 기능과 한계를 잘 몰랐다.