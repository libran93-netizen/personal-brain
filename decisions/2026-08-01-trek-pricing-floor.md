---
type: decision
date: 2026-08-01
project: bluesheep-adventures
---
# Decision: Trek pricing floor — 35% gross margin after paying yourself, and the cost calculator now exists

**Context:** On 2026-07-31 Karan deferred all trek costing across the 19-itinerary catalog, including Everest Base Camp, until a standardized factor-based cost calculator existed rather than pricing treks one at a time ([[decisions/2026-07-31-2026-07-31-bsa-costing-deferred-to-calculator|prior decision]]). Separately, a full audit of 16 months of bank data showed that at least one 2026 trip ran at negative gross margin and was covered by borrowing, because no trip had ever been costed before vendors were committed.

**Decision:** The calculator is built (`Trip_PnL_Calculator.xlsx`, in the Cowork outputs folder) and calibrated against a real trip — July 2026's ground cost of ₹18,000/guest plus ₹22,000 fixed, which is exactly what was paid to the Ladakh ground handler. Three rules now govern pricing:

1. **35% minimum gross margin, calculated after paying Karan a day rate** (₹3,500/day baseline). Below the floor, the trip does not run.

   **Reconciled with the existing 25–35% markup methodology** in the commission-and-pricing skill. Markup is measured against cost, margin against price, so they never match: 25% markup = 20.0% margin, 35% markup = 25.9% margin. A 35% margin requires roughly 55–60% markup once gateway charges and contingency are included. Both rules are correct, for different delivery models:
   - **Curating** (someone else leads): 25–35% markup stands, unchanged. There is no cost of Karan's time in the trip, so a 20–26% margin is close to take-home. This matches what Karan said on 13 Jul — "since i dont lead there is no expense of mine so i end up making more."
   - **Leading** (Karan is on the mountain): his day rate enters the cost base *before* markup is applied, and the markup rises to 55–60%. July 2026 was priced at ~55% markup on ground cost, showed a 36% margin, and fell to ~15% once his time was counted.
2. **50% client deposit before any vendor payment.** The calculator puts true cash break-even at 47.6% given ~60% of vendor money leaves before departure.
3. **Cost is derived from factors** — per-guest ground cost, per-night accommodation, per-day food, permits, plus whole-trip fixed costs (transport, staff, porters, kit, marketing, Karan's time) with a contingency percentage — not set trek by trek.

**Consequences:** The catalog can now be costed. The headline finding is that the ₹35,500 package clears only ~15% at 6 guests once Karan's own time is paid, and **never reaches 35% at any headcount**, because ground cost runs ~51% per guest — adding guests adds cost with them. Price is the only lever that works: ₹45,000 → ~32%, ₹50,000 → ~39%. Existing itineraries priced near ₹35,500 need repricing before they are sold, not after.

**Khopra Ridge Wave 1 (₹42,000 pp, 2–10 Oct 2026, 8 days)** is viable and no longer blocked. At that price the maximum ground cost that still clears 35% is:

| Guests | Max ground cost per head | Total ground budget |
|---|---|---|
| 4 | ₹14,978 | ₹59,915 |
| 6 | ₹18,228 | ₹1,09,373 |
| 8 | ₹19,853 | ₹1,58,831 |
| 10 | ₹20,828 | ₹2,08,289 |
| 12 | ₹21,478 | ₹2,57,747 |

At 8 guests that is ₹1,17,600 gross profit, ₹14,700 per guest. Since July's comparable ground cost was ₹18,000/head, Khopra at ₹42,000 works provided the ground quote stays under roughly ₹19,850/head — but it has almost no room at 4–6 guests, so the minimum viable group size should be set at 6.

**Catalog state:** of the 19 itineraries, only Khopra Ridge carries a live price. Every other trek is `PENDING(Accounts pricing session)` by the 31 Jul policy, so this is first-time pricing rather than repricing. `BSA_Pricing_Worksheet.xlsx` is the tool for that session — enter each trek's ground cost and it returns the price, the implied markup and the margin.

Because no cost sheets exist yet, the worksheet also works backwards: for each trek that has a reference price in its source PDF, it computes the maximum ground cost per head that price can carry at 35%. Two results stand out — **Brahmatal and Dayara Bugyal at ₹9,500 leave under ₹1,600 per head to cover all ground cost on a 6-day trek**, which is not survivable. Those two prices need fixing before anything else in the catalog. Roopkund at ₹15,000 over 8 days is the next tightest at ₹3,957. For scale, July 2026's actual ground cost was ₹18,000 per head.

**Data conflicts still open:** Annapurna Base Camp carries three different source prices (₹48,300 / ₹38,300 / ₹33,950); Friendship Peak and Yunam Peak both state ₹30,000; Everest Base Camp's ₹39,450–₹94,850 range has no stated tiering logic. Khopra's batch dates also differ between sources — the itinerary says 2–9 Oct 2026, the project note says 2–10 Oct.

Next: hold the Accounts pricing session with real operator quotes, starting with Brahmatal and Dayara Bugyal.

[[projects/bluesheep-adventures]] · [[Home]]
