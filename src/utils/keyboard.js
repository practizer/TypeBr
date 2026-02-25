export const getKeyStats = (keyLabel, keyStats, isDark) => {
  const keyId = keyLabel === 'Space' ? 'space' : keyLabel.toLowerCase()
  const stats = keyStats[keyId]
  const maxPresses = Object.values(keyStats).reduce((max, item) => Math.max(max, item.presses), 0)

  const heatmapEmpty = isDark
    ? { backgroundColor: '#0b0b0b', borderColor: '#27272a', color: '#a1a1aa' }
    : { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1', color: '#64748b' }

  if (!stats || maxPresses === 0) return heatmapEmpty

  const intensity = Math.max(0.2, Math.min(1, stats.presses / maxPresses))
  const errorRate = stats.presses > 0 ? stats.errors / stats.presses : 0

  if (isDark) {
    const red = Math.round(252 * (errorRate * 0.8))
    const green = Math.round(211 * intensity)
    const blue = Math.round(77 * intensity)
    return {
      backgroundColor: `rgb(${red}, ${green}, ${blue})`,
      borderColor: errorRate > 0.2 ? '#f87171' : '#52525b',
      color: '#0a0a0a'
    }
  } else {
    const r = Math.round(99 + (errorRate * 156))
    const g = Math.round(102 * intensity + (1 - intensity) * 200)
    const b = Math.round(220 * (1 - intensity * 0.7))
    return {
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      borderColor: errorRate > 0.2 ? '#ef4444' : '#94a3b8',
      color: '#0f172a'
    }
  }
}
