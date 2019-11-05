const fs = require('fs');
const yaml = require('js-yaml');

// Get document, or throw exception on error
try {
    const doc = yaml.safeLoad(fs.readFileSync('./test/fixture/basic-case/source/markomatic.yaml', 'utf8'));
    console.log(doc);
} catch (e) {
    console.log(e);
}
