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

    sendEvent: function sendEvent({category, action, label, value = 1}) {
      if (!category || !action) return;
      if (typeof ga !== 'function') return;
      ga('send', 'event', category, action, label, value);
    },
  }

  var categoryButton = {
    init: function(triggerEl, targetEl) {
      if (!triggerEl || !targetEl) return;

      this.triggerEl = triggerEl;
      this.targetEl = targetEl;

      this.triggerEl.addEventListener('click', categoryButton.onClick);
    },

    onClick: function(evt) {
      evt.preventDefault();
      var willVisible = categoryButton.willVisible()
      categoryButton.toggleTarget(willVisible);
      categoryButton.handleEvents(willVisible);
    },
    
    hideTarget: function() {
      categoryButton.targetEl.style.visibility = 'hidden';
    },
    
    showTarget: function() {
      categoryButton.targetEl.style.visibility = 'visible';
    },

    toggleTarget: function(willVisible) {
      willVisible ? categoryButton.showTarget() : categoryButton.hideTarget();
    },

    willVisible: function()  {
      var visibility = categoryButton.targetEl.style.visibility;
      return !visibility || visibility === 'hidden';
    },

    handleEvents: function(willVisible) {
      if (willVisible) {
        setTimeout(function() {
          window.addEventListener('click', categoryButton.handleClickOuter)
          window.addEventListener('keydown', categoryButton.handleKeydownEsc)
        })
      } else {
        categoryButton.blur();
      }
    },
    
    blur: function() {
      categoryButton.triggerEl.blur();
    },
    
    handleClickOuter: function(evt) {
      var el = evt.target;
      while (el) {
        if (el === categoryButton.targetEl) {
          window.removeEventListener('click', categoryButton.handleClickOuter)
          return;
        }
        el = el.parentElement
      }
      
      categoryButton.hideTarget()
      categoryButton.removeEventLinsteners();
    },
    
    handleKeydownEsc: function handleKeydownEsc(evt) {
      var esc = 27;
      if (evt.keyCode === esc) {
        categoryButton.hideTarget()
      }
      categoryButton.removeEventLinsteners()
    },
    
    removeEventLinsteners: function() {
      window.removeEventListener('keydown', categoryButton.handleKeydownEsc)
      window.removeEventListener('click', categoryButton.handleClickOuter)
    },
  };


  document.addEventListener('DOMContentLoaded', function() {
    googleAnalytics.init('UA-31588166-2');
    categoryButton.init(
      document.querySelector('#category-btn'), 
      document.querySelector('#category-dropdown'),
    )
  });
})();
