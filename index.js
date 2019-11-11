const fs = require('fs');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
const path = require('path');

const EOL_MODE_CRLF = 0;
const EOL_MODE_LF = 1;

// const SOURCE_MODE_MODULE = 2;
// const SOURCE_MODE_INPUT = 4;

/**
 * Markomatic
 * Create md file from template and yaml config
 * @param {string} yamlFilePath Path directory of the configuration yaml
 * @returns {string} rendered result
 */
function markomatic(yamlFilePath) {
    // Get config yaml as object
    /** @type { string } */ const yamlDir = path.dirname(yamlFilePath);
    /** @type { Object } */ const yamlObject = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));
    /** @type { Object } */ const yamlMarkomatic = yamlObject.markomatic;

    /** @type { number } */ let eolMode;

    // /** @type { number } */ let sourceMode;

    /** @type { string } */ let inputModule;
    /** @type { string } */ let inputDir;
    /** @type { string } */ let inputFilePath;
    /** @type { string } */ let inputFileName;
    /** @type { string } */ let inputText;

    // Check yaml validity
    if (yamlMarkomatic === undefined) throw new Error('The provided yaml file doesn\'t have markomatic property.');

    if (yamlMarkomatic.input !== undefined && yamlMarkomatic.useModule !== undefined) {
        console.log('input:', yamlMarkomatic.input);
        console.log('useModule:', yamlMarkomatic.useModule);
        throw new Error('Please use either input or useModule only...');
    } else if (yamlMarkomatic.useModule !== undefined) {
        // sourceMode = SOURCE_MODE_MODULE;

        if (typeof yamlMarkomatic.useModule !== 'string') {
            console.log(yamlMarkomatic.useModule);
            throw new Error('useModule is wrong...');
        }

        inputModule = yamlMarkomatic.useModule;
        inputDir = path.dirname(require.resolve(inputModule));
        inputFileName = 'index.md';
        inputFilePath = path.join(inputDir, inputFileName);

        if (!fs.existsSync(inputFilePath)) {
            console.log(inputFilePath, 'doesn\t exits');
            throw new Error(`The given ${inputModule} module is valid markomatic module`);
        }

        inputText = fs.readFileSync(inputFilePath, 'utf8');
    } else if (yamlMarkomatic.input !== undefined) {
        // sourceMode = SOURCE_MODE_INPUT;

        if (typeof yamlMarkomatic.input !== 'string') {
            console.log(yamlMarkomatic.input);
            throw new Error('input is wrong...');
        }

        // Get input data
        inputFilePath = path.join(yamlDir, yamlMarkomatic.input);

        if (!fs.existsSync(inputFilePath)) {
            console.log(inputFilePath, 'doesn\t exits');
            throw new Error('The given input doesn\'t exist');
        }

        inputFileName = path.parse(inputFilePath).base;
        inputDir = path.dirname(inputFilePath);
        inputText = fs.readFileSync(inputFilePath, 'utf8');
    } else {
        throw new Error('No useModule nor input is provided...');
    }

    if (typeof yamlMarkomatic.output !== 'string') {
        console.log(yamlMarkomatic.output);
        throw new Error('output is wrong...');
    }

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

    // Get output data
    const outputFilePath = path.join(yamlDir, yamlMarkomatic.output);
    const outputDir = path.dirname(outputFilePath);

    // Decide CRLF and LF mode by how much CRLF or LF occur in the input file
    const crlfCount = inputText.split('\r\n').length - 1;
    const lfCount = inputText.split('\n').length - crlfCount;

    if (lfCount < crlfCount) {
        eolMode = EOL_MODE_CRLF;
    } else {
        eolMode = EOL_MODE_LF;
    }

    // Collect template directories from the configuration yaml
    /** @type { Array.<string> } */
    const templateDirs = [];

    for (let i = 0; i < yamlMarkomatic.templateDirs.length; i += 1) {
        const templateDir = path.join(yamlDir, yamlMarkomatic.templateDirs[i]);

        if (!fs.existsSync(templateDir)) {
            const message = `templateDirs: ${templateDir} doesn't exist`;
            throw new Error(message);
        }

        templateDirs.push(path.join(yamlDir, yamlMarkomatic.templateDirs[i]));
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
