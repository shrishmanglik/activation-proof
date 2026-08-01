# ActivationProof architecture

Status: implemented local vertical; production capability absent.

## Dependency direction

```text
Next.js UI
  -> POST /api/v1/assurance-runs
    -> AssuranceService interface
      -> DeterministicAssuranceService
        -> detector registry (12 pure controls)
        -> evidence receipt builder (canonical JSON + SHA-256)
        -> synthetic fixture adapter

Optional future persistence
  -> reviewed Supabase migration
  -> tenant-scoped RLS on every table
  -> not connected or applied
```

The UI cannot instantiate a provider adapter. The only executable corpus is the repository-owned `synthetic-renewal-v1` fixture set. The API rejects other corpus names with a typed `422 FIXTURE_CORPUS_NOT_ALLOWED` response.

## Typed contracts

- `SyntheticFixture`: declared requirement, detector, control kind, expected decision, synthetic classification, and typed control data.
- `DetectorEvaluation`: business decision and detector health remain separate.
- `DecisionReceipt.v1`: immutable normalized evidence with issue codes, external-call count, data class, and SHA-256 digest.
- `AssuranceRun.v1`: one complete 24-control execution with terminal state, run digest, and one next action.
- `AssuranceService`: application boundary between HTTP and deterministic domain execution.

## Deterministic / AI / human split

| Authority | Implemented responsibility | Prohibited responsibility |
| --- | --- | --- |
| Deterministic code | schema, mapping, identity, consent, state, parity, idempotency, lineage, detector canary, release prerequisites, attribution, redaction | widening its own authority or treating provider uncertainty as success |
| AI | none in the implemented runtime | identity/consent decisions, approvals, production actions, evidence mutation |
| Human | review exact receipts; separately authorize a bounded future release | one person satisfying both approvals; authority inferred from a technical pass |

## Persistence proposal

`supabase/migrations/202608010001_activation_proof.sql` describes four tables: memberships, journey contracts, assurance runs, and decision receipts. RLS is enabled on every table, anonymous grants are revoked, and tenant access is mediated by the authenticated membership relation. This is source-level architecture only. No database has been created or modified.

## Failure, retry, and rollback

- Malformed or undeclared API input fails closed with typed errors.
- A detector absence yields `UNKNOWN` / `UNHEALTHY`, never a clean pass.
- Timeout after possible provider commit is represented by the CV-R7 indeterminate-state control; blind retry is rejected.
- Release prerequisites require exact digest equality, two distinct approvers, and rollback proof.
- The UI supports cancellation and retry while retaining the last completed evidence.
- The proposed SQL rollback is review-only and explicitly destructive; it is never automatically executed.

## Claim ceiling

Local tests and screenshots prove only repository behavior on synthetic fixtures. GitHub proves committed source and PR state. A provider dashboard would be required to prove deployment, database policy installation, identity, live integrations, usage, cost, or reliability. No such provider proof exists.
