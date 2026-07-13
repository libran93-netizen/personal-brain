---
type: session
sessionId: e75d4d97-0d74-40e2-81ef-1e8fdbbac530
source: claude-code
project: karan-tracker
cwd: "E:\\claude task tracker"
gitBranch: "HEAD"
started: 2026-07-13T13:46:36+05:30
ended: 2026-07-14T01:59:19+05:30
turns: 26
toolCalls: 33
model: "claude-sonnet-5"
title: "Outdoor Network skills development"
---
# 2026-07-13 · Claude Code · Outdoor Network skills development

> 26 turns · 33 tool calls (Bash 9, Read 5, Write 5, Glob 4, AskUserQuestion 4, …)

## Conversation

### 13:46 — Karan

npx skills update, help me find suitable skils which can help me with my task, the idea is very simple: I am an outdoor instructor. I have a background of leading multiple Himalayan treks. I work as an outdoor educator. I do curate a lot of trips as well, where I don't go on a few and where I go on a few, and I make my commissions there as well. This is my background, but one thing I lack is tech knowledge, and I'm using AI very few times in the first initial phase. I trust that you can help me out here.

I want you to help me find all the possible suitable skills that I, as an outdoor person, will require. I am also working towards this platform called The Outdoor Network, which is going to be an aggregator company or a marketplace for all the guides, all the solopreneur organizations, and experiential travel organizations that organize treks and experiential tours as well.

I want you to help me with how I could take this to the next level. How could I possibly create the necessary skills or find those certain skills? Show me and help me with all the suitable skills that you, as Claude, as a co-founder, are going to possess and have, and assist me in whatever I do.

### 13:46 — Claude

I'll start by running the skills update you asked for, then take stock of what you already have and hunt for new skills that fit your work as an outdoor educator, trip curator, and founder of The Outdoor Network.

> 🔧 Bash `npx skills update 2>&1 | head -50`
> 🔧 Bash `npx skills find travel 2>&1 | head -40`
> 🔧 Bash `npx skills find marketplace 2>&1 | head -40`
> 🔧 Bash `npx skills find itinerary 2>&1 | head -30`
> 🔧 Bash `npx skills find "pitch deck startup" 2>&1 | head -30`
> 🔧 Bash `npx skills find "social media content" 2>&1 | head -30`
> 🔧 Bash `npx skills find "business plan" 2>&1 | head -25`
> 🔧 Bash `npx skills find "customer support" 2>&1 | head -25`

### 13:49 — Claude

Done searching. Here's the full picture — and the headline is that **you already own more relevant skills than anything the public registry can offer you.** Let me break it down.

## 1. What you already have (and may not realize)

Your Claude setup already includes a marketing plugin that's been customized *for you specifically*. These trigger automatically when you ask for related work — no installation needed:

**Your two brand skills (the crown jewels):**
- **`blue-sheep-adventures`** — knows BSA's brand voice, audience, and messaging. Any content I write for the company runs through this.
- **`outdoors-with-karan`** — your personal brand voice for LinkedIn, YouTube, storytelling, and consulting positioning.

**Marketing workhorses:**
- **`campaign-plan`** — full campaign briefs with week-by-week calendars (e.g., launching a new trek season)
- **`content-creation` / `draft-content`** — blogs, social posts, landing pages, newsletters
- **`email-sequence`** — drip campaigns: inquiry → booking → pre-trek prep → post-trek review request
- **`seo-audit`** — how to get outdoorswithkaran.com ranking for "Himalayan trek" searches
- **`competitive-brief`** — research competitors (think Indiahikes, Trek The Himalayas) and find positioning gaps
- **`brand-review`** and **`performance-report`** — quality-check drafts, summarize what's working

**Business documents:** `pptx` (pitch decks), `docx` (proposals, contracts), `xlsx` (trip costing, commission tracking), `pdf` (itinerary PDFs, waivers), `canvas-design` (posters).

**The multiplier:** `skill-creator` — lets me build *new custom skills* for you, which matters most for The Outdoor Network (see section 3).

## 2. Worth installing from the public registry

The `npx skills update` you ran found nothing to update because nothing is installed through that channel yet. From my searches, only a few registry skills add something you don't already have. Install any of these by running the command shown:

| Skill | Why | Command |
|---|---|---|
| Travel planner (AI Labs) | Structured trip/itinerary planning framework | `npx skills add ailabs-393/ai-labs-claude-skills@travel-planner -g` |
| Itinerary optimizer | Day-by-day route/pacing optimization | `npx skills add onewave-ai/claude-skills@itinerary-optimizer -g` |
| Content calendar | Social posting calendar system | `npx skills add blacktwist/social-media-skills@content-calendar-sms -g` |
| Content repurposer | Turn one trek report into 10 posts | `npx skills add blacktwist/social-media-skills@content-repurposer-sms -g` |
| Startup pitch | Investor pitch structure for The Outdoor Network | `npx skills add ferdinandobons/startup-skill@startup-pitch -g` |
| Business plan writer | Formal business plan for TON | `npx skills add jk-0001/skills@business-plan -g` |

I'd honestly start with just the **content repurposer** and **startup pitch** — the rest overlap with what your marketing plugin already does. One caution: registry skills are community-made, so quality varies; we can inspect any of them before relying on it.

## 3. The real move: custom skills for The Outdoor Network

Nothing on the registry knows aggregator marketplaces for trek guides — that knowledge doesn't exist off the shelf. This is where I act as co-founder: using `skill-creator`, we build TON's operating system as skills, the same way your two brand skills were built. The ones I'd create, roughly in order:

1. **`the-outdoor-network`** (brand skill) — TON's positioning, voice, and the two-sided story: one pitch for guides/organizations joining the platform, another for travelers booking through it.
2. **`trip-curation`** — your personal method for curating trips (grading difficulty, seasonality, acclimatization pacing, what makes a trek "sellable") codified so every listing follows it.
3. **`guide-onboarding`** — checklist and templates for vetting and signing solopreneur guides and experiential travel orgs: credentials, insurance, profile content, commission terms.
4. **`commission-and-pricing`** — how you structure commissions on trips you curate vs. lead, cost sheets, margin calculators (paired with the xlsx skill).
5. **`safety-and-risk-docs`** — standardized briefing documents, waivers, emergency protocols per trek — the trust layer that makes an aggregator credible.
6. **`ton-investor-kit`** — pitch deck narrative, market sizing, and the story of why a guide-first marketplace wins in India.

Each takes one working session: you talk, I ask questions, I write the skill, and from then on it's permanent knowledge I apply automatically — exactly like your brand skills work today.

## What I'd do next

Tell me which one to start with and we'll do it now. My recommendation: **the `the-outdoor-network` brand skill first**, because every piece of content, pitch, and guide conversation flows from getting that positioning down — and you already know this story better than anyone; we just need to capture it.

### 14:04 — Karan

the-outdoor-network (brand skill) — TON's positioning, voice, and the two-sided story: one pitch for guides/organizations joining the platform, another for travelers booking through it...... Let's go ahead with this thing.

### 14:04 — Claude

Let's build it. I'm loading the skill-creator toolkit first, then I'll pull up your existing brand skills as a model before asking you the key positioning questions.

