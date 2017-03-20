import fs                     from 'fs-extra';
import array                  from 'lodash/array';
import HappyPack              from 'happypack';
import HtmlwebpackPlugin      from 'html-webpack-plugin';
import CleanWebpackPlugin     from 'clean-webpack-plugin';
import ExtractTextPlugin      from 'extract-text-webpack-plugin';
import CopyWebpackPlugin      from 'copy-webpack-plugin';
import SpritesmithTemplate    from 'spritesheet-templates';
import SpritesmithPlugin      from 'webpack-spritesmith';


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
   * 复制项目图片文件
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

  /**
   * 生成项目雪碧图
   */
  const SPRITE_DIR           = `${APP_PATH}/${elem}/assets/sprites/images/`;
  const SPRITE_TEMPLATE_FILE = `${APP_PATH}/${elem}/assets/sprites/sprite.scss.template.handlebars`;

  if (fs.existsSync(SPRITE_DIR) && fs.lstatSync(SPRITE_DIR).isDirectory() && fs.existsSync(SPRITE_TEMPLATE_FILE)) {
    let source = fs.readFileSync(SPRITE_TEMPLATE_FILE, 'utf8');
    SpritesmithTemplate.addHandlebarsTemplate('spriteScssTemplate', source);

    HtmlPluginList.push(
      new SpritesmithPlugin({
        src: {
          cwd : SPRITE_DIR,
          glob: '**/*.{png,gif,jpg}',
        },
        target: {
          image: `${APP_PATH}/${elem}/assets/images/sprite/sprite.png`,
          css  : [
            [
              `${APP_PATH}/${elem}/assets/styles/mixins/_sprite.scss`,
              {
                format: 'spriteScssTemplate',
              }
            ]
          ]
        },
        apiOptions: {
          cssImageRef: '~sprite.png'
        },
        spritesmithOptions: {
          functions : true,
          padding   : 10,
        }
      })
    )
  }

  /**
   * 项目入口文件index.js
   */
  moduleEntryList[`${elem}/assets/${outputFileName}`] = [
    `${APP_PATH}/${elem}/index.js`,
  ];
});

export const ModuleLoaders = {
  rules: [
    {
      test      : /\.(css|scss)$/,
      use       : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        loader  : ['css-loader', 'postcss-loader', 'sass-loader?outputStyle=expanded']
      }),
      include   : APP_PATH
    },
    {
      test      : /\.(png|jpg)$/,
      use       : 'url-loader?limit=10000&name=[hash:8].[name].[ext]'
    },
    {
      test      : /\.(js|jsx)$/,
      use       : ['HappyPack/loader?id=js'],
      exclude   : /node_modules/,
      include   : APP_PATH
    },
    {
      test      : /\.jade$/,
      use       : ['jade-react-loader'],
      include   : APP_PATH
    }
  ],
}


export const ModuleEntry            = moduleEntryList || [];
export const HtmlWebpackPluginList  = HtmlPluginList || [];