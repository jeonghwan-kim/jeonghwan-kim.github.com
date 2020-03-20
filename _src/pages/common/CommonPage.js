import Modal from "../../design-system/modal";
import Page from "../Page";

export default class CommonPage extends Page {
  onMount() {
    new Modal(
      document.querySelector("#category-btn"),
      document.querySelector("#modal-category-selector"),
      document.querySelector("#backdrop")
    );
  }
}
