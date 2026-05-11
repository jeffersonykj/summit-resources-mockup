# Summit Resources — Mockup

Clickable, non-functional design preview for the Summit Resources operator console. Built to show Joshua Shields what the v1 deliverable will feel like before Phase A kicks off.

**This is a demo build.** No backend, no auth, no real data — every action is cosmetic and produces a toast notification.

## Stack

Matches the locked stack in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) so the visual foundation carries straight into the real build.

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS v3 (with `darkMode: ['class']`)
- Lucide React icons
- Sonner toasts
- Inter (via `next/font/google`)

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Routes

- `/login` — entry screen, any credentials work
- `/work-orders` — work order list (default landing post-login)
- `/labourers` — labour database
- `/hiring` — hiring log
- `/activity` — system activity inbox (the "what's failing" view)

## Theme

Defaults to dark mode on first load. Toggle via the sun/moon icon in the top bar. Choice persists to `localStorage` (`summit-theme` key).
