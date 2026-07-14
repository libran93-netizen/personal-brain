---
type: overview
---

# The story so far (as of 2026-07-14)

Karan Singh is an outdoor instructor and educator with a background leading Himalayan treks. Over the past three months his AI work sessions trace a clear arc: first standing up a lightweight task-tracking system, then an intense mid-June sprint to research and build the Blue Sheep Adventures website, and most recently (mid-July) a shift toward infrastructure for himself — codifying his professional knowledge into reusable skills for The Outdoor Network, and building this very vault: a personal-brain memory system that collects every AI session and digests it nightly.

## The Outdoor Network

The Outdoor Network (TON) is Karan's field-leader marketplace — a platform to connect independent trip leaders, naturalists, facilitators, technical guides, and solopreneur trek operators with travelers. It is the earliest-stage of his ventures: as of mid-July there is no product build yet, but the foundational thinking has been captured in a substantial way. On 2026-07-13, in a long overnight session, Karan turned his own expertise into a set of Claude skills: a `the-outdoor-network` skill holding TON's brand positioning, voice, and two-sided messaging (leader-side and traveler-side); a `field-leader-onboarding` skill encoding his actual vetting process — intake checklist, the personal vetting call, profile requirements, and how to handle commission conversations while the revenue model is still undecided; and a `trip-curation` skill capturing his methodology for grading trek difficulty, judging altitude and acclimatization safety, evaluating seasonality, and deciding whether to put his name behind someone else's trip. A dedicated TON project memory file was also created. In effect, the "build" so far is knowledge infrastructure: any future TON content, outreach, or product work now starts from his documented standards rather than a blank page.

## Blue Sheep Adventures

Blue Sheep Adventures (BSA), the Himalayan trekking company, got the most concentrated build effort — nearly all of it in a remarkable burst starting 2026-06-11. The day began around 1:40 AM with a research-first mandate: Karan explicitly told the agent not to come back without deep research on trekking and hiking websites worldwide and in India, since the Indian audience is the target. That produced a website design plan, a DIY-pivot research document, and project conventions (CLAUDE.md files). A parallel prototype attempt ran in the Antigravity IDE the same night — under strict "ask me before executing anything" instructions — but Antigravity crashed mid-session, taking the chat with it. A recovery session that morning salvaged the thinking into HANDOFF.md and the task-tracker logs, which turned out to be a formative lesson: from then on, plans and handoffs live in files on disk, not in chat history.

That evening the actual build began. An Antigravity session built out the platform from the handoff documents, and then a marathon Claude Code session ("Now show me the front end") ran from 2026-06-11 through 2026-07-08 — 454 turns on the `feat/initial-website-build` branch. The result is a Next.js site in `d:\bluesheepadventures\web` with a distinct identity: an interactive India map component, a Himalaya configuration and trek data layer, trek cards, a chat bar, full nav/footer/layout, and an image-fetching script. On 2026-06-12 the backend work started in parallel — wiring a backend to the frontend, using NVIDIA API keys for the AI features, and pushing everything to a GitHub repo. Current state: the initial website build is substantially complete on its feature branch, making BSA the most tangible of the four ventures. A `blue-sheep-adventures` skill was also created during the July skills session, so BSA's voice and trek knowledge are now codified alongside TON's.

## Outdoors with Karan

The personal brand has the thinnest session trail so far. The clearest early activity is content work from late April 2026 — a Nepal trek advertising carousel post drafted in Claude Desktop — which sits at the intersection of BSA marketing and the personal brand. The dedicated website for Outdoors with Karan does not yet appear in any build session; the brand mostly exists implicitly, in the fact that the trip-curation and onboarding skills are explicitly written as *Karan's personal methodology* — his name and standards are the product. Expect this venture to draw directly on that skills library when the website build starts.

## Karan Tracker

Karan Tracker is his daily command-center — and it evolved in two stages. The first stage, set up on 2026-04-24, was a plain file-based tracking system at `E:\claude task tracker`: per-venture folders (e.g. `bluesheepadventures/`) each holding `index.md`, `tasks.md`, `log.md`, and `notes.md`, plus a top-level WIKI.md. This humble system proved its worth during the June 11 Antigravity crash, when the tracker logs and handoff files were what made recovery possible; it has been the connective tissue across every session since.

The second stage is the app itself (`D:\karan-tracker`) and, most recently, this vault. In a session spanning the night of 2026-07-13 into 2026-07-14, Karan set up the personal-brain memory system: a GitHub-backed vault (`personal-brain`) with a `collect.mjs` script that harvests every AI chat session on the machine, a `night-audit.ps1` script and installed scheduled task that run an end-of-day ritual, and digest prompts that turn each day's sessions into journal entries. The vault was opened in Obsidian, the first night audit committed on 2026-07-14, and this overview is part of its initial backfill. The stated goal from Karan's own first message: remember every chat session, close each day with a dialog, and roll everything up into durable memory files.

## Timeline highlights

- [[daily/2026-04-24|2026-04-24]] — Set up the file-based task management system for the website projects (`E:\claude task tracker` with per-project index/tasks/log/notes files).
- [[daily/2026-04-26|2026-04-26]] — Drafted a Nepal trek advertising carousel post in Claude Desktop; earliest marketing/content session on record.
- [[daily/2026-06-11|2026-06-11]] — The big BSA day: overnight deep research on trekking websites (Indian audience focus) producing the website design plan and DIY-pivot research; a prototype attempt in Antigravity that ended in an IDE crash; a morning recovery session that salvaged the work into HANDOFF.md and tracker logs; and, that evening, the start of both the Antigravity platform build and the long Claude Code frontend session.
- [[daily/2026-06-12|2026-06-12]] — Backend and integration sprint for BSA: backend linked to the frontend, NVIDIA API keys for the AI features, GitHub repo created and code pushed.
- [[daily/2026-07-08|2026-07-08]] — The marathon BSA frontend session (454 turns on `feat/initial-website-build`) wrapped up, leaving the initial website build substantially complete.
- [[daily/2026-07-13|2026-07-13]] — Skills development session: created the `the-outdoor-network`, `field-leader-onboarding`, `trip-curation`, and `blue-sheep-adventures` skills, codifying Karan's brand voice, vetting process, and trek-curation methodology; TON project memory established.
- [[daily/2026-07-14|2026-07-14]] — Personal-brain vault stood up: session collector, nightly audit script and scheduled task, digest prompts, Obsidian vault opened, first night audit committed, and this backfill overview written.

[[Home]]
