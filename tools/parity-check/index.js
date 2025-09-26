#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cfg = require('./parity.config.json');
function check(root, name) {
  let missing = [];
  for (const f of cfg.features) {
    if (!fs.existsSync(path.join(root, f))) missing.push(f);
  }
  return { name, missing };
}
const coach = check(cfg.coachPwaRoot, 'coach-pwa');
const client = check(cfg.clientPwaRoot, 'user-pwa');
let failed = false;
for (const r of [coach, client]) {
  if (r.missing.length) {
    console.log(`[PARITY] ${r.name} missing routes:`, r.missing.join(', '));
    failed = true;
  } else {
    console.log(`[PARITY] ${r.name} OK`);
  }
}
process.exit(failed ? 1 : 0);
