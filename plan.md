Yes. The main problem with the current plan is that it **mixes three different products together**:

1. **CelluLite Data customer app**
2. **CelluLite Data administration panel**
3. **A generic product/inventory/debt-management system**

For CelluLite Data, the third part introduces things that don't fit the business well—especially generic products, stock quantities, business onboarding, customer debt, and subscriptions.

Since **CelluLite Data sells mobile data bundles**, I would restructure the entire project like this.

# CelluLite Data — Complete Product & Development Plan

## 1. Product Definition

**CelluLite Data** is a Ghana-focused mobile-data platform where customers can:

* Browse MTN, Telecel and AirtelTigo data bundles
* Select a bundle
* Enter a recipient phone number
* Pay
* Have the order processed
* Track the order
* Receive a digital receipt
* Fund and use a CelluLite wallet
* View transaction history
* Manage their profile
* Receive important announcements
* Contact CelluLite through WhatsApp/support

The platform has **two major applications**:

### Customer Platform

The interface customers use to purchase and manage data.

### Admin Platform

The internal system CelluLite staff use to manage bundles, orders, payments, customers, providers, support, announcements and business performance.

---

# 2. High-Level System Structure

```text
                    CELLULITE DATA
                          │
             ┌────────────┴────────────┐
             │                         │
       CUSTOMER PLATFORM         ADMIN PLATFORM
             │                         │
       ┌─────┼─────┐             ┌─────┼─────┐
       │     │     │             │     │     │
     Buy   Wallet  Orders      Orders Payments
       │     │     │             │     │     │
     Data  Fund   Track        Bundles Customers
       │                         │
       └──────────┬──────────────┘
                  │
             BACKEND / API
                  │
       ┌──────────┼───────────┐
       │          │           │
    Database   Payment     Data Provider
               Gateway        API
```

---

# 3. CUSTOMER APP

## Customer Pages

I recommend **10 primary customer pages** for the first proper version.

| #  | Page                      | Purpose                       |
| -- | ------------------------- | ----------------------------- |
| 1  | Landing Page              | Introduce CelluLite Data      |
| 2  | Sign Up                   | Create account                |
| 3  | Login                     | Access account                |
| 4  | Dashboard                 | Main customer overview        |
| 5  | Buy Data                  | Browse networks/bundles       |
| 6  | Bundle Details / Checkout | Configure and purchase bundle |
| 7  | Transactions              | View previous orders          |
| 8  | Transaction Details       | View one order in detail      |
| 9  | Wallet                    | Fund and manage balance       |
| 10 | Profile                   | Manage account                |

Additional supporting pages:

* Help Centre
* Contact/Support
* Settings
* Notifications
* Password reset
* Email/phone verification
* Terms
* Privacy Policy

These don't all need to appear as primary navigation items.

---

# 4. CUSTOMER NAVIGATION

## Desktop Sidebar

```text
CelluLite DATA

Dashboard

Buy Data
  MTN
  Telecel
  AirtelTigo

Transactions
Wallet

────────────

Profile
Help Centre
Contact

────────────

Settings
Logout

[ WhatsApp Channel ]
```

The sidebar should remain simple.

Do **not** add:

* Airtime
* Electricity
* TV
* Betting
* Loans
* Crypto
* Investments
* Rewards
* Referral
* Analytics
* random widgets

---

# 5. CUSTOMER DASHBOARD

The dashboard is the customer's home.

### Structure

```text
Header
│
├── Search
├── Notifications
└── Profile

Welcome
"Good morning, Kyrios 👋"

Wallet
└── Balance + Fund Wallet

Buy Data
├── MTN
├── Telecel
└── AirtelTigo

Popular Bundles
├── Bundle
├── Bundle
├── Bundle
└── Bundle

Recent Transactions
├── Transaction
├── Transaction
├── Transaction
└── Transaction

Promotional / WhatsApp CTA
```

The dashboard should **not become an analytics dashboard**.

Its purpose is to help the customer quickly:

> **See balance → choose network → buy data → see recent activity.**

---

# 6. AUTHENTICATION

## Registration

Fields:

* Full name
* Phone number
* Email
* Password
* Confirm password

No referral code unless you deliberately introduce referrals later.

### Registration flow

