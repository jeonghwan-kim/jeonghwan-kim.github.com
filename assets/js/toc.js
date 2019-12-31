(function() {
  'use strict';

  var toc = {
    init(el, contentEl) {
      if (!el || !contentEl) {
        throw el
      }
      this.el = el;
      this.contentEl = contentEl;

      if (!this.headingsInContent().length || !this.html()) {
        return this.removeTocEl();
      }

      this.render(this.html());
      this.scrollSpy();
    },

    headingsInContent: function() {
      return Array.from(toc.contentEl.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    },

    html: function() {
      var prevHeadingLevel = 0 // 1,2,3,4,5,6
      var html = toc.headingsInContent().map(h => {
        var headingLevel = Number(h.nodeName.toUpperCase().replace('H', ''));
        var html = '';
        var id = h.id;
        var title = h.textContent;
        var li = '<li><a href="#' + id + '" data-target-id="' + id + '">' + title + '</a></li>';

        if (prevHeadingLevel < headingLevel) {
          html = '<ul>' + li;
        } else if (prevHeadingLevel === headingLevel) {
          html = li;
        } else {
          var diff = prevHeadingLevel - headingLevel;
          html = new Array(diff).fill(1).map(function() { return '</ul>'; }).join('') + li;
        }
    
        prevHeadingLevel = headingLevel;
        return html;
      });
      
      return html.join('');
    },

    removeTocEl: function () {
      toc.el.parentElement.removeChild(toc.el)
    },

    render: function(html) {
      this.el.innerHTML = html;
    },

    scrollSpy: function() {
      window.addEventListener('scroll', function onScroll(evt) {
        toc.headingsInContent().forEach(function(h) {
          if (document.documentElement.scrollTop >= h.offsetTop) {
            Array.from(toc.el.querySelectorAll('a')).forEach(function (a) {
              a.classList.remove('active')
            })
  
            var found = Array.from(toc.el.querySelectorAll('a')).filter(function(a) {
              return a.dataset.targetId === h.id
            })[0];

            if (!found) {
              return;
            }

            found.classList.add('active');
          }
        })
      })
    }
  };

  document.addEventListener('DOMContentLoaded', function onload() {
    try {
      toc.init(
        document.querySelector('#toc'),
        document.querySelector('#post').querySelector('.post-content'),
      );
    } catch(err) {
      console.error(err);
      return removeTocEl();
    }   
  });
})();

