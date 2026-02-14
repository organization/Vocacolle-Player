import * as fs from 'fs';
import * as path from 'path';
import { PluginOption } from 'vite';

import colorLog from '../log';
import manifest from '../../src/manifest';

const outDir = path.resolve(__dirname, '..', '..', 'public');

export default function makeManifest(): PluginOption {
  return {
    name: 'make-manifest',
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }

      const manifestPath = path.resolve(outDir, 'manifest.json');

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

      colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
    },
  };
}
