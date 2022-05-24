---
slug: "/dev/2020/08/19/gatsby-image.html"
date: 2020-08-19
title: "개츠비의 이미지 처리 방식"
layout: post
category: 개발
tags: [image, gatsby, react]
---

개츠비 문서를 봤을때 눈에 띄었던 것이 이미지 처리 방식이다.
화면 스크롤에 따라 이미지를 로딩하는 것(lazy load)은 이전에 만들어 봐서 익숙했지만 새로운 몇 가지가 더 있는것 같았다.

이미지를 가지고 있는 화면을 로딩할 때, 뿌옇게 보여주다가 원본 이미지를 보여주는 효과(blur up)가 마치 미디엄의 고급스러운 분위기를 자아냈다.
브라우져 너비에 따라 최적화된 이미지를 사용(responsive image)하는 알뜰한 모습도 발견했다.

가이드라인에 따라 블로그에 게츠비를 적용해 봤는데 꽤나 마음에 든다.

그런데 사용한 플러그인이 한 두개가 아니다.

- gatsby-source-filesystem
- gatsby-plugin-sharp
- gatsby-remark-image
- gatsby-transformer-sharp

개츠비 문서에서 하라는대로 따라하기는 했지만 각 플러그인의 역할은 여전히 궁금하다.
어떤 방식으로 동작하는지도 좀 살펴 봐야겠다.

# 웹팩이 처리하는 이미지

