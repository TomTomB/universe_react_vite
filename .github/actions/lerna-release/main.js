// @ts-check

const { execSync } = require('child_process');

try {
  const didRelease = false;

  const stdo = execSync('ls');

  console.log(didRelease, stdo.toString());

  process.exit(1);

  process.stdout.write('::set-output name=did-release::' + didRelease + '\r\n');
} catch (e) {
  console.error(e);
  process.exit(1);
}
