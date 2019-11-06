#!/usr/bin/env node

const markomatic = require('.');
const path = require('path');

markomatic(path.join(process.cwd(), process.argv[2]));
