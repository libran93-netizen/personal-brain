# Personal Brain night audit - runs daily at 22:00 via Task Scheduler.
# Collects AI sessions -> Claude digest -> git commit/push. Offline-safe:
# every git-network failure is a WARN, the commit always stays local.
param(
  [switch]$Backfill
)

$ErrorActionPreference = 'Continue'
$Vault    = 'D:\personal-brain'
$Scripts  = Join-Path $Vault 'scripts'
$StateDir = Join-Path $Vault '.state'
$TmpDir   = Join-Path $StateDir 'tmp'
$LogDir   = Join-Path $Scripts 'logs'
$DateStr  = Get-Date -Format 'yyyy-MM-dd'
$LogFile  = Join-Path $LogDir "night-audit-$DateStr.log"

if (-not (Test-Path $Vault)) {
  Add-Content -Path (Join-Path $env:TEMP 'night-audit-fail.log') -Value "[$(Get-Date)] vault missing: $Vault"
  exit 1
}
foreach ($d in @($TmpDir, $LogDir)) {
  if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
}

function Log([string]$msg) {
  $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg
  try { Add-Content -Path $LogFile -Value $line -Encoding UTF8 } catch {}
  Write-Host $line
}

function Add-FileToLog([string]$label, [string]$file) {
  if (Test-Path $file) {
    $txt = Get-Content $file -Raw -ErrorAction SilentlyContinue
    if ($txt) {
      $trim = $txt.Trim()
      if ($trim.Length -gt 4000) { $trim = $trim.Substring($trim.Length - 4000) }
      Log ("--- {0} ---`r`n{1}" -f $label, $trim)
    }
  }
}

