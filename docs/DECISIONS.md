# Decisions Log — Summit Resources Web App

| Field | Value |
|---|---|
| **Status** | Append-only |
| **Last updated** | 2026-05-07 |
| **Companion docs** | [PRD.md](./PRD.md) (product spec) · [ARCHITECTURE.md](./ARCHITECTURE.md) (technical spec) · [CURRENT_WORKFLOW.md](./CURRENT_WORKFLOW.md) (as-is) |

> Lock-ins captured chronologically. Items here are **closed** — they should not be retroactively edited. To reverse a decision, append a new row stating the reversal and link back to the original.
>
> Section references use the format `<doc> §<n>` — e.g. `PRD §5.2`, `ARCHITECTURE §3`. Where a decision touches both docs, both references are listed.

---

## 2026-05-07 — Initial v1 lock-ins

| # | Section | Decision | Notes |
|---|---|---|---|
| 1 | PRD §3 | v1 success criterion: end-to-end Work Order run on web app + Superchat + Adobe Sign only | Twilio is integration plumbing, not a user-facing tool |
| 2 | PRD §5.7 / ARCHITECTURE §3 | PDF rendering in-app via headless Chromium, behind `PdfRenderer` interface; Documint as fallback option | Replaces Documint in v1 |
| 3 | PRD §5.9 | Public forms built natively in the web app (token-gated routes); no third-party form provider | Consolidates Tally + Airtable forms |
| 4 | PRD §5.9 | Profile-update form factually corrected: currently on Airtable form, not Tally | Doesn't change replacement plan |
| 5 | PRD §5.10 | Operator-facing System Activity surface in v1 (replaces Make.com scenario history); database-hygiene escalation for repeated SMS failures | One-click `[Mark labourer Inactive]` on failure entries |
| 6 | ARCHITECTURE §2 | Hosting: **Vercel** (app) + **Supabase Postgres + Storage in Sydney `ap-southeast-2`** (data + AU residency) | UK dev access works fine |
| 7 | ARCHITECTURE §2 | Auth: **Supabase Auth** | Pairs with Supabase Postgres |
| 8 | ARCHITECTURE §2 | ORM: **Drizzle** | TypeScript-native |
| 9 | ARCHITECTURE §2 | Email: **Resend** (behind `EmailSender` adapter) | Free tier covers v1 volume; React Email for templates |
| 10 | ARCHITECTURE §2 | Scheduled jobs: **Vercel Cron**; queue: **Postgres-backed queue** | Cron alone insufficient — split keeps architecture lean without extra SaaS |
| 11 | PRD §5.5 / ARCHITECTURE §5.1 | Adobe Sign: phased adapter (webhook receipt v1 baseline; API send v1+ if plan permits) | Plan tier confirmation pending — see PRD §7 |
| 12 | PRD §5.4 | Superchat link surface: store conversationId (deep-linkable) + phone number (fallback) | |
| 13 | PRD §5.2 | Licence expiry: filter views + bulk re-upload action; opt-in automation, default off | First-class workflow, not just a setting |
| 14 | ARCHITECTURE §4.1 | Read-only role deferred from v1; data model includes role scaffolding so adding later is non-disruptive | |
| 15 | PRD §8 | Branding / design: Joshua designs in Claude design and hands off styling rules pre-development | |
| 16 | PRD §5.11 | Migration scope: **everything**. No historical cutoff. | All Work Orders, labourers, hiring + evaluation logs |
| 17 | PRD §5.11 | Migration sources: Airtable (full labourer records) + Sheets (Work Orders). Superchat is **auxiliary** — contributes only the Inactive flag, not a separate dataset. | |
| 18 | PRD §5.11 | Migration merge approach: **script merge** (Option B). Joshua provides two raw exports; script left-joins on E.164 phone, generates reconciliation report, imports on approval. Reproducible during staging. | Joshua avoids manual row-matching |
| 19 | PRD §5.2 / §5.11 / ARCHITECTURE §5.5 | Active/Inactive enforced as a **domain invariant** — outreach hard-excludes Inactive at DB and service layer; not just a UI filter | Inactive group serves as Joshua's reference archive |
| 20 | PRD §5.2 | Labourers area: top-level navigation surface with full management UI — list view, detail view, manual add, archive vs hard-delete, per-labourer action buttons | Replaces Airtable as the day-to-day workforce-management surface |
| 21 | PRD §5.2 | Operator notes on labourer records: multi-entry, timestamped, author-attributed, pinnable, operator-internal only | Aligns with activity-timeline pattern; low ceremony to add |
| 22 | PRD §5.2 | Merge-duplicates feature in v1 (Owner role only). Tombstones with `merged_into` redirect; reversible within 30-day window. | Tombstones preserve historical reference integrity |
| 23 | PRD §6 | Cross-cutting UX pattern: **side-panel detail view** for all list-and-detail surfaces (Labourers, Work Orders, System Activity, Hiring Log, Evaluation Log). Deep-linkable, single-stack, **desktop-only in v1**. | Coherent operator experience across the app |
| 24 | PRD/ARCHITECTURE/DECISIONS | Documentation split: PRD (product), ARCHITECTURE (technical), DECISIONS (audit trail). | Easier evolution, cleaner diffs, smaller per-context reads |
| 25 | PROJECT_BRIEF §7.1 | Commercial model: Upwork hourly contract. Standard rate USD $75.20/hr; long-term client rate **USD $60/hr** (~20% loyalty discount). Weekly Upwork billing. **Rate is inclusive of all AI development tools** (Claude, Cursor, etc.) and dev environment costs — no separate tooling charges. | Solves payment timing concerns; transparent hours via Upwork tracker; bundled tooling explains the AI-assisted velocity at this rate |
| 26 | PROJECT_BRIEF §7.2 | v1 budget envelope: **75–99 hours, $4,500–$5,940 USD** at $60/hr. Phase A is the agreed commitment; B–E confirmed at phase boundaries. | Tightened from earlier $6,300–$9,600 estimate via aggressive AI-assisted velocity + v1.1 deferrals |
| 27 | PRD §2.3 / PROJECT_BRIEF §7.3 | v1.1 deferrals: auto-merge UI, System Activity pattern-based escalation, custom saved filter views, multi-entry operator notes, rich activity timeline. None block day-one workflow; built incrementally as ongoing support hours post-launch. | Keeps v1 within budget without compromising operational core |
| 28 | PRD §2.3 / §4.1 / §6.1 / PROJECT_BRIEF §7.3 | **Operator console is desktop-only in v1.** Mobile-friendly operator console (incl. side-panel mobile collapse) deferred to v1.1. Public forms still render on phones via framework defaults — only "polished mobile-first design" is what defers. | Tightens v1 scope; aligns with the $4,500–$5,940 v1 envelope |
| 29 | PROJECT_BRIEF §9 / §11 | **Codebase ownership: hosted under a Joshua-owned GitHub organization** (suggested: `github.com/summit-resources`). Developer added as Owner/Admin during build. Free tier covers all needs. | Standard for paid client work; clean ownership; transferable; protects continuity |
| 30 | ARCHITECTURE §2 / §2.1 / §2.2 | **Styling & Components locked**: **Tailwind CSS v3** (styling) + **shadcn/ui** (components). Bundled defaults from shadcn: Radix UI primitives (transitively), Lucide React (icons), react-hook-form (forms), Zod (validation), TanStack Table (data tables), react-day-picker (dates), sonner (toasts). Joshua's design-handoff scope: color tokens + typography only — other tokens (spacing, radius, shadow, etc.) use shadcn/Tailwind defaults. | Maximum AI-assisted velocity; Claude-design output is Tailwind-native; no vendor lock-in (components live in repo); accessibility free via Radix; lock-in does not constrain Joshua's design within professional B2B aesthetic |
