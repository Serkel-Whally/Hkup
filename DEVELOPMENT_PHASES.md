# CelluLite Data — Development Phases Roadmap

This document outlines the 6-phase development plan for the CelluLite Data platform as defined in `plan.md`.

## Project Overview

**CelluLite Data** is a Ghana-focused mobile data bundle platform. The project consists of:
- **Customer Platform**: Where users browse, purchase, and manage data bundles
- **Admin Platform**: Where staff manage bundles, orders, payments, customers, and operations
- **Backend API**: Express.js + MongoDB handling all business logic, payments, and provider integration

---

## Phase 1 — Foundation ✅ (Currently In Progress)

**Focus**: Core infrastructure, authentication, and database setup

### Objectives
- [x] Project setup (monorepo, Next.js + Express.js)
- [x] Design system (Tailwind CSS, components)
- [x] Basic authentication (JWT, login/signup)
- [x] Database schema (MongoDB with Mongoose)
- [x] User models and profiles
- [x] Admin authentication foundation
- [x] Role-based permission structure

### Deliverables
- Working authentication system
- User registration and login
- Protected API endpoints
- JWT token management
- Basic user profile schema

### Current Status
✅ **Complete** — Authentication flow is wired and functional. Users can register, login, and receive JWT tokens.

---

## Phase 2 — Customer UI 🔄 (In Progress)

**Focus**: Building all customer-facing pages and flows

### Objectives
- [x] Landing page
- [x] Dashboard (shell structure in place)
- [x] Buy Data page (network and bundle selection)
- [x] Checkout form (recipient number, payment methods)
- [x] Profile page (basic structure)
- [ ] Transactions page (list of orders)
- [ ] Transaction details page
- [ ] Wallet page (balance, funding)
- [ ] Wallet funding flow

### Key Pages to Complete
| Page | Status | Note |
|------|--------|------|
| Landing | ✅ Complete | Live and styled |
| Login | ✅ Complete | Functional with auth |
| Signup | ✅ Complete | Full registration flow |
| Dashboard | 🔄 Partial | Shell exists, needs content |
| Buy Data | ✅ Mostly Complete | Network/bundle selection works |
| Checkout | 🔄 Partial | Form structure exists, payment method selection incomplete |
| Profile | 🔄 Partial | Basic layout only |
| Transactions | ❌ Not Started | Needs orders API integration |
| Transaction Details | ❌ Not Started | Needs order detail API |
| Wallet | ❌ Not Started | Needs wallet ledger system |

### What's Left
- Complete transaction history page
- Complete transaction detail view
- Build wallet balance display
- Build wallet funding flow
- Add "Fund Wallet" modal/page
- Integrate real wallet balance from backend

---

## Phase 3 — Backend Commerce 🔄 (Partially Implemented)

**Focus**: Core business logic for orders, payments, and wallets

### Objectives
- [x] Bundle database (Plan model exists)
- [x] Network management (structure ready)
- [ ] Order system (basic Order model, needs expansion)
- [x] Payment system (webhook route stubbed)
- [ ] Wallet ledger (transaction history)
- [ ] Payment verification (webhook processing)
- [ ] Provider integration (mock in place)
- [ ] Order processing workflow (documented, not fully automated)

### Current Implementation
- ✅ `/api/plans` — List and create plans
- ✅ `/api/plans/orders` — Create orders
- ✅ `/api/auth` — Registration, login, logout
- 🔄 `/api/payments/webhook` — Stub needs real Paystack/Stripe integration
- ❌ `/api/wallets` — Not yet implemented
- ❌ `/api/transactions` — Not yet implemented

### Order Processing Workflow (From plan.md section 50)

```
Customer selects bundle
    ↓
Enters recipient number
    ↓
Selects payment method
    ↓
Creates order (NEW → AWAITING_PAYMENT)
    ↓
Payment initiated
    ↓
Payment verified (webhook)
    ↓
Order becomes PAID
    ↓
Provider API receives request
    ↓
Order becomes PROCESSING
    ↓
Provider confirms delivery
    ↓
Order becomes COMPLETED
    ↓
Receipt generated
    ↓
Customer notified
```

