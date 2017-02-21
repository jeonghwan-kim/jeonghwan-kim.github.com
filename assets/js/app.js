"use strict";

(function(document) {
  function toggle(target) {
    if (!target) return;
    target.style.display = target.style.display === 'block' ? 'none' : 'block';
  }
  document.addEventListener('DOMContentLoaded', function(e) {
    var ctgyBtn = document.getElementsByClassName('category-menu-icon')[0];
    if (!ctgyBtn) return;
    ctgyBtn.onclick = function() {
      toggle(document.getElementsByClassName('trigger')[0]);
    };
  });
})(document);
