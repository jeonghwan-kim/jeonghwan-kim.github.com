---
title: "프론트엔드 개발환경의 이해: 린트"
layout: post
summary: ""
category: series
tags:
---

오래된 스웨터의 보푸라기 같은 것을 린트(Lint)라고 부른다. 보푸라기가 많으면 옷이 보기 좋지 않다.
코드에서 린트는 뭘까? 들여쓰기를 맞추지 않을 경우. 괄호를 열지 않은 경우.
이런 것은 코드를 읽기 어렵게 만든다.
보프라기 있는 옷을 입을 수 있듯이 이러한 코드가 동작하지 않는 것은 아니다.
하지만 가독성이 떨어지고 운영하기 어려운 결과를 낳는다.

린트 롤러(Lint roller)가 보푸라기를 제거하듯이 이러한 코드 스멜을 제가하는 것을 린트(Lint)라고 부른다.

# 1. 배경

다음 상황을 보자.

```js
console.log()
(function() {})();
```

sum() 함수를 실행하고 다음줄의 즉시 실행함수를 실행하도록 의도하는 코드다. 
아마도 Hello World 문자열를 로깅창에 출력하도록 하려는 것 같다. 
하지만 이 코드를 브라우져에서 실행해 보면 TypeError가 발생한다.
 유심히 보면 각 문의 마지막에 세미콜론을 누락한 것이 보일 것이다. 
 모두 한 줄로 인식해서 sum()(msg => console.log(msg))(‘hello world’) 의 하나의 문이 되는 것이다. 
 sum() 이 반환하는 것이 함수가 아니라서 타입에러가 발생한다. 이것의 의도한 동작이 아니다. 
 모든 문에 세미콜론을 붙였다면 혹은 즉시 함수호출 앞에 세미콜론을 붙였다면 예방할 수 있는 버그다.

코딩 컨벤션은 코드의 가독성을 높이는 것 뿐만 아니라 동적 언어인 자바스크립트의 특성인 런타임에 가서야만 버그를 확인할수 있는 단점을 미리 찾아주는 역할도 있다.

## 2. ESLint

### 2.1 기본 개념 

ESLint는 ECMAScript 코드에서 문제점을 찾고 고치는 개발 도구다. 
버그를 제거하고 더 단단한 코드를 만드는 것이 이 도구를 사용하는 목적이다. 
과거 JSLint, JSHint에 이어서 최근에는 ESList를 많이 사용하는 편이다.

ESLint가 점검하는 것은 크게 두 가지 분류다.

- 포맷팅
- 코드 품질

포맷팅은 일관된 코드 스타일을 유지하도록 하고 개발자로 하여금 쉽게 읽히는 코드를 만들어 준다. 
이를 테면 들여쓰기 규칙, 코드 라인의 최대 너비 규칙 등을 지키는 코드가 가독성이 좋다. 

한편 코드 품질은 어플리케이션의 잠재적인 버그를 예방해 주기 위함이다. 
예를 들어 사용하지 않는 변수 쓰지 않기, 글로벌 스코프 함부로 다루지 않기 등이 버그 발생 확률을 줄여 준다.

ESLint로 이러한 규칙 통해 코드를 검사하고 더 나아가 좋은 코드로 변환하는 방법을 알아 보자.

### 2.2 설치 및 사용법

노드 패키지로 제공되는 ESLint 도구를 다운로드 한다.

```
$ npm i eslint -D
```

여느 도구처럼 환경설정 파일을 프로젝트 최상단에 생성한다.

```js
// .eslintrc.js:
module.export = {}
```

env 옵션에 빈 객체를 노출하는 모듈로 만들었다.

먼저 아무런 설정 없이 ESLint로 코드를 검사해 보자.

```
$ npx eslint app.js
```

아무런 결과를 출력하지 않고 프로그램을 종료한다. 

### 2.3 규칙(Rules)

