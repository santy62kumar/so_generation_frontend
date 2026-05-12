import React from "react";

const TABS = [
  { key: "kitchen",  label: "Design Draft"  },
  { key: "xlsx",     label: "SO Generator"  },
  { key: "warranty", label: "Warranty Card" },
];

const Navbar = ({ activeView, onNavigate }) => (
  <nav style={{
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 50,
    background: "rgba(255, 251, 248, 0.6)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 2px 12px rgba(58,26,26,0.1)",
    borderBottom: "1px solid rgba(215,197,170,0.4)",
  }}>
    <div style={{
      maxWidth: 1440,
      margin: "0 auto",
      padding: "0 24px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>

      {/* ── Logo — always navigates home ─────────────────────────── */}
      <button
        onClick={() => onNavigate("home")}
        style={{
          background: "none", border: "none", padding: 0,
          cursor: "pointer", display: "flex", alignItems: "center",
        }}
      >
        <img
          src="https://www.modula.in/images/modula_jsw.svg"
          alt="Modula by JSW"
          style={{ height: 40, width: "auto" }}
        />
      </button>

      {/* ── Tab buttons ──────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {TABS.map(tab => {
          const isActive = activeView === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                lineHeight: "18px",
                padding: "8px 20px",
                borderRadius: 30,
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
                background: isActive
                  ? "linear-gradient(90deg, #3A1A1A 0%, #6B4B41 100%)"
                  : "#706362",
                color: "white",
                boxShadow: isActive ? "0 4px 12px rgba(58,26,26,0.3)" : "none",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#2b1514"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "#706362"; }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

    </div>
  </nav>
);

export default Navbar;