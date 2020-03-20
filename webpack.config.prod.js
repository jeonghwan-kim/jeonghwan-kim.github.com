const path = require("path");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: {
    common: "./_src/pages/common/index.js",
    post: "./_src/pages/post/index.js"
  },
  output: {
    path: path.resolve("assets"),
    filename: "js/[name].min.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [new MiniCSSExtractPlugin({ filename: "css/[name].min.css" })]
};
