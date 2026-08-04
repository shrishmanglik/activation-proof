import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Github, ShieldCheck } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ActivationProof — Activation assurance",
  description: "Deterministic controls and evidence receipts for cross-platform activation journeys.",
};

const navigation = [
  ["Overview", "/"],
  ["Workspace", "/workspace"],
  ["Records", "/records"],
  ["Proof", "/proof"],
  ["Connections", "/connections"],
  ["Settings", "/settings"],
] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">
          Skip to content
        </a>
        <header className="border-b border-[var(--border)] bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex min-h-11 items-center gap-3 rounded-lg">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-strong)] text-[var(--accent)]"><Boxes aria-hidden="true" size={20} /></span>
              <span><strong className="block leading-5">ActivationProof</strong><span className="block text-xs text-[var(--text-muted)]">Assurance control plane</span></span>
            </Link>
            <nav aria-label="Primary navigation" className="order-3 w-full lg:order-2 lg:w-auto">
              <ul className="flex flex-wrap items-center justify-center gap-1 lg:flex-nowrap">
                {navigation.map(([label, href]) => <li key={href}><Link className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)]" href={href}>{label}</Link></li>)}
              </ul>
            </nav>
            <a className="order-2 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold hover:bg-[var(--surface-raised)] lg:order-3" href="https://github.com/shrishmanglik/activation-proof" target="_blank" rel="noreferrer">
              <Github aria-hidden="true" size={17} /> Source
            </a>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="mt-20 border-t border-[var(--border)] bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[var(--text-muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p className="flex items-center gap-2"><ShieldCheck aria-hidden="true" size={17} /> Synthetic fixtures only. No production connector capability.</p>
            <p>Independent public work sample. No customer, employer, or vendor affiliation claimed.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
