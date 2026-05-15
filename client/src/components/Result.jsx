import { useEffect, useState } from 'react'
import RadarChart from './RadarChart'
import ShareCard from './ShareCard'
import { getPersonality } from '../data/personalities'

export default function Result({ result, onRestart }) {
  const [show, setShow] = useState(false)
  const [showShare, setShowShare] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])

  if (!result) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <p className="text-slate-400 text-lg">计算中...</p>
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

  return (
    <div className={`relative z-10 min-h-screen flex flex-col items-center px-4 py-8
      transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

      {/* Result reveal */}
      <div className="text-center mb-6">
        <p className="text-slate-400 mb-2">你的游戏人格是</p>
        <div className="text-6xl mb-3">
          {primary.emoji}{secondary ? ` ${secondary.emoji}` : ''}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: primary.color }}>
          {primary.name}{secondary ? ` × ${secondary.name}` : ''}
        </h1>
        {isHybrid && (
          <p className="text-sm text-slate-500">混合型人格 — 你兼顾两种玩家特质</p>
        )}
        <p className="text-lg text-slate-300 italic mt-2">"{primary.tagline}"</p>
      </div>

      {/* Primary description */}
      <div className="max-w-md text-center mb-4">
        <p className="text-slate-400 leading-relaxed">{primary.description}</p>
      </div>

      {/* Secondary description for hybrid */}
      {secondary && (
        <div className="max-w-md text-center mb-4">
          <div className="text-center mb-2" style={{ color: secondary.color }}>
            <span className="text-2xl mr-1">{secondary.emoji}</span>
            <span className="font-bold">{secondary.name}</span>
          </div>
          <p className="text-slate-400 leading-relaxed">"{secondary.tagline}"</p>
        </div>
      )}

      {/* Radar chart */}
      <div className="mb-6 w-full max-w-sm">
        <RadarChart scores={scores} />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="max-w-md w-full grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-sm text-green-400 mb-2">优势</h3>
          <ul className="space-y-1">
            {primary.strengths.map(s => (
              <li key={s} className="text-sm text-slate-300">✓ {s}</li>
            ))}
            {secondary && secondary.strengths.slice(0, 2).map(s => (
              <li key={s} className="text-sm text-slate-300">✓ {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm text-red-400 mb-2">注意</h3>
          <ul className="space-y-1">
            {primary.weaknesses.map(w => (
              <li key={w} className="text-sm text-slate-400">⚡ {w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended games */}
      <div className="max-w-md w-full mb-8">
        <h3 className="text-sm text-slate-500 uppercase tracking-wide mb-3">推荐游戏</h3>
        <div className="flex flex-wrap gap-2">
          {primary.games.map(game => (
            <span key={game} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
              {game}
            </span>
          ))}
          {secondary && secondary.games.slice(0, 3).map(game => (
            <span key={game} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
              {game}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 transition-colors"
        >
          重新测试
        </button>
        <button
          onClick={() => setShowShare(!showShare)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-colors"
        >
          {showShare ? '收起分享' : '分享结果'}
        </button>
      </div>

      {/* Share card */}
      {showShare && (
        <div className="mb-8 w-full">
          <ShareCard
            personality={primary}
            scores={scores}
            secondary={secondary}
          />
        </div>
      )}
    </div>
  )
}
