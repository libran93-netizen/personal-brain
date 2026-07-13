#!/usr/bin/env node
/**
 * Personal Brain collector — parses local AI session transcripts into the
 * Obsidian vault at D:\personal-brain.
 *
 * Sources:
 *   A. Claude Code terminal/desktop transcripts: ~\.claude\projects\<slug>\*.jsonl
 *   B. Claude Desktop session metadata:          %APPDATA%\Claude\claude-code-sessions\*\local_*.json
 *   C. Google Antigravity:                       ~\.gemini\antigravity*\brain\<uuid>\.system_generated\logs\transcript.jsonl
 *   D. Manual inbox drops:                       <vault>\inbox\*.md|*.txt
 *
 * Modes:
 *   node collect.mjs                     incremental collect (nightly)
 *   node collect.mjs --backfill          process all history + mechanical daily notes
 *   node collect.mjs --apply-digest F    split Claude's digest output into vault files
 *   node collect.mjs --apply-backfill F  write daily/backfill-overview.md
 *   node collect.mjs --fallback-digest   mechanical daily note when the AI call failed
 *
 * Exit codes: 0 = digest input ready, 2 = nothing new to digest, 1 = error.
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const VAULT = path.resolve(SCRIPT_DIR, '..');
const HOME = os.homedir();
const APPDATA = process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming');

const CLAUDE_PROJECTS = path.join(HOME, '.claude', 'projects');
const DESKTOP_SESSIONS = path.join(APPDATA, 'Claude', 'claude-code-sessions');
const ANTIGRAVITY_ROOTS = [
  path.join(HOME, '.gemini', 'antigravity-ide', 'brain'),
  path.join(HOME, '.gemini', 'antigravity', 'brain'),
];

const STATE_DIR = path.join(VAULT, '.state');
const TMP_DIR = path.join(STATE_DIR, 'tmp');
const STATE_FILE = path.join(STATE_DIR, 'last-run.json');
const TEMPLATE_FILE = path.join(SCRIPT_DIR, 'prompts', 'digest-system.md');

const KNOWN_PROJECTS = ['the-outdoor-network', 'bluesheep-adventures', 'outdoors-with-karan', 'karan-tracker'];
const SOURCE_LABEL = {
  'claude-code': 'Claude Code',
  'claude-desktop': 'Claude Desktop',
  'antigravity': 'Antigravity',
  'inbox': 'Inbox',
};

const MAX_USER_CHARS = 4000;
const MAX_ASSISTANT_CHARS = 6000;
const MAX_FILE_BYTES = 300 * 1024;
const MAX_DIGEST_INPUT = 150 * 1024;

// ---------------------------------------------------------------- redaction
// Patterns are assembled from string fragments so a verification grep over the
// vault for real token prefixes never matches this script's own source.
function re(s, f) { return new RegExp(s, f || 'g'); }
const RED_PATTERNS = [
  re('gh' + '[pousr]_' + '[A-Za-z0-9]{20,}'),
  re('github' + '_pat_' + '[A-Za-z0-9_]{20,}'),
  re('vc' + 'k_' + '[A-Za-z0-9]{16,}'),
  re('sk-' + 'ant-' + '[A-Za-z0-9_\\-]{20,}'),
  re('sk' + '-' + '[A-Za-z0-9]{32,}'),
  re('AKI' + 'A[0-9A-Z]{16}'),
  re('xo' + 'x[baprs]-' + '[A-Za-z0-9\\-]{10,}'),
  re('sb_' + 'secret_' + '[A-Za-z0-9_\\-]{10,}'),
  re('sb_' + 'publishable_' + '[A-Za-z0-9_\\-]{10,}'),
  re('sb' + 'p_' + '[A-Fa-f0-9]{20,}'),
  re('ey' + 'J[A-Za-z0-9_\\-]{15,}\\.[A-Za-z0-9_\\-]{15,}(?:\\.[A-Za-z0-9_\\-]{10,})?'),
  re('Bearer\\s+' + '[A-Za-z0-9._\\-]{25,}'),
  re('-----BEGIN [A-Z ]*PRIVATE KEY-----[\\s\\S]*?-----END [A-Z ]*PRIVATE KEY-----'),
];
const RED_KV = re('\\b(api[_-]?key|apikey|access[_-]?token|auth[_-]?token|token|secret|passwd|password)\\b(\\s*[:=]\\s*)([\'"]?)([A-Za-z0-9_\\-./+]{16,})', 'gi');
const RED_DBURL = re('(postgres(?:ql)?:\\/\\/[^:\\s\'"]+:)[^@\\s\'"]+(@)', 'gi');

function redact(t) {
  if (t == null) return t;
  let s = String(t);
  for (const r of RED_PATTERNS) s = s.replace(r, '[REDACTED]');
  s = s.replace(RED_KV, (m, k, sep, q) => k + sep + q + '[REDACTED]');
  s = s.replace(RED_DBURL, '$1[REDACTED]$2');
  return s;
}

// ---------------------------------------------------------------- utilities
function p2(n) { return String(n).padStart(2, '0'); }
function localDate(d) { return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`; }
function localHM(d) { return p2(d.getHours()) + p2(d.getMinutes()); }
function localHMc(d) { return p2(d.getHours()) + ':' + p2(d.getMinutes()); }
function tzOffsetStr(d) {
  const m = -d.getTimezoneOffset();
  const a = Math.abs(m);
  return (m < 0 ? '-' : '+') + p2(Math.floor(a / 60)) + ':' + p2(a % 60);
}
function isoLocal(d) {
  return `${localDate(d)}T${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}${tzOffsetStr(d)}`;
}
function cap(t, n) {
  t = String(t);
  if (t.length <= n) return t;
  return t.slice(0, n) + `…[truncated ${t.length - n} chars]`;
}
function capTitle(t, n) {
  t = String(t).replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + '…';
}
function yq(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ') + '"'; }
function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function bump(o, k) { o[k] = (o[k] || 0) + 1; }
function topStats(stats) {
  const e = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  if (!e.length) return '';
  return e.slice(0, 5).map(([k, v]) => `${k} ${v}`).join(', ') + (e.length > 5 ? ', …' : '');
}
function writeVaultFile(rel, content) {
  const abs = path.join(VAULT, rel);
  ensureDir(path.dirname(abs));
  const clean = redact(content).replace(/\r\n/g, '\n');
  fs.writeFileSync(abs, clean, 'utf8');
  return abs;
}
function readVaultFile(rel) {
  const abs = path.join(VAULT, rel);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}
function guessProject(cwdLike, firstUserMsg) {
  const c = (cwdLike || '').toLowerCase();
  if (c.includes('bluesheepadventures')) return 'bluesheep-adventures';
  if (c.includes('karan website') || c.includes('karan-website') || c.includes('outdoorswithkaran')) return 'outdoors-with-karan';
  if (c.includes('claude task tracker') || c.includes('karan-tracker')) return 'karan-tracker';
  const m = (firstUserMsg || '').toLowerCase();
  if (/outdoor network|\bton\b/.test(m)) return 'the-outdoor-network';
  if (/blue ?sheep/.test(m)) return 'bluesheep-adventures';
  if (/outdoors ?with ?karan/.test(m)) return 'outdoors-with-karan';
  return 'unsorted';
}

// ------------------------------------------------------------ session model
function newSession(sid, source) {
  return {
    sid, source, title: '', cwd: '', gitBranch: '', model: '', project: 'unsorted',
    started: null, ended: null, groups: [], toolCalls: 0, toolStats: {},
    files: new Set(), subagents: 0, artifacts: [], stubNote: '',
    firstUser: '', lastUsers: [], lastAssistants: [], hasNew: false, taskMd: '',
  };
}

function pushTurn(s, role, ts, text, wm) {
  const t = String(text || '').trim();
  if (!t) return null;
  const g = { role, ts, text: cap(t, role === 'user' ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS), tools: [] };
  s.groups.push(g);
  if (!s.firstUser && role === 'user') s.firstUser = cap(t, 1000);
  if (ts && ts.getTime() > wm) {
    const arr = role === 'user' ? s.lastUsers : s.lastAssistants;
    arr.push(cap(t, 800));
    if (arr.length > 3) arr.shift();
  }
  return g;
}

function attachTools(s, tools) {
  if (!tools.length) return;
  if (s.groups.length) s.groups[s.groups.length - 1].tools.push(...tools);
  else s.groups.push({ role: null, ts: null, text: '', tools });
}

function isInjected(t) {
  const s = String(t).trimStart();
  return s.startsWith('<command-name>') || s.startsWith('<command-message>') ||
    s.startsWith('<local-command-stdout>') || s.startsWith('<system-reminder>') ||
    s.startsWith('<ide_opened_file>') || s.startsWith('<ide_selection>') ||
    s.startsWith('<ide_diagnostics>') || s.startsWith('Caveat:');
}

function toolLine(b) {
  const name = b.name || 'tool';
  const inp = b.input || {};
  let hint = inp.command || inp.file_path || inp.path || inp.pattern || inp.url || inp.query || inp.description || '';
  hint = String(hint);
  if (!hint) { try { hint = JSON.stringify(inp); } catch { hint = ''; } }
  if (hint.length > 200) hint = hint.slice(0, 200) + '…';
  return `> \u{1F527} ${name} \`${hint.replace(/`/g, "'").replace(/\r?\n/g, ' ')}\``;
}

function toolErrLine(b) {
  let c = b.content;
  if (Array.isArray(c)) c = c.map(x => (x && x.text) || '').join(' ');
  c = String(c || 'tool error').replace(/\r?\n/g, ' ');
  return `> ⚠ tool error: ${cap(c, 300)}`;
}

// ------------------------------------------------------ source A: Claude Code
async function parseClaudeCode(file, wm, desktopMeta) {
  const sid = path.basename(file, '.jsonl');
  const s = newSession(sid, 'claude-code');
  let summaryTitle = '';
  const rl = readline.createInterface({ input: fs.createReadStream(file, 'utf8'), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    let o;
    try { o = JSON.parse(line); } catch { continue; } // tolerate live mid-write last line
    if (o.type === 'summary') { if (o.summary) summaryTitle = String(o.summary); continue; }
    if (o.type !== 'user' && o.type !== 'assistant') continue;
    if (o.isSidechain || o.isMeta) continue;
    if (o.cwd && !s.cwd) s.cwd = o.cwd;
    if (o.gitBranch && !s.gitBranch) s.gitBranch = o.gitBranch;
    const ts = o.timestamp ? new Date(o.timestamp) : null;
    const valid = ts && !isNaN(ts.getTime());
    if (valid) {
      if (!s.started) s.started = ts;
      s.ended = ts;
      if (ts.getTime() > wm) s.hasNew = true;
    }
    const msg = o.message || {};
    const role = msg.role || o.type;
    const content = msg.content;
    const texts = [];
    const tools = [];
    if (typeof content === 'string') {
      if (content.trim() && !isInjected(content)) texts.push(content);
    } else if (Array.isArray(content)) {
      for (const b of content) {
        if (!b || typeof b !== 'object') continue;
        if (b.type === 'text') {
          const t = String(b.text || '');
          if (t.trim() && !isInjected(t)) texts.push(t);
        } else if (b.type === 'thinking' || b.type === 'redacted_thinking') {
          continue;
        } else if (b.type === 'tool_use') {
          s.toolCalls++;
          bump(s.toolStats, b.name || 'tool');
          const fp = b.input && (b.input.file_path || b.input.notebook_path);
          if (fp) s.files.add(String(fp));
          tools.push(toolLine(b));
        } else if (b.type === 'tool_result') {
          if (b.is_error) tools.push(toolErrLine(b));
        }
      }
    }
    if (texts.length) {
      const g = pushTurn(s, role === 'user' ? 'user' : 'assistant', valid ? ts : null, texts.join('\n\n'), wm);
      if (g) g.tools.push(...tools);
      else attachTools(s, tools);
    } else {
      attachTools(s, tools);
    }
  }
  // subagent runs live in <projectDir>\<sessionId>\subagents\agent-*.jsonl
  try {
    const subDir = path.join(path.dirname(file), sid, 'subagents');
    if (fs.existsSync(subDir)) {
      s.subagents = fs.readdirSync(subDir).filter(f => f.endsWith('.jsonl')).length;
    }
  } catch { /* cosmetic only */ }
  const desk = desktopMeta.get(sid);
  if (desk) {
    if (desk.title) s.title = desk.title;
    if (desk.model) s.model = desk.model;
  }
  if (!s.title) s.title = summaryTitle || capTitle(s.firstUser || 'Untitled session', 60);
  s.project = guessProject(s.cwd, s.firstUser);
  return s;
}

