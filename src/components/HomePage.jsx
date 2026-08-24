import React from "react";
import {
  ArrowRight,
  ClipboardList,
  Database,
  FileText,
  ShieldCheck,
  Table2,
} from "lucide-react";

const TOOLS = [
  {
    key: "kitchen",
    label: "Design Draft Generator",
    description:
      "Generate personalised client presentation PDFs with layout plans, renders, and contact details.",
    icon: FileText,
  },
  {
    key: "xlsx",
    label: "SO Generator",
    description:
      "Upload a pricing quotation XLSX and instantly convert it into a formatted sales order file.",
    icon: Table2,
  },
  {
    key: "warranty",
    label: "Warranty Handbook Generator",
    description:
      "Fill in customer details and generate a personalised Modula warranty handbook ready to print.",
    icon: ShieldCheck,
  },
  {
    key: "installation",
    label: "Installation Report Generator",
    description:
      "Log daily site progress with project info, manpower, completed tasks, and photo attachments — exported as a branded PDF.",
    icon: ClipboardList,
  },
  {
    key: "database",
    label: "Database Manager",
    description:
      "Search, edit, and export the cabinet, colour-code, and product-code tables that drive every generator.",
    icon: Database,
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="app-surface flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-12">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="mb-14 max-w-xl text-center">
        <p className="mb-4 text-sm font-semibold tracking-[2px] text-brand-warm uppercase">
          Internal Tools
        </p>
        <h1 className="mb-4 font-display text-4xl font-bold -tracking-[0.5px] text-brand-dark">
          Modula Generators
        </h1>
        <p className="text-lg leading-relaxed text-brand-deep">
          Select a tool to get started.
        </p>
      </header>

      {/* ── Tool cards ───────────────────────────────────────────────── */}
      <div className="grid w-full max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {TOOLS.map(({ key, label, description, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onNavigate(key)}
            className="group app-glass flex flex-col gap-4 rounded-[20px] border-[1.5px] border-border p-8 text-left shadow-[0_4px_24px_rgba(58,26,26,0.08)] transition-all duration-250 outline-none hover:-translate-y-1 hover:border-brand-warm hover:shadow-[0_16px_40px_rgba(58,26,26,0.18)] focus-visible:border-brand-warm focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <span className="flex size-15 shrink-0 items-center justify-center rounded-[14px] bg-linear-135 from-brand-dark to-brand-med text-white">
              <Icon aria-hidden="true" className="size-8" strokeWidth={1.8} />
            </span>

            <span className="block">
              <span className="mb-2 block font-display text-xl font-bold -tracking-[0.2px] text-brand-dark">
                {label}
              </span>
              <span className="block text-sm leading-relaxed text-brand-deep">
                {description}
              </span>
            </span>

            <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-med">
              Open tool
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
