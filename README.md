# Dilip Da — Homestyle Bengali Cuisine

A food ordering platform built with Next.js 16, Supabase, and TypeScript. Features **Ethics Pay BNPL** (Buy Now, Pay Later) credit system for students.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase SSR (email/password + Google OAuth)
- **State**: Zustand (client), React Query (server)
- **Styling**: Tailwind CSS v4 + CSS variables
- **Payments**: Razorpay (full) + BNPL (Ethics Pay)
- **Forms**: React Hook Form + Zod v4
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (menu)/            # Menu components
│   ├── auth/              # Login, signup, onboarding
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout with Razorpay + BNPL
│   ├── dashboard/         # Role-based dashboards
│   │   └── student/
│   │       └── credit/    # BNPL credit dashboard
│   ├── order/             # Order tracking & confirmation
│   └── api/               # API routes (BNPL repayments, etc.)
├── components/
│   ├── landing/           # Landing page components
│   └── shared/            # Shared UI (Navbar, Footer, Toast, ThemeToggle)
├── features/              # Feature-based modules
│   ├── auth/              # Authentication & authorization
│   ├── bnpl/              # Ethics Pay BNPL system
│   │   ├── actions/       # Server actions
│   │   ├── components/    # Dashboard & payment option UI
│   │   ├── repositories/  # Data access (Repository Pattern)
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   ├── cart/              # Shopping cart
│   └── payments/          # Razorpay integration
├── infrastructure/
│   └── supabase/          # DB clients, schema types
├── lib/                   # Utilities & error classes
└── config/                # Environment config
```

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase project
- Razorpay account (optional, for card payments)

### Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in:
   - Supabase URL and keys
   - Razorpay key ID and secret (optional)
3. Run migrations against your Supabase database:

```bash
# Point the supabase CLI at your project, or run schema.sql manually
```

4. Install dependencies and run:

```bash
npm install
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run format` | Format with Prettier |

## Ethics Pay BNPL System

### Features

- **Credit Verification**: Student verification workflow with eligibility checks
- **Credit Limit Assignment**: Configurable per-student credit limits
- **BNPL Checkout**: Purchase on credit with automatic ledger entries
- **Credit Ledger**: Complete transaction history with balance tracking
- **Due Date Management**: Automatic repayment schedule generation
- **Late Fee Engine**: Configurable late fees (daily, weekly, percentage, fixed)
- **Repayment Flow**: Full, partial, and Razorpay repayments
- **Credit Restoration**: Automatic credit restoration on repayment
- **Student Dashboard**: Real-time credit overview with React Query
- **Audit Trail**: Immutable logs for all credit actions

### Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Components  │────▶│   Actions    │────▶│  Services   │
│  (Client)    │     │  (Server)    │     │  (Logic)    │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                                        ┌───────▼──────┐
                                        │ Repositories │
                                        │  (Data)      │
                                        └───────┬──────┘
                                                │
                                        ┌───────▼──────┐
                                        │   Supabase   │
                                        │  (PostgreSQL)│
                                        └──────────────┘
```

### Database Tables

| Table | Purpose |
|-------|---------|
| `credit_accounts` | Student credit accounts with limits and verification |
| `credit_transactions` | Immutable ledger of all credit movements |
| `credit_repayments` | Repayment schedule entries |
| `credit_audit_logs` | Immutable audit trail for compliance |

### Key Services

| Service | Responsibility |
|---------|---------------|
| `CreditVerificationService` | Student verification & eligibility |
| `CreditLimitService` | Credit limit assignment & utilization |
| `BNPLCheckoutService` | BNPL checkout validation & processing |
| `CreditLedgerService` | Transaction recording & integrity checks |
| `DueDateService` | Repayment schedule & overdue detection |
| `LateFeeService` | Late fee calculation & application |
| `RepaymentService` | Full/partial/razorpay repayment processing |
| `CreditRestorationService` | Credit restoration after repayment |
| `AuditService` | Immutable audit logging |

## Database Migrations

Migrations are in `supabase/migrations/`. Run against your Supabase project in order.

## Role-Based Access

| Role | Access |
|------|--------|
| `student` | Order food, manage BNPL credit |
| `merchant` | Manage restaurant & menu |
| `delivery` | View & update delivery assignments |
| `admin` | Full access to all data |
| `super_admin` | Same as admin |

## License

Private — Dilip Da
