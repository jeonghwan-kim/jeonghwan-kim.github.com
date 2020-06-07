---
title: "HTML5 Form Validation"
layout: post
category: dev
tags: html5 
---

폼은 웹개발 할 때 반드시 다뤄야하는 기술이다. 
아이디와 비밀번호를 입력하는 화면, 포스트를 작성하는 화면, 더 나아가 수십가지 데이터를 입력해야하는 커머스 어드민까지 폼은 웹 개발에 있어서 폭넓게 사용되고 있다.
그 때마다 적당한 라이브러리를 사용해서 폼을 다루었다. 

- 앵귤러 [ngForm](http://jeonghwan-kim.github.io/angular-form/)
- 뷰 [vee-validate](http://jeonghwan-kim.github.io/2018/05/31/vue-form-validation.html#vee-validate)
- 리액트 [antd](http://jeonghwan-kim.github.io/2018/10/13/ant-design-101.html)

프레임웍마다 커뮤니티에서 많이 사용하는 라이브러리를 가져다 요구사항에 맞는 폼 로직을 구현해왔다.

하지만 브라우져가 자동으로 처리하는 폼 검증 기능을 꺼버리고(novalidate) 라이브러리만 사용했던 것이 좀 안타까웠다. 
HTML5 스펙을 구현해 놓은 이 기능을 좀 알고 있어서 상황에 맞게 사용할지 대안을 찾을지 결정하는 것이 더 합리적인 결정 과정이라는 생각이 든다.

그래서 HTML5 명세를 따르는 일명 모던 브라우져가 가지고 있는 폼 제어 로직을 정리해 보도록 하자.

# 검증 속성(Validation attributes)

대부분 브라우져는 폼 검증 할 수있는 기능이 있고 개발자가 사용할 수 있도록 API를 제공한다.
가령 이메일 입력 필드를 반드시 입력 받고자 한다면 요소에 `required` 속성을 한 번 추가해 보자.

```html
<form>
  <!-- required 속성을 추가했다 -->
  <input name="email" placeholder="이메일을 입력하세요" required />
  <button>제출</button>
</form>
```

입력 요소에 `required` 속성 하나만 추가했을 뿐이지만 브라우져는 이 필드 입력의 입력을 필수로 알고 검증 로직를 수행할 것이다.
사용자가 올바른 값을 입력하고 제출하기 버튼을 클릭한다면 폼은 기대하는것 처럼 서버로 전송된다.
반면 아무것도 입력하지 않고 제출하기 버튼을 클릭하면 다음과 같은 결과를 보여준다.

![result1](/assets/imgs/2020/06/03/result1.jpg)

제출 버튼을 클릭하면 브라우져의 검증 로직이 실행되고 선언한 `required` 규칙과 맞지 않아서 폼을 전송하지 않는다.
게다가 "이 입력란을 작성하세요"라는 오류 메세지도 근처에 툴팁으로 띄워 사용자로 하여금 바르게 입력하도록 한다.

이처럼 HTML5 의 입력 요소는 `required`를 포함한 검증 속성([validation attributes](https://developer.moz5illa.org/en-US/docs/Learn/Forms/Form_validation))을 가지고 있는데 아래가 검증에 사용되는  속성들이다.

  - required
- minlength / maxlength
- min / max
- type
- pattern

# CSS 가상 클래스 

브라우져가 폼 컨트롤을 검증한 결과는 폼 제출 여부와 툴팁 메세지 뿐만 아니라 입력 요소의 스타일에도 영향을 준다. 
브라우져는 검증 속성을 붙인 요소는 폼 검증 후에 `:valid`와 `:invalid` 가상 클래스가 추가된다.

- `:valid`: 유효한 값을 입력한 경우
- `:invalid`: 유효하지 않은 값을 입력한 경우

요소 값의 유효성을 표시하기 위해 이 가상클래스를 활용하면 좀 더 명확한 UI로 사용자에게 결과를 전달할 수 있다.

```css
input:invalid {
  border-color: red;
}
```

요소에의 값이 규칙에 어긋날 경우 붉은색 테두리로 표시하도록 했다. 
트위터 부트스트랩 등 여러 라이브러리에서 이런 방식의 UI를 사용한다.

![result2](/assets/imgs/2020/06/03/result2.jpg)


정리하면 HTML5 스펙을 따르는 모던 브라우져는 아래 방식으로 폼 입력 값을 처리한다.

- 사용자가 요소에 값을 입력한다
  - 검증 결과에 따라 요소에 `:valid/:invalid` CSS 가상 클래스를 추가한다
- 사용자가 폼 데이터 전송을 시도한다
- 요소에 설정한 규칙에 의해 입력값을 검증한다
  - 검증에 통과하면 데이터를 서버로 전송한다
  - 검증에 통과하지 못하면 서버 전송을 차단한다
    - 오류 문구를 툴팁 형태로 노출한다

# 오류 메세지를 차분하게 보여주자

화면에 폼 검증을 추가하다 보면 이전 결과처럼 작업했던 경우가 종종 있었다.
무슨말인가 하면, 화면에 진입하고 요소에 값을 입력하기도 전에 결과를 먼저 보여준다는 것이다.

사용자 입장에서는 이제 입력하려고 하는데 붉은 색으로 피드백을 주는 것은 웬지모를 긴장감을 주는 것으로서 결코 좋은 모습은 아니라고 생각한다.
사용자가 폼 제출을 시도한 뒤에 결과를 알려주는 것이 어쩌면 공손하게 보이는 것같다.
브라우져의 툴팁은 이미 그렇게 동작하고 있다. 
테두리의 붉은 표시도 툴팁처럼 폼 제출후에 동작하도록 하면 좋겠다.

폼 제출을 시도하면 브라우져는 폼의 입력값을 검증한 실패하면 [invalid](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event) 이벤트를 발생시킨다.

이 시점에 폼이 검증되었다는 표시를 해두면 이걸 보고 요소에 붉은색 표시를 하면 되겠다.
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
그럼 이 클래스가 있을 경우에만 `:invalid` 가상 클래스가 동작하도록 스타일을 수정하자.

```css
/* 폼 검증 후에만 invalid 스타일을 적용한다 */
form.was-validated input:invalid {
  border-color: red;
}
```

화면이 로딩되고 제출 버튼을 클릭하기 전까지는 폼 요소에는 `.was-validated` 클래스가 없다.
따라서 입력 컨트롤에 검증 가상 클래스가 있더라고 이를 표시하지 않을 것이다. 

![result3](/assets/imgs/2020/06/03/result3.jpg)

제출한 뒤에는 툴팁이 뜨고 

![result4](/assets/imgs/2020/06/03/result4.jpg)

요소에 붉은 색으로 테두리가 표시된다.

![result5](/assets/imgs/2020/06/03/result5.jpg)

# Constraint Validation API

브라우져의 폼 검증 기능은 생각보다 많은 일을 해준다.
위에서 언급한 일곱가지 규칙에 대한 검증을 한다. 
다시 한번 요약하면 요소의 입력이 유효하지 않을 경우 폼을 전송을 차단하고 오류 문구를 툴팁 형태로 띄워주며 CSS 가상 클래스도 추가한다. 

만약 브라우져 로케일이 한글이 아니라면 메세지는 해당 언어로 번역되어 나온다.

![message-i18n](/assets/imgs/2020/06/03/message-i18n.jpg)

이러한 브라우져의 기본 동작들을 잘 사용할 수 있다면 무척 편하게 개발할 수 있을 것 같지만 그렇지 못한 경우가 많았다.
브라우져 별로 다른 메세지 UI와 운영체제/브라우져 세팅에 달라지는 언어는 대부분의 사람들이 일관적이지 못하다고 느끼는 것 같다.
그래서 보통은 커스텀 메세지, 커스텀 디자인을 사용하는 이유이기도 하다.

[Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation)를 사용하면 HTML5 만으로도 직접 검증 메시지를 커스터마이징할 수 있다.

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
- willValidate: 요소가 검증 후보인지 여부 

또한 검증을 수행하거나 invalid 이벤트를 발행하는 메소드도 가지고 있다.

- checkValidity(): 폼 입력 값을 검증하고 유효하지 않으면 invalid 이벤트를 발행. false를 반환한다.
- reportValidity()
- setCustomValidity(message): 오류 메세지를 보여준다.

# 커스텀 메세지 보여주기 

검증 상태를 나타내는 validity 객체를 좀 들여다 보자.

```js
input.addEventListener('invalid', () => {
  /**
   * ValidityState {
   *   badInput: false,  // 잘못된 입력 
   *   customError: false, // 커스텀 오류
   *   patternMismatch: false, // 패턴 오류
   *   rangeOverflow: false, // 범위 초과 오류
   *   rangeUnderflow: false, // 범위 미달 오류
   *   stepMismatch: false, // 간격 오류
   *   tooLong: false, // 길이 오류
   *   tooShort: false, // 길이 오류
   *   typeMismatch: false, // 타입 오류
   *   valid: false, // 검증 결과 
   *   valueMissing: true // 필수값 오류
   * }
   */
  console.log(input.validity);
})
```

입력 값에 대해 검증한 뒤 유효하지 않으면 `invalid` 이벤트를 발행하는데 그때의 `input.validty`로 ValidityState 값에 접근할 수 있다.

각 오류 상태를 불리언 값으로 가지고 있다는 걸 눈여겨 보자. 
이를 이용해 오류 메세지 사전을 만들고 메세지 조회 함수를 만들면 커스텀 메세지를 관리할 수 있을것 같다.

```js
// 오류 메세지 사전을 만든다
const validityMessage = {
  badInput: '[커스텀 메세지] 잘못된 입력입니다.',
  patternMismatch: '[커스텀 메세지] 패턴에 맞게 입력하세요',
  rangeOverflow: '[커스텀 메세지] 범위를 초과하였습니다',
  rangeUnderflow: '[커스텀 메세지] 범위에 미달하였습니다',
  stepMismatch: '[커스텀 메세지] 간격에 맞게 입력하세요',
  tooLong: '[커스텀 메세지] 최대 글자 미만으로 입력하세요',
  tooShort: '[커스텀 메세지] 최소 글자 미만으로 입력하세요',
  typeMismatch: '[커스텀 메세지] 형식에 맞게 입력하세요',
  valueMissing: '[커스텀 메세지] 이 필드를 반드시 입력하세요',
}

// validity 객체를 받아 메세지 맵에서 오류 메세지를 찾는다
function getMessage(validity) {
  for (const key in validityMessage) {
    if (validity[key]) {
      return validityMessage[key]
    }
  }
}
```

이제 invalid 이벤트가 발행하면 이 메세지 함수로 오류 메세지를 지정해 주는 일만 남았다.

```js
function showError(input) {
  /**
    * 커스텀 메세지: setCustomValidity()
    * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity
    * - 오류가 있으면 문자열 전달 
    * - 오류가 없으면 빈 문자열 전달
    */
  input.setCustomValidity(getMessage(input.validity) || '');
}

input.addEventListener('invalid', () => {
  // 커스텀 에러메세지 설정
  showError(input);
})
```

`setCustomeValidity(message)` 메소드는 오류가 있으면 문자열을 전달해서 브라우져 오류 메시지 툴팁을 띄운다.
그렇지 않으면 빈 문자열을 전달해서 오류가 없다는 결과를 알리는 역할을 한다.

![result6](/assets/imgs/2020/06/03/result6.jpg)
![result7](/assets/imgs/2020/06/03/result7.jpg)

폼 검증 이후 입력이 있을 때도 알리기 위해 input 이벤트에도 이 로직을 추가하자.

```js
input.addEventListener('input', () => {
  // 커스텀 에러메세지 설정 
  showError(input);
})
```

# 커스텀 메세지 스타일링

오류메세지를 변경하는 것은 이렇게 하면 되지만 이걸 표현하는 방식은 여전히 브라우져 의존적이다.

![firefox](/assets/imgs/2020/06/03/firefox.jpg)
(파이어폭스 브라우져)

![safari](/assets/imgs/2020/06/03/safari.jpg)
(사파리 브라우져)


메시지 UI의 일관성을 지켜야 한다면 각 브라우져의 스타일을 무시하고 직접 만들어야 할 것 같다.
인풋 요소 근처 적당한 곳에 오류 메세지를 보여줄만한 요소를 추가하자.

```html
<input name="email" placeholder="email" required type="email" minlength="6"/>
<!-- 오류 메세지를 보여줄 요소 -->
<span id="error"></span>
```

오류 메세지를 출력하는 `showError()` 함수를 이렇게 변경했다. 

```js
function showError(input) {
  // 커스텀 오류 메시지 UI
  document.querySelector('#error').textContent = getMessage(input.validity)
}
```

`setCustomValidity()` 함수로 툴팁을 표시하도록 했던 이전 코드 대신, 요소에 메세지를 추가하는 코드다. 

검증 후 발생하는 invalid 이벤트 핸들러도 수정해야한다.
이벤트가 발생하면 브라우져 검증 메세지 툴팁을 띄우는 것이 기본 동작인데 이것을 차단하는 코드를 추가했다.

```js
input.addEventListener('invalid', (e) => {
  // 브라우져 툴팁 숨김 
  e.preventDefault();
})
```

이제는 브라우져 기본 툴팁 대신 커스텀 오류 메세지를 커스텀 스타일로 보여줄 수 있다. 

![result8](/assets/imgs/2020/06/03/result8.jpg)

# 결론 

브라우져의 폼 제어는 분명 할수 있는 것과 할수 없는 것이 있다. 
아주 간단한 코드만으로 검증 기능을 만들고 이를 사용자에게 피드백할 수 있다는 점은 무척 매력적이다. 
오류 메세지나 스타일을 커스터마이징 하는것도 그렇게 부담스러운 작업이 아니다. 

하지만 검증 부분에 있어서는 한계가 있는 것 같다. 
가령 입력값을 서버 API 호출로 검증하는 경우가 그렇다. 
인풋 요소의 규칙이 요소간의 의존적이 경우도 있을 수 있다. 
예를 들어 옵션을 선택했을 경우에는 색상이 필드라던지 말이다. 
이러한 부분은 기존의 검증로직을 확장하던지 새로 만들어야할 지도 모르겠다. 
어쩌면 이때 라이브러리 도입을 고민해 보는 것이 더 좋을수도 있겠다. 

그동안 웹개발을 하면서 폼에 대해 막연히 어렵다고만 생각했다. 
아마 요구사항에 대해 어떤 기술을 사용해야할지 정확히 판단하지 못해서인것 같다.
그런 점에서 브라우져의 기능의 범위를 알고 있다면 좀 더 현명한 판단을 할 수 있을것 같다는 생각이 든다. 
