import React from 'react'

export const StatsDisplay = ({ theme, wpm, accuracy, charCount, isFinished }) => (
  <div className='grid grid-cols-3 gap-3 mt-4'>
    {[
      { label: 'WPM', value: wpm, highlight: isFinished },
      { label: 'Accuracy', value: `${accuracy}%` },
      { label: 'Chars', value: charCount },
    ].map(({ label, value, highlight }) => (
      <div key={label} className={`${theme.innerBg} border ${theme.innerBorder} rounded p-4 text-center`}>
        <div className={`font-mono text-3xl font-bold leading-none tabular-nums ${highlight ? theme.accent : theme.headingText}`}>
          {value}
        </div>
        <p className={`text-xs tracking-widest ${theme.labelText} uppercase mt-2 font-mono`}>{label}</p>
      </div>
    ))}
  </div>
)
