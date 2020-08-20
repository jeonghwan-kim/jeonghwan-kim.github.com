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

플러그인을 추가하고 나면 imageSharp 노드가 추가된 것을 확인할 수 있다.
이것은 파일 노드의 자식노드로도 추가된다. childImageSharp

```graphql
query {
  file {
    childImageSharp {
      id
    }
  }
  imageSharp {
    id
  }
}
```

### gatsby-image

이제 gatsby-image 컴포넌트로 반응형 이미지를 사용할 수 있는 환경이 준비되었다.

logo.png 파일을 그래프큐엘에서 조회하는데 sharp로 처리된 이미지 데이터를 얻을 수 있다.
file 노드 중에 gatsby-transformer-sharp 플러그인으로 추가된 childImageSharp 노드를 조회하면 gatsby-image 컴포넌트에 전달한 반응형 이미지 데이터를 얻을 수 있다.

그리고 `<Img>` 컴포넌트로 데이터를 렌더링한다.

```ts
import Img from "gatsby-image"

const SamplePage = () => {
  // sharp로 처리된 logo.png 이미지 데이터를 조회한다.
  const data = useStaticQuery(graphql`
    {
      placeholderImage: file(relativePath: { eq: "logo.png" }) {
        childImageSharp(maxSize: 400) {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  // 반응형 이미지가 구현된 <Img> 컴포넌트로 이미지 데이터를 렌더링 한다.
  return <Img fluid={data.mobileImage.childImageSharp.fluid} />
}
```

이 코드가 만든 html 코드를 살펴보면 이렇다.

```html
<div class="gatsby-image-wrapper">
  <!-- blur up 이미지  -->
  <img src="data:image/png;base64,iVBORw0K..." />
  <!-- 반응형 이미지 -->
  <picture>
    <source
      srcset="
        /static/4a9773549091c227cd2eb82ccd9c5e3a/65e33/logo.png 100w,
        /static/4a9773549091c227cd2eb82ccd9c5e3a/69585/logo.png 200w,
        /static/4a9773549091c227cd2eb82ccd9c5e3a/497c6/logo.png 400w,
        /static/4a9773549091c227cd2eb82ccd9c5e3a/bc59e/logo.png 512w
      "
      sizes="(max-width: 400px) 100vw, 400px"
    />
    <img
      sizes="(max-width: 400px) 100vw, 400px"
      srcset="
        /static/4a9773549091c227cd2eb82ccd9c5e3a/65e33/logo.png 100w,
        /static/4a9773549091c227cd2eb82ccd9c5e3a/69585/logo.png 200w,
        /static/4a9773549091c227cd2eb82ccd9c5e3a/497c6/logo.png 400w,
        /static/4a9773549091c227cd2eb82ccd9c5e3a/bc59e/logo.png 512w
      "
      src="/static/4a9773549091c227cd2eb82ccd9c5e3a/497c6/logo.png"
      loading="lazy"
    />
  </picture>
</div>
```

이미지 파일을 가져오기 전까지는 작은 이미지를 번지게 보여준다.
이를 "blur up" 이라고 하는데 대표적으로 미디엄에서 사용하는 기술이다.
그래프큐엘로 조회한 이미지 데이터에는 base64로 인코딩된 작은 이미지 문자열이 있다.
이를 먼저 보여준다.

그리고나서 반응형 이미지를 보여주는데 `<picture>` 와 `<img srcset="" sizes="">`를 사용한걸 보니, 아트디렉션 문제와 해상도 전환 문제 둘을 함께 다루는 것 같다.
브라우져의 너비를 조절해 가면서 네트웍을 확인하면 너비에 따라 다른 이미지를 요청하는걸 확인 할 수 있다.

그런데 sizee에 정의한 미디어 쿼리에 의해 계산된 이미지 사이즈가 srcset에 있는 이미지 크기와 잘 안맞는것 같았다.
가령 디바이스 크기를 50w로 조절하면 100w의 이미지를 요청할 것이라 기대했지만 그 두 배인 200w 크기의 이미지를 요청한다.
디스플레이 해상도가 높아지면서 레티나 대응을 위한 브라우져의 동작인 것 같다(참고: [With srcset, the browser does the work of figuring out which image is best](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/#with-srcset-the-browser-does-the-work-of-figuring-out-which-image-is-best)).

장비 너비에 따른 최적의 이미지를 요청하는 기준은 브라우져별(파이어폭스, 크롬, 사파리)로 다르게 동작했다.

여하튼 이렇게 계산된 최적의 이미지를 찾고 브러우져로 다운로드 완료하면 blur-up 이미지를 대체하여 렌더링 된다.

아트 디랙션도 설정할 수 있다.

```tsx
const SamplePage = () => {
  // 데스크탑 이미지와 모바일 이미지를 조회한다
  const data = useStaticQuery(graphql`
    query {
      desktopImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
        childImageSharp {
          fluid(maxWidth: 800) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      mobileImage: file(relativePath: { eq: "gatsby-astronaut-mobile.png" }) {
        childImageSharp {
          fluid(maxWidth: 400) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  // 반응형 이미지를 렌더링한다
  return (
    <Img
      fluid={[
        data.mobileImage.childImageSharp.fluid,
        {
          ...data.desktopImage.childImageSharp.fluid,
          media: `(min-width: 800px)`,
        },
      ]}
    />
  )
}
```

```html
<picture>
  <!-- 가로 해상도가 800px 이상일 경우 gatsby-astronaut.png 파일을 사용   -->
  <source
    media="(min-width: 800px)"
    srcset="
      /.../69585/gatsby-astronaut.png 200w,
      /.../497c6/gatsby-astronaut.png 400w,
      /.../ee604/gatsby-astronaut.png 800w
    "
    sizes="(max-width: 800px) 100vw, 800px"
  />
  <!-- 그렇지 않으며 (가로 해상도가 800px 미만일 경우) gatsby-astronaut-mobile.png 파일을 사용   -->
  <source
    srcset="
      /.../65e33/gatsby-astronaut-mobile.png 100w,
      /.../69585/gatsby-astronaut-mobile.png 200w,
      /.../497c6/gatsby-astronaut-mobile.png 400w,
      /.../3dd72/gatsby-astronaut-mobile.png 474w
    "
    sizes="(max-width: 400px) 100vw, 400px"
  />
  <img />
</picture>
```

# 마크다운 문서에서의 이미지

react-image처럼 마크다운 안의 이미지를 처리하려면 [gatsby-remark-images](https://www.gatsbyjs.com/plugins/gatsby-remark-images/) 플러그인을 사용할 수 있다.

blur-up, lazy 로딩, 해상도 전환 문제 등 gatsby-image와 거의 유사한 효과를 낼 수 있다.

# 결론

정적 사이트가 아닐 경우는 어떻게 이미지를 처리해야 할까?

서버가 이미지를 받으면 이모든 버전의 이미지를 가공해 두어야 할 것이다.
blur-up을 위한 이미지부터 장비 너비별로 대응할 수 있는 이미지를 준비해 두어야 한다.

브라우져에서는 이러한 이미지 정보를 서버로부터 받아서 이미지 태그에 srcset과 sizes 속성을 구성해야 한다.
그리고 아트 디렉션 문제를 다루려면 `<picture>` 요소도 고려해야할 것이다.
