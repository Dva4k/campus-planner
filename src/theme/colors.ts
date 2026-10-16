export const colors = {
  light: {
    background: '#F5F7FB',
    surface: '#FFFFFF',
    text: '#172033',
    secondaryText: '#687386',
    primary: '#4F46E5',
    primaryLight: '#E8E7FF',
    border: '#E5E7EB',
    inputBorder: '#D9DEEA',
    muted: '#E5E7EB',
    danger: '#DC2626',
  },
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    secondaryText: '#9CA3AF',
    primary: '#818CF8',
    primaryLight: '#312E81',
    border: '#374151',
    inputBorder: '#374151',
    muted: '#374151',
    danger: '#F87171',
  },
} as const;

export type AppTheme = keyof typeof colors;