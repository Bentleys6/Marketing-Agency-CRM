export const colors = {
  bg: '#0b0710',
  surface: '#150f20',
  surfaceAlt: '#1d1530',
  border: '#2c2340',
  borderLight: '#3a2d52',
  text: '#f4f1fa',
  textMuted: '#b3a4d4',
  textFaint: '#8a7aae',
  primary: '#9333ea',
  primaryHover: '#7e22ce',
  primaryLight: '#c084fc',
  danger: '#f87171',
  success: '#4ade80',
}

export const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  background: colors.surfaceAlt,
  color: colors.text,
}

export const labelStyle = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.85rem',
  color: colors.textMuted,
  marginBottom: '0.4rem',
}

export const cardStyle = {
  background: colors.surface,
  borderRadius: '12px',
  border: `1px solid ${colors.border}`,
  padding: '1.5rem',
}

export const primaryButtonStyle = {
  background: colors.primary,
  color: '#fff',
  padding: '0.6rem 1.25rem',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.9rem',
  cursor: 'pointer',
}

export const secondaryButtonStyle = {
  background: 'transparent',
  color: colors.primaryLight,
  border: `1px solid ${colors.primary}`,
  padding: '0.6rem 1.25rem',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.9rem',
}

export function pillStyle(active) {
  return {
    background: active ? colors.primary : colors.surface,
    color: active ? '#fff' : colors.textMuted,
    border: `1px solid ${active ? colors.primary : colors.border}`,
    padding: '0.4rem 0.9rem',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer',
  }
}
