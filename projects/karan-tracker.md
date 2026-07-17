---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The vault pipeline is complete end-to-end: `collect.mjs` harvests sessions, audits produce the daily digest and rolling project statuses, and everything is committed to the personal-brain GitHub repo.
- Reliability is trending right: the 22:00 PersonalBrainNightAudit has now fired on schedule two nights running (2026-07-16 and 2026-07-17) after the misses on the 14th and 15th; the 07-16 run closed cleanly in ~70 seconds. A few more clean nights before calling the unattended path hardened.
- Open wrinkle #1: when a midday catch-up and the evening scheduled run land on the same daily-note date (as happened with [[daily/2026-07-16]]), the pipeline should merge or supersede rather than duplicate — still unhandled.
- Open wrinkle #2 (new tonight): session-to-project classification is unreliable — the audit-run session was filed under the-outdoor-network while a clearly-TON finance/build-spec session was filed under karan-tracker. The collector's project tagging needs a fix.
- The Karan Tracker app itself (the daily command-center) saw no feature work in this period.
<!--STATUS:END-->

## Timeline