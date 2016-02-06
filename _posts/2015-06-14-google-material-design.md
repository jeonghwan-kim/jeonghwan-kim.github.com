---
id: 384
title: Google Material Design
date: 2015-06-14T15:20:29+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=384
permalink: /google-material-design/
categories:
  - 미분류
tags:
  - css
  - google material design
  - materialize
---
지메일을 사용해 오면서 기능에는 딴지를 걸 수 없을 정도로 만족하며 사용했습니다. 좀 아쉬운것은 '디자인 좀 개발자스럽네'라는 것. 그러나 베타 버전인 점과 메일서비스 고유의 기능만 충족하면 됐다는 생각에 꾸준히 사용하고 있습니다.

몇 전 전부터 구글은 로고 이지를 고급스럽게 바꾸고 메일도 멋스럽게 변경을 했습니다. 이제 디자인에 신경쓰나보다 했죠. 최근엔 인박스(<a href="http://www.google.com/inbox/">Inbox</a>)를 베타버전으로 공개하였습니다. 처음 봤을 때 '이건 완전히 모바일이랑  똑같잖아?'라는 반응이었습니다. 구글에서는 <a href="http://www.google.com/design/spec/material-design/introduction.html">Google Material Desgin</a>을 발표했고 인박스는 그것을 웹과 모바일 서비스에서 똑같이 구현해 놓은 것입니다. 안드로이드에서 제공하는 Material 디자인의 편리함을 웹에서도 그대로 경험하는 것은 참 즐거운 일인 것 같습니다.
<h1>Google Material Design</h1>
디자인 문서을 읽어보았습니다. 레이아웃, 문구, 이미지, 색상, 애니메이션 등에 대해 자세한 디자인 가이드라인을 설명합니다. 매우 친절합니다. 그냥 이대로 따라하면 멋진 웹도 모바일처럼 멋진 서비스가 될것 같네요. 몇 가지 정리해보면 이렇습니다.

<strong>에니메이션</strong>: 보통 애니메이션은 페이드 인/아웃만 사용했었는데요, 상당히 자세하게 설명합니다. 애니메이션의 속도와 방향, 방향도 의미있는 방향이어야 합니다.

<strong>색상</strong>: 가장 어려운것 중 하나인데요. 강조 색상, 헤더, 상태바, 카드, 검색창, 사이드 네비게이션, 버튼 등 어떤 테마 색상으로 구현해야 하는지 자세히 안내합니다. 특히 팔레트의 rgb 값은 색상 정하는데 많은 도움이 될것 같구요.

<strong>아이콘/이미지</strong>: 아이콘을 어떻게 만들어야 하는지, 어떤 이미지를 피해야하는지 설명합니다. 이건 디자이너가 보면 도움이 될것 같습니다.

<strong>폰트</strong>: 웬만하면 기본 폰트를 쓰거나 한글은 나눔고딕체를 사용했는데요. 가이드라인에서는 Roboto, Noto을 제시합니다. 또한 각 언어 타입별로 크기과 굵기도 지정해 줍니다. 타이틀, 버튼 문자를 어떤 크기와 굵기로 해야하는지 알수 있습니다.

<strong>문구작성(Writing)</strong>: 입력폼을 작성할 때 안내 문구를 어떻게 써야할까는 항상 고민합니다. 예를 들어 "비밀번호는 6자리 이상 입력하세요", "잘못된 이메일 형식입니다." 이런식으로 작성 하는데요. 이번 가이드라인에서는 이런 문구들 조차 어떤 톤으로 작성해야 하는지 기준을 제시해 부니다. "친근하게 말하라", "꼭 필요한 말만 하라", "긍적적으로 말하라" 이런 가이드라인은 반드시 참고하는 것이 좋을 것 같네요.
<h1>Materialize</h1>
이제 스타일시트와 자바스크립트로 이것을 구현만 하면 웹 개발이 엄청 재미있을 것 같습니다. 그러나 역시 벌써 <a href="http://materializecss.com/">Matrialize</a>라는 이름으로 프로젝트를 시작하고 있습니다. 약 2,000개 커밋, 별 10,000개, 1,000회 이상 의 포크 수를 보면 드는 생각. '난 이런걸 왜 이제서야 찾은거지?'

<a href="http://whatilearn.com/wp-content/uploads/2015/06/materialize.jpg"><img class="alignnone size-full wp-image-389" src="http://whatilearn.com/wp-content/uploads/2015/06/materialize.jpg" alt="materialize" width="777" height="459" /></a>

개발중인 이 프로젝트는 사이트를 둘러보는 것 만으로도 무척 재밌습니다. 색상, 폰트, 애니메이션등 가이드라인에서 제시한 수준으로 구현되어 있습니다. 트위터 부트스트랩도 훌륭하지만, 좀 더 새로운 환경헤서 개발하고 싶다면 바꿔도 좋을 것 같습니다. 사용법도 비슷합니다. 장점이라고 생각하는 것은 색상 선택방법입니다. 컬러 클래스를 설정하고 이를 기준으로 옅은 색은 `.lighten-n`, 어두운 색은 `.darken-n`, 강조색은 `.accent-n`으로 설정할수 있습니다. 부트스트랩에서 css만 사용할때 아쉬운 점이죠.

필자가 자주 사용하는 angular-fullstack  샘플코드에 적용된 트위터 부트스트랩 테마를  Materialize 테마로 변경해 보았습니다.(<a href="https://github.com/jeonghwan-kim/fullstack-demo-materialize">fullstack-demo-materialize</a>) 이제 Materialize로 개발하는 것도 재미있을 것 같네요.

&nbsp;