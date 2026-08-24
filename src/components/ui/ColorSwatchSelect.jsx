import React, { useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Dropdown that shows a small swatch thumbnail next to each colour name, and
 * shows the currently-selected swatch on the closed control itself. Supports
 * optional groups (e.g. "Cabinet Colors" vs "Glass Colors") for fields whose
 * pool is a union of two catalogs.
 *
 * Built on the shared <Select> so it gets keyboard navigation, type-ahead and
 * correct listbox semantics — the hand-rolled div-menu it replaced had none.
 *
 * Props:
 *  - label   {string}
 *  - name    {string}   unique field key
 *  - value   {string}   currently-selected composite value ("category:id")
 *  - onChange (name, value) => void
 *  - groups  [{ label, options: [{ value, id, name, thumb }] }]
 *  - required {boolean} shows a required message when empty + touched
 */
const Swatch = ({ thumb, className }) => (
  <span
    aria-hidden="true"
    className={cn("size-6 shrink-0 overflow-hidden rounded-full border border-border bg-brand-light", className)}
    style={thumb ? { background: `url(${thumb}) center/cover` } : undefined}
  />
);

const ColorSwatchSelect = ({
  label,
  name,
  value,
  onChange,
  groups = [],
  required = false,
  className,
}) => {
  const [touched, setTouched] = useState(false);

  const allOptions = groups.flatMap((g) => g.options);
  const selected = allOptions.find((o) => o.value === value);
  const isEmpty = required && touched && !value;

  return (
    <div className={cn("mb-4", className)}>
      {label && <Label className="mb-2">{label}</Label>}

      <Select
        value={value || undefined}
        onValueChange={(next) => { onChange(name, next); setTouched(true); }}
        onOpenChange={() => setTouched(true)}
      >
        <SelectTrigger
          aria-label={label}
          aria-invalid={isEmpty || undefined}
          className="font-semibold"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Swatch thumb={selected?.thumb} />
            <SelectValue placeholder="-- Select Color --" />
          </span>
        </SelectTrigger>

        <SelectContent>
          {allOptions.length === 0 && (
            <p className="px-3.5 py-3 text-sm text-brand-muted">
              No colors configured for this catalog yet.
            </p>
          )}
          {groups.map((group) =>
            group.options.length > 0 ? (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <Swatch thumb={opt.thumb} className="size-5" />
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : null
          )}
        </SelectContent>
      </Select>

      {isEmpty && (
        <p className="mt-1 text-xs text-danger-accent">This color is required.</p>
      )}
    </div>
  );
};

export default ColorSwatchSelect;
