# Security and privacy boundary

## Implemented controls

- Synthetic and tokenized fixtures only.
- Only exact frozen detector objects from a private canonical registry can execute. Replacement evaluators—including pre-captured transport and computed-loader mutations—are rejected before execution and cannot seal a receipt.
- Canonical detectors receive a deny-all capability; attempts are counted before refusal, fail the run, and prevent receipt sealing. Synchronous execution also guards global fetch, WebSocket, EventSource, and XMLHttpRequest surfaces.
- Detector-specific lint rules reject bare/member/computed/captured transports, dynamic import, `createRequire`/runtime builtin loading, eval/Function-generated transports, and network client imports.
- No credential entry UI, production adapter, webhook, or customer contact path.
- Typed API allowlist for the one repository-owned fixture corpus.
- Restricted handoff-field detector covering raw email and access-token field classes.
- Optional Supabase schema enables RLS on every application table, revokes anonymous access, and uses tenant-consistent composite foreign keys.
- Local tests inspect the table-to-RLS mapping and exercise an executable tenant/role authorization matrix covering architect, reviewer, approver, operator, outsider, anonymous, ownership, and wrong-tenant cases.

## Deliberately absent

- Authentication and tenant creation.
- Secret storage or provider OAuth.
- Production connectors and webhooks.
- Customer PII or client configuration.
- Live Supabase project or applied migration.
- Production security review or compliance acceptance.

## Threat model for a future connected version

The primary risks are cross-tenant access, secret or PII leakage, consent bypass, unsafe identity merge, duplicate provider effects, evidence tampering, and prompt injection from imported source material. Connecting a provider requires a separately reviewed adapter contract, least-privilege credentials, idempotency and reconciliation proof, redaction, tenancy tests, and an explicit human authority record.

## Reporting a vulnerability

Do not include a secret, credential, customer record, or exploit payload in a public issue. Contact the repository owner through the security-reporting channel listed on the GitHub profile and provide only the minimum reproduction metadata needed to coordinate a private report.
