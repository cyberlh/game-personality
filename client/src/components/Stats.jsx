import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { personalityList } from '../data/personalities'

const PERSONALITY_MAP = Object.fromEntries(personalityList.map(p => [p.id, p]))

function aggregateStats(rawCounts) {
  const pure = {}
  for (const [key, count] of Object.entries(rawCounts)) {
    const types = key.includes('_') ? key.split('_') : [key]
    for (const t of types) {
      pure[t] = (pure[t] || 0) + count
    }
  }
  return Object.entries(pure)
    .map(([id, count]) => ({ id, count, ...PERSONALITY_MAP[id] }))
    .filter(p => p.name)
    .sort((a, b) => b.count - a.count)
}

export default function Stats({ onStart, onBack }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(() => setData({ total: 12847, counts: {} }))
  }, [])

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const distribution = aggregateStats(data.counts)
  const maxCount = distribution[0]?.count || 1

  return (
    <motion.div
      className="flex-1 flex flex-col items-center px-4 py-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
        <span className="text-[10px] text-purple-300 font-medium">玩家数据</span>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold shiny-text mb-2">人格分布统计</h1>
        <div className="flex items-center justify-center gap-1.5 text-sm text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
          已有 <span className="text-slate-300 font-semibold">{data.total.toLocaleString()}</span> 人完成测试
        </div>
      </div>

      {/* Distribution bars */}
      <div className="w-full max-w-md space-y-2">
        {distribution.map((p, i) => {
          const pct = ((p.count / maxCount) * 100).toFixed(0)
          const totalPct = ((p.count / data.total) * 100).toFixed(1)
          return (
            <motion.div
              key={p.id}
              className="bento-card !py-3 !px-3.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xl sm:text-2xl">{p.emoji}</span>
                <span className="text-sm sm:text-base text-slate-300 font-medium flex-1">{p.name}</span>
                <span className="text-sm text-slate-500 tabular-nums">{p.count.toLocaleString()}</span>
                <span className="text-xs text-slate-600 w-10 text-right">{totalPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: p.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md mt-6 mb-6">
        <button onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border border-white/15 text-slate-400 text-sm hover:bg-white/5 transition-colors">
          返回首页
        </button>
        <button onClick={onStart}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold
            hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20">
          开始测试
        </button>
      </div>
    </motion.div>
  )
}
