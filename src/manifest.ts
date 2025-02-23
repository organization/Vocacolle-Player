import { defineManifest } from '@crxjs/vite-plugin';

import packageJson from '../package.json';

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = packageJson.version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/);

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: packageJson.displayName ?? packageJson.name,
  version: `${major}.${minor}.${patch}.${label}`,
  description: packageJson.description,
  background: { service_worker: 'src/pages/background/index.ts' },
  icons: {
    '128': 'icons/128x128.png',
  },
  content_scripts: [
    {
      matches: [
        'http://vocaloid-collection.jp/*',
        'https://vocaloid-collection.jp/*',
        'http://embed.nicovideo.jp/*',
        'https://embed.nicovideo.jp/*',
      ],
      js: ['src/pages/content/index.tsx'],
      all_frames: true,
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'assets/js/*.js',
        'assets/css/*.css',
        'assets/img/*',
        'src/**/*.js',
      ],
      matches: ['*://*/*'],
    },
  ],
}));

export default manifest;
