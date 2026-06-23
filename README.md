# MK Digital — Portfolio

Company portfolio for **MK Digital s.r.o.** — a solo full-service studio building mobile, web, and backend software end-to-end.

Built with **Next.js 16** (App Router) and deployed on Vercel.

## Tech stack

- **Next.js 16** — App Router, React 19, TypeScript
- **MUI v9** + Emotion — wrapper components, light/dark via `colorSchemes`
- **next-intl** — EN / SK / CS / DE, full key parity
- **Framer Motion** — animated app-screen previews, view-transition theme toggle

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Environment

Copy `.env.example` → `.env.local`:

- `NEXT_PUBLIC_API_URL` — backend base for the lead form (defaults to the Railway server; set to `http://localhost:8080` for local dev)
- `SITE_PASSWORD` — when set, the whole site is gated behind HTTP Basic Auth (pre-launch privacy); unset = public

## Structure

```
src/
├── app/         App Router routes, layout, middleware (privacy gate), robots
├── features/    Feature modules (showcase, …)
├── shared/      Wrapper components, hooks, theme, context
└── i18n/        next-intl config
locales/         en-GB / sk-SK / cs-CZ / de-DE
```

## Deployment

Vercel — import the repo, set the environment variables, deploy. The repo root is the app root (no sub-directory configuration needed).

---

© MK Digital s.r.o. — private repository.
