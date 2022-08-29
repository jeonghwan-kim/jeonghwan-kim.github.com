---
slug: "/2022/08/21/webpack-output-clean"
title: "웹팩 빌드시 이전 결과물을 삭제하는 옵션"
date: 2022-08-21
layout: post
tags: [빌드도구]
---

메뉴얼을 보고 안 것은 아니다. 번들 결과물을 삭제하는 옵션이 생겼다는 말을 동료로부터 들었다. 웹팩 기본 기능만으로는 빌드할 때마다 결과물이 차곡차곡 쌓이기만 했지 지울 수 없었다. clean-webpack-plugin을 사용해야 빌드전에 결과물이 저장될 곳을 정리할 수 있었다.

[웹팩 5.20에서 추가된 삭제 옵션](https://webpack.js.org/configuration/output/#outputclean)은 이 플러그인을 대체하는 것 같다. 많이 사용하는 프로그인이라서 웹팩에 내장한 것일지도 모르겠다.

# 이전 빌드 결과을 완전히 삭제

_output: { clean: boolean }_

이제는 웹팩 설정만으로 이전 빌드 결과를 손쉽게 정리할 수 있게 되었다.

```js
// webpack.config.js
{
  output: {
    path: path.resovle(__dirname, 'dist'),
    clean: true
  }
}
```

웹팩은 엔트리포인트를 시작으로 그물망처럼 연결된 모든 모듈을 찾아 하나의 파일로 합친다. 이 결과물은 output.path에 지정한 폴더에 생기는 방식이다. 이 코드에서는 dist 폴더다.

clean: true 를 설정하면 dist 폴더에 약간의 변화가 생긴다. 다음 빌드할 때 이 폴더의 내용을 깨끗이 지우고 새로 만들어질 번들 파일을 맞이할 준비를 한다. 지난밤 부지런한 청소부에 의해 말끔히 비워진 쓰레기 분리수거함처럼.

clean 옵션은 불리언 값 외에도 용도에 따라 다른 값을 사용할 수 있다.

# 유지할 파일을 직접 지정하기

_output: { clean: { keep: string | RegExp | ((filename: string) => boolean) } }_

keep 속성을 사용하면 전부 지우지 않고 필요한 파일을 남길 수 있다. 정규표현식으로 유지할 파일 이름의 패턴을 지정하면 웹팩은 빌드시 이전 결과물을 정리할 때 규칙에 맞는 파일을 남겨줄 것이다. 유월절에 양의 피를 문설주에 칠하면 재앙으로부터 장자를 지킬수 있는 것처럼.

정규표현식으로 부족하다면 함수를 사용할 수 있다. keep 함수는 삭제할 파일을 인자로 전달받는데 파일명을 검사해 불리언값을 반환한다. 유지할 파일이면 true을 반환하고 그렇지 않으면 false 반환해 삭제한다.

```js
// webpack.config.js
{
  output: {
    clean: {
      keep: filename => {
        console.log("debug", filename)
        return filename === "삭제되지*말아야할*파일"
      }
    }
  }
}

// 결과

// debug 삭제할*파일
// debug 삭제되지*말아야할\_파일
```

# 삭제할 파일을 표시만 하기

_output: { clean: { dry: boolan } }_

dry 옵션이 있는데 이것은 삭제할 파일을 표시만 한다. 테트스해보니 정말 삭제되지는 않는데 이걸 무슨 용도로 쓰는 건지 궁금했다. 배경을 찾지는 못했다. 실행해보면 삭제, 유지될 파일 목록을 출력한다.

```js
// webpack.config.js
{
  output: {
    clean: {
      dry: true
    }
  }
}

// 결과
//
// LOG from webpack.CleanPlugin
// <i> 삭제되지*말아야할*파일 will be kept
// <i> 삭제할\_파일 will be removed
```

# 내장 플러그인과 clean-webpack-plugin

로그에 보면 webpack.CleanPlugin이라는 내장 플러그인이 동작했다. 웹팩 코드에도 lib > CleanPlugin.js 파일을 확인했다. 그럼 기존의 clean-webpack-plugin을 대체할수 있을까?

[비슷한 질문](https://github.com/johnagan/clean-webpack-plugin/issues/197)을 찾았다. 여전히 clean-webpack-plugin만의 기능이 있어 아직은 지원 종료 할 수 없다는 내용이다. 1) clean 옵션으로는 webpack-dev-server의 output 폴더를 지울수 없는데 이 플러그인은 가능하다는 것. 2) 이 플러그인의 cleanAfterEveryBuildPatterns 옵션(매 빌드마다 패턴에 맞는 파일을 삭제하는 옵션)을 clean 옵션에서는 지원하지 않는다는 것 같다.

# 결론

빌드 과정에서 이전 결과물을 정리하는 절차가 간소해졌다. 외장 플러그인 없이 웹팩 설정 옵션으로만 사용 가능하다.

웹팩 4를 여전히 사용중인 곳에서는 clean-webpack-plugin이 여전히 유효하다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/2022-post-sample-code/tree/main/webpack-output-clean)
- [Output | webpack](https://webpack.js.org/configuration/output/#outputclean)
- [Deprecate plugin in favor output.clean · Issue #197 · johnagan/clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin/issues/197)
