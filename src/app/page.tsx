import Link from "next/link";
import { ArrowRight, BotOff, Braces, CheckCircle2, CircleHelp, FileCheck2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stages = [
  ["01", "Contract", "Version schema, mapping, identity, consent, journey state, owners, and rollback."],
  ["02", "Challenge", "Run seeded bad controls before accepting the clean synthetic corpus."],
  ["03", "Prove", "Repeat the run, compare digests, and break the critical detector on purpose."],
  ["04", "Decide", "A human reviews exact evidence; production authority stays outside the product."],
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-24">
        <div>
          <Badge tone="evidence">IMPLEMENTED · SYNTHETIC OFFLINE VERTICAL</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">A green connector is not a correct customer journey.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">ActivationProof turns one cross-platform renewal journey into executable schema, mapping, identity, consent, state, parity, lineage, release, and handoff evidence—before any customer can be contacted.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild><Link href="/workspace">Run the synthetic proof <ArrowRight aria-hidden="true" size={17} /></Link></Button>
            <Button asChild variant="outline"><Link href="/proof">Inspect the evidence model</Link></Button>
          </div>
          <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-[var(--text-muted)]"><CircleHelp className="mt-0.5 shrink-0" aria-hidden="true" size={17} /> Commercial demand, pricing, buyer value, reliability, and production fitness remain hypotheses or unknowns.</p>
        </div>
        <Card className="self-end overflow-hidden bg-[var(--surface-strong)] text-[var(--text-inverse)]">
          <CardHeader className="border-b border-white/10 p-6">
            <div className="flex items-center justify-between gap-4"><Badge className="border-white/20 bg-white/10 text-white">CURRENT CONTROL ROOM</Badge><span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" role="img" aria-label="Offline engine ready" /></div>
            <CardTitle className="mt-8 text-2xl text-white">Synthetic renewal migration</CardTitle>
            <CardDescription className="text-white/65">One source contract → policy → lifecycle simulator → evidence receipt</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-px bg-white/10 p-0">
            {[["12", "P0 detectors"], ["24", "bad + good controls"], ["0", "external calls"], ["2×", "repeat proof"]].map(([value, label]) => <div className="bg-[var(--surface-strong)] p-6" key={label}><strong className="block text-3xl text-[var(--accent)]">{value}</strong><span className="mt-1 block text-sm text-white/60">{label}</span></div>)}
          </CardContent>
        </Card>
      </section>

      <section className="border-y border-[var(--border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {stages.map(([number, title, copy]) => <article className="bg-white p-6 lg:p-8" key={number}><span className="font-mono text-xs font-bold text-[var(--pass)]">{number}</span><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{copy}</p></article>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl"><Badge tone="neutral">AUTHORITY SPLIT</Badge><h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Deterministic where correctness is knowable. Human where authority matters.</h2></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card><CardHeader><Braces aria-hidden="true" className="text-[var(--pass)]" /><CardTitle className="mt-4">Code decides</CardTitle><CardDescription>Schema compatibility, mapping units, identity collision, consent eligibility, event order, parity, idempotency, lineage, canary health, attribution, and redaction.</CardDescription></CardHeader></Card>
          <Card><CardHeader><BotOff aria-hidden="true" className="text-[var(--evidence)]" /><CardTitle className="mt-4">AI does not decide</CardTitle><CardDescription>The implemented vertical makes no AI call. A future assistive layer may draft or explain, but never approve, activate, or rewrite evidence.</CardDescription></CardHeader></Card>
          <Card><CardHeader><FileCheck2 aria-hidden="true" className="text-[var(--unknown)]" /><CardTitle className="mt-4">Humans authorize</CardTitle><CardDescription>Two distinct approvers bind the exact digest and rollback proof. The repository contains no production connector, credential path, or customer contact capability.</CardDescription></CardHeader></Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="border-[var(--pass-border)] bg-[var(--pass-bg)]"><CardHeader><CheckCircle2 aria-hidden="true" className="text-[var(--pass)]" /><CardTitle className="mt-3">Implemented now</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm leading-6"><li>12 typed fail-closed detector modules</li><li>24 clearly synthetic control fixtures</li><li>Stable SHA-256 decision and run receipts</li><li>Typed API with malformed and unauthorized-corpus errors</li><li>Responsive evidence workspace with cancel, retry, and retained state</li><li>Optional Supabase schema with table-by-table RLS, not connected</li></ul></CardContent></Card>
          <Card className="border-[var(--unknown-border)] bg-[var(--unknown-bg)]"><CardHeader><ShieldAlert aria-hidden="true" className="text-[var(--unknown)]" /><CardTitle className="mt-3">Proposed or unknown</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm leading-6"><li>Commercial demand and willingness to pay</li><li>Production reliability, scale, SLOs, and economics</li><li>Live CDP, lifecycle, warehouse, or collaboration adapters</li><li>Customer data, outcomes, buyers, deployments, and revenue</li><li>Client-cloud tenancy and provider security acceptance</li><li>AI assistance, monitoring tier, and partner template library</li></ul></CardContent></Card>
        </div>
      </section>
    </>
  );
}
