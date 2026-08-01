# ActivationProof architecture

Status: implemented local vertical; production capability absent.

## Dependency direction

```text
Next.js UI
  -> POST /api/v1/journey-contracts
    -> seal JourneyContract.v1 + contract digest
  -> POST /api/v1/assurance-runs
    -> compile sealed contract into 24 paired controls
      -> AssuranceService interface
        -> DeterministicAssuranceService
          -> detector registry (12 controls)
          -> injected deny-all outbound capability
          -> evidence receipt builder (canonical input + trace + SHA-256)
  -> POST /api/v1/handoff-bundles/replay
    -> verify contract and bundle digests
      -> deterministic recompile and exact run-digest match

Optional future persistence
  -> reviewed Supabase migration
  -> tenant-scoped RLS on every table
  -> tenant-consistent composite foreign keys
  -> not connected or applied
```

The UI cannot instantiate a provider adapter. A user can author only a bounded, explicitly `SYNTHETIC` `JourneyContract.v1`; the compiler maps its permitted fields into a fixed 24-control corpus. The API rejects unsealed, tampered, or out-of-bound contracts with typed errors.

## Typed contracts

- `SyntheticFixture`: declared requirement, detector, control kind, expected decision, synthetic classification, and typed control data.
- `JourneyContract.v1`: bounded synthetic intake, workflow state, role slots, rollback contract, and canonical digest.
- `DetectorEvaluation`: business decision and detector health remain separate.
- `DecisionReceipt.v1`: immutable normalized evidence bound to normalized fixture input, scenario, decision trace, contract, measured outbound attempts, and SHA-256 digest.
- `AssuranceRun.v1`: one complete 24-control execution with terminal state, run digest, and one next action.
- `HandoffBundle.v1`: sealed contract, run, receipts, recovery/replay instructions, and bundle digest for deterministic replay by a non-builder operator.
- `AssuranceService`: application boundary between HTTP and deterministic domain execution.

## Deterministic / AI / human split

| Authority | Implemented responsibility | Prohibited responsibility |
| --- | --- | --- |
| Deterministic code | schema, mapping, identity, consent, state, parity, idempotency, lineage, detector canary, release-readiness prerequisites, attribution, redaction | widening its own authority or treating provider uncertainty as success |
| AI | none in the implemented runtime | identity/consent decisions, approvals, production actions, evidence mutation |
| Human | review exact receipts; separately authorize a bounded future release | one person satisfying both approvals; authority inferred from a technical pass |

## Persistence proposal

`supabase/migrations/202608010001_activation_proof.sql` describes four tables: memberships, journey contracts, assurance runs, and decision receipts. RLS is enabled on every table, anonymous grants are revoked, and tenant access is mediated by authenticated membership and explicit `architect`, `reviewer`, `approver`, and `operator` roles. Composite foreign keys make it impossible for a child row to reference a parent in another tenant. A pure authorization-matrix test exercises each role, ownership, outsider, anonymous, and wrong-tenant decisions. This is source-level architecture only. No database has been created or modified.

## Failure, retry, and rollback

- Malformed or undeclared API input fails closed with typed errors.
- A detector absence yields `UNKNOWN` / `UNHEALTHY`, never a clean pass.
- Any outbound capability attempt increments a measured counter, fails the run, and prevents receipt sealing before a network call exists. During the synchronous detector contract, the engine also guards global fetch, WebSocket, EventSource, and XMLHttpRequest constructors; detector lint rejects member/computed transports, dynamic import, `createRequire`/builtin-module, eval, and network-import bypasses.
- Timeout after possible provider commit is represented by the CV-R7 indeterminate-state control; blind retry is rejected.
- The release-readiness control verifies deterministic declarations but returns `UNKNOWN` until separately authenticated human approval and recovery-drill receipts exist outside this local product.
- The UI supports cancellation and retry while retaining the last completed evidence; contract-seal failure preserves the prior contract, replay failure preserves the sealed bundle, and contract changes invalidate the prior run and bundle.
- Exported handoffs include deterministic replay and recovery steps; replay rejects a tampered contract or bundle before comparison.
- The proposed SQL rollback is review-only and explicitly destructive; it is never automatically executed.

## Claim ceiling

Local tests and screenshots prove only repository behavior on synthetic fixtures. GitHub proves committed source and PR state. A provider dashboard would be required to prove deployment, database policy installation, identity, live integrations, usage, cost, or reliability. No such provider proof exists.
