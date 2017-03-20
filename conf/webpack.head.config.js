import array              from 'lodash/array';
import HappyPack          from 'happypack';
import HtmlwebpackPlugin  from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin  from 'extract-text-webpack-plugin';
import CopyWebpackPlugin  from 'copy-webpack-plugin';

import {
  ROOT_PATH,
  APP_PATH,
  BUILD_PATH,
  ASSETS_DIR,
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
    filename      : `${elem}/${outputFileName}.html`,
    excludeChunks : array.without(moduleList, elem),
    chunks        : [`${elem}/assets/${outputFileName}`],
  }));

  /**
   * 抽取Css
   */
  HtmlPluginList.push(
    new ExtractTextPlugin(`[name].[contenthash:8].css`)
  )

  /**
   * 复制文件
   */
  HtmlPluginList.push(
    new CopyWebpackPlugin([
      {
        from    : `${APP_PATH}/${elem}/assets/images/**`,
        to      : `${elem}/assets/images/`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    })
  )


  moduleEntryList[`${elem}/assets/${outputFileName}`] = [
    `${APP_PATH}/${elem}/index.js`,
  ];
});


export const ModuleLoaders = {
  rules: [
    {
      test: /\.(css|scss)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        loader: ['css-loader', 'postcss-loader', 'sass-loader?outputStyle=expanded']
      }),
      include  : APP_PATH
    },
    {
      test    : /\.(png|jpg)$/,
      use : 'url-loader?limit=10000'
    },
    {
      test    : /\.(js|jsx)$/,
      use     : ['HappyPack/loader?id=js'],
      exclude : /node_modules/,
      include  : APP_PATH
    },
    {
      test     : /\.jade$/,
      use  : ['jade-react-loader'],
      include  : APP_PATH
    }
  ],
}


export const ModuleEntry            = moduleEntryList || [];
export const HtmlWebpackPluginList  = HtmlPluginList || [];