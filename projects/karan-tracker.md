---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The vault pipeline is complete end-to-end: `collect.mjs` harvests sessions, audits produce the daily digest and rolling project statuses, and everything (including the three-month backfill overview) is committed to the personal-brain GitHub repo.
- The two-night backlog is cleared: a midday catch-up audit on 2026-07-16 produced the digest covering 2026-07-14 and 2026-07-15 and refreshed all four rolling statuses.
- Scheduling stands at a single daily 22:00 PersonalBrainNightAudit task (the dead 4:45 AM retry task was deleted on 07-14). Tonight, 2026-07-16, it fired on schedule at 22:00 — the first on-time firing since the misses on the 14th and 15th.
- Reliability is still the open watch item: one on-time run doesn't prove the unattended path is hardened; the next few nights need to close out cleanly before this is considered fixed.
- New wrinkle to handle: when a catch-up audit runs midday and the scheduled run fires the same evening, two audits land on the same daily-note date (as happened today with daily/2026-07-16) — the pipeline should merge or supersede rather than duplicate.
- The Karan Tracker app itself (the daily command-center) saw no feature work in this period.
<!--STATUS:END-->

## Timeline