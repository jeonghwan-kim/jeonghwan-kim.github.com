export default class ScrollSpy {
  public targets: HTMLElement[];
  public refs: HTMLElement[];
  public sensitivity: number

  constructor(target: HTMLElement, refs: HTMLElement[], sensitivity?: number) {
    this.targets = Array.from(target.querySelectorAll("a"));
    this.refs = refs;
    this.sensitivity = sensitivity || -10;

    window.addEventListener("scroll", () => this.onScroll());
  }

  onScroll() {
    if (!this.isOnTopOfDoc(this.refs[0])) {
      this.deactiveateTarget();
    }

    this.refs.forEach(ref => {
      if (this.isOnTopOfDoc(ref)) {
        this.deactiveateTarget();
        const t = this.findTarget(ref.id);
        if (t) this.activate(t);
      }
    });
  }

  isOnTopOfDoc(ref: HTMLElement): boolean {
    return document.documentElement.scrollTop - ref.offsetTop >= this.sensitivity;
  }

  deactiveateTarget() {
    this.targets.forEach(a => this.deactivate(a))
  }

  findTarget(id: string): HTMLElement | undefined {
    return this.targets.filter(a => a.dataset.targetId === id)[0];
  }

  activate(el: HTMLElement) {
    el.classList.add("active")
  }

  deactivate(el: HTMLElement) {
    el.classList.remove("active")
  }
}
