const path = require('path');
const DIST_PATH = path.resolve(__dirname, '..', '..', '..', 'dist');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  productName: 'Universe',
  appId: 'digital.bornholdt.Universe',
  publish: {
    provider: 'github',
    owner: 'TomTomB',
    repo: 'universe',
    releaseType: 'release',
  },
  directories: {
    output: '../../../dist/client/bin',
    buildResources: 'buildResources',
  },
  files: [
    'package.json',
    {
      from: `${DIST_PATH}/client/main`,
      to: 'dist',
      filter: ['**/*'],
    },
    {
      from: `${DIST_PATH}/client/preload`,
      to: 'dist/preload',
      filter: ['**/*'],
    },
    {
      from: `${DIST_PATH}/client/splash`,
      to: 'dist/splash',
      filter: ['**/*'],
    },
    {
      from: `${DIST_PATH}/client/renderer`,
      to: 'dist/renderer',
      filter: ['**/*'],
    },
  ],
};

module.exports = config;
