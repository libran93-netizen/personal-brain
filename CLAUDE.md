# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not an application codebase** — it's Karan Singh's `personal-brain` Obsidian vault: a
git-synced journal that automatically captures his AI work sessions (Claude Code, Claude Desktop,
Google Antigravity) plus manually-dropped notes, and turns them into a searchable daily journal
with cross-linked projects and decisions. The only real "code" is a single Node.js collector
script and two Windows PowerShell wrappers that drive a nightly scheduled task on Karan's machine.

There is no build, lint, or test suite. There is no `package.json` — `scripts/collect.mjs` runs
directly with `node` (ESM, via the `.mjs` extension).

## The nightly automation pipeline

Everything here is produced by `scripts/night-audit.ps1`, run daily at 22:00 by a Windows
Scheduled Task (registered by `scripts/install-task.ps1`) on Karan's machine at `D:\personal-brain`.
This container/session will not have that scheduler, the referenced local paths
(`C:\Users\...\.claude\projects`, `%APPDATA%\Claude\...`, `~\.gemini\antigravity*\brain`), or a
working `claude` CLI on PATH — treat those as documentation of production behavior, not something
runnable here.

Pipeline, in order:

1. **Collect** (`node scripts/collect.mjs [--backfill]`) — reads a `.state/last-run.json`
   watermark, then scans four sources and renders one Markdown note per session into
   `sessions/<date>/<HHMM>-<source>-<id8>.md`:
   - **A. Claude Code**: `~/.claude/projects/<slug>/*.jsonl` transcripts
   - **B. Claude Desktop**: `%APPDATA%/Claude/claude-code-sessions/**/local_*.json` (metadata-only
     stub if no matching local transcript exists)
   - **C. Google Antigravity**: `~/.gemini/antigravity*/brain/<uuid>/.system_generated/logs/transcript.jsonl`
     (+ `task.md` / `implementation_plan.md` / `walkthrough.md` artifacts)
   - **D. Inbox**: `.md`/`.txt` files manually dropped in `inbox/`, filed into `sessions/` and
     deleted from `inbox/` after filing
   All rendered text is passed through `redact()` (see below) before it ever touches disk.
   Progress is tracked in `.state/last-run.json` (per-session mtime + watermark), so re-running is
   incremental and idempotent — only sessions with new content since the watermark feed the digest.
2. **Digest** — collect.mjs writes `.state/tmp/digest-input-<date>.md` by filling
   `scripts/prompts/digest-system.md` with tonight's session extracts, inbox items, and each
   project's current `<!--STATUS:BEGIN-->…<!--STATUS:END-->` block. `night-audit.ps1` pipes that
   into `claude -p --output-format text` to get an AI-written journal entry, then applies it with
   `node scripts/collect.mjs --apply-digest <output-file>`, which parses `<!--SECTION:name-->…
   <!--END-->` blocks out of the model output and writes/updates `daily/<date>.md`,
   `projects/<slug>.md` (status block + timeline), and `decisions/<date>-<slug>.md`.
3. **Fallback** — if the `claude` CLI is missing, unauthenticated, or produces a short/failed
   response, `--fallback-digest` writes a mechanical `daily/<date>.md` (plain session list, no
   narrative) instead, flagged with an `[!warning]` callout.
4. **Backfill** (`--backfill` flag) is a one-time historical pass: processes *all* history
   regardless of watermark, writes a mechanical daily note for every past date that doesn't have
   one yet, and asks Claude to write `daily/backfill-overview.md` (a single narrative covering
   every project from the start).
5. **Commit + push** — `git add -A`, commit as `night audit <date> (<N> sessions, <M> inbox)`,
   then best-effort `fetch` → `rebase origin/main` → `push`. Every network step is a WARN on
   failure, not a fatal error — the commit always lands locally first, so this script never loses
   work even fully offline; it just retries the push next run.

Manual collector invocations for reference (not runnable in this environment without a real
`~/.claude/projects` tree, but useful for reading the code):
```
node scripts/collect.mjs                        # incremental collect (what the nightly task runs)
node scripts/collect.mjs --backfill              # full historical pass
node scripts/collect.mjs --apply-digest <file>   # split an AI digest response into vault files
node scripts/collect.mjs --apply-backfill <file> # write daily/backfill-overview.md
node scripts/collect.mjs --fallback-digest       # mechanical daily note (no AI call)
```
Exit codes from the base `collect` mode: `0` = digest input was written and is ready, `2` =
nothing new since the watermark (expected, not an error), `1` = a real failure.

## Vault structure

