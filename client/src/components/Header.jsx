export default function Header() {
  return (
    <header className="relative z-10 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎮</span>
          <span className="text-sm font-bold text-slate-400 tracking-wide">
            游戏人格测试
          </span>
        </div>
        <span className="text-xs text-slate-600">v1.0</span>
      </div>
    </header>
  )
}
