#!/usr/bin/env node

const markomatic = require('.');

markomatic(path.join(process.cwd(), process.argv[2]));
