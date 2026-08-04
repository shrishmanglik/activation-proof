import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "pass" | "fail" | "unknown" | "evidence";

const tones: Record<Tone, string> = {
  neutral: "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)]",
  pass: "border-[var(--pass-border)] bg-[var(--pass-bg)] text-[var(--pass)]",
  fail: "border-[var(--fail-border)] bg-[var(--fail-bg)] text-[var(--fail)]",
  unknown: "border-[var(--unknown-border)] bg-[var(--unknown-bg)] text-[var(--unknown)]",
  evidence: "border-[var(--evidence-border)] bg-[var(--evidence-bg)] text-[var(--evidence)]",
};

export function Badge({ tone = "neutral", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn("inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide", tones[tone], className)} {...props} />;
}
