import ScrollSpy from "./ScrollSpy";
import Loading from "../../design-system/loading";

export default class TOC {
  el: HTMLElement;
  contentEl: HTMLElement;

  constructor(el: HTMLElement, contentEl: HTMLElement) {
    if (!el || !contentEl) throw "el";
    
    this.el = el;
    this.contentEl = contentEl;

    if (!this.headingsInContent().length || !this.html()) {
      this.removeTocEl();
      return;
    }

    new Loading(this.el)

    setTimeout(()=> {
      this.render(this.html());
      new ScrollSpy(this.el, this.headingsInContent() as HTMLElement[]);
    }, 100)
  }

  headingsInContent(): Element[] {
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
      var li = `<li><a href="#${id}" data-target-id="${id}">${TOC.htmlElementToText(
        h as HTMLElement
      )}</a></li>`;

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

  static htmlElementToText(el: HTMLElement): string {
    return (el.textContent || "").replace("<", "&lt;").replace(">", "&gt;");
  }

  removeTocEl() {
    const parent = this.el.parentElement;
    if (!parent) return;

    parent.removeChild(this.el);
    if (!parent.children.length) {
      // HACK: Remnove aside
      if (parent.parentElement) {
        parent.parentElement.removeChild(parent);
        // HACK: Remnove footer aside
        document
          .querySelector(".post-aside")!
          .parentElement!.removeChild(document.querySelector(".post-aside")!);
      }
    }
  }

  render(html: string) {
    this.el.innerHTML = html;
  }
}
