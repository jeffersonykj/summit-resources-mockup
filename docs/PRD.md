# Product Requirements Document — Summit Resources Web App

| Field | Value |
|---|---|
| **Product** | Summit Resources Web App (working title) |
| **Operator** | Joshua Shields |
| **Region** | Australia |
| **Status** | Draft v0.2 |
| **Last updated** | 2026-05-07 |
| **Companion docs** | [ARCHITECTURE.md](./ARCHITECTURE.md) (technical spec) · [DECISIONS.md](./DECISIONS.md) (audit trail) · [CURRENT_WORKFLOW.md](./CURRENT_WORKFLOW.md) (as-is) |

> This PRD describes **what** we're building and **why**. For **how** (technical stack, NFRs, phased delivery, implementation patterns), see [ARCHITECTURE.md](./ARCHITECTURE.md). For chronological lock-ins, see [DECISIONS.md](./DECISIONS.md). For the as-is workflow this replaces, see [CURRENT_WORKFLOW.md](./CURRENT_WORKFLOW.md).

---

## 1. Background

Joshua Shields runs a labour resourcing and workforce-planning business serving construction projects across Australia. The current operation is automated end-to-end, but the automation is spread across **10+ platforms** stitched together by Make.com:

> Google Sheets · Airtable · Tally.so · Make.com · Documint · Superchat · Twilio · Adobe Sign · Google Drive · Gmail

This works, but creates real operational drag:

- Context switching across multiple tools
- Brittle handoffs between platforms
- Manual interventions at multiple points (Adobe Sign send, inbound SMS triage, missing-document chase, client handoff email)
- Difficulty maintaining labour database hygiene
- No single source of truth for Work Order, labour, or hiring state

The goal is to consolidate this into a **single web application** that becomes the operational hub for the business and the platform on which future capability (AI-assisted SMS, advanced analytics, client-facing portals) can be built.

---

## 2. Goals & Non-Goals

### 2.1 Goals (v1)

- **G1.** Replace Google Sheets, Airtable, and Tally.so as the system of record for Work Orders, labourers, and forms.
- **G2.** Replace Make.com as the orchestration layer — automations move into the app's backend.
- **G3.** Replace Documint by rendering PDF licence profiles and contracts in-app.
- **G4.** Continue using Twilio (SMS), Superchat (manual conversation triage), and Adobe Sign (e-signature) — integrate with them, don't replace them.
- **G5.** Migrate existing labour database (Airtable) and Work Order data (Sheets) so day-one launch has full operational continuity.
- **G6.** Provide multi-user access with roles, ready for Joshua's team to grow into.
- **G7.** Eliminate or reduce the four major manual pain points where feasible.

### 2.2 Non-Goals (v1 — explicitly out of scope)

- AI-assisted SMS conversation handling (parked due to per-message LLM cost over Twilio).
- Replacing Superchat.
- Replacing Adobe Sign.
- Client-facing portal for clients to self-serve Work Order status.
- Labourer-facing mobile app (labourers continue to receive SMS + form links).
- Payroll / invoicing.
- Native mobile apps.

### 2.3 Future Scope (architecture must not preclude)

#### Deferred to v1.1 (post-launch updates, included in ongoing support hours)

To keep v1 lean and within budget, the following ship as post-launch updates rather than blocking launch. None break day-one workflow:

- **Auto-merge duplicate labourers UI** (§5.2) — manual triage in v1; multi-select merge with cascade and tombstone redirects deferred to v1.1.
- **System Activity pattern-based escalation** (§5.10) — v1 ships a list of failures with one-click retry / mark-resolved / mark-Inactive. The N-consecutive-failures aggregation that creates "likely invalid number" entries moves to v1.1.
- **Custom saved filter views** (§5.2 / §6.2) — pre-set views (Active, Archive, Expiring 30/60/90) ship in v1; "save your own custom view" defers.
- **Multi-entry operator notes** (§5.2) — v1 ships a single notes field per labourer (still pinnable, edit anytime); multi-entry timestamped notes with author attribution defers.
- **Rich activity timeline** (§5.2 / §6.2) — v1 timeline covers status changes, hires, evaluations, system events; richer event types (full outreach + response history per labourer) defer.
- **Mobile-friendly operator console** (§4.1 / §6.1) — v1 is **desktop-only** for the operator console. Side-panel mobile collapse and any phone-optimised operator workflows defer. (Public forms still render acceptably on phones via framework defaults — only "polished mobile-first design" defers.)

#### Future scope (later phases, separate engagements)

