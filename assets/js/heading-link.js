function headingLink(document, headings) {
  var headings = $(document).find(headings[0])
  $.each(headings, function (idx, heading) {
    $(heading).prepend('<a class="heading-link" style="left: float; margin-left: -20px; padding-right: 7px; display: none;" href="#' + heading.id + '">#</a>')
    $(heading).hover(function () {
      $($(heading).find('a')[0]).css('display', 'inline-block');
    }, function () {
      $($(heading).find('a')[0]).css('display', 'none');
    });
  });
}

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