// -------------------------------------------------- source B: Claude Desktop
function loadDesktopMeta() {
  const map = new Map(); // cliSessionId (or local id) -> meta
  if (!fs.existsSync(DESKTOP_SESSIONS)) return map;
  // metadata sits at claude-code-sessions\<account>\<workspace>\local_*.json — walk a few levels
  const walk = (dir, depth) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (depth < 3) walk(abs, depth + 1);
        continue;
      }
      const f = e.name;
      if (!f.startsWith('local_') || !f.endsWith('.json')) continue;
      try {
        const o = JSON.parse(fs.readFileSync(abs, 'utf8'));
        const key = o.cliSessionId || o.sessionId || f;
        map.set(key, {
          localId: o.sessionId || f.replace(/\.json$/, ''),
          cliSessionId: o.cliSessionId || '',
          title: o.title || '',
          model: o.model || '',
          cwd: o.cwd || '',
          createdAt: o.createdAt || null,
          lastActivityAt: o.lastActivityAt || null,
          file: abs,
          mtimeMs: fs.statSync(abs).mtimeMs,
        });
      } catch { /* skip unreadable metadata */ }
    }
  };
  walk(DESKTOP_SESSIONS, 0);
  return map;
}

function desktopStubSession(meta) {
  const s = newSession(meta.cliSessionId || meta.localId, 'claude-desktop');
  s.title = meta.title || 'Claude Desktop session';
  s.model = meta.model;
  s.cwd = meta.cwd;
  s.started = meta.createdAt ? new Date(meta.createdAt) : new Date(meta.mtimeMs);
  s.ended = meta.lastActivityAt ? new Date(meta.lastActivityAt) : s.started;
  s.project = guessProject(meta.cwd, meta.title);
  s.stubNote = 'Metadata-only record — the full transcript for this Claude Desktop session was not found on disk.';
  return s;
}

