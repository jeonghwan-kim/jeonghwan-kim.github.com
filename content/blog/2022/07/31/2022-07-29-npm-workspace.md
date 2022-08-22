---
slug: "/2022/07/31/npm-workspace"
title: "NPM 워크스페이스와 모노레포"
date: 2022-07-31
layout: post
---

모노레포 솔루션은 lerna, yarn 등 여러가지가 있다. 이유는 모르지만 최근 lerna는 지원 종료한다는 소식을 들었다. 때가되면 이 기술을 사용해 봐야지 마음먹은 내겐 아쉬운 소식이다. 그만큼 모노레포 기술은 나온니 꽤 지났다.

강의를 만들 때 여러 개 저장소를 사용한다. 수강자 분들이 올린 질문 중에는 모노레포를 사용해 강의를 만들었다면 헷갈리시지 않을텐데 하는 것들이 있다. 이번에 강의를 새로 만들며 모노레포 기술을 찾다보니 NPM 워크스페이스에 대해 알게 되었다. NPM 명령어 만으로 모노레포를 구성할 수 있을 것 같다.

이번 글에서는 npm 워크스페이스에 대해 알아보겠다.

# 패키지를 링크로 만든다

_npm link_

유닉스에는 ln(link files) 명령어가 있다. 특정 파일이나 폴더의 링크를 만들 때 사용한다. 일종의 바로가기를 만드는 것과 같다.

```
ln -s source_file target_file
```

같은 내용을 여러 파일에서 사용한다면 중복파일이 생길 것이다. 이 때 파링의 링크를 만들어 원본을 하나만 유지할 때 사용하는 명령어다.

npm도 비슷한 역할을 하는 부(sub)명령어가 있다. 바로 link. 노드 패키지 매니저 명령어답게 폴더를 패키지의 링크로 만들어 준다는 점이 ln과의 차이점이다. 이를테면 로컬에 있는 특정 폴더의 링크를 node_modules 하위에 만들 수 있다.

package-a 폴더를 node_modules 하위에 두면 자바스크립트에서는 이것을 모듈로 불러 올 수 있을 것이다. 하지만 폴더 자체를 node_modules 안으로 옮길 수는 없다. 이 폴더는 깃으로 트래킹하지 않기 때문에 언제라도 삭제될수 있기 때문이다. npm install 명령어를 사용하면 자동으로 만들어지는 폴더라서 npm 프로세스에 맞게 링크를 관리할 방법이 필요하다.

npm link 명령어로 링크를 만들어 보자.

```
npm link ./package-a
ls -al node_modules
package-a -> ../package-a
```

node_modules 안에 package-a 폴더의 링크가 추가되었다.

# 워크스페이스로 링크를 자동화한다

_npm workspace_

Npm의 워크스페이스는 링크와 비슷한 부명령어다. 특정 폴더의 링크를 node_modules 하위에 만들고 이를 모듈로 불러와 사용할 수 있는 환경을 마련해 준다. 링크를 자동화하는 것과 더불어 각 패키지에서 사용하는 의존성을 중복없이 하나로 관리할 수 있는 것이 워크스페이스만의 역할이다.

바로 사용해보자. npm으로 빈 프로젝트를 하나 만든다.

```
npm init -y
ls
package.json
```

여기에 워크스페이스 하나를 추가해 보겠다. 방금 프로젝트를 만들 때 사용한 init 명령어를 사용할 것이다. 단 --workspace(-w) 옵션과 함께 사용한다.

```
npm init --workspace workspace-a
ls
+-- package.json
`-- workspace-a
  `-- package.json
```

옵션에 전달한 이름으로 폴더가 하나 만들어 지고 그 안에 패키지 파일도 추가되었다. 패키지의 name 속성에도 워크스페이스 이름이 적혀있다.

```json
// workspace-a/package.json
{
  "name": "workspace-a"
}
```

프로젝트의 패키지 파일도 약간 바뀌었다.

```json
// package.json
{
  "workspaces": [
    "workspace-a
  ]
}
```

workspaces 필드가 추가되었다. 여러 개의 워크스페이스를 등록할 수 있도록 배열로 관리한다. 방금 추가한 workspace-a 하나가 배열 안에 있다.

이제 프로젝트 패키지를 설치하면 워크스페이스로 지정한 폴더가 node_modules 하위에 만들어진다.

