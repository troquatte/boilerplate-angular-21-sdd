import { resolve } from 'node:path';

export function getDistPaths() {
  const serverDistFolder = __dirname;
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  return { serverDistFolder, browserDistFolder };
}

export function isMain() {
  return false;
}
