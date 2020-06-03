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
required 속성을 붙인 코드에 보면 `:valid`, `:invalid` 가상 클래스를 붙여준다.

![css-pseudo-calss]()

폼 컨트롤에 입력한 값의 유효성을 표시하기 위해 이 가상클래스를 활용하면 좋겠다

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
- 차단 후 에러메세지를 툴팁 형태로 노출한다.


# 보채지 말자 

폼 검증을 개발하다 보면 이런 경우가 빈번하게 발생한다.
화면에 로딩하고 입력 필드에 값을 넣기도 전에 결과를 먼저 보여주는 경우가 그렇다.
마치 이전 결과처럼 말이다. 

이게 결코 좋은 모습은 아니라고 생각하는데 그동안 그렇게 만들었던게 있었다.

이제 입력하려고 하는데 붉은 색으로 피드백을 주는 것이 긴장하게 만들기 때문이다.
사용자가 폼 제출을 시도한 뒤에 결과를 알려주는 것이 공손하게 들리는 것 같다.

사용자가 제출 버튼을 클릭해서 submit 이벤트를 발생하면 폼을 검증한 뒤 맞지 않으면 invalid 이벤트를 발생한다. 
// 이벤트 호출 순서 확인 필요
이때 폼이 검증되었다는 의미로 표시를 해두면 될 것같다.

```js
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('invalid', () => {
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

# 커스텀 메세지 사용하기






# 결론 

폼을 작성할때 보통 이걸 끄고 라이브러리에서 제공하는 폼만 사용하다 보니 이것의 기능과 한계를 잘 몰랐다.