export default abstract class Page {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => this.onMount());
  }

  abstract onMount(): void;
}
