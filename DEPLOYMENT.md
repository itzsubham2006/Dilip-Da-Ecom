# Deployment Guide

## Prerequisites

- Node.js 20+
- A Supabase project (production)
- A Razorpay account (for payments)
- Vercel account (recommended) or a Node.js server

## Vercel Deployment (Recommended)

1. **Push your code** to a GitHub repository.

2. **Import the project** in Vercel dashboard.

3. **Set environment variables** in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Razorpay key ID
   - `RAZORPAY_KEY_SECRET` — Razorpay key secret
   - `NEXT_PUBLIC_APP_URL` — Your production URL (e.g., `https://dilipda.com`)

4. **Deploy**: Vercel automatically deploys on push to `main`.

### Region Selection

Choose `bom1` (Mumbai) for lowest latency in India.

## Database Migration

Run migrations against your production Supabase database:

```bash
# Using Supabase CLI
supabase db push --linked

# Or manually via Supabase SQL editor
# Run migrations/schema.sql, then migrations/*.sql in order
```

## Environment Files

| File | Purpose |
|---|---|
| `.env.example` | Reference template with all variables documented |
| `.env.local` | Local development (not committed) |
| `.env.staging` | Staging environment reference |
| `.env.production` | Production environment reference |

## CI/CD Pipeline

The project includes GitHub Actions workflows:

- **`.github/workflows/ci.yml`** — Runs lint, typecheck, test, and build on every PR and push to `main`/`develop`.
- **`.github/workflows/deploy.yml`** — Deploys to Vercel production on push to `main`.

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

## Manual Server Deployment

```bash
# Build
npm ci
npm run build

# Start
npm run start
```

Ensure all environment variables are set in the server environment.

## Monitoring

- **Vercel Analytics** — Enable in Vercel dashboard
- **Supabase Logs** — Monitor database queries and auth events
- **Error Tracking** — Add Sentry or similar for production error monitoring

## Rollback

To rollback a Vercel deployment:
1. Go to Vercel dashboard > Deployments
2. Find the last working deployment
3. Click the three dots menu > Promote to Production
