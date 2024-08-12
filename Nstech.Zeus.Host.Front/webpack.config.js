const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const DefinePlugin = require('webpack/lib/DefinePlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const dotenv = require('dotenv')

const deps = require("./package.json").dependencies;
const env = dotenv.config().parsed

module.exports = () => ({
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  devServer: {
    port: env.PORT,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, 'src')],
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      process: {
        env: JSON.stringify(env),
      },
    }),
    new ModuleFederationPlugin({
      name: "nstech_zeus_host",
      filename: "remoteEntry.js",
      remotes: {
        '@nstech-zeus-components': env.NSTECH_ZEUS_COMPONENTS,
        '@nstech-zeus-utils': env.NSTECH_ZEUS_UTILS
      },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      favicon: './public/favicon.svg',
      base: `${env.BASE_PATH}/`,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      chunkFilename: '[name].[chunkhash].chunk.css',
    }),
  ],
});
