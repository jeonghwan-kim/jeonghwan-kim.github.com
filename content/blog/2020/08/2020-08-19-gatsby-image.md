---
title: "개츠비의 이미지 처리 방식"
layout: post
category: dev
tags: [image, gatsby]
---

개츠비 문서를 봤을때 혹 했던 것이 이미지 처리 방식이다.
화면 스크롤에 따라 이미지를 로딩하는 것(lazy load)은 이전에 몇 번 만들어 봐서 익숙했지만 몇 가지가 더 눈에 띄였다.

이미지를 가지고 있는 웹페이지를 로딩하기 시작할 때 뿌옇게 보여주다가 원본 이미지를 보여주는 효과(blur up)가 마치 미디엄의 고급스러운 분위기를 자아냈다.
그리고 브라우져 크기에 따라 다른 크기의 이미지를 사용하는(responsive image) 알뜰한 모습도 보였다.

문서를 보면서 블로그에도 적용해 봤는데 썩 마음에 든다.
그런데 사용한 프로그인이 한 두 가지가 아니다.

- gatsby-source-filesystem
- gatsby-plugin-sharp
- gatsby-remark-image
- gatsby-transformer-sharp

문서에서 하라는대로 따라하기는 했지만 각 플러그인의 역할을 궁금하다.
그리고 어떤 방식으로 동작하는지도 좀 살펴 봐야겠다.

# 웹팩이 처리하는 이미지

개츠비는 이미지 처리하는 몇 가지 방법을 제공한다.
먼저 [파일을 직접 가져 오는 방식](https://www.gatsbyjs.com/docs/importing-assets-into-files/)이다.

```tsx
import logo from "../images/logo.png"

const SamplePage = () => {
  return <img src={logo} />
}
```

모듈 시스템을 이용해서 직접 이미지를 가져와 사용하는 매우 단순한 방식이다.
웹팩의 파일 로더를 사용한 것 같다([참고](https://github.com/gatsbyjs/gatsby/blob/7b1a0f29eb48f5d0b1848baa269c6764a76dc172/packages/gatsby/src/utils/webpack-utils.ts#L250)).

# 정적 파일로써 이미지

개츠비는 /static 폴더를 정적 파일로 만든다.
자비스크립트나 CSS 그리고 이미지 파일을 이 폴더에 넣으면 파일이름을 uri해서 조회할 수 있다.

/static/logo.png 로 위치시킨 다음 컴포넌트에서는 이렇게 사용할 수 있다.

```tsx
const SamplePage = () => {
  return <img src={`/logo.png`} />
}
```

일반적으로 CDN에 있는 자원을 가져오는 방식과 같다.

# 게츠비의 반응형 이미지

사실 위 두 가지는 특별할게 없다.
기존에 많이 사용하던 것과 달리 세번째 방식은 "반응형 이미지"를 먼저 짚고 넘어가자.

## 반응형 이미지

반응형 사이트는 이제 무척 익숙하다.
미디어 쿼리를 기반으로 디바이스 너비에 따라 스타일을 다양하게 하는 것이 기술이다.
최근에는 자바스크립트를 많이 활용했는데 너비를 감지하다가 돔을 동적으로 변경하는 방식으로 만들었다.

문서를 변경할때 대부분 박스 요소에만 집중했지 이미지에 대해서는 크게 신경쓰지 않았다.
너비에 따라 다른 이미지를 사용한 정도가 전부다.
예를 들어 모바일과 데스크탑의 로고 이미지를 다르게 만들어야 하는데 자바스크립트로 이것을 처리했다.

이런식으로 디바이스 크기에 따른 이미지를 대응을 "[반응형 이미지](https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)"라고 부른다.

반응형 이미지는 아래 두 가지로 구분지어 생각할 수 있다.

- 아트 디렉션 문제
- 해상도 전환 문제

아트 디렉션 문제는 가령 데스크탑 화면에서는 이미지 전체를 보여주고 좁은 화면의 모바일에서는 이미지의 중요한 부분만 일부 보여준다는 것이다.

한편 해상도 전화 문제는 조금 다르다.
데스크탑 화면에서는 원본 이미지를 보여줄 수 있지만 좁은 화면의 모바일에서는 이게 대역폭 낭비일 수 있다.
좁은 화면에 맞는 해상도의 이미지만 보여줘도 충분하다.

## 게츠비 이미지(gatsby-image)

게츠비에서는 이 두 가지를 모두 구현할 수 있다.
구현의 핵심이 되는 기술이 바로 [gatsby-image](https://www.gatsbyjs.com/plugins/gatsby-image/) 패키지다.

<!-- 이미지 처리 라이브러리 Sharp와 함께 동작하는데 그래프큐엘 방식으로 이미지를 조회하고 <Img> 컴포넌트로 이미지를 렌더링한다. -->

gatsby-image를 사용하려면 몇가지 먼저 설치해해 두어야 할게 있다.

### gatsby-source-filesystem

이미지 파일을 포함한 모든 파일을 개츠비 파일 조회 인터페이스인 그래프큐엘로 조회하려면 gatsby-source-filesystem을 사용해야 한다.

/src/images 폴더에 이미지를 넣는다고 가정하고 이 프러그인을 개츠비 설정 파일에 추가한다.

```js
// gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
  ],
}
```

그러고 나면 그래프큐엘로 이미지 파일을 조회할 수 있다.

```graphql
query {
  file(base: { eq: "gatsby-icon.png" }) {
    id
    base
  }
}
```

아마도 개츠비의 모든 플러그인으로 파일을 처리하려면 이렇게 그래프큐엘로 조회할수 있는 상태로 만들어 두어야 하는것 같다.
그렇기 때문일까 이후에 사용할 모든 플러그인은 이러한 환경에 기반해서 동작한다.

### gatsby-transform-sharp, gatsby-plugin-sharp

gatsby-transform-sharp는 imageSharp 노드를 만드는 역할을 하고 그래프 큐엘에서 조회할 수 있다.
이미지처리 라이브러리 Sharp를 함께 사용해야하는데 gatsby-plugin-sharp가 바로 그것이다.

```js
// gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`, // 추가
    `gatsby-plugin-sharp`, // 추가
  ],
}
```

### gatsby-image

# 마크다운 문서에서의 이미지

gatsby-remark-images
gatsby-image와 유사.
아트 디렉션만 없는 듯

# 결론

게츠비에서 이미지 사용하는 방식을 공부해야겠다.

레이지 정도만 구현해봤다.
나머지 blur-up, 반응형 이미지도 구현해 보자.
