import { useState, useEffect } from 'react'

export const useTimer = (startTime, isFinished, endTime) => {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    let timer
    if (startTime && !isFinished) {
      timer = setInterval(() => setTimeElapsed((Date.now() - startTime) / 1000), 100)
    } else if (startTime && isFinished && endTime) {
      setTimeElapsed((endTime - startTime) / 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, isFinished, endTime])

  return timeElapsed
}
