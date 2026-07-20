# Database Schema

**Platform:** Supabase (PostgreSQL 15.x)  
**Extensions:** `pgcrypto`, `uuid-ossp`  
**Migrations:** `supabase/migrations/` (4 files)

---

## Tables (26 total)

### Profiles & Auth

| Table | Rows To | Description |
|-------|---------|-------------|
| `profiles` | `auth.users` (FK CASCADE) | Extends Supabase auth; stores `role`, `full_name`, `phone`, `avatar_url`, `is_active`, `deleted_at` (soft-delete). Role check constraint: `student`, `merchant`, `delivery`, `admin`, `super_admin`. |

### Restaurant & Menu

| Table | Rows To | Description |
|-------|---------|-------------|
| `restaurants` | `profiles(owner_id)` | Name, slug (unique), address, geo coords, hours, delivery fee, status (`pending`/`active`/`suspended`/`closed`). |
| `restaurant_settings` | `restaurants` (FK CASCADE, UNIQUE) | Prep time, max orders per slot, GST/FSSAI/license, commission rate. |
| `categories` | `restaurants` (FK CASCADE) | Name, slug (unique per restaurant), display order, soft-delete. |
| `products` | `restaurants`, `categories` (FK SET NULL) | Price, unit (`piece`/`plate`/`kg`/etc), dietary flags, spice level, stock, tags (text[] GIN indexed). |
| `product_images` | `products` (FK CASCADE) | URLs with alt text and sort order. |

### Orders & Payments

| Table | Rows To | Description |
|-------|---------|-------------|
| `orders` | `profiles`, `restaurants`, `addresses` | Tracking code (auto-generated `DD-XXXXXXXX`), status history (jsonb[]), subtotal/fee/tax/discount/total, payment method & status, scheduling. |
| `order_items` | `orders` (FK CASCADE), `products` | Snapshot of product name/price at order time. |
| `payments` | `orders` (FK CASCADE), `profiles` | Razorpay gateway fields (order/payment/signature), refund tracking, metadata. |
| `payment_logs` | `payments` (FK CASCADE) | Immutable event log with payload and IP. |

### BNPL Credit System

| Table | Rows To | Description |
|-------|---------|-------------|
| `credit_accounts` | `profiles` (FK CASCADE, UNIQUE) | Credit limit, available credit, outstanding, status (`active`/`suspended`/`closed`), verification status, credit score (300-900), late fee rate, due days. Constraint: `available_credit + outstanding <= credit_limit`. |
| `credit_transactions` | `credit_accounts` (FK CASCADE), `orders` (FK SET NULL) | Immutable ledger. Type: `purchase`, `repayment`, `fee`, `adjustment`, `restoration`. Tracks balance before/after. |
| `credit_repayments` | `credit_accounts` (FK CASCADE), `credit_transactions` (FK SET NULL) | Due date, paid date, late fee, status (`pending`/`paid`/`overdue`/`partial`), payment method (`razorpay`/`wallet`). |
| `credit_audit_logs` | `profiles` (FK CASCADE) | Immutable audit trail for all BNPL actions. 12 credit-specific action types. |

### Delivery

| Table | Rows To | Description |
|-------|---------|-------------|
| `delivery_partners` | `profiles` (FK CASCADE) | Vehicle type, availability, online status, live location, rating, total deliveries. |
| `delivery_assignments` | `orders`, `delivery_partners` | Status (`assigned` → `picked_up` → `in_transit` → `delivered`/`failed`), timestamps, customer rating. |

### Engagement & Admin

| Table | Rows To | Description |
|-------|---------|-------------|
| `reviews` | `products`, `profiles`, `orders` (FK SET NULL) | Per-product ratings (1-5), verified flag, unique per product+user. |
| `ratings` | `restaurants`, `profiles`, `orders` (FK SET NULL) | Restaurant-level food/delivery/overall ratings, unique per restaurant+user. |
| `notifications` | `profiles` (FK CASCADE) | Types: `order`, `payment`, `bnpl`, `system`, `promo`. Read tracking. |
| `addresses` | `profiles` (FK CASCADE) | Label, geocoded, is_default flag, soft-delete. |
| `inventory_logs` | `products` (FK CASCADE) | Change tracking with reason and reference. |

### System Tables

| Table | Description |
|-------|-------------|
| `audit_logs` | Generic CRUD audit (insert/update/delete/restore) with old/new data snapshot. |
| `activity_logs` | User activity stream (action, resource, metadata). |
| `reports` | Generated report metadata (type, date range, config, file URL). |
| `analytics` | Daily aggregated metrics per restaurant (unique on restaurant_id+date+metric). |
| `system_settings` | Key-value store for dynamic config (15 seed settings including late fee %, grace period, credit limits, tax, maintenance mode). |

---

## BNPL Ledger Design

The BNPL system uses a double-entry style ledger via `credit_transactions`:

```
Purchase:                  credit_accounts.outstanding += amount
                           credit_accounts.available_credit -= amount
                           → transaction type='purchase', balance_before/after

Repayment (full):          credit_accounts.outstanding -= amount
                           credit_accounts.available_credit += amount
                           → transaction type='repayment', balance_before/after

Late fee:                  credit_accounts.outstanding += fee
                           credit_accounts.available_credit -= fee
                           → transaction type='fee', balance_before/after

Credit restoration:        credit_accounts.available_credit += amount
                           (outstanding unchanged)
                           → transaction type='restoration', balance_before/after
```

**Key invariant:** `available_credit + outstanding <= credit_limit` (enforced by CHECK constraint).

