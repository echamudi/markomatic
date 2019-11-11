#!/usr/bin/env node

const path = require('path');
const markomatic = require('.');

markomatic(path.join(process.cwd(), process.argv[2]));
