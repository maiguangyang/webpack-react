import path from 'path';

export const DOMAIN_MODULES  = [
  {
    type    : 'domain',
    domain  : 'www.myreact.com',
    port    : 1988
  },
  {
    type    : 'cdn',
    domain  : 'cdn.myreact.com',
    port    : 1989
  }
];

export const SRC_DIR        = 'src';
export const APP_DIR        = 'app';
export const LOG_DIR        = 'logs';
export const TEST_DIR       = 'test';

export const DEV_DIR        = 'dist';
export const DIST_DIR       = '.dist';
export const ASSETS_DIR     = 'assets';

export const ROOT_PATH      = path.join(__dirname, '../').replace(/\\/gi, '/');
export const DISTRICT_PATH  = path.join(ROOT_PATH, process.env.DEVELOP ? DEV_DIR : DIST_DIR).replace(/\\/gi, '/');
export const LOG_PATH       = path.join(ROOT_PATH, LOG_DIR);
export const ASSETS_PATH    = path.join(DISTRICT_PATH, ASSETS_DIR).replace(/\\/gi, '/');