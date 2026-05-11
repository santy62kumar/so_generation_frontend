// ─── Brand colour palette ────────────────────────────────────────
export const COLORS = {
  darkBrown:   '#3A1A1A',
  medBrown:    '#6B4B41',
  mutedBrown:  '#9B7C73',
  deepTaupe:   '#4F372F',
  warmTaupe:   '#AF7C71',
  lightTaupe:  '#D7C5AA',
  blush:       '#F1E6DD',
  cream:       '#FFFBF8',
};

// ─── Reusable style objects ──────────────────────────────────────
export const PAGE_BG = {
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.blush} 50%, ${COLORS.lightTaupe} 100%)`,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '32px',
};

export const CARD_STYLE = {
  background: 'rgba(255, 251, 248, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(58,26,26,0.25)',
  border: `1px solid ${COLORS.lightTaupe}`,
  overflow: 'hidden',
  backgroundImage: `
    repeating-linear-gradient(0deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03) 1px,transparent 1px,transparent 2px),
    repeating-linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03) 1px,transparent 1px,transparent 2px)
  `,
};

export const FIELD_INPUT_STYLE = {
  width: '100%',
  padding: '10px 14px',
  border: `1.5px solid ${COLORS.lightTaupe}`,
  borderRadius: 10,
  fontFamily: 'Montserrat, Nunito Sans, sans-serif',
  fontSize: 14,
  color: COLORS.darkBrown,
  background: 'rgba(255,251,248,0.8)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
};

export const FIELD_LABEL_STYLE = {
  display: 'block',
  marginBottom: 6,
  fontWeight: 600,
  color: COLORS.deepTaupe,
  fontSize: 13,
  letterSpacing: '0.3px',
};

export const PRIMARY_BTN_STYLE = (disabled) => ({
  width: '100%',
  padding: '20px 32px',
  borderRadius: 16,
  fontWeight: 600,
  fontSize: 18,
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.3s ease',
  background: disabled
    ? COLORS.lightTaupe
    : `linear-gradient(90deg, ${COLORS.darkBrown} 0%, ${COLORS.medBrown} 100%)`,
  color: disabled ? COLORS.mutedBrown : 'white',
  boxShadow: disabled ? 'none' : '0 20px 25px -5px rgba(58,26,26,0.3)',
  fontFamily: 'Montserrat, Nunito Sans, sans-serif',
  letterSpacing: '0.5px',
});