> 🔧 Skill `{"skill":"anthropic-skills:skill-creator","args":"Create a new brand skill \"the-outdoor-network\" for Karan's marketplace startup The Outdoor Network"}`
> 🔧 Glob `C:\Users\Karan singh\.claude`
> 🔧 Glob `C:\Users\Karan singh\.claude`
> 🔧 Glob `C:\Users\Karan singh\AppData\Roaming\Claude`
> 🔧 Read `C:\Users\Karan singh\AppData\Roaming\Claude\local-agent-mode-sessions\117acc2c-6ea4-49e2-b3fe-ba9183e6159e\8aaa5e70-0606-4696-bba0-1f71472aee7b\rpm\plugin_01UanV824ppnyRbUgzubyvNC\skills\blue-sheep-ad…`
> 🔧 AskUserQuestion `{"questions":[{"question":"Where is The Outdoor Network right now as a business?","header":"Stage","multiSelect":false,"options":[{"label":"Just an idea","description":"Concept stage — no guides signe…`
> 🔧 Write `C:\Users\Karan singh\.claude\skills\the-outdoor-network\SKILL.md`
> 🔧 Write `C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\project_ton.md`
> 🔧 Edit `C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\MEMORY.md`
> ⚠ tool error: <tool_use_error>File has not been read yet. Read it first before writing to it.</tool_use_error>
> 🔧 Read `C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\MEMORY.md`
> 🔧 Edit `C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\MEMORY.md`

### 14:10 — Claude

The skill is installed and live — I can see it's already registered in my available skills, meaning it will now trigger automatically whenever you mention TON, the marketplace, or guide recruitment. Now the test: here are two real pieces of content drafted *using* the new skill, so you can judge whether the brand voice feels right.

---

## ✅ Done: `the-outdoor-network` brand skill is created and active

**What it captures** (from your answers): building quietly · guides-first strategy · global scope framed as *"global network, Himalayan roots"* · revenue undecided, so it hard-blocks any content from promising commission rates or pricing.

**The voice it enforces:** *champion + credible + human* — always on the guide's side, honest about being early, never corporate marketplace-speak. Core line: **"Book the person, not the package."**

**Built-in protections you didn't ask for but need:**
- TON stays **neutral ground** — the skill forbids promoting Blue Sheep Adventures inside TON content, because other guides won't join a network that looks like a front for your own company.
- No fake traction ("thousands of guides!"), no launch-date promises while you're building quietly.

---

## Test drive — two samples written with the skill

**Sample 1: Guide recruitment DM (WhatsApp, from you to a guide you respect)**

> Namaste Tenzin bhai. Karan here — we crossed paths on the Hampta circuit in '23. I've been leading and curating treks for years, and one thing has always bothered me: the people actually keeping trekkers safe on the mountain are invisible online, while middlemen with nice websites take the cut. I'm building something to fix that — a network where your experience, your safety record, and your story are what travelers see, and where your clients stay *yours*. It's early, and I'm starting with guides I'd trust with my own group. Can I call you this week and show you what I'm thinking?

**Sample 2: LinkedIn post (your account, founder-journey content)**

> I've spent years on both sides of the trekking business.
>
> As a trek leader, I've carried the responsibility of every heartbeat in my group at 4,800 metres.
> As a curator, I've sold other people's treks and watched how the money flows.
>
> Here's what I learned: the person who matters most on any adventure — the guide — is the one the internet knows least about.
>
> No website. No reviews in one place. No way to show twenty years of mountain judgment to someone booking from a city 2,000 km away.
>
> I'm building something to change that. Quietly, for now. But if you're an independent guide anywhere in the world, I'd love to hear the one thing you wish travelers knew about your work. 👇

---

**How does the voice land?** Tell me what feels off — too soft, too salesy, wrong words, anything — and I'll tune the skill so every future piece comes out corrected. If both feel like *you*, the skill is done and we move to the next one on the list (`trip-curation` or `guide-onboarding`).

### 15:02 — Karan

It doesn't have to be a guide. It could be a trip leader. It could be a trek leader, majorly. Even if the person is a guide, it can be a trek operator as well who will himself go on treks.
You have to understand that the people who work in the field of outdoors are people who are:
- trip captains
- trip leaders
- naturalists
- facilitators
They might be technical guides, so I really don't know if I have to address them just as a guide, but I don't know what to address them as.

### 15:02 — Claude

