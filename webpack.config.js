
// const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // mode: 'development',
  // devtool: 'eval',
  // optimization: {
  //   minimizer: [
  //     new TerserPlugin({
  //       sourceMap: true,
  //       terserOptions: {
  //         keep_fnames: true
  //       }
  //     })
  //   ]
  // },
  output: {
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: [
          /node_modules[/\\]mqtt[/\\]mqtt.js/,
          /node_modules[/\\]mqtt[/\\]bin[/\\]sub.js/,
          /node_modules[/\\]mqtt[/\\]bin[/\\]pub.js/,
        ],
        use: ['babel-loader', 'shebang-loader']
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
