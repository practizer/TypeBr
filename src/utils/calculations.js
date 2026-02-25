export const calculateWPM = (text, timeElapsed) => {
  const words = text.trim().split(/\s+/).length
  const minutes = timeElapsed / 60
  return minutes > 0 ? Math.round(words / minutes) : 0
}

export const calculateAccuracy = (input, sampleText) => {
  let correctChars = 0
  for (let i = 0; i < input.length; i++) {
    if (input[i] === sampleText[i]) correctChars++
  }
  return sampleText.length > 0 ? Math.round((correctChars / sampleText.length) * 100) : 0
}

export const calculateKeyAccuracy = (stats) => {
  if (!stats || stats.presses === 0) return 0
  return Math.round(((stats.presses - stats.errors) / stats.presses) * 100)
}
