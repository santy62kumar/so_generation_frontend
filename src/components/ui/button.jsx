import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Every button in the app comes from here.
 *
 * The variants below are the ones the product actually uses — the gradient
 * brand action, the taupe secondary, the red destructive, the hairline
 * outline, the slate inactive nav pill. Colours are the pre-existing brand
 * values; the only thing standardised is that they now live in one place and
 * every button shares one shape (pill) and one type ramp.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-display font-bold whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-linear-90 from-brand-dark to-brand-med text-white shadow-raised hover:shadow-lifted hover:brightness-110 active:scale-[0.98] disabled:bg-none disabled:bg-brand-light disabled:text-brand-muted disabled:shadow-none",
        secondary:
          "bg-brand-light text-brand-dark hover:brightness-95 active:scale-[0.98] disabled:opacity-50",
        destructive:
          "bg-destructive text-white hover:brightness-110 active:scale-[0.98] focus-visible:ring-destructive/40 disabled:opacity-50",
        outline:
          "border-[1.5px] border-border bg-transparent text-brand-dark hover:bg-brand-blush active:scale-[0.98] disabled:opacity-50",
        ghost:
          "text-brand-deep hover:bg-brand-blush active:scale-[0.98] disabled:opacity-50",
        slate:
          "bg-brand-slate text-white hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50",
        link: "text-brand-med underline-offset-4 hover:underline",
      },
      size: {
        sm:   "h-8  px-3.5 text-sm  [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 px-5 text-sm  [&_svg:not([class*='size-'])]:size-4",
        lg:   "h-12 px-7 text-lg  [&_svg:not([class*='size-'])]:size-5",
        xl:   "h-16 w-full px-8 text-xl tracking-[0.5px] [&_svg:not([class*='size-'])]:size-6",
        icon:      "size-10 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-8  [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
