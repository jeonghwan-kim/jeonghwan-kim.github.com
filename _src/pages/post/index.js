import toc from "./toc";

const onload = () => {
  try {
    var tocEl = document.querySelector("#toc");
    var contentEl = document
      .querySelector("#post")
      .querySelector(".post-content");

    toc.init(tocEl, contentEl);
  } catch (err) {
    console.error(err);
    return toc.removeTocEl();
  }
};

console.log("post");
document.addEventListener("DOMContentLoaded", onload);
