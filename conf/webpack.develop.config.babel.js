import array              from 'lodash/array';
import HtmlwebpackPlugin  from 'html-webpack-plugin';

import {
  APP_PATH,
  BUILD_PATH,
  DLIENT_PORT,
  ASSETS_PATH,
  DOMAIN_MODULES
}                         from './config';


let moduleEntry           = {};
let HtmlWebpackPluginList = [];
let moduleList            = [];
let outputFileName        = 'index';

DOMAIN_MODULES.forEach((elem) => {
  if ('' != elem.path) {
    moduleList.push(elem.path);
  }
});

/**
 * 打包每个域根目录下面的html和js文件
 * src/app/www/index.html  index.js
 */
moduleList.forEach(function (elem) {
  HtmlWebpackPluginList.push(new HtmlwebpackPlugin({
    template      : `${APP_PATH}/${elem}/${outputFileName}.html`,
    inject        : 'body',
    filename      : `${outputFileName}.html`,
    excludeChunks : array.without(moduleList, elem),
    chunks        : [`${outputFileName}`],
  }));

  moduleEntry[`${outputFileName}`] = [
    `${APP_PATH}/${elem}/index.js`,
  ];
});


/**
 * webpack
 */
export default {
  entry : moduleEntry,
  output: {
    path        : BUILD_PATH,
    filename    : '[name].[hash].js',
  },

  module: {
    loaders: [
      {
        test    : /\.scss$/,
        loaders : ['style-loader', 'css-loader', 'sass-loader'],
        include : APP_PATH
      },
      {
        test    : /\.(png|jpg)$/,
        loaders : 'url-loader?limit=10000'
      }
    ]
  },

  devServer: {
    port: DLIENT_PORT,
  },

  plugins: [].concat(HtmlWebpackPluginList),
};
