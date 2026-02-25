import { useState, useEffect } from 'react'
import { getStoredHighestWPM, setStoredHighestWPM, getStoredStreak, setStoredStreak, getStoredLastPlayedDate, setStoredLastPlayedDate } from '../utils/storage'

export const useHighScore = () => {
  const [highestWPM, setHighestWPM] = useState(0)
  const [previousHighestWPM, setPreviousHighestWPM] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastPlayedDate, setLastPlayedDate] = useState(null)
  const [showBeatPopup, setShowBeatPopup] = useState(false)
  const [newWPM, setNewWPM] = useState(0)

  useEffect(() => {
    setHighestWPM(getStoredHighestWPM())
    setStreak(getStoredStreak())
    setLastPlayedDate(getStoredLastPlayedDate())
  }, [])

  const checkAndUpdateWPM = (wpm) => {
    if (wpm > highestWPM) {
      setPreviousHighestWPM(highestWPM)
      setShowBeatPopup(true)
      setNewWPM(wpm)
      setStoredHighestWPM(wpm)
      setHighestWPM(wpm)
      return true
    }
    return false
  }

  const updateStreak = () => {
    const today = new Date().toDateString()
    if (lastPlayedDate === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    let newStreak = lastPlayedDate === yesterdayStr ? streak + 1 : 1
    setStreak(newStreak)
    setLastPlayedDate(today)
    setStoredStreak(newStreak)
    setStoredLastPlayedDate(today)
  }

  return {
    highestWPM,
    previousHighestWPM,
    streak,
    lastPlayedDate,
    showBeatPopup,
    setShowBeatPopup,
    newWPM,
    checkAndUpdateWPM,
    updateStreak
  }
}
