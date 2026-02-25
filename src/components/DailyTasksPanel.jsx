import React from 'react'

export const DailyTasksPanel = ({ isDark, theme, dailyTasks, completedCount, onClose }) => {
  const totalCount = dailyTasks.length
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div
      className={`absolute right-0 top-full mt-2 w-72 z-40 ${theme.cardBg} border ${theme.cardBorder} rounded-lg shadow-xl overflow-hidden`}
      style={{ boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.12)' }}
    >
      {/* header */}
      <div className={`px-4 py-3 border-b ${theme.cardBorder} flex items-center justify-between`}>
        <div>
          <p className={`text-xs tracking-widest uppercase font-mono ${theme.labelText}`}>Today's Goals</p>
          <p className={`text-sm font-bold font-mono ${theme.headingText} mt-0.5`}>
            {completedCount}/{totalCount} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke={isDark ? '#27272a' : '#e2e8f0'} strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={isDark ? '#fde047' : '#6366f1'}
                strokeWidth="3"
                strokeDasharray={`${(completionPercentage / 100) * 94.25} 94.25`}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute text-xs font-bold font-mono ${theme.accent}`}>
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close daily tasks"
            className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center transition-colors ${
              isDark
                ? 'border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500'
                : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-400'
            }`}
          >
            ✕
          </button>
        </div>
      </div>

      {/* task list */}
      <div className="p-3 space-y-2">
        {dailyTasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              task.done
                ? isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
                : `${theme.innerBg} border ${theme.innerBorder}`
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              task.done
                ? 'bg-green-500 border-green-500'
                : isDark ? 'border-zinc-600' : 'border-slate-300'
            }`}>
              {task.done && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className={`text-xs font-mono flex-1 ${
              task.done
                ? 'line-through ' + (isDark ? 'text-zinc-500' : 'text-slate-400')
                : theme.bodyText
            }`}>
              {task.text}
            </span>
            {task.done && <span className="text-xs">🎯</span>}
          </div>
        ))}
      </div>

      {completedCount === totalCount && (
        <div className={`mx-3 mb-3 px-3 py-2 rounded-lg text-center text-xs font-mono font-bold ${
          isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          🎉 All done! Come back tomorrow
        </div>
      )}
    </div>
  )
}
