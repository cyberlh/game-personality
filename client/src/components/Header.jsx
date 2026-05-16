export default function Header() {
  return (
    <header className="relative z-20">
      <div className="mx-3 mt-3 px-4 py-2.5 rounded-2xl glass flex items-center justify-between max-w-lg sm:mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎮</span>
          <span className="text-sm font-bold text-slate-300 tracking-wide">
            游戏人格测试
          </span>
        </div>
        <span className="text-xs text-slate-600 font-mono">v1.0</span>
      </div>
    </header>
  )
}
