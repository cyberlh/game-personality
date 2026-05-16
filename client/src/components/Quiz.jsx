import { motion, AnimatePresence } from 'framer-motion'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

export default function Quiz({ question, currentQuestion, totalQuestions, selectedOption, transitioning, onAnswer, onBack, phaseText }) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col px-3 sm:px-4 py-4 sm:py-6">
      {/* Top bar */}
      <div className="max-w-lg mx-auto w-full mb-4">
        <div className="flex items-center justify-between mb-3">
          <motion.button
            onClick={onBack}
            disabled={currentQuestion === 0 || transitioning}
            whileHover={currentQuestion > 0 && !transitioning ? { x: -2 } : {}}
            whileTap={currentQuestion > 0 && !transitioning ? { scale: 0.95 } : {}}
            className={`min-h-[44px] px-3 py-2 rounded-lg transition-colors text-sm ${
              currentQuestion === 0 || transitioning
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 active:text-white hover:text-white hover:bg-white/10'
            }`}
          >
            ← 上一题
          </motion.button>
          <motion.span
            className="text-xs text-slate-500"
            key={phaseText}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {phaseText}
          </motion.span>
          <div className="w-[60px]" />
        </div>
        <ProgressBar current={currentQuestion} total={totalQuestions} />
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {question && (
            <QuestionCard
              key={question.id}
              question={question}
              selectedOption={selectedOption}
              onSelect={onAnswer}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
