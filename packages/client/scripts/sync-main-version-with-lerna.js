// @ts-check
const lernaJson = require('../../../lerna.json');
const mainPackageJson = require('../main/package.json');
const { writeFileSync } = require('fs-extra');

// This is needed because electron-builder uses the version inside main package.json
// to determine if a new version should be published.
// The version inside main package.json may not be the same as the version in lerna.json
(async () => {
  const currentVersion = lernaJson.version;

  mainPackageJson.version = currentVersion;

  writeFileSync(
    'packages/client/main/package.json',
    JSON.stringify(mainPackageJson, null, 2),
  );

  console.log(`Updated main package.json to ${currentVersion}`);
})();
