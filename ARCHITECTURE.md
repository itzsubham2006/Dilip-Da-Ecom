# Architecture Overview

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase SSR (email/password + Google OAuth) |
| State (Client) | Zustand |
| State (Server) | React Query |
| Styling | Tailwind CSS v4 |
| Payments | Razorpay + BNPL (Ethics Pay) |
| Validation | Zod v4 |
| Icons | Lucide React |

## Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
├─────────────────────────────────────────────────────┤
│  Next.js App Router                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Pages    │  │ Layouts  │  │  API Routes      │  │
│  │ (RSC/RCC) │  │ (Shared) │  │  (/api/*)        │  │
│  └────┬─────┘  └──────────┘  └───────┬──────────┘  │
│       │                              │              │
│  ┌────▼──────────────────────────────▼──────────┐   │
│  │  Server Actions (use server)                 │   │
│  │  • Auth: login, signup, onboarding           │   │
│  │  • Products: CRUD, inventory                 │   │
│  │  • Orders: create, update, track             │   │
│  │  • BNPL: repayments, credit management       │   │
│  │  • Admin: users, settings, refunds           │   │
│  └───────────────────┬──────────────────────────┘   │
│                      │                              │
│  ┌───────────────────▼──────────────────────────┐   │
│  │  Repositories (Data Access Layer)            │   │
│  │  • RestaurantRepository                      │   │
│  │  • ProductRepository                         │   │
│  │  • OrderRepository                           │   │
│  │  • CreditAccountRepository                   │   │
│  │  • CreditTransactionRepository               │   │
│  │  • CreditRepaymentRepository                 │   │
│  │  • CreditAuditRepository                     │   │
│  │  • NotificationRepository                    │   │
│  │  • AdminRepository                           │   │
│  └───────────────────┬──────────────────────────┘   │
│                      │                              │
│  ┌───────────────────▼──────────────────────────┐   │
│  │  Supabase (PostgreSQL + RLS)                 │   │
│  │  • Auth: auth.users, auth.sessions           │   │
│  │  • Public: profiles, restaurants, orders     │   │
│  │  • BNPL: credit_accounts, transactions       │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Key Patterns

### 1. Repository Pattern
All database access goes through repository classes. This provides:
- Centralized query logic
- Explicit column selection (no `SELECT *`)
- Consistent error handling
- Testable data layer

### 2. Feature-Based Modules
Code is organized by feature (`auth/`, `bnpl/`, `cart/`, `payments/`), each containing:
- `actions/` — Server actions (API layer)
- `components/` — React components
- `repositories/` — Data access
- `services/` — Business logic
- `schemas/` — Zod validation
- `types/` — TypeScript types

### 3. Server Components First
Pages default to RSC (React Server Components). Client interactivity is isolated in `'use client'` components at the leaf level.

### 4. Dynamic Imports
Heavy client components use `next/dynamic` for code splitting.

### 5. Rate Limiting
Dual-mode rate limiter (`src/lib/rate-limit.ts`):
- **In-memory Map** — Development and single-server deployments
- **Upstash Redis** — Serverless/multi-instance deployments (auto-detected)

## BNPL System

The Ethics Pay BNPL system follows a double-entry accounting model:

```
Order → Credit Check → Ledger Entry → Repayment Schedule → Repayment
                                                              │
                                              ┌───────────────▼───────────────┐
                                              │ Full | Partial | Razorpay    │
                                              └───────────────┬───────────────┘
                                                              │
                                              ┌───────────────▼───────────────┐
                                              │ Credit Restoration + Audit   │
                                              └───────────────────────────────┘
```

## Route Structure

| Route | Type | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/menu` | Menu browsing | Public |
| `/cart` | Shopping cart | Public |
| `/checkout` | Checkout | Required |
| `/order/track` | Order tracking | Public |
| `/auth/*` | Login, signup, onboarding | Mixed |
| `/dashboard/student` | Student dashboard | Student |
| `/dashboard/merchant` | Merchant dashboard | Merchant |
| `/dashboard/delivery` | Delivery dashboard | Delivery |
| `/dashboard/admin` | Admin panel | Admin |

## Performance Optimizations

- Explicit column selection in all queries
- Composite indexes for common query patterns
- React Query with 5-minute stale time
- Image optimization via Next.js Image component
- AVIF/WebP format support
- Dynamic imports for below-fold content
- Loading skeletons for dashboard routes
- Compression enabled
- Preconnect hints for external resources