Good catch — "guide" is too narrow and would misfire the moment you're talking to a naturalist or a trip captain. Let me fix the terminology in the skill so it reflects the real range of roles in this field.

> 🔧 Read `C:\Users\Karan singh\.claude\skills\the-outdoor-network\SKILL.md`
> 🔧 Write `C:\Users\Karan singh\.claude\skills\the-outdoor-network\SKILL.md`

### 15:03 — Claude

Updated. The skill now uses **"field leaders"** as the umbrella term instead of "guide," with a dedicated section listing the actual roles in this industry:

- **Trip leaders / trek leaders**
- **Trip captains**
- **Naturalists**
- **Facilitators**
- **Technical guides** (only used when that's the person's real title — e.g., a certified mountain guide)
- **Trek/tour operators who lead their own trips**

The rule going forward: default to "field leaders" as the collective term, but when I know a specific person's actual role, I'll use that title — a naturalist gets called a naturalist, not a guide. "Guide" is now reserved only for people whose actual job title is guide, not as a catch-all.

I also updated the recruitment content rule so outreach never mislabels someone — addressing a facilitator or trip captain as "guide" reads as not having done your homework, which cuts against the "Karan is one of them" trust point.

Does "field leaders" feel like the right umbrella term to you, or would something like "trip leaders" or "outdoor leaders" sit better in your head? That word is going to show up constantly across the marketplace, so it's worth getting right before we build more on top of it.

### 23:39 — Karan

for now lets go with this or maybe we could call them something crafty or nice like a ceo or something else

> 🔧 Skill `{"skill":"the-outdoor-network","args":"Brainstorm a crafty, ownable umbrella title for TON's field leaders (trip leaders, trip captains, naturalists, facilitators, technical guides, operators) — somet…`

### 23:40 — Claude

Good instinct — a single ownable title (like "Host" or "Creator") does more brand work than a functional label ever will. Here's a shortlist, filtered for one thing above all: it has to sound equally natural on a trip captain, a naturalist, and a facilitator — not just a mountain guide.

**Strong contenders**

- **Captain** — Already lives inside the field ("trip captain"), works across trekking, rafting, diving, and cultural trips, and carries built-in authority without sounding technical. *"Every trip on The Outdoor Network is run by a Captain."* Feels premium and is easy to turn into a status tier later (e.g., "Top Captain").
- **Wayfinder** — Poetic, evokes navigation and deep local knowledge, flatters the expertise angle. Slight risk: has roots in Polynesian navigation tradition, so worth using respectfully rather than as pure marketing flourish — but it's now common enough in business use that this is a minor flag, not a dealbreaker.
- **Host** — Instantly understood (Airbnb precedent), warm, zero explanation needed. Downside: it undersells expertise and authority — a "Host" sounds like someone who welcomes you, not someone who keeps you safe at 5,000 metres. Also invites "just an Airbnb clone" comparisons.
- **Steward** — Care and responsibility-coded, works well for conservation/naturalist-heavy content. Downside: softens the leadership/authority angle you want front and center.

**Considered and dropped**

- *Sherpa* — tempting (globally recognized shorthand for expert guide) but it's an actual ethnic group's name, and using it as a generic job title is widely seen as appropriation, especially awkward given Karan's own Himalayan roots and credibility. Ruled out.
- *Trailblazer / Pathfinder* — too generically "innovator-coded" at this point (startup-speak fatigue), doesn't read as a job title.

My pick: **Captain**. It's the one that already sounds native to the industry, scales across every activity type without translation, and has the CEO-like authority you're after — "the Captain of your trip" lands the same way "the Captain of a ship" does.

> 🔧 AskUserQuestion `{"questions":[{"question":"Which umbrella title should TON use for its field leaders, in place of the generic \"field leader\"?","header":"Umbrella Title","multiSelect":false,"options":[{"label":"Capt…`

### 23:41 — Claude

Good call — no reason to lock in a branded title before hearing how it lands with actual field leaders. The skill already defaults to "field leaders," so no changes needed there.

