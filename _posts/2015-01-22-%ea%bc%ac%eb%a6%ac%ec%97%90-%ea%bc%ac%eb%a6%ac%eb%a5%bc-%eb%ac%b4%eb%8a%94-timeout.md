---
id: 133
title: 꼬리에 꼬리를 무는 setTimeout()
date: 2015-01-22T01:05:37+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=133
permalink: /%ea%bc%ac%eb%a6%ac%ec%97%90-%ea%bc%ac%eb%a6%ac%eb%a5%bc-%eb%ac%b4%eb%8a%94-timeout/
categories:
  - Javascript
tags:
  - javascript
  - setTimeout()
---
자바스크립트에서 타이머 설정은  <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers.setTimeout">setTimeout()</a>과 <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers.setInterval">setInterval()</a> 두 가지 함수로 구현할 수 있다. 전자는 시간 경과후 동작하게 하는 것이고 후자는 동일 시간마다 동작을 반복하는 것이다.

재생 시간이 다른 여러개 동영상을 연속해서 재생한다고 생각해 보자. 같은 시간이 아니기 때문에 <code>setInterval()</code>로는 힘들겠다. <code>setTimeout()</code>으로 구현할 수 있을 것 같다. 각 1번 동영상을 재생 하면서 1번 동영상의 재생시간 후에 2번 동영상이 재생되도록 타이머를 맞추면 된다. 단 자바스크립트에서 타이머는 정확한 시간을 보장할 수 없다는 것은 유념해 두자.

아래 코드를 보자. <code>setTimeout()</code>함수를 <code>playLoop()</code>란 함수로 감싼뒤 바로 실행한다. 그러면 두번째 파라매터로 설정한 시간 경과 후 <code>setTimeout()</code>의 1번째 파라메터의 함수가 실행된다. 이 함수에서는 영상을 재생하고 <code>idx</code>와 <code>nextIdx</code> 값을 재 설정한다. 마지막으로 래핑했던 함수 <code>playLoop()</code>를 다시 호출한다. 어찌보면 재귀같은 느낌이기도 하다.

<pre class="lang:js decode:true ">(function () {

    // Return random number from 0 to max - 1
    function getRandomIdx(max) {
        return Math.floor(Math.random() * max);
    }

    // Next idx form array
    function getNextIdx(idx, length) {
        return (idx + 1)  % length;
    }

    // Play video (mock)
    function playVideo(url) {
        console.log('Play:', url);
    }

    // Videos array
    var videos = [{
            url: "video01.mp4",
            sec: 5000
        }, {
            url: "video02.mp4",
            sec: 4000
        }, {
            url: "video03.mp4",
            sec: 6000
        }],
        idx = getRandomIdx(videos.length),
        nextIdx = getNextIdx(idx, videos.length);

    playVideo(videos[idx].url);

    (function playLoop() {
        setTimeout(function() {
            playVideo(videos[nextIdx].url);
            
            idx = nextIdx;
            nextIdx = getNextIdx(idx, videos.length);

            playLoop();
        }, videos[idx].sec);    
    })();
})();</pre>

&nbsp;