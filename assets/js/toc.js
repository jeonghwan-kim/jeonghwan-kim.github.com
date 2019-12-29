(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', onload);

  var TOC_ID = '#toc';

  function onload() {
    try {
      initToc();
    } catch(err) {
      console.error(err);
      return removeTocEl();
    }   
  }

  function initToc() {
    var el = document.querySelector('#post').querySelector('.post-content')
    if (!el) {
      return;
    }
  
    var headings = el.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (!headings.length) {
      return removeTocEl();
    }
  
    var prevHeadingLevel = 0 // 1, 2, 3,4,5,6
    var html = Array.from(headings).map(h => {
      var headingLevel = Number(h.nodeName.toUpperCase().replace('H', ''));
      var html = '';
      if (prevHeadingLevel < headingLevel) {
        html = `<ul><li><a href="#${h.id}">${h.textContent}</a></li>`
      } else if (prevHeadingLevel === headingLevel) {
        html = `<li><a href="#${h.id}">${h.textContent}</a></li>`
      } else {
        var diff = prevHeadingLevel - headingLevel;
        html = `${new Array(diff).fill(1).map(_=> '</ul>').join('')}<li><a href="#${h.id}">${h.textContent}</a></li>`;
      }
  
      prevHeadingLevel = headingLevel;
      return html;
  
    });
  
    var toc = document.querySelector('#toc');
  
    if (html.length < 0) {
      return removeTocEl()
    }
  
  
    if (toc) {
      toc.innerHTML = html.join('');
    }
  }
  
  function removeTocEl() {
    var el = document.querySelector(TOC_ID);
    if (el) {
      el.parentElement.removeChild(el)
    }
  }
})();

