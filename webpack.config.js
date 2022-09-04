const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    sfxDemo: "./src/sfx/demo.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebPackPlugin({
      name: "index",
      template: "./src/index.html",
      filename: "index.html",
      chunks: ['index']
    }),
    new HtmlWebPackPlugin({
      name: "sfxDemo",
      template: "./src/index.html",
      filename: "sfx.html",
      chunks: ['sfxDemo']
    }),
  ],
  devtool: "source-map",
}