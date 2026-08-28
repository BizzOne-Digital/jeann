# Webhook Security — Phase 8

All provider webhooks must verify authenticity before business logic runs.

## Requirements

| Control | Implementation |
|---------|----------------|
| Signature verification | HMAC-SHA256 via `verifyHmacSignature` |
| Idempotency | `WebhookEvent` unique on `providerAdapter + providerEventId` |
| Payload hashing | SHA-256 hash stored; full payload not retained by default |
| Correlation ID | `x-correlation-id` header or generated |
| Safe errors | Generic 401/400 without leaking secrets |

## Endpoints

| Route | Provider |
|-------|----------|
| `POST /api/webhooks/esignature` | E-signature completion events |
| `POST /api/webhooks/shipping` | Shipping tracking events |

## E-signature rule

Documents are not marked signed until webhook signature is verified and completion is processed through `esignature-service`.

## Shipping rule

Tracking events update operational status but do not auto-confirm legal delivery without required delivery evidence (Phase 6).
