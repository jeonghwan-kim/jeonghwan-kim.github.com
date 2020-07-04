import './modal.scss';

export default class Modal {
  private _backdrop?: Element;

  constructor(public trigger: Element, public modal: Element) {
    this.trigger.addEventListener("click", () => this.showModal());
  }
  
  get backdrop(): Element {
    if (!this._backdrop) {
      this._backdrop = document.createElement('div')
      this._backdrop.classList.add('backdrop')
      this._backdrop.addEventListener("click", () => this.hideModal());
    }
    
    return this._backdrop;
  }
  
  showModal() {
    this.toggleScroll(false)
  
    this.modal.classList.add("show");

    this.backdrop.appendChild(this.modal)
    document.body.appendChild(this.backdrop)
  }

  toggleScroll(flag: boolean) {
    document.body.style.overflowY = flag ? 'auto' : "hidden";    
  }
  
  hideModal() {
    this.toggleScroll(true)

    this.modal.classList.remove("show");
    
    if (this.backdrop) {
      document.body.removeChild(this.backdrop)
    }
  }
}
