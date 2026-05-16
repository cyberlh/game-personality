import { motion, AnimatePresence } from 'framer-motion'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

export default function Quiz({ question, currentQuestion, totalQuestions, selectedOption, transitioning, onAnswer, onBack, phaseText }) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col px-3 sm:px-4 py-4 sm:py-6">
      {/* Top bar */}
      <div className="max-w-lg mx-auto w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <motion.button
            onClick={onBack}
            disabled={currentQuestion === 0 || transitioning}
            whileHover={currentQuestion > 0 && !transitioning ? { x: -2 } : {}}
            whileTap={currentQuestion > 0 && !transitioning ? { scale: 0.95 } : {}}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              currentQuestion === 0 || transitioning
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            ← 上一题
          </motion.button>
          <motion.span
            className="text-sm text-slate-400"
            key={phaseText}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {phaseText || `${currentQuestion + 1} / ${totalQuestions}`}
          </motion.span>
          <div className="w-14" />
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