```text
Sign Up
   ↓
Enter details
   ↓
Validate information
   ↓
Create account
   ↓
Verify email/phone if enabled
   ↓
Create session
   ↓
Dashboard
```

---

# 7. LOGIN

Customer can log in using the configured authentication method.

Features:

* Login
* Remember session
* Logout
* Forgot password
* Reset password
* Session expiration
* Secure session handling

Optional:

* Google login

Google login should be treated as a later enhancement rather than a requirement for the MVP.

---

# 8. CUSTOMER ONBOARDING

The original "Business onboarding" section should be removed.

A CelluLite customer is **not configuring a business**.

Instead, use a lightweight **customer profile setup**.

After registration:

```text
Welcome to CelluLite Data

Your profile
────────────

Full name
Phone number
Email
Avatar

[Continue]
```

Optional:

```text
Choose your preferred network
MTN
Telecel
AirtelTigo
```

But don't force unnecessary information.

Do **not** ask ordinary customers for:

* Business phone
* Business location
* Currency
* Receipt message
* Business payment method

Those belong in the **admin/business settings**.

---

# 9. BUY DATA

This is the core feature of CelluLite Data.

## Step 1 — Select Network

```text
Buy Data

Choose Network

[ MTN ]
[ Telecel ]
[ AirtelTigo ]
```

## Step 2 — Browse Bundles

Example:

```text
MTN

1GB       GH₵6.00
2GB       GH₵10.00
5GB       GH₵12.00
10GB      GH₵20.00
15GB      GH₵30.00
```

Every bundle should come from the backend.

Do not hard-code bundle prices.

---

# 10. BUNDLE CARD

Each bundle card should display:

* Network
* Data amount
* Price
* Validity
* Optional popularity label
* Buy button

Example:

```text
Popular

MTN
10GB

30 Days Validity

GH₵20.00

[ Buy Now → ]
```

Do not display unnecessary technical information to customers.

Provider cost price should **never be exposed to customers**.

---

# 11. CHECKOUT

After selecting a bundle:

```text
10GB MTN

GH₵20.00
30 Days Validity

Recipient Number
[ 024 XXX XXXX ]

Payment Method
○ Wallet
○ Mobile Money

Total
GH₵20.00

[ Confirm Purchase ]
```

The recipient number should be clearly separated from the customer's account phone number.

This is important because customers may purchase data for:

* themselves
* family
* friends
* another phone

---

# 12. PAYMENT

The payment architecture should support:

### Wallet

```text
Wallet Balance
GH₵125.00

Purchase
GH₵20.00

Remaining
GH₵105.00
```

### Mobile Money

Allow the configured payment provider to process the payment.

The exact provider should be configurable from the admin system.

The application must **never assume that a frontend payment was successful**.

Payment confirmation must come from the backend/provider verification or webhook.

---

# 13. ORDER PROCESSING

The core workflow should be:

```text
Customer selects bundle
        ↓
Enters recipient number
        ↓
Selects payment method
        ↓
Creates order
        ↓
Payment initiated
        ↓
Payment verified
        ↓
Order becomes PAID
        ↓
Data provider receives request
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

If something fails:

```text
Payment failure
       ↓
Order FAILED

Provider failure
       ↓
Order FAILED
       ↓
Refund process if applicable
```

This is the most important backend workflow in the entire project.

---

# 14. ORDER STATUS

Use a clear order lifecycle.

### Order status

```text
NEW
AWAITING_PAYMENT
PAID
PROCESSING
COMPLETED
FAILED
CANCELLED
REFUNDED
```

### Payment status

```text
UNPAID
PENDING
PAID
FAILED
REFUNDED
```

Don't mix payment status and order status.

They represent different things.

For example:

```text
Order:
PROCESSING

Payment:
PAID
```

This means the customer has paid but the data is still being delivered.

---

# 15. TRANSACTIONS

Customer transaction page.

Each transaction should contain:

* Network
* Bundle
* Recipient
* Amount
* Payment method
* Order number
* Date/time
* Order status
* Payment status

Filters:

* All
* Successful
* Processing
* Failed
* Refunded

Optional search:

```text
Search transaction...
```

---

# 16. TRANSACTION DETAILS

When a customer opens a transaction:

```text
← Back

Transaction Details

MTN
10GB Data Bundle

Completed ✓

GH₵20.00

Recipient
024 XXX XXXX

Payment Method
Wallet

