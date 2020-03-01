export default class Modal {
  constructor(triggerEl, modalEl, backdropEl) {
    this.triggerEl = triggerEl;
    this.modalEl = modalEl;
    this.backdropEl = backdropEl;

    this.triggerEl.addEventListener("click", this.showModal.bind(this));
  }
  showModal() {
    document.body.style.overflowY = "hidden";
    this.modalEl.classList.remove("hidden");
    this.backdropEl.classList.remove("hidden");
    this.backdropEl.addEventListener("click", this.hideModal.bind(this));
  }
  hideModal() {
    document.body.style.overflowY = "auto";
    this.backdropEl.classList.add("hidden");
    this.modalEl.classList.add("hidden");
  }
}
