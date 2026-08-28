# Finekarts — Permissions Matrix

Authorization must be enforced **server-side** on every API route and sensitive server action. UI hiding is not security.

## 1. Roles (implemented in code)

| Role key | Label | Portal area |
|----------|-------|-------------|
| `ceo_super_admin` | Super Admin | admin, workspace |
| `general_manager` | Administrator / GM | admin, workspace |
| `trade_manager` | Trade Manager | workspace |
| `employee_operations` | General Employee | workspace |
| `finance` | Finance Manager | workspace |
| `compliance_reviewer` | Document Reviewer / Compliance | workspace |
| `banking_advisor` | External Banking Adviser | banking |
| `buyer_org_admin` | Buyer Company Admin | buyer |
| `buyer_member` | Buyer Company Member | buyer |
| `supplier_org_admin` | Supplier Company Admin | supplier |
| `supplier_member` | Supplier Company Member | supplier |
| `readonly_auditor` | Read-only auditor | workspace (read) |

**Spec aliases not yet separate roles:** Shipping Manager (map to `employee_operations` + `shipments:write`), Banking Coordinator (map to `general_manager` + banking admin actions).

## 2. Permissions (44 granular keys)

Defined in `src/lib/authorization/permissions.ts`:

| Domain | Permissions |
|--------|-------------|
| CMS | `cms:read`, `cms:write`, `cms:publish` |
| Leads | `leads:read`, `leads:write` |
| Products | `products:read`, `products:write` |
| Orgs | `orgs:read`, `orgs:write`, `orgs:verify` |
| Users | `users:read`, `users:write`, `users:disable` |
| Roles | `roles:manage` |
| Transactions | `transactions:read`, `transactions:write`, `transactions:assign`, `transactions:approve` |
| Documents | `documents:read`, `documents:write`, `documents:approve`, `documents:download` |
| Messages | `messages:read`, `messages:write` |
| Finance | `finance:read`, `finance:write`, `finance:export` |
| Shipments | `shipments:read`, `shipments:write`, `shipments:approve` |
| Bookings | `bookings:read`, `bookings:write` |
| AI | `ai:use`, `ai:manage` |
| Integrations | `integrations:manage` |
| Terms | `terms:manage` |
| Audit | `audit:read` |
| Settings | `settings:manage` |
| Exports | `exports:run` |
| Banking | `banking:review` |
| Portal gates | `supplier:access`, `buyer:access`, `workspace:access`, `admin:access` |

## 3. Role → permission summary

| Role | Highlights |
|------|------------|
| Super Admin | All permissions |
| General Manager | Broad ops except full role matrix parity with super admin |
| Trade Manager | Transactions, documents write, no `settings:manage` |
| Finance | `finance:*`, `transactions:read` — **no** default `documents:download` for identity docs |
| Compliance reviewer | `documents:approve`, `orgs:verify` |
| Banking adviser | `banking:review`, scoped transaction read |
| Buyer roles | `buyer:access`, own org data only (target) |
| Supplier roles | `supplier:access`, own org data only (target) |

Full mapping: see `ROLE_PERMISSIONS` in `permissions.ts`.

## 4. Enforcement status

| Mechanism | Location | Used in production routes? |
|-----------|----------|---------------------------|
| Portal area gate | `requirePortalAccess()` | ✅ layouts |
| Admin API gate | `requireAdminApiSession()` | ✅ admin APIs |
| Buyer API gate | `requireBuyerApiSession()` | ✅ lead routes |
| `requirePermission()` | `authorize.ts` | ❌ not wired |
| `assertOrgScope()` | `authorize.ts` | ❌ not wired |
| `assertTransactionAccess()` | `authorize.ts` | ❌ not wired |
| TransactionParticipant scoping | model exists | ❌ not wired |

## 5. Tenant isolation rules (target)

| Actor | May access |
|-------|------------|
| Buyer A | Own org, own transactions, own documents, own messages |
| Buyer A | **Never** supplier org, procurement cost, Finekarts margin, Buyer B |
| Supplier | Own procurement transactions, own documents |
| Supplier | **Never** buyer identity, sales price, buyer documents |
| Employee | Assigned transactions + role permissions |
| Banking adviser | **Only** assigned transactions + permitted banking docs |
| Admin | All (audited) |

## 6. Immutable security settings

These cannot be disabled via normal admin settings UI:

- Tenant isolation checks (once implemented)
- Audit logging on sensitive actions
- Signed document immutability
- Permission checks on APIs

## 7. Banking instrument selection

| Action | Allowed roles (target) |
|--------|------------------------|
| Select allowed instrument | Super Admin, General Manager only |
| Record instrument metadata | Admin + assigned banking staff |
| Buyer selects instrument | **Denied** |
| Adviser changes instrument type | **Denied** (unless separate grant) |

## 8. Document sensitivity

| Document type | Finance Manager | Banking Adviser | Buyer |
|---------------|-----------------|-----------------|-------|
| Commercial Invoice | ✅ read | ✅ if assigned | ✅ own deal |
| CIS / KYC identity | ❌ default | ❌ | ✅ own org |
| Signed SPA | ✅ read | ✅ if assigned | ✅ own deal |

## 9. Implementation checklist (engineering)

- [ ] Middleware or API wrapper: resolve user + membership + permissions
- [ ] Every `/api/portal/*` and `/api/admin/*` route calls permission helper
- [ ] Transaction routes check `TransactionParticipant`
- [ ] Integration tests: cross-tenant IDOR attempts
- [ ] Audit log on denied access attempts (optional warn level)

## 10. MFA (target)

Required for Super Admin, General Manager, Banking Adviser in production. `VerificationChallenge` supports OTP foundation.
