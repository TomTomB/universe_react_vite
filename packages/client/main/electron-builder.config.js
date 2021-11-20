const path = require('path');

if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date();
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${
    now.getUTCMonth() + 1
  }.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

const DIST_PATH = path.resolve(__dirname, '..', '..', '..', 'dist');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
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
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
};

module.exports = config;
