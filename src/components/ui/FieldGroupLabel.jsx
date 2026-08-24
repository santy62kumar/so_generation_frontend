import React from "react";

import { cn } from "@/lib/utils";

/**
 * The small uppercase caption that titles a group of fields inside a
 * <Section> — one step below the section heading.
 */
const FieldGroupLabel = ({ children, className, ...props }) => (
  <p
    className={cn(
      "mb-3 text-sm font-bold tracking-[0.4px] text-brand-deep uppercase",
      className
    )}
    {...props}
  >
    {children}
  </p>
);

export default FieldGroupLabel;
