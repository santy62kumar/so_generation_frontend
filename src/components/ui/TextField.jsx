import React from "react";
import { FIELD_LABEL_STYLE, FIELD_INPUT_STYLE, COLORS } from "../../constants/theme";

/**
 * Labelled text input.
 *
 * Props: label, name, value, onChange(name, value), placeholder
 */
const TextField = ({ label, name, value, onChange, placeholder = '' }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={FIELD_LABEL_STYLE}>{label}</label>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(name, e.target.value)}
      style={FIELD_INPUT_STYLE}
      onFocus={e => (e.target.style.borderColor = COLORS.medBrown)}
      onBlur={e  => (e.target.style.borderColor = COLORS.lightTaupe)}
    />
  </div>
);

export default TextField;