```
npm install
ls -al node_modules
workspace-a -> ../workspace-a
```

workspace-a 폴더가 node_modules 하위에 링크로 추가되었다. link 명령어의 결과와 같다. 이제는 자바스크립트 코드에서 workspace-a 폴더 안의 코드를 모듈로 불러와 사용할 수 있다.

package-lock.json 파일도 약간의 변화가 생겼다.

```json
// package-lock.json
"node_modules/workspace-a": {
  "resovled": "workspace-a",
  "link": true
}
```

link 속성이 있는 것으로 봐서 링크라고 표시한 것 같다.

# 워크스페이스로 의존성을 하나로 관리한다

여러 개 워크스페이스를 사용하면 어떤 이점이 있을까? 각 워크스페이스는 또 하나의 npm 프로젝트라고 볼 수 있다. 패키지 파일에 기록된 의존성을 각자 관리할 것이다. npm 스크립트도 만찬가지다.

이러면 워크스페이스 간의 패키지 파일이 중복으로 설치될 수 있다. 스크립트를 실행할 때도 각 패키지 파일을 지정해야 해서 번거울지도 모른다.

워크스페이스 명령어는 각 npm 프로젝트의 의존성과 스크립트를 한 곳에서 관리할 수 있게끔 해준다. 어느 지역의 스타벅스를 방문하더라도 비슷한 맛과 서비스를 경험할 수 있는 프렌차이즈 시스템처럼.

먼저 워크스페이스에서 사용할 패키지를 설치해 보자. workspace-a는 리액트를 사용한다.

npm install react -w workspace-a

workspace-a의 패키지 파일에 의존성이 기록될 것이다.

```json
// workspace-a/package.json
{
  "dependencies": {
    "react": "^18.2.0"
  }
}
```

프로젝트 루트 폴더에서 패키지를 설치했지만 워크스페이스 폴더의 패키지 파일에 이 정보가 기록되었다. 이것은 -w 옵션으로 설치할 위치를 지정했기 때문이다.

한편 패키지 파일은 루트의 node_modules에 설치된다. 이것은 무엇을 말하는가? 다른 워크스페이스에서도 리액트 패키지를 사용한다면 npm 워크스페이스는 프로젝트의 node_modules 폴더에 설치한다. 이미 패키지가 있기때문에 한 번만 설치할 것이다. 여러 개 워크스페이스의 의존성이 중복되더라도 한 번만 다운로드되기 때문에 패키지 설치 시간과 디스크 공간을 절약할 수 있을 것이다.

# 워크스페이스간에 불러오기

워크스페이스는 node_modules에 링크를 만들기 때문에 코드로 불러와 사용할 수 있다. workspace-b를 workspace-a에서 불러와 보자.

```js
// workspace-b/index.js
module.exports = {
  name: "workspace-b",
}

// workspace-a/index.js
const workspaceB = require("workspace-b") // {name: 'workspace-b}
```

require('workspace-b') 구문을 실행하는 노드는 node_modules 폴더를 뒤질 것이다. workspace-b 폴더의 링크를 node_mdouels 폴더에서 찾아내고 이를 코드로 가져올 수 있는 것이다.

# npm 스크립트 실행

워크스페이스를 사용하면 패키지를 하나로 관리할 수 잇는 것 뿐만아니라 npm 스크립트를 한 곳에서 실행할 수 있다. 직접 워크스페이스 폴더로 이동해 실행하는 것보다 간편할 것이다.

```
npm start -w workspace-a
```

workspace-a/package.json에 등록된 start 명령어를 실행한다.

```
npm start --workspaces
```

전체 워크스페이스의 start 명령어를 실행한다.

```
npm start --workspaces --if-present
```

전체 워크스페이스에서 start 명령어가 있는 것만 실행한다.

# 결론

워크스페이스는 npm link 명령어를 자동화하기 때문에 프로젝트의 특정 폴더를 모듈로 사용할 수 있게끔 한다. 뿐만 아니라 패키지를 중복없이 다운로드하고 스크립트를 한 곳에서 실행할 수 이쓴 방법을 제공한다.

이런 특징은 모노레포를 구성할 때 유용할 것이 생각한다. react-router와 history 저장소도 이를 사용해 모노레포를 구성한 것 같다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/2022-post-sample-code/tree/main/npm-workspace)
- [workspaces | npm Docs](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
