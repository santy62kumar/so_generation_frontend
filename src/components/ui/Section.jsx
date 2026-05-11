import React from "react";
import { COLORS } from "../../constants/theme";

/**
 * Titled content card used to group form fields.
 * Props: title {string}, children {ReactNode}
 */
const Section = ({ title, children }) => (
  <div style={{
    background: 'rgba(255,251,248,0.7)',
    border: `1px solid ${COLORS.lightTaupe}`,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  }}>
    <h3 style={{
      margin: '0 0 18px',
      color: COLORS.darkBrown,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '-0.2px',
      borderBottom: `1px solid ${COLORS.lightTaupe}`,
      paddingBottom: 12,
      fontFamily: 'Montserrat, Nunito Sans, sans-serif',
    }}>
      {title}
    </h3>
    {children}
  </div>
);

export default Section;