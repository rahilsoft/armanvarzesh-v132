#!/usr/bin/env node
// PreToolUse guard: blocks destructive operations that are never part of an
// agent's mission here, and escalates edits of sensitive config to a human.
// It is defense in depth on top of permissions and branch protection, not a
// sandbox: a determined shell command can always be written to evade a
// pattern. Rules are pure functions so tests can cover every one.
import path from 'node:path';
import { emit, ensureBaseline, gitTop, loadState, readInput, saveState, stateDir, withLock } from './lib.mjs';

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
/** Hook state: erasing it resets the baseline and hides the session's edits. -> deny */
const STATE = /(^|\/)\.claude\/\.hook-state(\/|$)/;
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
  if (STATE.test(p)) return { decision: 'deny', reason: `${tool} on ${p} is blocked: the hook state is written only by the hooks.` };
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
  let s = cmd.replace(/(["'])(\$HOME|\$\{HOME\}|\/|~|\.|\.\.)\1/g, '$2');
  s = s.replace(/<<-?\s*['"]?(\w+)['"]?[^\n]*\n[\s\S]*?\n\s*\1\s*(\n|$)/g, ' <<HEREDOC\n');
  s = s.replace(/(\b(?:bash|sh|zsh)\s+-l?c\s+|\beval\s+)(["'])([\s\S]*?)\2/g, (_m, pre, _q, body) => `${pre} ${body} `);
  s = s.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""');
  return s;
}

const DENY = [
  [/\bgit\s+commit\b[^;&|\n]*\s-[a-zA-Z]*n[a-zA-Z]*(\s|$)/, 'git commit -n is --no-verify and is blocked.'],
  [/\bfind\b[^;&|\n]*\s(-delete\b|-exec\s+(sudo\s+)?rm\b)/, 'find -delete / -exec rm is blocked: list the files and delete them explicitly.'],
  [/\bgit\s+(checkout|restore)\s+(-f\s+)?--\s+\S/, 'This git command discards uncommitted work. Use a WIP commit instead.'],
  [/\b(cp|mv|install|ln|dd|truncate)\b[^;&|\n]*\s(of=)?\S*\.env(\.(?!example\b|sample\b|template\b)\w+)?(\s|$)/, 'Writing .env files from the shell is blocked: secrets are set by the owner (CLAUDE.md rule 1).'],
  [/\bgit\s+push\b[^;&|\n]*\s(--force(?!-with-lease)|-f\b|--mirror\b)/, 'Force pushes are blocked. Push a new commit instead (CLAUDE.md «Integration»: never force push).'],
  [/\bgit\s+push\b[^;&|\n]*\s\+\S+/, 'Force push refspecs (+ref) are blocked.'],
  [/\bgit\s+push\b[^;&|\n]*\s(\S*:)?(refs\/heads\/)?main\b(?!\S)/, 'Pushing to main is blocked. main changes only through a PR (CLAUDE.md rule 4).'],
  [/\bgit\s+push\b[^;&|\n]*\s(--delete\b|-d\b|:\S)/, 'Deleting remote branches is blocked for agents.'],
  [/\bgit\s+(reset\s+--hard|clean\s+-[a-zA-Z]*[fdx][a-zA-Z]*\b|checkout\s+(-f\s+)?(--\s+)?\.(\s|$)|restore\s+(--\S+\s+)*\.(\s|$)|stash\s+(drop|clear)\b)/, 'This git command discards uncommitted work, possibly someone else’s. Use a WIP commit or `git stash push -m <tag>` instead.'],
  [/\bgit\s+branch\s+-D\s+(main|develop)\b/, 'Deleting main or develop is blocked.'],
  [/--no-verify\b/, '--no-verify skips the repo’s own checks and is blocked.'],
  [/\b(commit|merge|rebase)\b[^;&|\n]*\s--no-gpg-sign\b/, '--no-gpg-sign is blocked.'],
  [/\bprisma\s+migrate\s+reset\b|\bdb\s+push\b[^;&|\n]*--(force-reset|accept-data-loss)\b/, 'Destructive Prisma commands are blocked. Write a migration instead.'],
  [/\brm\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*[rR][a-zA-Z]*\s+(-[a-zA-Z]+\s+)*(--\s+)?(\/|~|\$HOME|\$\{HOME\}|\.\.?|\*|\.git)(\/?\s|\/?$)/, 'Recursive delete of /, ~, ., .. , * or .git is blocked.'],
  [/\b(curl|wget)\b[^|\n]*\|\s*(sudo\s+)?(ba|z)?sh\b/, 'Piping a download into a shell is blocked.'],
  [/\bchmod\s+(-R\s+)?777\b/, 'chmod 777 is blocked.'],
  [/\bgh\s+pr\s+merge\b[^;&|\n]*--admin\b|\bbranches\/\S+\/protection\b/, 'Bypassing or changing branch protection is blocked (CLAUDE.md «Integration»).'],
  [/(>|\btee\b[^|;&\n]*)\s*\S*(^|\/|\s)\.env(\.(?!example\b|sample\b|template\b)\w+)?(\s|$)/, 'Writing .env files from the shell is blocked: secrets are set by the owner (CLAUDE.md rule 1).'],
];

/** Shell commands that write, move or delete their path arguments. */
const WRITER = /^\s*(sudo\s+)?(tee|sed\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*i|perl\s+-[a-zA-Z]*i|mv|cp|rm|truncate|install|ln|chmod|chown|git\s+(checkout|restore|rm|mv|apply|am)|patch|dd|python3?\b[^;&|\n]*\s-c|node\s+(-\S+\s+)*(-e|--eval|-p)|ruby\s+-e|perl\s+-e)\b/;
const PROTECTED_IN_CMD = /\.claude\/settings(\.local)?\.json|\.claude\/hooks(\/|\b)|\.github\/workflows(\/|\b)|CODEOWNERS/;

const READ_ONLY = /^\s*(sudo\s+)?(cat|ls|head|tail|grep|rg|wc|stat|less|file|git\s+(log|diff|show|status))\b/;

export function checkCommand(cmd) {
  // `git -C dir`, `git -c k=v` and `--no-pager` must not hide the subcommand.
  let code = stripData(cmd).replace(/\bgit\s+((-C|-c|--git-dir|--work-tree)(\s+|=)\S+\s+|--[\w-]+\s+)+/g, 'git ');
  for (const seg of cmd.split(/&&|\|\||;|\||\n/)) {
    if (/\.hook-state\b/.test(seg) && !READ_ONLY.test(seg)) {
      return { decision: 'deny', reason: 'The hook state (.claude/.hook-state) is written only by the hooks: erasing it would hide this session’s edits.' };
    }
  }
  for (const [re, reason] of DENY) if (re.test(code)) return { decision: 'deny', reason };
  // SQL lives inside quotes, so check the raw text, but only for SQL clients.
  if (/\b(psql|mysql|sqlite3|prisma\s+db\s+execute)\b/.test(code) && /\b(DROP\s+(DATABASE|SCHEMA|TABLE)|TRUNCATE)\b/i.test(cmd)) {
    return { decision: 'deny', reason: 'Destructive SQL is blocked for agents.' };
  }
  if (/disableAllHooks/.test(cmd) && !READ_ONLY.test(cmd)) {
    return { decision: 'ask', reason: 'disableAllHooks switches the safety hooks off. A human must approve it.' };
  }
  const segs = cmd.split(/&&|\|\||;|\n/);
  const cdIntoControl = segs.some((seg) => /^\s*cd\s+\S*(\.claude|\.github)(\/|\s|$)/.test(seg));
  if (cdIntoControl && segs.some((seg) => WRITER.test(seg) && !/^\s*cd\b/.test(seg))) {
    return { decision: 'ask', reason: 'This command changes directory into a control folder (.claude, .github) and writes there. A human must approve it.' };
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

/** Record the session baseline before the tool runs, so its own first edit counts. */
function recordBaseline(input) {
  try {
    const top = gitTop(input);
    if (!top) return;
    const dir = stateDir(top);
    withLock(dir, () => {
      const state = loadState(dir, input.session_id);
      if (ensureBaseline(top, state)) saveState(dir, input.session_id, state);
    });
  } catch {
    /* the Stop gate falls back to its own baseline */
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = readInput();
  recordBaseline(input);
  const d = decide(input);
  if (d) {
    emit({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: d.decision, permissionDecisionReason: d.reason } });
  }
}
