---
slug: /2024/12/08/module-federation-logging
date: 2024-12-08
title: 모듈 페더레이션 타입 힌트와 로깅
layout: post
tags:
---

# 타입 힌트로 더 안전하게

이번 새로운 모듈 페더레이션은 **타입 힌트 제공**이라는 편의를 제공한다.

원격 모듈을 사용하는 애플리케이션을 흔히 호스트(또는 소비자)라고 부른다. 만약 호스트를 타입스크립트로 개발한다면, 원격 모듈의 **타입 정보**를 제공받는 것은 큰 장점이 된다. 이번 모듈 페더레이션은 원격 모듈과 호스트 간에 타입 정보를 동기화하여, 더 안전하고 예측 가능한 개발 환경을 제공한다.

# 플러그인 구조

새로운 모듈 페더레이션의 또 다른 특징은 특정 번들러에 국한되지 않는 **크로스 번들러 지원**이다. 기존에는 웹팩에서만 사용할 수 있었지만, 이제는 Vite, Rspack 그리고 Nest.js 프레임워크의 빌드 시스템까지 지원한다.

웹팩의 경우, 이 모듈 페더레이션을 플러그인 형태로 제공하는데 구조를 살펴보았다. [@module-federation/enhanced](https://www.npmjs.com/package/@module-federation/enhanced) 패키지에서 재공하는 **ModuleFederationPlugin**이다.

```js
class ModuleFederationPlugin {
  apply() {
    new RemoteEntryPLugin()
    new FederatioModulePlugin()
    new StartupChunkDependanciesPlugin()
    new DtsPlugin() // 타입 힌트 처리
    new PrefetchPlugin()
    new FederationRuntimePlugin()
  }

  afterPlugin() {
    new ContainerPlugin()
    new ContainerReferencepPlugin()
    new SharePlugin()
    new StatsPlugin()
  }
}
```

옵션에 따라 최대 10개의 하위 플러그인 조합으로 구성한다.

# DtsPlugin과 타입 힌트 처리

플러그인을 사용할 때 [PluginDtsOptions](https://module-federation.io/configure/dts.html) 형태의 dts 옵션을 전달할 수 있는데 이걸 처리하는게 DtsPlugin 이다. 타입스크립트 타입 정의 파일인 .d.ts 확장자에서 이름을 가져온 듯 하다.

```js
class DtsPlugin {
  apply() {
    new DevPlugin() // 개발 환경 지원
    new TypesPlugin() // 타입 힌트 지원
  }
}
```

DtsPlugin은 다시 두 개의 플러그인을 조합하여 작동한다.

개발 환경을 위한 DevPlugin은 원격 모듈 타입이 갱신되면 이 플러그인이 자동으로 최신 타입으로 동기화 시켜 준다고 주석에 기록되어있다.

> only consume once , if remotes update types , DevPlugin will auto sync the latest types

**TypesPlugin**이 타입스크립트 타입 힌트를 지원하는 플러그인이다.

```js
class TypesPlugin {
  apply() {
    new GenerateTypesPlugin()
    new ConsumeTypesPlugin() // 타입 힌트 지원
  }
}
```

두 개의 하위 플러그인을 조합하여 작동한다.

- **GenerateTypesPlugin**: 원격 모듈의 타입 파일을 생성.
- **ConsumeTypesPlugin**: 생성된 타입 파일을 호스트에서 사용 가능하도록 처리.

호스트에서 원격 모듈의 타입을 제공하려면 원격 서버에서 타입 파일을 미리 준비해야한다.
TypesPlugin의 GenerateTypesPlugin이 타입을 만드는 역할을 한다.

한편 **ConsumeTypesPlugin**은 원격에 만들어 둔 타입파일을 호스트에 다운로드한 뒤 개발 환경에 타입 힌트 기능을 지원하는 역할이다.

# 원격 타입 가져오기 과정

웹팩 플러그인 조합은 ConsumeTypesPlugin에서 끝난다. 이 플러그인은 실제로 원격의 타입을 다운로드하는 역할을 하는 전용 클래스 **DtsManger**로 인스턴스를 만들고 타입을 가져온다.

```ts
class ConsumeTypesPlugin {
  apply() {
    consumeTypes()
  }
}

function consumeTypes() {
  new DtsManager().consumeTypes()
}
```

이 후에는 DtsManger라는 전용 객체가 주도한다.

```ts
class DtsManager {
  consumeTypes() {
    // 1. manifest.json 요청
    // 2. 타입 파일 압축본 다운로드
  }
}
```

- **manifest.json 요청**: 원격 서버에서 타입 메타 정보를 가져옴.
- **타입 파일 다운로드**: 압축본을 다운로드하여 타입 파일로 변환.

# 터미널에 로깅하기

DtsManger는 일련의 과정을 log4js 라이브러리를 이용해 `.mf/typesGenerate.log` 파일에 기록한다. 이 파일을 감시하면 로그를 터미널에 출력할 수 있겠다.

```shell
$ tail -f .mf/typesGenerate.log
```

logFile함수는 환경 변수 `FEDERATION_DEBUG` 에 따라 로그를 기록한다. 플러그인을 실행할 때 이 환경변수를 켜면 모듈 페더레이션의 동작을 더 자세히 관찰할 수 있다.

```shell
$ FEDERATION_DEBUG=true webpack
```

아예 커스텀 플러그인을 만들어도 되겠다.

```js
class ModuleFederationConsoleLogPlugin {
  #logFile = path.join(process.cwd(), ".mf/typesGenerate.log")
  #name = "ModuleFederationConsoleLogPlugin"

  apply(compiler) {
    // 로그 파일 비우기
    compiler.hooks.watchRun.tap(this.#name, () => {
      fs.truncateSync(this.#logFile, 0)
    })

    // 로그 파일 검사, 출력
    compiler.hooks.done.tap(this.#name, () => {
      if (!fs.existsSync(this.#logFile)) {
        return
      }
      if (fs.statSync(this.#logFile).size === 0) {
        return
      }

      const log = fs.readFileSync(this.#logFile, "utf8")
      if (!log) {
        return
      }

      console.log(log)
    })
  }
}
```

# 결론

새로운 모듈 페더레이션은 타입스크립트 타입 힌트 기능을 지원해 더 안전한 개발 환경을 제공한다.

처음엔 원격 모듈을 가져오는데 성공했는지 실패했는지 알기 어려웠다. 특정 환경 변수에 따라 파일에 기록한다는 것을 알았다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.io-examples/tree/main/2024-12-08-module-federation-logging)
- [Module Federation](https://module-federation.io)
- [@module-federation/enhanced | NPM](https://www.npmjs.com/package/@module-federation/enhanced)
