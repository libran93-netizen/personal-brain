---
type: session
sessionId: 276bebdb-0363-45be-a27c-17cc2a09f77b
source: claude-code
project: karan-tracker
cwd: "E:\\claude task tracker"
gitBranch: "HEAD"
started: 2026-10-13T12:42:14+05:30
ended: 2026-10-13T12:42:21+05:30
turns: 1
toolCalls: 2
title: "<scheduled-task name=\"bsa-daily-9am-review\" file=\"C:\\Users\\…"
---
# 2026-10-13 · Claude Code · <scheduled-task name="bsa-daily-9am-review" file="C:\Users\…

> 1 turns · 2 tool calls (Read 1, PowerShell 1)

## Conversation

### 12:42 — Karan

<scheduled-task name="bsa-daily-9am-review" file="C:\Users\Karan singh\.claude\scheduled-tasks\bsa-daily-9am-review\SKILL.md">
This is an automated run of a scheduled task. The user is not present to answer questions. For implementation details, execute autonomously without asking clarifying questions — make reasonable choices and note them in your output. "write" actions (e.g. MCP tools that send, post, create, update, or delete), only take them if the task file asks for that specific action. When in doubt, producing a report of what you found is the correct output.

You are the Blue Sheep Adventures orchestrator running Karan's daily 9:00 review. Karan is non-technical; be plain and brief.

1. Read D:\bluesheepadventures\CLAUDE.md (the constitution — obey its rules, especially: nothing public without Karan's yes, no invented facts, money moves only by Karan).

2. Gather the true state: check each department folder's plan.md and drafts under D:\bluesheepadventures\ (os, social, pr, performance, design, storyteller, itineraries, accounts, crm, experience, safety, website); count standardized itineraries in itineraries\ (folders containing master.md) vs 23 total known Blue Sheep treks (not all from PDFs anymore — 3 were added 3 Aug from Alpine Prem Treks' own site; only Kedarkantha still has zero source material as of 3 Aug); read crm\ledger.csv for enquiries and follow-ups due; read the newest entries in E:\claude task tracker\bluesheepadventures\log.md.

3. REFRESH THE DASHBOARD: edit the `const DATA = {...}` block near the top of the <script> in D:\bluesheepadventures\HQ.html so it reflects the true state — itineraries done/total, each track's percentage and status, the blockers list, and the timeline's current stage. Change ONLY values inside that DATA object; never alter the layout, CSS, or the localStorage logic (Karan's own orders/enquiries live there and must survive).

4. REPUBLISH TO KARAN'S PHONE: call the Artifact tool with file_path "D:\bluesheepadventures\HQ.html", url "https://claude.ai/code/artifact/18aeb37c-a13c-4944-946c-d2185aced62e", favicon "🐏", and a one-line description. This keeps the same private link so his phone always shows current data.

5. Write a short brief to D:\bluesheepadventures\morning-review.md (overwrite): today's date, the current mission (Fill Khopra Ridge — Oct 2, 2026, plus days remaining), max 5 "decide/approve today" items, max 3 "still waiting on you" items, and one line on company status. If a folder is empty, say "no items" — never invent activity.

6. Append a one-line entry to E:\claude task tracker\bluesheepadventures\log.md noting the refresh.

7. Send a push notification (under 200 chars) summarizing: how many items await him, the single most important one, and days to Khopra Ridge. Example: "BSA 9am: 3 items for review. Top: approve Khopra itinerary. 64 days to Oct 2."

Do not deploy anything public, send any message to anyone, or modify site/ or web/.
</scheduled-task>

> 🔧 Read `D:\bluesheepadventures\CLAUDE.md`
> 🔧 PowerShell `cd D:\bluesheepadventures; Get-ChildItem -Directory | ForEach-Object { $n=$_.Name; $files = Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue; "$n : $($files.Count) files, newest …`

## Files touched

- D:\bluesheepadventures\CLAUDE.md

## Links

[[daily/2026-10-13|2026-10-13]] · [[projects/karan-tracker|karan-tracker]]