// --------------------------------------------------- source C: Antigravity
async function parseAntigravity(dir, wm) {
  const sid = path.basename(dir);
  const s = newSession(sid, 'antigravity');
  const tPath = path.join(dir, '.system_generated', 'logs', 'transcript.jsonl');
  let metaPaths = '';
  if (fs.existsSync(tPath)) {
    const rl = readline.createInterface({ input: fs.createReadStream(tPath, 'utf8'), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.trim()) continue;
      let o;
      try { o = JSON.parse(line); } catch { continue; }
      const ts = o.created_at ? new Date(o.created_at) : null;
      const valid = ts && !isNaN(ts.getTime());
      if (valid) {
        if (!s.started) s.started = ts;
        s.ended = ts;
        if (ts.getTime() > wm) s.hasNew = true;
      }
      const content = String(o.content || '');
      switch (o.type) {
        case 'USER_INPUT': {
          const m = content.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
          const meta = content.match(/<ADDITIONAL_METADATA>([\s\S]*?)<\/ADDITIONAL_METADATA>/);
          if (meta) metaPaths += ' ' + meta[1];
          pushTurn(s, 'user', valid ? ts : null, m ? m[1] : content, wm);
          break;
        }
        case 'PLANNER_RESPONSE': {
          const tools = [];
          if (Array.isArray(o.tool_calls)) {
            for (const tc of o.tool_calls) {
              const name = (tc && (tc.name || tc.tool_name || (tc.function && tc.function.name))) || 'tool';
              s.toolCalls++;
              bump(s.toolStats, name);
              tools.push(`> \u{1F527} ${name}`);
            }
          }
          const g = pushTurn(s, 'assistant', valid ? ts : null, content, wm);
          if (g) g.tools.push(...tools);
          else attachTools(s, tools);
          break;
        }
        case 'RUN_COMMAND': {
          s.toolCalls++;
          bump(s.toolStats, 'RunCommand');
          const first = content.split('\n')[0].trim();
          if (first) attachTools(s, [`> \u{1F527} RunCommand \`${cap(first, 200).replace(/`/g, "'")}\``]);
          break;
        }
        case 'VIEW_FILE': case 'LIST_DIRECTORY': case 'CODE_ACTION': case 'GREP_SEARCH': case 'GENERIC': {
          s.toolCalls++;
          bump(s.toolStats, o.type);
          break;
        }
        case 'ERROR_MESSAGE': {
          attachTools(s, [`> ⚠ ${cap(content.replace(/\r?\n/g, ' '), 300)}`]);
          break;
        }
        default: break; // SYSTEM_MESSAGE, CHECKPOINT, CONVERSATION_HISTORY, ...
      }
    }
  }
  for (const name of ['task.md', 'implementation_plan.md', 'walkthrough.md']) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) {
      try {
        const text = cap(fs.readFileSync(p, 'utf8'), 6000);
        s.artifacts.push({ name, text });
        if (name === 'task.md') s.taskMd = text;
      } catch { /* skip unreadable artifact */ }
    }
  }
  if (!s.groups.length && !s.artifacts.length) return null;
  const h = s.taskMd.match(/^#\s+(.+)$/m);
  s.title = (h && h[1].trim()) || capTitle(s.firstUser || 'Antigravity session', 60);
  s.project = guessProject(metaPaths + ' ' + s.cwd, s.firstUser);
  if (!s.started) {
    const st = fs.statSync(fs.existsSync(tPath) ? tPath : dir);
    s.started = new Date(st.mtimeMs);
    s.ended = s.started;
  }
  return s;
}

