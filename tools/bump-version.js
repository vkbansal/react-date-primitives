import fs from 'node:fs';
import path from 'node:path';
import { globby } from 'globby';

const packages = await globby(['packages/*/package.json']);

const mainPackage = packages.find((pkg) => pkg.startsWith('packages/react-date-primitives'));
const mainPackageData = await fs.promises.readFile(mainPackage, 'utf8');
const mainPackageJSON = JSON.parse(mainPackageData);
const newVersion = mainPackageJSON.version;
console.log('new version:', newVersion);

for (const _package of packages) {
  if (_package.startsWith('packages/example')) {
    console.log(`updating ${_package}`);
    const data = await fs.promises.readFile(_package, 'utf8');
    const packageJSON = JSON.parse(data);

    packageJSON.dependencies['@vkbansal/react-date-primitives'] = newVersion;
    await fs.promises.writeFile(_package, JSON.stringify(packageJSON, null, 2) + '\n', 'utf8');
  }
}
