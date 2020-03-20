import ScrollSpy from "./ScrollSpy";

export default class TOC {
  constructor(el, contentEl) {
    if (!el || !contentEl) throw "el";

    this.el = el;
    this.contentEl = contentEl;

    if (!this.headingsInContent().length || !this.html())
      return this.removeTocEl();

    this.render(this.html());

    new ScrollSpy(this.el, this.headingsInContent());
  }

  headingsInContent() {
    return Array.from(
      this.contentEl.querySelectorAll("h1,h2,h3,h4,h5,h6")
    ).filter(h => h.id);
  }

  html() {
    let prevHeadingLevel = 0; // 1,2,3,4,5,6
    let html = this.headingsInContent().map(h => {
      const headingLevel = Number(h.nodeName.toUpperCase().replace("H", ""));
      let html = "";
      const id = h.id;
      const title = h.textContent;
      var li = `<li><a href="#${id}" data-target-id="${id}">${title}</a></li>`;

      if (prevHeadingLevel < headingLevel) {
        html = "<ul>" + li;
      } else if (prevHeadingLevel === headingLevel) {
        html = li;
      } else {
        const diff = prevHeadingLevel - headingLevel;
        html =
          new Array(diff)
            .fill(1)
            .map(() => "</ul>")
            .join("") + li;
      }

      prevHeadingLevel = headingLevel;
      return html;
    });

    return html.join("");
  }

  removeTocEl() {
    const parent = this.el.parentElement;
    parent.removeChild(this.el);
    if (!parent.children.length) {
      // HACK: Remnove aside
      parent.parentElement.removeChild(parent);
      // HACK: Remnove footer aside
      document
        .querySelector(".post-aside")
        .parentElement.removeChild(document.querySelector(".post-aside"));
    }
  }

  render(html) {
    this.el.innerHTML = html;
  }
}