### Database Models Needed
- `Plan` ✅ (exists)
- `Order` (partial)
- `User` ✅ (exists)
- `Wallet` (needs creation)
- `WalletTransaction` (needs creation)
- `Payment` (needs creation)
- `Receipt` (needs creation)
- `Provider` (needs creation)

---

## Phase 4 — Admin Platform ❌ (Not Started)

**Focus**: Building the administrative interface

### Objectives
- [ ] Admin dashboard (overview, KPIs)
- [ ] Order management (list, filter, view timeline)
- [ ] Customer management (list, view profiles)
- [ ] Bundle management (CRUD, pricing)
- [ ] Network management (MTN, Telecel, AirtelTigo)
- [ ] Provider management (API keys, configuration)
- [ ] Payment management (verification, refunds)
- [ ] Wallet management (view balances, adjust)
- [ ] Refund processing
- [ ] Support ticket management

### Admin Navigation Structure
```
ADMIN SIDEBAR

Overview

Orders
Customers
Bundles
Networks
Providers

Payments
Wallets
Refunds

Support

Announcements

Reports
Analytics

Security
Feature Access

Settings
```

### Admin Dashboard KPIs
- Today's Sales (GH₵ amount)
- Total Orders (count)
- Successful Orders
- Processing Orders
- Failed Orders
- Popular bundles
- Network performance
- Payment summary
- Failed orders list
- Recent orders

---

## Phase 5 — Operational Features ❌ (Not Started)

**Focus**: Notifications, announcements, receipts, and monitoring

### Objectives
- [ ] Push notifications (order updates, payment status)
- [ ] Email notifications
- [ ] SMS notifications (optional, WhatsApp primary)
- [ ] Announcements system (admin can broadcast to users)
- [ ] Receipt generation (text, PDF, shareable)
- [ ] Reports (sales, performance, customer behavior)
- [ ] Expense tracking (cost of bundles vs selling price)
- [ ] Audit logs (all system events)
- [ ] Suspicious activity detection

### Notification Triggers
- Order payment received
- Order processing started
- Order completed
- Order failed
- Wallet funded
- Refund processed
- New announcement from admin

---

## Phase 6 — Hardening ❌ (Not Started)

**Focus**: Security, performance, and production readiness

### Objectives
- [ ] Security audit
- [ ] Rate limiting on all endpoints
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention (using Mongoose)
- [ ] Input validation on all forms
- [ ] API authentication (verify JWT on all protected endpoints)
- [ ] HTTPS enforcement
- [ ] CORS configuration hardening
- [ ] Security headers (CSP, X-Frame-Options, etc.)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Responsive testing (all screen sizes)
- [ ] Payment edge cases testing
- [ ] Provider failure handling and recovery
- [ ] Refund processing edge cases
- [ ] Performance optimization
- [ ] Error handling and user-friendly error messages
- [ ] Monitoring and alerting setup
- [ ] Database backups
- [ ] Deployment to production
- [ ] Privacy policy and terms

---

## Core MVP Workflow (Section 50 of plan.md)

The **most important workflow** that the entire MVP is built around:

```
CUSTOMER JOURNEY

Open CelluLite
    ↓
Login
    ↓
Dashboard (see balance, recent transactions)
    ↓
Buy Data
    ↓
Choose Network (MTN, Telecel, AirtelTigo)
    ↓
Choose Bundle (size, price, validity)
    ↓
Enter Recipient Number
    ↓
Choose Payment Method (Wallet, Mobile Money, Card)
    ↓
Confirm Purchase
    ↓
Payment Processing
    ↓
Backend verifies payment
    ↓
Order = PAID
    ↓
Provider API called
    ↓
Order = PROCESSING
    ↓
Provider confirms delivery
    ↓
Order = COMPLETED
    ↓
Wallet/Payment ledger updated
    ↓
Receipt generated
    ↓
Customer notified
```

**This workflow must work flawlessly before anything else.**

---

## Order Status Lifecycle (Section 14 of plan.md)