- AI agent in the SMS conversation loop, replacing or augmenting Superchat.
- In-app e-signature, replacing Adobe Sign.
- Client portal for Work Order visibility, evaluation submission, document download.
- Multi-tenancy (other labour-resourcing operators using the platform).
- **Auto-suggested merge candidates** for duplicate labourers — system surfaces likely duplicates by similar phone, email, soundex-name match, etc. Becomes more valuable once the database has thousands of records.

---

## 3. v1 Success Criterion

> **Joshua runs an entire Work Order end-to-end — from Work Order entry to client handoff — using only the web app + Superchat (for manual SMS conversation handling) + Adobe Sign (for e-signature). No Sheets, no Airtable, no Tally, no Make.com. The day-one labour database is the existing Airtable / Sheets data, migrated in.**

> **Note on Twilio:** Twilio is the SMS delivery service that powers outbound messages from the web app and inbound messages from labourers. It is **not** a user-facing tool — Joshua never opens Twilio directly. The web app uses Twilio's API for outbound SMS (outreach, profile-update prompts, client evaluation requests), and Superchat is integrated with Twilio as the operator-facing inbox for inbound conversations.

### 3.1 Measurable signals

- 1 full Work Order lifecycle completed in the app (Work Order → outreach → response → hire → contract → signed → assigned → client notified → evaluated) without falling back to legacy tools.
- 100% of active labourer records migrated from Airtable.
- 100% of in-flight Work Orders migrated from Sheets.
- Time from Work Order entry → first outreach SMS sent: **≤ 5 minutes** (vs. current multi-step flow).
- Time spent per Work Order on the four pain points reduced (baseline to be measured pre-launch).

---

## 4. Users & Personas

### 4.1 Primary user — Joshua (Operator / Owner)

- Logs in daily, runs the full operational loop.
- Needs fast workflows, keyboard-first where it makes sense. Desktop-only console in v1.
- Has full access to all data and settings.

### 4.2 Secondary users — Team members (future, but built in from v1)

- **Operations role:** can manage Work Orders, contact labourers, run hiring, manage Hiring Log + Evaluation Log.
- **Read-only / view roles:** future, e.g. for accountants, admin staff. *Decision deferred — see §7.*

### 4.3 Indirect actors (not app users in v1)

- **Labourers** — interact via SMS and form links rendered by the web app's public form endpoint. No login.
- **Clients** — receive emails and form links. Receive PDF licence profiles. No login in v1.

---

## 5. Functional Scope

This section maps the new app onto the four phases of the current workflow.

### 5.1 Work Order Management

Replaces: **Work Order Form** Google Sheet.

- Create / edit / archive Work Orders with all current fields (Work Order ID, client info, project name, dates, shifts, required roles + licences, pay rates, rosters, notes). *Note: "project name" here refers to the construction-project name supplied by Joshua's client — it stays a field on the Work Order record.*
- Auto-generated Work Order IDs (`WO###`) consistent with existing IDs (or remappable for migration).
- Work Order status pipeline (e.g. *Draft → Open for Outreach → Hiring → Live → Completed*).
- Per-Work-Order view that consolidates: outreach status, response list, hiring log, evaluation log, client communications.
- Search, filter, sort across Work Orders.

### 5.2 Labour Database

Replaces: **Airtable** labour database.

A top-level **"Labourers"** area in app navigation, alongside Work Orders. It is Joshua's primary surface for managing the workforce as a whole, separate from the Work-Order-by-Work-Order flows.

#### Data — what's on a labourer record

- Personal info — name, phone, email, location/state, gender, emergency contact.
- Skills + licence types.
- Licence documents (uploaded images, front and back where applicable) — White Card, HRWL, Driver's Licence, etc., each with expiry date where relevant.
- "Other Licences" arbitrary list — Trade, Working at Heights, Confined Spaces, First Aid, MSIC, and any custom types — each with image / file + expiry date.
- **Active / Inactive** flag.
- **Labour Rating** — running average computed from completed Job Ratings (internal + client-side).
- All fields editable; full version history retained for audit.

#### List view (default landing)

- **Search** — name, phone, email.
- **Sort** — rating, name, last contacted, expiry status, etc.
- **Filter** — state, skills, licences, Active/Inactive, rating range, licence-expiry windows.
- **Saved filter views** — pre-set views for *Active*, *Archive (Inactive)*, *Expiring in 30 days*, *Expired*, *No rating yet*, etc.; operators can save custom views.
- **Bulk actions** on selected rows — *Mark Inactive*, *Request re-upload*, *Add to outreach for WO X*, etc.

#### Detail view per labourer

Everything editable in one cohesive page:

