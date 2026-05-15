import { useState, useEffect } from 'react'
import OptionCard from './OptionCard'

export default function QuestionCard({ question, selectedOption, onSelect }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [question.id])

  return (
    <div
      className={`
        w-full max-w-lg mx-auto transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <OptionCard
            key={i}
            label={opt.label}
            text={opt.text}
            selected={selectedOption === i}
            onClick={() => onSelect(i)}
            disabled={selectedOption !== null}
          />
        ))}
      </div>
    </div>
  )
}