function antigravityMtime(dir) {
  let m = 0;
  const tPath = path.join(dir, '.system_generated', 'logs', 'transcript.jsonl');
  for (const p of [tPath, path.join(dir, 'task.md'), path.join(dir, 'implementation_plan.md'), path.join(dir, 'walkthrough.md')]) {
    try { m = Math.max(m, fs.statSync(p).mtimeMs); } catch { /* absent */ }
  }
  return m;
}

// ---------------------------------------------------------------- rendering
function renderSession(s) {
  const started = s.started || new Date();
  const ended = s.ended || started;
  const textTurns = s.groups.filter(g => g.text).length;
  const stats = topStats(s.toolStats);
  const fm = [
    '---',
    'type: session',
    `sessionId: ${s.sid}`,
    `source: ${s.source}`,
    `project: ${s.project}`,
    `cwd: ${yq(s.cwd)}`,
    `gitBranch: ${yq(s.gitBranch)}`,
    `started: ${isoLocal(started)}`,
    `ended: ${isoLocal(ended)}`,
    `turns: ${textTurns}`,
    `toolCalls: ${s.toolCalls}`,
  ];
  if (s.subagents) fm.push(`subagents: ${s.subagents}`);
  if (s.model) fm.push(`model: ${yq(s.model)}`);
  fm.push(`title: ${yq(s.title)}`, '---', '');

  const head = [
    `# ${localDate(started)} · ${SOURCE_LABEL[s.source] || s.source} · ${s.title}`,
    '',
    `> ${textTurns} turns · ${s.toolCalls} tool calls${stats ? ` (${stats})` : ''}${s.subagents ? ` · ${s.subagents} subagent runs` : ''}`,
    '',
  ];
  if (s.stubNote) head.push(`> ${s.stubNote}`, '');

  const tail = [];
  if (s.files.size) {
    tail.push('', '## Files touched', '');
    for (const f of [...s.files].slice(0, 40)) tail.push(`- ${f}`);
  }
  for (const a of s.artifacts) {
    tail.push('', `## Artifact: ${a.name}`, '', a.text);
  }
  tail.push('', '## Links', '');
  let links = `[[daily/${localDate(started)}|${localDate(started)}]]`;
  if (KNOWN_PROJECTS.includes(s.project)) links += ` · [[projects/${s.project}|${s.project}]]`;
  tail.push(links, '');

  const renderGroup = (g) => {
    const out = [];
    if (g.text) {
      out.push(`### ${g.ts ? localHMc(g.ts) : '—'} — ${g.role === 'user' ? 'Karan' : 'Claude'}`, '', g.text, '');
    }
    for (const t of g.tools) out.push(t);
    if (g.tools.length) out.push('');
    return out.join('\n');
  };

  for (const keep of [Infinity, 40, 20, 10]) {
    let convo;
    if (keep === Infinity || s.groups.length <= keep * 2) {
      convo = s.groups.map(renderGroup).join('\n');
    } else {
      const first = s.groups.slice(0, keep);
      const last = s.groups.slice(-keep);
      const mid = s.groups.slice(keep, -keep);
      const midTurns = mid.filter(g => g.text).length;
      const midTools = mid.reduce((n, g) => n + g.tools.length, 0);
      convo = first.map(renderGroup).join('\n') +
        `\n### [${midTurns} turns omitted — ${midTools} tool lines]\n\n` +
        last.map(renderGroup).join('\n');
    }
    const md = fm.join('\n') + head.join('\n') + '\n## Conversation\n\n' + convo + tail.join('\n');
    if (Buffer.byteLength(md, 'utf8') <= MAX_FILE_BYTES || keep === 10) return md;
  }
}

