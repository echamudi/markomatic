const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const markomatic = require('../index');
const os = require('os');

describe('Markomatic!', function () {

    this.beforeEach(function () {
        // Make sure there's no previous result
        if (fs.existsSync('./result/complete-test.md')) {
            fs.unlinkSync('./result/complete-test.md');
        }
    });

    it('extracts correctly using markomatic as node module', function () {
        let expected = fs.readFileSync('./fixture/complete-test/expected/result.md', 'utf8');
        let result = markomatic('./fixture/complete-test/source/markomatic.yaml');

        if (os.platform() === 'win32') {
            result = result.replace(/\r/g, '');
            expected = expected.replace(/\r/g, '');
        }

        assert.deepStrictEqual(result, expected);
    });

    it('extracts correctly using markomatic as cli tool', function () {
        // const os = process.platform;
        /** @type {any} */
        const execSyncProp = {
            timeout: 60000,
            stdio: 'inherit',
        };

        execSync('markomatic ./fixture/complete-test/source/markomatic.yaml', execSyncProp);

        let expected = fs.readFileSync('./fixture/complete-test/expected/result.md', 'utf-8');
        let result = fs.readFileSync('./result/complete-test.md', 'utf-8');

        if (os.platform() === 'win32') {
            result = result.replace(/\r/g, '');
            expected = expected.replace(/\r/g, '');
        }

        assert.deepStrictEqual(result, expected);
    });

    it('extracts correctly using markomatic as cli tool (2)', function () {
        // const os = process.platform;
        /** @type {any} */
        const execSyncProp = {
            timeout: 60000,
            stdio: 'inherit',
        };

        execSync('cd ./fixture/complete-test/source/ && markomatic markomatic.yaml', execSyncProp);

        let expected = fs.readFileSync('./fixture/complete-test/expected/result.md', 'utf-8');
        let result = fs.readFileSync('./result/complete-test.md', 'utf-8');

        if (os.platform() === 'win32') {
            result = result.replace(/\r/g, '');
            expected = expected.replace(/\r/g, '');
        }

        assert.deepStrictEqual(result, expected);
    });

    describe('Yaml completion test', function() {
        it('throws error when the config doesn\'t contain markomatic prop', function() {
            assert.throws(() => {
                markomatic('./fixture/no-markomatic-prop/config.yaml');
            },
                new Error('The provided yaml file doesn\'t have markomatic property.')
            );
        });
    });
});
