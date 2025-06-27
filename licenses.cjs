/* Used to collect information about the licenses */
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getPackageInfo(pkg, version) {
    try {
        const { stdout } = await exec(`npm view ${pkg}@${version} --json`);
        const data = JSON.parse(stdout);

        const licenseUrls = {
            'MIT': 'https://opensource.org/licenses/MIT',
            'GPL-2.0': 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
            'GPL-3.0': 'https://www.gnu.org/licenses/gpl-3.0.html',
            'AGPL-3.0': 'https://www.gnu.org/licenses/agpl-3.0.html',
            'Apache-2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
            'BSD-2-Clause': 'https://opensource.org/licenses/BSD-2-Clause',
            'BSD-3-Clause': 'https://opensource.org/licenses/BSD-3-Clause',
            'ISC': 'https://opensource.org/licenses/ISC'
        };

        return {
            name: `${pkg} (${version})`,
            url: data.homepage || 'N/A',
            license: data.license || 'N/A',
            licenseUrl: licenseUrls[data.license] || 'N/A'
        };
    } catch (error) {
        console.error(`Error fetching data for ${pkg}:`, error.message);
        return {
            name: `${pkg} (${version})`,
            url: 'N/A',
            license: 'N/A',
            licenseUrl: 'N/A'
        };
    }
}

async function main() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        console.error('package.json not found!');
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (!dependencies || Object.keys(dependencies).length === 0) {
        console.log('No dependencies found in package.json');
        return;
    }

    console.log('Fetching package information...\n');
    const results = await Promise.all(
        Object.entries(dependencies).map(([pkg, version]) => getPackageInfo(pkg, version))
    );

    results.forEach(pkg => {
        console.log(`* [${pkg.name}](${pkg.url})`);
        console.log(`  * Published under ${pkg.license}`);
    });
}

main();
