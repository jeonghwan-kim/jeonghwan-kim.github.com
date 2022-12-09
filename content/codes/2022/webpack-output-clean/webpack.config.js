const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),

    /** 이전 빌드를 완전히 삭제한다 */
    // clean: true,

    /** 삭제하지 않고 유지할 파일을 직접 지정한다 */
    // clean: {
    //   keep: (filename) => {
    //     console.log("debug", filename);
    //     return filename === "삭제되지_말아야할_파일";
    //   },
    // },

    /** 삭제할 파일을 표시만 한다 */
    // clean: {
    //   dry: true,
    // },
  },
}
