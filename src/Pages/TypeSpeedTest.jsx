import React, { useState, useRef, useEffect } from 'react'
import { LevelSelection } from '../components/LevelSelection'
import { TypingInterface } from '../components/TypingInterface'
import { useTheme } from '../hooks/useTheme'
import { useTimer } from '../hooks/useTimer'
import { useHighScore } from '../hooks/useHighScore'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useKeyStats } from '../hooks/useKeyStats'
import { SENTENCES_DATA } from '../constants/sentences'
import { calculateWPM, calculateAccuracy } from '../utils/calculations'

function TypeSpeedTest() {
  // Custom Hooks
  const { isDark, toggleTheme, theme } = useTheme()
  const { highestWPM, previousHighestWPM, streak, showBeatPopup, setShowBeatPopup, newWPM, checkAndUpdateWPM, updateStreak } = useHighScore()
  const { dailyTasks, taskToasts, setTaskToasts, checkDailyTasks, completedCount } = useDailyTasks()
  const { keyStats, trackKeyPress, resetKeyStats } = useKeyStats()

  // Local State
  const [level, setLevel] = useState(null)
  const [sampleText, setSampleText] = useState("")
  const [input, setInput] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  // Timer Hook
  const timeElapsed = useTimer(startTime, isFinished, endTime)

  // Refs
  const textareaRef = useRef(null)

  // Auto-dismiss toasts
  useEffect(() => {
    if (taskToasts.length === 0) return
    const timer = setTimeout(() => {
      setTaskToasts(prev => prev.slice(1))
    }, 3000)
    return () => clearTimeout(timer)
  }, [taskToasts, setTaskToasts])

  // Focus textarea when level is selected
  useEffect(() => {
    if (level && textareaRef.current) textareaRef.current.focus()
  }, [level])

  const selectLevel = (selectedLevel) => {
    setLevel(selectedLevel)
    const sentences = SENTENCES_DATA[selectedLevel]
    const sentenceKeys = Object.keys(sentences)
    const randomKey = sentenceKeys[Math.floor(Math.random() * sentenceKeys.length)]
    setSampleText(sentences[randomKey])
    setInput("")
    setStartTime(null)
    setEndTime(null)
    setIsFinished(false)
    resetKeyStats()
  }

  const handleKeyDown = (e) => {
    if (isFinished) return
    if (e.key === 'Backspace') { e.preventDefault(); return }

    const isCharKey = e.key.length === 1
    const isSpaceKey = e.key === ' '
    if (!isCharKey && !isSpaceKey) return

    const isSpace = isSpaceKey
    const expectedChar = sampleText[input.length]
    const typedChar = isSpace ? ' ' : e.key

    trackKeyPress(isSpace, expectedChar, typedChar)
  }

  const handleChange = (e) => {
    const value = e.target.value

    // Prevent deletion
    if (value.length < input.length) {
      e.target.value = input
      return
    }

    // Start timer on first input
    if (!startTime) setStartTime(Date.now())

    // Prevent exceeding sample text length
    if (value.length > sampleText.length) {
      e.target.value = input
      return
    }

    setInput(value)

    // Test finished when all characters typed
    if (value.length === sampleText.length) {
      const now = Date.now()
      const elapsedTime = (now - startTime) / 1000
      setEndTime(now)
      setIsFinished(true)
      completeTest(value, elapsedTime)
    }
  }

  const completeTest = (currentInput, currentTimeElapsed) => {
    const wpm = calculateWPM(currentInput, currentTimeElapsed)
    const acc = calculateAccuracy(currentInput, sampleText)

    checkAndUpdateWPM(wpm)
    checkDailyTasks(wpm, acc, level)
    updateStreak()
  }

  // Calculated values
  const wpm = calculateWPM(input, timeElapsed)
  const accuracy = calculateAccuracy(input, sampleText)

  const resetTest = () => {
    setInput("")
    setStartTime(null)
    setEndTime(null)
    setIsFinished(false)
    setLevel(null)
    setSampleText("")
    resetKeyStats()
    setShowBeatPopup(false)
  }

  // Render based on state
  if (!level) {
    return (
      <LevelSelection
        isDark={isDark}
        theme={theme}
        highestWPM={highestWPM}
        streak={streak}
        dailyTasks={dailyTasks}
        completedCount={completedCount}
        taskToasts={taskToasts}
        showBeatPopup={showBeatPopup}
        previousHighestWPM={previousHighestWPM}
        newWPM={newWPM}
        toggleTheme={toggleTheme}
        onLevelSelect={selectLevel}
        onBeatPopupClose={() => setShowBeatPopup(false)}
      />
    )
  }

  return (
    <TypingInterface
      isDark={isDark}
      theme={theme}
      level={level}
      sampleText={sampleText}
      input={input}
      timeElapsed={timeElapsed}
      isFinished={isFinished}
      keyStats={keyStats}
      wpm={wpm}
      accuracy={accuracy}
      highestWPM={highestWPM}
      streak={streak}
      dailyTasks={dailyTasks}
      completedCount={completedCount}
      taskToasts={taskToasts}
      showBeatPopup={showBeatPopup}
      previousHighestWPM={previousHighestWPM}
      newWPM={newWPM}
      textareaRef={textareaRef}
      toggleTheme={toggleTheme}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onReset={resetTest}
      onBeatPopupClose={() => setShowBeatPopup(false)}
    />
  )
}

export default TypeSpeedTest