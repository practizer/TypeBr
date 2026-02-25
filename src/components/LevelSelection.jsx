import React, { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { DailyTasksButton } from './DailyTasksButton'
import { DailyTasksPanel } from './DailyTasksPanel'
import { BeatPopup } from './BeatPopup'
import { TaskToasts } from './TaskToasts'

export const LevelSelection = ({
  isDark,
  theme,
  highestWPM,
  streak,
  dailyTasks,
  completedCount,
  taskToasts,
  showBeatPopup,
  previousHighestWPM,
  newWPM,
  toggleTheme,
  onLevelSelect,
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
            <div className='flex justify-end gap-2 mb-4'>
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
            <div className='text-center mb-8'>
              <p className={`text-xs tracking-widest ${theme.labelText} uppercase font-mono mb-2`}>Typing Test</p>
              <h1 className={`text-3xl font-bold ${theme.headingText} tracking-tight font-mono mb-2`}>Choose Your Level</h1>
              <p className={`${theme.labelText} text-sm font-mono`}>Select a difficulty level to start testing your typing speed</p>
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
                  onClick={() => onLevelSelect(key)}
                  className={`p-6 ${theme.innerBg} border-2 ${theme.innerBorder} rounded-lg ${hoverBorder} ${hoverBg} transition-all group`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='text-left'>
                      <h3 className={`text-xl font-bold ${theme.headingText} font-mono ${hoverText} transition-colors`}>{label}</h3>
                      <p className={`${theme.labelText} text-sm font-mono mt-1`}>{desc}</p>
                    </div>
                    <div className={`${theme.mutedText} group-hover:text-zinc-400 transition-colors text-2xl`}>→</div>
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
