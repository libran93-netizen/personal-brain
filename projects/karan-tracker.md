---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The vault pipeline remains complete end-to-end — `collect.mjs` harvests sessions, audits produce the daily digest and rolling statuses, everything commits to the personal-brain repo — but unattended reliability is still the dominant problem, and the Karan Tracker app itself saw no feature work in this period.
- The schedule now shows a real streak: the 2026-07-26 audit ran same-night at 23:11, the 2026-07-27 audit hit the 22:00 slot exactly (the first precisely on-time run since the troubles began), and the 2026-07-28 audit fired same-night around 22:30 — four consecutive same-night runs. Nothing structural changed, so this remains observed recovery, not guaranteed.
- Five daily notes are still missing — 2026-07-18, 2026-07-21, 2026-07-22, 2026-07-23, and 2026-07-25 — and a backfill mechanism for skipped dates is overdue. The same-date merge problem from [[daily/2026-07-16]] (reproduced by the 07-24 double run) is also still unhandled.
- The credit-exhaustion failure mode from 2026-07-21 remains unguarded: the pipeline still needs a usage-credit check, an alert, or a fallback model so a billing state can't silently erase a night.
- Session-to-project classification has now failed six times in a row — the 2026-07-27 audit-run session was again auto-filed under the-outdoor-network. The collector needs a deterministic rule: audit-run sessions always → karan-tracker.
<!--STATUS:END-->

## Timeline