Order Number
CLD-00001234

Payment Reference
PAY-XXXXXXXX

Date
15 Aug 2026

Completed
15 Aug 2026

────────────────

[ Download Receipt ]

[ Share Transaction ]

[ Copy Transaction ID ]
```

This page should be very clean.

---

# 17. WALLET

The wallet is a major customer feature.

## Wallet page

```text
Wallet

Available Balance

GH₵125.00

[ Fund Wallet ]

────────────────

Wallet Activity

+ GH₵50.00
Wallet funding

- GH₵20.00
10GB MTN

- GH₵12.00
5GB MTN
```

Features:

* Current balance
* Fund wallet
* Wallet transaction history
* Deposit status
* Purchase deductions
* Refund credits

---

# 18. WALLET FUNDING

Flow:

```text
Fund Wallet
      ↓
Enter amount
      ↓
Select payment method
      ↓
Confirm
      ↓
Payment
      ↓
Payment verification
      ↓
Wallet credited
      ↓
Receipt/confirmation
```

Important:

Never credit the wallet simply because the frontend says payment succeeded.

Use verified payment events.

---

# 19. PROFILE

Customer profile:

```text
Profile

[ Avatar ]

Full Name
Phone
Email

Account Status

[ Edit Profile ]

Security
[ Change Password ]

Notifications
[ Notification Preferences ]

Account
[ Logout ]
```

Keep this separate from business configuration.

---

# 20. HELP CENTRE

Help Centre should answer common questions.

Categories:

* Buying data
* Wallet
* Payments
* Failed orders
* Refunds
* Account
* Security

Each FAQ can expand/collapse.

At the bottom:

```text
Still need help?

[ Contact Support ]
[ WhatsApp ]
```

---

# 21. SUPPORT

Customer can create a support case.

Fields:

* Issue category
* Order number
* Message
* Optional attachment

Example categories:

* Payment issue
* Data not received
* Wrong number
* Wallet issue
* Refund
* Account issue
* Other

Admin can then manage the support case.

---

# 22. WHATSAPP

WhatsApp should be an important communication channel but not a replacement for the platform.

Use it for:

* General support
* Important announcements
* Customer assistance
* Sharing prepared messages where appropriate

Do not automatically send debt reminders or unsolicited messages.

---

# 23. RECEIPTS

After a successful purchase:

```text
CELLULITE DATA

Sales Receipt

Receipt No:
REC-000123

Customer:
Kyrios

Recipient:
024 XXX XXXX

Item:
MTN 10GB

Amount:
GH₵20.00

Payment:
Wallet

Status:
Completed

Date:
15 Sep 2026
```

MVP receipt formats:

### 1. Mobile receipt page

### 2. Printable receipt

Later:

* PDF
* Shareable image

Don't call it a certified tax invoice automatically.

---

# 24. ADMIN PLATFORM

Now separate the entire administrative system.

The admin panel should have its own layout.

```text
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

This is completely different from the customer's navigation.

---

# 25. ADMIN DASHBOARD

The admin dashboard should show business operations.

Unlike the customer dashboard, this one **can contain analytics**.

Overview:

```text
Today's Sales
GH₵ 2,450

Orders
184

Successful
172

Processing
7

Failed
5
```

Then:

* Sales overview
* Order performance
* Popular bundles
* Network performance
* Payment summary
* Failed orders
* Recent orders

However, keep the first version relatively simple.

---

# 26. ORDER MANAGEMENT

Admin can view all orders.

Columns:

* Order number
* Customer
* Recipient
* Network
* Bundle
* Amount
* Payment
* Order status
* Date

Filters:

* Status
* Network
* Payment status
* Date
* Customer
* Order number

Search:

```text
Search order, phone or reference...
```

Admin can open an order and view the complete timeline.

---

# 27. BUNDLE MANAGEMENT

This replaces the generic "product and inventory management" section.

CelluLite only needs **data bundle management**.

Each bundle:

```text
Network
Bundle size
Validity
Cost price
Selling price
Profit
Provider
Estimated delivery time
Active/inactive
```

Example:

| Network | Bundle |     Cost |  Selling |  Profit |
| ------- | ------ | -------: | -------: | ------: |
| MTN     | 1GB    |  GH₵4.50 |  GH₵6.00 | GH₵1.50 |
| Telecel | 5GB    | GH₵20.00 | GH₵24.00 | GH₵4.00 |

