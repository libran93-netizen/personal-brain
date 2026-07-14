---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The personal-brain vault is live under this project: `collect.mjs` harvests every AI session into markdown notes, `night-audit.ps1` produces the nightly digest, and `install-task.ps1` registers the Windows scheduled task.
- The vault syncs to the personal-brain GitHub repo (initial history committed with secrets scrubbed) and opens in Obsidian for graph-style linking between days, sessions, projects, and decisions.
- Reliability is the open issue: the first automated runs (3:35 AM) hit Claude session limits and the 4:45 AM retry task never fired, so Karan triggered the audit manually at 11:36 AM. The retry/scheduling path needs hardening.
- The Karan Tracker app itself (the daily command-center) saw no direct feature work in this period.
<!--STATUS:END-->

## Timeline