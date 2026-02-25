export const DEFAULT_DAILY_TASKS = [
  { id: 1, text: "Complete a typing test", done: false, check: (wpm, acc) => wpm > 0 },
  { id: 2, text: "Type at 40+ WPM", done: false, check: (wpm, acc) => wpm >= 40 },
  { id: 3, text: "Get 90%+ accuracy", done: false, check: (wpm, acc) => acc >= 90 },
  { id: 4, text: "Finish a Hard level test", done: false, level: 'hard', check: (wpm, acc, lvl) => lvl === 'hard' },
  { id: 5, text: "Type at 60+ WPM", done: false, check: (wpm, acc) => wpm >= 60 },
]
