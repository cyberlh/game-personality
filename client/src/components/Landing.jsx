import { personalityList } from '../data/personalities'
import useStats from '../hooks/useStats'

export default function Landing({ onStart }) {
  const stats = useStats()

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            测测你的游戏人格
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl">
          20 道趣味问答 · 12 种 Meme 人格 · 找到你的专属玩家标签
        </p>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="group relative px-10 py-4 rounded-2xl text-xl font-bold
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:from-purple-500 hover:to-blue-500
          transition-all duration-300 hover:scale-105
          shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50"
      >
        <span className="relative z-10">开始测试</span>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600
          blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
      </button>

      {/* Personality preview grid */}
      <div className="mt-12 grid grid-cols-4 md:grid-cols-6 gap-4 max-w-2xl">
        {personalityList.map(p => (
          <div key={p.id} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-2xl">{p.emoji}</span>
            <span className="text-xs text-slate-500">{p.name}</span>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-600">
        已有 {stats ? stats.total.toLocaleString() : '...'} 人完成测试
      </p>
    </div>
  )
}