### Order Status
- `NEW` — Order created, awaiting payment
- `AWAITING_PAYMENT` — Waiting for customer to complete payment
- `PAID` — Payment verified, ready for provider
- `PROCESSING` — Sent to provider, awaiting delivery confirmation
- `COMPLETED` — Data delivered successfully
- `FAILED` — Order failed (payment or provider)
- `CANCELLED` — Customer or admin cancelled
- `REFUNDED` — Refund processed

### Payment Status
- `UNPAID` — No payment received
- `PENDING` — Payment initiated, awaiting confirmation
- `PAID` — Payment verified
- `FAILED` — Payment failed
- `REFUNDED` — Payment refunded

**Important**: Order status and payment status are independent. An order can be `PROCESSING` while payment is `PAID`.

---

## Key Files and Locations

### Frontend (packages/frontend)
- `app/page.tsx` — Landing page
- `app/login/page.tsx` — Login
- `app/signup/page.tsx` — Sign up
- `app/dashboard/page.tsx` — Dashboard
- `app/buy-data/page.tsx` — Buy data flow
- `app/checkout/checkout-form.tsx` — Checkout
- `app/profile/page.tsx` — Profile
- `app/lib/auth.ts` — Auth utilities
- `app/components/dashboard-shell.tsx` — Layout wrapper

### Backend (packages/backend)
- `src/index.js` — Server entry point
- `src/routes/auth.js` — Authentication endpoints
- `src/routes/plans.js` — Bundle/order endpoints
- `src/routes/payments.js` — Payment webhook
- `src/models/User.js` — User schema
- `src/models/Plan.js` — Plan/bundle schema
- `src/models/Order.js` — Order schema (partial)
- `src/db.js` — Database connection

### Configuration
- `docker-compose.yml` — Local MongoDB setup
- `.env.example` — Environment variables template
- `plan.md` — Complete product specification

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5 with TypeScript
- **UI**: React 19, Tailwind CSS, Radix UI
- **State**: Zustand, React Query
- **Icons**: Lucide React
- **Validation**: Zod
- **Forms**: Custom form handling
- **Notifications**: Sonner (toast)

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Hashing**: bcryptjs
- **Environment**: dotenv
- **Server**: Node.js
- **Dev**: Nodemon

### DevOps
- **Containerization**: Docker + Docker Compose
- **Package Manager**: Yarn workspaces
- **Linting**: ESLint
- **TypeScript**: v5.3.3

---

## Development Guidelines

### Adding New Features
1. Check the plan.md specification for the feature
2. Identify which phase it belongs to
3. Update the status in this roadmap
4. Create a feature branch: `feature/phase-X-feature-name`
5. Follow the existing code structure
6. Test thoroughly before merging

### Code Organization
- Frontend: Feature-based folder structure (pages, components, lib)
- Backend: Route-based with separate models and services
- Shared: Types and utilities where appropriate

### Testing Priority (Phase 6)
1. User registration and login
2. Order creation workflow
3. Payment verification
4. Wallet balance calculation
5. Refund processing
6. Provider integration edge cases

---

## Environment Setup

```bash
# Clone and setup
git clone https://github.com/Serkel-Whally/Hkup.git
cd Hkup

# Install dependencies
yarn install

# Setup environment
cp packages/backend/.env.payments.example packages/backend/.env

# Run MongoDB (via Docker)
docker-compose up -d

# Start development
yarn dev

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## Next Steps (Immediate)

### High Priority (Complete Phase 2 & 3)
1. ✅ Dashboard — Load real user data and wallet balance
2. ❌ Transactions page — Display all orders for current user
3. ❌ Transaction details — Show single order with timeline
4. ❌ Wallet page — Show balance and transaction history
5. ❌ Wallet funding flow — UI for adding funds
6. ❌ Complete order model schema in backend
7. ❌ Create wallet ledger system
8. ❌ Implement real payment verification (Paystack/Stripe)

### Medium Priority (Phase 4)
1. Build admin dashboard shell
2. Admin order management interface
3. Admin bundle/network management
4. Admin customer management

### Later (Phase 5 & 6)
1. Notifications and announcements
2. Receipt generation
3. Security audit and hardening
4. Performance optimization

---

**Last Updated**: 2026-10-05
**Current Phase**: Phase 2-3 (Customer UI & Backend Commerce)
**Status**: MVP in active development
