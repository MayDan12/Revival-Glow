# Revival Glow

A modern e-commerce storefront and admin dashboard built with Next.js (App Router), Supabase, and Stripe. This repository contains a full-featured store with product management, checkout, orders, and a simple admin area for managing products and viewing analytics.

## Highlights

- Next.js (App Router) project structure located in `app/`
- Server-side and client components
- Supabase used for data and authentication
- Stripe integration for checkout and webhooks
- Admin area with product import/CSV templates in `components/admin/dashboard/`
- Tailwind CSS for styling and Radix UI primitives for accessible components

## Tech stack

- Next.js (v15) App Router
- React 19
- Supabase (client + server)
- Stripe (checkout and webhooks)
- Tailwind CSS
- TypeScript

## Quick local setup

Prerequisites

- Node.js 18+ (recommend LTS)
- pnpm (this repo uses pnpm-style commands; npm or yarn should also work but examples use pnpm)

Install

Open a terminal in the repository root and run:

```powershell
pnpm install
```

Run development server

```powershell
pnpm dev
```

Available scripts (from `package.json`)

- `pnpm dev` run Next.js in development mode (uses Turbopack)
- `pnpm build` production build
- `pnpm start` start the production server after build

## Environment variables

Create a `.env.local` file in the project root and set the required environment variables. This project uses Supabase and Stripe; the list below covers the typical variables used here. Replace placeholder values with your own keys.

Example `.env.local` (DO NOT commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key-if-needed

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional
DATABASE_URL=postgres://...   # if using a managed DB

# Any other keys referenced in your deployment files
```

Notes

- `NEXTAUTH_SECRET` is used by NextAuth.js (the repo includes `next-auth.d.ts` and config in `api/auth`).
- `STRIPE_WEBHOOK_SECRET` is used to verify incoming Stripe webhook requests.
- If you use Supabase for server operations that require elevated privileges (like file uploads or server-side CSV imports), set `SUPABASE_SERVICE_ROLE_KEY` on the server only (never expose it to the browser).

## Admin and product imports

- The admin dashboard and CSV templates are in `components/admin/dashboard/`.
- There's a `products-template.csv` in the same directory; use it as a starting point for bulk product uploads.

## Stripe webhooks (local testing)

To test webhooks locally you can use the Stripe CLI or ngrok. Example with Stripe CLI:

```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe/route
```

Replace the forward URL with the webhook endpoint path this app exposes.

## Building & deploying

1. Build the app

```powershell
pnpm build
```

2. Start the production server

```powershell
pnpm start
```

For deployment platforms (Vercel, Netlify, Render, etc.), set the same environment variables in the platform dashboard. If deploying to Vercel, the App Router is supported out-of-the-box.

## Next steps / suggestions

- Add a `Makefile` or package scripts for common setup tasks (seed DB, run tests).
- Add a small seed script to populate demo products and an admin user (use `SUPABASE_SERVICE_ROLE_KEY` safely).
- Add CI workflow to run TypeScript checks and linting on PRs.

## License

If you plan to open-source this repo, add a `LICENSE` file. MIT is a common choice.
