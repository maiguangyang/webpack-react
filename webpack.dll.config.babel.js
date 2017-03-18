import _                  from 'lodash';
import fs                 from 'fs';
import path               from 'path';
import webpack            from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

import {
  APP_PATH,
  ROOT_PATH,
  BUILD_PATH,
  DLL_PATH
}                         from './conf/config';

import {
  ModuleEntry,
  ModuleLoaders,
  HtmlWebpackPluginList
}                         from './conf/webpack.head.config';


/**
 * 清除生成的目录路径
 * 每次生成都是新的环境
 */
HtmlWebpackPluginList.push(
  new CleanWebpackPlugin([
    DLL_PATH
  ],
  {
    root      : ROOT_PATH,
    verbose   : true,
    dry       : false,
  })
)


/**
 * 执行DllReferencePlugin，加快编译速度
 */
let DllPluginList = [];
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


export default {
  devtool: 'eval-source-map',
  entry : ModuleEntry,
  output: {
    path        : BUILD_PATH,
    filename    : '[name].[hash:8].js',
  },
  module: ModuleLoaders,
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(DLL_PATH, '[name]_manifest.json').replace(/\\/gi, '/'),
      name: '[name]_library'
    }),
  ].concat(HtmlWebpackPluginList)
}