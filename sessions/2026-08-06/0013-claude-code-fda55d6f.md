---
type: session
sessionId: fda55d6f-eb2c-46cf-b709-650a7d6d1760
source: claude-code
project: karan-tracker
cwd: "E:\\claude task tracker"
gitBranch: "HEAD"
started: 2026-08-06T00:13:53+05:30
ended: 2026-08-06T00:28:45+05:30
turns: 15
toolCalls: 19
title: "how do i add this. https://claude.ai/directory/connectors/a…"
---
# 2026-08-06 · Claude Code · how do i add this. https://claude.ai/directory/connectors/a…

> 15 turns · 19 tool calls (Bash 9, WebFetch 5, PowerShell 3, ToolSearch 1, Read 1)

## Conversation

### 00:13 — Karan

how do i add this. https://claude.ai/directory/connectors/ant.dir.ant.anthropic.chrome-control

### 00:14 — Claude

That link is the **Chrome control** connector (Anthropic-published) — it's the one that lets Claude drive your actual Chrome browser.

**How to add it:**

1. Open the link while signed in to claude.ai. Directory pages have a **Connect / Add** button at the top.
2. Chrome control isn't a hosted OAuth connector like Notion or Gmail — it's backed by the **Claude for Chrome extension**, so the flow sends you to install that extension in Chrome (Chrome Web Store).
3. After installing, open the extension in Chrome, sign in with the same Claude account, and grant it permission for the sites you want it to act on (it asks per-site).
4. Back in Claude, the connector shows as connected under **Settings → Connectors**.

Requirements: desktop Chrome (or a Chromium browser Anthropic supports), and a paid Claude plan — Chrome control has been gated to Max/Pro tiers.

**Two things worth knowing for your setup:**

- In *this* Claude Code session the Chrome tools (`mcp__claude-in-chrome__*`) are already present, so something is already wired up on this machine. If your goal was "let Claude use my logged-in Chrome," you may already have it — worth checking the extension icon in Chrome before installing anything.
- Separately, Claude Code has its own built-in browser pane (the `preview_*` / Browser tools) that needs no connector at all. That's the right tool for testing your own sites — OutdoorsWithKaran, the BSA build, TON. The Chrome connector is only worth it when you need your *existing logged-in sessions* (e.g. Vercel dashboard, Instagram, GSC) rather than a fresh browser.

I can't run the OAuth/install flow from here — this session is non-interactive for connector auth, and installing a browser extension is yours to click through anyway.

### 00:15 — Karan

https://github.com/diegosouzapw/OmniRoute.git.....this

> 🔧 ToolSearch `select:WebFetch,WebSearch`
> 🔧 WebFetch `https://github.com/diegosouzapw/OmniRoute`

### 00:15 — Claude

OmniRoute is a self-hosted AI gateway — it fronts many providers behind one endpoint and also ships an MCP server. So "adding" it means two different things depending on what you want.

**First, run the gateway** (it has to be running locally before anything can connect to it):

```bash
npm install -g omniroute
```

```bash
omniroute
```

Dashboard and API land on `http://localhost:20128`. Docker works too if you'd rather not install globally:

```bash
docker run -d --name omniroute --restart unless-stopped -p 127.0.0.1:20128:20128 -v omniroute-data:/app/data diegosouzapw/omniroute:latest
```

**Then, to add its MCP server to Claude Code** — this is the equivalent of the connector question from before, but it's a local server, not a claude.ai directory connector, so it goes through the CLI:

```bash
claude mcp add --transport http omniroute http://localhost:20128/api/mcp/stream
```

Run that in an interactive terminal, not here — this session can't do MCP auth or config prompts. For Claude Desktop, the same URL goes into its connector settings as a custom HTTP MCP server.

**The other use** — pointing Claude Code's own traffic through OmniRoute as a router — is a different setup (env vars for base URL + key), and it's the part I'd be careful about.

Two flags, since you'd be the one living with it:

- The MCP side is low-risk: it's a tool server, you can remove it with `claude mcp remove omniroute`.
- The gateway side is not. You'd be putting your provider API keys into a third-party binary that proxies all your AI traffic. The repo is one person's project. "290+ providers, 95% token compression" are the README's claims, not something I verified — I only read the README, not the code.

