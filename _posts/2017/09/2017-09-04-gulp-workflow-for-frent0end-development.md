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

## WHAT DOES OUR GULPFILE DO?

## SO WHY GULP?

## GENERAL PHILOSOPHY OF BUILDING WEBSITES

## PROJECT TREE

## TAKING A GULP


## GULPFILE.JS PREAMBLE

## PRIMARY GULP TASKS

## CSS GULP TASKS

## JS GULP TASKS

## MISC GULP TASKS

## WHAT’S LEFT OUT?

## THE FULL MONTY

## FURTHER READING


