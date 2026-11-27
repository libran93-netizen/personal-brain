---
type: decision
date: 2026-11-27
project: bluesheep-adventures
---
# Decision: Adopt the customer-journey-planner skill for BSA journey design

**Context:** Karan wanted to design non-standard, dynamic-pricing customer journeys for Blue Sheep Adventures — journeys that go beyond click-and-pay booking, including group-size-based per-person pricing (e.g., ₹10,000/head at 16 people vs ₹30,000/head at 4). The first mind maps Claude produced were too technical for Karan's non-technical background to use or reuse.

**Decision:** Karan chose a simplified two-picture format — a "mountain" diagram and a one-person five-stop "story" diagram — over technical mind maps, and had Claude turn the whole process into a standing, reusable Claude Code skill called `customer-journey-planner`, invoked going forward with `/customer-journey-planner`. The skill asks a short round of multiple-choice questions, draws both pictures, and writes out an MD plan file of the features needed.

**Consequences:** Future customer-journey and pricing-design work at Blue Sheep Adventures runs through this standing skill instead of bespoke one-off chat sessions. Nine first-draft journey architectures (price-drops-together, seat-auction, date-democracy, mystery-trek, summit-quest, crew-captain, trek-registry, trek-club, the-flywheel) already exist in `os/journey-lab/` as raw material from tonight's session, but none has been selected or built yet.

[[daily/2026-11-27]] · [[projects/bluesheep-adventures]]
