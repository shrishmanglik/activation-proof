"use client";

import { useRef, useState } from "react";
import { Ban, CheckCircle2, CircleDashed, Play, RotateCcw, ShieldCheck, Square } from "lucide-react";
import type { AssuranceRun } from "@/domain/assurance";
import type { HandoffBundle, ReplayReceipt } from "@/domain/handoff";
import type { JourneyContract, JourneyContractInput } from "@/domain/journey-contract";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RunState = "IDLE" | "RUNNING" | "SUCCESS" | "ERROR" | "CANCELLED";

export function ActivationProofWorkspace() {
  const [state, setState] = useState<RunState>("IDLE");
  const [run, setRun] = useState<AssuranceRun | null>(null);
  const [contract, setContract] = useState<JourneyContract | null>(null);
  const [handoffBundle, setHandoffBundle] = useState<HandoffBundle | null>(null);
  const [replayReceipt, setReplayReceipt] = useState<ReplayReceipt | null>(null);
  const [replayError, setReplayError] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  async function sealContract(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContractError(null);
    const form = new FormData(event.currentTarget);
    const input: JourneyContractInput = {
      schemaVersion: "JourneyContract.v1",
      dataClass: "SYNTHETIC",
      journeyKey: String(form.get("journeyKey")),
      sourceSystem: String(form.get("sourceSystem")),
      destinationSystem: String(form.get("destinationSystem")),
      ownerRole: String(form.get("ownerRole")),
      requiredFields: ["order_id", "value", "currency"],
      currency: "CAD",
      conversionDivisor: 100,
      identityPolicyVersion: String(form.get("identityPolicyVersion")),
      consentPolicyVersion: String(form.get("consentPolicyVersion")),
      stateSequence: ["subscription_started", "renewal_completed"],
      rollbackProcedure: String(form.get("rollbackProcedure")),
      approverRoles: ["architecture_reviewer", "privacy_reviewer"],
    };
    try {
      const response = await fetch("/api/v1/journey-contracts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
      if (!response.ok) throw new Error(`Contract request failed with HTTP ${response.status}`);
      const body = await response.json() as { contract?: JourneyContract };
      if (!body.contract) throw new Error("Contract response omitted the sealed contract");
      setContract(body.contract);
      setRun(null);
      setHandoffBundle(null);
      setReplayReceipt(null);
      setReplayError(null);
    } catch {
      setContractError("The contract could not be sealed. Check the bounded fields, then retry; any prior sealed contract remains unchanged.");
    }
  }

  async function startRun() {
    if (!contract) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState("RUNNING");
    setError(null);
    try {
      const response = await fetch("/api/v1/assurance-runs", {
        method: "POST",
        headers: { "content-type": "application/json", "x-request-id": "ui-synthetic-renewal-v1" },
        body: JSON.stringify({ fixtureCorpus: "synthetic-renewal-v1", contract }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Run failed with HTTP ${response.status}`);
      const body = await response.json() as { run: AssuranceRun; handoffBundle: HandoffBundle };
      setRun(body.run);
      setHandoffBundle(body.handoffBundle);
      setReplayReceipt(null);
      setReplayError(null);
      setState("SUCCESS");
    } catch (caught) {
      if (controller.signal.aborted) {
        setState("CANCELLED");
        return;
      }
      setError(caught instanceof Error ? caught.message : "The run failed without a typed client error.");
      setState("ERROR");
    }
  }

  function cancelRun() {
    controllerRef.current?.abort();
  }

  function downloadHandoff() {
    if (!handoffBundle) return;
    const blob = new Blob([JSON.stringify(handoffBundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${handoffBundle.contract.journeyKey}-handoff.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function replayHandoff() {
    if (!handoffBundle) return;
    setReplayError(null);
    try {
      const response = await fetch("/api/v1/handoff-bundles/replay", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(handoffBundle) });
      if (!response.ok) throw new Error(`Replay request failed with HTTP ${response.status}`);
      const body = await response.json() as { receipt?: ReplayReceipt };
      if (!body.receipt) throw new Error("Replay response omitted its receipt");
      setReplayReceipt(body.receipt);
    } catch {
      setReplayReceipt(null);
      setReplayError("Replay failed without changing the sealed bundle. Retain the original evidence and retry the deterministic replay.");
    }
  }

  const badResults = run?.results.filter((result) => result.fixture.controlKind === "NEGATIVE") ?? [];
  const goodResults = run?.results.filter((result) => result.fixture.controlKind === "POSITIVE") ?? [];

  return (
    <div className="mt-10 space-y-6" aria-busy={state === "RUNNING"}>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3"><Badge tone="evidence">STEP 1 · AUTHORITATIVE LOCAL INTAKE</Badge><Badge tone="neutral">SYNTHETIC DATA ONLY</Badge></div>
          <CardTitle className="mt-4 text-2xl">Version the journey contract</CardTitle>
          <CardDescription>This contract becomes the input authority for compilation, receipts, export, and replay. Role identifiers describe review slots; they do not claim two humans have approved a release.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={sealContract}>
            {[
              ["journeyKey", "Journey key", "renewal-assurance"],
              ["ownerRole", "Accountable owner role", "journey_architect"],
              ["sourceSystem", "Source system", "fixture-cdp"],
              ["destinationSystem", "Destination system", "lifecycle-simulator"],
              ["identityPolicyVersion", "Identity policy", "identity-v1"],
              ["consentPolicyVersion", "Consent policy", "consent-v1"],
            ].map(([name, label, value]) => <label className="grid gap-2 text-sm font-semibold" key={name}>{label}<input className="min-h-11 rounded-lg border border-[var(--border-strong)] bg-white px-3 font-normal" name={name} defaultValue={value} required /></label>)}
            <label className="grid gap-2 text-sm font-semibold md:col-span-2">Rollback procedure<textarea className="min-h-24 rounded-lg border border-[var(--border-strong)] bg-white p-3 font-normal" name="rollbackProcedure" defaultValue="Restore the last accepted contract digest and replay the clean synthetic corpus." required /></label>
            <div className="flex flex-wrap items-center gap-3 md:col-span-2"><Button type="submit">Seal synthetic contract</Button>{contract && <Badge tone="pass">REVIEW_READY · {contract.contractDigest.slice(0, 21)}…</Badge>}</div>
            {contractError && <p className="text-sm text-[var(--fail)] md:col-span-2" role="alert">{contractError}</p>}
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.78fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3"><Badge tone="evidence">STEP 2 · SYNTHETIC-RENEWAL-V1</Badge><Badge tone="neutral">OFFLINE DETERMINISTIC</Badge></div>
            <CardTitle className="mt-5 text-2xl">Renewal migration assurance</CardTitle>
            <CardDescription>Versioned source contract, cents-to-CAD mapping, identity and consent policy, renewal state machine, lifecycle simulator, parity comparator, and redacted handoff.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 sm:grid-cols-4" aria-label="Journey order">
              {[["Source", "Purchase + renewal events"], ["Decision", "Identity + consent"], ["Destination", "Lifecycle simulator"], ["Evidence", "Receipt + recovery"]].map(([label, copy], index) => <li className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3" key={label}><span className="font-mono text-xs font-bold text-[var(--pass)]">0{index + 1}</span><strong className="mt-2 block text-sm">{label}</strong><span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">{copy}</span></li>)}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={startRun} disabled={state === "RUNNING" || !contract}><Play aria-hidden="true" size={17} /> {run ? "Run again" : "Run 24 controls"}</Button>
              {state === "RUNNING" && <Button variant="outline" onClick={cancelRun}><Square aria-hidden="true" size={16} /> Cancel safely</Button>}
              {state === "ERROR" && <Button variant="outline" onClick={startRun}><RotateCcw aria-hidden="true" size={17} /> Retry</Button>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface-strong)] text-white">
          <CardHeader><CardTitle className="text-white">Authority boundary</CardTitle><CardDescription className="text-white/65">The UI cannot widen this capability.</CardDescription></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[["Fixture data", "Synthetic only", CheckCircle2], ["Destination", "Local simulator", CheckCircle2], ["External calls", "Exactly zero", ShieldCheck], ["Production authority", "Absent", Ban]].map(([label, value, Icon]) => {
              const TypedIcon = Icon as typeof CheckCircle2;
              return <div className="flex min-h-12 items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0" key={label as string}><span className="flex items-center gap-2 text-white/65"><TypedIcon aria-hidden="true" size={16} />{label as string}</span><strong>{value as string}</strong></div>;
            })}
          </CardContent>
        </Card>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {state === "RUNNING" && "Assurance controls running."}
        {state === "SUCCESS" && `Assurance run ${run?.terminalState.toLowerCase()}.`}
        {state === "ERROR" && `Assurance run failed. ${error}`}
        {state === "CANCELLED" && "Assurance run cancelled. Prior evidence was retained."}
      </div>

      {state === "RUNNING" && <Card><CardContent className="flex min-h-28 items-center gap-4 p-5"><CircleDashed className="animate-spin text-[var(--pass)]" aria-hidden="true" /><div><strong>Running the bad controls before the clean corpus…</strong><p className="mt-1 text-sm text-[var(--text-muted)]">The previous accepted receipt remains visible after cancellation or retry.</p></div></CardContent></Card>}
      {state === "ERROR" && <Card className="border-[var(--fail-border)] bg-[var(--fail-bg)]"><CardContent className="p-5"><strong className="text-[var(--fail)]">Local run failed</strong><p className="mt-2 text-sm text-[var(--text-muted)]">{error} No provider action was attempted. Retry the deterministic request or inspect the server transcript.</p></CardContent></Card>}
      {state === "CANCELLED" && <Card className="border-[var(--unknown-border)] bg-[var(--unknown-bg)]"><CardContent className="p-5"><strong className="text-[var(--unknown)]">Run cancelled</strong><p className="mt-2 text-sm text-[var(--text-muted)]">No partial result was promoted. Any prior completed receipt remains below.</p></CardContent></Card>}

      {run && (
        <section aria-labelledby="run-results-heading" className="space-y-5">
          <Card className={run.terminalState === "PASSED" ? "border-[var(--pass-border)]" : "border-[var(--fail-border)]"}>
            <CardContent className="grid gap-5 p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
              <span className={`grid h-12 w-12 place-items-center rounded-full ${run.terminalState === "PASSED" ? "bg-[var(--pass-bg)] text-[var(--pass)]" : "bg-[var(--fail-bg)] text-[var(--fail)]"}`}><CheckCircle2 aria-hidden="true" /></span>
              <div><h2 id="run-results-heading" className="text-xl font-semibold">{run.terminalState === "PASSED" ? "All expected controls behaved correctly" : "Promotion remains blocked"}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">{run.results.filter((result) => result.expectationMet).length}/{run.results.length} expectations met · {run.externalCallCount} external calls · receipt {run.evidenceDigest.slice(0, 23)}…</p></div>
              <Badge tone={run.terminalState === "PASSED" ? "pass" : "fail"}>{run.terminalState}</Badge>
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <ResultGroup title="Bad controls" description="Seeded defects must be rejected." results={badResults} />
            <ResultGroup title="Clean controls" description="Clean deterministic inputs pass; release authority remains UNKNOWN until real human evidence exists." results={goodResults} />
          </div>
          {handoffBundle && <Card>
            <CardHeader><div className="flex flex-wrap items-center justify-between gap-3"><Badge tone="evidence">STEP 3 · REDACTED HANDOFF</Badge><Badge tone="neutral">LOCAL REPLAY ONLY</Badge></div><CardTitle className="mt-4">Export and replay without the builder</CardTitle><CardDescription>The bundle embeds the exact contract, all sealed receipts, recovery, and deterministic replay steps. A separate operator can verify it through the documented replay endpoint.</CardDescription></CardHeader>
            <CardContent><div className="flex flex-wrap gap-3"><Button variant="outline" onClick={downloadHandoff}>Download JSON handoff</Button><Button onClick={replayHandoff}>{replayError ? "Retry handoff replay" : "Replay sealed handoff"}</Button></div>{replayReceipt && <p className="mt-4 text-sm" role="status"><Badge tone={replayReceipt.decision === "MATCH" ? "pass" : "fail"}>{replayReceipt.decision}</Badge> <span className="ml-2 text-[var(--text-muted)]">{replayReceipt.reason} · {replayReceipt.replayRunDigest?.slice(0, 21) ?? "no replay digest"}…</span></p>}{replayError && <p className="mt-4 text-sm text-[var(--fail)]" role="alert">{replayError}</p>}</CardContent>
          </Card>}
        </section>
      )}
    </div>
  );
}

function ResultGroup({ title, description, results }: { title: string; description: string; results: AssuranceRun["results"] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
      <CardContent className="space-y-2">
        {results.map((result) => <details className="group rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4" key={result.fixture.fixtureId}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
            <span><strong className="block text-sm">{result.fixture.requirementId}</strong><span className="mt-1 block text-xs text-[var(--text-muted)]">{result.evaluation.detectorId}</span></span>
            <span className="flex items-center gap-2"><Badge tone={result.evaluation.health === "HEALTHY" ? "pass" : "fail"}>{result.evaluation.health}</Badge><Badge tone={result.evaluation.decision === "PASS" ? "pass" : result.evaluation.decision === "REJECT" ? "fail" : "unknown"}>{result.evaluation.decision}</Badge></span>
          </summary>
          <div className="mt-3 border-t border-[var(--border)] pt-3 text-sm leading-6 text-[var(--text-muted)]"><p>{result.fixture.scenario}</p><p className="mt-2 font-mono text-xs break-all">{result.receipt?.evidenceDigest ?? "UNSEALED — outbound capability attempt or detector failure"}</p>{result.evaluation.findings.map((item) => <p className="mt-2 text-[var(--fail)]" key={`${item.code}-${item.field ?? "root"}`}>{item.code}: {item.message}</p>)}</div>
        </details>)}
      </CardContent>
    </Card>
  );
}
