const fs = require('fs');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
const path = require('path');

module.exports = function (yamlFilePath) {
    const yamlDir = path.dirname(yamlFilePath);

    console.log(yamlFilePath);

    const yamlObject = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));

    const templateFilePath = path.join(yamlDir, yamlObject.markomatic.template);
    const templateDir = path.dirname(templateFilePath);
    const outputFilePath   = path.join(yamlDir, yamlObject.markomatic.output);
    const outputDir = path.dirname(outputFilePath);

    const templateText = fs.readFileSync(templateFilePath, 'utf8');

    const renderedText = nunjucks.renderString(templateText, yamlObject.markomatic.variables);

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFilePath, renderedText);

    return renderedText;
}
