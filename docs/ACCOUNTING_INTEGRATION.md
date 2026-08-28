# Accounting Integration — Phase 7

Architecture for exporting operational finance data to accountant-approved accounting software. Phase 7 does **not** perform live synchronization without credentials and does **not** fake successful sync.

## Provider interface

`AccountingProvider` (`src/lib/finance/accounting-provider.ts`):

| Method | Purpose |
|--------|---------|
| `testConnection` | Validate credentials / connectivity |
| `syncCustomer` | Push buyer organization |
| `syncVendor` | Push supplier organization |
| `syncInvoice` | Push buyer invoice |
| `syncBill` | Push supplier bill |
| `syncCreditNote` | Push credit/debit note |
| `syncPayment` | Push payment record |
| `getSyncStatus` | Read external mapping status |
| `retrySync` | Retry failed push |

Future adapters: QuickBooks Online, Xero, other accountant-approved providers.

## Development mock

`DevelopmentAccountingProvider` is used when `ACCOUNTING_PROVIDER=development_mock` (default).

- `testConnection` always returns a clearly labelled mock message.
- Sync methods return `not_configured` unless `ACCOUNTING_PROVIDER_CONFIGURED=true`.
- No provider secrets are stored in routine application records.

## Sync records

`AccountingSyncRecord` stores:

- Provider name
- Entity type and internal ID
- External ID (when successful)
- Direction, status, last attempt/success
- Error summary
- Idempotency key

Imports must not silently overwrite posted internal records.

## API

`GET/POST /api/finance/accounting`

- `action: test_connection`
- `action: sync_entity` with `entityType` and `internalId`
- `action: list_sync_records`

## CSV export

When provider is not configured, finance users export CSV from reports (`finance:export`). Exports are permission-scoped and audited.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `ACCOUNTING_PROVIDER` | `development_mock` | Provider selection |
| `ACCOUNTING_PROVIDER_CONFIGURED` | unset / `false` | Enables mock sync success in dev only |

Provider credentials (future): store in secure secret manager, not in MongoDB audit or sync documents.

## Status values

- `not_configured` — no credentials; use CSV export
- `pending` — job queued
- `success` — external ID recorded
- `failed` — error summary stored; retry available
- `conflict` — external change conflicts; manual review
