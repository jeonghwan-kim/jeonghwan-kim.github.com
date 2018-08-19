---
title: 리액트, 노드 백엔드 통합 후 CI 연동하기 
layout: post
tags: 
  react, travis, express, elastic-beanstalk
summary: 리액트 어플리케이션을 노드 익스프레스로 통합하고 트라비스로 AWS 빈스톡에 배포하는 방법을 설명합니다 
---

[지난 블로그](/2018/07/16/react-app-overview.html)에서 설명한 리액트 기반의 프로젝트를 노드 서버로 통합하는 작업을 진행했다. 물리적으로 분리된 프론트앤드와 백엔드를 하나의 서버로 합치는 일이다. 각자를 분리하면서 얻는 이점도 있겠지만, 제한된 인력 리소스로는 이를 통합하는 것이 생산성 측면에서 더 좋다고 판단했기 때문이다.

효율적인 업무를 위해서는 서버의 통합 뿐만 아니라 코드 저장소, 개발 환경, 배포 프로세스까지 하나로 관리하는 방법이 필요하다. 이번 글은 리액트로 만든 싱글페이지 어플리케이션과 노드 웹서버를 통합하여 운영하는 방법을 정리한 내용이다.

## 익스프레스 서버 추가 

클라이언트(client), 서버(server) 폴더로 프로젝트를 시작한다. create-react-app (혹은 react-app-rewired)로 만든 리액트 어플리케이션 코드를 client 폴더로 모두 이동한다. 
 
그리고 나서 익스프레스(express.js) 서버를 server 폴더에 작성한다.

기존 싱글페이지어플리케이션은 리액트가 라우팅을 담당했지만, 이제는 익스프레스와 함께 라우팅을 수행해야 한다.

```js
const express = require('express')
const app = express()
const clientApp = path.join(__dirname, '../client/build')

api.use('/api/*', apiRouters()) // api 라우팅처리 후 
app.use('*', express.static(clientApp)) // 모든 요청을 프론트엔드 정적 파일이 처리
```

/api 경로로 시작되는 백엔드 api 요청은 익스프레스 로직이 처리한다. (apiRouters())
이 후 모든 요청은 리엑트에서 처리하는 순서다. (clientApp)

## 개발 환경 구성 

리액트 어플리케이션은 웹팩 노드 서버를 띄워 개발환경을 제공해 주었다. 하지만 지금은 백엔드를 담당하는 익스프레스 개발 서버(여기서는 nodemon을 사용한다)도 띄워야하는 상황이다.

우선 패키지 파일(package.json)에 두 서버를 띄울수 있도록 스크립트를 추가한다.

```json
{
  "scripts": {
    "start": "node ./bin/www", 
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "nodemon ./bin/www",
    "dev:client": "node ./bin/start-client.js",
    "test": "NODE_ENV=test mocha server/**/*.spec.js --exit
  }
}
```

`npm start`는  라이브 환경에서 서비스를 구동하는 명령어다. bin/www 파일이 익스프레스로 만든 노드 서버를 실행하게 되어있다.

