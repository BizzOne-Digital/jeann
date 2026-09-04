# Finekarts — Client Testing Guide

**Live website:** [https://finekarts.vercel.app](https://finekarts.vercel.app)

This guide is written for **non-technical reviewers**. Use it to click through the public website and every portal, and note anything that looks wrong, confusing, or missing.

> **Privacy note:** These are **test accounts only**. Do not use real banking details, real passport scans, or live commercial offers in this environment. Change the admin password before inviting real users.

---

## Before you start

1. Use **Google Chrome** or **Microsoft Edge** (latest version).
2. Test on **desktop** first, then repeat key pages on **mobile** (or narrow the browser window).
3. Use **two browser windows** (or Chrome + Edge) when testing buyer vs admin — so you stay signed in to both at once.
4. If a page asks you to sign in, use the accounts in the table below.
5. If something does not load, take a **screenshot** and note the **exact page URL** from the address bar.

---

## Test login details

All portals use the same sign-in page: **[finekarts.vercel.app/login](https://finekarts.vercel.app/login)**

| Who you are testing as | Email | Password | Where you land after login |
|------------------------|-------|----------|----------------------------|
| **Platform admin** (full control) | `admin@finekarts.com` | `FinekartsAdmin!8Pnhcz3HsuZt` | Admin panel → `/admin` |
| **Demo buyer** (sample buyer company) | `buyer@demo.finekarts.com` | `DemoBuyer123!` | Buyer portal → `/portal/buyer` |

### Supplier & banking adviser accounts

There is **no public supplier registration**. Suppliers and banking advisers are **invitation only**:

1. Sign in as **admin** (`admin@finekarts.com`).
2. Open **Admin → Invitations** (`/admin/invitations`).
3. Create an invitation for **Supplier** or **Banking adviser**.
4. Copy the invite link from the email (or from the admin screen if shown) and open it in a **private/incognito** window.
5. Set a password and complete the form.

Use that new email/password to test the **Supplier portal** or **Banking portal**.

### Optional: register a fresh buyer

You can also test the real registration flow:

1. Go to **[Register as buyer](https://finekarts.vercel.app/register/buyer)**.
2. Use a **fake company name** and a **new email address** you control.
3. After registering, sign in — you will see **onboarding** until an admin approves the organization (see Admin section below).

---

## Part 1 — Public marketing website

**Goal:** Confirm the site looks professional, reads clearly, and links work. **No login required.**

### Homepage & header

| # | What to check | What “good” looks like |
|---|---------------|------------------------|
| 1 | Open the homepage | Logo visible in header and footer; navy header; trade ticker on homepage |
| 2 | Header menu | Home, About, Products, Resources, Insights, Contact — all clickable |
| 3 | **Buyer Portal** button (top right) | Goes to login page |
| 4 | Language switcher | Opens list of languages (optional — English is default) |
| 5 | Mobile menu (small screen) | Hamburger opens menu; links work |

### Main pages (open each from the menu or footer)

| Page | URL |
|------|-----|
| About | `/about` |
| Products (all categories) | `/products` |
| Resources | `/resources` |
| Insights (articles) | `/insights` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Team | `/team` |
| Testimonials | `/testimonials` |
| Packaging | `/packaging` |
| Logistics | `/logistics` |
| Shipping | `/shipping` |
| Shipping documents | `/shipping-documents` |
| Inspections | `/inspections` |
| Verification partners | `/verification` |
| Partners | `/partners` |

### Product catalogue (important — recent photo updates)

1. Go to **Products → Coffee, nuts & spices** (`/products/other-commodities`).
2. Confirm each product shows the **correct photo** (not the same coffee-cherry image on every card):

| Product | What you should see |
|---------|---------------------|
| Cashews | Bowl of cashew nuts |
| Cinnamon sticks | Cinnamon quills |
| Black pepper | Black peppercorns |
| Turmeric | Turmeric root and powder |
| Cloves | Dried cloves |
| Cardamom | Green cardamom pods |
| Nutmeg | Whole nutmeg |

3. Open **each product** and click **View details** — photo, title, and description should match.
4. Spot-check **other categories**: Edible oils, Sugar, Beans & pulses, Rice & grains.

### Other public checks

| # | Action | Expected |
|---|--------|----------|
| 1 | Click **Ask Finekarts** chat (bottom corner) | Chat opens; ask a simple question — no fake prices |
| 2 | Footer links | Privacy, Terms, Accessibility open without errors |
| 3 | `/trade` | Redirects to Resources (or relevant page) |
| 4 | Resize browser to phone width | Text readable; no horizontal scrolling |

---

## Part 2 — Buyer portal

**Sign in:** `buyer@demo.finekarts.com` / `DemoBuyer123!`

> **First-time demo buyer:** If you only see **onboarding** screens, an admin must approve the buyer organization first (Part 3, step “Approve demo buyer”).

### Buyer menu — click every item

| Menu item | What to test |
|-----------|--------------|
| **Overview** | Dashboard loads; shortcuts visible |
| **Onboarding** | Checklist shows steps (CIS, documents, etc.) |
| **New request** | Start a purchase request; fill a few fields; save or submit |
| **Requests** | List of submitted RFQs |
| **Transactions** | Trade transactions (may be empty or show test data) |
| **Shipments** | Shipment list / detail if test data exists |
| **Invoices** | Invoice list |
| **Corporate information (CIS)** | Company profile form |
| **Documents** | Upload area / document list |
| **Booking** | Book a consultation with trade desk |
| **Contact** | Message or contact form |
| **Messages** | Inbox; try sending a test message |
| **Organization** | Company name and status |
| **Help** | Links to FAQ and resources |

### Suggested buyer flow (15 minutes)

1. Sign in as demo buyer.
2. Open **New request** → fill product, quantity, destination → **submit**.
3. Open **Requests** → confirm the request appears.
4. Open **Messages** → send a short test note to the trade desk.
5. Open **Corporate information** → review fields (save if you like).
6. Sign out (sidebar or profile, if shown).

---

## Part 3 — Admin panel

**Sign in:** `admin@finekarts.com` / `FinekartsAdmin!8Pnhcz3HsuZt`

Direct link: **[finekarts.vercel.app/admin](https://finekarts.vercel.app/admin)**

### Approve demo buyer (do this once)

1. Go to **Buyer Organizations** (`/admin/buyers`).
2. Find **Demo Buyer Trading Ltd** (or the org linked to `buyer@demo.finekarts.com`).
3. Open the record → **approve / verify** the organization.
4. Sign in again as the demo buyer — full menu should unlock.

### Admin areas to review

| Section | Path | What to check |
|---------|------|----------------|
| Dashboard | `/admin` | Summary loads |
| Website Pages | `/admin/pages` | Homepage and key pages editable |
| Products | `/admin/products` | Categories and products listed |
| Packaging | `/admin/packaging` | Packaging types listed |
| Purchase Requests | `/admin/purchase-requests` | Buyer RFQs from portal appear here |
| Trade Offers | `/admin/trade-offers` | Supplier offers (if any) |
| Transactions | `/admin/transactions` | Trade transactions |
| Buyer Organizations | `/admin/buyers` | Buyer companies; approval workflow |
| Supplier Organizations | `/admin/suppliers` | Supplier companies |
| Invitations | `/admin/invitations` | Create supplier / employee invites |
| Employees & Roles | `/admin/employees` | Staff accounts |
| Insights | `/admin/insights` | Add/edit blog articles for public site |
| FAQs | `/admin/faqs` | FAQ content |
| Testimonials | `/admin/testimonials` | Testimonial quotes |
| Team | `/admin/team` | Team member bios |
| Payment Terms | `/admin/payment-terms` | Payment term options |
| Approvals | `/admin/approvals` | Pending approval queue |
| Bookings | `/admin/bookings` | Consultation bookings |
| Shipments | `/admin/shipments` | Shipment administration |
| Finance & Reports | `/admin/finance` | Finance module (test data) |
| Integrations | `/admin/integrations` | Shows connected / not connected services |
| Security | `/admin/security` | Security overview |
| Global Settings | `/admin/settings` | Site name, email, features |

### Suggested admin flow (15 minutes)

1. Open **Purchase Requests** — confirm the buyer test request from Part 2 appears.
2. Open **Insights** — create a short test article; check it on public **Insights** page.
3. Open **Invitations** — create a **supplier** invite (use a spare email you own).
4. Open **Buyer Organizations** — confirm demo buyer status.

---

## Part 4 — Employee workspace

**Same admin login** (`admin@finekarts.com`) can access the internal workspace.

Direct link: **[finekarts.vercel.app/workspace](https://finekarts.vercel.app/workspace)**

| Section | Path | What to check |
|---------|------|----------------|
| Queues / Dashboard | `/workspace` | Work queues and summary cards |
| Assigned transactions | `/workspace/transactions` | Transaction list |
| Shipment lots | `/workspace/shipments` | Shipment operations |
| Finance | `/workspace/finance` | Finance workspace |
| Supplier organizations | `/workspace/suppliers` | Supplier records |

Walk through each menu item once and confirm pages load without errors.

---

## Part 5 — Supplier portal

**Requires an invitation** (see “Supplier & banking adviser accounts” above).

Direct link after login: **[finekarts.vercel.app/portal/supplier](https://finekarts.vercel.app/portal/supplier)**

| Menu item | What to test |
|-----------|--------------|
| Dashboard | Overview loads |
| Trade offers | List / create offer |
| Procurement (transactions) | Linked deals |
| Shipments | Shipment list |
| Bills | Supplier bills |
| Messages | Send/receive messages |

**Public supplier offer page** (`/supplier-offer`) is for **invitation-only** trade offers — it should explain that suppliers need an invite, not open self-registration.

---

## Part 6 — Banking portal

**Requires a banking adviser invitation** from admin.

Direct link after login: **[finekarts.vercel.app/portal/banking](https://finekarts.vercel.app/portal/banking)**

| Section | What to test |
|---------|--------------|
| Dashboard | Assigned instruments |
| Documents | Banking documents list |

> Real bank integrations (live LC/SBLC feeds) are **not connected** in this test environment — you are checking layout and workflow only.

---

## What is intentionally not live yet

These may show **“unconfigured”** or placeholder behaviour — that is expected:

| Feature | Status |
|---------|--------|
| Live SMS / phone OTP | Not connected (optional) |
| Live email delivery | May log to console in test mode |
| DocuSign / e-signature | Not connected |
| Live shipment GPS tracking | Manual / test data only |
| QuickBooks / accounting sync | CSV / placeholder |
| Real sanctions screening API | Mock / unconfigured |
| Vesper live market prices | Mock / unconfigured |

Do **not** treat these as bugs unless the screen is broken or misleading.

---

## Quick checklist (print-friendly)

```
PUBLIC SITE
[ ] Homepage — logo, header, ticker, hero
[ ] All main nav pages open
[ ] Spice product photos correct (7 products)
[ ] Footer and legal pages
[ ] Mobile layout acceptable
[ ] Chat widget works

BUYER PORTAL (buyer@demo.finekarts.com)
[ ] Login works
[ ] Admin approved buyer org (if needed)
[ ] New purchase request submitted
[ ] Request visible in list
[ ] Messages page works
[ ] CIS / onboarding pages load

ADMIN (admin@finekarts.com)
[ ] Login → /admin
[ ] Purchase request visible
[ ] Buyer org list / approval
[ ] Insights CRUD
[ ] Invitations page works

WORKSPACE (same admin login)
[ ] /workspace dashboard
[ ] Transactions, shipments, finance menus load

SUPPLIER (invite required)
[ ] Invitation created
[ ] Invite accepted; supplier portal opens
[ ] Offers / messages pages load

BANKING (invite required)
[ ] Adviser invite accepted
[ ] Banking dashboard loads
```

---

## How to report issues

For each problem, send:

1. **Which portal** (public site, buyer, admin, workspace, supplier, banking)
2. **Page URL** (copy from address bar)
3. **Which account** you were signed in with
4. **Steps** — what you clicked, in order
5. **What you expected** vs **what happened**
6. **Screenshot** (full screen if possible)
7. **Browser** (e.g. Chrome on Windows)

---

## Need help?

Contact your Finekarts development team with this guide and your completed checklist. For access problems, confirm you are using the test emails above and that the buyer organization has been **approved** in admin.
