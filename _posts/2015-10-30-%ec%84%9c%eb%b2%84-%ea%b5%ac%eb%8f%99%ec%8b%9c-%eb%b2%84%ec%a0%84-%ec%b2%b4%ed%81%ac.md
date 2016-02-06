---
id: 835
title: 서버 구동시 버전 체크
date: 2015-10-30T09:29:05+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=835
permalink: /%ec%84%9c%eb%b2%84-%ea%b5%ac%eb%8f%99%ec%8b%9c-%eb%b2%84%ec%a0%84-%ec%b2%b4%ed%81%ac/
categories:
  - Node.js
tags:
  - node
  - semver
---
## 배경

코드 저장소에서 노드 프로젝트를 다운받아 개발환경을 구성할때 버전 문제가 발생하는 경우가 있다.

* 서버를 이관할때 모듈간 버전충돌 문제, 혹은 노드 버전 문제로 고생. 별다른 오류 메세지도 없어서 원인도 못찾음.
* 몽고 디비 최신버전을 설치하니 안되는 경우도 발생함. 2.4로 고정 했어야함.

위 경험으로 볼때 서버 구동시 모듈 버전 체크 로직을 사전에 넣어두면 프로젝트 관리시 편리할 것 같다.

## 시멘틱 버전

한글로 [유의적 버전](http://semver.org/lang/ko/). 1.2.3 이라고 할때 각 자리수를 어떻게 매기는지 정의한 개념이다. 

## semver

[node-semver](https://github.com/npm/node-semver): 시멘틱 버전 체크를 위한 노드 모듈이다. 

* valid(): 유효한 버전 형식인지 체크
* satisfies(target, required): target 버전이 required 조건에 맞는지 체크

## 샘플코드

semver 모듈을 이용해 서버 초기화 작업시 버전 체크하는 로직을 추가할 수 있다.

### 노드 버전 체크 

package.json 파일에서 노드 버전과 실제 설치된 노드버전을 체크한다. satisfies() 함수 호출후 올바른 버전이 아닐경우 에러 메세지를 출력한다.

```javascript
var semver = require('semver'),
    packages = require('./package.json');

function checkNodeVersion() {
  // Tell users if their node version is not supported, and exit
  try {
    if (!semver.satisfies(process.versions.node, packages.engines.node)) {
        console.error('\x1B[31mERROR: Unsupported version of Node');
        console.error('\x1B[31mThis app needs Node version ' + packages.engines.node +
                      ' you are using version ' + process.versions.node + '\033[0m\n');

        process.exit(0);
    }
  } catch (e) {
    return;
  }
},
```

### 패키지 버전 체크

package.json 에 패키지 목록과 각 버전 정보(a)를 가져온다. 그리고 node_moudles 폴더에 설치된 각 모듈의 package.json 파일에서 설치된 모듈의 버전 정보(b)를 가져온다. a와 b를 satisfies() 함수로 비교하면서 올바른 버전의 모듈 설치를 확인한다.

```javascript
var semver = require('semver'),
    packages = require('./package.json');

function checkPackagesVersion() {
  _.forEach(packages.dependencies, packageVersion);
}

function checkPackageVersion(version, packageName) {
  var reqVer = packages.dependencies[packageName],
      instVer;
  try {
    instVer = require('./node_modules/' + packageName + '/package.json').version;
    if (!semver.satisfies(instVer, reqVer)) {
      console.error('\x1B[31mERROR: Unsupported version of ' + packageName + ' package');
      console.error('\x1B[31mSenty needs ' + packageName + ' package version ' + reqVer +
          ' you are using version ' + instVer + '\033[0m\n');

      process.exit(0);
    }
  } catch (e) {
    return;
  }
}
```

### 패키지 설치 여부

패키지 설치 여부만 확인할 경우 [require.resolve()](https://nodejs.org/api/globals.html#globals_require_resolve) 함수를 사용할 수 있다. 이 함수에 모듈명을 파라매터로 넘겨주면 설치된 모듈의 경로를 반환하는 기능을 한다.

```javascript
function checkPackages() {
  var errors = [];
  Object.keys(packages.dependencies).forEach(function (p) {
    try {
      require.resolve(p);
    } catch (e) {
      errors.push(e.message);
    }
  });

  if (!errors.length) {
    return;
  }

  errors = errors.join('\n  ');

  console.error('\x1B[31mERROR: This app is unable to start due to missing dependencies:\033[0m\n  ' + errors);
  console.error('\x1B[32m\nPlease run `npm install --production`.');

  process.exit(0);
},
```



코드 참고: [Ghost](https://github.com/TryGhost/Ghost/blob/master/core%2Fserver%2Futils%2Fstartup-check.js)
