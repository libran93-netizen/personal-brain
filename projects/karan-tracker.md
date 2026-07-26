---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The vault pipeline remains complete end-to-end — `collect.mjs` harvests sessions, audits produce the daily digest and rolling statuses, everything commits to the personal-brain repo — but unattended reliability is still the dominant problem.
- The schedule is only partly recovered: after the 16:37 catch-up on 2026-07-24, an evening run fired the same night at 23:21 (late of the 22:00 slot), but no audit ran on 2026-07-25 and the 2026-07-26 run had to cover a two-day window. Missing daily notes now: 2026-07-18, 2026-07-21, 2026-07-22, 2026-07-23, and 2026-07-25 — a backfill mechanism for skipped dates is overdue.
- The 07-24 double run (16:37 catch-up plus 23:21 evening) reproduces the same-date merge problem from [[daily/2026-07-16]], which is still unhandled.
- The credit-exhaustion failure mode from 2026-07-21 remains unguarded: the pipeline still needs a usage-credit check, an alert, or a fallback model so a billing state can't silently erase a night.
- Session-to-project classification has now failed four times — the 2026-07-24 audit-run session was again auto-filed under the-outdoor-network. The collector needs a deterministic rule: audit-run sessions always → karan-tracker.
- The Karan Tracker app itself (the daily command-center) saw no feature work in this period.
<!--STATUS:END-->

## Timeline