# Slide Deck Content — Project Brief Handoff

| Field | Value |
|---|---|
| **Purpose** | Reference content for Claude Code to populate / update the existing project brief slide deck |
| **Source of truth** | [PROJECT_BRIEF.md](./PROJECT_BRIEF.md). Where this doc and the brief disagree, **the brief wins**. |
| **Date** | 2026-05-07 |
| **Audience** | Joshua Shields (client at Summit Resources) |
| **Tone** | Business-outcome focused, plain English, light on engineering jargon. Use "you" / "your" addressing Joshua directly. |

> **Instructions for the receiving Claude Code session:** the existing slide deck was drafted before recent changes to scope and pricing. Use this doc to update slide content with the correct current figures and framing. Slide numbering below is illustrative — adapt to the existing deck's structure. Where a slide already exists with a different label, update its content to match this doc. Where this doc has content the deck doesn't, propose adding a slide.

---

## Key figures — verify these are correct in every slide that mentions them

These are the most likely places for stale numbers. Check each one against the deck and update if different.

| Item | Current value |
|---|---|
| **Joshua's hourly rate** | **USD $60/hr** (long-term client rate, honoring existing Upwork contract) |
| **Standard rate** | USD $75.20/hr |
| **Loyalty discount** | ~20% on every billable hour (~$1,140–$1,505 saved over v1) |
| **v1 total estimate** | **75–99 hours, ~$4,500–$5,940 USD** |
| **Phase A** | 19–26h, **$1,140–$1,560** (the agreed starting commitment) |
| **Phase B** | 15–19h, $900–$1,140 |
| **Phase C** | 17–24h, $1,020–$1,440 |
| **Phase D** | 13–17h, $780–$1,020 |
| **Phase E** | 11–13h, $660–$780 |
| **Recurring monthly SaaS** (new platforms) | ~$45 USD/month (~$68 AUD) |
| **Timeline** | ~2–2.5 months at ~10–12h/week part-time pace (full-time = ~4–5 weeks) |
| **Billing model** | Hourly via existing Upwork contract, weekly auto-payment |
| **Domain** | `summit-resources.com.au` (Joshua already owns this) |
| **Email sender options** | `hr@summit-resources.com.au` or `operations@summit-resources.com.au` (or split by category) |
| **Twilio number** | `+61483932978` (already in use) |

---

## Slide-by-slide content

### Slide — Title / Cover

- **Title:** Summit Resources Web App
- **Subtitle:** Project Brief — Consolidating Your Operations Into One Platform
- **Prepared for:** Joshua Shields, Summit Resources
- **Date:** May 2026

---

### Slide — The Short Version (one-liner pitch)

**Headline:** *"One web app to replace five tools — keep using what works."*

Bullets:
- You currently run your business across **10+ platforms** stitched together by Make.com
- We're building a **single web application** that consolidates 5 of them into one operator console
- You keep using **Superchat** (SMS conversations), **Adobe Sign** (e-signatures), and **Twilio** (under the hood) — they work
- One place to run your entire workflow from work order entry to client handoff

---

### Slide — The Pain Points We're Solving

Bullets (current operational drag):
- Context switching across 10+ tools
- Brittle handoffs between platforms
- Manual interventions: chasing missing licences, manual contract sends, ad-hoc handoff emails
- Difficulty maintaining labour database hygiene
- No single source of truth for project, labour, or hiring state

---

### Slide — What You'll Get (Outcomes)

Bullets:
- **One operator console** for work orders, labourers, hiring, contracts, evaluations
- **Faster work order setup** — work order entry to first outreach SMS in **under 5 minutes** (vs. multi-step today)
- **Self-cleaning labour database** — silent attrition flagged automatically; expired licences surface before they block projects
- **Compliance documents in-app** — generate PDF Licence Profiles + contracts directly, no Documint round-trip
- **Visibility into failures** — dedicated inbox with one-click retry instead of finding out days later
- **Multi-user ready** — add team members with appropriate access as you grow

---

### Slide — Phased Rollout (overview)

**Headline:** *"5 phases, each ending in a usable state."*

| Phase | Focus | Duration |
|---|---|---|
| A | Foundation & Data Migration | ~2 weeks |
| B | Outreach Loop | ~2 weeks |
| C | Hiring + Contracts + PDF | ~2 weeks |
| D | Evaluation + Client Handoff | ~1.5 weeks |
| E | Hardening + Launch | ~1 week |

