export const $ = (selector: string): Element | null => {
  return document.querySelector<Element>(selector);
}
