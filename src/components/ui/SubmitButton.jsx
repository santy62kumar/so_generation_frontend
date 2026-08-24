import React from "react";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The full-width "generate this document" action. Every generator screen used
 * to carry its own copy of this button plus a private spinner/download icon;
 * they all share this one now.
 *
 * Props: loading, disabled, onClick, idleLabel, loadingLabel, icon
 */
const SubmitButton = ({
  loading = false,
  disabled = false,
  onClick,
  idleLabel,
  loadingLabel,
  icon: Icon = Download,
  className,
  ...props
}) => (
  <Button
    type="button"
    size="xl"
    disabled={loading || disabled}
    onClick={onClick}
    className={cn("gap-3", loading && "upload-shimmer", className)}
    {...props}
  >
    {loading ? <Loader2 className="animate-spin" /> : <Icon />}
    {loading ? loadingLabel : idleLabel}
  </Button>
);

export default SubmitButton;
