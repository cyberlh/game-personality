import { motion } from 'framer-motion'
import { personalityList } from '../data/personalities'
import useStats from '../hooks/useStats'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

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
          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 mb-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          12 种 Meme 人格 · 22 题精准定位
        </motion.div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent shiny-text">
            测测你的游戏人格
          </span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          12 道筛选 + 10 道深度分析，每题仅需选择同意程度
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <button
          onClick={onStart}
          className="group relative px-10 sm:px-14 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold overflow-hidden
            bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
            shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
            transition-shadow duration-300"
        >
          <span className="relative z-10 text-base sm:text-xl tracking-wide">
            开始测试
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
            blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
        </button>
      </motion.div>

      {/* How it works */}
      <motion.div variants={item} className="mt-6 flex items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <span className="text-purple-400/60 font-mono text-sm">"</span>
          <span>阅读陈述</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">1</span>
          <span className="text-slate-500 text-[10px]">完全不同意</span>
          <span className="w-12 h-px bg-white/10" />
          <span className="text-slate-500 text-[10px]">完全同意</span>
          <span className="text-slate-500">5</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className="flex items-center gap-1">
          <span>查看结果</span>
          <span className="text-cyan-400/60 font-mono text-sm">"</span>
        </div>
      </motion.div>

      {/* Stats badge */}
      {stats && (
        <motion.div variants={item} className="mt-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
            <span className="text-xs text-slate-500">
              已有 <span className="text-slate-400 font-medium">{stats.total.toLocaleString()}</span> 人完成测试
            </span>
          </div>
        </motion.div>
      )}

      {/* Personality grid */}
      <motion.div variants={item} className="mt-10 sm:mt-12">
        <p className="text-center text-xs text-slate-600 mb-3 tracking-wide uppercase">
          12 种人格预览
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 max-w-lg">
          {personalityList.map(p => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.1, y: -3 }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl opacity-50 hover:opacity-100
                transition-all duration-300 cursor-default hover:bg-white/[0.03]"
            >
              <span className="text-xl sm:text-2xl">{p.emoji}</span>
              <span className="text-[10px] sm:text-xs text-slate-600">{p.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats link */}
      <motion.div variants={item} className="mt-4">
        <button onClick={onStats}
          className="min-h-[44px] px-4 text-xs text-slate-600 hover:text-slate-400 active:text-slate-300 transition-colors underline underline-offset-2 decoration-white/10">
          查看所有人格分布统计 →
        </button>
      </motion.div>
    </motion.div>
  )
}
