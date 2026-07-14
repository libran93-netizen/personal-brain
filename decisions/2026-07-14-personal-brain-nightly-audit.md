---
type: decision
date: 2026-07-14
project: karan-tracker
---
# Decision: Build the personal-brain vault with a nightly audit

**Context:** Karan's work is spread across many AI sessions — terminal, Claude Code, other tools — with no single record of what he's working on or what's on his plate. He wanted an everyday tracker that remembers every session, works offline and online, and pushes to his personal GitHub repo.
**Decision:** Build the personal-brain Obsidian vault: every AI session is collected into a markdown note, a nightly audit writes a daily digest with rolling per-project status and decision notes, a one-time backfill covers the history since April, and everything syncs to GitHub and links together in Obsidian.
**Consequences:** From tomorrow the 10 PM audit runs on its own — Karan's work history maintains itself instead of living in scattered chats. The first automated runs failed on session limits and a retry task that never fired, so the scheduling path still needs hardening before the system is truly hands-off.

[[daily/2026-07-14]] · [[projects/karan-tracker]]
