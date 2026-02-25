import React from 'react'

export const TaskToasts = ({ isDark, taskToasts }) => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
    {taskToasts.map((toast, i) => (
      <div
        key={toast.id + '-' + i}
        className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-lg font-mono text-sm font-bold border transition-all`}
        style={{
          backgroundColor: isDark ? '#18181b' : '#fff',
          borderColor: isDark ? '#22c55e' : '#16a34a',
          color: isDark ? '#86efac' : '#15803d',
          boxShadow: isDark
            ? '0 0 20px rgba(34,197,94,0.25), 0 4px 20px rgba(0,0,0,0.5)'
            : '0 4px 20px rgba(0,0,0,0.12)',
          animation: 'slideDown 0.3s ease',
        }}
      >
        <span className="text-base">✅</span>
        <span>Task done: <span className={isDark ? 'text-green-300' : 'text-green-700'}>{toast.text}</span></span>
      </div>
    ))}
    <style>{`
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
)
