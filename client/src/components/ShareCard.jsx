import { useRef, useEffect, useState } from 'react'
import { drawShareCard } from '../utils/canvas'

export default function ShareCard({ personality, scores, secondary }) {
  const canvasRef = useRef(null)
  const [format, setFormat] = useState('square')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 1080
    canvas.height = format === 'moments' ? 1920 : 1080
    drawShareCard(canvas, personality, scores, secondary)
  }, [personality, scores, format, secondary])

  const handleDownload = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `游戏人格_${personality.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4 w-full max-w-sm mx-auto">
      <div className="flex gap-2 justify-center">
        <button onClick={() => setFormat('square')}
          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
            format === 'square' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
          }`}>
          正方形 1:1
        </button>
        <button onClick={() => setFormat('moments')}
          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
            format === 'moments' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
          }`}>
          朋友圈 9:16
        </button>
      </div>
      <canvas ref={canvasRef} className="w-full rounded-xl shadow-2xl" />
      <button
        onClick={handleDownload}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold
          hover:from-purple-500 hover:to-blue-500 transition-colors"
      >
        下载分享图
      </button>
    </div>
  )
}
