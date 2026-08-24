import React, { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Labelled text input.
 *
 * Props: label, name, value, onChange(name, value), placeholder, type,
 *        error, hint, className
 */
const TextField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error,
  hint,
  className,
  ...props
}) => {
  const id = useId();

  return (
    <div className={cn("mb-3 space-y-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        onChange={(e) => onChange(name, e.target.value)}
        {...props}
      />
      {(error || hint) && (
        <p
          id={`${id}-msg`}
          className={cn("text-xs", error ? "text-danger-strong" : "text-brand-muted")}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default TextField;
