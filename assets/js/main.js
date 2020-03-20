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

  var modal = {
    init: function (triggerEl, modalEl, backdropEl) {
      this.triggerEl = triggerEl;
      this.modalEl = modalEl;
      this.backdropEl = backdropEl;

      this.triggerEl.addEventListener('click', this.showModal.bind(this))
    },
    showModal: function () {
      document.body.style.overflowY = 'hidden';
      this.modalEl.classList.remove('hidden');
      this.backdropEl.classList.remove('hidden');
      this.backdropEl.addEventListener('click', this.hideModal.bind(this))
    },
    hideModal: function() {
      document.body.style.overflowY = 'auto';
      this.backdropEl.classList.add('hidden');
      this.modalEl.classList.add('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    googleAnalytics.init('UA-31588166-2');

    const postVideo = document.querySelector('#post-video')
    if (postVideo) {
      postVideo.addEventListener('click', function onClickPostVideo(evt) {
        googleAnalytics.sendEvent({category: '포스트/관련영상', action: '클릭', label: decodeURIComponent(evt.currentTarget.href)})
      })
    }

    modal.init(
      document.querySelector('#category-btn'),
      document.querySelector('#modal-category-selector'),
      document.querySelector('#backdrop'),
    )
  });
})();
