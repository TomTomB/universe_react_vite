// @ts-check
/**
 * Below is my way of checking if lerna did a release.
 * I'm an absolute toast when it comes to github actions.
 */

const { execSync } = require('child_process');

const cwd = process.cwd();

try {
  const lernaJsonBefore = require(`${cwd}/lerna.json`);

  execSync('yarn release -y');

  const lernaJsonAfter = require(`${cwd}/lerna.json`);

  const didRelease = lernaJsonBefore.version !== lernaJsonAfter.version;

  if (didRelease) {
    console.log(
      `A release was made. ${lernaJsonBefore.version} -> ${lernaJsonAfter.version}`,
    );
  } else {
    console.log(`No release was made. ${lernaJsonBefore.version}`);
  }

  process.stdout.write('::set-output name=did-release::' + didRelease + '\r\n');
} catch (e) {
  console.error(e);
  process.exit(1);
}
