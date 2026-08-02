import React, { useState, useRef, useEffect } from "react";
import { COLORS } from "../../constants/theme";

/**
 * Dropdown that shows a small swatch thumbnail next to each color name,
 * and shows the currently-selected swatch on the closed control itself.
 * Supports optional groups (e.g. "Cabinet Colors" vs "Glass Colors") for
 * fields whose pool is a union of two catalogs.
 *
 * Props:
 *  - label   {string}
 *  - name    {string}   unique field key
 *  - value   {string}   currently-selected composite value ("category:id")
 *  - onChange (name, value) => void
 *  - groups  [{ label, options: [{ value, id, name, thumb }] }]
 *  - required {boolean} shows a red asterisk state when empty + touched
 */
const ColorSwatchSelect = ({ label, name, value, onChange, groups = [], required = false }) => {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const rootRef = useRef(null);

  const allOptions = groups.flatMap(g => g.options);
  const selected = allOptions.find(o => o.value === value);
  const isEmpty = required && touched && !value;

  useEffect(() => {
    const onDocClick = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const pick = opt => {
    onChange(name, opt.value);
    setTouched(true);
    setOpen(false);
  };

  const Swatch = ({ thumb, size = 24 }) => (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      border: `1px solid ${COLORS.lightTaupe}`, overflow: 'hidden',
      background: thumb ? `url(${thumb}) center/cover` : COLORS.lightTaupe,
    }} />
  );

  return (
    <div ref={rootRef} style={{ marginBottom: 16, position: 'relative' }}>
      <label style={{
        display: 'block', marginBottom: 8,
        fontWeight: 600, color: COLORS.deepTaupe,
        fontSize: 13, letterSpacing: '0.3px',
      }}>
        {label}
      </label>

      <button
        type="button"
        onClick={() => { setOpen(o => !o); setTouched(true); }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
          border: `2px solid ${isEmpty ? '#dc2626' : (open ? COLORS.medBrown : COLORS.lightTaupe)}`,
          background: '#fff', textAlign: 'left',
        }}
      >
        <Swatch thumb={selected?.thumb} />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: selected ? COLORS.darkBrown : COLORS.mutedBrown, flex: 1 }}>
          {selected ? selected.name : '-- Select Color --'}
        </span>
        <svg style={{ width: 16, height: 16, color: COLORS.mutedBrown, transform: open ? 'rotate(180deg)' : 'none' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isEmpty && (
        <p style={{ margin: '4px 0 0', fontSize: 11.5, color: '#dc2626' }}>This color is required.</p>
      )}

      {open && (
        <div style={{
          position: 'absolute', zIndex: 50, top: '100%', left: 0, right: 0, marginTop: 4,
          maxHeight: 280, overflowY: 'auto', background: '#fff', borderRadius: 10,
          border: `1px solid ${COLORS.lightTaupe}`, boxShadow: '0 12px 24px rgba(58,26,26,0.15)',
        }}>
          {allOptions.length === 0 && (
            <p style={{ margin: 0, padding: 14, fontSize: 12.5, color: COLORS.mutedBrown }}>
              No colors configured for this catalog yet.
            </p>
          )}
          {groups.map(group => (
            group.options.length > 0 && (
              <div key={group.label}>
                <p style={{
                  margin: 0, padding: '8px 14px 4px', fontSize: 11, fontWeight: 700,
                  color: COLORS.mutedBrown, textTransform: 'uppercase', letterSpacing: '0.4px',
                }}>
                  {group.label}
                </p>
                {group.options.map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => pick(opt)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 14px', cursor: 'pointer',
                      background: opt.value === value ? 'rgba(175,124,113,0.08)' : 'transparent',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(175,124,113,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = opt.value === value ? 'rgba(175,124,113,0.08)' : 'transparent'; }}
                  >
                    <Swatch thumb={opt.thumb} />
                    <span style={{ fontSize: 13, color: COLORS.deepTaupe }}>{opt.name}</span>
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorSwatchSelect;