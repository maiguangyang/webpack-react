import os                 from  'os'
import fs                 from  'fs'
import path               from 'path';
import _                  from 'lodash';
import webpack            from 'webpack';
import HappyPack          from 'happypack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin  from 'extract-text-webpack-plugin';

import {
  ROOT_PATH,
  SRC_DIR,
  DIST_DIR,
  APP_PATH,
  BUILD_PATH,
  DLL_PATH,
  DLIENT_PORT,
  ASSETS_PATH,
  DOMAIN_MODULES,
  HAPPYPACK_PATH,
}                         from './config';

import {ModuleEntry, ModuleLoaders, HtmlWebpackPluginList} from './webpack.head.config';

const pool = HappyPack.ThreadPool({ size: os.cpus().length })

/**
 * 清除生成的目录路径
 * 每次生成都是新的环境
 */
HtmlWebpackPluginList.push(
  new CleanWebpackPlugin([
    BUILD_PATH,
    DLL_PATH,
  ],
  {
    root      : ROOT_PATH,
    verbose   : true,
    dry       : false,
  })
)

HtmlWebpackPluginList.push(
  new ExtractTextPlugin('[name].[contenthash:8].css')
)

/**
 * HappyPackPluginS
 */

let happyPackList = [];
happyPackList.push(
  new HappyPack({
    id: 'js',
    cache: true,
    threadPool: pool,
    loaders: [{
      path: 'babel-loader',
      query: {
        cacheDirectory: '.webpack_cache',
        presets: [
          'es2015',
          'react'
        ]
      }
    }]
  })
)


/**
 * webpack
 */
export default {
  devtool: 'eval-source-map',
  entry : ModuleEntry,
  output: {
    path        : BUILD_PATH,
    filename    : '[name].[hash:8].js',
  },
  module: ModuleLoaders,
  devServer: {
    port: DLIENT_PORT,
  },

  plugins: [].concat(happyPackList, HtmlWebpackPluginList)
};
