import React from 'react'

export const DailyTasksButton = ({ isDark, theme, completedCount, totalCount, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
      isDark
        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
    }`}
  >
    <span>📋</span>
    <span>Daily Tasks</span>
    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
      completedCount === totalCount
        ? 'bg-green-500 text-white'
        : isDark ? 'bg-yellow-300 text-black' : 'bg-indigo-500 text-white'
    }`}>
      {completedCount}
    </span>
  </button>
)
