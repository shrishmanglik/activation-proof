"use client";

import { useRef, useState } from "react";
import { Ban, CheckCircle2, CircleDashed, Play, RotateCcw, ShieldCheck, Square } from "lucide-react";
import type { AssuranceRun } from "@/domain/assurance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RunState = "IDLE" | "RUNNING" | "SUCCESS" | "ERROR" | "CANCELLED";

export function ActivationProofWorkspace() {
  const [state, setState] = useState<RunState>("IDLE");
  const [run, setRun] = useState<AssuranceRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  async function startRun() {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState("RUNNING");
    setError(null);
    try {
      const response = await fetch("/api/v1/assurance-runs", {
        method: "POST",
        headers: { "content-type": "application/json", "x-request-id": "ui-synthetic-renewal-v1" },
        body: JSON.stringify({ fixtureCorpus: "synthetic-renewal-v1" }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Run failed with HTTP ${response.status}`);
      const body = await response.json() as { run: AssuranceRun };
      setRun(body.run);
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

  const badResults = run?.results.filter((result) => result.fixture.controlKind === "NEGATIVE") ?? [];
  const goodResults = run?.results.filter((result) => result.fixture.controlKind === "POSITIVE") ?? [];

  return (
    <div className="mt-10 space-y-6" aria-busy={state === "RUNNING"}>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.78fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3"><Badge tone="evidence">SYNTHETIC-RENEWAL-V1</Badge><Badge tone="neutral">OFFLINE DETERMINISTIC</Badge></div>
            <CardTitle className="mt-5 text-2xl">Renewal migration assurance</CardTitle>
            <CardDescription>Versioned source contract, cents-to-CAD mapping, identity and consent policy, renewal state machine, lifecycle simulator, parity comparator, and redacted handoff.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 sm:grid-cols-4" aria-label="Journey order">
              {[["Source", "Purchase + renewal events"], ["Decision", "Identity + consent"], ["Destination", "Lifecycle simulator"], ["Evidence", "Receipt + recovery"]].map(([label, copy], index) => <li className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3" key={label}><span className="font-mono text-xs font-bold text-[var(--pass)]">0{index + 1}</span><strong className="mt-2 block text-sm">{label}</strong><span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">{copy}</span></li>)}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={startRun} disabled={state === "RUNNING"}><Play aria-hidden="true" size={17} /> {run ? "Run again" : "Run 24 controls"}</Button>
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
            <ResultGroup title="Clean controls" description="Only the approved synthetic contract may pass." results={goodResults} />
          </div>
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
          <div className="mt-3 border-t border-[var(--border)] pt-3 text-sm leading-6 text-[var(--text-muted)]"><p>{result.fixture.scenario}</p><p className="mt-2 font-mono text-xs break-all">{result.receipt.evidenceDigest}</p>{result.evaluation.findings.map((item) => <p className="mt-2 text-[var(--fail)]" key={`${item.code}-${item.field ?? "root"}`}>{item.code}: {item.message}</p>)}</div>
        </details>)}
      </CardContent>
    </Card>
  );
}
