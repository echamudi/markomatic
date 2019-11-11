const fs = require('fs');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
const path = require('path');

const EOL_MODE_CRLF = 0;
const EOL_MODE_LF = 1;

/**
 * Markomatic
 * Create md file from template and yaml config
 * @param {string} yamlFilePath Path directory of the configuration yaml
 * @returns {string} rendered result
 */
function markomatic(yamlFilePath) {
    // Get config yaml as object
    const yamlDir = path.dirname(yamlFilePath);
    const yamlObject = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));
    const yamlMarkomatic = yamlObject.markomatic;

    // Check yaml validity
    if (yamlMarkomatic === undefined) throw new Error('The provided yaml file doesn\'t have markomatic property.');

    if (typeof yamlMarkomatic.templateDirs === 'string') {
        yamlMarkomatic.templateDirs = [yamlMarkomatic.templateDirs];
    } else if (yamlMarkomatic.templateDirs === undefined) {
        yamlMarkomatic.templateDirs = [];
    } else if (Array.isArray(yamlMarkomatic.templateDirs)) {
        // Good
    } else {
        console.log(yamlMarkomatic.templateDirs);
        throw new Error('‍templateDirs is wrong...');
    }

    if (typeof yamlMarkomatic.input !== 'string') {
        console.log(yamlMarkomatic.input);
        throw new Error('input is wrong...');
    }

    if (typeof yamlMarkomatic.output !== 'string') {
        console.log(yamlMarkomatic.output);
        throw new Error('output is wrong...');
    }

    // Get in put and output data
    const inputFilePath = path.join(yamlDir, yamlMarkomatic.input);
    const inputFileName = path.parse(inputFilePath).base;
    const inputDir = path.dirname(inputFilePath);
    const inputText = fs.readFileSync(inputFilePath, 'utf8');

    const outputFilePath = path.join(yamlDir, yamlMarkomatic.output);
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
    /** @type { Array.<string> } */
    const templateDirs = [];

    if (Array.isArray(yamlMarkomatic.templateDirs)) {
        yamlMarkomatic.templateDirs.forEach((/** @type {string} */ templateDir) => {
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
    let renderedText = nunjucks.render(inputFileName, yamlMarkomatic.variables);

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
