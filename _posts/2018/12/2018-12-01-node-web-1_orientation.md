---
title: Node.js 코드랩 - 1. 오리엔테이션
layout: post
summary: 실습 환경을 구성합니다.
category: series
---

## 🌳목표 

이론적인 내용보다는 코드를 직접 따라하는 내용이 많습니다. 
중간에 실습 문제가 있어서 여러분이 직접 코딩하는 순서도 있구요.
이런 환경을 갖추기 위한 실습 세팅 작업부터 시작하겠습니다.

## 프로젝트 생성

모든 코드는 [깃헙 저장소](https://github.com/jeonghwan-kim/codelab-node-web)에 올려 두었습니다. 
이 코드를 여러분 컴퓨터에 복사해서 가져 옵니다.

```bash
$ git clone git@github.com:jeonghwan-kim/codelab-node-web.git
# or 
$ git clone https://github.com/jeonghwan-kim/codelab-node-web.git
```

진행 순서에 따라 브랜치를 여러개 만들어 두었는데요, 먼저 `scaffolding/init` 브랜치로 이동 합니다.

```bash
$ git checkout scaffolding/init
```

.gitignore 파일만 있네요. 이건 깃에서 추적하지 않는 파일 이름을 작성한 목록입니다.

여기서부터 코딩을 시작하겠습니다. 💻

## NPM

NPM은 노드 패키지 매니저(Node Package Manage)라고도 하는데요.
노드에서 만든 매키지(혹은 모듈, 라이브러리 따위)를 관리하는 도구입니다.

노드 기반의 프로젝트는 이 NPM을 이용해서 개발하는데요, 아래 명령어로 시작합니다.

```bash
$ npm init
```

`init` 명령은 노드 프로젝트를 생성하는 기능입니다. 
명령을 실행하고 나면 프로젝트 정보에 대해 몇 가지 물어볼텐데요. 
그렇게 중요하지 않으니 `-y` 옵션으로 모두 "네(yes)"라고 대답할 수도 있습니다.

```bash
$ npm init -y
```

이제 프로젝트 폴더에 package.json 파일이 생성되었을 겁니다.
NPM은 이 파일에 프로젝트 관련 정보를 담는 것이죠.

## 테스트 환경 세팅 

노드에서 테스트 환경을 만들려면 외부 프레임웍 도움을 받아야 합니다.
모카(Mocha)와 슈드(Should)인데요, 설치부터 해보겠습니다.

```bash
$ npm install --save-dev mocha should
```

코드를 테스트한다는 것은 자바스크립트로 작성한 테스트 코드를 실행하는 것을 말합니다.
바로 방금 설치한 모카가 테스트 코드를 실행해주는 테스트 러너(Test Runner)인 것이죠.

테스트 코드를 작성할 때 함수의 실행 결과가 기대하는 값과 같은지 검사하는 과정이 필요한데요,
슈드가 바로 밸리데이터(Validator) 열할을 하는 라이브러리 입니다.

그럼 간단하게 테스트 코드를 작성해 볼까요?

server.spec.js란 이름의 파일을 하나 만들겠습니다.
테스트 파일은 "spec" 혹인 "test" 라는 이름을 붙이는 관례가 있는데 저는 spec으로 정했습니다.

파일에 아래 코드를 입력해 보세요.

```js
const should = require('should')
const server = require('./server')

describe('server test suite', () => {
  it('should return "hello world"', () => {
    server().should.be.equal('Hello world')
  })
})
```

서버 모듈을 가져와서 실행한 값이 "Hello world" 문자열을 리턴하는지 검증하는 코드입니다.

이제 이 코드를 실행해서 테스트 통과여부를 확인해야하는데요 방금 설치한 모카 명령어로 실행합니다.

```bash
$ node_modules/.bin/mocha server.spec.js
```

모카 테스트는 자주 사용하는 명령어라서 NPM 스크립트롤 등록해 두면 편리합니다. 
프로젝트를 생성할때 자동으로 만든 package.json 파일에 등록할 수 있습니다.

```json
"test": "mocha server.spec.js"
```

패키지 파일에서는 설치한 모듈은 상대주소 없이 바로 명령어를 등록할 수 있습니다.

스크립트를 조금 더 개선해 볼까요? 

```json
"test": "mocha $(find ./ -name \"*.spec.js\")"
```

이름이 "spec.js"로 끝나는 파일을 모두 모카 테스트로 실행하도록 했습니다.

그럼 테스트를 실행해 보죠.

```bash
$ npm test 
> codelab-node-web@1.0.0 test /Users/jeonghwan/tmp/codelab-node-web
> mocha $(find ./ -name "*.spec.js")

internal/modules/cjs/loader.js:583
    throw err;
    ^

Error: Cannot find module './server'
```

런타임 에러가 발생했네요. 마지막 문구를 보면 server 파일을 찾을 수 없다고 합니다.
(Error: Cannot find module './server')

테스트 코드는 작성했지만 테스트 대상인 server.js는 아직 만들지 않았으니까요. 

이제 server.js 파일을 아래와 같이 작성해 봅니다.

```js
const server = () => "Hello world"

module.exports = server
```

간단하게 "Hello world" 문자열을 반환하는 함수만 만들어 (`server()`) 노출해 주었습니다. 
(`module.exports = server`)

다시 테스트를 돌려볼까요? 

```bash
$ npm test

> codelab-node-web@1.0.0 test /Users/jeonghwan/tmp/codelab-node-web
> mocha $(find ./ -name "*.spec.js")

  server test suite
    ✓ should return "hello world"

  1 passing (8ms)
```

이번엔 테스트에 통과했습니다.

## 정리

* NPM으로 노드기반의 프로젝트를 생성했습니다. 
* 자동으로 만들어진 package.json에 프로젝트 관련 정보를 저장하고 스크립트도 등록할수 있습니다. 
* 모카와 슈드로 유닛테스트 환경을 만들었고 NPM에 test 스크립트로 등록했습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)