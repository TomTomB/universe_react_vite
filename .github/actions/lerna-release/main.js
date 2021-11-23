// @ts-check

const { execSync } = require('child_process');

try {
  const didRelease = false;

  const stdo = execSync('yarn lerna info');

  console.log(didRelease, stdo.toString());

  process.stdout.write('::set-output name=did-release::' + didRelease + '\r\n');
} catch (e) {
  console.error(e);
  process.exit(1);
}