개츠비는 이미지를 처리할 수 있는 몇 가지 방법을 제공한다.
먼저 [파일을 직접 가져 오는 방식](https://www.gatsbyjs.com/docs/importing-assets-into-files/)이다.

```jsx
import logo from "../images/logo.png"

const SamplePage = () => {
  return <img src={logo} />
}
```

모듈 시스템을 이용해 상대 경로로 이미지를 가져와 사용하는 매우 단순한 방식이다.
웹팩의 파일 로더를 사용한 것 같다([참고](https://github.com/gatsbyjs/gatsby/blob/7b1a0f29eb48f5d0b1848baa269c6764a76dc172/packages/gatsby/src/utils/webpack-utils.ts#L250)).

# 정적 파일로써 이미지

개츠비는 /static 폴더에 담긴 파일을 정적 파일로 제공한다.
자비스크립트나 스타일시트 혹은 이미지 파일을 이 폴더에 넣으면 파일의 경로로 조회할 수 있다.

/static/logo.png 로 위치시킨 다음 컴포넌트에서는 이렇게 사용할 수 있다.

```jsx
const SamplePage = () => {
  return <img src="/logo.png" />
}
```

일반적으로 CDN에 있는 자원을 가져오는 방식과 같다.

# 게츠비의 반응형 이미지

사실 위 두 가지는 별로 특별할게 없다.
세번째 방식이 매력적이다.
먼저 "반응형 이미지"부터 짚고 넘어가자.

## 반응형 이미지

반응형 사이트는 미디어 쿼리를 이용해 디바이스 너비에 따라 다양하게 스타일링하는 기술이다.
미디어 쿼리로 부족한 부분은 자바스크립트를 이용해 돔을 동적으로 수정하기도 한다.

문서를 변경할 때 대부분 박스 요소에만 집중했지 이미지에 대해서는 크게 신경쓰지 않았다.
자바스크립트를 이용해 너비에 따라 다른 이미지로 갈아치운 정도가 전부다.
예를 들어 모바일과 데스크탑의 로고 이미지를 다르게 만들어야 하는데 자바스크립트로 이것을 처리했다.

디바이스 크기에 따른 이미지 대응을 "[반응형 이미지](https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)"라고 한다.

반응형 이미지는 아래 두 가지로 구분지어 생각할 수 있다.

- 아트 디렉션 문제
- 해상도 전환 문제

아트 디렉션 문제는 가령 데스크탑 화면에서는 이미지 전체를 보여주고 좁은 화면의 모바일에서는 이미지의 중요한 부분만 일부 보여준다는 것이다.

한편 해상도 전환 문제는 약간 다르다.
데스크탑 화면에서는 원본 이미지를 보여줄 수 있지만 좁은 화면의 모바일에서는 이게 대역폭 낭비일 수 있다는 것.
좁은 화면에 맞는 해상도의 이미지만 보여줘도 충분하다.

## 게츠비 이미지(gatsby-image)

게츠비에서는 이 두 가지 기술을 모두 사용할 수 있다.
핵심이 되는 것이 바로 [gatsby-image](https://www.gatsbyjs.com/plugins/gatsby-image/) 패키지다.
바로 사용할 수는 없고 몇 가지 "사전 준비"를 해야한다.

### gatsby-source-filesystem

이미지 파일을 포함한 모든 파일을 그래프큐엘로 조회하려면 [gatsby-source-filesystem](https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/?=)을 사용해야 한다.

/src/images 폴더에 이미지를 넣는다고 가정하고 이 플러그인을 개츠비 설정 파일에 추가한다.

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
  file(base: { eq: "logo.png" }) {
    id
  }
}
```

아마도 개츠비의 플러그인이 파일을 처리하려면 이렇게 그래프큐엘로 조회할 수 있는 상태로 만들어 두어야 하는것 같다.
그렇기 때문일까? 이후에 사용할 모든 플러그인은 이 환경에 기반해서 동작한다.

### gatsby-transformer-sharp, gatsby-plugin-sharp

[gatsby-transformer-sharp](https://www.gatsbyjs.com/plugins/gatsby-transformer-sharp/)는 imageSharp 노드를 만들어 이것 역시 그래프 큐엘에서 조회할 수 있도록하는 플러그인이다.
이미지처리 라이브러리 Sharp를 함께 사용하는데 [gatsby-plugin-sharp](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp/)가 바로 Sharp api를 사용할수 있게끔 도와주는 녀석이다.

```js
// gatsby-config.js

module.exports = {
  plugins: [`gatsby-transformer-sharp`, `gatsby-plugin-sharp`],
}
```

두 플러그인을 추가하고 나면 imageSharp 노드가 생성된다.
이것은 파일 노드의 자식노드로도 나타나는데 childImageSharp란 이름으로 조회한다.

```graphql
query {
  imageSharp {
    id
  }
  file {
    childImageSharp {
      id
    }
  }
}
```

### gatsby-image

이제 비로소 gatsby-image 컴포넌트로 반응형 이미지를 사용할 수 있는 환경이 준비되었다.
gatsby-image의 `<Img>`가 반응형 이미지를 처리하는 컴포넌트다.
이 컴포넌트는 sharp로 처리한 데이터를 프롭스로 받아서 그리는 구조다.

이전에 설치한 플러그인들 덕분에 그래프큐엘로 이미지 데이터를 조회할 수 있다.

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

이 컴포넌트가 만든 html 코드를 살펴보면 이렇다.

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

이미지 파일을 가져오기 전까지는 작은 이미지로 뿌옇게 보여준다.
이를 "blur up" 이라고 하는데 대표적으로 미디엄에서 사용하는 기술이다.
그래프큐엘로 조회한 이미지에 base64로 인코딩된 작은 이미지 문자열이 있는데 이걸 사용한 것이다.

그리고나서 반응형 이미지를 보여주는데 `<picture>` 와 `<img srcset="" sizes="">`를 사용한걸 보니, 아트디렉션 문제와 해상도 전환 문제 둘을 함께 다루는 것 같다.
브라우져의 너비를 조절해 가면서 네트웍을 확인하면 너비에 따라 다른 이미지를 요청한다.

그런데 sizes 속성에 정의한 미디어 쿼리에 의해 계산된 이미지 사이즈가 srcset에 있는 이미지 크기와 잘 안맞는것 같았다.
가령 브라우져 너비를 50 픽셀로 조절하면 100w의 이미지를 요청할 것이라 기대했지만 그 두 배인 200w 크기의 이미지를 요청하더라.

아마도 디스플레이 해상도가 높아지면서 레티나 대응을 위한 브라우져의 동작인 것 같은 눈치다(참고: [With srcset, the browser does the work of figuring out which image is best](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/#with-srcset-the-browser-does-the-work-of-figuring-out-which-image-is-best)).
장비 너비에 따른 최적의 이미지를 요청하는 기준은 브라우져별(파이어폭스, 크롬, 사파리)로 다르게 동작했다.

여하튼 이렇게 최적의 이미지를 찾고 파일을 브러우져로 다운로드하면 먼저 보여주었던 blur-up 이미지를 대체한다.

아트 디랙션 문제도 다룰 수 있다.

이미지를 얻을 때 데스크탑 이미지, 모바일 이미지을 따로 조회한다.
그리고 나서 이걸 `<Img>` 컴포넌트에 전달만 하면된다.

```jsx
const SamplePage = () => {
  // 데스크탑 이미지와 모바일 이미지를 조회한다
  // - 데스크탑에서는 gatsby-astronaut.png를 사용하고
  // - 모바일에서는  gatsby-astronaut-mobile.png를 사용하겠다
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

이 컴포넌트가 만든 html 코드를 살펴보면 이렇다.

```html
<picture>
  <!-- 가로 해상도가 800px 이상일 경우 gatsby-astronaut.png 파일을 사용  -->
  <source
    media="(min-width: 800px)"
    srcset="
      /.../69585/gatsby-astronaut.png 200w,
      /.../497c6/gatsby-astronaut.png 400w,
      /.../ee604/gatsby-astronaut.png 800w
    "
    sizes="(max-width: 800px) 100vw, 800px"
  />
  <!-- 그렇지 않으며 (가로 해상도가 800px 미만일 경우) gatsby-astronaut-mobile.png 파일을 사용  -->
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

가로 해상도가 800px일 경우 데스크탑용 이미지(gatsby-astronaut.png)를 사용하도록 미디어 쿼리가 만들어 졌다.
그렇지 않으면 모바일용 이미지(gatsby-astronaut-mobile.png)를 사용할 것이다.

# 마크다운 문서에서의 이미지

[gatsby-remark-images](https://www.gatsbyjs.com/plugins/gatsby-remark-images/) 플러그인을 사용하면 마크다운 안에 포함된 이미지를 위 처럼 처리할 수 있다.
Blur-up, lazy 로딩, 해상도 전환 문제 등 gatsby-image와 거의 유사한 효과를 낼 수 있다.

# 결론

정적 사이트가 아닐 경우는 어떻게 이미지를 처리해야 할까?

이미지를 처리하는 서버는 이미지 업로드를 받으면 미리 가공해 두어야 할 것이다.
게츠비가 빌드될때 이미지를 만들어 두는 것처럼 말이다.
blur-up에 사용할 아주 작은 이미지부터 디바이스 별로 대응할 수 있는 다양한 크기의 이미지를 준비해야겠지.

이러한 이미지 정보를 서버로부터 받은 브라우져에서는 이미지 태그에 srcset과 sizes 속성을 구성하는 것도 필요하다.
그리고 아트 디렉션 문제를 다루려면 `<picture>` 요소도 고려해야할 것이다.
