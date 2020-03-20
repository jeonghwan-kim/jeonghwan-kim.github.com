const path = require("path");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    common: "./_src/pages/common/index.ts",
    post: "./_src/pages/post/index.ts"
  },
  output: {
    path: path.resolve("_site/assets"),
    filename: "js/[name].min.js",
    publicPath: "/assets"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  devServer: {
    contentBase: path.resolve("_site"),
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(ts|js)$/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [new MiniCSSExtractPlugin({ filename: "css/[name].min.css" })]
};
