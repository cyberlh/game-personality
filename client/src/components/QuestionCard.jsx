import { motion, AnimatePresence } from 'framer-motion'
import LikertScale from './LikertScale'

export default function QuestionCard({ question, selectedOption, onSelect }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        className="w-full max-w-lg mx-auto"
        initial={{ opacity: 0, y: 30, rotateX: -5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, y: -20, rotateX: 5, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="glass-strong rounded-2xl p-5 sm:p-8 mb-4"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Stage badge */}
          <div className="text-center mb-5">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
              question.stage === 'screening'
                ? 'text-purple-300 bg-purple-500/10 border border-purple-500/20'
                : 'text-blue-300 bg-blue-500/10 border border-blue-500/20'
            }`}>
              {question.stage === 'screening' ? '筛选阶段' : '深度分析'}
            </span>
          </div>

          {/* Question statement */}
          <motion.p
            className="text-base sm:text-lg md:text-xl font-bold text-center text-white leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {question.text}
          </motion.p>

          {/* Likert scale */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <LikertScale
              value={selectedOption}
              onChange={onSelect}
              disabled={selectedOption !== null}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
