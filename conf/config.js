import path from 'path';

export const DLIENT_PORT     = 1988;
export const DOMAIN_MODULES  = [
  {
    domain  : 'www.myreact.com',
    cdn     : 'cdn.myreact.com',
    path    : 'www',
  }
];

export const SRC_DIR        = 'src';
export const APP_DIR        = 'app';
export const LOG_DIR        = 'logs';
export const TEST_DIR       = 'test';

export const DEV_DIR        = '.dist';
export const DIST_DIR       = 'dist';
export const ASSETS_DIR     = 'assets';

export const BUILD_DIR      = 'build';

export const ROOT_PATH      = path.join(__dirname, '../').replace(/\\/gi, '/');
export const APP_PATH       = path.resolve(ROOT_PATH, SRC_DIR, APP_DIR).replace(/\\/gi, '/');
export const BUILD_PATH     = path.join(ROOT_PATH, BUILD_DIR).replace(/\\/gi, '/');

export const DISTRICT_PATH  = path.join(ROOT_PATH, process.env.DEVELOP ? DEV_DIR : DIST_DIR).replace(/\\/gi, '/');
export const ASSETS_PATH    = path.join(DISTRICT_PATH, ASSETS_DIR).replace(/\\/gi, '/');
export const LOG_PATH       = path.join(ROOT_PATH, LOG_DIR).replace(/\\/gi, '/');

