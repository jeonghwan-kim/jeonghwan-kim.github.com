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