- Phase A is the agreed starting commitment
- Phases B–E confirmed at each phase boundary (you're not signing up for all 5 upfront)
- Each phase delivers working software you can use

---

### Slide — Phase A — Foundation & Data Migration

**What you get:**
- Login to the new app for the first time
- Full labour database (Airtable + Superchat) and project history (Sheets) migrated in — a complete mirror
- Browse, search, verify everything in one place
- Multi-user accounts ready

**What's still running in old tools:** all daily operations — outreach, hiring, contracts, evaluations

**Key idea:** Phase A is a **verification window** — you don't change your daily routine yet. Confidence in the new data, before any automation depends on it.

---

### Slide — Phase B — Outreach Loop

**What you get:**
- "Start Outreach" button on any project — pre-filtered candidates, click to send
- **Dedicated Summit Resources public forms** for capturing availability responses (Yes / No / Not Relevant / I Don't Work Anymore) — branded, hosted on `summit-resources.com.au`, no third-party form provider
- Auto-prompts for profile updates and Inactive flagging based on response type
- Outreach history for each labourer — who, what message, what result

**Transition you can make:** start running new projects' outreach in the new app. Goodbye Tally outreach forms, Make.com SMS scenarios, per-project Sheets, Airtable profile-update form.

---

### Slide — Phase C — Hiring, Contracts & Compliance Docs

**What you get:**
- "Hire Selected" → contract PDF generated in-app, dynamic fields populated
- Hiring Log with status pipeline (Created → Sent → Signed → Rejected)
- Adobe Sign signed-contract events auto-update statuses
- "Generate Licence Profile" PDF on any labourer record

**Transition:** new projects run from work order through hiring entirely in the new app. **Goodbye Documint.**

---

### Slide — Phase D — Evaluation & Client Handoff

**What you get:**
- Evaluation Log fully in-app (internal + client feedback)
- T+5-day client evaluation emails sent automatically
- "Notify Client" → handoff email composed with PDFs attached, ready to review and send

**Transition:** all new projects run end-to-end in the new app. **Full v1 success criterion met.**

---

### Slide — Phase E — Hardening & Launch

**What you get:**
- Polish, monitoring, alerting
- Operator-facing System Activity inbox fully wired
- Final migration of historical data
- Old systems decommissioned

**Transition:** complete cutover. New app is the only writable system. Old tools remain readable for 30 days as a safety net.

---

### Slide — Transition Strategy: Data Layer vs Automation Layer

**Headline:** *"You never do double-entry."*

Two layers transition at different speeds:

| Layer | When |
|---|---|
| **Data layer** (where info lives) | Migrates **once** at Phase A. App becomes the canonical mirror; old tools authoritative for writes until each phase replaces them. |
| **Automation layer** (workflows on top) | Migrates **phase by phase**. Outreach in B, hiring + contracts in C, evaluation + handoff in D. |

**What this means for you:**
- Keep using your old tools as you do today during the build phases
- Delta migration at each phase boundary catches anything new
- From Phase B onwards, where you write depends on which workflow has been replaced
- You never run double-entry between systems

---

### Slide — Platforms: In, Out, Staying

**Going away (consolidated into the new app):**
- Google Sheets (Work Order Form)
- Airtable (labour database)
- Tally.so (4 forms)
- Airtable form (profile updates)
- Make.com (orchestration)
- Documint (PDF generation)
- Google Drive (contract storage)

**Staying:**
- Twilio (SMS delivery — under the hood)
- Superchat (manual SMS conversation handling)
- Adobe Sign (e-signature)
- Your existing email account (for Resend domain)

**Coming in:**
- Vercel (~$20/mo) — hosts the app
- Supabase (~$25/mo) — database + storage + login, hosted in Sydney
- Resend ($0) — sends transactional emails, using your `summit-resources.com.au` domain
- Sentry ($0) — technical error tracking

**Net change in monthly platform spend:** roughly break-even or slightly cheaper, but radically more consolidated.

---

### Slide — Pricing Model

**Headline:** *"Hourly via our existing Upwork contract — payment auto-flows weekly."*

| Item | Detail |
|---|---|
| **Standard rate** | USD $75.20/hr |
| **Your rate (long-term client)** | **USD $60/hr** — honoring our existing contract |
| **Effective loyalty discount** | ~20% on every billable hour |
| **Billing** | Weekly via Upwork (auto-payment, no invoices) |

**What's included:**
- All AI development tools (Claude, Cursor, etc.)
- Dev environment costs
- Tooling is bundled into the rate — that's part of what makes the AI-assisted velocity sustainable

**Optional weekly hour cap** if you'd prefer predictable weekly outgoings (e.g. 15h/week = $900 ceiling).

---

### Slide — Phase-by-Phase Estimates

| Phase | Status | Hours | Cost @ $60/hr | (At $75.20 standard) |
|---|---|---|---|---|
| **A — Foundation & Migration** | **Starting here** | 19–26h | **$1,140–$1,560** | ($1,429–$1,955) |
| B — Outreach Loop | Confirm at end of A | 15–19h | $900–$1,140 | ($1,128–$1,429) |
| C — Hiring + Contracts + PDF | Confirm at end of B | 17–24h | $1,020–$1,440 | ($1,278–$1,805) |
| D — Evaluation + Handoff | Confirm at end of C | 13–17h | $780–$1,020 | ($978–$1,278) |
| E — Hardening + Launch | Confirm at end of D | 11–13h | $660–$780 | ($827–$978) |
| **v1 total** | | **~75–99h** | **~$4,500–$5,940** | (~$5,640–$7,445) |
| **Loyalty saving** | | | | **~$1,140–$1,505** |

---

### Slide — How This Aligns With Your Cash Flow

**Headline:** *"Smaller phases now, bigger phases when cash flow improves."*

| Phase | Cost | When | Cash flow context |
|---|---|---|---|
| A — Foundation | $1,140–$1,560 | Weeks 1–2 | Smallest commitment, fits current tight cash flow |
| B — Outreach | $900–$1,140 | Weeks 3–4 | Cash flow likely improved by this point |
| C — Hiring + PDF | $1,020–$1,440 | Weeks 5–6 | Strong cash flow expected |
| D — Evaluation + Handoff | $780–$1,020 | Weeks 7–8 | — |
| E — Hardening | $660–$780 | Week 9 | — |

This isn't a discount — it's smart sequencing. Start now, see real value within 2 weeks, pay for heavier phases as you can absorb them.

---

### Slide — What v1.1 Includes (Post-Launch)

**Headline:** *"v1 ships lean. v1.1 adds the polish — built incrementally as ongoing support hours."*

Six items deferred to v1.1 so v1 stays focused and within budget. **None block your day-one workflow:**

1. **Auto-merge duplicate labourers UI** — manual triage in v1
2. **System Activity pattern-based escalation** — simple list in v1
3. **Custom saved filter views** — pre-set views ship in v1
4. **Multi-entry operator notes** — single notes field in v1
5. **Rich activity timeline** — basic timeline in v1
6. **Mobile-friendly operator console** — desktop-only in v1; public forms (labourer/client side) still render on phones via framework defaults

You'll choose which v1.1 items to prioritise post-launch.

---

### Slide — Value Justification / ROI

| What v1 delivers | What it's worth |
|---|---|
| Replaces 5+ SaaS subscriptions | ~$60–80/month saved → ~$800/year |
| Eliminates manual chasing on the four pain points | 3–5 hours/week recovered → ~$10,000+/year at your effective hourly value |
| Foundation for AI-SMS, client portal, multi-tenancy | Avoids paying for a from-scratch rebuild later |
| Documented architecture + version control + audit trail | Clear ownership when something breaks |

**At $4,500–$5,940, this pays back inside 2–4 months on time saved alone**, before counting platform consolidation savings.

---

### Slide — Timeline

**At a part-time pace (~10–12h/week):**

| Phase | Hours | Calendar | Cumulative |
|---|---|---|---|
| A — Foundation & Migration | 19–26h | ~2 weeks | Week 2 |
| B — Outreach Loop | 15–19h | ~1.5–2 weeks | Week 4 |
| C — Hiring + Contracts + PDF | 17–24h | ~2 weeks | Week 6 |
| D — Evaluation + Handoff | 13–17h | ~1.5 weeks | Week 7–8 |
| E — Hardening + Launch | 11–13h | ~1 week | Week 9 |
| **v1 launch** | **~75–99h** | **~2–2.5 months** | |

- **Full-time pace:** ~4–5 weeks total
- **Slower pace** (5–8h/week): ~3–4 months
- Upwork hourly model lets us flex pace mid-project

---

### Slide — What You Need to Provide

**Before Phase A starts:**
- **Confirm outbound email sender** — `hr@summit-resources.com.au`, `operations@summit-resources.com.au`, or both for different categories
- **Design direction:**
  - **(a)** You design the visual style in Claude design and hand over styling rules
  - **(b)** I propose a direction first based on the brand, you sign off
- **GitHub setup (~5 minutes)** — codebase needs to live under your ownership (standard for paid client work, protects you against continuity risk):
  1. Sign up at `github.com` if you don't have an account
  2. Create a free **GitHub organization** — suggested name: `summit-resources`
  3. Invite me as **Owner** or **Admin** so I can create the repo and push code
  
  You don't need to know any Git/GitHub day-to-day — you just own the container. Free tier covers everything.

**Before Phase C starts:**
- Adobe Sign plan tier confirmation (does it include API access?)

**Throughout:**
- Periodic check-ins (~30 min per phase)
- Heads-up on new labourers/projects added to old tools during the build

> Most credentials and exports already in hand from the existing engagement.

---

### Slide — Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Data goes missing during migration** | Dry-run migrations against staging first; reconciliation report you approve before any production writes; old systems kept read-only for 30 days post-cutover as a safety net |
| SMS deliverability drops | Mirror your existing Twilio config; canary-test in early outreach campaigns before full rollout |
| PDF compliance documents look different from what your clients are used to | Side-by-side comparison of current Documint output vs new system output before Phase C exits — clients see no visual change |
| Workflow feels different and slows you down | Phased rollout means you test each piece in real conditions before the next is built — we adjust based on your feedback at each phase, not just at the end |
| We discover something complex during build | Phase exit reviews give us a natural checkpoint to surface scope changes before they affect later phases |

---

### Slide — Future Capabilities (Not in v1)

**Architecture is ready for these — they slot in later without rebuilding:**

- AI-assisted SMS conversation handling (parked due to Twilio per-message LLM cost)
- In-app e-signature, replacing Adobe Sign
- Client portal — your clients log in to see project status, evaluation forms, downloadable docs
- Auto-suggested duplicate labourer merges
- Multi-tenancy (offering this platform to other operators)

---

### Slide — Next Steps

1. **Review this brief** — flag anything unclear, missing, or you'd want done differently
2. **Agree on weekly pace** for Phase A (open hours, or weekly cap)
3. **Continue our existing Upwork hourly contract** at USD $60/hr — no new contract setup
4. **Three quick setup items before Phase A kicks off:**
   - Pick outbound email sender (`hr@`, `operations@`, or both)
   - Pick design direction (you design first, or I propose first)
   - Set up your GitHub organization (~5 minutes) and invite me as Owner/Admin so I can create the repo under your ownership
5. **Phase A kicks off** — first hours logged
6. **End of Phase A review** — actuals vs. estimates, confirm Phase B before any Phase B hours

---

### Slide — Documentation You'll Have Access To

This brief is the executive summary. Full detail lives in:

- **PRD.md** — Product Requirements Document. Every feature, behaviour, UX pattern in detail.
- **ARCHITECTURE.md** — Technical spec. The "how" — stack, patterns, NFRs.
- **DECISIONS.md** — Append-only log of every locked decision.
- **CURRENT_WORKFLOW.md** — Precise documentation of your existing workflow (the baseline we're improving on).

All version-controlled and updated as the project evolves.

---

## Notes for the receiving Claude Code session

1. **Read the full brief first.** [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) is the source of truth — this doc summarises it for slide use.
2. **Verify all figures.** The "Key figures" table at the top of this doc lists every number that should appear consistently across slides. Cross-reference against any figures in the existing deck.
3. **Watch for stale phase counts.** Earlier drafts showed wider hour ranges and higher totals (e.g. $6,300–$9,600). Anything in that range needs updating to the current $4,500–$5,940.
4. **Watch for stale rate framing.** Earlier drafts showed flat $60/hr without the standard-rate / loyalty-discount framing. The current pricing slide should show both.
5. **Watch for stale platform info.** "Custom domain" should not appear as a new platform — Joshua already owns `summit-resources.com.au`.
6. **Tone consistency.** Joshua is the audience — second-person ("you", "your"), business-outcome focused, light on engineering jargon.
7. **If something in the deck is missing from this doc, default to the brief.** This doc is a slide-friendly distillation — it doesn't include every nuance.

### Specific phrase corrections (replace verbatim if found in the deck)

| Stale / incorrect phrase | Replacement | Why |
|---|---|---|
| *"Real-time reply threading on the project page"* | *"Dedicated Summit Resources public forms to capture availability responses — branded, hosted on `summit-resources.com.au`, no third-party form provider"* | The original phrase implies an in-app messaging/chat thread, which is **not** in v1 scope. Free-text SMS replies stay in Superchat per [PRD §5.4](./PRD.md#54-sms-conversation-layer). What the app actually delivers is custom public forms (replacing Tally) for structured availability responses, with results flowing into the project page in real time. |
| Any phrase implying in-app chat / messaging UI | Either reframe as "deep-link to the Superchat conversation" (for free-text replies) or "real-time response dashboard" (for structured form submissions) | The app does **not** host messaging threads; Superchat is kept for that in v1. |
| *"Mobile-friendly"* / *"Triage from your phone"* / *"Mobile-first"* — anywhere applied to the **operator console** | **Remove**. The operator console is **desktop-only in v1**. Add a deferral note in the v1.1 slide instead. | Mobile operator console is now a v1.1 deferral. Public forms (labourer/client side) still render on phones via framework defaults — that's separate from operator-console mobile support. |
