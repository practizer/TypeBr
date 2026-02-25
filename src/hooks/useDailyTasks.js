import { useState, useCallback } from 'react'
import { DEFAULT_DAILY_TASKS } from '../constants/tasks'
import { getStoredDailyTasks, setStoredDailyTasks } from '../utils/storage'

export const useDailyTasks = () => {
  const [dailyTasks, setDailyTasks] = useState(() => getStoredDailyTasks(DEFAULT_DAILY_TASKS))
  const [taskToasts, setTaskToasts] = useState([])

  const checkDailyTasks = useCallback((wpm, acc, currentLevel) => {
    setDailyTasks(prev => {
      const newTasks = prev.map(task => {
        if (task.done) return task
        const passed = task.check(wpm, acc, currentLevel)
        if (passed) {
          setTaskToasts(q => [...q, { id: task.id, text: task.text }])
          return { ...task, done: true }
        }
        return task
      })
      setStoredDailyTasks(newTasks)
      return newTasks
    })
  }, [])

  const completedCount = dailyTasks.filter(t => t.done).length

  return {
    dailyTasks,
    taskToasts,
    setTaskToasts,
    checkDailyTasks,
    completedCount
  }
}
