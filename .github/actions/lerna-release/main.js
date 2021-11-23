// @ts-check

const { execSync } = require('child_process');
const { writeFileSync } = require('fs');

const cwd = process.cwd();

try {
  const didRelease = false;

  // load lerna.json sync
  const lernaJson = require(`${cwd}/lerna.json`);

  // update version
  const version = lernaJson.version;
  const versionAfter = `${version}-pre`;
  lernaJson.version = versionAfter;

  // write lerna.json sync
  writeFileSync(`${cwd}/lerna.json`, JSON.stringify(lernaJson, null, 2));

  const lernaJsonAfter = require(`${cwd}/lerna.json`);

  const stdo = execSync('ls');

  console.log(lernaJson, lernaJsonAfter);

  process.exit(1);

  process.stdout.write('::set-output name=did-release::' + didRelease + '\r\n');
} catch (e) {
  console.error(e);
  process.exit(1);
}
