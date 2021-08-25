---
title: "블로그 댓글 서비스 교체: Utterances"
layout: post
category: dev
---

언제부터인가 블로그 하단에 광고가 붙기 시작했다.
구글 애드샌스를 사용하는것도 아닌데 이상하다.
마치 자가용에 택시 광고판을 붙이고 다니는 것 같아서 얼른 떼어버리고 싶었다.

원인은 댓글 서비스로 사용하는 디스커스(Disqus)에서 나오는 광고였다.
처음엔 광고 없이 사용할수 있지만 일정 기간이 지나면 광고가 붙게되는데 광고를 없애려면 구독료를 지불하는 정책이다.
디스커스를 사용한지 5년이나 지났지만 광고를 발견하지 못한 이유는 브라우져에 추가한 광고 차단 확장도구 때문이었다.
블로그에 방문하는 상당수는 그 동안 이 광고를 보고 있었다는 생각이 드니 뒤통수를 얻어 맞은 기분이 들었다.

## 어떤 대안이 있을까?

당장 머릿속에 떠오른건 페이스북과 깃헙이었다.
각 플래폼을 이용해서 댓글 서비스를 연동해 운영하는 몇 몇 블로그를 본 기억이 있기 때문이다.

광고로 돈을 버는 페이스북 보다는 프라이빗 저장소로 돈을 버는 깃헙이 나중에 광고가 없을 것 같다는 생각이 들었다.
그 동안 디스커스 데이터베이스에 쌓인 블로그 댓글을 생각하면 댓글 서비스의 광고 유무가 큰 선택 기준이 된다.

## 깃헙으로 댓글 서비스를 교체하자 (Utterances)

처음엔 깃헙에서 댓글 서비스를 제공하는 줄 알았는데 착각이었다.
깃헙 이슈를 댓글 저장소로 활용해 댓글 기능을 만드는 오픈소스 프로젝트가 있었다.

- [Utterance](https://github.com/utterance/utterances)

처음 듣는 단어인데 찾아보니 "(말로) 표현함, 입 밖에 냄"이란 명사다.

웹페이지 경로를 기준으로 깃헙 이슈를 만들어 댓글을 관리하는 라이브러리다.
어터런스가 특정 페이지에서 실행되면 다음과 같은 역할을 한다

- 화면에 댓글 입력 폼을 그린다.
- 여기에 댓글을 입력하면 해당 페이지의 깃헙 이슈에 댓글을 추가한다.
- 깃헙 이슈에 있는 모든 댓글을 해당 페이지에 그린다.

자세한 설치 방법은 이 문서를 참고해서 따라했다.

- https://utteranc.es

댓글을 출력하고 싶은 위치에 라이브러리 로딩 코드를 삽입하는데 그전에 설정 정보를 준비한다.

```ts
const utterancSettings = {
  src: "https://utteranc.es/client.js",
  repo: "jeonghwan-kim/jeonghwan-kim.github.com",
  "issue-term": "pathname",
  label: "Comment",
  theme: "github-light",
  crossOrigin: "anonymous",
  async: "true",
}
```

- src: 사용할 라이브러리 주소다.
- repo: 댓글 저장소로 사용할 깃헙 저장소 주소다.
- Issue-term: 이슈를 만들때 사용할 제목이다. 블로그 포스트의 경로를 이슈 제목으로 사용했다.
- Label: 이슈를 만들때 "Comment" 라는 태그를 추가한다.
- theme: 테마를 지정할 수 있는데. 우선은 라이트 테마로 설정했다.

이미 리액트 컴포넌트로 PostComment가 디스커스 커맨트를 렌더링하고 있었는데 이걸 어터런스로 교체했다.

```tsx
const PostComment: FC = () => {
  const ref = createRef<HTMLDivElement>()

  useEffect(() => {
    const utterances = document.createElement("script")
    Object.entries(utterancSettings).forEach(([key, value]) => {
      utterances.setAttribute(key, value)
    })
    ref.current.appendChild(utterances)
  }, [])

  return <div id="utteranc-comments" ref={ref}></div>
}
```

컴포넌트 마운트 시점에 스크립트를 로딩하는 방식으로 구현했다.
사실 처음엔 스크립트를 바로 렌더링하는 코드를 사용했는데 잘 동작하지 않았다.
나는 게츠비 프레임웍을 사용해서 블로그를 운영하는데 비슷한 문제를 다룬 글을 찾아서 해결했다.

- [Gatsby 블로그 댓글 플러그인(utterances)](https://utteranc.es)

## 결론

간단히 라이브러리 삽입만으로 댓글 서비스를 교체할 수 있었다.

데이터 마이그레이션까지 마치고 기존 댓글을 쭉보는데 무엇보다 광고가 사라졌다는 점에서 무척 만족스럽다.
게다가 깃헙 에디터 기능을 모두 사용할 수 있는데 마크다운 문법으로 좀 더 화려하게 글을 쓸 수 있게 되었다.
블로그 방문자 특성을 고려했을 때 코드 하이라이팅 기능이 기대된다.

한계도 있긴하다. 댓글의 댓글을 입력할 수 없고 댓글을 입력하려면 반드시 깃헙 계정이 있어야만 한다.
