// Simple repo hygiene checker before commit
// - Flags large files (>10MB) outside allowed dirs
// - Warns if sensitive files are present (env, keystore, private keys) outside .gitignore
// - Quick regex pass for common secrets (fallback to Gitleaks in CI)
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const IGNORE_DIRS = [
  '.git','node_modules','dist','build','.expo','.turbo','.next','coverage',
  'ios/Pods','android/build','android/app/build','Pods','__snapshots__'
];

const SENSITIVE_NAMES = [
  '.env','.env.local','.env.production','.env.development',
  'google-services.json','GoogleService-Info.plist',
  '*.keystore','*.jks','*.p8','*.p12','*.pem','*.mobileprovision','*.key'
];

const SECRET_REGEXES = [
  /AKIA[0-9A-Z]{16}/,                      // AWS
  /AIza[0-9A-Za-z\-_]{35}/,                // Google API
  /ghp_[0-9A-Za-z]{36}/,                   // GitHub token
  /xox[baprs]-[0-9A-Za-z\-]{10,48}/,       // Slack
  /sk_live_[0-9A-Za-z]{10,}/,              // Stripe live
  // Private keys: require a base64 body after the header so documentation
  // placeholders like `-----BEGIN PRIVATE KEY-----...` don't trip the gate.
  /-----BEGIN (RSA |EC )?PRIVATE KEY-----(\r?\n)+[A-Za-z0-9+/=]{16,}/
];

// Throwaway fixture keys used to sign tokens inside unit tests are expected;
// Gitleaks in CI remains the authoritative scanner for everything.
const TEST_FILE_RX = /(^|\/)__tests__\/|\.(spec|test)\.[cm]?[jt]sx?$/;

// verify-clean must not flag artifacts git itself already ignores (generated
// Prisma clients, local build output); only commit-able files matter here.
function filterGitIgnored(files) {
  const res = spawnSync('git', ['check-ignore', '--stdin'], {
    input: files.map(f => f.rel).join('\n'), encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024
  });
  if (res.status !== 0 && res.status !== 1) return files; // git unavailable: scan everything
  const ignored = new Set(res.stdout.split('\n').filter(Boolean));
  return files.filter(f => !ignored.has(f.rel));
}

function isIgnored(p) {
  const parts = p.split(path.sep);
  return parts.some(seg => IGNORE_DIRS.includes(seg));
}

function matchGlob(name, pattern) {
  // very small glob: only supports prefix/suffix '*'
  if (pattern === name) return true;
  if (pattern.startsWith('*.') && name.endsWith(pattern.slice(1))) return true;
  return false;
}

async function walk(dir, out = []) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(ROOT, full);
    if (isIgnored(rel)) continue;
    if (e.isDirectory()) await walk(full, out);
    else out.push({ full, rel });
  }
  return out;
}

(async () => {
  const files = filterGitIgnored(await walk(ROOT));
  const problems = [];
  for (const f of files) {
    try {
      const stat = await fsp.stat(f.full);
      if (stat.size > MAX_SIZE && !/\.(png|jpe?g|webp|avif|gif|mp4|mov|pdf)$/i.test(f.rel)) {
        problems.push({ type: 'large', file: f.rel, size: stat.size });
      }
      // sensitive names
      for (const pat of SENSITIVE_NAMES) {
        if (matchGlob(path.basename(f.rel), pat)) {
          problems.push({ type: 'sensitive-name', file: f.rel });
        }
      }
      // quick secret scan
      const sample = TEST_FILE_RX.test(f.rel)
        ? ''
        : await fsp.readFile(f.full, { encoding: 'utf-8' }).catch(() => '');
      if (sample) {
        for (const rx of SECRET_REGEXES) {
          if (rx.test(sample)) { problems.push({ type: 'secret-pattern', file: f.rel, pattern: rx.toString() }); break; }
        }
      }
    } catch {}
  }

  if (problems.length) {
    console.error('[verify-clean] Issues found:');
    for (const p of problems) {
      if (p.type === 'large') {
        console.error(` - LARGE: ${p.file} (${Math.round(p.size/1024/1024)} MB)`);
      } else if (p.type === 'sensitive-name') {
        console.error(` - SENSITIVE FILE NAME: ${p.file}`);
      } else if (p.type === 'secret-pattern') {
        console.error(` - SECRET-LIKE CONTENT: ${p.file} matches ${p.pattern}`);
      }
    }
    process.exitCode = 2;
  } else {
    console.log('[verify-clean] OK — no obvious issues.');
  }
})().catch(e => { console.error(e); process.exit(1); });
