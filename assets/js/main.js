(function() {
  'use strict';

  var googleAnalytics = {
    init: function init(token) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', token, 'auto');
      ga('send', 'pageview');
    },

    sendEvent({category, action, label, value = 1}) {
      if (!category || !action) return;
      if (typeof ga !== 'function') return;
      ga('send', 'event', category, action, label, value);
    },
  }

  var categoryButton = {
    init: function init(triggerEl, targetEl) {
      if (!triggerEl || !targetEl) return;

      this.triggerEl = triggerEl;

      triggerEl.addEventListener('click', function(evt) {
        evt.preventDefault();
        categoryButton.toggleTarget(targetEl);
      })
    },
    toggleTarget: function onClick(targetEl) {
      var value = targetEl.style.visibility;
      var isTryShow = !value || value === 'hidden' 
      targetEl.style.visibility = isTryShow ? 'visible' : 'hidden';

      function handleClickOuter(evt) {
        var el = evt.target;
        while (el) {
          if (el === targetEl) {
            return;
          }
          el = el.parentElement
        }

        targetEl.style.visibility = 'hidden';

        window.removeEventListener('click', handleClickOuter)
      }

      // wip: 토글 작업중
      // console.log('isTryShow', isTryShow)
      // function handlePressEsc(evt) {
      //   const esc = 27;
      //   if (evt.keyCode === esc) {
      //     targetEl.style.visibility = 'hidden';
      //     categoryButton.triggerEl.blur();
      //   }

      //   window.removeEventListener('keydown', handlePressEsc)
      // }

      if (isTryShow) {
        setTimeout(function() {
          window.addEventListener('click', handleClickOuter)
          window.addEventListener('keydown', handlePressEsc)
        },1)
      }
      if (!isTryShow) {
        categoryButton.triggerEl.blur()
      }
      return;
    },
  }

  document.addEventListener('DOMContentLoaded', function() {
    googleAnalytics.init('UA-31588166-2');
    categoryButton.init(document.querySelector('#category-btn'), document.querySelector('#category-popup'))
  });
})();
