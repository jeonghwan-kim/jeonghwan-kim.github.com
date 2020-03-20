const path = require("path");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: {
    common: "./_src/pages/common/index.ts",
    post: "./_src/pages/post/index.ts"
  },
  output: {
    path: path.resolve("assets"),
    filename: "js/[name].min.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.(ts|js)$/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [new MiniCSSExtractPlugin({ filename: "css/[name].min.css" })]
};