ESLint는 검사할 규칙을 미리 정해 놓았다. 
문서의 [Rules](https://eslint.org/docs/rules/) 메뉴에 그 목록을 확인할 수 있다.

우리가 우려한 문제와 관련된 규칙은 [no-unexpected-multiline](https://eslint.org/docs/rules/no-unexpected-multiline)이다. 
설정의 rules 객체를 추가한다.

```js
.eslintrc.js
modules.exports = {
  rules: {
    "no-unexpected-multiline”: 2
  }
}
```

규칙에 설정하는 값은 세 가지다. 0은 끔, 1은 경고, 2는 에러. 설정한 규칙에 어긋나는 코드를 발견하면 에러를 출력하도록 했다.

다시 검사해 보자.

```
$ npx eslint app.js
2:1 error  Unexpected newline between function and ( of function call  no-unexpected-multiline
```

예상대로 에러가 발생하고 코드 위치와 위반한 규칙명을 알려준다.
코드 앞에 세미콜론을 넣거나 모든 문의 끝에 세미콜론을 넣어 문제를 해결한다. 그리고 다시 검사하면 검사에 통과한다.

### 2.4 자동으로 수정할 수 있는 규칙

자바스크립트 문뒤에 세미콜론을 여러개 입력해도 어플리케이션은 동작한다. 
그러나 이것은 코드를 읽기 어렵게 하는 장애물이 될 수도 있기 때문에 지양해야 한다. 
아마도 그렇게 작성한 코드가 있다면 실수로 입력했를게 틀림 없다.

이 문제와 관련된 거은 [no-extra-semi](https://eslint.org/docs/rules/no-extra-semi) 규칙이다.

app.js를 다음과 같이 수정한뒤 

```js
// app.js
console.log();; // 세미콜론 연속 두 개 붙임
```
린트 설정에 규칙 이 규칙을 추가하고

```js
// .eslintrc.js:
exports.module = {
  rules: {
    "no-extra-semi": 2, 
  }
}
```

코드를 검사하면 에러를 출력한다.

```
$ npx eslint app.js
1:15  error  Unnecessary semicolon  no-extra-semi

✖ 2 problems (2 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

마지막 줄의 메세지를 보면 이 에러는 "잠재적으로 수정가능(potentially fixable)"하다고 말한다. 
--fix 옵션으로 다시 검사해 보자.

```
npx eslint app.js --fix
```

검사를 통과하고 코드도 자동으로 수정되었다. 

이렇듯 ESLint 규칙에는 수정 가능한 것과 그렇지 못한 것이 있다. 

[규칙 목록](https://eslint.org/docs/rules/)에 보면 렌치 표시가 붙은 것이 --fix 옵션으로 자동 수정할 수 있는 규칙들이다. 


### 2.5 Extensible Config


규칙을 일일한 설정하는게 힘드니깐 미리 세팅해 놓은 설정이 eslint:recommended 설정이다. 
[Rules](https://eslint.org/docs/rules/) 페이지의 규칙중에 체크 표시되어 있는것이 이 설정에서 활성화되어 있는 규칙이다. 

설정 객체의 extends 옵션을 추가한다.

```js
// .eslintrc.js:
module.exports = {
  extends: "eslint:recommended",
}
```

이 옵션을 추가하면 미리 설정했던 규칙이 모두 포함되기 때문에 일일이 규칙을 추가하지 않아도 된다.
만약 이 설정 외에 추가 규칙이 필요하다면 이전처럼 rules 속성에 추가하면 확장할 수 있다.

ESLint에서 기본으로 제공하는 설정외에도 자주 사용하는 두 가지 설정이 있다. 

- airbnb
- standard

[airbnb 스타일 가이드](https://github.com/airbnb/javascript)에 따라 규칙을 추가해 놓은 설정을 사용할 수있다. [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) 패키지를 다운로드하고 extends에 추가하면 바로 변경 가능하다.


eslint-config-airbnb 패지지를 다운로드 한다. install-peerdeps로 의존된 패키지를 모두 설치한다.

```shell
npx install-peerdeps --dev eslint-config-airbnb
```

설정에 추가한다.

```js
module.exports = {
  extends: "airbnb"
}
```

### 2.6 초기화 

사실 이러한 설정은 명령어고 간단히 만들 수 있다. 

```
npx eslint --init 

? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? None of these
? Where does your code run? (Press <space> to select, <a> to toggle all, <i> to invert selection)Browser
? How would you like to define a style for your project? Use a popular style guide
? Which style guide do you want to follow? Airbnb (https://github.com/airbnb/javascript)
? What format do you want your config file to be in? JavaScript
```

--init 옵션으로 실행하면 .eslintrc 파일을 만들기 위해서 몇가지 질문한다. 
답변에 따라 .eslintrc 파일이 만들어지 는데 다음과 같다.

```js
// .eslintrc.js:
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
  },
};
```

## 3. Prettier

### 3.1 린트 비교 

프리터는 코드를 더 예쁘게 만든다. ESLint의 포매팅하는 역할과 겹치는 부분이 있지만 프리터는 좀더 일관적으로 코드를 검사하고 재작성한다.  반면 코드 품질과 관련된 기능은 하지 않는 것이 ESLint와 다른 점이다.

### 3.2 설치 및 사용법

프리터 패키지를 다운로드 한다.

```
npm i prettier
```

app.js 코드를 아래 처럼 작성한다.

```js
// app.js:
console.log(‘hello world’)
```

Prettier로 검사해 보자. 

```
npx prettier app.js

console.log("Hello world");
```

작은 따옴표를 큰 따옴표로 변경했다. 문장 뒤에 세미콜론도 추가했다. 프리티어는 ESLint와 달리 규칙이 미리 세팅되어 있다. 
개발자가 초반에 설정하지 않아도 기본 세팅만으로도 검사하는데 충분하다. 
게다가 검사 뿐만 아니라 자동으로 수정하는 것이 ESLint와 다른 점이다. 

검사후 변환한 내용을 출력하지 않고 파일에 재 작성하려면 --write 옵션으로 실행한다.

```
npx prettier app.js --write
```

### 3.3 포매팅(더 예쁘게)

다음 코드를 보자.

```js
app.js:
console.log('Hello world world world worldworldworldworldworldworldworldworld world') 
```

ESLint는 [max-len](https://eslint.org/docs/rules/max-len) 규칙으로  최대 라인을 검사할수 있다. 
하지만 이걸 수정하는 것은 개발자의 몫이다. 
프리티어는 규칙 검사 뿐만 아니라 어떻게 수정해야할지 알고 있고 지가 알아서 코드를 다시 작성한다.

```
npx prettier app.js

console.log(
  "Hello world world world worldworldworldworldworldworldw    orldwor"
); // 80자 이상
```

이런 코드는 어떻게 변환할까? 

```js
foo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());
```

```js
foo(
  reallyLongArg(),
  omgSoManyParameters(),
  IShouldRefactorThis(),
  isThereSeriouslyAnotherOne()
);
```

그렇다. 사용하는 코드에 맞게 프리티어는 알아서 코드를 변환한다.

아래 코드도 보자.

```js
foo({ num: 3 },
  1, 2)

foo(
  { num: 3 },
  1, 2)

foo(
  { num: 3 },
  1,
  2
)
```

ESLint는 이 코드를 고치는데 한계가 있다. 반면 프리티어는 아래처럼 고쳐버린다.

```js
foo({ num: 3 }, 1, 2);

foo({ num: 3 }, 1, 2);

foo({ num: 3 }, 1, 2);
```

이러한 포매팅 품질은 ESLint보다는 프리티어가 훨씬 좋은 결과를 만든다. 사람이 더 읽기 좋도록 말이다.

### 3.4 통합방법

하지만 여전히 ESLint를 사용해야 하는 이유는 남아 있다. 
포맷팅은 프리티어에게 맡기더라도 코드 품질과 관련된 검사는 ESLint의 몫이기 때문이다.

따라서 이 둘을 같이 사용하는 것이 최선이다. 프리티어는 이러한 ESLint와 통합 방법을 제공한다.

[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 는 프리티어와 충돌하는 ESLint 규칙을 끄는 역할을 한다. 
둘 다 사용하는 경우 규칙이 충돌하기 때문이다

예를 들어 airbnb를 사용할 경우 세미콜론을 강제한다. 이것은 프리터어도 마찬가지이다. 
따라서 어느 한쪽에서는 꺼야하는데 eslint-config-prettier를 extends 하면 중복되는 ESLint 규칙을 비활성화 한다. 
프리티어에게 코드 검사 및 재작성을 맞기는 셈이다.

그럼 eslint와 pretier를 동시에 실행해서 코드 검사를 해야한다.

```
npx eslint
npx prettier
```

이 둘을 한 번에 하고 싶다. eslint-plugin-prettier 는 프리티어 규칙을 ESLint 규칙으로 추가하는 플러그인이다. 따라서 ESLint만 실행하면 된다. 

```
npx eslint
```

두 개 설정을 하나의 명령어로 실행할 수 있다. 


## 4. 자동화

코드를 작성하고 매번 ESLint와 Prettier을 실행하는 것은 또 다른 부수 작업이 되어 버린다. 
이러한 일은 컴퓨터를 이용해 자동화 하는 것이 옳다. 내가 사용하는 두 가지 방식에 대해 설명하겠다.

### 4.1 변경한 내용만 검사

소스 트래킹 도구로 깃을 사용한다면 깃 훅을 이용하는 것이 좋다. 
커밋 전, 푸시 전 등 깃 커맨드 실행 시점에 끼여들수 있는 훅을 제공한다. 

[husky](https://github.com/typicode/husky)는 깃 훅을 쉽게 사용할 수 있는 도구다. 
나는 이걸로 커밋 메세지 작성전에 린트를 수행하도록 하겠다. 패키지부터 다운로드 한다.

```
npm i husky 
```

허스키는 패키지 파일에 설정할 수 있다. 

```json
//  package.json
{
  "hooks": {
    "husky": {
      "pre-commit": "echo \"이것은 커밋전에 출력됨\""
    }
  }
}
```

훅이 제대로 동작하는지 빈 커밋을 만들어 보자. 

```
git commit --allow-empty -m "빈 커밋"
husky > pre-commit (node v13.1.0)
이것은 커밋전에 출력됨
[master db8b4b8] empty
```

pre-commit에 설정한 내용이 출력되었다. 이젠 이 시점에 린트 수행명령어를 수행하면된다. 

```json
// package.json
"husky": {
    "hooks": {
      "pre-commit": "eslint app.js --fix"
    }
  }
```

한편 코드가 점점 많아지면 커밋 작성이 느려질수 있다. 커밋전에 모든 코드를 린트로 검사하는 시간이 소요되기 때문이다. 
커밋시 변경된 파일만 린트로 검사하면 더 좋을 것 같다. 

[lint-staged](https://github.com/okonet/lint-staged)는 변경된(스테이징된) 파일만 린트를 수행하는 도구다. 
패키지를 설치하자.

```
npm i lint-staged
```

이 도구도 패키지 파일에 설정한다.

```json
// package.json
{
  "lint-staged": {
    "*.js": "eslint app.js --fix"
  }
}
```

내용이 변경된 파일 중에 .js 확장자로 마치는 파일에 대해 린트를 실행한 설정이다. 커밋전 훅도 아래처럼 변경한다.

```json
"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
```

커밋 메세지 작성전에 lint-staged를 실행하도록 변경했다. 

이제 커밋하면 모든 파일을 검사하는 것이 아니라, 변경되거나 추가된 파일만 검사한다. 

### 4.2 에디터 통합

에디터에서 코딩할때 실시간으로 검사하는 방법도 있다. 
vs-code의 eslint와 prettier 익스텐션이다 먼저 [eslint 익스텐션](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 부터 설치해 보자. 

에디터 설정에서 eslint 를 켠다

```json
// .vscode/settings.json:
{
  "eslint.enable": true,
}
```

설치하면 자동으로 ESLint 설정파일을 읽고 파일을 검사한다.

![캡쳐]()

[prettier 익스테션]을 설치한다. 

에디터의 포매터로 설정한다.

```json
// .vscode/settings.json:
{
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

코드를 작성하고 

```j
foo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());
```

F1을 누른뒤 문서서식 혹은 단축키 옵션+시프트+f 를 누르면 설정한 포메터인 프리티어 플러그인이 실행된다. 

```js
foo(
  reallyLongArg(),
  omgSoManyParameters(),
  IShouldRefactorThis(),
  isThereSeriouslyAnotherOne()
);
```

파일 저장시점에 포맷터를 돌리수도 있다. 

```json
// .vscode/settings.json:
{
  "editor.formatOnSave": true
}
```

ESLint 익스텐션으로는 실시간 코드 품질 검사를하고 프리티어 익스텐션으로는 자동 포메팅을 하도록 한다.

## 5. 정리




