import React from "react";

import { cn } from "@/lib/utils";

/**
 * Full-page content wrapper: brand gradient ground, centred column, and the
 * frosted card every screen lives inside. The logo/title header lives in
 * <Navbar>.
 *
 * Props:
 *  - maxWidth  {string}    Tailwind max-w-* class (default "max-w-3xl")
 *  - children  {ReactNode} Content rendered inside the card
 */
const PageLayout = ({ maxWidth = "max-w-3xl", children, className }) => (
  <div className="app-surface flex min-h-screen justify-start px-8 pt-24 pb-8">
    <div className={cn("mx-auto w-full", maxWidth)}>
      <div
        className={cn(
          "app-glass app-grain overflow-hidden rounded-2xl border border-border shadow-card",
          className
        )}
      >
        {children}
      </div>
    </div>
  </div>
);

export default PageLayout;
