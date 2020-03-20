export default class ScrollSpy {
  menus: HTMLElement[];
  refs: HTMLElement[];

  constructor(menuElements: HTMLElement, refs: HTMLElement[]) {
    this.menus = Array.from(menuElements.querySelectorAll("a"));
    this.refs = refs;

    window.addEventListener("scroll", () => this.onScroll());
  }

  onScroll() {
    var firstEl = this.refs[0];
    if (document.documentElement.scrollTop - firstEl.offsetTop < -10) {
      this.removeClassAll();
    }

    this.refs.forEach(ref => {
      if (document.documentElement.scrollTop - ref.offsetTop >= -10) {
        this.removeClassAll();
        this.findRefAndAddClass(ref.id, "active");
      }
    });
  }

  removeClassAll() {
    this.menus.forEach(function(a) {
      a.classList.remove("active");
    });
  }

  findRefAndAddClass(id: string, className: string) {
    const found = this.menus.filter(a => a.dataset.targetId === id)[0];
    if (found) found.classList.add(className);
  }
}
