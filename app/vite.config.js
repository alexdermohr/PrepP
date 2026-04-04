import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    fs: {
      allow: [here, resolve(here, '../docs'), resolve(here, '../meta'), resolve(here, '../models')]
    }
  }
});
