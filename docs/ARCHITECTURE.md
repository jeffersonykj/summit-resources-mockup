# Architecture — Summit Resources Web App

| Field | Value |
|---|---|
| **Status** | v0.1 |
| **Last updated** | 2026-05-07 |
| **Companion docs** | [PRD.md](./PRD.md) (product spec) · [DECISIONS.md](./DECISIONS.md) (audit trail) · [CURRENT_WORKFLOW.md](./CURRENT_WORKFLOW.md) (as-is) |

> This document covers **how** we build the system. For **what** we build (product requirements), see [PRD.md](./PRD.md). For chronological lock-ins, see [DECISIONS.md](./DECISIONS.md).

---

## 1. Overview

Single-codebase Next.js application hosted on Vercel, backed by Supabase Postgres + Storage in Sydney for AU data residency. The app consolidates ten disparate platforms (per [PRD.md §1](./PRD.md#1-background)) into one operational hub for Joshua Shields' labour resourcing business.

Design priorities:

1. **Single transactional surface** — operations that today span Make.com → Sheets/Airtable/Tally land in one DB transaction.
2. **Adapter-first integrations** — Twilio, Adobe Sign, Resend, PDF rendering, SMS conversation surface (Superchat) are all behind adapter interfaces so future swaps (e.g. AI-SMS replacing Superchat) don't ripple through the codebase.
3. **Operator-aware error surface** — failures land in a first-class in-app inbox, not just dev telemetry.
4. **Multi-tenant ready, single-tenant launch** — every business object scoped by `org_id` from day one.

---

## 2. Technical Stack (locked v1)

| Area | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js (App Router) on Node | One codebase for operator console + public token-gated form routes + API routes; aligns with Web ruleset |
| **Language** | TypeScript | Project conventions |
| **Styling** | **Tailwind CSS v3** | De facto standard for Next.js; Claude-design output is Tailwind-native (zero-friction handoff); pairs with React Email for email templates; v3 chosen over v4 alpha for stability through v1 |
| **Component library** | **shadcn/ui** | Components copy-pasted into the repo (no vendor lock-in); built on Radix UI primitives (accessibility free); fully customisable via Tailwind tokens |
| **Hosting** | **Vercel** | App + serverless functions; multi-region edge; access works fine from UK during dev |
| **Database** | **Supabase Postgres (Sydney `ap-southeast-2`)** | Relational fits the data model; AU residency for labourer/client PII; pairs with Supabase Auth |
| **Auth** | **Supabase Auth** | Pairs naturally with Supabase Postgres; built-in email flows (no extra email-provider load); roles + RLS support |
| **File storage** | **Supabase Storage (Sydney)** | Same-region as DB; signed URLs; integrates with Supabase Auth for access control |
| **ORM** | **Drizzle** | Lightweight, TypeScript-native, SQL-forward — good fit for evolving schema |
| **PDF rendering** | Headless Chromium via Puppeteer (behind `PdfRenderer` interface — see §3) | Best HTML/CSS template fidelity; pluggable to Documint or any HTTP-based service |
| **SMS** | Twilio (sender: `+61483932978`) | Already in use; AU long-code; outbound only in v1 (inbound continues to Superchat) |
| **Email** | **Resend** (behind `EmailSender` adapter) | Free tier covers expected v1 volume (~150–200/mo); React Email templates as components in repo; trivial swap if needed |
| **Scheduled jobs** | **Vercel Cron** | Native to hosting; covers T+5 evaluation emails, expiry checks, digests |
| **Queue / background jobs** | **Postgres-backed queue** (e.g. `pg-boss` or Drizzle-native pattern) | No extra service; jobs participate in the same transactions as their entities; free; swap to Trigger.dev / Inngest if we outgrow it |
| **E-signature** | Adobe Sign (behind `AdobeSignAdapter`) | Phased: webhook receipt v1 baseline; API send v1+ if plan permits |
| **Error tracking** | Sentry (or equivalent) | Dev-facing telemetry per §4.5; complements operator-facing System Activity ([PRD §5.10](./PRD.md#510-system-activity--error-recovery-operator-facing)) |

### 2.1 Component-stack defaults (bundled with shadcn)

These libraries fall out of the shadcn/ui choice and are locked as part of the same decision. They are shadcn's standard integration choices — picking shadcn means picking these.

| Concern | Library | Notes |
|---|---|---|
| **UI primitives** (transitive) | Radix UI | Accessibility, keyboard navigation, focus management — comes free via shadcn components |
| **Icons** | Lucide React | shadcn default; large icon set; tree-shakeable |
| **Forms** | react-hook-form | shadcn's standard form integration; performant, minimal re-renders |
| **Schema validation** | Zod | Pairs with react-hook-form via `@hookform/resolvers/zod`; same Zod schemas validate forms, API request bodies, and Drizzle inputs — single source of truth for shape |
| **Data tables** | TanStack Table | Headless engine for shadcn's `DataTable`; supports sort/filter/pagination patterns specced for Labourers and Work Orders |
| **Date pickers** | react-day-picker | shadcn default; integrated into shadcn's Calendar / DatePicker components |
| **Toasts** | sonner | shadcn default; lightweight; handles operator action feedback |
| **Email templates** | React Email | Already covered under §2 Email; Tailwind-native authoring |

### 2.2 Joshua's design-handoff scope

The styling / component lock-in does **not** constrain Joshua's design choices. His handoff only needs to define:

1. **Color tokens** — typically 8–12 hex values mapped to semantic roles (primary, foreground, background, muted, accent, destructive, border, etc.). Configured in `tailwind.config.ts` + `globals.css` CSS variables.
2. **Typography** — font family (Google Fonts or self-hosted) and type scale (h1, h2, body, small).

Other tokens (spacing, border radius, shadow, animations, breakpoints) **default to shadcn / Tailwind values** unless Joshua explicitly wants to override. For a professional B2B operator tool, the defaults are sensible and the colors+typography overrides provide the bulk of visual identity.

---

## 3. PDF Rendering Architecture

```
┌─────────────────────────┐    ┌──────────────────┐    ┌────────────────┐
│  Domain code            │───▶│  PdfRenderer IF  │───▶│  Implementation │
│  (LicenceProfile,       │    │  render(template │    │   - In-app HTML │
│   Contract, …)          │    │   , data) → PDF  │    │   - Documint    │
└─────────────────────────┘    └──────────────────┘    │   - Other       │
                                                       └────────────────┘
```

- Default v1 implementation: **In-app HTML → PDF** via headless Chromium.
- Fallback / pluggable: Documint or any HTTP-based PDF service.
- Template authoring: HTML + CSS, lives in the repo, reviewable in PRs.
- Print-CSS used for page sizing, page breaks, headers/footers.
- Used by: Licence Profile generation ([PRD §5.7](./PRD.md#57-compliance-documents--pdf-licence-profiles)), Contract generation ([PRD §5.5](./PRD.md#55-hiring--contract-generation)).

---

## 4. Non-Functional Requirements

### 4.1 Multi-user & Auth

- Email + password auth at minimum; social login (Google) decision needed (see [PRD §7](./PRD.md#7-open-decisions)).
- Roles: Owner, Operator, (optional) Read-only. Permissions enforced server-side.
- Audit log for sensitive actions (hire, contract sent, labourer status change, document generated).

### 4.2 Multi-tenancy posture

- v1 = single org (Joshua's business).
- Schema: every business object scoped by `org_id` from day one to avoid a painful migration later.

### 4.3 Reliability

- All external integrations (Twilio, Adobe Sign, Resend, Documint-fallback) accessed through a thin adapter layer with retries + idempotency keys. See §5.1 for adapter contracts.
- Webhooks idempotent — replays must not double-write.
- Outbound SMS rate-limited and observable.

### 4.4 Privacy & Security

- Labourer PII (driver's licence images, contact info) is sensitive — store encrypted at rest, signed URLs for retrieval, access logged.
- Australian-resident data — hosting region: **Supabase Postgres + Storage in Sydney `ap-southeast-2`** (locked, see §2).
- Secrets in environment variables / secret manager, never in code.

### 4.5 Observability (dev-facing)

- Structured logs across all domain operations and integrations.
- Metrics on: SMS sent/delivered/failed, response rates, document generation success, webhook receipt latency.
- Error tracking (Sentry or equivalent).

> Operator-facing visibility into failures (the replacement for Make.com's scenario history) is product surface, not dev telemetry — see [PRD §5.10 *System Activity & Error Recovery*](./PRD.md#510-system-activity--error-recovery-operator-facing). The two are deliberately separated: §4.5 is for engineers, PRD §5.10 is for Joshua.

### 4.6 Performance

- Response page (public form) — < 2.5s LCP on 4G.
- Operator console — feels instant (< 200ms interaction latency for common actions).
- PDF generation — < 5s p95 per document.

### 4.7 Testing

- Unit + integration tests for domain logic.
- Webhook handlers tested with replay fixtures.
- E2E tests for the four critical paths: outreach send, response capture, hiring + contract, client handoff.

---

## 5. Cross-Cutting Implementation Patterns

### 5.1 Adapter interfaces

External services are accessed through stable interfaces so we can swap implementations without touching call sites. All adapters share:

- Retry policy with exponential backoff and a cap.
- Idempotency keys for write operations.
- Structured logging tagged by adapter + operation.
- Failure events written to the `system_event` store (see §5.3) so the operator-facing System Activity surface ([PRD §5.10](./PRD.md#510-system-activity--error-recovery-operator-facing)) sees them.

| Adapter | Purpose | v1 implementation | Future implementations |
|---|---|---|---|
| `PdfRenderer` | Render PDFs from templates | Headless Chromium (Puppeteer) | Documint, hosted PDF API |
| `EmailSender` | Outbound transactional email | Resend + React Email templates | Postmark, SES |
| `SmsSender` | Outbound SMS | Twilio | Other AU carriers, message bird |
| `AdobeSignAdapter` | E-signature send + receive-on-signed | Webhook receipt only (baseline); API send (upgrade) | In-app e-signature replacement |
| `ConversationSurface` | Operator inbox for inbound SMS | Superchat (deep-link to thread) | AI agent + native inbox |

### 5.2 Token design (public forms)

Public forms ([PRD §5.9](./PRD.md#59-forms-replacement-strategy)) use opaque tokens in the URL — no PII in query parameters.

- Tokens are **scoped** per labourer × work order × purpose (availability, profile-update) or per client × work order (client evaluation).
- Tokens carry no PII; server-side lookup resolves token → recipient + context.
- Tokens have an **expiry** aligned with the relevant Work Order window.
- **Idempotent** within the Work Order window — re-submitting the same token + payload does not duplicate state. (Single-use semantics deferred per [PRD §7](./PRD.md#7-open-decisions).)
- Re-issuance flow supported in the operator console for "I lost the link" cases.

### 5.3 `system_event` store

A unified event log entity backs both audit trails and the operator-facing System Activity inbox.

- Every notable success / failure writes a row.
- Foreign keys to affected entities (work order, labourer, contract, etc.) — clickable jumps from the inbox.
- Severity (`error` / `warning` / `info`), source (subsystem), suggested actions, retry history.
- Retention: 90 days minimum for resolved/dismissed entries; open entries retained indefinitely.
- Powers the Global System Activity inbox, Work Order panel, Labourer record panel, and email digests — one store, multiple surfaces.

### 5.4 Background work split

| Pattern | Use cases | Implementation |
|---|---|---|
| **Scheduled** | T+5 client evaluation emails; nightly licence-expiry checks; periodic digests | Vercel Cron triggers HTTP endpoint that enqueues work |
| **Queue** | Outreach SMS batches (50+ recipients); PDF rendering; webhook side effects with retries; pattern-based likely-invalid-number detection | Postgres-backed queue (`pg-boss` or Drizzle-native pattern) |

**Why split:** Vercel Cron alone can't durably handle bursts or per-item retries within a single function execution timeout. The queue handles that; cron just schedules and dispatches.

### 5.5 Active/Inactive as domain invariant

Per [PRD §5.2](./PRD.md#52-labour-database):

- All outreach candidate queries hard-exclude `Inactive` at the database level (`WHERE active = true`).
- Service-layer guard: any code path that enqueues SMS or creates an outreach record for a labourer checks Active status; throws if Inactive.
- Flipping Active → Inactive cancels in-flight outreach for that labourer (idempotent).
- Implementation: enforced at both DB query level (RLS or explicit predicates) and service layer (guard clauses) — defence in depth.

### 5.6 Inbound webhook routing

A single webhook entry point handles inbound traffic, routed by source:

```
/api/webhooks/[source]
  ├─ /twilio          (SMS delivery status, future inbound)
  ├─ /adobe-sign      (signed-contract events)
  └─ /superchat       (future, if/when we replace email-listener fallback)
```

- All handlers idempotent — same event ID processed twice produces the same state.
- Failures write `system_event` rows so they surface in the operator inbox.
- Handler registration is part of the relevant adapter (e.g. `AdobeSignAdapter.onSigned(handler)`).

---

## 6. Phased Delivery

### Phase A — Foundation (data + auth)
- Schema, auth, multi-user, org scaffolding.
- Work Order + Labourer CRUD.
- Migration of existing data ([PRD §5.11](./PRD.md#511-data-migration-one-off-pre-launch)).
- *Exit:* Joshua can manage Work Orders and labourers in the app, with all his existing data present.

### Phase B — Outreach loop
- Twilio integration, SMS send, public availability form, response capture, side effects (Inactive, profile update).
- Per-Work-Order response dashboard.
- *Exit:* Joshua can run an outreach end-to-end without touching Tally/Sheets.

### Phase C — Hiring + contracts + PDF
- Contract template + in-app PDF rendering.
- Hiring Log + Adobe Sign signed-contract webhook.
- Licence Profile PDF generation.
- *Exit:* Joshua can hire labourers and produce compliance documents in-app.

### Phase D — Evaluation + client handoff
- Evaluation Log, internal + client evaluation flows, scheduled T+5 emails.
- Client handoff email composer.
- *Exit:* full v1 success criterion met.

### Phase E — Hardening
- Observability, alerting, audit, polish.
- Migration tooling tested at scale.
- *Exit:* production launch.
