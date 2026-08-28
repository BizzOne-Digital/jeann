# AI Governance — Phase 8

Operational rules for Finekarts AI capabilities. AI assists staff; it does not approve transactions, sign documents, or replace professional advice.

## Data classification

| Level | Use |
|-------|-----|
| Public | Public chatbot only |
| Internal | Internal assistant with role checks |
| Confidential | Document extraction/comparison with review |
| Restricted | Stronger policy; redaction required |
| Highly Sensitive | Not sent to AI by default |

## Human review

All document extraction and comparison outputs start as `pending_review`. Accepted fields populate drafts only — never posted transaction records directly.

## Prompt versioning

`AIPromptTemplate` stores versioned system instructions. `AIExecution` records the template version used.

## Usage tracking

`ProviderUsageRecord` logs capability, model, tokens, and estimated cost per request.

## Prohibited

- Autonomous contract or bank approval
- AI-generated signatures
- Legal, banking, tax, or investment advice via chatbot
- Binding quotes or availability promises

## Prompt injection

Uploaded document text is untrusted. System instructions are separated from retrieved content. Injection patterns are detected and refused.
