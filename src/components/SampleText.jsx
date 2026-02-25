import React from 'react'

export const SampleText = ({ theme, sampleText, input }) => {
  const renderSample = () => {
    return sampleText.split('').map((char, i) => {
      let cls = theme.mutedText
      if (i < input.length) {
        cls = input[i] === char ? theme.typedCorrect : `text-red-400 rounded-sm`
      } else if (i === input.length) {
        cls = `${theme.mutedText} border-l-2 ${theme.cursor} animate-pulse`
      }
      return <span key={i} className={cls}>{char}</span>
    })
  }

  return (
    <div className={`${theme.innerBg} border ${theme.innerBorder} rounded p-5 mb-4 font-mono text-xl leading-loose tracking-wide select-none`}>
      {renderSample()}
    </div>
  )
}
