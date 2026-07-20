# Project Structure

Feature-based module pattern: each domain has `actions/`, `components/`, `repositories/`, `schemas/`, `services/`, `types/`.

---

## `src/app/` — Next.js App Router

```
src/app/
├── layout.tsx              Root layout (fonts, providers, globals)
├── page.tsx                Home page (landing)
├── loading.tsx             Root loading state
├── globals.css             Tailwind CSS v4
├── (auth)/                 Shared auth layout group
├── (dashboard)/            Dashboard sub-layouts
├── (menu)/                 Menu layout group
├── (public)/               Public layout group
│
├── auth/                   Public auth routes
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── onboarding/page.tsx
│   └── callback/route.ts   OAuth callback handler
│
├── cart/page.tsx           Shopping cart
├── checkout/page.tsx       Checkout flow
├── menu/page.tsx           Menu listing
│
├── order/
│   ├── confirmed/page.tsx  Order confirmation
│   └── track/page.tsx      Order tracking by code
│
├── dashboard/
│   ├── layout.tsx          Dashboard shell (sidebar, nav)
│   ├── loading.tsx
│   ├── page.tsx            Dashboard homepage
│   │
│   ├── student/
│   │   ├── page.tsx        Student home
│   │   ├── loading.tsx
│   │   └── credit/page.tsx BNPL credit dashboard
│   │
│   ├── merchant/
│   │   ├── layout.tsx      Merchant sub-nav
│   │   ├── page.tsx        Merchant home
│   │   ├── loading.tsx
│   │   ├── orders/page.tsx
│   │   ├── products/page.tsx + new/ + [id]/edit/
│   │   ├── categories/page.tsx
│   │   ├── inventory/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx      Admin sub-nav
│   │   ├── page.tsx        Admin home
│   │   ├── loading.tsx
│   │   ├── students/page.tsx
│   │   ├── merchants/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── bnpl/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── audit-logs/page.tsx
│   │   └──  ... (and more)
│   │
│   └── delivery/
│       ├── page.tsx        Delivery home
│       └── loading.tsx
│
└── api/
    └── bnpl/
        └── repayment/route.ts  POST repayment endpoint
```

---

## `src/features/` — Domain Modules

Each feature self-contains its logic:

```
src/features/
├── auth/                   Authentication & user management
│   ├── actions/index.ts    Server actions (session, profile, onboarding)
│   ├── components/         LoginForm, SignupForm, OAuthButtons, AuthProvider
│   ├── schemas/index.ts    Zod validation
│   ├── services/auth-service.ts  Business logic
│   ├── store.ts            Zustand state
│   └── types/index.ts
│
├── bnpl/                   BNPL credit system (largest module)
│   ├── actions/index.ts    Credit dashboard, checkout, repayment
│   ├── components/         BNPLPaymentOption, StudentCreditDashboard
│   ├── repositories/       Data access (4 repos)
│   ├── schemas/index.ts
│   ├── services/           Business logic (9 services)
│   │   ├── bnpl-checkout-service.ts
│   │   ├── credit-ledger-service.ts
│   │   ├── credit-limit-service.ts
│   │   ├── credit-restoration-service.ts
│   │   ├── credit-verification-service.ts
│   │   ├── due-date-service.ts
│   │   ├── late-fee-service.ts
│   │   ├── repayment-service.ts
│   │   └── audit-service.ts
│   └── types/index.ts
│
├── cart/                   Shopping cart
│   ├── store/index.ts      Zustand store
│   └── types/index.ts
│
├── orders/                 Order lifecycle
│   ├── actions/index.ts    CRUD + status transitions
│   ├── repositories/index.ts
│   └── types/index.ts
│
├── payments/               Payment processing
│   ├── services/razorpay.ts
│   └── types/
│
├── products/               Product & menu management
│   ├── actions/index.ts    CRUD + categories
│   ├── repositories/index.ts
│   └── types/index.ts
│
├── restaurants/            Restaurant profiles
│   ├── actions/index.ts    Settings, dashboard, revenue
│   ├── repositories/index.ts
│   └── types/index.ts
│
├── admin/                  Admin operations
│   ├── actions/index.ts    ~35 functions (students, merchants, orders, BNPL, system)
│   ├── repositories/index.ts
│   └── types/index.ts
│
├── notifications/          Notifications
│   ├── actions/index.ts    CRUD + unread count
│   ├── repositories/index.ts
│   └── types/index.ts
│
└── delivery/               Delivery management
    └── types/index.ts
```

