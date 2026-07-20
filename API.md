# API Reference

This project uses Next.js **Server Actions** for all data mutations (with RSC for reads) and a single **API Route** for BNPL repayment (requires non-Razorpay client calls).

---

## Server Actions

All server actions are `"use server"` functions defined under `src/features/*/actions/`.

### Auth Actions (`src/features/auth/actions/index.ts`)

| Function | Returns | Description |
|----------|---------|-------------|
| `getServerSession()` | `{ user } \| null` | Current Supabase session → normalized user |
| `getServerProfile()` | `{ profile } \| null` | Fetch own profile row |
| `updateServerProfile(updates)` | `{ error \| null }` | Upsert profile + sync role to auth metadata |
| `completeOnboarding(formData)` | `{ error, redirect }` | Role selection → redirect to dashboard |

### Restaurant Actions (`src/features/restaurants/actions/index.ts`)

| Function | Returns | Description |
|----------|---------|-------------|
| `getMerchantRestaurant()` | `ApiResponse<Restaurant>` | Own restaurant |
| `getMerchantDashboard()` | `ApiResponse<Dashboard>` | Dashboard metrics |
| `getRevenueOverview(days)` | `ApiResponse<Revenue>` | Revenue over N days |
| `getRestaurantSettings()` | `ApiResponse<Settings>` | Settings |
| `updateRestaurantSettings(updates)` | `ApiResponse<Settings>` | Update settings |
| `toggleRestaurantOpen()` | `ApiResponse<{ is_open }>` | Toggle open/closed |

### Product Actions (`src/features/products/actions/index.ts`)

| Function | Returns | Description |
|----------|---------|-------------|
| `getProducts(filter)` | `ApiResponse<Product[]>` | List products |
| `getProduct(id)` | `ApiResponse<Product>` | Get by ID |
| `createProduct(data)` | `ApiResponse<Product>` | Create |
| `updateProduct(id, data)` | `ApiResponse<Product>` | Update |
| `archiveProduct(id)` | `ApiResponse<void>` | Soft-delete |
| `restoreProduct(id)` | `ApiResponse<void>` | Restore archived |
| `deleteProduct(id)` | `ApiResponse<void>` | Hard-delete (no orders) |
| `updateProductStock(id, qty)` | `ApiResponse<Product>` | Update stock |
| `getCategories(includeInactive)` | `ApiResponse<Category[]>` | List categories |
| `createCategory(data)` | `ApiResponse<Category>` | Create category |
| `updateCategory(id, data)` | `ApiResponse<Category>` | Update category |
| `deleteCategory(id)` | `ApiResponse<void>` | Delete category |
| `reorderCategories(ids[])` | `ApiResponse<void>` | Reorder |

### Order Actions (`src/features/orders/actions/index.ts`)

| Function | Returns | Description |
|----------|---------|-------------|
| `getOrders(filter)` | `ApiResponse<OrdersResponse>` | List orders |
| `getOrder(id)` | `ApiResponse<Order>` | Get by ID |
| `updateOrderStatus(id, status, note?)` | `ApiResponse<Order>` | Status transition |
| `getOrderCounts()` | `ApiResponse<Record<status, count>>` | Counts by status |
| `acceptOrder(id)` | `ApiResponse<Order>` | Accept |
| `declineOrder(id, reason?)` | `ApiResponse<Order>` | Decline |
| `markPreparing(id)` | `ApiResponse<Order>` | Mark preparing |
| `markReady(id)` | `ApiResponse<Order>` | Mark ready |
| `markCompleted(id)` | `ApiResponse<Order>` | Mark completed |
| `cancelOrder(id, reason?)` | `ApiResponse<Order>` | Cancel |

### Notification Actions (`src/features/notifications/actions/index.ts`)

| Function | Returns | Description |
|----------|---------|-------------|
| `getMyNotifications(filter)` | `ApiResponse<NotificationsResponse>` | List for current user |
| `markNotificationRead(id)` | `ApiResponse<void>` | Mark one read |
| `markAllNotificationsRead()` | `ApiResponse<void>` | Mark all read |
| `getUnreadNotificationCount()` | `ApiResponse<number>` | Unread count |

### BNPL Actions (`src/features/bnpl/actions/index.ts`)

| Function | Returns | Description |
|----------|---------|-------------|
| `getCreditDashboard()` | `{ success, data?, error? }` | Full credit overview |
| `getCreditAccount()` | `{ success, data?, error? }` | Own credit account |
| `checkBNPLEligibility()` | `{ success, data?, error? }` | Eligibility check |
| `processBNPLCheckout(orderId, amount)` | `{ success, data?, error? }` | BNPL purchase |
| `processRepayment(repaymentId)` | `{ success, data?, error? }` | Full repayment |
| `getAuditLogs()` | `{ success, data?, error? }` | BNPL audit trail |
| `getCreditTransactions()` | `{ success, data?, error? }` | Credit transactions |

### Admin Actions (`src/features/admin/actions/index.ts`)

All require `admin` or `super_admin` role.

