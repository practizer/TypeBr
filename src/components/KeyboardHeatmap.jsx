import React from 'react'
import { getKeyStats } from '../utils/keyboard'

export const KeyboardHeatmap = ({ theme, isDark, keyboardRows, keyStats }) => (
  <div className={`mt-6 ${theme.innerBg} border ${theme.innerBorder} rounded p-4`}>
    <div className='flex items-center justify-between mb-3'>
      <p className={`text-xs tracking-widest ${theme.labelText} uppercase font-mono`}>Typing Heatmap</p>
      <p className={`text-xs ${theme.mutedText} font-mono`}>more colour = more used, red tint = errors</p>
    </div>
    <div className='space-y-2'>
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className='flex gap-2 justify-center'>
          {row.map((keyLabel) => (
            <div
              key={keyLabel}
              className={`h-10 ${keyLabel === 'Space' ? 'w-48' : 'w-10'} rounded border text-xs font-mono flex items-center justify-center transition-all duration-300`}
              style={getKeyStats(keyLabel, keyStats, isDark)}
            >
              {keyLabel}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)