- All record fields above (inline edit).
- Licence documents — upload, replace, view full-size, set expiry dates. Each licence shows a valid / expiring soon / expired badge so the state is obvious without filtering.
- Active/Inactive toggle — manual override at any time (audited; reasons captured).
- Labour Rating breakdown — current value plus the list of contributing Job Ratings, click through to the Work Orders / evaluations they came from.
- **Activity timeline** — outreach history, response history, hires, evaluations, status changes, system events for this labourer. Answers questions like *"when did we last contact Tom?"* and *"why is this labourer Inactive?"* without leaving the record.
- **Per-labourer actions:**
  - `[Send profile-update prompt]` — sends the same tokenised SMS used by the *"Not Relevant to Me"* flow.
  - `[Generate fresh Licence Profile PDF]` — regenerates the compliance PDF on demand.
  - `[Request re-upload]` — sends a profile-update prompt scoped to specific licences.
  - `[Add to current outreach for WO X]` — pulls the labourer into an in-flight outreach campaign.

#### Adding new labourers

- `[+ New Labourer]` button on the list view. Opens the same record form as the detail view (operator-side, untokenised).
- Used when Joshua meets someone on-site, receives a referral, or otherwise sources a new contact outside the SMS funnel.

#### Delete vs Archive

- **Inactive (Archive)** is the everyday "don't contact this person" path — preserves all history, browseable in the Archive view, reversible.
- **Hard delete** exists but is gated to the Owner role and only for genuine bad data (test rows, deletion requests). Heavily audited.

#### Operator notes (multi-entry)

A free-text notes facility on every labourer record for operator-internal context. Never visible to labourers or clients.

- **Multi-entry** — each note is timestamped + author. Aligns with the activity timeline pattern.
- **Edit / delete** — by the note's author; other operators can read but not modify.
- **Pinned notes** — pin one or two notes to the top of the detail view so persistent context (*"Tom prefers night shifts"*, *"Don't pair with X on Sydney sites"*) is always visible.
- **List view surfacing** — labourers with pinned notes show a small indicator in their list row; hover preview reveals the pinned note.
- **Activity timeline integration** — notes appear on the timeline as type `note`, filterable separately from system events.
- **Low ceremony** — single text input on the detail view, hit save. No required fields, no categories.

#### Merge duplicates (Owner role)

Two labourer records that turn out to be the same person can be merged. Common after manual entry vs SMS-sourced entry, or post-migration cleanup.

| Step | Behaviour |
|---|---|
| 1. Selection | Multi-select rows in the Labourers list; click `[Merge...]` (Owner role only) |
| 2. Compare | Side-by-side comparison of every field that differs; operator picks which value to keep per field |
| 3. Choose survivor | Designate the surviving record (usually the older one with more history) |
| 4. Cascade | All foreign keys — outreach history, hires, evaluations, ratings, notes, system events — relink to the surviving record |
| 5. Tombstone | Losing records become **tombstones** with `merged_into: <id>` — never hard-deleted. Historical references to the old ID continue to resolve via redirect to the surviving record |
| 6. Audit | Surviving record's activity timeline gets a "Merged with <name> (`<old_id>`) on `<date>`" entry; the merge action itself is also logged in the audit trail |
| 7. Reversible | Owner can **unmerge within a 30-day window**; after that, the merge hardens |

Why tombstones instead of hard-delete: an old report, link, or external reference might still cite the merged-away ID. Tombstone redirects preserve all historical integrity.

#### Active vs Inactive — domain rule

