import { motion } from 'framer-motion'

export default function ProgressBar({ current, total }) {
  const pct = Math.min(100, ((current + 1) / total) * 100)

  return (
    <div className="relative">
      {/* Step dots */}
      <div className="flex justify-between mb-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              i <= current ? 'bg-purple-400 shadow-sm shadow-purple-400/50' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #a855f7, #3b82f6, #06b6d4)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s linear infinite',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}
