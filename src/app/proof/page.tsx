import { Braces, Fingerprint, RotateCcw, ShieldOff } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const proofSteps = [
  ["1", "Known-bad", "Each P0 detector must reject its declared seeded defect with a typed issue and recovery path."],
  ["2", "Clean control", "The paired compatible contract must pass in the same run; rejection alone is not correctness."],
  ["3", "Repeat", "Two executions must produce the same normalized decisions and SHA-256 evidence digest."],
  ["4", "Mutation", "Disabling the consent detector must make its control suite fail. Restoring it must pass."],
];

export default function ProofPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <PageHeading eyebrow="EVIDENCE MODEL" title="The receipt proves the question that matters—not an adjacent check." description="A connector responding 200 does not prove correct identity, consent, mapping, journey order, parity, attribution, or handoff. ActivationProof records those decisions separately from detector health and provider state." />
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{proofSteps.map(([number, title, copy]) => <Card key={number}><CardHeader><Badge tone="evidence" className="w-fit">STEP {number}</Badge><CardTitle className="mt-4">{title}</CardTitle><CardDescription>{copy}</CardDescription></CardHeader></Card>)}</div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card><CardHeader><Fingerprint className="text-[var(--pass)]" aria-hidden="true" /><CardTitle className="mt-4">DecisionReceipt.v1</CardTitle><CardDescription>Stable, machine-readable proof bound to normalized input, scenario, decision trace, contract, detector version, measured outbound attempts, and data class.</CardDescription></CardHeader><CardContent><pre className="overflow-x-auto rounded-xl bg-[var(--surface-strong)] p-5 text-xs leading-6 text-white"><code>{`{
  "fixtureId": "CV-R4-BAD",
  "decision": "REJECT",
  "detectorHealth": "HEALTHY",
  "issueCodes": ["CV_R4_REJECTED"],
  "outboundAttemptCount": 0,
  "externalCallCount": 0,
  "dataClass": "SYNTHETIC",
  "fixtureInputDigest": "sha256:…",
  "decisionTraceDigest": "sha256:…",
  "contractDigest": "sha256:…",
  "evidenceDigest": "sha256:…"
}`}</code></pre></CardContent></Card>
        <Card><CardHeader><Braces className="text-[var(--evidence)]" aria-hidden="true" /><CardTitle className="mt-4">Authority is a separate record</CardTitle><CardDescription>A technical pass cannot create release authority. The exact reviewed and target digests, two distinct approvers, rollback proof, and a bounded audience are required even for sandbox authorization.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><p className="flex items-center gap-2"><ShieldOff aria-hidden="true" size={17} className="text-[var(--fail)]" /> Production capability: absent</p><p className="flex items-center gap-2"><RotateCcw aria-hidden="true" size={17} className="text-[var(--unknown)]" /> Recovery: last accepted digest + deterministic replay</p></CardContent></Card>
      </div>
    </section>
  );
}
