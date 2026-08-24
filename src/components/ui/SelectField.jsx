import React, { useId } from "react";
import { ChevronDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Labelled dropdown.
 *
 * Stays on the native <select> on purpose: it is keyboard- and
 * screen-reader-correct for free and gives mobile users the OS picker. The
 * chrome around it is the same token set as <Input>, so it reads as one
 * family with the text fields.
 *
 * Props:
 *  - label, name, value, onChange(name, value), placeholder
 *  - options  Array of strings  OR  Array of { value, label }
 */
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  className,
  ...props
}) => {
  const id = useId();

  return (
    <div className={cn("mb-3 space-y-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(name, e.target.value)}
          className={cn(
            "w-full appearance-none rounded-lg border-[1.5px] border-input bg-brand-cream/80 py-2.5 pr-10 pl-3.5 text-base transition-colors outline-none",
            "cursor-pointer focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
            value ? "text-foreground" : "text-brand-muted"
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt} className="text-foreground">
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-brand-med"
        />
      </div>
      {error && <p className="text-xs text-danger-strong">{error}</p>}
    </div>
  );
};

export default SelectField;