`npm run dev`는 개발 서버와 클라이언트 서버를 함께 실행해서 개발 환경을 구성하기 위한 명령어다. 명령어를 동시에 실행할 수 있는 [concurrently](https://github.com/kimmobrunfeldt/concurrently) 개발 도구를 이용해서 서버를 두 개 띄웠다.

먼저 개발 서버는 `npm run dev:server`를 이용해 노드몬 서버를 구동한다. 노드몬은 파일 감시 기능 등 노드 진영에서 많이 사용하는 노드 개발 툴이다.

npm run dev는 동시에 클라이언트 개발서버도 띄우는 `npm run dev:client`를 실행한다. bin/start-client.js로 클라이언트 서버를 구동하는데 아래 코드를 보면 프로세스를 하나 더 띄워서 client 폴더의 패키지 스크립트를 실행하는 방식이다.

`bin/start-client.js`:

```js
const args = [ 'start' ]
const opts = { stdio: 'inherit', cwd: 'client', shell: true }
require('child_process').spawn('npm', args, opts)
```

client 폴더에서 npm start를 실행하는 것은 create-react-app 으로 만든 프로젝트에서 개발 서버를 띄우는 명령인 셈이다.

단일 페이지 어플리케이션인 프론트엔드에서는 api 요청시 특정 도메인으로 요청했을 것이다. 이제는 이걸 동일한 도메인 요청으로 변경해야 한다. 예를 들면 `http://api.other-domain.com/users` 요청을 동일 도메인인 `/user` 로 바꾸는 것이다.

문제는 개발 환경에서는 도메인은 localhost로 같지만 포트번호가 다르다는 점. 리액트는 4000번 포트, 노드는 3000번 포트를 사용한다.

다행이도 [webpack-dev-server 옵션에는 proxy 설정](https://webpack.js.org/configuration/dev-server/#devserver-proxy)이 있다. 비슷하게 [create-react-app도 proxy 설정](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development)을 할 수 있는데 패키지 파일에 추가하면 된다

```json
{
  "proxy": "http://localhost:4000/"
}
```

이제 개발환경에서 클라이언트가 요청한 모든 api 요청은 자신의 3000번 포트가 아니라, 프록시로 설정한 4000 포트로 전달된다. 따라서 `GET /users` 를 클라이언트에서 요청하더라도 개발환경에서는 `GET http://localhost:3000/users`로 요청해 주는 것이다. 

이렇게 한뒤 npm run dev를 실행하면 
* 노드 서버와 리액트 개발 서버가 동시에 구동된다.
* 클라이언트 폴더의 코드가 변경되면 웹팩이 동작하고,
* 서버 폴더의 코드가 변경되면 노드몬에 의해 노드 서버가 재시작되는 환경이다.

## 트라비스 

개발 환경은 이 정도로 꾸몄고 이젠 배포할 차례다. CI 서비스는 트라비스를 사용했다. 트라비스 세팅을 노드로 해두면 npm에 test 명령어가 기본적으로 실행된다.

```yaml
language: node_js
node_js:
  - "8"
```

모카와 슈퍼테스트로 작성한 테스트 코드에는 mysql을 사용하기 때문에 트라비스 환경에서 데이터베이스를 생성하는 명령이 필요하다. myapp_test란 이름의 데이터베이스를 생성한다.

```yaml
services:
  - mysql
before_install:
  - mysql -e 'CREATE DATABASE 'myapp_test;'
```

트라비스에는 몽고디비, 레디스 등 몇개 서비스를 제공하는데 `services`에 설정할수 있다.
`before_install`에 등록한 명령으로 테스트 데이터베이스를 생생한 뒤 노드 의존 모듈을 모두 설치하고 (npm install)  모카 테스트(npm test)를  순서대로 실행한다.

### 트라비스에서 웹팩 빌드

테스트 후에는 리액트 빌드 작업이 필요하다. 익스프레스 서버에서는 이 빌드 파일을 정적 파일로 사용하기 때문이다. 트라비스 `install` 키에 명령어 목록을 지정하면 해당 스크립트가 동작한다.

```yaml
install:
  - npm --prefix ./client install
  - npm --prefix ./client run build
```

빈스톡은 깃 HEAD 기준으로 체크아웃하여 배포하는 모양이다.
따라서 트라비스 환경에서 빌드한 리액트 코드를 깃에 추가해 줘야 이 코드를 빈스톡으로 배포할수 있다. 그렇지 않으면 빌드전의 리액트 코드가 빈스톡에 배포되어버린다.

```yaml
install:
  - git add -f ./client/build
  - git commit -am "Add react build directory"
  - npm install
```

참고로 이 커밋은 트라비스 환경에서만 기록되고 프로젝트 환경의 깃(예를 들어 깃헙)에는 아무 영향을 주지 않는다.

### 트라비스에서 빈스톡 설정 

빌드 후에 이 코드를 aws 빈스톡으로 내보내야 하는데, [트라비스가 제공하는 배포 프로바이더](https://docs.travis-ci.com/user/deployment/#supported-providers) 중에 빈스톡으로 설정해 주면된다. 

```yaml
deploy:
  provider: elasticbeanstalk
  region: "ap-northeast-2"  
```

aws credentials 정보는 트라비스 환경 변수로 등록해서 사용하는 것이 좋다. 

```yaml
deploy:
  access_key_id: $ACCESSKEYID
  secret_access_key:
    secure: "$SECRETACCESSKEY"
```

![Travis environment variables](/assets/imgs/2018/08/20/travis-environment-variables.jpg)

빈스톡 어플리케이션 환경은 깃 브랜치에 따라 다르게 적용했다.

```yaml
deploy:
  app: "MY_APP"
  env: $(if [ "$TRAVIS_BRANCH" = "master" ]; then echo MY_APP-production; else echo MY_APP-development; fi)
  bucket_name: $(if [ "$TRAVIS_BRANCH" = "master" ]; then echo elasticbeanstalk-MY_APP-production; else echo elasticbeanstalk-MY_APP-development; fi)
```

기본적으로 MY_APP이란 빈스톡 어플리케이션에 배포한다.

`env`키 에 배포할 대상 환경을 설정하는데 브랜치 설정했다.
* master 브랜치: MY_APP-production
* develop 브랜치: MY_APP-development 

master 브랜치는 My_APP-production으로 배포된고, develop 브랜치는 MY_APP-development 환경으로 배포될 것이다.

빈스톡은 배포할 때 S3로 배포 코드를 압축하여 저장한다. 트라비스에서는 `bucket_name` 키에 이 S3 버킷명을 설정할 수 있는데 이것도 브랜치 별로 세팅했다.

마지막으로 master와 develop브랜치만 트라비스 동작 세팅을 위해 `on` 키에 아래와 같이 세팅한다.

```yaml
deploy:
  on:
    all_branches: true
    condition: $TRAVIS_BRANCH =~ ^master|develop$
```

결과적으로 이 세팅은 
* 노드 테스트 환경을 준비하고 테스트를 먼저 실행한다. 
* 테스트에 통과하면 웹팩 빌드와 배포 커밋을 만든다.
* 마지막으로 브랜치에 따라 해당하는 빈스톡 환경으로 코드를 배포한다.

## 빈스톡

이렇게 배포된 리액트 + 익스프레스 조합의 어플리케이션은 잘 동작할 것이다.
하지만 정적 파일은 노드가 처리하는 것 보다 엔진엑스나 아파치가 처리하는 것이 훨씬 좋은 성능을 얻는다.
빈스톡은 정적파일 경로를 설정하도록 하여 이 파일은 엔진엑스나 아파치가 처리하도록 해준다.

![aws-beanstalk-static-file](/assets/imgs/2018/08/20/aws-beanstalk-static-file.jpg)

위처럼 aws 콘솔에서 설정하기도 하지만 코드로 설정하는 걸 더 선호한다. 빈드톡 구성을 변경하면 서버를 재구동하는 시간이 걸리기 때문에 배포할때 코드로 박아주면 좀 더 편하다. 아래는 노드 시작 명령어도 npm start로 함께 설정했다.

.extenstions/env.config:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:container:nodejs:staticfiles:
    /static: /client/build/static
```

## 결론 

리액트 어플리케이션을 노드 서버에 통합하기 위해 익스프레스 정적파일로 라우팅 처리했다. 웹팩 기반의 리액트 개발 환경을 그대로 가져가면서 노드 개발환경과 통합하는 방법도 함께 설명했다.

트라비스에서 노드 테스트 코드를 실행하고 리액트 어플리케이션을 빌드한 뒤 빈스톡에 배포하는 방법을 살펴 보았고, 마지막으로 빈스톡에서 프론트엔드 코드를 정적파일로 설정하였다.