# Runs a command line through cmd.exe so file redirection works and PS 5.1
# never wraps native stderr in error records. Returns exit code (9999 = timeout).
function Invoke-Native([string]$commandLine, [int]$timeoutMs) {
  $p = Start-Process -FilePath $env:ComSpec -ArgumentList ('/d /c "' + $commandLine + '"') `
        -NoNewWindow -PassThru -WorkingDirectory $Vault
  $null = $p.Handle  # PS 5.1: ExitCode is null after exit unless the handle was cached
  if (-not $p.WaitForExit($timeoutMs)) {
    try { $p.Kill() } catch {}
    return 9999
  }
  return $p.ExitCode
}

# ---- lock ------------------------------------------------------------------
$LockFile = Join-Path $StateDir 'audit.lock'
if (Test-Path $LockFile) {
  $lockPid = Get-Content $LockFile -ErrorAction SilentlyContinue | Select-Object -First 1
  $alive = $false
  if ("$lockPid" -match '^\d+$') {
    $alive = [bool](Get-Process -Id ([int]$lockPid) -ErrorAction SilentlyContinue)
  }
  if ($alive) { Log "another audit run is active (pid $lockPid) - exiting"; exit 0 }
  Log "removing stale lock (pid $lockPid)"
  Remove-Item $LockFile -Force -ErrorAction SilentlyContinue
}
Set-Content -Path $LockFile -Value $PID

try {
  $env:GIT_TERMINAL_PROMPT = '0'
  $env:GCM_INTERACTIVE     = 'Never'
  Log ('=== night audit start (backfill: {0}) ===' -f $Backfill.IsPresent)

  # ---- [1] collector -------------------------------------------------------
  $collectLog = Join-Path $TmpDir "collect-$DateStr.log"
  $mode = ''
  if ($Backfill) { $mode = ' --backfill' }
  $collectExit = Invoke-Native ('node "' + $Scripts + '\collect.mjs"' + $mode + ' > "' + $collectLog + '" 2>&1') 1800000
  Add-FileToLog 'collector output' $collectLog
  if ($collectExit -ne 0 -and $collectExit -ne 2) {
    Log "ERROR collector failed (exit $collectExit)"
    exit 1
  }
  Log "collector done (exit $collectExit)"

  # ---- resolve claude cli --------------------------------------------------
  $claude = $null
  $npmClaude = Join-Path $env:APPDATA 'npm\claude.cmd'
  if (Test-Path $npmClaude) { $claude = $npmClaude }
  if (-not $claude) {
    $ci = Get-Command claude.cmd -ErrorAction SilentlyContinue
    if (-not $ci) { $ci = Get-Command claude -ErrorAction SilentlyContinue }
    if ($ci) { $claude = $ci.Source }
  }
  if ($claude) { Log "claude cli: $claude" }
  else { Log 'WARN claude cli not found - run install-task.ps1; falling back to mechanical digest' }

  # ---- [2a] backfill overview (one-time) -----------------------------------
  if ($Backfill) {
    $bfIn = Join-Path $TmpDir 'backfill-input.md'
    if ($claude -and (Test-Path $bfIn)) {
      $bfOut = Join-Path $TmpDir 'backfill-output.md'
      $bfErr = Join-Path $TmpDir 'backfill-error.log'
      Log 'generating backfill overview with claude -p (max 15 min)...'
      $e = Invoke-Native ('"' + $claude + '" -p --output-format text < "' + $bfIn + '" > "' + $bfOut + '" 2> "' + $bfErr + '"') 900000
      $len = 0
      if (Test-Path $bfOut) { $len = (Get-Item $bfOut).Length }
      if ($e -eq 0 -and $len -gt 200) {
        Invoke-Native ('node "' + $Scripts + '\collect.mjs" --apply-backfill "' + $bfOut + '" >> "' + $collectLog + '" 2>&1') 120000 | Out-Null
        Log 'backfill overview written to daily/backfill-overview.md'
      } else {
        Log "WARN backfill overview failed (exit $e, output $len bytes) - continuing"
        Add-FileToLog 'backfill stderr' $bfErr
      }
    }
  }

  # ---- [2b/3] daily digest -------------------------------------------------
  $digestIn = Join-Path $TmpDir "digest-input-$DateStr.md"
  if ($collectExit -eq 0 -and (Test-Path $digestIn)) {
    $applied = $false
    if ($claude) {
      $digestOut = Join-Path $TmpDir "digest-output-$DateStr.md"
      $digestErr = Join-Path $TmpDir "digest-error-$DateStr.log"
      Log 'generating daily digest with claude -p (max 15 min)...'
      $e = Invoke-Native ('"' + $claude + '" -p --output-format text < "' + $digestIn + '" > "' + $digestOut + '" 2> "' + $digestErr + '"') 900000
      $len = 0
      if (Test-Path $digestOut) { $len = (Get-Item $digestOut).Length }
      if ($e -eq 0 -and $len -gt 200) {
        $a = Invoke-Native ('node "' + $Scripts + '\collect.mjs" --apply-digest "' + $digestOut + '" >> "' + $collectLog + '" 2>&1') 120000
        if ($a -eq 0) { $applied = $true; Log 'daily digest applied' }
        else { Log "WARN apply-digest failed (exit $a)" }
      } else {
        Log "WARN claude digest failed (exit $e, output $len bytes) - if this repeats, run 'claude' interactively once and /login"
        Add-FileToLog 'digest stderr' $digestErr
      }
    }
    if (-not $applied) {
      Invoke-Native ('node "' + $Scripts + '\collect.mjs" --fallback-digest >> "' + $collectLog + '" 2>&1') 120000 | Out-Null
      Log 'mechanical fallback digest written'
    }
  } elseif ($collectExit -eq 2) {
    Log 'nothing new since last audit - no digest tonight'
  }

  # ---- [4] git commit + best-effort push ------------------------------------
  & git -C $Vault add -A
  $changes = & git -C $Vault status --porcelain
  if ($changes) {
    $msg = "night audit $DateStr"
    $summaryFile = Join-Path $TmpDir 'run-summary.json'
    if (Test-Path $summaryFile) {
      try {
        $s = Get-Content $summaryFile -Raw | ConvertFrom-Json
        $msg = 'night audit {0} ({1} sessions, {2} inbox)' -f $DateStr, $s.counts.sessions, $s.counts.inbox
      } catch {}
    }
    & git -C $Vault commit -m $msg | Out-Null
    if ($LASTEXITCODE -eq 0) { Log "committed: $msg" } else { Log "WARN git commit failed (exit $LASTEXITCODE)" }
  } else {
    Log 'no vault changes to commit'
  }

  $netLog = Join-Path $TmpDir 'git-net.log'
  $e = Invoke-Native ('git -C "' + $Vault + '" fetch origin > "' + $netLog + '" 2>&1') 120000
  if ($e -eq 0) {
    & git -C $Vault rev-parse --verify --quiet origin/main | Out-Null
    if ($LASTEXITCODE -eq 0) {
      $e = Invoke-Native ('git -C "' + $Vault + '" rebase origin/main > "' + $netLog + '" 2>&1') 120000
      if ($e -ne 0) {
        Invoke-Native ('git -C "' + $Vault + '" rebase --abort > "' + $netLog + '" 2>&1') 60000 | Out-Null
        Log 'WARN remote diverged - rebase aborted, manual merge needed; commit kept locally'
      }
    }
    $e = Invoke-Native ('git -C "' + $Vault + '" push -u origin main > "' + $netLog + '" 2>&1') 180000
    if ($e -eq 0) { Log 'pushed to origin/main' }
    else {
      Log "WARN push failed (exit $e) - commit is safe locally, will retry next run"
      Add-FileToLog 'git output' $netLog
    }
  } else {
    Log 'WARN fetch failed (offline or repo missing) - commit is safe locally, will retry next run'
    Add-FileToLog 'git output' $netLog
  }

  Log '=== night audit done ==='
}
finally {
  Remove-Item $LockFile -Force -ErrorAction SilentlyContinue
}
exit 0
