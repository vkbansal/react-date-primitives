import fs from 'node:fs';
import path from 'node:path';
import { globby } from 'globby';

const packages = await globby(['packages/*/package.json']);
const check = process.argv.includes('--check');

const mainPackage = packages.find((pkg) => pkg.startsWith('packages/react-date-primitives'));
const mainPackageData = await fs.promises.readFile(mainPackage, 'utf8');
const mainPackageJSON = JSON.parse(mainPackageData);
const newVersion = mainPackageJSON.version;

if (!check) {
  console.log('new version:', newVersion);
}

for (const _package of packages) {
  if (_package.startsWith('packages/example')) {
    const data = await fs.promises.readFile(_package, 'utf8');
    const packageJSON = JSON.parse(data);

    if (check) {
      if (packageJSON.dependencies[mainPackageJSON.name] !== newVersion) {
        console.log(`❌ ${_package} does not have correct version of "${mainPackageJSON.name}"`);
        console.log(`Expected: "${newVersion}"`);
        console.log(`Recieved: "${packageJSON.dependencies[mainPackageJSON.name]}"`);
        process.exit(1);
      } else {
        console.log(`✅ ${_package} has correct version of "${mainPackageJSON.name}"`);
      }
    } else {
      console.log(`✅ updating ${_package}`);
      packageJSON.dependencies[mainPackageJSON.name] = newVersion;
      await fs.promises.writeFile(_package, JSON.stringify(packageJSON, null, 2) + '\n', 'utf8');
    }
  }
}
process.exit(0);
