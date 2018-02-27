const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const proxyMiddleware = require('http-proxy-middleware');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

fs.open('./build/env.js', 'w', function(err, fd) {
	const buf = 'export default "development";';
	fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
	devtool: '#source-map',
	output: {
		publicPath: '/dist/',
		filename: '[name].js',
		chunkFilename: '[name].chunk.js'
	},
	devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
		port: 3001,
		disableHostCheck: true,
		host: "0.0.0.0",
    proxy: {
      '/uaa':{
        target: 'http://10.100.21.163:8040',
        changeOrigin: true
			},
			'/sys':{
        target: 'http://10.100.21.163:8040',
        changeOrigin: true
			},
			'/poc':{
        target: 'http://10.100.21.163:8040',
        changeOrigin: true
      },
      '/api':{
        target: 'http://localhost:8889',
        changeOrigin: true
			}
    }
  },
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['vender-exten', 'vender-base'],
			minChunks: Infinity
		}),
		new HtmlWebpackPlugin({
			title: '零售信贷管理系统',
			filename: '../index.html',
			template: './src/template/index.ejs',
			inject: false
		}),
		new CopyWebpackPlugin([
			{
				from: 'src/views/main-components/theme-switch/theme'
			},
			{
				from: 'src/views/my-components/text-editor/tinymce'
			}
		], {
			ignore: [
				'text-editor.vue'
			]
		})
	]
});