function sessionMdRel(s) {
  const started = s.started || new Date();
  return `sessions/${localDate(started)}/${localHM(started)}-${s.source}-${s.sid.slice(0, 8)}.md`;
}

// ------------------------------------------------------------ digest extracts
function makeExtract(s, mdRel, floor) {
  return {
    sid: s.sid,
    md: mdRel,
    title: s.title,
    source: s.source,
    project: s.project,
    started: s.started ? isoLocal(s.started) : '',
    ended: s.ended ? isoLocal(s.ended) : '',
    turns: s.groups.filter(g => g.text).length,
    toolCalls: s.toolCalls,
    gitBranch: s.gitBranch,
    files: [...s.files].slice(0, 15),
    firstUser: redact(s.firstUser),
    lastUsers: floor ? [] : s.lastUsers.map(redact),
    lastAssistants: floor ? [] : s.lastAssistants.map(redact),
    taskMd: floor ? '' : redact(cap(s.taskMd, 1500)),
  };
}

function extractToFloor(x) {
  return { ...x, lastUsers: [], lastAssistants: [], taskMd: '', firstUser: cap(x.firstUser || '', 300) };
}

function sessionWikilink(x) {
  return `[[${x.md.replace(/\.md$/, '')}|${x.title}]]`;
}

function fmtExtract(x) {
  const lines = [
    `### ${x.title} — ${x.project} · ${x.source}`,
    `- note: ${x.md}`,
    `- time: ${x.started} → ${x.ended} · ${x.turns} turns · ${x.toolCalls} tool calls${x.gitBranch ? ` · branch ${x.gitBranch}` : ''}`,
  ];
  if (x.files.length) lines.push(`- files: ${x.files.join(', ')}`);
  if (x.firstUser) lines.push('', 'First message from Karan:', '> ' + x.firstUser.replace(/\r?\n/g, '\n> '));
  if (x.lastUsers.length || x.lastAssistants.length) {
    lines.push('', 'Latest exchanges in this window:');
    for (const u of x.lastUsers) lines.push('- Karan: ' + u.replace(/\r?\n/g, ' '));
    for (const a of x.lastAssistants) lines.push('- Claude: ' + a.replace(/\r?\n/g, ' '));
  }
  if (x.taskMd) lines.push('', 'Task file (Antigravity):', x.taskMd);
  return lines.join('\n');
}

// ----------------------------------------------------------------- daily md
function mechanicalDaily(date, sessions, inboxItems, opts = {}) {
  const lines = ['---', 'type: daily', `date: ${date}`, '---', '', `# ${date}`, ''];
  if (opts.banner) lines.push(`> [!warning] ${opts.banner}`, '');
  if (opts.backfilled) lines.push('> Backfilled automatically from local session transcripts.', '');
  lines.push('## Sessions', '');
  if (sessions.length) {
    for (const x of sessions) {
      let l = `- ${sessionWikilink(x)} — ${x.turns} turns, ${x.toolCalls} tool calls (${x.source}`;
      if (KNOWN_PROJECTS.includes(x.project)) l += `, [[projects/${x.project}|${x.project}]]`;
      l += ')';
      lines.push(l);
    }
  } else {
    lines.push('- none');
  }
  if (inboxItems.length) {
    lines.push('', '## Inbox', '');
    for (const i of inboxItems) lines.push(`- [[${i.md.replace(/\.md$/, '')}|${i.title}]]`);
  }
  lines.push('', '## Links', '', '[[Home]]', '');
  return lines.join('\n');
}

function updateHomeRecent() {
  const home = readVaultFile('Home.md');
  if (!home || !home.includes('<!--RECENT:BEGIN-->')) return;
  const dailyDir = path.join(VAULT, 'daily');
  let days = [];
  if (fs.existsSync(dailyDir)) {
    days = fs.readdirSync(dailyDir).filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort().reverse().slice(0, 14);
  }
  const block = days.map(f => `- [[daily/${f.replace(/\.md$/, '')}|${f.replace(/\.md$/, '')}]]`).join('\n');
  const next = home.replace(/<!--RECENT:BEGIN-->[\s\S]*?<!--RECENT:END-->/, `<!--RECENT:BEGIN-->\n${block}\n<!--RECENT:END-->`);
  writeVaultFile('Home.md', next);
}

