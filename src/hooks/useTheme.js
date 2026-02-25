import { useState, useEffect } from 'react'
import { getStoredTheme, setStoredTheme } from '../utils/storage'
import { DARK_THEME, LIGHT_THEME } from '../constants/themes'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const storedTheme = getStoredTheme()
    setIsDark(storedTheme)
  }, [])

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev
      setStoredTheme(newValue)
      return newValue
    })
  }

  const theme = isDark ? DARK_THEME : LIGHT_THEME

  return { isDark, toggleTheme, theme }
}