Profit should be calculated automatically.

```text
Profit =
Selling Price - Cost Price
```

---

# 28. NETWORK MANAGEMENT

Admin should manage:

* MTN
* Telecel
* AirtelTigo

Each network can have:

* Name
* Logo
* Active/inactive
* Provider
* Configuration

Do not allow customers to see disabled networks.

---

# 29. PROVIDER MANAGEMENT

This is important for the actual data-delivery infrastructure.

Admin can configure:

* Provider name
* API credentials
* Supported networks
* Supported bundles
* API status
* Delivery status
* Active/inactive

Credentials must be securely stored.

Never expose provider credentials in the frontend.

---

# 30. CUSTOMER MANAGEMENT

Admin can search customers.

Profile:

```text
Customer

Name
Phone
Email
Account status
Registration date

Total purchases
Total amount spent
Last transaction

Transaction history
Wallet activity
Support cases
```

Search should work especially well with phone numbers.

---

# 31. REMOVE/RETHINK CUSTOMER DEBT

The **Customer Debt Tracker should NOT be part of the CelluLite customer MVP**.

Why?

CelluLite is primarily a prepaid digital-data platform.

A customer should generally:

> Pay → order → receive data.

Adding:

* credit sales
* outstanding balances
* repayment schedules
* debt reminders

turns CelluLite into a completely different accounting/credit system.

If you eventually want staff to manually sell data on credit, make it a **separate Admin-only feature in a later phase**, not a core customer feature.

---

# 32. QUICK SALE

The original Quick Sale concept can be useful, but it should be renamed:

## Admin Manual Order

This is for staff when they need to help a customer.

Flow:

```text
New Order

1. Select Network
2. Select Bundle
3. Enter Recipient Number
4. Select Payment Status
5. Confirm
6. Generate Receipt
```

Target:

**under 30 seconds.**

It should be accessible through a prominent:

**+ New Order**

button in the admin panel.

---

# 33. PAYMENTS

Admin payment management:

* Payment reference
* Customer
* Amount
* Payment method
* Payment provider
* Payment status
* Date
* Related order
* Verification status

Statuses:

```text
Pending
Successful
Failed
Refunded
```

The system should support webhook/payment verification.

---

# 34. REFUNDS

Admin should be able to manage refunds.

Refund record:

* Order
* Customer
* Amount
* Reason
* Original payment
* Refund status
* Date
* Admin who initiated it

Refund should be auditable.

Do not silently change balances.

---

# 35. WALLET ADMINISTRATION

Admin can view wallet activity.

They should be able to see:

* Deposits
* Purchases
* Refunds
* Adjustments

Any manual balance adjustment should require:

* amount
* reason
* admin identity
* timestamp
* audit record

This prevents invisible balance manipulation.

---

# 36. SUPPORT CASE MANAGEMENT

Admin support inbox:

```text
Open
Pending
Resolved
Closed
```

Each case:

* Customer
* Category
* Order
* Message
* Status
* Assigned admin
* Created date
* Updated date

Admin can respond and add internal notes.

---

# 37. ANNOUNCEMENTS

Admin can create announcements.

Fields:

* Title
* Message
* Type
* Publish date
* Expiry date
* Active/inactive

Possible types:

* General
* Maintenance
* Service update
* Important notice

Customers should see announcements only when actually published.

Do not create random announcements automatically.

---

# 38. PLATFORM ANALYTICS

Analytics belong **only in Admin**.

MVP:

* Total sales
* Total orders
* Successful orders
* Failed orders
* Processing orders
* Gross profit
* Estimated net profit
* Expenses
* Popular bundles
* Network performance
* Payment method performance

Avoid excessive charts.

---

# 39. PROFIT CALCULATION

For each completed bundle:

```text
Gross Profit
=
Selling Price - Provider Cost
```

Example:

```text
Selling price: GH₵20
Provider cost: GH₵15

Gross profit: GH₵5
```

For the business:

```text
Estimated Net Profit
=
Gross Profit
-
Recorded Expenses
```

Always call it:

**Estimated Net Profit**

unless the system captures all relevant costs, fees, taxes and refunds.

---

# 40. EXPENSE TRACKING

Admin-only.

MVP categories:

