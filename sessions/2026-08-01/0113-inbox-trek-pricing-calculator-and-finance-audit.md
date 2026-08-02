---
type: session
source: inbox
date: 2026-08-01
project: bluesheep-adventures
title: "2026-08-01 — Cowork session: trek cost calculator built, finances audited"
filedFrom: "2026-08-01 trek-pricing-calculator-and-finance-audit.md"
---

# 2026-08-01 · Inbox · 2026-08-01 — Cowork session: trek cost calculator built, finances audited

# 2026-08-01 — Cowork session: trek cost calculator built, finances audited

Source: Claude Desktop / Cowork chat (not auto-captured — filed via inbox).
Projects touched: Blue Sheep Adventures, Karan Tracker.

## What happened

- Ran a full audit of 16 months of bank data (2,074 transactions, Apr 2025 – Jul 2026).
  Balance chain verified end to end with zero breaks. Detailed findings are **local-only**
  in `finance/` (gitignored — bank and debt figures never sync).
- Built the **standardized factor-based trek cost calculator** that 2026-07-31's decision
  was waiting on: `Trip_PnL_Calculator.xlsx`. Calibrated against July 2026's real ground
  cost (₹18,000/guest + ₹22,000 fixed = the ₹1,30,000 actually paid to the Ladakh handler).
- Established a pricing floor: **35% gross margin after paying Karan a day rate**, and a
  **50% client deposit before any vendor payment** (true cash break-even is 47.6%).
- Key finding: the ₹35,500 package clears only ~15% at 6 guests once Karan's time is paid,
  and never reaches 35% at any headcount — ground cost is ~51% per guest, so more guests
  bring more cost with them. Price is the only lever. ₹45,000 → ~32%, ₹50,000 → ~39%.
- **Khopra Ridge Wave 1 (₹42,000 pp, 2–10 Oct 2026, 8 days) is unblocked.** At 8 guests it
  supports up to ₹19,853/head of ground cost and returns ₹1,17,600 gross profit
  (₹14,700/guest). Minimum viable group size should be 6 — at 4 guests the ceiling drops
  to ₹14,978/head with almost no room.
- Set up a recurring **Sunday 19:00 weekly money check-in** (scheduled task `weekly-money-hour`).

## Decisions taken

- Trek pricing floor set at 35% gross margin after own day rate; calculator now exists,
  superseding the 2026-07-31 deferral.
  [[decisions/2026-08-01-trek-pricing-floor|Trek pricing floor and cost calculator]]

## Open items

- Reprice all 19 itineraries through the calculator; retire ₹35,500 as legacy pricing.
- Set Khopra Wave 1 minimum group size to 6 and confirm the ground quote against ₹19,853/head.
- Security, still open from 2026-07-14 (now 2.5 weeks): rotate the Blue Sheep Adventures
  Supabase service keys, the GitHub PAT and the Vercel tokens. Vault copies were
  scrubbed, but the keys themselves should be treated as exposed. The Supabase service
  key is the urgent one — it bypasses row-level security on customer data.

## Related

- [[projects/bluesheep-adventures]]
- [[decisions/2026-07-31-2026-07-31-bsa-costing-deferred-to-calculator|Prior: costing deferred to a calculator]]

## Links

[[daily/2026-08-01|2026-08-01]] · [[projects/bluesheep-adventures|bluesheep-adventures]]
