#!/usr/bin/env node
// PreToolUse guard: blocks destructive operations that are never part of an
// agent's mission here, and escalates edits of sensitive config to a human.
// It is defense in depth on top of permissions and branch protection, not a
// sandbox: a determined shell command can always be written to evade a
// pattern. Rules are pure functions so tests can cover every one.
import path from 'node:path';
import { emit, readInput } from './lib.mjs';

/** Protected config: changing it changes the controls themselves. -> ask */
const PROTECTED = [
  /(^|\/)\.claude\/settings(\.local)?\.json$/,
  /(^|\/)\.claude\/hooks\//,
  /(^|\/)\.github\/workflows\//,
  /(^|\/)(\.github\/)?CODEOWNERS$/,
];
/** Secrets and VCS internals: never written by an agent. -> deny */
const SECRET = [
  /(^|\/)\.env(\.(?!example$|sample$|template$)[^/]+)?$/,
  /\.(pem|key|p12|pfx|keystore|jks)$/,
  /(^|\/)id_(rsa|ed25519|ecdsa)$/,
  /(^|\/)\.git\//,
];
const LOCKFILE = /(^|\/)pnpm-lock\.yaml$/;

function rel(p, root) {
  if (!p) return '';
  const abs = path.resolve(root, p);
  const r = path.relative(root, abs);
  return r.startsWith('..') ? abs : r.split(path.sep).join('/');
}

export function checkPath(filePath, root, tool) {
  const p = rel(filePath, root);
  if (SECRET.some((re) => re.test(p))) return { decision: 'deny', reason: `${tool} on ${p} is blocked: secrets and .git internals are never edited by agents (CLAUDE.md rule 1, 2).` };
  if (LOCKFILE.test(p)) return { decision: 'deny', reason: `Hand edits of ${p} are blocked: regenerate it with pnpm install.` };
  if (PROTECTED.some((re) => re.test(p))) return { decision: 'ask', reason: `${p} is a control file (hooks, CI, CODEOWNERS). A human must approve this change.` };
  return null;
}

/**
 * Remove quoted strings and heredoc bodies so text inside commit messages or
 * echo arguments does not trip the rules. Strings passed to `bash -c`,
 * `sh -c` or `eval` are code and stay.
 */
