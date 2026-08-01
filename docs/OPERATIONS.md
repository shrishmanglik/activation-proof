# Operator runbook

## Local start

```powershell
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:3000/workspace`, author and seal the synthetic contract, run the 24 controls, download the handoff bundle, and replay it. The expected result is 24/24 expectations met, zero outbound attempts, zero external calls, and an exact replay digest match.

## Verification

```powershell
npm.cmd run control:consent
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run e2e
```

Run the complete corpus twice and compare `evidenceDigest`. The test suite enforces equality for identical input and inequality after a semantic input mutation that preserves the finding shape.

## Critical mutation control

The consent detector is the critical authority boundary. Its disabled-detector run must fail:

```powershell
$env:ACTIVATIONPROOF_DISABLE_DETECTOR='CV-R4'
npm.cmd run control:consent
Remove-Item Env:ACTIVATIONPROOF_DISABLE_DETECTOR
npm.cmd run control:consent
```

Expected: the first command exits non-zero because the opted-out bad fixture escapes; the restored command exits zero.

The security suite injects detectors that attempt the outbound capability, `globalThis.fetch`, and `globalThis.WebSocket`. Expected: each attempt counter is one, the underlying transport counter remains zero, the run fails, and no receipt is sealed. Separate lint mutations reject member/computed transports, `createRequire`, and dynamic transport-loading forms.

The clean CV-R10 release-readiness control is expected to return `UNKNOWN`, not `PASS`: role slots and a rollback procedure are declarations, not authenticated human approval or recovery-drill receipts.

## Recovery

- UI request failure: no result is promoted; retry preserves the prior completed receipt.
- Cancelled run: partial results are discarded.
- Contract change: the prior run and handoff are invalidated; seal and execute the new contract.
- Contract sealing failure: the prior sealed contract remains unchanged; correct the bounded input or retry the local request.
- Detector unhealthy: keep promotion blocked and repair the named detector.
- Handoff replay mismatch or digest failure: reject the bundle; return to the sealed contract and create a new run rather than editing evidence.
- Handoff replay transport failure: retain the sealed bundle and retry; the UI does not replace evidence with a partial response.
- Digest drift or missing rollback: retain the last accepted contract; do not authorize sandbox action.
- Indeterminate provider state in a future adapter: query by stable operation key; never blind retry.
- Persistence rollback: review `supabase/rollback/202608010001_activation_proof.down.sql`, preserve evidence first, and require separate provider authority. It is not an automatic recovery command.

## Production boundary

There is no deployment runbook because deployment is not authorized. A future release must add authentication, tenancy, applied and verified RLS, provider security review, environment-shape validation without values, exact deployed-commit proof, smoke tests, and an operator-owned rollback.
