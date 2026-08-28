# Finance Rules — Phase 7

Operational trading-finance rules for Finekarts. This system tracks invoices, bills, payments, costs, and contribution profit. It does **not** replace certified accounting, corporate tax filing, banking settlement, or professional financial advice.

## Labels

Use:

- Operational Revenue
- Procurement Cost
- Gross Trading Margin
- Direct Operational Costs
- Contribution Profit
- Estimated Tax
- Recorded Payment
- Awaiting Verification
- Reconciled Internally

Avoid unless evidenced:

- Audited Profit
- Official Corporate Tax
- Government Approved
- Bank Confirmed

## Boundaries

The platform may create operational invoices and bills, track receivables/payables, record payment evidence, calculate profitability, apply configured tax rules, convert with stored FX rates, export data, and receive sync status via approved APIs.

The platform must not hold funds, initiate bank transfers (Phase 7), calculate final corporate income tax, submit tax returns, silently modify posted records, or treat operational profit as audited net income.

## Multi-currency

Every financial entry stores original currency, original amount, base currency, FX rate, FX date, FX source, converted amount, and rounding difference when applicable. Posted entries retain the rate used at posting time.

## Confidentiality

| Viewer | May see | Must not see |
|--------|---------|--------------|
| Buyer | Own invoices, payment schedule/status, buyer-visible fees/credits | Supplier bills, procurement cost, margin, deal group profitability |
| Supplier | Own bills, payable amounts, payment status | Buyer invoices, sales revenue, margin |
| Internal finance | Authorized operational records and profitability | Other parties’ restricted data without permission |

## Workflows

### Financial entry

Draft → review → approve → post (immutable). Corrections require reversal + replacement with reason and audit.

### Buyer invoice

Create from transaction/shipment → tax (configured) → approve → issue → AR + payment schedule → partial/full payments via verified allocations. Adjustments use credit notes; do not edit issued invoices.

### Supplier bill

Upload/record → match procurement terms → approve → post → AP + payment schedule → verified outgoing payments.

### Payments

Evidence upload sets `pending_verification`. Verification is required before allocation. Uploaded receipt does not imply bank clearance.

### Costs

Submit with category, evidence, tax if applicable → approve (separation of duties) → post → included in direct operational costs.

### Period close

Resolve unposted entries and incomplete allocations → close period → backdating blocked → reopen requires elevated permission and reason.

## Profitability formulas

- **Sales Revenue** — issued buyer invoice totals (configured basis)
- **Procurement Cost** — posted supplier bill product cost
- **Gross Trading Margin** — revenue − procurement
- **Direct Operational Costs** — posted `direct_cost` entries (freight, insurance, inspection, packaging, port/storage, bank fees, commissions, customs, claims, etc.)
- **Contribution Profit** — gross margin − direct costs (not audited net profit)

Deal group totals aggregate linked transactions; shared costs use stored allocation method without silent retroactive changes.

## Tax

Tax codes are versioned by jurisdiction and effective dates. No universal hardcoded HST. Results are operational estimates unless accountant-reviewed.

## Seed scenario (development)

After `npm run seed:phase7`:

| Line | USD |
|------|-----|
| Buyer invoice | 1,050,000 |
| Supplier bill | 980,000 |
| Direct costs | 40,000 |
| Contribution profit | 30,000 |

All seed documents carry: `TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY`.
