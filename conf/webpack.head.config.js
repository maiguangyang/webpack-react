import array              from 'lodash/array';
import HappyPack          from 'happypack';
import HtmlwebpackPlugin  from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin  from 'extract-text-webpack-plugin';

import {
  ROOT_PATH,
  APP_PATH,
  BUILD_PATH,
  DOMAIN_MODULES
}                         from './config';

let moduleEntryList       = {};
let HtmlPluginList = [];
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
  HtmlPluginList.push(new HtmlwebpackPlugin({
    template      : `${APP_PATH}/${elem}/${outputFileName}.html`,
    inject        : 'body',
    filename      : `${elem}.html`,
    excludeChunks : array.without(moduleList, elem),
    chunks        : [`${elem}`],
  }));

  moduleEntryList[`${elem}`] = [
    `${APP_PATH}/${elem}/index.js`,
  ];
});


export const ModuleLoaders = {
  loaders: [
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader?outputStyle=expanded']
      })
    },
    {
      test    : /\.(png|jpg)$/,
      loaders : 'url-loader?limit=10000'
    },
    {
      test    : /\.(js|jsx)$/,
      use     : ['HappyPack/loader?id=js'],
      exclude : /node_modules/,
    },
  ],
}


export const ModuleEntry            = moduleEntryList || [];
export const HtmlWebpackPluginList  = HtmlPluginList || [];