Want me to check whether the npm package is actually published and skim the source before you install anything? Or if you already decided, tell me and I'll run the install and wire up the MCP entry.

### 00:20 — Karan

yes check first

> 🔧 Bash `npm view omniroute --json 2>&1 | head -c 3000`
> 🔧 WebFetch `https://api.github.com/repos/diegosouzapw/OmniRoute`
> 🔧 Bash `npm view omniroute@latest --json 2>&1 | python -c " import json,sys d=json.load(sys.stdin) for k in ['name','version','license','homepage','repository','maintainers','scripts','bin','engines','dist']:…`
> 🔧 WebFetch `https://api.npmjs.org/downloads/point/last-week/omniroute`
> 🔧 Bash `npm view omniroute@latest --json 2>&1 | python -c " import json,sys d=json.load(sys.stdin) s=d.get('scripts') or {} hooks=[k for k in s if 'install' in k.lower() or k in ('prepare','prepublish','prepa…`
> 🔧 Bash `node --version 2>&1; echo "---npm---"; npm --version 2>&1`
> 🔧 WebFetch `https://raw.githubusercontent.com/diegosouzapw/OmniRoute/main/scripts/build/postinstall.mjs`
> 🔧 WebFetch `https://api.github.com/search/issues?q=repo:diegosouzapw/OmniRoute+is:issue+is:open+sort:updated-desc&per_page=15`

### 00:22 — Claude

Checked it. Verdict: **it's real and heavily used, but I'd install it in Docker, not globally — and I would not put your live provider API keys in it yet.**

One correction to what I said before: I called it "one person's project." Single npm maintainer is accurate, but the scale isn't — 40,571 stars, 5,359 forks, 69,782 npm downloads last week, last push today. That's a real project with real adoption, not a weekend repo.

**What came back clean**

- Package is genuinely published: `omniroute@3.8.49`, MIT, maintainer `diegosouza.pw`.
- It has **npm provenance attestation (SLSA) plus a registry signature** — meaning the tarball is cryptographically proven to have been built from that GitHub repo by CI. That's the single best signal against a tampered/typosquatted package, and a lot of popular packages don't have it.
- There **is** a `postinstall` hook (`scripts/build/postinstall.mjs`) — I read it. It repairs native SQLite bindings: falls back to `node-pre-gyp` for prebuilt binaries, else `npm rebuild`, and copies files into the package's own `dist/`. No telemetry, no machine-ID collection, no writes outside the package dir. Benign for what it claims to be.
- Your Node v26.3.0 satisfies its `engines` (`>=24 <27`). No version problem.

**What gives me pause**

- **831 MB unpacked, 21,765 files.** That is an enormous global install to drop into your Windows user profile. It bundles Next.js, Monaco, Playwright, and full docs.
- **74 runtime dependencies**, and three are worth naming: `@ngrok/ngrok` (can tunnel your local gateway to the public internet), `node-machine-id` (device fingerprinting — not used in postinstall, so it runs somewhere at runtime), and `socks`/`fetch-socks`. Probably share-your-gateway, licensing, and proxy features respectively. Not evidence of anything bad — but that's the dependency set of something that phones out, in a box you'd be handing every API key to.
- **~290 releases in under 6 months** and 691 open issues. Their own tracker currently has `🔴 main branch not green` and `🔴 Release branch not green: release/v3.8.50` citing hard test failures. The project is shipping faster than its gates are passing.
- One open issue: *"Password stops working several times a week."* Auth flakiness in a credential vault is the wrong bug to have.

**Limits of this check:** I read the manifest, the postinstall script, and issue titles. I did not audit 831 MB of source. I cannot rule out runtime telemetry.

**What I'd actually do**

Skip `npm install -g`. Run it in Docker so it's contained and one command to erase:

```bash
docker run -d --name omniroute --restart unless-stopped -p 127.0.0.1:20128:20128 -v omniroute-data:/app/data diegosouzapw/omniroute:latest
```

Feed it only a throwaway free-tier key first, poke the dashboard at `http://localhost:20128`, and see whether it earns a place. If it does, add the MCP server:

```bash
claude mcp add --transport http omniroute http://localhost:20128/api/mcp/stream
```

Blunt version, since you asked me to check rather than just install: for OWK, BSA and TON you're a solo founder running small sites — a 290-provider routing gateway solves a problem you don't obviously have, and its main pitch (free-tier model access) costs you centralizing every credential you own behind someone else's rapidly-churning code. If the draw is cheap inference for the BSA content pipeline, say so and I'll look at whether it's worth it for that specific job.

Want me to run the Docker command?

### 00:25 — Karan

I'll run the install and wire up the MCP entry.

do this

> 🔧 Bash `docker --version 2>&1 | head -5; echo "---daemon---"; docker info --format '{{.ServerVersion}}' 2>&1 | head -3`
> 🔧 Bash `which claude 2>&1; echo "---npm global root---"; npm root -g 2>&1`

### 00:26 — Claude

Docker isn't installed on this machine, so the containerized path isn't available — that leaves the global npm install you asked for. Checking headroom before I pull 831 MB into your C: drive.

> 🔧 PowerShell `Get-PSDrive C | Select-Object @{n='FreeGB';e={[math]::Round($_.Free/1GB,1)}}, @{n='UsedGB';e={[math]::Round($_.Used/1GB,1)}} | Format-List`

### 00:26 — Claude

20.8 GB free — enough, though C: is at ~94% used. Starting the install in the background since 21,765 files on Windows will take a while.

> 🔧 Bash `npm install -g omniroute --loglevel=http 2>&1 | tail -40`

### 00:26 — Claude

Install is running in the background. While it downloads, let me check the current MCP config so the new entry doesn't collide with anything.

> 🔧 Bash `claude mcp list 2>&1 | head -40`

### 00:26 — Claude

No CLI-level MCP servers configured yet (the plugin servers you saw earlier come from installed plugins, a separate mechanism), so `omniroute` will be a clean first entry with no name collision.

Current state:

- ✅ Docker checked — not installed, so global npm it is
- ✅ Disk checked — 20.8 GB free, enough for the ~831 MB unpack
- ✅ MCP config checked — empty, no conflict
- ⏳ `npm install -g omniroute` running in background

I'll wire up the MCP entry and start the gateway once the install exits — I'll wait for the actual result rather than assuming it succeeded, since a 21,765-file unpack on Windows is exactly the kind of thing that trips over path lengths or the native SQLite rebuild in that postinstall hook.

Two things worth deciding while it runs:

1. **Where the gateway binds.** Default is `http://localhost:20128`, local-only. Given the `@ngrok/ngrok` dependency, if the dashboard offers to expose it publicly, leave that off unless you specifically want remote access.
2. **What key you give it first.** My recommendation stands: start with a throwaway free-tier key, not your live Anthropic or OpenAI credentials, until you've watched its outbound traffic for a session. Nothing about the install changes that — the trust question is about runtime, not the package.

I'll report back with the install outcome.

### 00:27 — Karan

<task-notification>
<task-id>bdzmevf8b</task-id>
<tool-use-id>toolu_016wTVu62DS2ZtTGmHnscB28</tool-use-id>
<output-file>C:\Users\KARANS~1\AppData\Local\Temp\claude\E--claude-task-tracker\fda55d6f-eb2c-46cf-b709-650a7d6d1760\tasks\bdzmevf8b.output</output-file>
<status>completed</status>
<summary>Background command "Install omniroute globally via npm" completed (exit code 0)</summary>
</task-notification>

> 🔧 Read `C:\Users\KARANS~1\AppData\Local\Temp\claude\E--claude-task-tracker\fda55d6f-eb2c-46cf-b709-650a7d6d1760\tasks\bdzmevf8b.output`

### 00:27 — Claude

The install **failed**, despite the harness reporting exit code 0 — the `| tail` pipeline swallowed npm's real exit status. Actual result:

```
npm error EBUSY: resource busy or locked, rename
'...\npm\node_modules\omniroute\dist' -> '...\node_modules\.omniroute-zJm8cx8N\dist'
```

That error is more interesting than a plain failure. npm was trying to move an **existing** `omniroute\dist` out of the way — which means omniroute is already installed on this machine, and something currently holds a lock on it. Let me find out what.

> 🔧 PowerShell `$p = "C:\Users\Karan singh\AppData\Roaming\npm\node_modules\omniroute\package.json"; if (Test-Path $p) { $j = Get-Content $p -Raw | ConvertFrom-Json; "INSTALLED VERSION: $($j.version)" } else { "NOT I…`
> 🔧 PowerShell `"--- port 20128 ---"; Get-NetTCPConnection -LocalPort 20128 -ErrorAction SilentlyContinue | Select-Object State, OwningProcess -Unique | Format-Table -AutoSize; "--- node processes ---"; Get-CimInstan…`

### 00:28 — Claude

Good news — this explains everything, and it means there was nothing to install.

**omniroute 3.8.49 is already installed and already running on this machine.**

- Installed version: `3.8.49` — exactly the latest, the version I was about to fetch
- PID 960: `node ...\omniroute\dist\server-ws.mjs`, **listening on port 20128**
- PID 35968: the `bin/omniroute.mjs` launcher

That running process is what held the lock on `dist` — npm tried to rename the live directory to stage the "new" copy and hit EBUSY. No stray staging dirs were left behind, so your existing install is intact and uncorrupted. I'm deliberately **not** killing PID 960 to force the install through: you're already on latest, so the install has nothing to do.

Let me confirm the MCP endpoint is actually serving before I point Claude Code at it.

> 🔧 Bash `echo "=== base ==="; curl -s -o /dev/null -w "HTTP %{http_code}\n" --max-time 10 http://localhost:20128/ 2>&1 echo "=== /api/mcp/stream (POST initialize) ===" curl -s -i --max-time 15 -X POST http://l…`

### 00:28 — Claude

The endpoint is live but **requires authentication** — and that's where I stop.

```
HTTP/1.1 401 Unauthorized
{"error":{"code":"AUTH_001","message":"Authentication required"}}
```

That 401 is genuinely reassuring, by the way: the management routes aren't wide open to anything that can reach localhost, and the response carries a strict CSP, HSTS, and `X-Frame-Options: DENY`. Whoever built this took local auth seriously.

## Where things actually stand

| Step | Result |
|---|---|
| Install omniroute | **Not needed** — 3.8.49 (latest) already installed |
| Gateway running | **Already running**, PID 960, listening on 20128 |
| MCP endpoint reachable | Yes, responds at `/api/mcp/stream` |
| MCP entry wired | **Blocked** — needs an API key |

A caveat on my own reporting: the background task came back "exit code 0" and that was wrong. My `| tail -40` pipeline meant the shell reported *tail's* status, not npm's. The install had actually failed. I caught it by reading the output, but I set that trap myself — worth knowing since it could have had me tell you an install succeeded when it didn't.

## The one thing left, and why you should run it

You need to generate an API key from the omniroute dashboard at `http://localhost:20128`, then register the server with that key as a header.

I'm not going to take the key and run this for you — pasting a live token into a command I execute puts it in this session's tool history for no benefit. Run it yourself with your key substituted:

```bash
claude mcp add --transport http omniroute http://localhost:20128/api/mcp/stream --header "Authorization: Bearer YOUR_OMNIROUTE_KEY"
```

If that flag spelling is rejected, `claude mcp add --help` will show the exact header syntax for your CLI version — I'm confident about the transport and URL, less so about the header flag on 11.16.0.

Then verify with:

```bash
claude mcp list
```

## Worth noting

You already had this installed and running before this conversation started — so my earlier "don't hand it your API keys yet" caution was advice about a decision you'd already made. Not withdrawing the substance of it, but you're clearly further along with this tool than the question implied. If you've already got providers configured in the dashboard, the interesting question isn't whether to trust it, it's whether the MCP tool surface (104 tools across 31 scopes, per the README) is worth adding to a session that already loads a lot of plugin tools — that's a real context-budget cost on every request.

## Files touched

- C:\Users\KARANS~1\AppData\Local\Temp\claude\E--claude-task-tracker\fda55d6f-eb2c-46cf-b709-650a7d6d1760\tasks\bdzmevf8b.output

## Links

[[daily/2026-08-06|2026-08-06]] · [[projects/karan-tracker|karan-tracker]]
