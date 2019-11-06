const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const markomatic = require('../index');

describe('Markomatic!', function () {
    it('extracts correctly using markomatic as node module', function () {
        markomatic('./fixture/complete-test/source/markomatic.yaml');
        assert.deepStrictEqual(fs.readFileSync('./fixture/complete-test/expected/result.md'), fs.readFileSync('./result/complete-test.md'));
        fs.unlinkSync('./result/complete-test.md');
    });

    it('extracts correctly using markomatic as cli tool', function () {
        // const os = process.platform;
        /** @type {any} */
        const execSyncProp = {
            timeout: 60000,
            stdio: 'inherit',
        };

        execSync('markomatic ./fixture/complete-test/source/markomatic.yaml', execSyncProp);
        assert.deepStrictEqual(fs.readFileSync('./fixture/complete-test/expected/result.md'), fs.readFileSync('./result/complete-test.md'));
        fs.unlinkSync('./result/complete-test.md');

        execSync('cd ./fixture/complete-test/source/ && markomatic markomatic.yaml', execSyncProp);
        assert.deepStrictEqual(fs.readFileSync('./fixture/complete-test/expected/result.md'), fs.readFileSync('./result/complete-test.md'));
    });
});