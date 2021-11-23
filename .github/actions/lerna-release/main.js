// @ts-check

const { execSync } = require('child_process');

const cwd = process.cwd();

try {
  const didRelease = false;

  // load lerna.json sync
  const lernaJson = require(`${cwd}/lerna.json`);

  const stdo = execSync('ls');

  console.log(didRelease, lernaJson);

  process.exit(1);

  process.stdout.write('::set-output name=did-release::' + didRelease + '\r\n');
} catch (e) {
  console.error(e);
  process.exit(1);
}
