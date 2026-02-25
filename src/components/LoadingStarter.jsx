import React, { useEffect, useState } from 'react'
import './LoadingStarter.css'

function LoadingStarter() {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'TypeSpeed Tracker'
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [charIndex])

  return (
    <div className="loading-starter">
      <div className="loading-container">
        <div className="typing-animation">
          <h1>{displayText}</h1>
          <div className={`cursor ${charIndex === fullText.length ? 'finished' : ''}`}></div>
        </div>
        
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="speed-meter">
          <div className="meter-bar"></div>
        </div>

        <p className="loading-text">Preparing your test...</p>
      </div>
    </div>
  )
}

export default LoadingStarter
