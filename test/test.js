const fs = require('fs');
const path = require('path');
const markomatic = require('../index');

const sources = [
    './fixture/basic-loop/source/markomatic.yaml',
    './fixture/basic-variable/source/markomatic.yaml'
];

describe('Extract correctly', function () {
    sources.forEach((source) => {
        it(`passes correctly for ${source}`, function () {
            console.log(source);
            markomatic(source);
        });
    });
});