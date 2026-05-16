import { motion } from 'framer-motion'

const labelColors = {
  A: 'from-purple-500 to-purple-700',
  B: 'from-blue-500 to-blue-700',
  C: 'from-cyan-500 to-cyan-700',
  D: 'from-fuchsia-500 to-fuchsia-700',
}

export default function OptionCard({ label, text, selected, onClick, disabled }) {
  const index = (label?.charCodeAt(0) - 65) || 0
  const gradient = labelColors[label] || labelColors.A

  return (
    <motion.button
      layout
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={disabled ? {} : { scale: 1.02, x: 4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`
        relative w-full text-left p-4 rounded-xl transition-all duration-300 overflow-hidden
        ${disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'}
        ${selected
          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
          : 'glass border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <motion.span
          animate={selected ? { scale: 1.15 } : { scale: 1 }}
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
            bg-gradient-to-br ${gradient}
            transition-transform duration-300
          `}
        >
          {label}
        </motion.span>
        <span className="text-sm md:text-base text-slate-200 leading-relaxed pt-1">
          {text}
        </span>
      </div>
      {selected && (
        <motion.div
          layoutId="selectedRing"
          className="absolute inset-0 rounded-xl border-2 border-purple-400/40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  )
}
