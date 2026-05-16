import { motion } from 'framer-motion'

const LEVELS = [
  { value: 1, label: '完全不同意' },
  { value: 2, label: '不同意' },
  { value: 3, label: '中立' },
  { value: 4, label: '同意' },
  { value: 5, label: '完全同意' },
]

export default function LikertScale({ value, onChange, disabled }) {
  return (
    <div className="w-full max-w-md mx-auto px-2">
      {/* End labels */}
      <div className="flex justify-between mb-3">
        <span className="text-[11px] sm:text-xs text-slate-500">完全不同意</span>
        <span className="text-[11px] sm:text-xs text-slate-500">完全同意</span>
      </div>

      {/* Track + Dots */}
      <div className="relative flex items-center justify-between">
        {/* Track line */}
        <div className="absolute left-[10%] right-[10%] h-0.5 bg-white/10 rounded-full" />

        {LEVELS.map((level) => {
          const isSelected = value === level.value
          return (
            <motion.button
              key={level.value}
              onClick={() => !disabled && onChange(level.value)}
              disabled={disabled}
              className="relative z-10 flex flex-col items-center gap-1.5"
              whileHover={disabled ? {} : { scale: 1.08 }}
              whileTap={disabled ? {} : { scale: 0.9 }}
            >
              {/* Dot */}
              <motion.div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center
                  transition-colors duration-200 bg-[#0f0f23]
                  ${isSelected
                    ? 'border-purple-400 shadow-lg shadow-purple-500/25'
                    : 'border-white/15 hover:border-purple-400/40 cursor-pointer'
                  }
                  ${disabled ? 'cursor-default' : ''}
                `}
                animate={isSelected ? { scale: 1.12 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <motion.div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200
                    ${isSelected
                      ? 'bg-purple-400 shadow-sm shadow-purple-400/50'
                      : 'bg-white/15'
                    }
                  `}
                  animate={isSelected ? { scale: 1.3 } : { scale: 1 }}
                />
              </motion.div>

              {/* Number */}
              <span className={`text-[10px] font-mono transition-colors duration-200
                ${isSelected ? 'text-purple-300' : 'text-slate-600'}`}
              >
                {level.value}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Selected label */}
      <div className="h-5 text-center mt-2">
        {value && (
          <motion.span
            className="text-xs text-purple-300"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            key={value}
          >
            {LEVELS.find(l => l.value === value)?.label}
          </motion.span>
        )}
      </div>
    </div>
  )
}
