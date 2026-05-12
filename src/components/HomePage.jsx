import React from "react";
import { COLORS } from "../constants/theme";

const TOOLS = [
  {
    key: "kitchen",
    label: "Design Draft Generator",
    description:
      "Generate personalised client presentation PDFs with layout plans, renders, and contact details.",
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0
             01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: "xlsx",
    label: "SO Generator",
    description:
      "Upload a pricing quotation XLSX and instantly convert it into a formatted sales order file.",
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 10h18M3 6h18M3 14h10m-7 4h4M17 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: "warranty",
    label: "Warranty Card Generator",
    description:
      "Fill in customer details and instantly generate a branded Modula warranty card PDF ready to print.",
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0
             014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42
             3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806
             1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42
             3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0
             01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438
             3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.blush} 50%, ${COLORS.lightTaupe} 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "96px 24px 48px",
      fontFamily: "Montserrat, Nunito Sans, sans-serif",
    }}>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 560 }}>
        <p style={{
          fontSize: 13, fontWeight: 600, letterSpacing: "2px",
          textTransform: "uppercase", color: COLORS.warmTaupe, marginBottom: 16,
        }}>
          Internal Tools
        </p>
        <h1 style={{
          fontSize: 42, fontWeight: 700, color: COLORS.darkBrown,
          letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 16px",
        }}>
          Modula Generators
        </h1>
        <p style={{ fontSize: 16, color: COLORS.deepTaupe, lineHeight: 1.7, margin: 0 }}>
          Select a tool to get started.
        </p>
      </div>

      {/* ── Tool cards ─────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        width: "100%",
        maxWidth: 960,
      }}>
        {TOOLS.map(tool => (
          <button
            key={tool.key}
            onClick={() => onNavigate(tool.key)}
            style={{
              background: "rgba(255, 251, 248, 0.9)",
              backdropFilter: "blur(20px)",
              border: `1.5px solid ${COLORS.lightTaupe}`,
              borderRadius: 20,
              padding: "36px 32px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 24px rgba(58,26,26,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(58,26,26,0.18)";
              e.currentTarget.style.borderColor = COLORS.warmTaupe;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(58,26,26,0.08)";
              e.currentTarget.style.borderColor = COLORS.lightTaupe;
            }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: 14,
              background: `linear-gradient(135deg, ${COLORS.darkBrown} 0%, ${COLORS.medBrown} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", flexShrink: 0,
            }}>
              {tool.icon}
            </div>

            <div>
              <p style={{
                margin: "0 0 8px", fontSize: 17, fontWeight: 700,
                color: COLORS.darkBrown, letterSpacing: "-0.2px",
              }}>
                {tool.label}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: COLORS.deepTaupe, lineHeight: 1.6 }}>
                {tool.description}
              </p>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              color: COLORS.medBrown, fontWeight: 600, fontSize: 13, marginTop: 4,
            }}>
              Open tool
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}