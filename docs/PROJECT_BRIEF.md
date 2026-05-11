# Project Brief — Summit Resources Web App

| Prepared for | Joshua Shields, Summit Resources |
|---|---|
| **Status** | Draft v0.1 |
| **Date** | 2026-05-07 |
| **Companion docs** | [PRD.md](./PRD.md) (full product spec) · [ARCHITECTURE.md](./ARCHITECTURE.md) (technical spec) · [DECISIONS.md](./DECISIONS.md) (decisions log) |

---

## 1. The Short Version

You currently run your labour resourcing business across **10+ separate platforms** (Google Sheets, Airtable, Tally, Make.com, Documint, Superchat, Twilio, Adobe Sign, Google Drive, Gmail) stitched together by automation. It works, but it costs you time every day in context switching, manual fixes, and chasing missing information.

**We're building a single web application that replaces five of those platforms and integrates with the rest** — giving you one place to run your entire workflow from work order to client handoff.

You'll keep using **Superchat** (for SMS conversations), **Adobe Sign** (for e-signatures), and **Twilio** (under the hood for SMS) — those work well today. Everything else consolidates into the new app.

---

## 2. What You'll Get

By the end of this project:

- **One operator console** for Work Orders, labourers, hiring, contracts, evaluations.
- **Faster Work Order setup** — Work Order entry to first outreach SMS in **under 5 minutes** (down from a multi-step process across Tally, Make.com, and Sheets).
- **Self-cleaning labour database** — workers who don't respond after multiple SMS attempts get automatically flagged for review; expired licences surface before they block a Work Order.
- **Compliance documents in-app** — generate a labourer's PDF Licence Profile and Work Order contracts directly, no Documint round-trip.
- **Visibility into what's failing** — when an SMS doesn't deliver or a contract event doesn't arrive, you see it in a dedicated inbox with one-click retry, instead of finding out days later.
- **Multi-user ready** — you can add team members with appropriate access as the business grows.

---

## 3. Phased Rollout

We're delivering this in **5 phases**, designed so you can start using parts of the new system **during** development — not just at the end. This reduces risk: at no point will you have to "flip a switch" and trust that everything works.

### Phase A — Foundation & Data Migration *(weeks 1–2)*

**What you get:**
- Login to the new web app for the first time.
- Your full labour database (from Airtable + Superchat) and Work Order history (from Sheets) migrated in — a complete mirror.
- Browse, search, and verify everything in the new app.
- Multi-user accounts set up for you (and any team members you nominate).

**What's still running in the old system:** **all daily operations** — outreach, hiring, contracts, evaluations, and any new data entry continues in your existing tools (Airtable, Sheets, Tally) because they're still feeding Make.com automations.

**What this means in practice:**
- **You don't change your daily routine yet.** Keep using the old tools as you always have during this phase.
- **The new app shows your data in one place.** It's a verification window first; daily operations come in later phases.
- **Phase A is about confidence.** You see your data in its new home before any automation depends on it.

**Why this phase first:** before we automate anything, we need your data safely in the new system and you confident in its accuracy. Comparing the new app against your existing tools is how we verify. (See §4 for how the data layer and automation layer transition at different speeds.)

### Phase B — Outreach & Availability Collection *(weeks N+1 to N+M)*

