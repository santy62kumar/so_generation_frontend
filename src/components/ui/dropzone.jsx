import React, { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Dashed drag-and-drop target with a hidden file input behind it.
 *
 * Props:
 *  - accept    {string}   input accept attribute (e.g. ".xlsx", "image/*")
 *  - multiple  {boolean}
 *  - onFiles   {(File[]) => void}
 *  - active    {boolean}  render the "has a selection" border treatment
 *  - children  {ReactNode | ({ dragging }) => ReactNode}
 */
export default function Dropzone({
  accept,
  multiple = false,
  onFiles,
  active = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const emit = (fileList) => {
    const files = Array.from(fileList ?? []);
    if (files.length) onFiles(files);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) emit(e.dataTransfer.files);
      }}
      className={cn(
        "cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/40",
        dragging
          ? "border-brand-med bg-brand-med/5"
          : active
            ? "border-brand-warm bg-brand-light/10"
            : "border-border bg-brand-light/10 hover:border-brand-warm",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => { emit(e.target.files); e.target.value = ""; }}
      />
      {typeof children === "function" ? children({ dragging }) : children}
    </div>
  );
}
