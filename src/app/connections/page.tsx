import { Cable, CircleOff, Database, MessageSquare, Warehouse } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const connections = [
  [Database, "Event source", "Repository fixture adapter", "LOCAL ONLY"],
  [MessageSquare, "Lifecycle destination", "Deterministic acknowledgement simulator", "SANDBOX SIMULATOR"],
  [Warehouse, "Warehouse / reverse ETL", "Contract proposed; no credential or network path", "NOT CONNECTED"],
  [Cable, "Collaboration delivery", "Signed-bundle download proposed", "NOT CONNECTED"],
] as const;

export default function ConnectionsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><PageHeading eyebrow="INTEGRATION BOUNDARY" title="Explicit capability, including when the capability is absent." description="The implemented vertical cannot contact a customer, activate a journey, read a warehouse, or mutate a provider. Future adapters must declare authority, idempotency, failure semantics, fallback, and evidence before connection." />
      <div className="mt-10 grid gap-4 md:grid-cols-2">{connections.map(([Icon, title, copy, status]) => <Card key={title}><CardHeader><div className="flex items-center justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--surface-raised)]"><Icon aria-hidden="true" size={20} /></span><Badge tone={status.includes("NOT") ? "unknown" : "pass"}>{status}</Badge></div><CardTitle className="mt-4">{title}</CardTitle><CardDescription>{copy}</CardDescription></CardHeader></Card>)}</div>
      <Card className="mt-5 border-[var(--fail-border)] bg-[var(--fail-bg)]"><CardHeader><CircleOff aria-hidden="true" className="text-[var(--fail)]" /><CardTitle className="mt-3">No secret entry surface by design</CardTitle><CardDescription>Provider credentials, production webhooks, customer datasets, and live mutations require separate owner, security, provider, and founder authority. This repository offers no field or endpoint for them.</CardDescription></CardHeader></Card>
    </section>
  );
}
