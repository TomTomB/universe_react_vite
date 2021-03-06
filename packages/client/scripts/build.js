#!/usr/bin/env node
// @ts-check

const { build } = require('vite');
const { dirname } = require('path');
const path = require('path');

// The script gets started from packages/client/main
const packagesPath = path.resolve(__dirname, '../..');

/** @type 'production' | 'development' */
const mode = (process.env.MODE = process.env.MODE || 'production');

const packagesConfigs = [
  `${packagesPath}/client/main/vite.config.js`,
  `${packagesPath}/client/preload/vite.config.js`,
  `${packagesPath}/client/renderer/vite.config.js`,
];

const buildSplash = () => {
  const { copySync } = require('fs-extra');

  copySync(
    path.resolve(packagesPath, 'client/splash'),
    path.resolve(packagesPath, '../dist/client/splash'),
    { recursive: true },
  );
};

/**
 * Run `vite build` for config file
 * @param {string} configFile
 */
const buildByConfig = (configFile) => build({ configFile, mode });
(async () => {
  try {
    const totalTimeLabel = 'Total bundling time';
    console.time(totalTimeLabel);

    buildSplash();

    for (const packageConfigPath of packagesConfigs) {
      const consoleGroupName = `${dirname(packageConfigPath)}/`;
      console.group(consoleGroupName);

      const timeLabel = 'Bundling time';
      console.time(timeLabel);

      await buildByConfig(packageConfigPath);

      console.timeEnd(timeLabel);
      console.groupEnd();
      console.log('\n'); // Just for pretty print
    }
    console.timeEnd(totalTimeLabel);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
