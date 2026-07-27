---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The vault pipeline remains complete end-to-end — `collect.mjs` harvests sessions, audits produce the daily digest and rolling statuses, everything commits to the personal-brain repo — but unattended reliability is still the dominant problem.
- The schedule now looks recovered: after the late 23:21 run on 2026-07-24 and the skipped 2026-07-25, the 2026-07-26 audit fired same-night at 23:11 (covering a two-day window), and the 2026-07-27 audit fired on time at 22:00 — the first on-slot run since the troubles began. Nothing structural changed, though, so this is observed recovery, not guaranteed.
- Five daily notes are still missing — 2026-07-18, 2026-07-21, 2026-07-22, 2026-07-23, and 2026-07-25 — and a backfill mechanism for skipped dates is overdue. The same-date merge problem from [[daily/2026-07-16]] (reproduced by the 07-24 double run) is also still unhandled.
- The credit-exhaustion failure mode from 2026-07-21 remains unguarded: the pipeline still needs a usage-credit check, an alert, or a fallback model so a billing state can't silently erase a night.
- Session-to-project classification has now failed five times in a row — the 2026-07-26 audit-run session was again auto-filed under the-outdoor-network. The collector needs a deterministic rule: audit-run sessions always → karan-tracker.
- The Karan Tracker app itself (the daily command-center) saw no feature work in this period.
<!--STATUS:END-->

## Timeline