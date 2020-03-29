import TOC from "./TOC";

describe("TOC", () => {
  describe("htmlElementToText", () => {
    let el: HTMLElement;
    beforeEach(() => {
      el = document.createElement("div");
    });
    it("hmlt 요소에서 문자열을 얻는다", () => {
      el.textContent = "title";
      expect(TOC.htmlElementToText(el)).toBe("title");
    });
    it("<, >문자를 &lt;, &gt; 변경한다", () => {
      el.textContent = "<title>";
      expect(TOC.htmlElementToText(el)).toBe("&lt;title&gt;");
    });
  });
});
