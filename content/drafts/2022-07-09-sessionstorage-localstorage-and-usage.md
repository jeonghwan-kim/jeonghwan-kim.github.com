---
slug: "/2022/07/29/npm-workspace"
title: "NPM Workspace"
date: 2022-07-29
layout: post
---

# npm link: 패키지를 링크로 만든다

유닉스 명령어 중에는 ln(link files)이 있다. 특정 파일이나 폴더의 링크를 만드는 기능이다. 일종의 바로가기를 만드는 것과 같다.

```shell
ln -s source_file target_file
```

나는 파일을 중복으로 만들지 않고 링크를 만들어 원본을 하나만 유지할 때 사용한다. 가령 dotfile같은 것을 다운 받아 설정 파일의 위치에 링크로 만들 때 활용한다.

npm도 이런 기능을 하는 것이 바로 link다. 노드 패키지 매니저의 부(sub) 명령답게 파일을 패키지의 링크로 만들어 준다는 점이 ln과의 차이점이다. 로컬에 있는 특정 폴더의 링크를 node_modules 하위에 만든다.

가령 package-a 폴더를 node_modules 하위에 두면 자바스크립트에서는 이것을 모듈로 불러 올 수 있을 것이다. 하지만 폴더 자체를 node_modules 안으로 옮길 수는 없다. 이 폴더는 깃으로 트래킹하지 않기 때문에 언제라도 삭제되기 때문이다. npm install 명령어로만 만들어지는 폴더이기 때문에 npm 프로세스에 맞게 관리해야 한다.

npm link 명령어로 링크를 만들어 보자.

```shell
npm link ./package-a
```

node_mdluels 안에 package-a 폴더의 링크가 추가되었을 것이다.

```shell
ls -al node_modules
package-a -> ../package-a
```

심볼링 링크가 생성되었다.

# npm workspace: link를 자동화한다
