import { Badge } from "@/components/ui/badge";

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <Badge tone="evidence">{eyebrow}</Badge>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-[var(--text)] sm:text-5xl">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
