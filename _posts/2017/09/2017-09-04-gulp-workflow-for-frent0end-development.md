---
title: (번역) 프론트엔드 개발을 위한 Gulp 워크 플로우
layout: post
category: tool
tags:
  gulp
  frontend
---

> 원문: https://nystudio107.com/blog/a-gulp-workflow-for-frontend-development-automation

> Gulp는 멋진 작업을 빠르게 수행할수 있도록 도와주는 워크 플로우 자동화 도구입니다. 이 글은 프론트엔드 개발을 위한 사용방법을 설명합니다.

![gulp logo](https://nystudio107-ems2qegf7x6qiqq.netdna-ssl.com/imager/img/blog/1449/gulp-logo_23d8cc12ae5e4645eb127377b86289ae.webp)

웹사이트 개발이 점차 복찹해지면서 프론트엔드 워크플로우 자동화 도구가 필요해 지고 있습니다. Gulp는 그러한 도구중에 하나이죠.

> Gulp는 당신의 개발 워크플로우에 고통스럽거나 시간 소모적인 작업들을 자동화 하기 위한 도구 상자 입니다. 그래서 더이상 혼란에 빠지지않고 무언가를 개발할 수 있습니다.

[GulpJS.com](https://gulpjs.com/) 웹사이트에서 이렇게 말하고 있죠. 하지만 Gulp를 상세하게 사용하기 전에 프론트엔드 워크플로우를 자동화하는 *것*이 왜 필요한지 얘기해 보지요.

예전에는 CSS를 만들고 HTML을 수정하고 자바스크립트 한 두개를 웹사이트에 포함했습니다. 웹사이트는 "온라인 브로셔"로 거듭났으면, 이제는 웹을 통해 배포되는 복잡한 소프트웨어 어플리케이션을 만들고 있습니다.

이러한 복잡성을 돕기위해 마치 조립라인 같은 프론트엔드 워크플로우 자동화 도구를 만들수 있고 우리를 위한 모든 조각들을 함께 배치할수 있습니다. 

![공장의 조립 라인](https://nystudio107-ems2qegf7x6qiqq.netdna-ssl.com/imager/img/blog/1517/automated-assembly-line_23d8cc12ae5e4645eb127377b86289ae.webp)

컴퓨터는 해야할 목록이 주어지면 매 시간마다 결정론적 방법으로 그것들을 수행하는 것을 잘 합니다. 이러한 것은 인간이 잘하지 못하는 것입니다. 우리는 더 높은 수준의 처아키텍처와 창의적인 생각을 더 잘 합니다.

> 자 이제 컴퓨터가 잘하는 일을 하도록 하고 우리는 멋진 것을 만드는데 집중하도록 해 봅시다

우리가 만들고 있는 웹사이트는 스타일과 내용이 각각 다릅니다. 하지만 추상적인 수준에서는 모두 같은 "것"을 포함하고 있는데 그것들은 최종적으로 웹사이트를 만들기 위해 개발되고 조립됩니다.

개념적인 수준으로부터 이런 유형의 "디지털 조립 라인"은 1976년 스튜어트 펠드만(Stuart Feldman)이 [Make](https://en.wikipedia.org/wiki/Make_(software)) 도구를 제작한 이후로 사용되었습니다. 프로젝트가 어떤한 복잡도 수준에 도달할 때마다 워크 플로우 자동화를 구축하데 사용한 시간이 당신의 시간을 절약해 줍니다.

모던 웹사이트는 얼마 전에 그러한 복잡도 수준에 도달하였습니다. [Frontend Dev Best Practices for 2017](https://nystudio107.com/blog/frontend-dev-best-practices-for-2017)  글에서 처럼 "온전한 정신을 유지하고 싶으면 프론트엔드 워크플로우 자동화가 필요합니다"

## 우리의 Gulp는 무엇을 할수 있나요? 

자 그래서 Gulp 프론트엔드 워크플로우 자동화는 우리를 위해서 정확히 무엇을 할 수 있을까요? 여기 적어 보겠습니다.

* CSS 처리
  * 모든 SCSS를 CSS로 컴파일 합니다. 캐쉬를 이용해 더 빠르게 처리합니다.
  * 브라우저 지원을 위해 자동 접두사(auto-prefies)를 추가합니다.
  * 편리한 디버깅을 위한 목적으로 CSS [소스맵](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0)을 생성합니다.
  * 우리가 사용하는 써드파티 모듈/패키지로부터 CSS를 가져옵니다.
  * CSS를 하나로 합치고 최소화 합니다.
* 자바스크립트 처리 
  * ES6로 작성한 모든 자바스크립트를 브라우져 지원을 위해 트래스파일 합니다.
  * 우리가 사용하는 써드파티 모듈/패키지로부터 자바스크립트를 가져옵니다.
  * 자바스크립트를 난독화 합니다.
  * HTML별로 인라인해야할 자바스크립트를 가져옵니다.
* 라이브 리로딩 처리
  * CSS/SCSS가 변경되면 곧장 브라우져는 페이지 로드 없이 화면을 다시 그립니다.
  * 자바스크립트가 변경되면 브라우져가 페이지를 다시 로딩합니다.
  * Twig/HTML 템플릿이 변경되면 브라우져는 페이지를 다시 로딩합니다.
* 웹사이트를 위해 [CriticalCSS](https://nystudio107.com/blog/implementing-critical-css)를 생성합니다. 
* 웹사이트에 [accessibility audit](https://nystudio107.com/blog/making-websites-accessible-americans-with-disabilities-act-ada)를 실행합니다. 
* [Fontello](http://fontello.com/)를 통해 사용하는 glyphs만을 통해 커스텀 아이콘 글꼴을 생성합니다.  
* 하나의 소스 이미지로부터 웹사이트를 위한 다양한 파비콘(그리고 HTML 코드)을 생성합니다. 
* `imagemin`을 통해 웹사이트에서 사용하는 이미지를 무손실압축으로 최소화 합니다. 

... 그리고 조금 더! 이것 당신을 위해 워크플로우 자동화가 할수있는 간단한 오버뷰 입니다. 그리고 이것은 프로젝트 간에 이식 가능합니다. `package.json` 파일로 데이터를 옮기는 방법으로 관심사를 분리했기 때문이죠. 

## 그래서 왜 Gulp 인가요?

프론트엔드 워크플로우를 자동화하기 위해 여러분이 사용할수 있는 도구는 부족하지 않습니다. 다부분 [Node.js](https://nodejs.org/en/) & [NPM](https://www.npmjs.com/) 에코시스템에 의존하고 있지요. 중요한것은 작업에 적합한 도구를 사용하는 것입니다. 

![작업에 적합한 도구](https://nystudio107-ems2qegf7x6qiqq.netdna-ssl.com/imager/img/blog/1522/the-right-tool-for-the-job_23d8cc12ae5e4645eb127377b86289ae.webp)

[JAMstack](https://jamstack.org/) 스타일을 위한 [React](https://facebook.github.io/react/)나 [Vue](https://vuejs.org/)를 이용한 자바스크립트 중심의 프로젝트를 위해 [webpack](https://webpack.github.io/)을 사용하겠죠. 스캐폴딩과 코드 스플리팅(code splitting)이나 핫 모듈 리로딩 같은 고급 기능들 때문에 말이죠. 하지만 웹팩을 효과적으로 사용하기 위해서는 사용하려면 모듈러 번들로만 사용하지 말고 모듈 로더로 사용할 필요가 있습니다. 

이미 [Grunt](https://gruntjs.com/)라는 프론트엔드 워크플로우 자동화 도구가 있고 잘 작동하지만, 설정이 다소 장황합니다. 게다가 Gulp보다 대체적으로 느린편인데 파일 기반의 접근법 때문입니다.

[Laravel Mix](https://laravel.com/docs/5.4/mix)라는 것도 있는데 웹팩의 최 상단 레이어에 추가하는 것입니다. 프로젝트트 부트스트래핑에는 환상적이지만 프로젝트가 어느 규모로 커지면 빌드 프로세스에 추가적인 제어가 필요합니다.

[Viget](https://www.viget.com/)은 [Blendid](https://github.com/vigetlabs/blendid)라고하는 툴을 내장합니다. Gulp와 웹팩 모두를 사용하는 하이브라는 방식을 사용하고 꽤 잘 동작합니다. 하지만 Laravel Mix와 비슷하게 필요하면 빌드에 좀 더 제어를 선호합니다.

어떤 점에서 레이어의 레이어는 좀 어리석을 상태로 끝납니다 (?)

결국, Gulp를 포함한 모든 도구는 간단히 커맨드 라인에서 Node.js 자바스크립트 패키지를 실행합니다. Gulp는 상단에 API와 스트리밍 레이어를 추가해서 일반적인 프론트엔드 빌드를 쉽게 만듭니다. 

또한 [npm 스크립트](https://dgrigg.com/blog/stop-grunting-and-gulping-and-just-use-npm)를 이용해서 다양한 Node.js 모듈을 직접 실행할수 있지만, 다른 수준의 의존성의 트레이드 오프할 가치를 Gulp가 제공하는 편리한 레이어를 찾았습니다. 

[CodeKit](https://codekitapp.com/)이라고 하는 GUI 도구도 있는데 다소 나이스한 기능을 제공합니다. 하지만 최종적으로 이것은 프론트엔드 자동화 도구 세상의 드림위버로 끝날것이라 생각합니다. 어떤 것들은 GUI로 효과적으로 간단히 표현할수 없고 Node.js 에코시스템을 따라잡을 기회가 없을 것입니다. 

> 진정한 "최고"의 빌드 시스템 도구는 없습니다. 독단적이지 마세요. 작업에 가장 적합한 도구를 무엇이든지 선택하세요 

대부분의 프론트엔드 개발 프로젝트에서 Gulp가 유연성과 자동화가 잘 어울립니다. 저는 제 `gulpfile.js`와 `package.json`을 저의 모든 프로젝트에 바로 재사용할 수 있습니다.  그리고 필요하면 커스터마이징 할수 있고 매우 쉬워요.

Tangent(?): 왜 모든 프론트엔드 자동화 도구는 Node.js를 사용할까요? 확실히 그걸 필요학 없어요. PHP, 펄, 루비, Go, 쉡스크립트(마조히스트라면), 정말로 어떤 언어로도 쓰여질수 있어요. 이유는 굉장이 단순해요. 프론트엔드 개발자는 이미 자바스크립트에 친숙하기 때문이죠. Node를 통해 실행되는 자바스크립트에서 그들이 필요한 프로트엔드 자동화 도구가 쓰여진것은 자연스러운 일이었습니다. 

## 웹사이트 구축의 일반 철학 

실제 `gulpfile.js`의 핵심에 들어가기 전에 웹사이트 구축에 대한 일반 철학을 이해하는 것이 중요합니다. `gulpfile.js`는 이러한 웹사이트를 구축하는데 도움을 주는 것이므로 저의 전반적인 접근을 이해하는 것이 유익합니다.

![General Philosophy](https://nystudio107-ems2qegf7x6qiqq.netdna-ssl.com/imager/img/blog/1542/general-philosophy_23d8cc12ae5e4645eb127377b86289ae.webp)

일반적으로, 내가 일하는 웹사이트는 [PRPL 패턴](https://developers.google.com/web/fundamentals/performance/prpl-pattern/)을 따릅니다. 초기에 런데링이 필요한 부분만 로딩하고 필요한 리소스를 프리패치해서 모든것을 비동기적으로 게으른 로딩 처리합니다. 

이것의ㅏ 의미에 대해 자세한 것을 [Implementing Critical CSS on your website](https://nystudio107.com/blog/implementing-critical-css) & [SerivceWorkers and Offline Browsing](https://nystudio107.com/blog/service-workers-and-offline-browsing) 글에서 읽을 수 있습니다. 그리고 더 넓게는 [A Pretty Website Isn't Enough](https://nystudio107.com/blog/a-pretty-website-isnt-enough) & [Creating Optimized Images in Craft CMS](https://nystudio107.com/blog/creating-optimized-images-in-craft-cms) 글에서 웹사이트 성능에 대한 주제를 읽을 수 있습니다.

실용적인 수준에서 우리 사이트에 모든 CSS를  하나의 `site.combined.min.css` 파일로 합쳐서 비동기적으로 로딩하는 것을 의미합니다.  그리고 초기 페이지 스타일링을 [Critical CSS](https://nystudio107.com/blog/implementing-critical-css)로 제공합니다. 

제가 작성한 사이트 측에 SCSS로 작성한 CSS는 CSS로 빌드 되고 써드파티 패키지에서 가져오 CSS와 통합됩니다. 그리고 자동으로 전처리와 최소화를 합니다.

각 페이지에 자바스크립트 코어 셋을 인라인해서 다른 것들(CSS, 자바스크립트 등)을 비동기로 로딩합니다.

자바스크립트는 [ES6 신택스](https://medium.com/javascript-scene/how-to-learn-es6-47d9a1ac2620)로 작성하고 [바벨](https://babeljs.io/)을 통해 웹 브랑우져가 이해할수 있도록 트랜스 파일 합니다.

제가 사용하는 모든 써드파티 패키지들(CSS, 자바스크립트)은 `package.json`의 `dependencies`에 선었도고 `npm`이나 `yarn`을 이용해 [sember](https://semver.npmjs.com/)에 의해 설치/업데이트 됩니다. 한번 더, [A Better package.json for the Frontend](https://nystudio107.com/blog/a-better-package-json-for-the-frontend) 글에서 자세한 것을 찾을 수 있을 겁니다. 

마지막으로, 우리가 사용하는 자바스크립트는 개별로 난독화 되고 의존성 관리를 통해 필요한 페이지에 비동기적으로 로딩됩니다. [LoadJS as a Lightweight JavaScript Loader](https://nystudio107.com/blog/loadjs-as-a-lightweight-javascript-loader) 글에서 자세한 내용을 살펴 보세요. 

이러한 것들음 모두 "손으로"하는 것은 좀 불가능합니다. 그럼에도 불구하고 현대적이고, 성능좋은 웹페이지가 구축되는 방식입니다.

## 프로젝트 트리

프로젝트가 어떻게 보이는지 살펴보는 것은 유익합니다. 다양한 디렉토리가 사용되는 것과 전체 조직 측면에서 말이죠. 

![나무](https://nystudio107-ems2qegf7x6qiqq.netdna-ssl.com/imager/img/blog/1568/bonsai-project-tree_0af0ea3af77cbee594480709c6c6b3e4.webp)

제 프로젝트 디렉토리의 루트는 다음과 같아요 

```bash
vagrant@homestead:~/sites/nystudio107$ tree -a -L 2 -I "node_modules|.git|scripts|.DS_Store|.idea" .
.
├── .babelrc
├── browserslist
├── build
│   ├── fonts
│   ├── html
│   └── js
├── craft
├── .csslintrc
├── .env.php
├── example.env.php
├── .git
├── .gitignore
├── .gitmodules
├── gulpfile.js
├── node_modules
├── package.json
├── public
│   ├── css
│   ├── favicon.ico
│   ├── favicon.png
│   ├── fonts
│   ├── htaccess
│   ├── imager
│   ├── img
│   ├── index.php
│   ├── js
│   ├── webappmanifest.json
│   └── web.config
├── readme.txt
├── scripts
├── src
│   ├── conf
│   ├── css
│   ├── fontello
│   ├── fonts
│   ├── img
│   ├── js
│   └── json
├── templates -> craft/templates/
└── yarn.lock

27 directories, 20 files
```

몇 개의 디렉토리들을 언급할 필요가 있습니다 (이 경로는 모두 `package.json`에 정의되어 있습니다):

* `src/` - 작성한 모든것이 있는 곳입니다. 당신이 소유하고 있습니다. 개발하기 위해 필요한 소스입니다. 여기서 디렉토리 구조는 `public/`을 mirror 합니다
* `build/` - 빌드 시스템에 의해 임시 파일을 빌드를 위한 중간단계 디렉토리입니다 
* `public/js/` - 빌드 시스템에 의해 놓여진  공개 배포용 자바스크립트를 가져오는 위치
* `public/css/` - 빌드 시스템에 의해 놓여진  공개 배포용 CSS를 가져오는 위치
* `node_modules/` - `npm`/`yarn`으로 `package.json`에 나열된 NPM 패키지들을 다운로드됩니다. 빌드 시스템 자체를 위해 사용되는 NPM 패키지 뿐만아니라 프론트엔드에서 사용되는 써드파트 CSS/JS를 포함합니다.

## Gulp 이용하기 

자 이제 Gulp가 어떻게 우리 삶을 더 쉽게 만들어 주는지 볼까요? 이번 글은 정말로 [A Better package.json for the Frontend](https://nystudio107.com/blog/a-better-package-json-for-the-frontend)의 자매 글입니다. 그래서 만약 읽지 않았다면 꼭 읽어 보세요.

**주의**: 여기서는 상당히 두꺼운 것에서 꽤 빨리 진행합니다. 만약 Gulp에 대해 완전히 생소하다면, [Gulp for Beginners](https://css-tricks.com/gulp-for-beginners/)를 먼저 읽어 보세요.

여기서 표현한 `gulpfile.js`는 당신이 지금 읽고 있는 웹사이트를 빌드하기위해 사용됩니다. 그리고 `package.json`파일과 묵이고 *어떤* 프로젝트라도 시작할수 있는 좋은 기초를 제공합니다. 

이 글은 이미 Node.js와 NPM(이나 [Yarn](https://yarnpkg.com/en/)), 그리고 [Gulp](https://gulpjs.com/)를 전역으로 당신의 개발 환경에 설치했다고 가정합니다.

우리는 `gulpfile.js`의 여러 덩어리를 순서에 상관없이 보여줄 것이지만 마지막에선 전체 `gulpfile.js`를 보여줘서 참고하도록 하겠습니다. 

## GULPFILE.JS PREAMBLE

## PRIMARY GULP TASKS

## CSS GULP TASKS

## JS GULP TASKS

## MISC GULP TASKS

## WHAT’S LEFT OUT?

## THE FULL MONTY

## FURTHER READING


