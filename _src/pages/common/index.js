import Modal from "../../design-system/modal";
import "../../sass/main.scss";

const onload = () => {
  new Modal(
    document.querySelector("#category-btn"),
    document.querySelector("#modal-category-selector"),
    document.querySelector("#backdrop")
  );
};

document.addEventListener("DOMContentLoaded", onload);
