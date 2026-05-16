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
        <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-4">
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
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
