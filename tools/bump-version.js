const newVersion = process.argv[2];
const fs = require('fs');
const path = require('path');

(async () => {
  const dirs = await fs.promises.readdir(path.resolve(__dirname, '../packages'));

  for (const dir of dirs) {
    const packagePath = path.resolve(__dirname, '../packages', dir, 'package.json');
    const data = await fs.promises.readFile(packagePath, 'utf8');
    const package = JSON.parse(data);

    if (dir === 'react-date-primitives') {
      package.version = newVersion;
    } else if (dir.startsWith('example')) {
      package.dependencies['@vkbansal/react-date-primitives'] = newVersion;
    }

    await fs.promises.writeFile(packagePath, JSON.stringify(package, null, 2) + '\n', 'utf8');
  }
})();
