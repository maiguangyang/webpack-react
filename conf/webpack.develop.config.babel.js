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
  APP_PATH,
  BUILD_PATH,
  DLL_PATH,
  DLIENT_PORT,
  ASSETS_DIR,
  DISTRICT_PATH,
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
    DISTRICT_PATH,
    DLL_PATH,
  ],
  {
    root      : ROOT_PATH,
    verbose   : true,
    dry       : false,
  })
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
 * 执行DllReferencePlugin，加快编译速度
 */
let DllPluginList = [];
if (process.env.DEVELOP) {
  DllPluginList.push(
    new webpack.DllPlugin({
      path: path.resolve(DLL_PATH, '[name]_manifest.json').replace(/\\/gi, '/'),
      name: '[name]_library'
    })
  )

  if (fs.existsSync(DLL_PATH)) {
    let files = fs.readdirSync(DLL_PATH);
    if (!_.isEmpty(files)) {
      files.forEach(function (path) {
        DllPluginList.push(
          new webpack.DllReferencePlugin({
            manifest: require(`${DLL_PATH}/${path}`)
          })
        )
      })
    }
  }
}


/**
 * webpack
 */
export default {
  devtool: 'eval-source-map',
  entry : ModuleEntry,
  output: {
    path        : DISTRICT_PATH,
    filename    : '[name].[hash:8].js',
  },

  resolve: {
    modules: ['node_modules', 'spritesmith-generated']
  },

  module: ModuleLoaders,

  devServer: {
    contentBase: DISTRICT_PATH,
    port: DLIENT_PORT,
  },

  plugins: [
  ].concat(DllPluginList, happyPackList, HtmlWebpackPluginList)
};
