import React, { useId } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Labelled multi-line input. Same prop shape as <TextField>.
 */
const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 3,
  className,
  ...props
}) => {
  const id = useId();

  return (
    <div className={cn("mb-3 space-y-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className="resize-y leading-relaxed"
        {...props}
      />
    </div>
  );
};

export default TextareaField;