**Repayment lifecycle:**
1. Repayment schedule generated on purchase with `due_date = purchase_date + due_days`
2. Status starts `pending` → transitions to `paid`, `partial`, or `overdue`
3. Late fee applied via `apply_late_fee()` function when past `due_date + grace_period_days`
4. Repayment processed via `process_repayment()` (supports partial payments in File 2 enhanced version)

---

## Indexes (69 total)

### Critical query indexes
- `idx_orders_restaurant_status` — `(restaurant_id, status, created_at DESC)` — Merchant order list
- `idx_orders_tracking_status` — `(tracking_code)` INCLUDE `(status, total, restaurant_id)` — Order tracking lookups
- `idx_products_restaurant_category` — `(restaurant_id, category_id, is_active, sort_order)` — Menu display
- `idx_credit_transactions_account_created` — `(credit_account_id, created_at DESC)` — Student credit history
- `idx_credit_repayments_due_status` — `(due_date, status)` WHERE `status IN ('pending','partial')` — Overdue processing
- `idx_payments_status_created` — `(status, created_at DESC)` — Payment reconciliation
- `idx_profiles_role_active` — `(role, is_active)` INCLUDE `(full_name, email)` — Admin user listing
- `idx_products_low_stock` — `(restaurant_id, track_inventory, stock_quantity)` WHERE `track_inventory=true AND stock_quantity <=5` — Low stock alerts

### Full-text & array indexes
- `idx_products_tags` — GIN index on `tags (text[])`
- `idx_notifications_user_unread` — `(user_id, is_read, created_at DESC)` — notification badge queries

---

## Row Level Security (44 policies across 24 tables)

All tables have RLS enabled. Tables without explicit `CREATE POLICY` statements (`restaurant_settings`, `product_images`, `inventory_logs`, `payment_logs`) default to deny-all.

### Access patterns

| Pattern | Tables | Policy |
|---------|--------|--------|
| **User owns the record** | `profiles`, `addresses`, `notifications`, `credit_accounts` | `user_id = auth.uid()` |
| **User owns via relationship** | `credit_transactions`, `credit_repayments` | FK walk to `credit_accounts.user_id` |
| **Role-based** | All admin tables | `role IN ('admin','super_admin')` |
| **Ownership via parent** | `orders`, `payments` | `restaurant.owner_id = auth.uid()` for merchants |
| **Public read** | `products`, `categories`, `reviews`, `ratings` | `is_active = true` (filtered) |
| **Service role insert** | `credit_audit_logs` | Permission bypass for `service_role` |

---

## Functions & Triggers

### Trigger helper
- `update_updated_at()` — Sets `updated_at = now()` on BEFORE UPDATE for 13 tables.

### Auth trigger
- `on_auth_user_created` (AFTER INSERT on `auth.users`) → `handle_new_user()` — Auto-creates profile row.

### Order tracking
- `trg_orders_status_track` (BEFORE UPDATE on `orders`) → `track_order_status()` — Appends `{status, timestamp, note}` to `status_history` jsonb[] array.

### BNPL functions (in `supabase/migrations/20260719131800_bnpl_audit_and_enhancements.sql`)
- `initialize_credit_account(user_id, credit_limit, verification_status)` — Creates account
- `process_repayment(repayment_id, gateway_payment_id, amount)` — Full/partial repayment with balance tracking
- `apply_late_fee(credit_account_id, amount, description)` — Late fee with audit log
- `record_bnpl_purchase(credit_account_id, order_id, amount)` — Validates credit, creates purchase tx
- `get_student_credit_dashboard(user_id)` — JSONB aggregation of account + transactions + repayments + utilization

### Admin functions
- `get_admin_dashboard()` — Aggregated counts, revenue, BNPL metrics
- `get_admin_audit_logs(search, table, action, dates, page, page_size)` — Paginated, filterable audit logs
- `get_merchant_dashboard(restaurant_id)` — Order counts, revenue, product count
- `get_order_by_tracking(lookup_code)` — Public RPC for order lookup by tracking code

---

## Seed Data

`system_settings` table seeded with 15 defaults (on conflict do nothing):

| Key | Default | Description |
|-----|---------|-------------|
| `late_fee_percentage` | `5` | Late fee % of outstanding per period |
| `late_fee_type` | `percentage` | Type: percentage or fixed |
| `grace_period_days` | `3` | Days after due before late fee |
| `max_credit_limit` | `50000` | Maximum BNPL credit limit |
| `min_credit_limit` | `1000` | Minimum BNPL credit limit |
| `student_eligibility_min_age` | `18` | Minimum age for BNPL |
| `merchant_commission_percentage` | `5` | Default merchant commission % |
| `tax_percentage` | `5` | Default tax % on orders |
| `maintenance_mode` | `false` | Enable maintenance mode |
| `order_timeout_minutes` | `30` | Auto-cancel pending orders |
| `inventory_threshold` | `5` | Low inventory alert threshold |
| *(and 4 more)* | | Notification toggles, platform fee |

---

## Migrations

| File | Tables Added | Key Changes |
|------|-------------|-------------|
| `20260719121605_initial_schema.sql` | 24 tables | Full initial schema, all RLS policies, basic BNPL functions |
| `20260719131800_bnpl_audit_and_enhancements.sql` | `credit_audit_logs` | Enhanced BNPL (partial repayment, late fee, credit restoration), audit trail |
| `20260719140000_system_settings.sql` | `system_settings` | Dynamic config with 15 seed values, admin dashboard function |
| `20260720000000_optimization_indexes.sql` | — | 13 covering indexes for query performance, low stock filter, notification badge queries |
