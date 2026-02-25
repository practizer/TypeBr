import React, { useState, useEffect, useRef } from 'react'

// mock sentence data inline for demo
const sentencesData = {
  easy: {
    s1: "the quick brown fox jumps over the lazy dog",
    s2: "she sells sea shells by the sea shore",
    s3: "how much wood would a woodchuck chuck",
  },
  medium: {
    s1: "pack my box with five dozen liquor jugs and some extra cheese",
    s2: "the five boxing wizards jump quickly over the lazy dog today",
    s3: "sphinx of black quartz judge my vow carefully and wisely",
  },
  hard: {
    s1: "how can a clam cram in a clean cream can without cracking the container",
    s2: "red lorry yellow lorry repeat this tongue twister as fast as you possibly can",
    s3: "peter piper picked a peck of pickled peppers from the patch near the river",
  }
}

const DEFAULT_DAILY_TASKS = [
  { id: 1, text: "Complete a typing test", done: false, check: (wpm, acc) => wpm > 0 },
  { id: 2, text: "Type at 40+ WPM", done: false, check: (wpm, acc) => wpm >= 40 },
  { id: 3, text: "Get 90%+ accuracy", done: false, check: (wpm, acc) => acc >= 90 },
  { id: 4, text: "Finish a Hard level test", done: false, level: 'hard', check: (wpm, acc, lvl) => lvl === 'hard' },
  { id: 5, text: "Type at 60+ WPM", done: false, check: (wpm, acc) => wpm >= 60 },
]

