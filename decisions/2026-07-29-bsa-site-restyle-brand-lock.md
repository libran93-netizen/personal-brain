---
type: decision
date: 2026-07-29
project: bluesheep-adventures
---
# Decision: Blue Sheep site — restyle, don't rebuild, brand design locked

**Context:** A long-running claude-code session had been building the Blue Sheep Adventures site frontend from scratch and was about to kick off "Day 1" of the BUILD_BRIEF plan. The brief's own design section was already stale against Karan's brand board, and two earlier style attempts — an all-light template look and an all-dark "cloudy" look — had already been tried and rejected.

**Decision:** Karan interrupted the from-scratch rebuild and instead directed a restyle-only pass on the existing pages, WhatsApp booking links, and seats-left logic, adopting a fixed hybrid brand system: dark cinematic navy (#0B1D2A) confined to the hero and final CTA/footer, light rock-grey (#E7E8EA) body sections with deep navy text, small orange (#FF8A00) section labels with underline rules, a circular badge/stamp logo, a Caveat handwriting font for mascot Blu's quotes, and a torn-paper edge on the final CTA card. Blu is never drawn in code — only real renders from `D:\bluesheepadventures\brand\blu\`, with a name-plus-quote placeholder until those exist.

**Consequences:** The Antigravity restyle session executed this in one pass across every page and verified it on a local dev server (nothing deployed). Future BSA frontend work should extend this system rather than re-litigate style, and any implementation that draws Blu as an SVG or drifts back toward either rejected look should be treated as a regression.

[[daily/2026-07-29]] · [[projects/bluesheep-adventures]]
