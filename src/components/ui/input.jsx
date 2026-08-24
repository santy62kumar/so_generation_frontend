import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-lg border-[1.5px] border-input bg-brand-cream/80 px-3.5 py-2.5 text-base text-foreground transition-colors outline-none",
        "placeholder:text-brand-muted",
        "file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-3 file:py-1 file:text-sm file:font-semibold file:text-brand-dark",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props} />
  );
}

export { Input }
