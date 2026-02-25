import React from 'react'

export const BeatPopup = ({ theme, isDark, previousHighestWPM, newWPM, onClose }) => (
  <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
    <div className={`${theme.cardBg} border-2 ${theme.accentBorder} rounded-lg p-8 text-center max-w-sm`}>
      <div className='text-4xl mb-4'>🎉</div>
      <h2 className={`text-2xl font-bold ${theme.accent} font-mono mb-2`}>NEW RECORD!</h2>
      <p className={`${theme.bodyText} font-mono mb-4`}>You beat your previous best!</p>
      <div className='flex justify-around items-center mb-6'>
        <div className='text-center'>
          <p className={`text-xs tracking-widest ${theme.labelText} uppercase font-mono mb-1`}>Previous Best</p>
          <p className={`text-3xl font-bold ${theme.mutedText} font-mono`}>{previousHighestWPM}</p>
          <p className={`text-xs ${theme.mutedText} font-mono`}>WPM</p>
        </div>
        <div className={`text-2xl ${theme.mutedText}`}>→</div>
        <div className='text-center'>
          <p className={`text-xs tracking-widest ${theme.labelText} uppercase font-mono mb-1`}>New Record</p>
          <p className={`text-3xl font-bold ${theme.accent} font-mono`}>{newWPM}</p>
          <p className={`text-xs ${theme.mutedText} font-mono`}>WPM</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className={`w-full py-2 ${theme.accentBg} ${isDark ? 'text-black' : 'text-white'} font-bold rounded font-mono`}
      >
        AWESOME!
      </button>
    </div>
  </div>
)
