import React, { useEffect, useState } from "react";
import { Check, ImageIcon } from "lucide-react";

import Dropzone from "@/components/ui/dropzone";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Drag-and-drop image upload field with preview.
 *
 * Props:
 *  - label    {string}
 *  - name     {string}   unique field key
 *  - onChange (name, file | File[]) => void
 *  - multiple {boolean}  allow multi-file (default false)
 *  - preview  {boolean}  show thumbnail previews (default true)
 *  - display  {url, name, rev}  OPTIONAL controlled override for the shown
 *             thumbnail. Pass a new object (with an incremented `rev`) any
 *             time the parent wants to force what's displayed — e.g. to
 *             show a cropped result instead of the raw dropped file, or to
 *             revert to the previously-committed image after a cancel.
 *             `url: null` clears the field back to its empty state.
 *             Leave `display` undefined for normal uncontrolled behavior.
 */
const ImageUpload = ({
  label,
  name,
  onChange,
  multiple = false,
  preview = true,
  display,
  className,
}) => {
  const [previews,  setPreviews]  = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const hasFile = fileNames.length > 0;

  // Controlled override — fires whenever the parent bumps `display.rev`,
  // even if url/name are unchanged from before.
  useEffect(() => {
    if (display === undefined) return;
    setPreviews(display.url ? [display.url] : []);
    setFileNames(display.name ? [display.name] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display?.rev]);

  const applyFiles = (files) => {
    onChange(name, multiple ? files : files[0]);
    setFileNames(files.map((f) => f.name));
    if (preview) setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  return (
    <div className={cn("mb-4", className)}>
      {label && <Label className="mb-2">{label}</Label>}

      <Dropzone
        accept="image/png,image/jpeg,image/svg+xml"
        multiple={multiple}
        active={hasFile}
        onFiles={applyFiles}
        aria-label={label ?? "Upload an image"}
        className={cn("flex items-center gap-3 p-4 text-left", hasFile && "bg-brand-warm/5")}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md bg-linear-135",
            hasFile
              ? "from-brand-warm to-brand-muted text-white"
              : "from-brand-light to-brand-blush text-brand-med"
          )}
        >
          {hasFile
            ? <Check aria-hidden="true" className="size-4.5" strokeWidth={2.5} />
            : <ImageIcon aria-hidden="true" className="size-4.5" />}
        </span>

        <div className="min-w-0">
          {hasFile ? (
            <p className="truncate text-sm font-semibold text-brand-dark">
              {fileNames.join(", ")}
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-brand-deep">
                Drop image or click to browse
              </p>
              <p className="text-xs text-brand-muted">PNG, JPG, SVG</p>
            </>
          )}
        </div>
      </Dropzone>

      {previews.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {previews.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              className="h-12.5 w-20 rounded-sm border border-border object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