**What you get:**
- "Start Outreach" action on any Work Order in the new app — pre-filtered candidates by skill and state, click to send.
- Labourer availability responses (Yes / No / Not Relevant / I Don't Work Anymore) flow directly into the Work Order page in real time — no more per-Work-Order Google Sheets.
- "Not Relevant" responses automatically prompt the labourer to update their profile.
- "I Don't Work Anymore" responses automatically mark the contact Inactive.

**Transition you can make at this phase:** start running **new Work Orders** through the new app's outreach flow. Existing in-flight Work Orders can finish in the old system.

**What's still running in the old system:** hiring, contract generation, evaluations.

### Phase C — Hiring, Contracts & Compliance Documents *(weeks N+M+1 onwards)*

**What you get:**
- "Hire Selected" action on responses → contract PDF generated in-app, automatically populated with Work Order + labourer data.
- Hiring Log as a first-class view, with status tracking (Created → Sent → Signed → Rejected).
- Adobe Sign signed-contract events automatically update Hiring Status (no more manual checking).
- "Generate Licence Profile" PDF on any labourer record — replaces Documint entirely.

**Transition you can make at this phase:** new Work Orders now run from Work Order entry through hiring entirely in the new app. Goodbye Documint, goodbye Tally hiring form.

**What's still running in the old system:** post-job evaluation collection.

### Phase D — Evaluation & Client Handoff *(continues from C)*

**What you get:**
- Evaluation Log fully in-app (internal evaluations + client feedback collection).
- T+5-day client evaluation emails sent automatically.
- "Notify Client" action on a Work Order → composes a handoff email with assigned labourers and their PDF Licence Profiles attached, ready for you to review and send.

**Transition at this phase:** **all new Work Orders run end-to-end in the new app.** The full v1 success criterion is met.

### Phase E — Hardening & Launch *(2-week tail)*

**What you get:**
- Polish, monitoring, alerting.
- Operator-facing System Activity inbox fully wired up (the "what's failing right now" view).
- Final migration of any historical data not yet brought across.
- Old systems (Sheets, Airtable, Tally, Make.com, Documint) shut down.

**Transition at this phase:** complete cutover. The new app is the only writable system. Old systems remain readable for 30 days as a safety net.

---

## 4. Transition Strategy

The point of phasing this way is that **you start gaining value from week ~3–4 onwards**, not at month 3.

### How the data layer and automation layer transition differently

A practical reality worth flagging: the existing Make.com automations are plumbed through Airtable + Sheets + Tally. Replacing the *data location* (Phase A) doesn't immediately replace the *automations* — those keep running on the old data sources until each phase peels them off, one by one.

The split:

| Layer | When it transitions |
|---|---|
| **Data layer** (where labourer + Work Order info lives) | Migrates **once** at Phase A. The app becomes a canonical *mirror*; the old tools remain authoritative for new writes until their phase arrives. |
| **Automation layer** (what runs the workflows on top of that data) | Migrates **phase by phase**. Outreach in B, hiring + contracts in C, evaluation + handoff in D. |

**What this means for you in practice:**

1. **Keep using your old tools as you do today during the build phases.** Don't try to switch early — the Make.com automations are still pointing at Airtable/Sheets and need them populated.
2. **At each phase boundary, we run a small "delta migration"** to bring any data added or changed in the old tools during the previous phase into the app. This keeps the app current automatically — **no double-entry on your side.**
3. **From Phase B onwards, where you write depends on which workflow.** Once outreach lives in the app (end of Phase B), new outreach campaigns and labourer responses happen in the app. Workflows that haven't been replaced yet still run in the old tools until their phase.
4. **Phase A's app is read-mostly.** You can browse and verify, but the app's data is a mirror, not yet the source of truth for anything operational.

The bottom line: **you never do double-entry**. You keep using each old workflow until the phase that replaces it kicks in, and the delta migration bridges the gap so the app stays current.

### Phase-by-phase cutover summary

| When | What you do | What you stop doing |
|---|---|---|
| End of Phase A | Browse + verify data in the new app; daily operations continue in old tools | Manually reconciling Airtable vs Sheets vs Superchat for status |
| End of Phase B | Start *new* Work Orders' outreach in the new app; finish in-flight old-system Work Orders in legacy | Tally outreach forms, per-Work-Order Google Sheets, Make.com SMS scenarios, Airtable profile-update form |
| End of Phase C | Hire + generate contracts + licence profiles in the new app | Tally hiring form, Documint, manual contract template population |
| End of Phase D | Run full Work Order lifecycle in the new app | Tally client evaluation form, manual handoff emails |
| End of Phase E | Use the new app exclusively | Everything legacy |

**Old systems stay live (read-only) for 30 days post-cutover** as a safety net. We won't delete anything in your existing tools until you're confident the new system is doing everything you need.

**You can pause between phases** at any point if a real-world Work Order demands your attention. Each phase ends in a usable state.

---

## 5. Platforms — In, Out, Staying

### Platforms going away (consolidated into the new app)

| Today | What it does today | Replacement |
|---|---|---|
| **Google Sheets** (Work Order Form) | Master Work Order database, Hiring Log, Evaluation Log | Native database in the new app |
| **Airtable** | Labour database (contacts, licences, ratings) | Native database in the new app |
| **Tally.so** | Outreach trigger form, hiring selection form, availability response form, client evaluation form | Native pages in the new app (operator buttons + token-gated public pages) |
| **Airtable form** | Profile update form for labourers | Native page in the new app |
| **Make.com** | Orchestration between everything above | Replaced by the app's own backend logic |
| **Documint** | PDF licence profile generation | PDF generation in the new app (HTML → PDF) |
| **Google Drive** (for contract PDFs) | Storage for generated contracts and licence profiles | App's own file storage (Supabase, hosted in Sydney) |

### Platforms staying

| Platform | Role | Why we're keeping it |
|---|---|---|
| **Twilio** | SMS delivery | Already configured, working well, AU number registered. App uses Twilio's API in the background; you don't interact with it directly. |
| **Superchat** | SMS conversation handling for free-text replies | Replacing this means building a full inbox + likely AI to handle conversations — out of scope for v1 (cost reasons). The app integrates with Superchat so you can jump from a labourer's record straight to their conversation thread. |
| **Adobe Sign** | E-signature on contracts | You're comfortable with the manual send. The app generates the PDF and receives signed-contract events automatically; the only manual step is uploading to Adobe Sign yourself. (If your Adobe plan includes API access, we can also build a "Send via Adobe Sign" button — confirmation pending.) |
| **Gmail / your email account** | Email *delivery* (auth flows, password resets) | Handled by the auth provider — you don't have to do anything. |

### Platforms coming in (recurring costs in §7)

| Platform | Role | Cost (USD/month) |
|---|---|---|
| **Vercel** | Hosts the web app | ~$20/month (Pro plan) |
| **Supabase** | Database + file storage + login system, hosted in Sydney | ~$25/month (Pro plan) |
| **Resend** | Sends transactional emails (client handoffs, evaluation requests, error alerts), using your existing `summit-resources.com.au` domain | $0 — free tier covers expected volume |
| **Sentry** *(or equivalent)* | Tracks technical errors so we can fix them quickly | $0 — free tier sufficient |

**Net change in recurring SaaS costs:** roughly a wash with what you're paying for Make.com + Documint + Airtable Pro today, but consolidated and far easier to manage.

---

## 6. Future Capabilities (not in v1, but the system is ready for them)

These are explicitly **out of scope** for the initial build, but the architecture supports adding them later without rebuilding:

- **AI-assisted SMS conversations** — an AI agent that handles routine inbound replies (job questions, simple availability changes) and only escalates to you for genuine human judgement. Parked due to per-message cost over Twilio, but the app is designed to slot this in when the economics improve.
- **In-app e-signature** — replacing Adobe Sign entirely.
- **Client portal** — your clients log in to see Work Order status, assigned labourers, evaluation forms, downloadable compliance documents.
- **Auto-suggested duplicate labourers** — the system surfaces "these two records look like the same person, consider merging" prompts.
- **Multi-tenancy** — if you ever wanted to offer this platform to other labour resourcing operators.

---

## 7. Costing

### 7.1 Pricing model

**Hourly billing via our existing Upwork hourly contract**, with Upwork's standard weekly billing cycle. Hours are tracked through Upwork's time tracker; funds are escrowed and auto-paid out weekly. No invoices to chase, no payment admin on either side.

| Item | Detail |
|---|---|
| **Standard rate** | USD $75.20/hr |
| **Your rate (long-term client)** | **USD $60/hr** — honoring our existing contract |
| **Effective loyalty discount** | ~20% applied to every billable hour on this project |
| **Billing cycle** | Weekly, via Upwork |

**What's included in the rate.** The $60/hr fully covers all AI development tools (Claude, Cursor, etc.) and dev environment costs I use during the build. You're not billed separately for tooling — it's bundled into the rate, which is part of what makes the AI-assisted velocity sustainable for both of us. The same applies to any post-launch support hours (§7.9).

Why hourly rather than fixed-price for this project:

- **Lower risk for you** — you only pay for hours actually worked. If something turns out simpler than expected, you save money. No fixed-price padding.
- **Transparency** — weekly Upwork reports show exactly what time went where.
- **Flexibility** — you can pause or slow down between phases without renegotiating contracts. Phases naturally suspend billing when no work is logged.
- **Trusted intermediary** — Upwork mediates if anything ever goes sideways.

**Optional: weekly hour cap.** If you'd prefer predictable weekly outgoings (rather than letting velocity vary), we can set a cap — e.g. maximum 15 hours/week ($900/week ceiling), or 20 hours/week ($1,200/week ceiling). Up to you. Without a cap, hours flex with progress and your other priorities.

### 7.2 Phase-by-phase estimates

We're starting with **Phase A** as the agreed commitment. Phases B–E are listed for trajectory visibility, but **each phase is confirmed at the boundary** — you're not signing up for all 5 phases upfront.

| Phase | Status | Estimated hours | Cost @ your $60/hr | (At standard $75.20/hr) |
|---|---|---|---|---|
| **A — Foundation & Data Migration** | **Starting here — agreed** | 19–26h | **$1,140 – $1,560** | ($1,429 – $1,955) |
| B — Outreach Loop | Confirmed at end of Phase A | 15–19h | $900 – $1,140 | ($1,128 – $1,429) |
| C — Hiring + Contracts + PDF | Confirmed at end of Phase B | 17–24h | $1,020 – $1,440 | ($1,278 – $1,805) |
| D — Evaluation + Client Handoff | Confirmed at end of Phase C | 13–17h | $780 – $1,020 | ($978 – $1,278) |
| E — Hardening + Launch | Confirmed at end of Phase D | 11–13h | $660 – $780 | ($827 – $978) |
| **v1 total trajectory** | | **~75–99h** | **~$4,500 – $5,940** | (~$5,640 – $7,445) |
| **Loyalty discount you receive** | | | | **~$1,140 – $1,505 saved** |

> **On these estimates:** these ranges assume aggressive use of AI tooling to accelerate boilerplate, scaffolding, components, and documentation. Genuinely complex pieces — real-data migration edge cases, Puppeteer-on-Vercel setup for PDF generation, Adobe Sign integration, debugging real-world Twilio quirks — are where time tends to land in the upper end of the range. We'll review actuals at each phase boundary so estimates for the next phase are anchored in real velocity, not guesses.

### 7.3 What ships in v1.1 (post-launch updates)

To keep v1 focused and within budget, a few refinements ship as **post-launch updates** rather than blocking the launch. **None of these break your day-to-day workflow** — they're enhancements you'd get in the weeks/months following launch:

1. **Auto-merge duplicate labourers** — v1 handles duplicates manually if any appear (we triage together). Multi-select merge UI with cascade and tombstone redirects defers to v1.1.
2. **System Activity pattern-based escalation** — v1 ships a clear list of failures with one-click retry / mark-resolved / mark-Inactive. The auto-aggregation that detects "this labourer's number is likely dead" moves to v1.1.
3. **Custom saved filter views** — v1 has the pre-set views (Active, Archive, Expiring 30/60/90 days). "Save your own custom view" defers.
4. **Multi-entry operator notes** — v1 ships a single notes field per labourer (still pinnable, edit anytime). Multi-entry timestamped notes with author attribution defers.
5. **Rich activity timeline** — v1 ships a basic timeline (status changes, hires, evaluations, system events). Richer event types (full outreach history, response history per labourer) defer.
6. **Mobile-friendly operator console** — v1 is **desktop-only** for the operator console (the parts you log in to use). Public forms that labourers and clients receive via SMS / email still render acceptably on phones because we use framework defaults — but a polished, tested mobile experience for the operator console is deferred.

You'll get to voice which v1.1 items matter most to you post-launch — they're built incrementally as part of ongoing support hours.

### 7.4 How this aligns with your cash flow

The phased structure means your largest spend hits when your cash flow is strongest. Phase A's commitment is small enough to fit current constraints; the bigger phases land 5–8 weeks out, by which time the client onboarding you mentioned should have improved cash flow:

| Phase | Estimated cost | Calendar position | Cash flow context |
|---|---|---|---|
| **A — Foundation** | $1,140 – $1,560 | Weeks 1–2 | Smallest commitment, fits current tight cash flow |
| **B — Outreach** | $900 – $1,140 | Weeks 3–4 | Cash flow likely improved by this point |
| **C — Hiring + PDF** | $1,020 – $1,440 | Weeks 5–6 | Strong cash flow expected |
| **D — Evaluation + Handoff** | $780 – $1,020 | Weeks 7–8 | — |
| **E — Hardening** | $660 – $780 | Week 9 | — |

This isn't a discount — it's smart sequencing. You start the project now, see real value within ~2 weeks (Phase A), and pay for the heavier phases as you can absorb them.

### 7.5 Value justification

| What v1 delivers | What it's worth to you |
|---|---|
| Replaces 5+ SaaS subscriptions (Sheets/Airtable/Tally/Make.com/Documint) | ~$60–80 USD/month saved → ~$800/year |
| Eliminates manual chasing on the four pain points | Conservatively 3–5 hours/week recovered. At your effective hourly value, that's ~$200–500/week saved → $10,000+/year |
| Foundation for AI-SMS, client portal, multi-tenancy | Avoids paying for a from-scratch rebuild later when those features are needed |
| Documented architecture + version control + audit trail | When something breaks, there's a clear owner and a clear fix path. With Make.com today, there isn't. |

**At $4,500–$5,940, this pays back inside 2–4 months on time saved alone**, before counting platform consolidation savings.

### 7.6 What you get at each phase boundary

- **Working software you can use** — phases are designed so each one ends in a usable state (see §3 Phased Rollout).
- **Hours actuals review** — exactly what time went into Phase X, so the estimate for Phase X+1 is anchored in real velocity.
- **Decision point** — confirm, adjust, or pause. No pressure to continue if your priorities have shifted.

### 7.7 Recurring monthly costs (post-launch)

| Item | Cost (USD/month) | Notes |
|---|---|---|
| **Vercel Pro** | ~$20 | App hosting |
| **Supabase Pro** | ~$25 | Database + file storage + auth, Sydney region |
| **Resend** | $0 | Free tier covers ~3,000 emails/month; expected usage ~150–200/month |
| **Sentry** | $0 | Free tier covers expected error volume |
| **Twilio** | *unchanged* | You're already paying for SMS — no change |
| **Adobe Sign** | *unchanged* | You're already paying — no change |
| **`summit-resources.com.au` domain** | *unchanged* | You already own this — no new cost |
| **Total new recurring** | **~$45 USD/month (~$68 AUD)** | |

### 7.8 What this replaces (rough current spend you'll save)

| Platform | Estimated current spend |
|---|---|
| Make.com (Operations / Teams plan) | ~$10–30 USD/month |
| Documint | ~$20–30 USD/month |
| Airtable (if on Pro) | ~$20 USD/month per user |
| Tally | likely free tier — $0 |
| **Estimated savings on platforms** | **~$50–80 USD/month** |

**Net effect on your monthly platform spend:** roughly **break-even or slightly cheaper**, but radically more consolidated.

### 7.9 Optional ongoing developer support (post-launch)

After launch, the same Upwork hourly contract continues — at **USD $60/hr** — for any of:

- **Ad-hoc fixes / minor changes** — just log hours when something needs attention.
- **v1.1 deferred features** — built incrementally as you decide which matter most.
- **Small new features** — e.g. you decide a new filter view would be useful, or you want a tweak to the contract template.
- **Active monitoring** — periodic check-ins on the System Activity inbox, error logs, etc., on a light agreed cadence.

No retainer needed — pay only for hours actually worked, same as during the build. We can decide closer to launch what level of post-launch involvement makes sense.

---

## 8. Timeline Estimate

Timeline depends on the weekly hour cadence you choose. At a **part-time pace** (typical for our existing engagements — say 10–12 hours per week from my side), here's the rough trajectory:

| Phase | Estimated hours | Calendar duration (~10–12h/wk) | Cumulative |
|---|---|---|---|
| Phase A — Foundation & Data Migration | 19–26h | ~2 weeks | Week 2 |
| Phase B — Outreach Loop | 15–19h | ~1.5–2 weeks | Week 4 |
| Phase C — Hiring + Contracts + PDF | 17–24h | ~2 weeks | Week 6 |
| Phase D — Evaluation + Handoff | 13–17h | ~1.5 weeks | Week 7–8 |
| Phase E — Hardening + Launch | 11–13h | ~1 week | Week 9 |
| **v1 launch** | **~75–99h** | **~2–2.5 months** | |

A faster pace (full-time) compresses this to ~4–5 weeks. A slower pace (5–8 hours per week) extends it to ~3–4 months. The Upwork hourly model means we can flex pace mid-project based on what's happening at your end.

---

## 9. What You Need to Provide

Because we built the existing system together, I already have access to most of what's needed — Airtable, Sheets, Superchat, Twilio, Adobe Sign credentials and exports. The list of things I genuinely need from you is short:

### Before Phase A starts

- **Confirm the outbound email sender.** You've previously mentioned wanting either `hr@summit-resources.com.au` or `operations@summit-resources.com.au`. Just need a final pick (or both — we can use them for different categories of email if useful: e.g. `operations@` for client handoff and labourer prompts, `hr@` for evaluation and internal-facing emails).
- **Design direction.** Two options:
  - **(a)** You design the visual style in Claude design and hand over styling rules before we start coding.
  - **(b)** I propose a direction first based on the brand and you sign off (or refine before we proceed).
- **GitHub setup (~5 minutes).** The codebase needs to live under your ownership rather than mine — standard for paid client work, and protects you against any continuity risk. Steps:
  1. Sign up at `github.com` if you don't already have an account.
  2. Create a free **GitHub organization** at `github.com/organizations/new` — suggested name: `summit-resources` (matches your domain).
  3. Invite me as **Owner** or **Admin** so I can create the repo and push code.
  
  You don't need to know any Git/GitHub day-to-day — you just own the container. Free tier covers everything we need (unlimited private repos, unlimited collaborators).

### Before Phase C starts

- **Adobe Sign plan tier confirmation.** Does your current plan include API access? This determines whether the "send contract" step happens fully in-app (v1+ upgrade) or remains a manual upload via Adobe Sign (baseline). I can check from your account if you'd prefer.

### Throughout the build

- **Periodic check-ins (~30 minutes per phase)** to validate workflows feel right before we lock them in. Best held at each phase boundary so we review actuals + sign off on the next phase together.
- **Heads-up on any new labourers / Work Orders** added to the old tools during the build, so the delta migrations at each phase boundary capture them cleanly.

---

## 10. Risks & How We're Managing Them

| Risk | What we're doing about it |
|---|---|
| **Data goes missing during migration** | Dry-run migrations against a staging environment first; reconciliation report you approve before any production writes; old systems kept read-only for 30 days post-cutover as a safety net. |
| **SMS deliverability drops** | Mirror your existing Twilio config; canary-test in early outreach campaigns before full rollout. |
| **PDF compliance documents look different from what your clients are used to** | Side-by-side comparison of current Documint output vs new system output before Phase C exits — clients see no visual change. |
| **Workflow feels different and slows you down** | Phased rollout means you test each piece in real conditions before the next is built. We adjust based on your feedback at each phase, not just at the end. |
| **We discover something complex during build** | Phase exit reviews give us a natural checkpoint to surface scope changes before they affect later phases. |

---

## 11. Next Steps

1. **You review this brief** and flag anything that's unclear, missing, or you'd want done differently.
2. **We agree on weekly pace** for Phase A — open hours, or a weekly cap if you'd prefer predictable weekly cost.
3. **We continue our existing Upwork hourly contract** at USD $60/hr — no new contract setup needed; just confirming the project scope and phase commitment.
4. **Three quick setup items before Phase A kicks off:**
   - Pick your outbound email sender — `hr@summit-resources.com.au`, `operations@summit-resources.com.au`, or both for different categories.
   - Pick design direction — option (a) you design first and hand over styling rules, or option (b) I propose first and you refine.
   - Set up your GitHub organization (~5 minutes) and invite me as Owner/Admin so I can create the repo under your ownership.
5. **Phase A kicks off** — first hours logged against Phase A milestones.
6. **End of Phase A review** — we walk through what's built, review actual hours vs. estimate, and confirm Phase B before any Phase B hours are logged.

---

## 12. Appendix — Documentation You'll Have Access To

This brief is the executive summary. The full detail lives in:

- **[PRD.md](./PRD.md)** — Product Requirements Document. Describes every feature, behaviour, and UX pattern in detail. The source of truth for what's being built.
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Technical spec. The "how" — stack, integration patterns, NFRs. Mostly engineering-facing but worth a skim if you want to know what's under the hood.
- **[DECISIONS.md](./DECISIONS.md)** — Append-only log of every locked decision so far. If you ever wonder "why are we doing X?", this is where the trail lives.
- **[CURRENT_WORKFLOW.md](./CURRENT_WORKFLOW.md)** — A precise documentation of how your existing workflow runs today. Useful as a reference and as the baseline we're improving on.

All four documents are version-controlled and update as the project evolves. You'll always be able to see the latest state.
