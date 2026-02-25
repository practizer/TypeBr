import { useState } from 'react'

export const useKeyStats = () => {
  const [keyStats, setKeyStats] = useState({})

  const trackKeyPress = (isSpaceKey, expectedChar, typedChar) => {
    const keyId = isSpaceKey ? 'space' : typedChar.toLowerCase()
    const isError = expectedChar !== undefined && typedChar !== expectedChar

    setKeyStats((prev) => {
      const current = prev[keyId] || { presses: 0, errors: 0 }
      return {
        ...prev,
        [keyId]: {
          presses: current.presses + 1,
          errors: current.errors + (isError ? 1 : 0)
        }
      }
    })
  }

  const resetKeyStats = () => {
    setKeyStats({})
  }

  return { keyStats, trackKeyPress, resetKeyStats }
}