export function stripData(cmd) {
  let s = cmd.replace(/<<-?\s*['"]?(\w+)['"]?[^\n]*\n[\s\S]*?\n\s*\1\s*(\n|$)/g, ' <<HEREDOC\n');
  s = s.replace(/(\b(?:bash|sh|zsh)\s+-l?c\s+|\beval\s+)(["'])([\s\S]*?)\2/g, (_m, pre, _q, body) => `${pre} ${body} `);
  s = s.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""');
  return s;
}

const DENY = [
  [/\bgit\s+push\b[^;&|\n]*\s(--force(?!-with-lease)|-f\b|--mirror\b)/, 'Force pushes are blocked. Push a new commit instead (CLAUDE.md «Integration»: never force push).'],
  [/\bgit\s+push\b[^;&|\n]*\s\+\S+/, 'Force push refspecs (+ref) are blocked.'],
  [/\bgit\s+push\b[^;&|\n]*\s(\S*:)?(refs\/heads\/)?main\b(?!\S)/, 'Pushing to main is blocked. main changes only through a PR (CLAUDE.md rule 4).'],
  [/\bgit\s+push\b[^;&|\n]*\s(--delete\b|-d\b|:\S)/, 'Deleting remote branches is blocked for agents.'],
  [/\bgit\s+(reset\s+--hard|clean\s+-[a-zA-Z]*[fdx][a-zA-Z]*\b|checkout\s+(-f\s+)?(--\s+)?\.(\s|$)|restore\s+(--\S+\s+)*\.(\s|$)|stash\s+(drop|clear)\b)/, 'This git command discards uncommitted work, possibly someone else’s. Use a WIP commit or `git stash push -m <tag>` instead.'],
  [/\bgit\s+branch\s+-D\s+(main|develop)\b/, 'Deleting main or develop is blocked.'],
  [/--no-verify\b/, '--no-verify skips the repo’s own checks and is blocked.'],
  [/\b(commit|merge|rebase)\b[^;&|\n]*\s--no-gpg-sign\b/, '--no-gpg-sign is blocked.'],
  [/\bprisma\s+migrate\s+reset\b|\bdb\s+push\b[^;&|\n]*--(force-reset|accept-data-loss)\b/, 'Destructive Prisma commands are blocked. Write a migration instead.'],
  [/\brm\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*[rR][a-zA-Z]*\s+(-[a-zA-Z]+\s+)*(\/|~|\$HOME|\.\.?|\*|\.git)(\/?\s|\/?$)/, 'Recursive delete of /, ~, ., .. , * or .git is blocked.'],
  [/\b(curl|wget)\b[^|\n]*\|\s*(sudo\s+)?(ba|z)?sh\b/, 'Piping a download into a shell is blocked.'],
  [/\bchmod\s+(-R\s+)?777\b/, 'chmod 777 is blocked.'],
  [/\bgh\s+pr\s+merge\b[^;&|\n]*--admin\b|\bbranches\/\S+\/protection\b/, 'Bypassing or changing branch protection is blocked (CLAUDE.md «Integration»).'],
  [/(>|\btee\b[^|;&\n]*)\s*\S*(^|\/|\s)\.env(\.(?!example\b|sample\b|template\b)\w+)?(\s|$)/, 'Writing .env files from the shell is blocked: secrets are set by the owner (CLAUDE.md rule 1).'],
];

/** Shell commands that write, move or delete their path arguments. */
const WRITER = /^\s*(sudo\s+)?(tee|sed\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*i|perl\s+-[a-zA-Z]*i|mv|cp|rm|truncate|install|ln|chmod|chown|git\s+(checkout|restore|rm|mv)|patch|dd)\b/;
const PROTECTED_IN_CMD = /\.claude\/settings(\.local)?\.json|\.claude\/hooks(\/|\b)|\.github\/workflows(\/|\b)|CODEOWNERS/;

export function checkCommand(cmd) {
  const code = stripData(cmd);
  for (const [re, reason] of DENY) if (re.test(code)) return { decision: 'deny', reason };
  // SQL lives inside quotes, so check the raw text, but only for SQL clients.
  if (/\b(psql|mysql|sqlite3|prisma\s+db\s+execute)\b/.test(code) && /\b(DROP\s+(DATABASE|SCHEMA|TABLE)|TRUNCATE)\b/i.test(cmd)) {
    return { decision: 'deny', reason: 'Destructive SQL is blocked for agents.' };
  }
  if (PROTECTED_IN_CMD.test(cmd)) {
    // Quotes removed but paths kept: `sed -i '' ".claude/hooks/x"` still counts.
    const unquoted = cmd.replace(/<<-?\s*['"]?(\w+)['"]?[^\n]*\n[\s\S]*?\n\s*\1\s*(\n|$)/g, ' ').replace(/["']/g, ' ');
    for (const seg of unquoted.split(/&&|\|\||;|\||\n/)) {
      const redirect = [...seg.matchAll(/(?<![\d&<])>{1,2}\|?\s*([^\s&|;>]+)/g)].some((m) => PROTECTED_IN_CMD.test(m[1]));
      if (redirect || (WRITER.test(seg) && PROTECTED_IN_CMD.test(seg))) {
        return { decision: 'ask', reason: 'This command may change a control file (hooks, CI, CODEOWNERS). A human must approve it.' };
      }
    }
  }
  return null;
}

export function decide(input) {
  const root = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const ti = input.tool_input || {};
  const tool = input.tool_name || '';
  if (tool === 'Bash' && typeof ti.command === 'string') return checkCommand(ti.command);
  const file = ti.file_path || ti.notebook_path || ti.path;
  if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(tool) && file) return checkPath(file, root, tool);
  return null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const d = decide(readInput());
  if (d) {
    emit({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: d.decision, permissionDecisionReason: d.reason } });
  }
}