* Data provider/bundle purchase
* Payment fees
* Refunds
* Other

Fields:

* Amount
* Category
* Description
* Date
* Payment method
* Receipt attachment

This is more appropriate for CelluLite than generic "inventory expenses."

---

# 41. SECURITY & SUSPICIOUS ACTIVITY

This is an important part that was missing from the customer-side plan.

Admin should have a security area for:

* Failed login attempts
* Suspicious order activity
* Repeated payment failures
* Unusual wallet activity
* Multiple accounts using suspicious patterns
* Admin actions

Do not automatically ban customers without a proper rule/review system.

---

# 42. ADMIN AUDIT LOG

Every sensitive administrative action should be recorded.

Example:

```text
Admin: John
Action: Changed bundle price
Bundle: MTN 10GB
Old price: GH₵20
New price: GH₵22
Date: 15 Sep 2026
```

Log:

* Admin
* Action
* Target
* Old value
* New value
* Timestamp
* IP/device information where appropriate

This is especially important for:

* wallet changes
* refunds
* prices
* provider settings
* customer status
* admin permissions

---

# 43. FEATURE ACCESS / ADMIN ROLES

Don't give every administrator full access.

Roles could include:

### Super Admin

Everything.

### Operations Admin

Orders, customers, bundles.

### Finance Admin

Payments, wallets, refunds, reports.

### Support Admin

Customers and support.

### Read-only Admin

View information but cannot modify it.

Permissions should be configurable.

---

# 44. SYSTEM SETTINGS

Admin settings:

### Business

* Business name
* Logo
* Support phone
* WhatsApp number
* Email
* Address

### Payment

* Payment provider
* Supported payment methods

### Data providers

* Provider configuration
* API configuration

### Notifications

* Email
* In-app
* Customer notifications

### Receipt

* Business information
* Receipt message
* Receipt numbering

### Platform

* Maintenance mode
* Default currency
* System configuration

---

# 45. CUSTOMER NOTIFICATIONS

Notifications can be generated for:

### Orders

* Payment pending
* Payment successful
* Order processing
* Order completed
* Order failed
* Refund completed

### Wallet

* Wallet funded
* Wallet deduction
* Wallet refund

### System

* Important announcements
* Maintenance

Do not send unnecessary notifications.

---

# 46. DATABASE CORE STRUCTURE

A clean backend could revolve around these entities:

```text
users
profiles

networks
bundles
providers

orders
order_items

payments
refunds

wallets
wallet_transactions

notifications

support_cases
support_messages

announcements

expenses

admin_users
admin_roles
permissions

audit_logs

system_settings
```

This is much cleaner than trying to treat data bundles like generic inventory products.

---

# 47. CORE ORDER DATA MODEL

An order should contain approximately:

```text
Order
├── Order ID
├── Order Number
├── Customer ID
├── Recipient Phone
├── Network
├── Bundle
├── Selling Price
├── Provider Cost
├── Profit
├── Payment Method
├── Payment ID
├── Payment Status
├── Order Status
├── Provider Reference
├── Failure Reason
├── Created At
├── Paid At
├── Completed At
└── Refunded At
```

This makes the order traceable from beginning to end.

---

# 48. THE ACTUAL MVP

I would make the MVP much more focused.

## Customer MVP

### Authentication

* Sign up
* Login
* Logout
* Password reset
* Session management

### Dashboard

* Wallet balance
* Buy Data
* Popular bundles
* Recent transactions

### Data purchasing

* MTN
* Telecel
* AirtelTigo
* Bundle selection
* Recipient number
* Checkout
* Payment
* Order processing

### Wallet

* Balance
* Fund wallet
* Wallet history

### Orders

* Transaction history
* Transaction details
* Order status
* Receipt

### Profile

* Basic profile management

### Support

* WhatsApp
* Basic Help Centre

---

# 49. ADMIN MVP

Admin MVP:

* Admin authentication
* Admin dashboard
* Order management
* Bundle management
* Network management
* Provider management
* Customer management
* Payment management
* Wallet management
* Refund management
* Support cases
* Basic announcements
* Basic reports
* Audit logs
* Admin roles

---

# 50. THE MOST IMPORTANT MVP WORKFLOW

The complete workflow should be:

