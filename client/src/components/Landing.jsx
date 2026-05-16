import { motion } from 'framer-motion'
import { personalityList } from '../data/personalities'
import useStats from '../hooks/useStats'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const scaleSteps = [
  { val: 1, label: '完全不同意', color: 'bg-slate-600' },
  { val: 2, label: '不同意', color: 'bg-slate-500' },
  { val: 3, label: '中立', color: 'bg-purple-600/60' },
  { val: 4, label: '同意', color: 'bg-purple-500' },
  { val: 5, label: '完全同意', color: 'bg-purple-400' },
]

export default function Landing({ onStart, onStats }) {
  const stats = useStats()

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero */}
      <motion.div variants={item} className="text-center mb-8 sm:mb-10 max-w-lg">
        <motion.div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 mb-5"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          12 种 Meme 人格 · 22 题精准定位
        </motion.div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent shiny-text">
            测测你的游戏人格
          </span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          12 道筛选 + 10 道深度分析 · 每题只需判断你的同意程度
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item}>
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group relative px-12 sm:px-16 py-4 sm:py-4.5 rounded-2xl font-bold overflow-hidden
            bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
            shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40
            transition-shadow duration-300"
        >
          <span className="relative z-10 text-base sm:text-xl tracking-wide">
            开始测试
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
            blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        </motion.button>
      </motion.div>

      {/* Scale preview */}
      <motion.div variants={item} className="mt-8 max-w-sm w-full">
        <p className="text-center text-[10px] text-slate-600 mb-3 uppercase tracking-widest">答题方式</p>
        <div className="flex items-center gap-1">
          {scaleSteps.map((step, i) => (
            <div key={step.val} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${step.color} flex items-center justify-center
                text-[10px] font-mono text-white/80 transition-all`}>
                {step.val}
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-600 text-center leading-tight">
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats badge + Stats link */}
      <motion.div variants={item} className="flex items-center gap-4 mt-6">
        {stats && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
            <span className="text-xs text-slate-500">
              已有 <span className="text-slate-400 font-medium">{stats.total.toLocaleString()}</span> 人完成测试
            </span>
          </div>
        )}
        <button onClick={onStats}
          className="min-h-[44px] px-3 text-xs text-slate-600 hover:text-slate-400 active:text-slate-300 transition-colors underline underline-offset-2 decoration-white/10">
          查看分布统计 →
        </button>
      </motion.div>

      {/* Personality grid */}
      <motion.div variants={item} className="mt-10 sm:mt-12">
        <p className="text-center text-[10px] text-slate-600 mb-4 uppercase tracking-widest">
          12 种人格一览
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2 max-w-lg mx-auto">
          {personalityList.map(p => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.08, y: -2 }}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl cursor-default
                hover:bg-white/[0.04] hover:backdrop-blur-sm transition-all duration-300 group/person"
            >
              <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover/person:scale-110">
                {p.emoji}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-700 group-hover/person:text-slate-500 transition-colors">
                {p.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