// -------------------------------------------------------------------- inbox
function processInbox(today) {
  const dir = path.join(VAULT, 'inbox');
  const items = [];
  if (!fs.existsSync(dir)) return items;
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f).toLowerCase();
    if (f.toLowerCase() === 'readme.md' || (ext !== '.md' && ext !== '.txt')) continue;
    const abs = path.join(dir, f);
    let st;
    try { st = fs.statSync(abs); } catch { continue; }
    if (!st.isFile()) continue;
    const mtime = new Date(st.mtimeMs);
    const prefix = f.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = prefix ? prefix[1] : localDate(mtime);
    const hm = localHM(mtime);
    let raw;
    try { raw = fs.readFileSync(abs, 'utf8').replace(/^﻿/, ''); } catch { continue; }
    const red = redact(raw);
    const h = red.match(/^#\s+(.+)$/m);
    const firstLine = red.split('\n').map(l => l.trim()).find(l => l);
    const title = (h && h[1].trim()) || capTitle(firstLine || f, 80);
    let base = path.basename(f, ext).toLowerCase().replace(/^\d{4}-\d{2}-\d{2}[ _-]*/, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'note';
    let rel = `sessions/${date}/${hm}-inbox-${base}.md`;
    let n = 2;
    while (fs.existsSync(path.join(VAULT, rel))) { rel = `sessions/${date}/${hm}-inbox-${base}-${n}.md`; n++; }
    const project = guessProject('', red.slice(0, 2000));
    const fm = [
      '---', 'type: session', 'source: inbox', `date: ${date}`,
      `project: ${project}`, `title: ${yq(title)}`, `filedFrom: ${yq(f)}`, '---', '',
      `# ${date} · Inbox · ${title}`, '', red.trim(), '', '## Links', '',
    ];
    let links = `[[daily/${date}|${date}]]`;
    if (KNOWN_PROJECTS.includes(project)) links += ` · [[projects/${project}|${project}]]`;
    fm.push(links, '');
    writeVaultFile(rel, fm.join('\n'));
    fs.unlinkSync(abs); // original removed only after the vault copy is written
    const item = { md: rel, title, date, project, text: cap(red, 8000) };
    items.push(item);
    if (date < today) {
      const dailyRel = `daily/${date}.md`;
      const bullet = `- [[${rel.replace(/\.md$/, '')}|${title}]]`;
      const existing = readVaultFile(dailyRel);
      if (existing) {
        let next;
        if (existing.includes('## Inbox')) next = existing.replace(/## Inbox\n/, `## Inbox\n${bullet}\n`);
        else next = existing.trimEnd() + `\n\n## Inbox\n\n${bullet}\n`;
        writeVaultFile(dailyRel, next);
      } else {
        writeVaultFile(dailyRel, mechanicalDaily(date, [], [item], { backfilled: true }));
      }
    }
    console.log(`[collect] filed inbox item ${f} -> ${rel}`);
  }
  return items;
}

// ---------------------------------------------------------------- collect
function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return { watermark: null, sessions: {} }; }
}
function saveState(state) {
  ensureDir(STATE_DIR);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

async function collect(backfill) {
  ensureDir(TMP_DIR);
  const state = loadState();
  const wm = backfill ? 0 : (state.watermark ? Date.parse(state.watermark) : 0);
  const now = new Date();
  const today = localDate(now);
  const desktopMeta = loadDesktopMeta();
  const knownIds = new Set();
  const extracts = [];       // sessions with activity in the window -> tonight's digest
  const allExtracts = [];    // every processed session (backfill overview)

  const recordSession = (s, fileAbs, mtimeMs) => {
    const mdRel = sessionMdRel(s);
    writeVaultFile(mdRel, renderSession(s));
    state.sessions[s.sid] = {
      source: s.source, file: fileAbs, mtimeMs,
      startDate: localDate(s.started || now), md: mdRel,
      lastEventTs: s.ended ? s.ended.toISOString() : '',
      title: s.title, project: s.project,
      turns: s.groups.filter(g => g.text).length, toolCalls: s.toolCalls,
    };
    const x = makeExtract(s, mdRel, false);
    allExtracts.push(extractToFloor(x));
    // backfill: the AI digest covers only the last 24h; older history goes to the overview
    const inWindow = backfill
      ? (s.ended && s.ended.getTime() > now.getTime() - 24 * 3600 * 1000)
      : s.hasNew;
    if (inWindow) extracts.push(x);
    console.log(`[collect] rendered ${mdRel} (${s.source}, ${x.turns} turns)`);
  };

  // Source A — Claude Code JSONL transcripts
  if (fs.existsSync(CLAUDE_PROJECTS)) {
    for (const proj of fs.readdirSync(CLAUDE_PROJECTS)) {
      const dir = path.join(CLAUDE_PROJECTS, proj);
      let files;
      try { files = fs.readdirSync(dir); } catch { continue; }
      for (const f of files) {
        if (!f.endsWith('.jsonl')) continue;
        const abs = path.join(dir, f);
        let st;
        try { st = fs.statSync(abs); } catch { continue; }
        if (!st.isFile()) continue;
        const sid = path.basename(f, '.jsonl');
        knownIds.add(sid);
        const prev = state.sessions[sid];
        if (!backfill && prev && prev.mtimeMs === st.mtimeMs) continue;
        try {
          const s = await parseClaudeCode(abs, wm, desktopMeta);
          if (!s.groups.length) { knownIds.add(sid); continue; }
          recordSession(s, abs, st.mtimeMs);
        } catch (e) {
          console.error(`[collect] ERROR parsing ${abs}: ${e.message}`);
        }
      }
    }
  }

  // Source B — Claude Desktop metadata stubs (only when no local transcript exists)
  for (const [cliId, meta] of desktopMeta) {
    if (knownIds.has(cliId)) continue;
    const sid = meta.cliSessionId || meta.localId;
    const prev = state.sessions[sid];
    if (!backfill && prev && prev.mtimeMs === meta.mtimeMs) continue;
    try {
      const s = desktopStubSession(meta);
      if (meta.lastActivityAt && meta.lastActivityAt > wm) s.hasNew = true;
      recordSession(s, meta.file, meta.mtimeMs);
    } catch (e) {
      console.error(`[collect] ERROR desktop stub ${sid}: ${e.message}`);
    }
  }

  // Source C — Antigravity brains
  for (const root of ANTIGRAVITY_ROOTS) {
    if (!fs.existsSync(root)) continue;
    for (const d of fs.readdirSync(root)) {
      const dir = path.join(root, d);
      let st;
      try { st = fs.statSync(dir); } catch { continue; }
      if (!st.isDirectory()) continue;
      const mtimeMs = antigravityMtime(dir);
      if (!mtimeMs) continue;
      const prev = state.sessions[d];
      if (!backfill && prev && prev.mtimeMs === mtimeMs) continue;
      try {
        const s = await parseAntigravity(dir, wm);
        if (s) recordSession(s, dir, mtimeMs);
      } catch (e) {
        console.error(`[collect] ERROR parsing antigravity ${dir}: ${e.message}`);
      }
    }
  }

  // Source D — inbox drops
  const inboxItems = processInbox(today);

  // Backfill: mechanical daily notes for every historical date (never overwrite)
  if (backfill) {
    const byDate = {};
    for (const sid of Object.keys(state.sessions)) {
      const e = state.sessions[sid];
      (byDate[e.startDate] = byDate[e.startDate] || []).push({
        md: e.md, title: e.title, source: e.source, project: e.project,
        turns: e.turns || 0, toolCalls: e.toolCalls || 0,
      });
    }
    for (const date of Object.keys(byDate).sort()) {
      if (date >= today) continue;
      if (fs.existsSync(path.join(VAULT, `daily/${date}.md`))) continue;
      byDate[date].sort((a, b) => a.md.localeCompare(b.md));
      writeVaultFile(`daily/${date}.md`, mechanicalDaily(date, byDate[date], [], { backfilled: true }));
      console.log(`[collect] mechanical daily note daily/${date}.md`);
    }
    if (allExtracts.length) {
      const bf = [
        'You are writing a one-time BACKFILL OVERVIEW for Karan Singh\'s personal-brain Obsidian vault.',
        'Karan runs outdoor-adventure ventures: The Outdoor Network (field-leader marketplace, early build), Blue Sheep Adventures (Himalayan treks), Outdoors with Karan (personal brand + website), and Karan Tracker (his daily command-center app).',
        'Below are condensed extracts of every AI work session found on his machine.',
        '',
        'Do not use any tools. Output ONE markdown document only - no preamble, no code fence around the output. Structure:',
        '- frontmatter: `type: overview`',
        `- # The story so far (as of ${today})`,
        '- ## per project (### The Outdoor Network, ### Blue Sheep Adventures, ### Outdoors with Karan, ### Karan Tracker): what was built, key decisions, current state - plain narrative',
        '- ## Timeline highlights: bullets by date, each linking its day like [[daily/2026-06-11|2026-06-11]]',
        '',
        '=== SESSION EXTRACTS ===',
        '',
        allExtracts.map(fmtExtract).join('\n\n---\n\n'),
      ].join('\n');
      fs.writeFileSync(path.join(TMP_DIR, 'backfill-input.md'), cap(bf, MAX_DIGEST_INPUT), 'utf8');
      console.log(`[collect] backfill-input.md ready (${allExtracts.length} sessions)`);
    }
    updateHomeRecent();
  }

  // Digest input for tonight
  const windowFrom = wm ? isoLocal(new Date(wm)) : '(beginning of history)';
  const summary = {
    generatedAt: isoLocal(now),
    date: today,
    window: { from: windowFrom, to: isoLocal(now) },
    backfill,
    counts: { sessions: extracts.length, inbox: inboxItems.length },
    sessions: extracts.map(x => ({ ...x })),
    inbox: inboxItems,
  };
  fs.writeFileSync(path.join(TMP_DIR, 'run-summary.json'), JSON.stringify(summary, null, 2), 'utf8');

  let exitCode = 2;
  if (extracts.length || inboxItems.length) {
    let template = '';
    try { template = fs.readFileSync(TEMPLATE_FILE, 'utf8'); } catch {
      console.error('[collect] WARN digest template missing; using minimal prompt');
      template = 'Summarize the following work sessions into a daily note.\n\n{{SESSIONS}}\n\n{{INBOX}}';
    }
    const projStatus = KNOWN_PROJECTS.map(slug => {
      const t = readVaultFile(`projects/${slug}.md`) || '';
      const m = t.match(/<!--STATUS:BEGIN-->([\s\S]*?)<!--STATUS:END-->/);
      return `### ${slug}\n${m ? m[1].trim() : '(none)'}`;
    }).join('\n\n');
    const build = (exs) => template
      .replaceAll('{{DATE}}', `${windowFrom} → ${isoLocal(now)} (audit date ${today})`)
      .replaceAll('{{DATE_ONLY}}', today)
      .replaceAll('{{PROJECT_STATUS}}', projStatus)
      .replaceAll('{{SESSIONS}}', exs.length ? exs.map(fmtExtract).join('\n\n---\n\n') : '(none)')
      .replaceAll('{{INBOX}}', inboxItems.length
        ? inboxItems.map(i => `### ${i.title}\n(filed to ${i.md})\n\n${i.text}`).join('\n\n---\n\n')
        : '(none)');
    let input = build(extracts);
    if (Buffer.byteLength(input, 'utf8') > MAX_DIGEST_INPUT) {
      console.log('[collect] digest input over budget - shrinking to floor extracts');
      input = build(extracts.map(extractToFloor));
    }
    fs.writeFileSync(path.join(TMP_DIR, `digest-input-${today}.md`), input, 'utf8');
    console.log(`[collect] digest-input-${today}.md ready (${extracts.length} sessions, ${inboxItems.length} inbox)`);
    exitCode = 0;
  } else {
    console.log('[collect] nothing new since last audit');
  }

  state.watermark = now.toISOString();
  saveState(state);
  return exitCode;
}

// ------------------------------------------------------------- apply digest
function loadSummary() {
  try { return JSON.parse(fs.readFileSync(path.join(TMP_DIR, 'run-summary.json'), 'utf8')); } catch { return null; }
}

function applyDigest(file) {
  const summary = loadSummary();
  const date = (summary && summary.date) || localDate(new Date());
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch (e) {
    console.error(`[apply] ERROR cannot read ${file}: ${e.message}`);
    return 1;
  }
  const out = redact(raw);
  const sections = [...out.matchAll(/<!--SECTION:([a-zA-Z0-9:_-]+)-->\s*([\s\S]*?)<!--END-->/g)]
    .map(m => ({ name: m[1], body: m[2].trim() }));
  const daily = sections.find(s => s.name === 'daily');
  if (!daily) {
    console.error('[apply] WARN no SECTION:daily marker - writing degraded note');
    const degraded = ['---', 'type: daily', `date: ${date}`, '---', '', `# ${date}`, '',
      '> [!warning] Digest format degraded — raw model output below.', '', out.trim(), '', '[[Home]]', ''].join('\n');
    writeVaultFile(`daily/${date}.md`, degraded);
    updateHomeRecent();
    return 0;
  }
  let body = daily.body;
  if (!/\[\[Home\]\]/.test(body)) body = body.trimEnd() + '\n\n[[Home]]\n';
  writeVaultFile(`daily/${date}.md`, body);
  console.log(`[apply] wrote daily/${date}.md`);

  for (const sec of sections) {
    if (sec.name.startsWith('project:')) {
      const slug = sec.name.slice('project:'.length);
      if (!KNOWN_PROJECTS.includes(slug)) { console.error(`[apply] WARN unknown project slug ${slug} - skipped`); continue; }
      const rel = `projects/${slug}.md`;
      let txt = readVaultFile(rel);
      if (!txt || !txt.includes('<!--STATUS:BEGIN-->')) {
        txt = ['---', 'type: project', `slug: ${slug}`, '---', '', `# ${slug}`, '', '<!--STATUS:BEGIN-->', '<!--STATUS:END-->', '', '## Timeline', ''].join('\n');
      }
      txt = txt.replace(/<!--STATUS:BEGIN-->[\s\S]*?<!--STATUS:END-->/, `<!--STATUS:BEGIN-->\n${sec.body}\n<!--STATUS:END-->`);
      if (!txt.includes(`[[daily/${date}`)) {
        const firstBullet = (sec.body.match(/^- (.+)$/m) || [null, 'updated'])[1].replace(/\[\[|\]\]/g, '');
        const line = `- [[daily/${date}|${date}]] — ${cap(firstBullet, 140)}`;
        if (/## Timeline/.test(txt)) txt = txt.replace(/## Timeline\s*\n/, `## Timeline\n\n${line}\n`);
        else txt = txt.trimEnd() + `\n\n## Timeline\n\n${line}\n`;
      }
      writeVaultFile(rel, txt);
      console.log(`[apply] updated ${rel}`);
    } else if (sec.name.startsWith('decision:')) {
      let slug = sec.name.slice('decision:'.length).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'decision';
      writeVaultFile(`decisions/${date}-${slug}.md`, sec.body + '\n');
      console.log(`[apply] wrote decisions/${date}-${slug}.md`);
    }
  }
  updateHomeRecent();
  return 0;
}

function applyBackfill(file) {
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch (e) {
    console.error(`[apply] ERROR cannot read ${file}: ${e.message}`);
    return 1;
  }
  let body = raw.trim();
  if (!/^---\n/.test(body)) body = '---\ntype: overview\n---\n\n' + body;
  writeVaultFile('daily/backfill-overview.md', body + '\n\n[[Home]]\n');
  console.log('[apply] wrote daily/backfill-overview.md');
  return 0;
}

function fallbackDigest() {
  const summary = loadSummary();
  const date = (summary && summary.date) || localDate(new Date());
  const sessions = (summary && summary.sessions) || [];
  const inbox = (summary && summary.inbox) || [];
  writeVaultFile(`daily/${date}.md`,
    mechanicalDaily(date, sessions, inbox, { banner: 'AI digest unavailable tonight (see scripts/logs) — mechanical session list below.' }));
  updateHomeRecent();
  console.log(`[fallback] wrote mechanical daily/${date}.md`);
  return 0;
}

// --------------------------------------------------------------------- main
async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--apply-digest') return applyDigest(args[1]);
  if (args[0] === '--apply-backfill') return applyBackfill(args[1]);
  if (args[0] === '--fallback-digest') return fallbackDigest();
  return collect(args.includes('--backfill'));
}

main().then(code => process.exit(code || 0)).catch(e => {
  console.error('[collect] FATAL', e);
  process.exit(1);
});
