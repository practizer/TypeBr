export const storageKeys = {
  HIGHEST_WPM: 'highestWPM',
  STREAK: 'streak',
  LAST_PLAYED_DATE: 'lastPlayedDate',
  IS_DARK: 'isDark',
  DAILY_TASK_DATE: 'dailyTaskDate',
  DAILY_TASKS: 'dailyTasks',
}

export const getStoredHighestWPM = () => {
  const stored = localStorage.getItem(storageKeys.HIGHEST_WPM)
  return stored ? parseInt(stored, 10) : 0
}

export const setStoredHighestWPM = (wpm) => {
  localStorage.setItem(storageKeys.HIGHEST_WPM, wpm.toString())
}

export const getStoredStreak = () => {
  const stored = localStorage.getItem(storageKeys.STREAK)
  return stored ? parseInt(stored, 10) : 0
}

export const setStoredStreak = (streak) => {
  localStorage.setItem(storageKeys.STREAK, streak.toString())
}

export const getStoredLastPlayedDate = () => {
  return localStorage.getItem(storageKeys.LAST_PLAYED_DATE)
}

export const setStoredLastPlayedDate = (date) => {
  localStorage.setItem(storageKeys.LAST_PLAYED_DATE, date)
}

export const getStoredTheme = () => {
  const stored = localStorage.getItem(storageKeys.IS_DARK)
  return stored !== null ? stored === 'true' : true
}

export const setStoredTheme = (isDark) => {
  localStorage.setItem(storageKeys.IS_DARK, String(isDark))
}

export const getStoredDailyTasks = (defaultTasks) => {
  const today = new Date().toDateString()
  const storedTaskDate = localStorage.getItem(storageKeys.DAILY_TASK_DATE)
  const storedTasks = localStorage.getItem(storageKeys.DAILY_TASKS)

  if (storedTaskDate === today && storedTasks) {
    const savedDone = JSON.parse(storedTasks)
    return defaultTasks.map(t => ({ ...t, done: savedDone[t.id] || false }))
  } else {
    localStorage.setItem(storageKeys.DAILY_TASK_DATE, today)
    localStorage.setItem(storageKeys.DAILY_TASKS, JSON.stringify({}))
    return defaultTasks
  }
}

export const setStoredDailyTasks = (tasks) => {
  const doneMap = {}
  tasks.forEach(t => { doneMap[t.id] = t.done })
  localStorage.setItem(storageKeys.DAILY_TASKS, JSON.stringify(doneMap))
}
