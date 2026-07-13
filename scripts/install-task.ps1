# One-time setup for the Personal Brain night audit. Idempotent - safe to re-run.
# Scaffolds the vault, installs the Claude Code CLI, configures git, registers
# the 22:00 scheduled task, and (unless -SkipBackfill) runs the first backfill.
param(
  [switch]$SkipBackfill,
  [switch]$SkipTask,
  [switch]$SkipNpm
)

$ErrorActionPreference = 'Continue'
$Vault   = 'D:\personal-brain'
$Scripts = Join-Path $Vault 'scripts'

function Say([string]$m) { Write-Host ('[install] ' + $m) }

# ---- 1. folders --------------------------------------------------------------
foreach ($d in @('daily','sessions','projects','decisions','inbox','scripts\prompts','scripts\logs','.state\tmp')) {
  $p = Join-Path $Vault $d
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
}
Say 'vault folders ready'

# ---- 2. seed files (never overwrites an existing file) ------------------------
function Seed([string]$rel, [string]$content) {
  $p = Join-Path $Vault $rel
  if (-not (Test-Path $p)) {
    $lf = $content.Replace("`r`n", "`n")
    [System.IO.File]::WriteAllText($p, $lf, (New-Object System.Text.UTF8Encoding($false)))
    Say ('seeded ' + $rel)
  }
}

Seed 'Home.md' @'
---
type: home
---
# Personal Brain

Daily AI session tracker - auto-updated every night at 22:00 by the night audit.

## Projects
- [[projects/the-outdoor-network|The Outdoor Network]]
- [[projects/bluesheep-adventures|Blue Sheep Adventures]]
- [[projects/outdoors-with-karan|Outdoors with Karan]]
- [[projects/karan-tracker|Karan Tracker]]

## Recent days
<!--RECENT:BEGIN-->
<!--RECENT:END-->

## Capture claude.ai / voice chats
Drop pasted chats as `.md` or `.txt` files into the `inbox` folder - they are
filed automatically at the next audit. Name files `YYYY-MM-DD topic.md` to
control which day they land on.

## External
- Backfill overview: [[daily/backfill-overview|Backfill overview]]
- Task tracker wiki (outside this vault): E:\claude task tracker\WIKI.md
'@

$projects = [ordered]@{
  'the-outdoor-network'  = 'The Outdoor Network'
  'bluesheep-adventures' = 'Blue Sheep Adventures'
  'outdoors-with-karan'  = 'Outdoors with Karan'
  'karan-tracker'        = 'Karan Tracker'
}
foreach ($slug in $projects.Keys) {
  $title = $projects[$slug]
  $body = @"
---
type: project
slug: $slug
---
# $title

<!--STATUS:BEGIN-->
- (no status yet - the night audit fills this in)
<!--STATUS:END-->

## Timeline
"@
  Seed ('projects\' + $slug + '.md') $body
}

Seed 'inbox\README.md' @'
# Inbox

Drop claude.ai web chats, voice-chat transcripts, or any other notes here as
`.md` or `.txt` files. The nightly audit (22:00) files each one into
`sessions\<date>\` and mentions it in that day's daily note, then removes the
original from this folder.

- Name files `YYYY-MM-DD topic.md` to control the date; otherwise the file's
  modified time is used.
- Plain pasted chat text is fine - no special format needed.
'@

Seed '.gitignore' @'
scripts/logs/
.state/tmp/
.state/audit.lock
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/cache/
.trash/
'@
Say 'seed files ready'

# ---- 3. Claude Code CLI --------------------------------------------------------
$npmClaude = Join-Path $env:APPDATA 'npm\claude.cmd'
if (-not (Test-Path $npmClaude)) {
  if ($SkipNpm) {
    Say 'WARN claude cli not installed and -SkipNpm given - digests will use the mechanical fallback'
  } else {
    Say 'installing Claude Code CLI (npm install -g @anthropic-ai/claude-code)...'
    & npm install -g '@anthropic-ai/claude-code'
  }
}
if (Test-Path $npmClaude) {
  $v = & $npmClaude --version
  Say ('claude cli ready: ' + $v)
  Say 'auth: uses your existing Claude login; if nightly digests ever fail with auth errors, run claude once and /login'
} else {
  Say 'WARN claude cli not found - nightly notes will be mechanical (no AI digest) until it is installed'
}

# ---- 4. git ---------------------------------------------------------------------
if (-not (Test-Path (Join-Path $Vault '.git'))) {
  & git -C $Vault init -b main | Out-Null
  Say 'git repo initialized (branch main)'
}
& git -C $Vault config user.name 'Karan Singh'
& git -C $Vault config user.email 'libran93@gmail.com'
& git -C $Vault config core.autocrlf false
$remotes = & git -C $Vault remote
if ($remotes -contains 'origin') {
  & git -C $Vault remote set-url origin 'https://github.com/libran93-netizen/personal-brain.git'
} else {
  & git -C $Vault remote add origin 'https://github.com/libran93-netizen/personal-brain.git'
}
Say 'git remote: https://github.com/libran93-netizen/personal-brain.git'

& git -C $Vault rev-parse --verify --quiet HEAD | Out-Null
if ($LASTEXITCODE -ne 0) {
  & git -C $Vault add -A
  & git -C $Vault commit -m 'initial personal-brain scaffold' | Out-Null
  Say 'initial commit created'
}

$env:GIT_TERMINAL_PROMPT = '0'
& cmd /d /c ('git -C "' + $Vault + '" ls-remote origin >nul 2>&1')
if ($LASTEXITCODE -eq 0) {
  Say 'GitHub remote reachable - nightly pushes will work'
} else {
  Say 'NOTE: github.com/libran93-netizen/personal-brain is not reachable yet.'
  Say '      Create a PRIVATE, EMPTY repo named "personal-brain" on GitHub (no README),'
  Say '      then the next nightly audit will push everything automatically.'
}

# ---- 5. scheduled task ------------------------------------------------------------
if (-not $SkipTask) {
  $action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument ('-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $Scripts + '\night-audit.ps1"') `
    -WorkingDirectory $Vault
  $trigger  = New-ScheduledTaskTrigger -Daily -At (Get-Date -Hour 22 -Minute 0 -Second 0)
  $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
    -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2) -MultipleInstances IgnoreNew
  Register-ScheduledTask -TaskName 'PersonalBrainNightAudit' -Action $action -Trigger $trigger `
    -Settings $settings -Description 'Nightly AI session audit into D:\personal-brain' -Force | Out-Null
  Say 'scheduled task "PersonalBrainNightAudit" registered: daily 22:00, catches missed runs on next wake/logon'
}

# ---- 6. first backfill -------------------------------------------------------------
if (-not $SkipBackfill) {
  Say 'running first backfill (this can take several minutes)...'
  & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Scripts 'night-audit.ps1') -Backfill
}

Say '--- done ---'
Say 'Next steps:'
Say '  1. Open Obsidian -> "Open folder as vault" -> D:\personal-brain'
Say '  2. Drop claude.ai / voice chat text into D:\personal-brain\inbox anytime'
Say '  3. The night audit runs silently every day at 22:00'
