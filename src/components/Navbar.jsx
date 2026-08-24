import React from "react";

import { Button } from "@/components/ui/button";

const TABS = [
  { key: "kitchen",      label: "Design Draft"        },
  { key: "xlsx",         label: "SO Generator"        },
  { key: "warranty",     label: "Warranty Handbook"   },
  { key: "installation", label: "Installation Report" },
  { key: "database",     label: "Database Manager"    },
];

const Navbar = ({ activeView, onNavigate }) => (
  <nav className="app-glass fixed inset-x-0 top-0 z-50 border-b border-border/40 shadow-nav">
    <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-6">
      {/* Logo — always navigates home */}
      <button
        type="button"
        onClick={() => onNavigate("home")}
        aria-label="Modula by JSW — go to home"
        className="flex shrink-0 items-center rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <img
          src="https://www.modula.in/images/modula_jsw.svg"
          alt="Modula by JSW"
          className="h-10 w-auto"
        />
      </button>

      <div className="flex items-center gap-2.5 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeView === tab.key;
          return (
            <Button
              key={tab.key}
              variant={isActive ? "default" : "slate"}
              size="sm"
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "shadow-pill" : "shadow-none"}
              onClick={() => onNavigate(tab.key)}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  </nav>
);

export default Navbar;
