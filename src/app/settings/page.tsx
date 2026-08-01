import { DatabaseZap, FileKey2, HardDrive, UserCheck } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><PageHeading eyebrow="PRIVACY AND AUTHORITY" title="Offline by default; persistence is an explicit future mode." description="The current product holds no account, tenant, or provider state. The repository includes an optional Supabase migration with RLS on every table so the proposed persistence boundary is inspectable without claiming a live database." />
      <div className="mt-10 grid gap-4 md:grid-cols-2">{[
        [HardDrive, "Runtime storage", "In-memory request scope", "IMPLEMENTED"],
        [DatabaseZap, "Supabase persistence", "Schema + policies included; not connected", "PROPOSED"],
        [FileKey2, "Secrets", "No secrets read, stored, or required for demo", "IMPLEMENTED"],
        [UserCheck, "Approvals", "Two-person exact-digest contract; no live identity provider", "PARTIAL"],
      ].map(([Icon, title, copy, status]) => { const TypedIcon = Icon as typeof HardDrive; return <Card key={title as string}><CardHeader><div className="flex items-center justify-between gap-4"><TypedIcon aria-hidden="true" /><Badge tone={status === "IMPLEMENTED" ? "pass" : "unknown"}>{status as string}</Badge></div><CardTitle className="mt-3">{title as string}</CardTitle><CardDescription>{copy as string}</CardDescription></CardHeader></Card>; })}</div>
    </section>
  );
}