---

## `src/components/` — Shared UI

```
src/components/
├── landing/                Public landing page sections
│   ├── Hero.tsx
│   ├── FeaturedDishes.tsx
│   ├── AboutSection.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
│
├── shared/                 Reusable across features
│   ├── Navbar.tsx
│   ├── NavbarWrapper.tsx
│   ├── Footer.tsx
│   ├── LoadingSkeleton.tsx
│   ├── ThemeToggle.tsx
│   └── Toast.tsx
│
└── ui/                     Primitive UI components
    ├── data-table.tsx
    └── index.tsx
```

---

## `src/lib/` — Utilities

```
src/lib/
├── utils.ts                General helpers (formatting, validation)
├── errors.ts               Custom error classes (AppError, AuthError, etc.)
├── logger.ts               Structured logging (PINO_INSTANCE)
├── rate-limit.ts           Rate limiter (Upstash Redis + in-memory fallback)
└── csrf.ts                 CSRF token generation & verification
```

---

## `src/infrastructure/` — External Service Connectors

```
src/infrastructure/
├── supabase/
│   ├── client.ts           Browser client (anon key)
│   ├── server.ts           Server client (cookie-based SSR)
│   ├── admin.ts            Admin client (service role key)
│   ├── schema.ts           Generated DB types
│   └── index.ts            Re-exports
├── payments/               (empty — future payment provider abstraction)
└── storage/                (empty — future file storage abstraction)
```

---

## `src/schemas/` — Global Validation

```
src/schemas/
├── api.ts                  API request/response schemas (repayment, etc.)
└── env.ts                  Environment variable validation
```

---

## `src/__tests__/` — Unit & Integration Tests (32 test files)

```
src/__tests__/
├── setup.ts                Global mocks (vi.mock next/navigation)
│
├── admin/                  Admin dashboard tests
│   ├── system-settings.test.ts
│   ├── student-management.test.ts
│   ├── merchant-approval.test.ts
│   ├── bnpl-admin.test.ts
│   ├── order-intervention.test.ts
│   ├── refund.test.ts
│   └── audit-logs.test.ts
│
├── api/                    API route integration tests
│   ├── auth-callback.test.ts
│   └── repayment-route.test.ts
│
├── auth/                   Auth logic tests
│   ├── auth-flow.test.ts
│   └── auth-service.test.ts
│
├── bnpl/                   BNPL financial logic tests (core module)
│   ├── bnpl-checkout-service.test.ts
│   ├── late-fee-service.test.ts
│   ├── credit-restoration-service.test.ts
│   ├── audit-service.test.ts
│   ├── late-fee.test.ts
│   ├── credit-calculations.test.ts
│   ├── ledger-integrity.test.ts
│   ├── eligibility.test.ts
│   └── repayment.test.ts
│
├── lib/                    Utility & library tests
│   ├── rate-limit.test.ts
│   ├── csrf.test.ts
│   ├── utils.test.ts
│   ├── errors.test.ts
│   ├── logger.test.ts
│   └── zod-validation.test.ts
│
├── orders/
│   └── state-machine.test.ts
│
├── payments/
│   └── razorpay.test.ts
│
└── products/
    ├── data-isolation.test.ts
    └── validation.test.ts
```

---

## `e2e/` — E2E Tests (Playwright)

```
e2e/
├── home.spec.ts            Landing page smoke test
├── menu.spec.ts            Menu browsing
├── auth.spec.ts            Login/signup/onboarding flow
├── cart.spec.ts            Add to cart, update quantity
└── dashboard-merchant.spec.ts  Merchant dashboard interactions
```

---

## Root Configuration

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js 16 config (images, headers, webpack) |
| `vitest.config.ts` | Vitest (globals, jsdom, coverage, setup) |
| `playwright.config.ts` | Playwright (chromium only, webServer on port 3000) |
| `tsconfig.json` | TypeScript (bundler resolution, path aliases) |
| `eslint.config.mjs` | Flat ESLint config |
| `tailwind.config.ts` | Tailwind CSS v4 |
| `postcss.config.mjs` | PostCSS (Tailwind + autoprefixer) |
| `vercel.json` | Vercel deployment config |
| `.github/workflows/ci.yml` | CI (lint, typecheck, test, coverage, e2e) |
| `.github/workflows/deploy.yml` | CD (Vercel deploy) |
| `supabase/config.toml` | Supabase local dev config |
| `supabase/migrations/` | 4 SQL migration files |