The Active/Inactive split is **enforced as a domain invariant**, not just a UI filter. Implementation details in [ARCHITECTURE §5.5](./ARCHITECTURE.md#55-activeinactive-as-domain-invariant).

- **Outreach hard-excludes Inactive** at the database and service layer.
- Flipping Active → Inactive **cancels any in-flight outreach** for them (idempotent — safe to re-run).
- The Inactive group is browseable as an **"Archive" view** for Joshua's reference. He can flip back to Active if a labourer reappears (e.g., new number) — the audit trail is preserved.
- All four paths to Inactive write to the same audit trail: explicit "I Don't Work Anymore" response, repeated SMS failure pattern (§5.10), manual operator action, or migration-time Superchat flag (§5.11).

#### Licence expiry tracking & re-upload workflow

Every licence/document field with an expiry date is tracked and surfaced so expired documents are caught before they block a Work Order assignment.

- **Expiry tracking** — every licence field stores its expiry date; the system computes days-to-expiry on query.
- **"Expiring soon" filter views** — pre-set views on the labourer list: expired now, expiring in 30 / 60 / 90 days.
- **Bulk re-upload action** — Joshua selects rows from any expiring view, clicks `[Request re-upload]`, system sends the same tokenised profile-update SMS used by the *"Not Relevant to Me"* flow (§5.3) to those labourers. Submissions write back to the labourer record.
- **Optional automation** — opt-in setting per labourer or globally: "Automatically request re-upload N days before expiry" (default off; conservative default avoids spamming labourers without operator awareness).
- **Visible on labourer record** — each licence shows its expiry status (valid / expiring soon / expired) so the state is obvious without filtering.

### 5.3 Outreach & Availability Collection

Replaces: **Tally outreach form** + **Make.com SMS scenario** + **per-Work-Order Google Sheet**.

- "Start Outreach" action on a Work Order → opens an outreach composer:
  - Pre-filtered candidate pool by required skills + state.
  - Joshua reviews / adjusts the list.
  - Confirms send.
- App sends SMS via **Twilio**, includes a unique availability link per labourer (signed token, no PII in URL).
- Public availability response page hosted by the app — same options as today: *Yes / No / Not Relevant / I Don't Work Anymore*.
- Each response writes directly into the Work Order's response table — no spreadsheet round-trip.
- **Response side effects** preserved:
  - *I Don't Work Anymore* → labourer marked Inactive.
  - *Not Relevant to Me* → app sends profile-update SMS with a profile-update link (also app-hosted).
- Real-time response dashboard per Work Order.

### 5.4 SMS Conversation Layer

Keeps: **Superchat** + **Twilio** in v1.

- Inbound SMS that aren't form responses continue to flow through Superchat for manual handling.
- App stores a reference / link to the Superchat thread for each labourer–Work-Order pair, so Joshua can jump from a labourer row to the conversation. Implementation: store conversationId + phone number (fallback) per labourer × Work Order.
- *Architecture note:* the inbound webhook surface in the app is ready to take over conversation handling when AI-SMS is added in a future phase. Form responses → app, free-text replies → Superchat, with a single webhook entry point. See [ARCHITECTURE §5.6](./ARCHITECTURE.md#56-inbound-webhook-routing).

### 5.5 Hiring & Contract Generation

Replaces: **Tally hiring form** + **Make.com contract automation** + **Hiring Log** sheet tab + **Documint** for contracts.

- "Hire selected" action on a Work Order's response table.
- Contract template stored in-app, dynamic fields auto-populated from Work Order + labourer data.
- PDF rendered in-app — see [ARCHITECTURE §3](./ARCHITECTURE.md#3-pdf-rendering-architecture).
- Hiring Log is a first-class entity in the app (Work Order ID, labourer, hiring status, key dates).
- Hiring status pipeline: *Created → Sent → Signed → Rejected*.

#### Adobe Sign integration — phased

Adobe Sign integration depth depends on Joshua's plan tier (see §7 Open Decisions). The architecture supports both shapes via an adapter interface so we can ship the baseline immediately and upgrade without touching call sites — see [ARCHITECTURE §5.1](./ARCHITECTURE.md#51-adapter-interfaces).

- **v1 baseline (works on any Adobe Sign plan):**
  - App generates the PDF contract.
  - Joshua manually uploads to Adobe Sign and sends.
  - App receives signed-contract events via **Adobe Sign webhook** (preferred) or **email listener fallback** (mirrors today's flow).
  - Hiring Status auto-updates to *Signed* on receipt.

- **v1+ upgrade (if API access is available on his plan):**
  - "Send via Adobe Sign" button in the contract view — calls Adobe Sign API directly, no manual upload step.
  - Same webhook path for signed events.
  - Joshua never leaves the app for the send step.

**Action item:** confirm Joshua's Adobe Sign plan tier before Phase C build. Until confirmed, plan for baseline.

### 5.6 Performance Evaluation

Replaces: **Evaluation Log** sheet tab + Tally client-evaluation form + related Make.com automations.

- On contract signed → Evaluation Log row auto-created.
- Internal evaluation form (5 categories × 0/0.5/1 + comments) — completable in-app by Joshua / team.
- T+5-days client evaluation — scheduled job in-app sends email with link to public client-evaluation page.
- Submitted evaluations write to the Evaluation Log and trigger Labour Rating recalculation.

### 5.7 Compliance Documents — PDF Licence Profiles

Replaces: **Documint**.

- HTML/CSS template for the Licence Profile lives in the repo.
- Renderer and adapter pattern: see [ARCHITECTURE §3](./ARCHITECTURE.md#3-pdf-rendering-architecture).
- Trigger points:
  - Manual: "Generate Licence Profile" button on a labourer record.
  - Automatic: on labourer-info update (mirror of current Airtable + Documint behaviour).
- PDF stored in the app's file storage (signed URLs for retrieval); no Google Drive dependency.

### 5.8 Client Handoff

Replaces: **manual handoff email** (currently ad hoc).

- "Notify Client" action on a Work Order → composes an email containing:
  - Work Order + assigned labourers list
  - Each labourer's PDF Licence Profile (attached or signed download links)
- Pre-filled template, editable before send.
- Sent via the app's email integration — see [ARCHITECTURE §2](./ARCHITECTURE.md#2-technical-stack-locked-v1).
- Sent communications logged on the Work Order.

### 5.9 Forms Replacement Strategy

All current third-party-hosted forms (Tally + Airtable forms) are replaced by the web app. They split into two categories with deliberately different UX:

| Form today | Provider today | Replacement | Type | Notes |
|---|---|---|---|---|
| Outreach trigger | Tally | "Start Outreach" action on Work Order page | Operator (auth'd) | No longer a form — workflow button with candidate filtering inline |
| Hiring selection | Tally | "Hire Selected" action on response table | Operator (auth'd) | No longer a form — multi-select on the response list |
| Availability response | Tally | Native public page at signed-token URL | Public (labourer) | Same UX from the labourer's side; SMS contains the tokenized link |
| Profile update | **Airtable form** (writes directly into Airtable today) | Native public page at signed-token URL | Public (labourer) | Same UX from the labourer's side; tokenized link, file uploads supported |
| Client evaluation | Tally | Native public page at signed-token URL | Public (client) | Same UX from the client's side; tokenized link delivered via email |

**Operator forms collapse into the console** — Joshua never re-types a Work Order ID, because the action is launched from the Work Order page itself.

**Public forms remain forms but improve underneath:**

- Token-based URLs (no PII in query params, replacing Tally's prefilled `email=` / `phone=`). Token design details: [ARCHITECTURE §5.2](./ARCHITECTURE.md#52-token-design-public-forms).
- Data writes directly to our database — no Make.com round-trip.
- Hosted on our domain — full control over branding, validation, reliability, and analytics.
- Idempotent submissions (re-submitting the same token + payload doesn't duplicate state).

> **Note on form rendering across devices:** v1 ships with sensible default responsive layouts using the locked Tailwind + shadcn/ui stack (see [ARCHITECTURE §2](./ARCHITECTURE.md#2-technical-stack-locked-v1)) — defaults render acceptably on phones, the only realistic device a labourer will use to tap an SMS link. Dedicated mobile-first design + tested polish on small viewports is **deferred to v1.1** — see §2.3.

**Build, not buy — public forms are first-class app routes:**

We do **not** use a third-party form provider (Tally, Typeform, Formspree, etc.) for the public forms. They are unauthenticated routes in the same Next.js codebase as the operator console.

Rationale:

- **Eliminates webhook round-trip** — submission writes response + fires side effects in a single transaction. Today the path varies by form: Tally forms go *Tally → Tally webhook → Make.com → Sheets/Airtable → side effect*, while the Airtable profile-update form goes *Airtable form → Airtable base → Make.com (if any side effect) → onward*. Both flows have the same fragility class — third-party hop + brittle orchestration. Native handlers collapse this into one transaction.
- **Token-based access** — third-party form providers don't support "URL token resolves to a recipient server-side", forcing PII (email/phone) into query params. Self-hosted lets us keep tokens opaque.
- **PII / licence image uploads** — profile-update uploads (driver's licence, HRWL, etc.) go directly to our storage rather than traversing a third-party form host (matches [ARCHITECTURE §4.4](./ARCHITECTURE.md#44-privacy--security)).
- **Dynamic per-Work-Order content** — availability form renders Work-Order-specific data (dates, location, pay) at request time using the token. Removes the "create a new Tally form per Work Order" Make.com step entirely.
- **One design system** — operator console and public forms share components, theme, validation, accessibility setup. Easier to brand and maintain.
- **No SaaS dependency** for what is, in scope, ~5 form components.

Implementation shape:

- Routes: `/r/availability/[token]`, `/r/profile-update/[token]`, `/r/evaluation/[token]`. No auth required; token-gated server-side.
- Submissions are server actions / API routes that write the response **and** trigger side effects (mark Inactive, send profile-update SMS, recalc Labour Rating) in one transactional flow.
- Default responsive layout (framework defaults render acceptably on phones); mobile-first polish deferred to v1.1.
- Idempotent submissions — re-submitting the same token + payload does not duplicate state.

When we *would* reach for a third-party provider (future): only if non-developer staff need to design ad-hoc forms (one-off surveys, custom intake) without code. Out of scope for v1.

### 5.10 System Activity & Error Recovery (operator-facing)

**Why this section exists:** Make.com today gives Joshua scenario-execution history and one-click re-run for free. Replacing Make.com without an equivalent operator-facing surface would be a regression in visibility. This section is the deliberate replacement — and an upgrade, because it's entity-aware.

This is distinct from dev-facing observability ([ARCHITECTURE §4.5](./ARCHITECTURE.md#45-observability-dev-facing) — Sentry, logs, metrics). System Activity is **for Joshua and his team to see, understand, and action failures inside the app, without leaving it**.

The underlying data model (`system_event` store) is shared with the dev observability layer — see [ARCHITECTURE §5.3](./ARCHITECTURE.md#53-system_event-store).

#### Surfaces

1. **Global inbox** — top-nav "System Activity" page with an unresolved-count badge. Filter by severity, entity type, time range, status (`open` / `retrying` / `resolved` / `dismissed`).
2. **Work Order page panel** — failures scoped to this Work Order (e.g. "3 outreach SMS failed", "Adobe Sign webhook missing for Tom's contract").
3. **Labourer record panel** — failures involving this labourer.

#### Anatomy of a System Activity entry

| Field | Purpose |
|---|---|
| Severity | `error` / `warning` / `info` |
| Timestamp | Absolute + relative ("12 minutes ago") |
| Entity links | One or more (`→ WO12`, `→ Tom Smith`) — clickable jumps |
| Human-readable message | E.g. "Failed to send outreach SMS to Tom Smith — Twilio reports 'invalid mobile number'" |
| Suggested actions | `[Retry]` `[Edit & retry]` `[Mark resolved]` `[Dismiss]` |
| History | Retry attempts, actor, resolution notes |
| Source | Originating subsystem (outreach, hiring, scheduled job, webhook, pdf, email) |

#### Failure handling tiers

- **Transient failures** (5xx, timeouts, queue blips) — auto-retried with exponential backoff. Only surface to the operator if all retries are exhausted.
- **Permanent failures** (invalid phone, expired token, missing required data) — surface immediately with an actionable suggestion.
- **Partial successes** (e.g. 47 of 50 outreach SMS sent, 3 failed) — the action result shows per-recipient status, and the 3 failures appear as individual entries so they can be retried per labourer.

#### Database hygiene — likely-dead numbers → Inactive

A repeated SMS send failure to the same labourer is a strong signal that the number is no longer valid. The current self-cleaning workflow only handles labourers who *actively* respond "I Don't Work Anymore" (§5.3); this section closes the loop on **silent attrition** (labourers who never respond because the number is dead).

Two layers:

**1. Per-entry operator action.** Any SMS-send-failure entry tied to a labourer includes an additional suggested action: `[Mark labourer Inactive]`. One click both resolves the entry and updates the labourer's status. Always available, no setting required.

**2. Pattern-based escalation across failures.** When a labourer accumulates **N consecutive permanent send failures** (default `N = 3`, ideally across more than one outreach campaign so a single misfire doesn't trip it), the system:

- Creates a higher-severity aggregated entry — e.g. *"Tom Smith — likely invalid number. 3 consecutive outreach attempts undeliverable across WO12 and WO15."* — instead of spamming the inbox with N separate error rows.
- Sets `[Mark labourer Inactive]` as the primary suggested action.
- Optionally auto-marks the labourer Inactive at a higher threshold (e.g. `M = 5` consecutive failures across 2+ campaigns). **Default: off.** Operator can enable this in settings if they want fully automatic hygiene; the conservative default avoids false positives from temporary outages or carrier changes.

**Audit trail.** Whichever path leads to Inactive, the system event log records the reason — *"Marked Inactive: repeated SMS failures (3 consecutive across WO12 and WO15)"*. If the labourer reappears with a new number, the operator can review the history, reactivate, and update the contact in one place.

This complements the existing "I Don't Work Anymore" → Inactive auto-flow. Together they self-clean the database on both axes: explicit opt-out *and* implicit unreachability.

#### Failure categories surfaced in v1

- Outbound SMS (Twilio) — per recipient.
- Inbound webhook processing (Twilio inbound, Adobe Sign signed-contract events).
- Scheduled job failures (e.g. T+5 client evaluation email not sent).
- PDF render failures (licence profile, contract).
- Email send failures (client handoff, profile-update prompts).
- Side-effect cascades (e.g. "I Don't Work Anymore" → mark Inactive write failed).
- Token resolution failures (expired before submitted, malformed).

#### Notification channels

- **In-app** (always) — nav badge + banner on relevant entity pages.
- **Email digest** — configurable threshold per user (e.g. "email on any error", "email on warning or above"). Per-user setting in profile.
- **Future** — Slack, push (out of scope for v1, but the eventing architecture supports it).

#### Retry semantics

- Operator-triggered retry from the UI is one-click and idempotent (matches [ARCHITECTURE §4.3](./ARCHITECTURE.md#43-reliability)).
- Background auto-retry uses exponential backoff with a cap (e.g. 5 attempts over ~15 minutes).
- Permanent failures are not auto-retried — they wait for operator action.

### 5.11 Data Migration (one-off, pre-launch)

**Scope: migrate everything.** No historical cutoff — all Work Orders, labourers, hiring log entries, and evaluation log entries come across, regardless of age.

#### Sources

| Source | Role | What it provides |
|---|---|---|
| **Airtable** labour database | Primary labourer source | Full labourer records — personal info, contact, licences (images + files), Labour Rating history |
| **Sheets** — Work Order Form | Primary Work Order source | Work Orders, Hiring Log tab, Evaluation Log tab |
| **Superchat** labour database | **Auxiliary input** (one column only) | Per-labourer **Inactive flag**. Not a separate dataset — only used to determine Active/Inactive status for labourers already in Airtable. |

#### Active/Inactive determination — script merge

The Inactive flag from Superchat is merged onto Airtable labourer records by the migration script. Joshua hands over two raw exports:

1. **Airtable export** — full labourer records (CSV or JSON, including any image/document references).
2. **Superchat export** — at minimum, phone number + Inactive flag per record.

Migration steps:

1. Normalise phone numbers in both exports to E.164 (e.g. `+61483932978`).
2. Left-join Superchat onto Airtable on normalised phone (with email as fallback key for rows missing a phone).
3. Apply the Inactive flag where matched.
4. Generate a **reconciliation report** before any data is written:
   - Superchat entries with no Airtable counterpart (ghost rows).
   - Airtable entries with multiple Superchat matches (duplicates to resolve).
   - Phone numbers that fail E.164 normalisation.
   - Email-only matches (lower confidence).
5. Joshua reviews the reconciliation report; resolves issues; we re-run.
6. On approval, run the import.

**Canonical rule:** if Superchat says Inactive, the labourer lands Inactive. Labourers with no Superchat match default to Active.

The merge is **reproducible** — we can re-run it against staging during dev without Joshua redoing any manual work.

#### Historical data treatment

- **Completed Work Orders** import in `Completed` status; readable, not editable.
- **Old Hiring Log / Evaluation Log entries** import as historical records — read-only beyond a cutoff date (TBD with Joshua, default: 90 days pre-cutover).
- **Old contracts** import as PDF references (no re-rendering of historical contracts).
- **Old Labour Ratings** import as the labourer's starting rating in the new system.

#### Active vs Inactive — separation at migration

Per the §5.2 domain rule:

- Inactive labourers are migrated, but pooled into the **"Archive" view** — never surface in default labourer lists or outreach candidate queries.
- Outreach logic at the database / service layer hard-excludes Inactive (matches the §5.2 invariant).
- The Inactive group is preserved as a log/reference for Joshua. He can flip records back to Active manually if a labourer reappears.

#### Operational

- Migration scripts version-controlled in `tools/migration/`.
- **Dry-run mode** — runs against staging, produces a reconciliation report (counts per source, merged records, conflicts, Inactive promotions).
- **Cutover plan** — Airtable / Sheets / Superchat go read-only at cutover; 30-day post-cutover window where they remain readable for verification but the app is the only writable system.

---

## 6. UX Patterns (cross-cutting)

These patterns apply consistently across the operator console — once committed to in one place, they apply everywhere with a list-and-detail shape so the app feels coherent.

### 6.1 Side-panel detail view

Selecting any row in a list view opens a side panel containing the full detail view for that record. The list stays visible; the panel can be closed to return to the same scroll position and filter state.

| Behaviour | Default |
|---|---|
| **Trigger** | Click row in list view |
| **Width** | TBD by design, typically 480–640px on desktop |
| **Content** | Full detail view (not a preview) — every field and action available is accessible without leaving the panel |
| **Close** | X button, `Esc` key, or click on overlay |
| **Deep-linkable URL** | Yes — query param like `?selected=<id>` updates as the panel opens, supports bookmarking / sharing |
| **"Expand to full page" affordance** | Optional, for complex flows (e.g. multi-licence upload) |
| **Stacking** | Single panel at a time — no nested side panels |
| **Mobile** | **Out of scope for v1** — desktop console only. Mobile responsive behaviour deferred to v1.1 (see §2.3). |

**Surfaces that use this pattern:**

| List view | Side panel content |
|---|---|
| Labourers (§5.2) | Full labourer detail — fields, licences, Labour Rating, activity timeline, per-labourer actions |
| Work Orders (§5.1) | Work Order detail — outreach status, response list, hiring log, evaluation log, communications log |
| System Activity inbox (§5.10) | Failure detail + suggested actions (`Retry`, `Mark Inactive`, etc.) |
| Hiring Log entries (§5.5) | Contract status, downloadable PDF, signed-event history |
| Evaluation Log entries (§5.6) | Score breakdown, comments, source (internal vs client) |

### 6.2 Other cross-cutting patterns

- **Saved filter views** — every list with non-trivial filtering supports user-saved views (e.g. *Expiring in 30 days*, *Active QLD riggers*) — same affordance shape across Labourers, Work Orders, etc.
- **Bulk actions** — list views support multi-select with a consistent action bar (Mark Inactive, Request re-upload, Add to outreach, etc.).
- **Activity timeline** — every primary entity (Labourer, Work Order, Hiring Log entry) has the same timeline component showing chronological events from outreach, responses, hires, evaluations, system events.

---

## 7. Open Decisions

Resolved decisions are recorded in [DECISIONS.md](./DECISIONS.md). The items below are still pending.

1. **Adobe Sign plan tier (§5.5)** — confirm whether Joshua's Adobe Sign plan supports API access. Determines whether v1 ships baseline (manual upload + webhook receipt) or v1+ (in-app "Send via Adobe Sign" button). Action before Phase C.
2. **Twilio account credentials** ([ARCHITECTURE §2](./ARCHITECTURE.md#2-technical-stack-locked-v1)) — collect Account SID, Auth Token, and Messaging Service SID (if used) before Phase B build. Number `+61483932978` already confirmed.
3. **Outbound email sender alias** ([ARCHITECTURE §2](./ARCHITECTURE.md#2-technical-stack-locked-v1)) — domain `summit-resources.com.au` is confirmed; Joshua to pick `hr@`, `operations@`, or both (split by email category). DNS verification for Resend handled at Phase A start.
4. **Database hygiene thresholds (§5.10)** — confirm with Joshua: how many consecutive failed SMS to a labourer should trigger the aggregated "likely invalid number" entry (`N`, proposed `3`)? Should auto-Inactive at a higher threshold be enabled by default or opt-in (`M`, proposed `5`, opt-in)?
5. **Historical-record edit cutoff (§5.11)** — beyond what age should imported Hiring Log / Evaluation Log entries be read-only? (Default: 90 days pre-cutover.)
6. **Token semantics (§5.9)** — single-use vs idempotent re-use within the Work Order window for public-form tokens. Default proposal: idempotent + Work-Order-window expiry.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Migration data loss / mismatch | Dry-run migrations against staging; reconciliation reports; keep Airtable/Sheets read-only post-cutover for 30 days |
| SMS deliverability regression vs current setup | Mirror current Twilio config; canary sending in early phases |
| PDF fidelity drift from Documint output | Side-by-side compare current Documint output vs in-app render before Phase C exit |
| Operator pushback on UX change | Joshua tested on key flows in each phase, not just at the end |
| Compliance doc storage / PII handling | Encryption at rest + signed URLs + access logs + AU region (per [ARCHITECTURE §4.4](./ARCHITECTURE.md#44-privacy--security)) |
| Scope creep (AI-SMS, client portal) | Explicitly non-goal in v1 — captured in §2.2 / §2.3 |
| Visibility regression vs. Make.com scenario history | Operator-facing System Activity surface (§5.10) is in scope from v1; per-failure entity links + one-click retry; replaces and exceeds Make.com's view |

---

## 9. Glossary

- **Work Order (WO)** — a job/engagement from one of Joshua's clients to staff a construction project. Sometimes informally called a "project" in industry contexts; this codebase and the app standardise on **Work Order** to avoid ambiguity with the construction project itself or with the app build engagement.
- **Labourer** — a worker in Joshua's network (Dogman, Rigger, Crane Operator, etc.).
- **Hiring Log** — record of labourers hired per Work Order with contract status.
- **Evaluation Log** — record of post-job ratings (internal + client).
- **Licence Profile** — PDF compliance document for a labourer.
- **Job Rating** — score for one labourer on one Work Order.
- **Labour Rating** — running average of a labourer's Job Ratings.
