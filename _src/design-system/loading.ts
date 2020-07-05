import './loading.scss';

export default class Loading {
  constructor(el: Element) {
    const loader = document.createElement('div')
    loader.classList.add('loading')
    el.appendChild(loader)
  }
}