import React, { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { DailyTasksButton } from './DailyTasksButton'
import { DailyTasksPanel } from './DailyTasksPanel'
import { BeatPopup } from './BeatPopup'
import { TaskToasts } from './TaskToasts'
import { SampleText } from './SampleText'
import { TypingTextarea } from './TypingTextarea'
import { StatsDisplay } from './StatsDisplay'
import { KeyboardHeatmap } from './KeyboardHeatmap'
import { KEYBOARD_ROWS } from '../constants/keyboard'

export const TypingInterface = ({
  isDark,
  theme,
  level,
  sampleText,
  input,
  timeElapsed,
  isFinished,
  keyStats,
  wpm,
  accuracy,
  highestWPM,
  streak,
  dailyTasks,
  completedCount,
  taskToasts,
  showBeatPopup,
  previousHighestWPM,
  newWPM,
  textareaRef,
  toggleTheme,
  onKeyDown,
  onChange,
  onReset,
  onBeatPopupClose,
}) => {
  const [showTasksPanel, setShowTasksPanel] = useState(false)

  return (
    <div className={`min-h-screen ${theme.pageBg} flex items-center justify-center p-6 transition-colors duration-300`}>
      {showBeatPopup && (
        <BeatPopup
          theme={theme}
          isDark={isDark}
          previousHighestWPM={previousHighestWPM}
          newWPM={newWPM}
          onClose={onBeatPopupClose}
        />
      )}
      <TaskToasts isDark={isDark} taskToasts={taskToasts} />
      <div className='w-full max-w-2xl'>
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-lg overflow-hidden shadow-sm`}>
          <div className={`h-0.5 ${isDark ? 'bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300' : 'bg-gradient-to-r from-indigo-400 via-violet-500 to-indigo-400'}`} />
          <div className='p-8'>
            {/* Top bar */}
            <div className='flex justify-between items-start mb-8'>
              <div>
                <p className={`text-xs tracking-widest ${theme.labelText} uppercase font-mono mb-1`}>
                  Typing Test • <span className={theme.accent}>{level}</span>
                </p>
                <h1 className={`text-2xl font-bold ${theme.headingText} tracking-tight font-mono`}>How fast are you</h1>
                <div className='flex items-center gap-4 mt-2'>
                  {highestWPM > 0 && (
                    <p className={`text-xs tracking-widest ${theme.mutedText} uppercase font-mono`}>
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
                  <div className="relative">
                    <DailyTasksButton
                      isDark={isDark}
                      theme={theme}
                      completedCount={completedCount}
                      totalCount={dailyTasks.length}
                      onClick={() => setShowTasksPanel(p => !p)}
                    />
                    {showTasksPanel && (
                      <DailyTasksPanel
                        isDark={isDark}
                        theme={theme}
                        dailyTasks={dailyTasks}
                        completedCount={completedCount}
                        onClose={() => setShowTasksPanel(false)}
                      />
                    )}
                  </div>
                  <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} theme={theme} />
                </div>
                <div className='text-right'>
                  <div className={`text-4xl font-bold ${theme.accent} font-mono tabular-nums leading-none`}>
                    {timeElapsed.toFixed(1)}s
                  </div>
                  <p className={`text-xs tracking-widest ${theme.labelText} uppercase mt-1`}>elapsed</p>
                </div>
              </div>
            </div>

            {/* Complete banner */}
            {isFinished && (
              <div className={`mb-6 px-4 py-3 ${theme.accentGlow} border rounded text-xs tracking-widest uppercase text-center font-mono ${theme.accentComplete}`}>
                ✓ complete - nice work!
              </div>
            )}

            {/* Sample text */}
            <SampleText theme={theme} sampleText={sampleText} input={input} />

            {/* Input */}
            <TypingTextarea
              ref={textareaRef}
              theme={theme}
              input={input}
              disabled={isFinished}
              onKeyDown={onKeyDown}
              onChange={onChange}
              placeholder='Start to type Here ...'
            />

            {/* Stats */}
            <StatsDisplay theme={theme} wpm={wpm} accuracy={accuracy} charCount={input.length} isFinished={isFinished} />

            {/* Heatmap */}
            <KeyboardHeatmap theme={theme} isDark={isDark} keyboardRows={KEYBOARD_ROWS} keyStats={keyStats} />

            {/* Reset */}
            <button
              onClick={onReset}
              className={`w-full mt-4 py-3 border ${theme.cardBorder} rounded ${theme.labelText} text-xs tracking-widest uppercase font-mono ${theme.accentHover} transition-all`}
            >
              ↺ &nbsp; reset
            </button>

            {/* Progress bar */}
            <div className={`mt-4 h-1 ${theme.progressTrack} rounded-full overflow-hidden`}>
              <div
                className={`h-full ${theme.progressFill} rounded-full transition-all duration-100`}
                style={{ width: `${sampleText.length > 0 ? (input.length / sampleText.length) * 100 : 0}%` }}
              />
            </div>
            <p className={`text-right text-xs ${theme.mutedText} font-mono mt-1`}>
              {input.length}/{sampleText.length} chars
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
