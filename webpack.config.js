"use strict";

const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");

const baseConfig = {
  devtool: "source-map",
  mode: "production",

  entry: "./src/game-engine.ts",
  optimization: {
    usedExports: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "[name].bundle.js",
  },
};

const nodeTarget = {
  target: "node",
  output: {
    filename: "game-engine.node.js",
    libraryTarget: "commonjs2",
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      "process.env.PLATFORM": JSON.stringify("node"),
    }),
  ],
};

const webTarget = {
  node: false,
  output: {
    filename: "game-engine.browser.js",
    libraryTarget: "umd",
    library: "RunoX-engine",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.PLATFORM": JSON.stringify("browser"),
    }),
  ],
};

module.exports = [
  webpackMerge(baseConfig, webTarget),
  webpackMerge(baseConfig, nodeTarget),
];
