import React from "react";
import { FIELD_LABEL_STYLE, COLORS } from "../../constants/theme";

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%236B4B41' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`;

/**
 * Labelled styled <select>.
 *
 * Props:
 *  - label, name, value, onChange(name, value), placeholder
 *  - options  Array of strings  OR  Array of { value, label }
 */
const SelectField = ({ label, name, value, onChange, options = [], placeholder }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={FIELD_LABEL_STYLE}>{label}</label>
    <select
      name={name}
      value={value}
      onChange={e => onChange(name, e.target.value)}
      style={{
        width: '100%',
        padding: '10px 14px',
        paddingRight: 36,
        border: `1.5px solid ${COLORS.lightTaupe}`,
        borderRadius: 10,
        fontFamily: 'Montserrat, Nunito Sans, sans-serif',
        fontSize: 14,
        color: value ? COLORS.darkBrown : COLORS.mutedBrown,
        background: 'rgba(255,251,248,0.8)',
        outline: 'none',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
        appearance: 'none',
        backgroundImage: CHEVRON_SVG,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
      }}
      onFocus={e => (e.target.style.borderColor = COLORS.medBrown)}
      onBlur={e  => (e.target.style.borderColor = COLORS.lightTaupe)}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;