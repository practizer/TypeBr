import { useRef } from 'react'

export const useSoundEffects = () => {
  const audioContextRef = useRef(null)

  const playCorrectSound = () => {
    playTone(300, 0.1, 0.1)
  }

  const playWrongSound = () => {
    playTone(800, 0.1, 0.05)
  }

  const playTone = (frequency, duration, volume = 0.3) => {
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || window.webkitAudioContext)()
      if (!audioContextRef.current) {
        audioContextRef.current = audioContext
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  return { playCorrectSound, playWrongSound }
}
