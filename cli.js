#!/usr/bin/env node

// markomatic ./test/fixture/basic-variable/source/markomatic.yaml
// or
// cd ./test/fixture/basic-variable/source
// markomatic ./markomatic.yaml

const markomatic = require('.');
const path = require('path');

console.log(process.argv);
console.log(markomatic(path.join(process.cwd(), process.argv[2])));