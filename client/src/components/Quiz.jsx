import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

export default function Quiz({ question, currentQuestion, totalQuestions, selectedOption, transitioning, onAnswer, onBack }) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col px-4 py-6">
      {/* Top bar */}
      <div className="max-w-lg mx-auto w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            disabled={currentQuestion === 0 || transitioning}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              currentQuestion === 0 || transitioning
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            ← 上一题
          </button>
          <span className="text-sm text-slate-400">
            {currentQuestion + 1} / {totalQuestions}
          </span>
          <div className="w-14" />
        </div>
        <ProgressBar current={currentQuestion} total={totalQuestions} />
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-center justify-center">
        <QuestionCard
          key={question.id}
          question={question}
          selectedOption={selectedOption}
          onSelect={onAnswer}
        />
      </div>
    </div>
  )
}
