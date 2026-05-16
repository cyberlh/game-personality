import { motion, AnimatePresence } from 'framer-motion'
import OptionCard from './OptionCard'

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
        <div className="glass-strong rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4">
          <motion.h2
            className="text-xl md:text-2xl font-bold mb-6 text-center text-white leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {question.text}
          </motion.h2>

          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
          >
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
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
