export default function OptionCard({ label, text, selected, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-300
        ${selected
          ? 'border-purple-400 bg-purple-500/20 scale-[0.98] shadow-lg shadow-purple-500/20'
          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:scale-[1.01]'
        }
        ${disabled && !selected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full
        bg-white/10 text-sm font-bold mr-3">
        {label}
      </span>
      <span className="text-slate-300">{text}</span>
    </button>
  )
}
