import React from "react";

import { cn } from "@/lib/utils";

/**
 * Titled content card used to group form fields.
 *
 * Props:
 *  - title  {string}
 *  - step   {number}     optional numbered badge for multi-step forms
 *  - action {ReactNode}  optional right-aligned control in the header
 */
const Section = ({ title, step, action, children, className }) => (
  <section
    className={cn(
      "mb-6 rounded-xl border border-border bg-brand-cream/70 p-6",
      className
    )}
  >
    {title && (
      <header className="mb-4.5 flex items-center gap-2.5 border-b border-border pb-3">
        {step != null && (
          <span
            aria-hidden="true"
            className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-linear-135 from-brand-dark to-brand-med text-xs font-bold text-white"
          >
            {step}
          </span>
        )}
        <h3 className="flex-1 font-display text-lg font-bold -tracking-[0.2px] text-brand-dark">
          {title}
        </h3>
        {action}
      </header>
    )}
    {children}
  </section>
);

export default Section;
