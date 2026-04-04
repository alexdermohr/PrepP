import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || 'dev';

function versionPlugin() {
  return {
    name: 'version-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/version.json') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.end(JSON.stringify({ version: commitSha }));
        } else {
          next();
        }
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: commitSha })
      });
    }
  };
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(commitSha)
  },
  plugins: [versionPlugin()],
  server: {
    fs: {
      allow: [
        here,
        resolve(here, '../docs'),
        resolve(here, '../meta'),
        resolve(here, '../models')
      ]
    }
  }
});