```text
CUSTOMER

Open CelluLite
      ↓
Login
      ↓
Dashboard
      ↓
Buy Data
      ↓
Choose Network
      ↓
Choose Bundle
      ↓
Enter Recipient Number
      ↓
Choose Payment
      ↓
Confirm Purchase
      ↓
Payment
      ↓
Backend verifies payment
      ↓
Order = PAID
      ↓
Provider API
      ↓
Order = PROCESSING
      ↓
Provider confirms
      ↓
Order = COMPLETED
      ↓
Wallet/Payment ledger updated
      ↓
Profit recorded
      ↓
Receipt generated
      ↓
Customer notified
```

That is the **single workflow the entire MVP should be built around**.

---

# 51. WHAT SHOULD NOT BE IN MVP

Move these to later versions:

### ❌ Customer debt/credit system

Not core to prepaid data.

### ❌ Generic products

CelluLite sells data bundles.

### ❌ Inventory/stock quantity

Digital data bundles aren't conventional physical inventory.

### ❌ Business onboarding

Customers aren't businesses.

### ❌ Referral system

Not currently part of your CelluLite scope.

### ❌ Rewards

Not needed.

### ❌ Advanced analytics

Keep admin reporting basic initially.

### ❌ AI assistant

Not needed.

### ❌ PDF receipt generation

Start with web/print receipt.

### ❌ Shareable receipt image

Later.

### ❌ Google login

Later if desired.

---

# 52. PHASED DEVELOPMENT ROADMAP

## Phase 1 — Foundation

* Project setup
* Design system
* Authentication
* Database
* User profiles
* Admin authentication
* Roles/permissions

## Phase 2 — Customer UI

* Landing page
* Dashboard
* Buy Data
* Bundle selection
* Checkout
* Profile
* Wallet
* Transactions
* Transaction details

## Phase 3 — Backend Commerce

* Bundle database
* Network management
* Order system
* Payment system
* Wallet ledger
* Payment verification
* Provider integration
* Order processing

## Phase 4 — Admin

* Admin dashboard
* Orders
* Customers
* Bundles
* Providers
* Payments
* Wallets
* Refunds
* Support

## Phase 5 — Operational Features

* Notifications
* Announcements
* Receipts
* Reports
* Expenses
* Audit logs
* Suspicious activity

## Phase 6 — Hardening

* Security audit
* Accessibility audit
* Responsive testing
* Payment edge cases
* Provider failure handling
* Refund testing
* Performance
* Error handling
* Monitoring
* Production deployment

---

# 53. FINAL PRODUCT STRUCTURE

So the clean final architecture is:

```text
CELLULITE DATA
│
├── PUBLIC WEBSITE
│   ├── Landing
│   ├── About
│   ├── Help
│   ├── Contact
│   ├── Terms
│   └── Privacy
│
├── CUSTOMER APP
│   ├── Dashboard
│   ├── Buy Data
│   │   ├── MTN
│   │   ├── Telecel
│   │   └── AirtelTigo
│   ├── Checkout
│   ├── Transactions
│   ├── Transaction Details
│   ├── Wallet
│   ├── Profile
│   ├── Notifications
│   ├── Help Centre
│   └── Settings
│
├── ADMIN APP
│   ├── Overview
│   ├── Orders
│   ├── Customers
│   ├── Networks
│   ├── Bundles
│   ├── Providers
│   ├── Payments
│   ├── Wallets
│   ├── Refunds
│   ├── Support
│   ├── Announcements
│   ├── Reports
│   ├── Analytics
│   ├── Security
│   ├── Audit Logs
│   ├── Roles & Permissions
│   └── Settings
│
└── BACKEND
    ├── Authentication
    ├── Users
    ├── Wallet Ledger
    ├── Orders
    ├── Payments
    ├── Refunds
    ├── Bundles
    ├── Providers
    ├── Notifications
    ├── Support
    ├── Receipts
    ├── Reports
    ├── Audit Logs
    └── Security
```

### The key change

I would build CelluLite around **one very clear business object: the data order**.

Everything connects to it:

**Customer → Bundle → Order → Payment → Provider → Delivery → Receipt → Profit**

That gives you a much cleaner architecture than trying to make CelluLite behave like a generic inventory, debt, subscription, or POS system.

And visually, the **customer dashboard should remain the stunning, spacious interface from your reference**, while the admin panel can have a more information-dense operational UI.
