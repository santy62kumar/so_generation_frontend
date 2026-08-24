import * as React from "react"
import { cva } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils"

/**
 * One banner component replaces the ErrorBanner / SuccessBanner / InfoNote
 * trio that was copy-pasted across three forms. Same colours as before.
 */
const alertVariants = cva(
  "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 text-base [&>svg]:mt-0.5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        destructive:
          "rounded-xl border-2 border-brand-warm bg-brand-blush p-5 text-danger-strong [&>svg]:size-6 [&>svg]:text-danger-accent",
        success:
          "rounded-xl border-2 border-success-border bg-success-surface p-5 text-success-strong [&>svg]:size-6 [&>svg]:text-success",
        info:
          "rounded-lg border border-brand-gold/35 bg-brand-gold/12 px-4 py-3 text-sm leading-relaxed text-brand-deep [&>svg]:size-[18px] [&>svg]:text-brand-warm",
      },
    },
    defaultVariants: { variant: "info" },
  }
)

const DEFAULT_ICON = {
  destructive: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

function Alert({ className, variant = "info", icon, children, ...props }) {
  const Icon = icon ?? DEFAULT_ICON[variant];

  return (
    <div
      data-slot="alert"
      role={variant === "destructive" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}>
      {Icon ? <Icon aria-hidden="true" /> : null}
      <div className="col-start-2 min-w-0">{children}</div>
    </div>
  );
}

function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn("font-semibold tracking-tight", className)}
      {...props} />
  );
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn("font-medium [&_p]:leading-relaxed", className)}
      {...props} />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
