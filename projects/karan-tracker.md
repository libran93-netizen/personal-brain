---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The vault pipeline remains complete end-to-end: `collect.mjs` harvests sessions, audits produce the daily digest and rolling project statuses, and everything is committed to the personal-brain GitHub repo.
- Reliability regressed: after two clean on-time nights (2026-07-16 and 2026-07-17), the 2026-07-18 PersonalBrainNightAudit never fired at all, and the 2026-07-19 run landed at ~23:46 instead of 22:00, covering a two-day window. The scheduler is back under suspicion and the unattended path cannot yet be called hardened.
- A missed night now also means a missing daily note — there is no [[daily/2026-07-18]] — so the pipeline may need a catch-up/backfill behavior for skipped dates, alongside the still-unhandled wrinkle of merging a midday catch-up with the evening run on the same date (as with [[daily/2026-07-16]]).
- Session-to-project classification is confirmed unreliable: the 2026-07-17 audit-run session was again auto-filed under the-outdoor-network instead of karan-tracker, the second such misfile. The collector's project tagging needs a deterministic rule (e.g., audit-run sessions always → karan-tracker).
- The Karan Tracker app itself (the daily command-center) saw no feature work in this period.
<!--STATUS:END-->

## Timeline