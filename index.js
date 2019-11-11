const fs = require('fs');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
const path = require('path');

const EOL_MODE_CRLF = 0;
const EOL_MODE_LF = 1;

function markomatic(yamlFilePath) {
    // Get config yaml as object
    const yamlDir = path.dirname(yamlFilePath);
    const yamlObject = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));

    // Check yaml validity
    if (yamlObject.markomatic === undefined) throw new Error('The provided yaml file doesn\'t have markomatic property.');

    // Get in put and output data
    const inputFilePath = path.join(yamlDir, yamlObject.markomatic.input);
    const inputFileName = path.parse(inputFilePath).base;
    const inputDir = path.dirname(inputFilePath);
    const inputText = fs.readFileSync(inputFilePath, 'utf8');

    const outputFilePath = path.join(yamlDir, yamlObject.markomatic.output);
    const outputDir = path.dirname(outputFilePath);

    // Decide CRLF and LF mode by how much CRLF or LF occur in the input file
    const crlfCount = inputText.split('\r\n').length - 1;
    const lfCount = inputText.split('\n').length - crlfCount;

    let eolMode;
    if (lfCount < crlfCount) {
        eolMode = EOL_MODE_CRLF;
    } else {
        eolMode = EOL_MODE_LF;
    }

    // Collect template directories from the configuration yaml
    const templateDirs = [];

    if (Array.isArray(yamlObject.markomatic.templateDirs)) {
        yamlObject.markomatic.templateDirs.forEach((templateDir) => {
            templateDirs.push(path.join(yamlDir, templateDir));
        });
    }

    // Configure nunjucks
    nunjucks.configure(
        // Include lookup order
        [
            inputDir, // 1. Same folder as input file
            yamlDir, // 2. Same folder as yaml file
            ...templateDirs, // 3. templateDirs written in yaml file
        ],
        {
            autoescape: false, // Don't use HTML character
        },
    );

    // Run nunjucks
    let renderedText = nunjucks.render(inputFileName, yamlObject.markomatic.variables);

    // Fix  CRLF or LF
    if (eolMode === EOL_MODE_CRLF) {
        renderedText = renderedText.replace(/\r\n/g, '\n');
        renderedText = renderedText.replace(/\n/g, '\r\n');
    } else {
        renderedText = renderedText.replace(/\r\n/g, '\n');
    }

    // Write file
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFilePath, renderedText);

    return renderedText;
}

module.exports = markomatic;