| Function | Description |
|----------|-------------|
| `getAdminDashboard()` | Platform metrics |
| `getAdminStudents(filter)` | List students |
| `getAdminStudentById(id)` | Student details |
| `suspendStudent(id, reason)` | Suspend + audit |
| `unsuspendStudent(id, reason)` | Unsuspend + audit |
| `verifyStudent(id)` | Verify credit account |
| `getAdminMerchants(filter)` | List merchants |
| `approveMerchant(merchantId, restaurantId)` | Approve + audit |
| `rejectMerchant(merchantId, restaurantId, reason)` | Reject + audit |
| `suspendMerchant(id, reason)` | Suspend + audit |
| `restoreMerchant(id, reason)` | Restore + audit |
| `updateMerchantCommission(id, rate)` | Set commission + audit |
| `getAdminOrders(filter)` | List all orders |
| `forceUpdateOrderStatus(id, status, reason)` | Force status change |
| `cancelOrderByAdmin(id, reason)` | Admin cancel |
| `getAdminCreditAccounts(filter)` | List credit accounts |
| `increaseCreditLimit(id, limit, reason)` | Increase limit |
| `reduceCreditLimit(id, limit, reason)` | Reduce limit |
| `freezeCredit(id, reason)` | Freeze account |
| `unfreezeCredit(id, reason)` | Unfreeze account |
| `waiveLateFee(accountId, repaymentId, reason)` | Waive fee |
| `getSystemSettings()` | Read all settings |
| `updateSystemSetting(id, value)` | Update setting |
| `getAuditLogs(filter)` | Filter audit logs |
| `getUserOrderHistory(userId, page)` | User's orders |
| `getStudentCreditHistory(userId)` | User's credit |
| `getMerchantRevenue(merchantId)` | Merchant revenue |
| `getMerchantAnalytics(merchantId)` | Merchant analytics |
| `processRefund(paymentId, amount, reason)` | Refund + audit |
| `bulkSuspendStudents(ids[], reason)` | Bulk suspend |
| `bulkUnsuspendStudents(ids[], reason)` | Bulk unsuspend |
| `bulkSuspendMerchants(ids[], reason)` | Bulk suspend |
| `bulkRestoreMerchants(ids[], reason)` | Bulk restore |
| `getLowStockProducts()` | Low inventory |
| `getRecentPayments()` | Recent 20 payments |

---

## API Routes

### `POST /api/bnpl/repayment`

Process BNPL repayment (used when client-side payment gateway is involved).

**Rate limit:** `strict` (10 req/min per IP)  
**Auth:** Authenticated session required  
**CSRF:** Protected via `csrfGuard`

**Request body:**
```json
{
  "repaymentId": "uuid",
  "amount": 500.00,
  "gatewayPaymentId": "pay_xxx" // optional, for Razorpay
}
```

**Validation schema** (`src/schemas/api.ts`):
- `repaymentId`: UUID string (required)
- `amount`: Positive number (optional, defaults to full outstanding)
- `gatewayPaymentId`: String (optional)

**Responses:**
| Status | Body | When |
|--------|------|------|
| 200 | `{ success: true }` | Repayment processed |
| 400 | `{ error: "message" }` | Validation or processing error |
| 401 | `{ error: "Unauthorized" }` | No valid session |
| 429 | `{ error: "Too many requests" }` | Rate limit exceeded |

---

## Rate Limit Tiers

Applied in `src/lib/rate-limit.ts`. Dual provider: Upstash Redis (production) → in-memory Map (fallback).

| Tier | Rate | Applied To | Purpose |
|------|------|------------|---------|
| `strict` | 10 req/min | `/auth/login`, `/auth/signup` (middleware), `POST /api/bnpl/repayment` | Brute-force prevention |
| `default` | 30 req/min | `/dashboard/*` (middleware) | General throttling |
| `relaxed` | 100 req/min | — (reserved) | Bulk operations |
| `generous` | 300 req/min | — (reserved) | Webhooks |

**Note:** Server Actions (`Next-Action` header present) are **exempt** from middleware rate limiting to avoid blocking legitimate form submissions.

---

## Auth Requirements

| Route | Auth Required | Role Check |
|-------|---------------|------------|
| `/` (home) | No | — |
| `/auth/*` | No | Redirect to `/` if session exists |
| `/cart` | No | — |
| `/checkout` | No | — |
| `/order/track` | No | — |
| `/menu` | No | — |
| `/dashboard` | Yes | Redirect to `/auth/login` if no session |
| `/dashboard/student/*` | Yes | Redirect to onboarding if no role; redirect to correct dashboard if wrong role |
| `/dashboard/merchant/*` | Yes | Same |
| `/dashboard/delivery/*` | Yes | Same |
| `/dashboard/admin/*` | Yes | Same |
| `POST /api/bnpl/repayment` | Yes (session check) | Returns 401 if no session |

**Middleware** (`src/middleware.ts`):
- Creates Supabase SSR client per request
- Fetches session + profile role
- Redirects unauthenticated users to `/auth/login?redirect=<path>`
- Redirects role-mismatched users to the correct dashboard
- Redirects roleless authenticated users to `/auth/onboarding`
