import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainModule } from '@angular/ssr/node';
import { existsSync } from 'node:fs';

export function getDistPaths() {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  
  let serverDistFolder = currentDir;
  let browserDistFolder = resolve(serverDistFolder, '../browser');
  
  // Se a pasta browser resolver para um local inexistente (ex: utils/../browser),
  // compensamos subindo um nível para simular a pasta raiz do servidor
  if (!existsSync(browserDistFolder)) {
    const parentDir = resolve(serverDistFolder, '..');
    const candidateBrowser = resolve(parentDir, '../browser');
    
    if (existsSync(candidateBrowser)) {
      serverDistFolder = parentDir;
      browserDistFolder = candidateBrowser;
    } else {
      // Fallback padrão de desenvolvimento
      serverDistFolder = parentDir;
      browserDistFolder = resolve(serverDistFolder, '../browser');
    }
  }
  
  console.log('SSR COMPAT RESOLVED PATHS:', { serverDistFolder, browserDistFolder });
  
  return { serverDistFolder, browserDistFolder };
}

export function isMain() {
  return isMainModule(import.meta.url);
}
