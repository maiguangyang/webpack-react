import path from 'path';

export const DLIENT_PORT     = 1988;
export const DOMAIN_MODULES  = [
  {
    domain  : 'www.myreact.com',
    cdn     : 'cdn.myreact.com',
    path    : 'www',
  },
  {
    domain  : 'admin.myreact.com',
    cdn     : 'cdn1.myreact.com',
    path    : 'admin',
  }
];

export const SRC_DIR        = 'src';
export const APP_DIR        = 'app';
export const LOG_DIR        = 'logs';
export const TEST_DIR       = 'test';
export const Dll_DIR        = 'dll_src';
export const HAPPYPACK_DIR  = '.happpack';

export const DEV_DIR        = '.dist';
export const DIST_DIR       = 'dist';
export const ASSETS_DIR     = 'assets';

export const BUILD_DIR      = 'build';

export const ROOT_PATH      = path.join(__dirname, '../');
export const APP_PATH       = path.resolve(ROOT_PATH, SRC_DIR, APP_DIR);
export const BUILD_PATH     = path.join(ROOT_PATH, BUILD_DIR);

export const DLL_PATH       = path.join(ROOT_PATH, Dll_DIR);
export const HAPPYPACK_PATH = path.join(ROOT_PATH, HAPPYPACK_DIR);

export const DISTRICT_PATH  = path.join(ROOT_PATH, process.env.DEVELOP ? DEV_DIR : DIST_DIR);
export const ASSETS_PATH    = path.join(DISTRICT_PATH, ASSETS_DIR);
export const LOG_PATH       = path.join(ROOT_PATH, LOG_DIR);

