const fs = require('fs');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
const path = require('path');

module.exports = function (yamlPath) {
    const yamlDir = path.dirname(yamlPath);

    try {
        const doc = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'));

        const templatePath = path.join(yamlDir, doc.markomatic.template);
        const outputPath   = path.join(yamlDir, doc.markomatic.output);

        const templateText = fs.readFileSync(templatePath, 'utf8');

        let res = nunjucks.renderString(templateText, doc.markomatic.variables);

        console.log(doc);
        console.log(res);
    } catch (e) {
        console.log(e);
    }
}
