---
type: project
slug: karan-tracker
---
# Karan Tracker

<!--STATUS:BEGIN-->
- The session-misclassification bug widened tonight: both BSA scheduled tasks (Monday CEO report, daily 9am review) were tagged karan-tracker though they're bluesheep-adventures work, and a manual digest-pipeline test run was tagged the-outdoor-network though it's vault-pipeline work — none of these three sessions are actually karan-tracker. [[sessions/2026-11-27/1236-claude-code-4b259cbd|misfiled CEO report task]] · [[sessions/2026-11-27/1236-claude-code-69257cdc|misfiled 9am review task]] · [[sessions/2026-11-27/1238-claude-code-d218ca35|misfiled digest test]]
- Both BSA automations stopped after only reading the BSA constitution file (3 tool calls each) and were interrupted before producing a report — the same failure mode flagged on prior nights, recurring for a further instance.
- The vault pipeline otherwise remains complete end-to-end; the 11-20 digest-writer OAuth failure gap remains open. [[sessions/2026-11-20/0059-claude-code-09e53174|digest-writer OAuth failure]]
- Five daily notes (07-18, 07-21, 07-22, 07-23, 07-25) are still missing; a backfill remains overdue.
- The 07-21 credit-exhaustion failure mode and the [[daily/2026-07-16]] same-date merge problem remain unhandled; no app feature work happened on Karan Tracker itself this cycle either.
<!--STATUS:END-->

## Timeline