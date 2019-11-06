const fs = require('fs');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
const path = require('path');

module.exports = function (yamlFilePath) {
    const yamlDir = path.dirname(yamlFilePath);

    const yamlObject = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));

    const inputFilePath = path.join(yamlDir, yamlObject.markomatic.input);
    const inputFileName = path.parse(inputFilePath).base;
    const inputDir = path.dirname(inputFilePath);
    const outputFilePath = path.join(yamlDir, yamlObject.markomatic.output);
    const outputDir = path.dirname(outputFilePath);
    const templateDirs = [];

    yamlObject.markomatic.templateDirs.forEach((templateDir) => {
        templateDirs.push(path.join(yamlDir, templateDir));
    });

    nunjucks.configure(
        // Include lookup order
        [
            inputDir,       // 1. Same folder as input file
            yamlDir,        // 2. Same folder as yaml file
            ...templateDirs,    // 3. templateDirs written in yaml file
        ],
        {
            autoescape: false // Don't use HTML character
        });
    const renderedText = nunjucks.render(inputFileName, yamlObject.markomatic.variables);

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFilePath, renderedText);

    return renderedText;
}
