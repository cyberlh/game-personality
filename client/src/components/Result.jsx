import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import RadarChart from './RadarChart'
import ShareCard from './ShareCard'
import Confetti from './Confetti'
import { getPersonality } from '../data/personalities'

const cardItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

export default function Result({ result, onRestart }) {
  const [showShare, setShowShare] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  useEffect(() => {
    if (result && !celebrated) setCelebrated(true)
  }, [result, celebrated])

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500">分析结果中...</p>
        </div>
      </div>
    )
  }

  const { resultType, scores } = result
  const isHybrid = resultType.includes('_')
  const types = isHybrid ? resultType.split('_') : [resultType]
  const personalities = types.map(t => getPersonality(t)).filter(Boolean)

  if (personalities.length === 0) return null

  const primary = personalities[0]
  const secondary = personalities[1]
  const accentColor = primary.color

  return (
    <motion.div
      className="flex-1 flex flex-col items-center px-4 py-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Confetti active={celebrated} />

      {/* Result badge */}
      <motion.div variants={cardItem} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
        <span className="text-[11px] sm:text-xs text-purple-300 font-medium">测试完成</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={cardItem} className="text-center mb-5">
        <p className="text-slate-500 text-xs mb-1.5 tracking-wider uppercase">你的游戏人格是</p>
        <div className="text-4xl sm:text-5xl mb-2">
          {primary.emoji}{secondary ? ` ${secondary.emoji}` : ''}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold shiny-text" style={{ color: 'transparent' }}>
          {primary.name}{secondary ? ` × ${secondary.name}` : ''}
        </h1>
        {isHybrid && <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">混合型人格 — 两种特质并存</p>}
        <p className="text-sm text-slate-400 italic mt-2">"{primary.tagline}"</p>
      </motion.div>

      {/* Description */}
      <motion.div variants={cardItem} className="bento-card max-w-md w-full mb-3">
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{primary.description}</p>
      </motion.div>

      {secondary && (
        <motion.div variants={cardItem} className="bento-card max-w-md w-full mb-3">
          <span className="font-semibold text-xs sm:text-sm mr-1" style={{ color: secondary.color }}>
            {secondary.emoji} {secondary.name}
          </span>
          <span className="text-xs sm:text-sm text-slate-400 italic">"{secondary.tagline}"</span>
        </motion.div>
      )}

      {/* Radar */}
      <motion.div variants={cardItem} className="bento-card w-full max-w-[280px] sm:max-w-[320px] flex justify-center mb-3">
        <RadarChart scores={scores} />
      </motion.div>

      {/* Strengths & Weaknesses */}
      <motion.div variants={cardItem} className="grid grid-cols-2 gap-2 w-full max-w-md mb-3">
        <div className="bento-card">
          <h3 className="text-[11px] sm:text-xs text-green-400/70 mb-2 font-semibold uppercase tracking-wide">优势</h3>
          <ul className="space-y-1.5">
            {[...primary.strengths, ...(secondary?.strengths.slice(0, 2) || [])].map(s => (
              <li key={s} className="text-xs sm:text-sm text-slate-400 flex items-start gap-1.5">
                <span className="text-green-400/50 flex-shrink-0 mt-0.5">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bento-card">
          <h3 className="text-[11px] sm:text-xs text-red-400/70 mb-2 font-semibold uppercase tracking-wide">注意</h3>
          <ul className="space-y-1.5">
            {primary.weaknesses.map(w => (
              <li key={w} className="text-xs sm:text-sm text-slate-500 flex items-start gap-1.5">
                <span className="text-red-400/50 flex-shrink-0 mt-0.5">~</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Games */}
      <motion.div variants={cardItem} className="bento-card max-w-md w-full mb-5">
        <h3 className="text-[11px] sm:text-xs text-slate-600 uppercase tracking-wide mb-2.5 font-semibold">推荐游戏</h3>
        <div className="flex flex-wrap gap-1.5">
          {[...primary.games.slice(0, 4), ...(secondary?.games.slice(0, 2) || [])].map(game => (
            <span
              key={game}
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-400 border transition-all duration-300 hover:scale-105 cursor-default"
              style={{
                borderColor: `${accentColor}22`,
                backgroundColor: `${accentColor}0A`,
              }}
            >
              {game}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={cardItem} className="flex flex-col sm:flex-row gap-2 w-full max-w-md mb-6">
        <button onClick={onRestart}
          className="flex-1 py-2.5 rounded-xl border border-white/15 text-slate-400 text-sm hover:bg-white/5 transition-colors">
          重新测试
        </button>
        <button onClick={() => setShowShare(!showShare)}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20">
          {showShare ? '收起分享' : '分享结果'}
        </button>
      </motion.div>

      {/* Share */}
      {showShare && (
        <motion.div
          className="w-full max-w-sm mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShareCard personality={primary} scores={scores} secondary={secondary} />
        </motion.div>
      )}
    </motion.div>
  )
}
