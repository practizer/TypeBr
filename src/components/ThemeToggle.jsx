import React from 'react'

export const ThemeToggle = ({ isDark, toggleTheme, theme }) => (
  <button
    onClick={toggleTheme}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${theme.toggleBg} ${theme.bodyText}`}
  >
    <span>{theme.toggleIcon}</span>
    <span>{theme.toggleLabel}</span>
  </button>
)
