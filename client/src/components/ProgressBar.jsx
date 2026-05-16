import { motion } from 'framer-motion'

export default function ProgressBar({ current, total, phaseText }) {
  const pct = Math.min(100, ((current) / (total - 1)) * 100)
  const screeningEnd = 12  // matches SCREENING_COUNT
  const screeningPct = (screeningEnd / total) * 100
  const isScreening = current < screeningEnd

  return (
    <div className="relative">
      {/* Phase labels + count */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors duration-300 ${isScreening ? 'text-purple-400' : 'text-slate-600'}`}>
            筛选
          </span>
          <span className="text-[10px] text-slate-600">
            {isScreening ? `${current + 1}/${screeningEnd}` : screeningEnd}
          </span>
        </div>
        <span className="text-[10px] text-slate-600 tabular-nums">
          {current + 1}/{total}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors duration-300 ${!isScreening ? 'text-blue-400' : 'text-slate-600'}`}>
            深入
          </span>
          <span className="text-[10px] text-slate-600">
            {!isScreening ? `${current + 1 - screeningEnd}/${total - screeningEnd}` : total - screeningEnd}
          </span>
        </div>
      </div>

      {/* Segmented track */}
      <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden relative">
        {/* Screening zone marker */}
        <div
          className="absolute inset-y-0 left-0 rounded-l-full border-r border-white/10 bg-white/[0.02]"
          style={{ width: `${screeningPct}%` }}
        />
        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: isScreening
              ? 'linear-gradient(90deg, #a855f7, #c084fc)'
              : 'linear-gradient(90deg, #a855f7, #3b82f6, #06b6d4)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s linear infinite',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Glow tip */}
        <motion.div
          className="absolute inset-y-0 w-2 bg-white/40 blur-[2px] rounded-full"
          initial={{ left: 0 }}
          animate={{ left: `calc(${pct}% - 4px)` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}