One suggestion for later: once you start those one-to-one recruitment conversations, drop "Captain" into a couple naturally and watch the reaction — that's a cheap, real test before it ever becomes permanent brand language. Just say the word when you want to revisit it.

### 23:41 — Karan

okay, lets move to the next skill

> 🔧 AskUserQuestion `{"questions":[{"question":"Which skill should we build next?","header":"Next Skill","multiSelect":false,"options":[{"label":"Trip Curation (Recommended)","description":"Codify how you personally judge…`

### 23:42 — Claude

Let's build **Trip Curation** — this is the skill I most need to get out of your head, since it's your personal expertise, not something I can infer from a brand guide.

I'll interview you first so the skill reflects how you actually judge a trip, not a generic template. A few questions:

1. **Difficulty grading** — Do you already use a rating scale (e.g., Easy/Moderate/Strenuous/Technical) at BSA or in your own trip notes? What factors go into it — altitude, distance/day, terrain, technical skill, fitness level required?

2. **Acclimatization/pacing rules** — What's your personal rule of thumb for altitude gain (e.g., "no more than X metres/day above 3000m," mandatory rest days at certain points)? Any Himalaya-specific pacing wisdom you always apply?

3. **What makes a trip "sellable"** — When you're deciding whether to curate/list someone else's trip (not lead it yourself), what tips it into "yes, I'll put my name behind this" vs "pass"?

4. **Red flags** — What makes you reject an operator's trip outright? (e.g., unsafe group-to-leader ratio, no permits, sketchy itinerary pacing, no insurance, poor reviews)

5. **What you need from an operator before curating** — Itinerary, permits, leader credentials, insurance proof, group size caps, cancellation policy — what's your actual checklist?

6. **Seasonality** — Do you think in terms of best/shoulder/avoid months per region, or is this trip-specific?

7. **Group size sweet spot** — Is there an ideal group size range you push for, and why?

Answer whatever's top of mind — doesn't need to be exhaustive or polished, I'll structure it.

### 23:57 — Karan

altitude, distance/day, terrain, technical skill, fitness level required? ...yes all of this is required,.......What's your personal rule of thumb for altitude gain (e.g., "no more than X metres/day above 3000m," mandatory rest days at certain points)? Any Himalaya-specific pacing wisdom you always apply? MS standards: Indian mountaineering federation. You're not supposed to cross a thousand meters in a day, but because it is the Indian Himalayas, it's very steep. We usually cross about three thousand feet. It is also the Himalayas. It's a very young mountain, and they are still growing, so it is very steep, and we tend to do a forced ascent. A forced ascent is when we push our bodies and we use ideas like climb high, sleep low methods.
The three major rules which we follow are:
- Hydration: more to do with 4 L of water.
- Pacing: mostly to do with pacing it: not going very slow, not going very fast, and getting comfortable with the speed where we are reaching the base camp before the turnaround time.
- Layering: more to do with the base layer, insulation, and hard shell. Base layer has more to do with wearing a T-shirt. Insulation is trapping your body heat, and hard shell has mostly to do with cutting the weight and not allowing any wind to come in..........What makes a trip "sellable" — When you're deciding whether to curate/list someone else's trip (not lead it yourself), what tips it into "yes, I'll put my name behind this" vs "pass"?............ Trust is reliability and safety. Mostly, if people know the face of the particular person they are going on a particular trek with, their trust goes well. Of course, safety is very strong since it's an adventure activity and reliability on what could happen and go wrong. ........Red flags — What makes you reject an operator's trip outright? (e.g., unsafe group-to-leader ratio, no permits, sketchy itinerary pacing, no insurance, poor reviews).....The red flags for me would be reliability. Reliability in the sense of:
- non-responsiveness
- commitment to the tour
- commitment to the clients
- keeping up to the word
- providing quality for what is charged
I am okay if the operator charges big, but he has to make sure that all the safety norms are met and that it is definitely registered and everything. Most of all, reliability is the main thing, reliable in terms of no last-minute............What you need from an operator before curating — Itinerary, permits, leader credentials, insurance proof, group size caps, cancellation policy — what's your actual checklist?........... All this could be used, but the only thing I want to talk about here is that, since it is India and things are not still correct out there, I think registration should help because a registered company gives a lot. Definitely, insurance certificates, group size caps, cancellation policies, veterinary, costing, everything comes, but everything should be optional and nothing should be fixed. ..........Seasonality — Do you think in terms of best/shoulder/avoid months per region, or is this trip-specific?......It is definitely seasonal, since monsoon treks are very different from winter treks, and the season also depends on the region, on where rainfall might be heavy and where rainfall might be less. Also, monsoon treks are very different. Winter treks are lower-altitude treks, and post-winter, there are high-altitude treks which cross about 5,000 m and 6,000 m above.
The challenging ones are mostly done during summer and post-summer. Between summer and monsoon are the most challenging treks, and between monsoon and winter, again, come the moderate to difficult ones. Difficulty-wise, it could be:
- Easy
- Easy to moderate
- Moderate to difficult
- Difficult
- Technical
- Difficult and technical
- Semi-technical as well............. We are connecting the guides directly to the people. I don't think this should be a worry, but an ideal group size for a guide will be 6 to 12, maybe sometimes even 15. About that would b…[truncated 217 chars]

