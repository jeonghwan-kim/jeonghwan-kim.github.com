export default class Page {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => this.onMount());
  }

  onMount() {
    throw "implement!";
  }
}
