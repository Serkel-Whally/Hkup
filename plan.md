Yes. The main problem with the current plan is that it **mixes three different products together**:

1. **CelluLite Data customer app**
2. **CelluLite Data administration panel**
3. **A generic product/inventory/debt-management system**

For CelluLite Data, the third part introduces things that don't fit the business well—especially generic products, stock quantities, business onboarding, customer debt, and subscriptions.

Since **CelluLite Data sells mobile data bundles**, I would restructure the entire project like this.

# Phase 1 — Foundation and MVP Baseline

This is the first delivery phase and it must be treated as the technical foundation for the product. No later feature work should begin before this phase is stable.

## Phase 1 Objective

Build the minimal operating system for CelluLite Data:

- a clean monorepo structure
- a working customer auth flow
- a database-backed user model
- a backend API layer for plans and orders
- a functional customer journey from landing to checkout
- a strict status model for payment and order lifecycle

## Phase 1 Scope

### In scope

- Project bootstrapping with the current monorepo structure
- Next.js customer frontend in `packages/frontend`
- Express backend in `packages/backend`
- MongoDB integration with Mongoose
- User registration, login, logout, and session handling
- Protected API routes with JWT authorization
- Data bundle listing via backend-driven plan data
- Order creation flow with `NEW` / `AWAITING_PAYMENT` states
- Basic payment webhook and verification foundation
- Clean customer-facing screens for landing, auth, dashboard, buy-data, checkout, and profile

### Out of scope

- Admin dashboard
- Wallet ledger and advanced finance features
- Refund engine
- Wholesale business onboarding
- Common inventory or debt-management modules
- Analytics dashboards beyond basic operational summaries
- Advanced notifications, receipts, or support workflows

## Phase 1 Technical Requirements

### 1. Repository structure

The app must remain aligned with the actual codebase structure:

- `packages/frontend` — customer-facing Next.js app
- `packages/backend` — Express API and business logic
- root `package.json` — Yarn workspace orchestration

### 2. Frontend requirements

The frontend must support the required MVP flow without unnecessary product complexity.

Required routes and screens:

- `packages/frontend/app/page.tsx` — landing page
- `packages/frontend/app/login` — customer login
- `packages/frontend/app/signup` — customer registration
- `packages/frontend/app/dashboard` — account overview
- `packages/frontend/app/buy-data` — network and bundle browsing
- `packages/frontend/app/checkout` — bundle checkout and payment selection
- `packages/frontend/app/profile` — user profile and account actions

The app must not introduce non-core features such as airtime, electricity, loans, crypto, reward systems, referral systems, or generic business onboarding.

### 3. Backend requirements

The backend must remain focused on the service model that actually matches the business.

Required backend modules and responsibilities:

- `packages/backend/src/index.js` — Express app bootstrap
- `packages/backend/src/db.js` — MongoDB connection
- `packages/backend/src/models` — users, plans, orders, and later payment/wallet entities
- `packages/backend/src/routes` — auth, plans, orders, payments, and protected user actions
- `packages/backend/src/seed.js` — seed bundle data and test fixture data

### 4. Core business rules

The following rules are non-negotiable for Phase 1:

- CelluLite sells data bundles, not generic products.
- Customer accounts are personal accounts, not business accounts.
- Payment success is never inferred from the frontend alone.
- The backend must verify payments before wallet credit or order completion.
- Order status and payment status are separate concepts.
- Customer recipient number is separate from account phone number.
- Bundle pricing and availability must come from the backend, not hard-coded frontend values.

## Phase 1 Deliverables

### Functional deliverables

- working customer sign-up flow
- working customer login flow
- protected session handling with JWT
- bundle catalog loaded from backend
- order creation for a selected bundle
- minimal checkout flow for recipient number and payment method selection
- basic payment webhook endpoint with status updates
- backend foundation for order lifecycle transitions

### Technical deliverables

- stable environment variables
- working MongoDB configuration via Docker Compose
- consistent route and model naming conventions
- secure handling of auth tokens and protected endpoints
- code structure that supports future phases without redesign

## Phase 1 Acceptance Criteria

Phase 1 is complete only when all of the following are true:

1. A customer can register and log in successfully.
2. A protected backend endpoint rejects unauthenticated requests.
3. The backend can return available data bundles and network options.
4. A bundle purchase creates an order with a valid lifecycle status.
5. Payment verification is handled from the server side, not just UI state.
6. The app can complete a basic data purchase path without introducing unrelated product modules.
7. The codebase remains clean, specific to CelluLite Data, and easy to extend into later phases.

## Phase 1 Implementation Checklist

### Frontend

- [ ] finalise landing experience and conversion-focused CTA
- [ ] complete login page and auth state handling
- [ ] complete signup page and validation flow
- [ ] complete dashboard shell with real user context
- [ ] complete buy-data flow with network and bundle selection
- [ ] complete checkout form with recipient input and payment method selection
- [ ] maintain clean customer-only navigation

### Backend

- [ ] standardise environment and config setup
- [ ] confirm MongoDB connectivity and schema conventions
- [ ] validate auth routes and JWT flow
- [ ] complete plan listing and bundle data contract
- [ ] confirm order creation contract and status states
- [ ] implement payment verification webhook foundation
- [ ] ensure provider and payment events are backend-driven

### Product guardrails

- [ ] remove generic business/inventory language from the MVP roadmap
- [ ] ensure all checkout and order flows match mobile-data product logic
- [ ] keep admin features out of this phase
- [ ] avoid scope creep into wallet, debt, subscriptions, or supplier inventory features

## Phase 1 Definition of Done

Phase 1 is done when the codebase can reliably support a real customer purchase flow for mobile data bundles with authentication, orders, and backend verification, without mixing unrelated business systems into the product.

This is the baseline. All later phases—customer transactions, wallet, admin console, notifications, and hardening—should be built on this foundation, not around a different product model.

---

# CelluLite Data — Complete Product & Development Plan

## 1. Product Definition
