// Run from packages/ui-tokens: node scripts/generate-css.cjs ; writes styles/theme.css
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const Module = require('module');

const cache = {};
function load(file) {
  if (cache[file]) return cache[file].exports;
  const src = fs.readFileSync(file, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = new Module(file);
  cache[file] = m;
  const req = (p) => (p.startsWith('.') ? load(path.resolve(path.dirname(file), p) + '.ts') : require(p));
  new Function('exports', 'require', 'module', out)(m.exports, req, m);
  return m.exports;
}

const { generateCss } = load(path.join(__dirname, '../src/css.ts'));
fs.writeFileSync(path.join(__dirname, '../styles/theme.css'), generateCss());
