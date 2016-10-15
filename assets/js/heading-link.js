/**
 * headings에 내부 링크를 생성
 *
 * @param document 문서 최상단 클래스명 (post-content)
 * @param headings 헤딩 태그명 (예: "h2")
 */
function headingLink(documentClassName, headingTagName) {
  documentClassName = documentClassName.replace('.', '');

  var doc = document.getElementsByClassName(documentClassName)[0],
      headings = doc.getElementsByTagName(headingTagName),
      i,
      h,
      len = headings.length;

  for (i = 0; i < len; i++) {
    h = headings[i];
    h.innerHTML = '<a class="heading-link" style="float:left; margin-left:-20px; padding-right:7px; display:none;"  href="#' + h.id + '">#</a>'
        + h.textContent;

    h.addEventListener('mouseover', (function (h) {
      return function () {
        h.getElementsByTagName('a')[0].style.display = 'block';
      };
    })(h));


    h.addEventListener('mouseout', (function (h) {
      return function () {
        h.getElementsByTagName('a')[0].style.display = 'none';
      }
    })(h));

  }
}
