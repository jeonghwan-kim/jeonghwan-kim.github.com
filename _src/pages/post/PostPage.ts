import GATracker from "./GATracker";
import Page from "../Page";
import TOC from "./TOC";

export default class PostPage extends Page {
  onMount() {
    try {
      this.initTOC();
      this.initVideo();
    } catch (err) {
      console.error(err);
    }
  }

  initTOC() {
    const tocEl = document.querySelector("#toc");
    const contentEl = document
      .querySelector("#post")
      .querySelector(".post-content");

    new TOC(tocEl, contentEl);
  }

  initVideo() {
    const postVideo = document.querySelector("#post-video");
    if (postVideo) {
      postVideo.addEventListener("click", e => {
        GATracker.sendEvent(
          "포스트/관련영상",
          "click",
          decodeURIComponent(e.currentTarget.href)
        );
        e.currentTarget.href;
      });
    }
  }
}