> 🔧 Bash `ls "C:\Users\Karan singh\.claude\skills\" 2>&1`
> ⚠ tool error: Exit code 2 /usr/bin/bash: eval: line 1: unexpected EOF while looking for matching `"'
> 🔧 Glob `C:\Users\Karan singh\.claude\skills`

### 23:58 — Claude

Good, confirmed the path pattern. Writing the trip-curation skill now based on your answers.

> 🔧 Write `C:\Users\Karan singh\.claude\skills\trip-curation\SKILL.md`

### 00:01 — Claude

**Trip Curation skill built.** [SKILL.md](C:\Users\Karan singh\.claude\skills\trip-curation\SKILL.md) captures:

- **7-tier difficulty scale** (Easy → Difficult and Technical) weighted by altitude, distance/day, terrain, technical skill, fitness
- **Altitude doctrine**: IMF's 1,000m/day standard vs. the Himalayan reality of ~3,000ft forced ascents, climb-high-sleep-low, and your three non-negotiables — hydration (4L), pacing (steady, ahead of turnaround), layering (base/insulation/shell)
- **Seasonality logic**: winter = lower-altitude, post-winter = high-altitude (5-6,000m+), summer→monsoon = hardest window, monsoon→winter = moderate-difficult, with regional rainfall variance flagged
- **Curation trust filter**: reliability + safety decide everything, price never disqualifies an operator, and "does the traveler know the leader's face" is called out as the core trust driver — this ties directly into TON's "book the person, not the package" pillar
- **Red flags**: non-responsiveness, broken commitments, poor quality-for-price, last-minute unreliability
- **Operator checklist**: registration (weighted heavily given India's regulatory gaps), insurance, group caps, cancellation policy — framed as transparency signals, not a gatekeeping wall
- **Group size**: no platform-wide cap; 6–12(–15) is your personal leader benchmark, not a TON rule

Take a look and tell me if anything's off — especially the red-flag list and the operator checklist, since those will directly shape how TON vets people.

**Next up on the list:** Field Leader Onboarding, Commission & Pricing, Safety & Risk Docs, or Investor Pitch Kit — say the word when you're ready, or we can stop here for now.

### 01:01 — Karan

yes lets go next

### 01:01 — Claude

Next up: **Field Leader Onboarding** — the actual process for vetting and signing leaders onto TON. Let me ask a few things so this reflects how you'd really do it, not a generic SaaS onboarding template.

1. **First contact** — When you reach out to a potential leader (or they reach out to you), what's the actual sequence? Is it a DM/call first, then a deeper vetting step, or do you gather documents upfront?

2. **What you actually check** — Beyond what we already captured in trip-curation (registration, insurance, reliability signals), is there anything specific to *onboarding a person* rather than *evaluating a trip* — e.g., years of experience, certifications, references from past clients, a trial trip together?

3. **Profile content** — What does a leader's TON profile need to have to earn traveler trust? (Photo, bio, credentials, past trip photos, reviews, specific treks they run?)

4. **Commission conversation** — Since revenue model isn't locked yet, how do you want this skill to handle the "what's the deal" conversation with a prospective leader — vague/flexible language for now, or do you already have informal terms you're testing with early leaders?

5. **Deal-breakers** — Is there anything that makes you say no to onboarding someone even if their trips look fine (e.g., no reachability, refuses to share credentials, bad gut feeling)?

6. **Who does the onboarding** — Right now is this 100% you personally (matches the brand skill's "personal, one-to-one, from Karan" rule), or is there any part of this that's already semi-automated/templated?

### 01:26 — Karan

st contact — When you reach out to a potential leader (or they reach out to you), what's the actual sequence? Is it a DM/call first, then a deeper vetting step, or do you gather documents upfront?......initially i would prefer details, name number, mail id if exist, location, experience, company registration, interest, passion, all the possible activities, tours treks or courses the curate, maybe workshops as well, and also certificates, later have a one on one call before onboarding atleast initially just to keep things personal and make sure of the quality remains intact..........(Photo, bio, credentials, past trip photos, reviews, specific treks they run?) thay also run many other tour or adventure activities as well, Since revenue model isn't locked yet, how do you want this skill to handle the "what's the deal" conversation with a prospective leader — vague/flexible language for now, or do you already have informal terms you're testing with early leaders? as of now i do commisions where i put a mark up and sell package ahead to my client/travelers/trekkers, but i still am not sure what would be the best way to go about with this

### 01:26 — Karan

[Request interrupted by user]

### 01:46 — Karan

st contact — When you reach out to a potential leader (or they reach out to you), what's the actual sequence? Is it a DM/call first, then a deeper vetting step, or do you gather documents upfront?......initially i would prefer details, name number, mail id if exist, location, experience, company registration, interest, passion, all the possible activities, tours treks or courses the curate, maybe workshops as well, and also certificates, later have a one on one call before onboarding atleast initially just to keep things personal and make sure of the quality remains intact..........(Photo, bio, credentials, past trip photos, reviews, specific treks they run?) thay also run many other tour or adventure activities as well, Since revenue model isn't locked yet, how do you want this skill to handle the "what's the deal" conversation with a prospective leader — vague/flexible language for now, or do you already have informal terms you're testing with early leaders? as of now i do commisions where i put a mark up and sell package ahead to my client/travelers/trekkers, but i still am not sure what would be the best way to go about with this, Deal-breakers — Is there anything that makes you say no to onboarding someone even if their trips look fine (e.g., no reachability, refuses to share credentials, bad gut feeling)? yes and also yet to decide on what could be, but no response, compramise on safety and non reliability, i have one local vendor from each region like nepal prem dai runs alpine prem expeditions, Dishu i dont remember the company name, for himachal few treks, semitachnical expeditions, zipline and other adventure activities in solang, tsewang for ladakh biking expeditions localite, addventures unlimited a company run by ganesh, experiential travel from mysore but similar to bluesheep just that experiential travel, treks and tails run by a couple meghna and gautham, treks outdoor educators similar to bluesheep, deepak from uttarkashi for uttrakhand mainly gaumukh tapovan dayara bugyal and more treks in that regioin, tari bhai for roopkund, brahmatal maily uttrakhand, laxman again for uttrakhand and dham yatras, bir for kumao region of uttrakhan yet to know the treks he curates,devendar for chandrasheela and more treks yet to understand also he has a homestay at sari, pradeep for kuari pass, pangarchula again uttrakhand a different region, surender for sankri treks like kedarkanta, phulara, har ki dun bali pass, Vinayak for Gokarana, so i i have these diverse group of people who i can on board

### 01:47 — Claude

This is gold — you've basically already got TON's early supply-side network mapped out across five regions. Let me build the onboarding skill around your real process, and save this roster properly since it's foundational go-to-market data I shouldn't lose track of.

> 🔧 Read `C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\project_ton.md`
> 🔧 Write `C:\Users\Karan singh\.claude\skills\field-leader-onboarding\SKILL.md`

### 01:48 — Claude

Now updating the TON project memory with the two new skills and this roster context.

> 🔧 Edit `C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\project_ton.md`
> 🔧 Read `C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\MEMORY.md`
> 🔧 Edit `C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\MEMORY.md`

### 01:49 — Claude

**Field Leader Onboarding skill built**, and I saved your early network roster to project memory so it doesn't live only in this chat. Summary:

**The skill** ([SKILL.md](C:\Users\Karan singh\.claude\skills\field-leader-onboarding\SKILL.md)) captures:
- **Intake fields**: name, contact, location, experience, registration, passion, full activity range (not just treks — courses, workshops, other adventure activities), certificates
- **The 1:1 call as a hard rule** — never replaced by a form, protects both the personal touch and the quality bar
- **Profile rule**: capture the *full* range of what someone runs, don't box a facilitator-who-also-bikes into "trek leader"
- **Commission conversation**: never quote a number — frame early leaders as helping shape fair terms, since the model's still undecided
- **Deal-breakers**: non-response, safety compromise, unreliability — same lens as the trip-curation red flags, since vetting a person and vetting a trip are the same trust judgment

**Your roster, now documented** (13 leaders across Nepal, Himachal, Ladakh, Karnataka, and five distinct Uttarakhand sub-regions) — Prem dai, Dishu, Tsewang, Ganesh, Meghna & Gautham, Deepak, Tari bhai, Laxman, Bir, Devendar, Pradeep, Surender, Vinayak — with what's known and what's still TBD for each. This lives as a living table in the skill, and I flagged in memory that this spread is a real talking point for investors: proof TON isn't locked to one valley.

Two threads worth flagging as you move forward, not urgent:
- **Dishu's company name, Bir's specific treks, and a few other TBDs** — worth closing during your next calls with them, then just tell me and I'll update the table.
- **Commission structure** — you said you're still unsure what's best beyond your current personal markup model. When you're ready to think that through, that's exactly what the Commission & Pricing skill (still on the list) is for.

Ready for **Commission & Pricing**, **Safety & Risk Docs**, or **Investor Pitch Kit** next — or we can stop here for now.

### 01:59 — Karan

lets go next

> 🔧 AskUserQuestion `{"questions":[{"question":"Which skill should we build next?","header":"Next Skill","multiSelect":false,"options":[{"label":"Safety & Risk Docs (Recommended)","description":"Standardized briefing docs…`

## Files touched

- C:\Users\Karan singh\AppData\Roaming\Claude\local-agent-mode-sessions\117acc2c-6ea4-49e2-b3fe-ba9183e6159e\8aaa5e70-0606-4696-bba0-1f71472aee7b\rpm\plugin_01UanV824ppnyRbUgzubyvNC\skills\blue-sheep-adventures\SKILL.md
- C:\Users\Karan singh\.claude\skills\the-outdoor-network\SKILL.md
- C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\project_ton.md
- C:\Users\Karan singh\.claude\projects\E--claude-task-tracker\memory\MEMORY.md
- C:\Users\Karan singh\.claude\skills\trip-curation\SKILL.md
- C:\Users\Karan singh\.claude\skills\field-leader-onboarding\SKILL.md

## Links

[[daily/2026-07-13|2026-07-13]] · [[projects/karan-tracker|karan-tracker]]
