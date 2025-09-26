#!/usr/bin/env node
const bcrypt = require('bcryptjs');
const pwd = process.argv[2];
if (!pwd){ console.error('Usage: node hash-admin.js <password>'); process.exit(1); }
const hash = bcrypt.hashSync(pwd, 10);
console.log(hash);
