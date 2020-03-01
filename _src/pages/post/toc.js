import scrollSpy from "./scroll-spy";

const toc = {
  init(el, contentEl) {
    if (!el || !contentEl) {
      throw el;
    }
    this.el = el;
    this.contentEl = contentEl;

    if (!this.headingsInContent().length || !this.html()) {
      return this.removeTocEl();
    }

    this.render(this.html());
    scrollSpy.init(this.el, this.headingsInContent());
  },

  headingsInContent: function() {
    return Array.from(
      toc.contentEl.querySelectorAll("h1,h2,h3,h4,h5,h6")
    ).filter(h => h.id);
  },

  html: function() {
    var prevHeadingLevel = 0; // 1,2,3,4,5,6
    var html = toc.headingsInContent().map(h => {
      var headingLevel = Number(h.nodeName.toUpperCase().replace("H", ""));
      var html = "";
      var id = h.id;
      var title = h.textContent;
      var li =
        '<li><a href="#' +
        id +
        '" data-target-id="' +
        id +
        '">' +
        title +
        "</a></li>";

      if (prevHeadingLevel < headingLevel) {
        html = "<ul>" + li;
      } else if (prevHeadingLevel === headingLevel) {
        html = li;
      } else {
        var diff = prevHeadingLevel - headingLevel;
        html =
          new Array(diff)
            .fill(1)
            .map(function() {
              return "</ul>";
            })
            .join("") + li;
      }

      prevHeadingLevel = headingLevel;
      return html;
    });

    return html.join("");
  },

  removeTocEl: function() {
    var parent = toc.el.parentElement;
    parent.removeChild(toc.el);
    if (!parent.children.length) {
      // HACK: Remnove aside
      parent.parentElement.removeChild(parent);
      // HACK: Remnove footer aside
      document
        .querySelector(".post-aside")
        .parentElement.removeChild(document.querySelector(".post-aside"));
    }
  },

  render: function(html) {
    this.el.innerHTML = html;
  },

  scrollSpy: function() {
    window.addEventListener("scroll", function onScroll() {
      toc.headingsInContent().forEach(function(h) {
        if (document.documentElement.scrollTop >= h.offsetTop) {
          Array.from(toc.el.querySelectorAll("a")).forEach(function(a) {
            a.classList.remove("active");
          });

          var found = Array.from(toc.el.querySelectorAll("a")).filter(function(
            a
          ) {
            return a.dataset.targetId === h.id;
          })[0];

          if (!found) {
            return;
          }

          found.classList.add("active");
        }
      });
    });
  }
};

export default toc;
