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
      if (!category || !action) {
        return;
      }
      if (typeof ga !== 'function') {
        return;
      }

      ga('send', 'event', category, action, label, value);
    },
  }

  var onload = () => {
    googleAnalytics.init('UA-31588166-2');

    var post = document.querySelector('#post');
    var postList = document.querySelector('#post-list');

    if (post || postList) {
      var el = post || postList
      el.addEventListener('click', evt => {
        var tagName = evt.target.dataset.tagName;
        if (!tagName) {
          return;
        }

        googleAnalytics.sendEvent({
          category: 'Tag',
          action: 'Click in ' + post ? 'post' : 'post list',
          label: tagName,
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', onload);
})();