function TypeSpeedTest() {
  const [isDark, setIsDark] = useState(true)
  const [level, setLevel] = useState(null)
  const [sampleText, setSampleText] = useState("")
  const [input, setInput] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [keyStats, setKeyStats] = useState({})
  const [highestWPM, setHighestWPM] = useState(0)
  const [previousHighestWPM, setPreviousHighestWPM] = useState(0)
  const [showBeatPopup, setShowBeatPopup] = useState(false)
  const [newWPM, setNewWPM] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastPlayedDate, setLastPlayedDate] = useState(null)

  // daily tasks state
  const [showTasksPanel, setShowTasksPanel] = useState(false)
  const [dailyTasks, setDailyTasks] = useState(DEFAULT_DAILY_TASKS)
  const [taskToasts, setTaskToasts] = useState([]) // [{id, text}]

  const textareaRef = useRef(null)

  // ─── Theme tokens ──────────────────────────────────────────────────────────
  const t = isDark ? {
    pageBg: 'bg-zinc-950',
    cardBg: 'bg-zinc-900',
    innerBg: 'bg-zinc-950',
    cardBorder: 'border-zinc-800',
    innerBorder: 'border-zinc-800',
    labelText: 'text-zinc-500',
    headingText: 'text-zinc-100',
    bodyText: 'text-zinc-300',
    mutedText: 'text-zinc-600',
    placeholderCls: 'placeholder-zinc-700',
    accent: 'text-yellow-300',
    accentBg: 'bg-yellow-300',
    accentBorder: 'border-yellow-300',
    accentHover: 'hover:border-yellow-300 hover:text-yellow-300 hover:bg-yellow-300/5',
    accentGlow: 'bg-yellow-300/10 border-yellow-300/30',
    accentComplete: 'text-yellow-300',
    progressTrack: 'bg-zinc-800',
    progressFill: 'bg-yellow-300',
    heatmapEmpty: { backgroundColor: '#0b0b0b', borderColor: '#27272a', color: '#a1a1aa' },
    typedCorrect: 'text-yellow-300',
    cursor: 'border-yellow-300',
    toggleBg: 'bg-zinc-800 hover:bg-zinc-700',
    toggleIcon: '☀️',
    toggleLabel: 'Light',
  } : {
    pageBg: 'bg-slate-100',
    cardBg: 'bg-white',
    innerBg: 'bg-slate-50',
    cardBorder: 'border-slate-200',
    innerBorder: 'border-slate-200',
    labelText: 'text-slate-400',
    headingText: 'text-slate-800',
    bodyText: 'text-slate-700',
    mutedText: 'text-slate-400',
    placeholderCls: 'placeholder-slate-300',
    accent: 'text-indigo-600',
    accentBg: 'bg-indigo-600',
    accentBorder: 'border-indigo-500',
    accentHover: 'hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50',
    accentGlow: 'bg-indigo-50 border-indigo-200',
    accentComplete: 'text-indigo-600',
    progressTrack: 'bg-slate-200',
    progressFill: 'bg-indigo-500',
    heatmapEmpty: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1', color: '#64748b' },
    typedCorrect: 'text-indigo-500',
    cursor: 'border-indigo-500',
    toggleBg: 'bg-slate-200 hover:bg-slate-300',
    toggleIcon: '🌙',
    toggleLabel: 'Dark',
  }

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['Space']
  ]

  const selectLevel = (selectedLevel) => {
    setLevel(selectedLevel)
    const sentences = sentencesData[selectedLevel]
    const sentenceKeys = Object.keys(sentences)
    const randomKey = sentenceKeys[Math.floor(Math.random() * sentenceKeys.length)]
    setSampleText(sentences[randomKey])
    setInput("")
    setStartTime(null)
    setEndTime(null)
    setTimeElapsed(0)
    setIsFinished(false)
    setKeyStats({})
  }

  useEffect(() => {
    if (level && textareaRef.current) textareaRef.current.focus()
  }, [level])

  useEffect(() => {
    const stored = localStorage.getItem('highestWPM')
    if (stored) setHighestWPM(parseInt(stored, 10))
    const storedStreak = localStorage.getItem('streak')
    const storedLastPlayed = localStorage.getItem('lastPlayedDate')
    if (storedStreak) setStreak(parseInt(storedStreak, 10))
    if (storedLastPlayed) setLastPlayedDate(storedLastPlayed)
    const storedTheme = localStorage.getItem('isDark')
    if (storedTheme !== null) setIsDark(storedTheme === 'true')

    // load daily tasks, reset if new day
    const today = new Date().toDateString()
    const storedTaskDate = localStorage.getItem('dailyTaskDate')
    const storedTasks = localStorage.getItem('dailyTasks')
    if (storedTaskDate === today && storedTasks) {
      // restore done state only
      const savedDone = JSON.parse(storedTasks)
      setDailyTasks(DEFAULT_DAILY_TASKS.map(t => ({ ...t, done: savedDone[t.id] || false })))
    } else {
      // new day, reset
      localStorage.setItem('dailyTaskDate', today)
      localStorage.setItem('dailyTasks', JSON.stringify({}))
    }
  }, [])

  useEffect(() => {
    let timer
    if (startTime && !isFinished) {
      timer = setInterval(() => setTimeElapsed((Date.now() - startTime) / 1000), 100)
    } else if (startTime && isFinished && endTime) {
      setTimeElapsed((endTime - startTime) / 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, isFinished, endTime])

  // auto-dismiss toasts
  useEffect(() => {
    if (taskToasts.length === 0) return
    const timer = setTimeout(() => {
      setTaskToasts(prev => prev.slice(1))
    }, 3000)
    return () => clearTimeout(timer)
  }, [taskToasts])

  const toggleTheme = () => {
    setIsDark(prev => {
      localStorage.setItem('isDark', String(!prev))
      return !prev
    })
  }

  const handleKeyDown = (e) => {
    if (isFinished) return
    if (e.key === 'Backspace') { e.preventDefault(); return }
    const isCharKey = e.key.length === 1
    const isSpaceKey = e.key === ' '
    if (!isCharKey && !isSpaceKey) return
    const keyId = isSpaceKey ? 'space' : e.key.toLowerCase()
    const expectedChar = sampleText[input.length]
    const typedChar = isSpaceKey ? ' ' : e.key
    const isError = expectedChar !== undefined && typedChar !== expectedChar
    setKeyStats((prev) => {
      const current = prev[keyId] || { presses: 0, errors: 0 }
      return { ...prev, [keyId]: { presses: current.presses + 1, errors: current.errors + (isError ? 1 : 0) } }
    })
  }

  const handleChange = (e) => {
    const value = e.target.value
    if (value.length < input.length) { e.target.value = input; return }
    if (!startTime) setStartTime(Date.now())
    if (value.length > sampleText.length) { e.target.value = input; return }
    setInput(value)
    if (value.length === sampleText.length) {
      const now = Date.now()
      const elapsedTime = (now - startTime) / 1000
      setEndTime(now)
      setTimeElapsed(elapsedTime)
      setIsFinished(true)
      checkAndUpdateWPM(value, elapsedTime)
    }
  }

  const calculateWPM = () => {
    const words = input.trim().split(/\s+/).length
    const minutes = timeElapsed / 60
    return minutes > 0 ? Math.round(words / minutes) : 0
  }

  const checkAndUpdateWPM = (currentInput, currentTimeElapsed) => {
    const words = currentInput.trim().split(/\s+/).length
    const minutes = currentTimeElapsed / 60
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0

    // calc accuracy for task checking
    let correctChars = 0
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === sampleText[i]) correctChars++
    }
    const acc = sampleText.length > 0 ? Math.round((correctChars / sampleText.length) * 100) : 0

    if (wpm > highestWPM) {
      setPreviousHighestWPM(highestWPM)
      setShowBeatPopup(true)
      setNewWPM(wpm)
      localStorage.setItem('highestWPM', wpm.toString())
      setHighestWPM(wpm)
    }

    // check daily tasks
    checkDailyTasks(wpm, acc, level)
    updateStreak()
    return wpm
  }

  const checkDailyTasks = (wpm, acc, currentLevel) => {
    setDailyTasks(prev => {
      const newTasks = prev.map(task => {
        if (task.done) return task
        const passed = task.check(wpm, acc, currentLevel)
        if (passed) {
          // queue a toast
          setTaskToasts(q => [...q, { id: task.id, text: task.text }])
          return { ...task, done: true }
        }
        return task
      })
      // persist done state
      const doneMap = {}
      newTasks.forEach(t => { doneMap[t.id] = t.done })
      localStorage.setItem('dailyTasks', JSON.stringify(doneMap))
      return newTasks
    })
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
    localStorage.setItem('streak', newStreak.toString())
    localStorage.setItem('lastPlayedDate', today)
  }

  const calculateAccuracy = () => {
    let correctChars = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] === sampleText[i]) correctChars++
    }
    return sampleText.length > 0 ? Math.round((correctChars / sampleText.length) * 100) : 0
  }

  const resetTest = () => {
    setInput("")
    setStartTime(null)
    setEndTime(null)
    setTimeElapsed(0)
    setIsFinished(false)
    setLevel(null)
    setSampleText("")
    setKeyStats({})
    setShowBeatPopup(false)
  }

  const renderSample = () => {
    return sampleText.split('').map((char, i) => {
      let cls = t.mutedText
      if (i < input.length) {
        cls = input[i] === char ? t.typedCorrect : `text-red-400 rounded-sm`
      } else if (i === input.length) {
        cls = `${t.mutedText} border-l-2 ${t.cursor} animate-pulse`
      }
      return <span key={i} className={cls}>{char}</span>
    })
  }

  const wpm = calculateWPM()
  const accuracy = calculateAccuracy()
  const maxPresses = Object.values(keyStats).reduce((max, item) => Math.max(max, item.presses), 0)
  const completedTasks = dailyTasks.filter(t => t.done).length

  const getKeyStyle = (keyLabel) => {
    const keyId = keyLabel === 'Space' ? 'space' : keyLabel.toLowerCase()
    const stats = keyStats[keyId]
    if (!stats || maxPresses === 0) return t.heatmapEmpty
    const intensity = Math.max(0.2, Math.min(1, stats.presses / maxPresses))
    const errorRate = stats.presses > 0 ? stats.errors / stats.presses : 0
    if (isDark) {
      const red = Math.round(252 * (errorRate * 0.8))
      const green = Math.round(211 * intensity)
      const blue = Math.round(77 * intensity)
      return { backgroundColor: `rgb(${red}, ${green}, ${blue})`, borderColor: errorRate > 0.2 ? '#f87171' : '#52525b', color: '#0a0a0a' }
    } else {
      const r = Math.round(99 + (errorRate * 156))
      const g = Math.round(102 * intensity + (1 - intensity) * 200)
      const b = Math.round(220 * (1 - intensity * 0.7))
      return { backgroundColor: `rgb(${r}, ${g}, ${b})`, borderColor: errorRate > 0.2 ? '#ef4444' : '#94a3b8', color: '#0f172a' }
    }
  }

  // ── Theme Toggle ────────────────────────────────────────────────────────────
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${t.toggleBg} ${t.bodyText}`}
    >
      <span>{t.toggleIcon}</span>
      <span>{t.toggleLabel}</span>
    </button>
  )

  // ── Daily Tasks Button ──────────────────────────────────────────────────────
  const DailyTasksBtn = () => (
    <button
      onClick={() => setShowTasksPanel(p => !p)}
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
        isDark
          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
      }`}
    >
      <span>📋</span>
      <span>Daily Tasks</span>
      {/* badge */}
      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
        completedTasks === dailyTasks.length
          ? 'bg-green-500 text-white'
          : isDark ? 'bg-yellow-300 text-black' : 'bg-indigo-500 text-white'
      }`}>
        {completedTasks}
      </span>
    </button>
  )

  // ── Daily Tasks Panel ───────────────────────────────────────────────────────
  const DailyTasksPanel = () => (
    <div className={`absolute right-0 top-full mt-2 w-72 z-40 ${t.cardBg} border ${t.cardBorder} rounded-lg shadow-xl overflow-hidden`}
      style={{ boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.12)' }}
    >
      {/* header */}
      <div className={`px-4 py-3 border-b ${t.cardBorder} flex items-center justify-between`}>
        <div>
          <p className={`text-xs tracking-widest uppercase font-mono ${t.labelText}`}>Today's Goals</p>
          <p className={`text-sm font-bold font-mono ${t.headingText} mt-0.5`}>
            {completedTasks}/{dailyTasks.length} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* mini progress ring done cheaply */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke={isDark ? '#27272a' : '#e2e8f0'} strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={isDark ? '#fde047' : '#6366f1'}
                strokeWidth="3"
                strokeDasharray={`${(completedTasks / dailyTasks.length) * 94.25} 94.25`}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute text-xs font-bold font-mono ${t.accent}`}>
              {Math.round((completedTasks / dailyTasks.length) * 100)}%
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTasksPanel(false)}
            aria-label="Close daily tasks"
            className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center transition-colors ${
              isDark
                ? 'border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500'
                : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-400'
            }`}
          >
            ✕
          </button>
        </div>
      </div>

      {/* task list */}
      <div className="p-3 space-y-2">
        {dailyTasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              task.done
                ? isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
                : `${t.innerBg} border ${t.innerBorder}`
            }`}
          >
            {/* checkbox-ish */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              task.done
                ? 'bg-green-500 border-green-500'
                : isDark ? 'border-zinc-600' : 'border-slate-300'
            }`}>
              {task.done && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className={`text-xs font-mono flex-1 ${
              task.done
                ? 'line-through ' + (isDark ? 'text-zinc-500' : 'text-slate-400')
                : t.bodyText
            }`}>
              {task.text}
            </span>
            {task.done && <span className="text-xs">🎯</span>}
          </div>
        ))}
      </div>

      {completedTasks === dailyTasks.length && (
        <div className={`mx-3 mb-3 px-3 py-2 rounded-lg text-center text-xs font-mono font-bold ${
          isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          🎉 All done! Come back tomorrow
        </div>
      )}
    </div>
  )

  // ── Beat Popup ──────────────────────────────────────────────────────────────
  const BeatPopup = () => (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className={`${t.cardBg} border-2 ${t.accentBorder} rounded-lg p-8 text-center max-w-sm`}>
        <div className='text-4xl mb-4'>🎉</div>
        <h2 className={`text-2xl font-bold ${t.accent} font-mono mb-2`}>NEW RECORD!</h2>
        <p className={`${t.bodyText} font-mono mb-4`}>You beat your previous best!</p>
        <div className='flex justify-around items-center mb-6'>
          <div className='text-center'>
            <p className={`text-xs tracking-widest ${t.labelText} uppercase font-mono mb-1`}>Previous Best</p>
            <p className={`text-3xl font-bold ${t.mutedText} font-mono`}>{previousHighestWPM}</p>
            <p className={`text-xs ${t.mutedText} font-mono`}>WPM</p>
          </div>
          <div className={`text-2xl ${t.mutedText}`}>→</div>
          <div className='text-center'>
            <p className={`text-xs tracking-widest ${t.labelText} uppercase font-mono mb-1`}>New Record</p>
            <p className={`text-3xl font-bold ${t.accent} font-mono`}>{newWPM}</p>
            <p className={`text-xs ${t.mutedText} font-mono`}>WPM</p>
          </div>
        </div>
        <button
          onClick={() => setShowBeatPopup(false)}
          className={`w-full py-2 ${t.accentBg} ${isDark ? 'text-black' : 'text-white'} font-bold rounded font-mono`}
        >
          AWESOME!
        </button>
      </div>
    </div>
  )

  // ── Task Toast Notifications (top bar) ─────────────────────────────────────
  const TaskToasts = () => (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {taskToasts.map((toast, i) => (
        <div
          key={toast.id + '-' + i}
          className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-lg font-mono text-sm font-bold border transition-all`}
          style={{
            backgroundColor: isDark ? '#18181b' : '#fff',
            borderColor: isDark ? '#22c55e' : '#16a34a',
            color: isDark ? '#86efac' : '#15803d',
            boxShadow: isDark
              ? '0 0 20px rgba(34,197,94,0.25), 0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(0,0,0,0.12)',
            animation: 'slideDown 0.3s ease',
          }}
        >
          <span className="text-base">✅</span>
          <span>Task done: <span className={isDark ? 'text-green-300' : 'text-green-700'}>{toast.text}</span></span>
        </div>
      ))}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )

  // ── Level Selection ─────────────────────────────────────────────────────────
  if (!level) {
    return (
      <div className={`min-h-screen ${t.pageBg} flex items-center justify-center p-6 transition-colors duration-300`}>
        {showBeatPopup && <BeatPopup />}
        <TaskToasts />
        <div className='w-full max-w-2xl'>
          <div className={`${t.cardBg} border ${t.cardBorder} rounded-lg overflow-hidden shadow-sm`}>
            <div className={`h-0.5 ${isDark ? 'bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300' : 'bg-gradient-to-r from-indigo-400 via-violet-500 to-indigo-400'}`} />
            <div className='p-8'>
              <div className='flex justify-end gap-2 mb-4'>
                {/* daily tasks btn + dropdown wrapper */}
                <div className="relative">
                  <DailyTasksBtn />
                  {showTasksPanel && <DailyTasksPanel />}
                </div>
                <ThemeToggle />
              </div>
              <div className='text-center mb-8'>
                <p className={`text-xs tracking-widest ${t.labelText} uppercase font-mono mb-2`}>Typing Test</p>
                <h1 className={`text-3xl font-bold ${t.headingText} tracking-tight font-mono mb-2`}>Choose Your Level</h1>
                <p className={`${t.labelText} text-sm font-mono`}>Select a difficulty level to start testing your typing speed</p>
                {streak > 0 && (
                  <div className='mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full'>
                    <span className='text-2xl'>🔥</span>
                    <div className='text-left'>
                      <p className='text-xl font-bold text-orange-400 font-mono leading-none'>{streak} Day{streak !== 1 ? 's' : ''}</p>
                      <p className='text-xs text-orange-400/70 font-mono'>Streak</p>
                    </div>
                  </div>
                )}
              </div>
              <div className='grid grid-cols-1 gap-4'>
                {[
                  { key: 'easy', label: 'Easy', desc: 'Simple sentences', hoverBorder: 'hover:border-green-500', hoverBg: 'hover:bg-green-500/5', hoverText: 'group-hover:text-green-500' },
                  { key: 'medium', label: 'Medium', desc: 'Moderate difficulty', hoverBorder: isDark ? 'hover:border-yellow-500' : 'hover:border-indigo-500', hoverBg: isDark ? 'hover:bg-yellow-500/5' : 'hover:bg-indigo-50', hoverText: isDark ? 'group-hover:text-yellow-400' : 'group-hover:text-indigo-600' },
                  { key: 'hard', label: 'Hard', desc: 'Challenging tongue twisters', hoverBorder: 'hover:border-red-500', hoverBg: 'hover:bg-red-500/5', hoverText: 'group-hover:text-red-500' },
                ].map(({ key, label, desc, hoverBorder, hoverBg, hoverText }) => (
                  <button
                    key={key}
                    onClick={() => selectLevel(key)}
                    className={`p-6 ${t.innerBg} border-2 ${t.innerBorder} rounded-lg ${hoverBorder} ${hoverBg} transition-all group`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='text-left'>
                        <h3 className={`text-xl font-bold ${t.headingText} font-mono ${hoverText} transition-colors`}>{label}</h3>
                        <p className={`${t.labelText} text-sm font-mono mt-1`}>{desc}</p>
                      </div>
                      <div className={`${t.mutedText} group-hover:text-zinc-400 transition-colors text-2xl`}>→</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main Typing Screen ──────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${t.pageBg} flex items-center justify-center p-6 transition-colors duration-300`}>
      {showBeatPopup && <BeatPopup />}
      <TaskToasts />
      <div className='w-full max-w-2xl'>
        <div className={`${t.cardBg} border ${t.cardBorder} rounded-lg overflow-hidden shadow-sm`}>
          <div className={`h-0.5 ${isDark ? 'bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300' : 'bg-gradient-to-r from-indigo-400 via-violet-500 to-indigo-400'}`} />
          <div className='p-8'>
            {/* Top bar */}
            <div className='flex justify-between items-start mb-8'>
              <div>
                <p className={`text-xs tracking-widest ${t.labelText} uppercase font-mono mb-1`}>
                  Typing Test • <span className={t.accent}>{level}</span>
                </p>
                <h1 className={`text-2xl font-bold ${t.headingText} tracking-tight font-mono`}>How fast are you</h1>
                <div className='flex items-center gap-4 mt-2'>
                  {highestWPM > 0 && (
                    <p className={`text-xs tracking-widest ${t.mutedText} uppercase font-mono`}>
                      Personal Best: <span className='text-green-500'>{highestWPM} WPM</span>
                    </p>
                  )}
                  {streak > 0 && (
                    <div className='inline-flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full'>
                      <span className='text-sm'>🔥</span>
                      <p className='text-xs font-bold text-orange-400 font-mono'>{streak} day{streak !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col items-end gap-2'>
                <div className='flex items-center gap-2'>
                  {/* daily tasks btn */}
                  <div className="relative">
                    <DailyTasksBtn />
                    {showTasksPanel && <DailyTasksPanel />}
                  </div>
                  <ThemeToggle />
                </div>
                <div className='text-right'>
                  <div className={`text-4xl font-bold ${t.accent} font-mono tabular-nums leading-none`}>
                    {timeElapsed.toFixed(1)}s
                  </div>
                  <p className={`text-xs tracking-widest ${t.labelText} uppercase mt-1`}>elapsed</p>
                </div>
              </div>
            </div>

            {/* Complete banner */}
            {isFinished && (
              <div className={`mb-6 px-4 py-3 ${t.accentGlow} border rounded text-xs tracking-widest uppercase text-center font-mono ${t.accentComplete}`}>
                ✓ complete - nice work!
              </div>
            )}

            {/* Sample text */}
            <div className={`${t.innerBg} border ${t.innerBorder} rounded p-5 mb-4 font-mono text-xl leading-loose tracking-wide select-none`}>
              {renderSample()}
            </div>

            {/* Input */}
            <textarea
              ref={textareaRef}
              className={`w-full ${t.innerBg} border ${t.innerBorder} rounded p-4 font-mono text-lg ${t.bodyText} ${t.placeholderCls} resize-none outline-none focus:border-opacity-80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed h-20`}
              value={input}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              disabled={isFinished}
              placeholder='Start to type Here ...'
              spellCheck={false}
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
            />

            {/* Stats */}
            <div className='grid grid-cols-3 gap-3 mt-4'>
              {[
                { label: 'WPM', value: wpm, highlight: isFinished },
                { label: 'Accuracy', value: `${accuracy}%` },
                { label: 'Chars', value: input.length },
              ].map(({ label, value, highlight }) => (
                <div key={label} className={`${t.innerBg} border ${t.innerBorder} rounded p-4 text-center`}>
                  <div className={`font-mono text-3xl font-bold leading-none tabular-nums ${highlight ? t.accent : t.headingText}`}>
                    {value}
                  </div>
                  <p className={`text-xs tracking-widest ${t.labelText} uppercase mt-2 font-mono`}>{label}</p>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className={`mt-6 ${t.innerBg} border ${t.innerBorder} rounded p-4`}>
              <div className='flex items-center justify-between mb-3'>
                <p className={`text-xs tracking-widest ${t.labelText} uppercase font-mono`}>Typing Heatmap</p>
                <p className={`text-xs ${t.mutedText} font-mono`}>more colour = more used, red tint = errors</p>
              </div>
              <div className='space-y-2'>
                {keyboardRows.map((row, rowIndex) => (
                  <div key={rowIndex} className='flex gap-2 justify-center'>
                    {row.map((keyLabel) => (
                      <div
                        key={keyLabel}
                        className={`h-10 ${keyLabel === 'Space' ? 'w-48' : 'w-10'} rounded border text-xs font-mono flex items-center justify-center transition-all duration-300`}
                        style={getKeyStyle(keyLabel)}
                      >
                        {keyLabel}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={resetTest}
              className={`w-full mt-4 py-3 border ${t.cardBorder} rounded ${t.labelText} text-xs tracking-widest uppercase font-mono ${t.accentHover} transition-all`}
            >
              ↺ &nbsp; reset
            </button>

            {/* Progress bar */}
            <div className={`mt-4 h-1 ${t.progressTrack} rounded-full overflow-hidden`}>
              <div
                className={`h-full ${t.progressFill} rounded-full transition-all duration-100`}
                style={{ width: `${sampleText.length > 0 ? (input.length / sampleText.length) * 100 : 0}%` }}
              />
            </div>
            <p className={`text-right text-xs ${t.mutedText} font-mono mt-1`}>
              {input.length}/{sampleText.length} chars
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypeSpeedTest