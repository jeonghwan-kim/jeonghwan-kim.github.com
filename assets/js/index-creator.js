document.addEventListener('DOMContentLoaded', onload);

function onload() {
  console.log('index-creator')

  const el = document.querySelector('#post').querySelector('.post-content')
  if (!el) return;

  const headings = el.querySelectorAll('h1,h2,h3,h4,h5,h6');
  if (!headings.length) return;

  let prevHeadingLevel = 0 // 1, 2, 3,4,5,6
  const html = Array.from(headings).map(h => {
    const headingLevel = Number(h.nodeName.toUpperCase().replace('H', ''));
    let html = ''
    if (prevHeadingLevel < headingLevel) 
      html = `<ul><li><a href="#${h.id}">${h.textContent}</a></li>`
    else if (prevHeadingLevel === headingLevel) 
      html = `<li><a href="#${h.id}">${h.textContent}</a></li>`
    else {
      const diff = prevHeadingLevel - headingLevel

      html = `${new Array(diff).fill(1).map(_=> '</ul>').join('')}<li><a href="#${h.id}">${h.textContent}</a></li>`
    }

    prevHeadingLevel = headingLevel;
    return html;

  });

  console.log('html', html.join(''))
  document.querySelector('#post-index').innerHTML = html.join('');
}

