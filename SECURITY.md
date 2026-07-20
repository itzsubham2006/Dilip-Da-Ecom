# Security Overview

## Authentication

- **Supabase SSR Auth** — Server-side session management with HTTP-only cookies
- **Google OAuth** — Optional OAuth provider for social login
- **Email/Password** — Standard auth with Supabase's built-in email auth
- **Onboarding** — Role assignment (student/merchant/delivery) required before dashboard access

## Authorization (RBAC)

Roles: `student`, `merchant`, `delivery`, `admin`, `super_admin`

- **Middleware** enforces role-based dashboard routing (`/dashboard/<role>`)
- **Server Actions** include `authorizeAdmin()` checks for admin-only operations
- **Row Level Security (RLS)** on all Supabase tables

### RLS Policies

| Table | Policy |
|---|---|
| `profiles` | Users read/update own; admins read all |
| `orders` | Students see own; merchants see own restaurant orders; delivery sees assigned |
| `restaurants` | Public read active; merchants manage own; admins read all |
| `payments` | Users read own; merchants see own restaurant payments |
| `credit_accounts` | Users read own; admins read all |

## API Security

- **CSRF Protection** — Origin header validation for all POST requests via `src/lib/csrf.ts`
- **Rate Limiting** — Path-based and IP-based rate limiting via `src/lib/rate-limit.ts`
  - Auth endpoints: 10 requests/minute
  - Dashboard: 30 requests/minute
  - Repayment API: 10 requests/minute
- **Input Validation** — Zod schemas validate all API inputs (`src/schemas/api.ts`)
- **Environment Validation** — Zod schema validates all required environment variables at boot (`src/schemas/env.ts`)

## HTTP Security Headers

Configured in `next.config.ts` and `vercel.json`:

| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy-Report-Only` | Restricted to trusted origins (report-only mode) |

## Data Protection

- **Supabase** — Data encrypted at rest and in transit
- **Environment Variables** — Secrets never committed; use Vercel environment variables or server env
- **Log Redaction** — Structured JSON logger in `src/lib/logger.ts` redacts sensitive fields (passwords, tokens, keys)
- **Input Sanitization** — Zod validation prevents injection attacks

## BNPL Security

- **Service Role Key** — Used server-side only for admin operations (never exposed to client)
- **Audit Trail** — All credit actions logged immutably in `credit_audit_logs`
- **Ledger Integrity** — Transactions use balance_before/balance_after for double-entry accounting
- **Verification** — Student verification required before credit assignment

## Reporting Vulnerabilities

For security issues, contact the development team directly. Do not file public issues for security vulnerabilities.
