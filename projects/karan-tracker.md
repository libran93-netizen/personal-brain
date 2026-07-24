---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The vault pipeline remains complete end-to-end: `collect.mjs` harvests sessions, audits produce the daily digest and rolling project statuses, and everything is committed to the personal-brain GitHub repo — but its unattended reliability is now the dominant problem.
- The failure streak has widened: after the 2026-07-18 no-fire and the late 2026-07-19 run, the 2026-07-21 audit fired at 15:15 (not 22:00) and died immediately on a "Fable 5 requires usage credits" error, and no audits ran on 2026-07-22 or 2026-07-23. The 2026-07-24 run was itself an off-schedule 16:37 catch-up covering a three-day window.
- New failure mode confirmed: exhausted Claude usage credits kill the audit silently. The pipeline needs a credit check, an alert, or a fallback model so a billing state can't erase a night unnoticed.
- The backfill need is now concrete: daily notes are missing for 2026-07-18, 2026-07-21, 2026-07-22, and 2026-07-23. A catch-up/backfill behavior for skipped dates is overdue, alongside the still-unhandled merge of a midday catch-up with a same-date evening run (as with [[daily/2026-07-16]]).
- Session-to-project classification failed a third time: the 2026-07-21 audit-run session was again auto-filed under the-outdoor-network. The collector needs a deterministic rule (audit-run sessions always → karan-tracker).
- The Karan Tracker app itself (the daily command-center) saw no feature work in this period.
<!--STATUS:END-->

## Timeline