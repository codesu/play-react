const pkg = require('../../package.json');

const {
    scripts,
    devDependencies,
    jest,
    engines,
    ...newPkg
} = pkg;

console.log(JSON.stringify(newPkg));
