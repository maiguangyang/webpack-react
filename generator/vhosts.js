
import _                    from 'lodash';
import fs                   from 'fs-extra';
import path                 from 'path';
import colors               from 'colors';
import handlebars           from 'handlebars';
import {
  DOMAIN_MODULES,
  DLIENT_PORT,
  DISTRICT_PATH,
  ROOT_PATH,
  BUILD_PATH,
  ASSETS_PATH,
  LOG_PATH
}                           from '../conf/config';

handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
  let operators;
  let result;

  if (3 > arguments.length) {
    throw new Error('Handlerbars Helper "compare" needs 2 parameters');
  }

  if (undefined === options) {
    options  = rvalue;
    rvalue   = operator;
    operator = '===';
  }

  operators = {
    '==' (l, r) {
      return l == r;
    },
    '===' (l, r) {
      return l === r;
    },
    '!=' (l, r) {
      return l != r;
    },
    '!==' (l, r) {
      return l !== r;
    },
    '<' (l, r) {
      return l < r;
    },
    '>' (l, r) {
      return l > r;
    },
    '<=' (l, r) {
      return l <= r;
    },
    '>=' (l, r) {
      return l >= r;
    },
    'typeof' (l, r) {
      return typeof l == r;
    },
  };

  if (!operators[operator]) {
    throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`);
  }

  result = operators[operator](lvalue, rvalue);
  return result ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('domain', function (value) {
  if (_.isString(value)) {
    return value;
  }

  if (_.isArray(value)) {
    return value.join(' ');
  }
});


const TMPL_FILE   = path.join(ROOT_PATH, 'generator/templates/vhosts/nginx.conf.hbs');
const OUTPUT_FILE = path.join(ROOT_PATH, 'vhosts/nginx.conf');

let template = fs.readFileSync(TMPL_FILE, 'utf-8');
let fn       = handlebars.compile(template);

let exists = [];
let datas  = DOMAIN_MODULES
.filter((row) => {
  if (-1 !== _.indexOf(exists, row.domain)) {
    console.error(`Module ${row.domain} is already exists.`.red);
    return false;
  }

  if (!_.isString(row.domain)) {
    console.error('Module domain must be a string or array'.red);
    return false;
  }

  exists.push(row.domain);
  return true;
})
.map((row) => {
  if (_.isArray(row.entries)) {
    return Object.assign({}, row, {
      division: row.entries.join('|'),
    });
  }

  return row;
});

fs.ensureDirSync(LOG_PATH);

let source = fn({
  proxyPort : DLIENT_PORT,
  buildDir  : DISTRICT_PATH.replace(/\\/gi, '/'),
  assetsDir : DISTRICT_PATH.replace(/\\/gi, '/'),
  logsDir   : LOG_PATH.replace(/\\/gi, '/'),
  modules   : datas,
});

fs.ensureDir(OUTPUT_FILE.replace(path.basename(OUTPUT_FILE), ''));
fs.writeFileSync(OUTPUT_FILE, source);

console.log(`Nginx config file ${OUTPUT_FILE} is generated successfully`.green);
console.log('Remember reload/restart yr nginx server.'.yellow);