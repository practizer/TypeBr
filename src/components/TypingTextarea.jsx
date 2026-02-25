import React, { forwardRef } from 'react'

export const TypingTextarea = forwardRef(({ theme, input, disabled, onKeyDown, onChange, placeholder }, ref) => (
  <textarea
    ref={ref}
    className={`w-full ${theme.innerBg} border ${theme.innerBorder} rounded p-4 font-mono text-lg ${theme.bodyText} ${theme.placeholderCls} resize-none outline-none focus:border-opacity-80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed h-20`}
    value={input}
    onKeyDown={onKeyDown}
    onChange={onChange}
    disabled={disabled}
    placeholder={placeholder}
    spellCheck={false}
    autoComplete='off'
    autoCorrect='off'
    autoCapitalize='off'
  />
))

TypingTextarea.displayName = 'TypingTextarea'