| Path | Contents |
|---|---|
| `Home.md` | Vault index: project links, an auto-maintained `<!--RECENT:BEGIN-->…<!--RECENT:END-->` block (last 14 daily notes, rewritten by `updateHomeRecent()` after every apply/backfill), and the inbox how-to. |
| `daily/YYYY-MM-DD.md` | One note per day: `## What happened`, `## Decisions taken`, `## Tasks completed`, `## Per-project status`, `## Sessions`, `## Inbox` (AI-written), or a mechanical session list (fallback). |
| `daily/backfill-overview.md` | One-time AI-written narrative covering the vault's full history, per project. |
| `projects/<slug>.md` | One of exactly four known projects (see below). Body's `<!--STATUS:BEGIN-->…<!--STATUS:END-->` is the *current* rolling status, fully replaced on each relevant digest; `## Timeline` accumulates dated one-line bullets pointing back to daily notes. |
| `decisions/<date>-<slug>.md` | Point-in-time decision records: `**Context:**` / `**Decision:**` / `**Consequences:**`, linked back to a daily note and a project. |
| `sessions/<date>/<HHMM>-<source>-<id>.md` | Raw-ish rendered transcripts (frontmatter + turn-by-turn conversation, truncated/collapsed if oversized) — the atomic unit everything else summarizes. Never hand-edit; regenerated from source transcripts. |
| `inbox/` | Drop zone only. Files here are transient — the collector moves their content into `sessions/` and deletes the original inbox file every run. Only `README.md` is meant to persist here. |
| `scripts/` | The collector (`collect.mjs`), the two Windows automation scripts, and `scripts/prompts/digest-system.md` (the LLM system prompt / output contract for the nightly digest). |
| `.state/` | `last-run.json` (watermark + per-session mtime cache) and `tmp/` (digest inputs/outputs, logs — gitignored). |
| `finance/` | **Gitignored on purpose** (see `.gitignore` comment: "Local-only: personal finance notes — never sync bank/debt data"). Never add, commit, or push anything under `finance/`, and never remove it from `.gitignore`. |

## Conventions to preserve

- **The four project slugs are closed-set**: `the-outdoor-network`, `bluesheep-adventures`,
  `outdoors-with-karan`, `karan-tracker`. Both `collect.mjs` (`KNOWN_PROJECTS`) and the digest
  prompt hard-code this list; a session/decision either belongs to one of these four or is
  `project: unsorted`. Don't invent new project slugs or files without updating both places.
- **Wikilinks are path-style without the extension**: `[[daily/2026-07-14]]`,
  `[[projects/karan-tracker|Karan Tracker]]`, `[[sessions/2026-07-14/2214-claude-code-1cc903e3|Session title]]`.
- **Frontmatter `type:`** distinguishes note kinds: `home`, `daily`, `project`, `decision`,
  `session`, `overview`. Keep it consistent when creating or editing notes by hand.
- **Marker comments are load-bearing** and parsed by regex in `collect.mjs` — don't reformat or
  remove them: `<!--RECENT:BEGIN-->…<!--RECENT:END-->` in `Home.md`, `<!--STATUS:BEGIN-->…
  <!--STATUS:END-->` in each project note, and `<!--SECTION:name-->…<!--END-->` in raw digest
  output (parsed by `applyDigest`).
- **Redaction runs on every write path** (`redact()` in `collect.mjs`): GitHub/Vercel/Anthropic/AWS/
  Slack/Supabase tokens, JWTs, Bearer headers, PEM private keys, generic `key=`/`token=`/`secret=`
  key-value pairs, and Postgres connection-string passwords are all replaced with `[REDACTED]`
  before anything is written to `sessions/`, `daily/`, or `.state/tmp/`. If you're writing code
  that touches session content, route it through `redact()` rather than writing raw transcript
  text.
- **Session notes are append-only artifacts**, not hand-edited prose — they can be very large
  (`MAX_FILE_BYTES` = 300KB) and get progressively trimmed (keep last 40/20/10 turn pairs with a
  "turns omitted" marker) if they don't fit.
- **Decision notes are for real deliberate choices** (per `digest-system.md`), not routine task
  completions — that distinction matters if you're generating or editing one.

## Working in this repo

- This session develops on branch `claude/claude-md-docs-jrm4ne`; the automated nightly audit
  commits and pushes directly to `main` from Karan's own machine. Don't assume `main`'s tip
  reflects reviewed work — it's machine-generated journal content, committed unattended every
  night.
- Since there's no build/test tooling, "verifying a change" to `collect.mjs` means reasoning
  through the parsing/rendering logic directly (or running it against a small synthetic
  `~/.claude/projects` fixture) — there's no CI here to lean on.
