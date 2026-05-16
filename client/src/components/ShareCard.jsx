import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      className="space-y-3 w-full max-w-sm mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Format toggle — bigger touch targets */}
      <div className="flex gap-2 justify-center">
        {['square', 'moments'].map(f => (
          <button key={f} onClick={() => setFormat(f)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              format === f
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'glass text-slate-400'
            }`}>
            {f === 'square' ? '正方形 1:1' : '朋友圈 9:16'}
          </button>
        ))}
      </div>

      {/* Canvas preview */}
      <div className="rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10">
        <canvas ref={canvasRef} className="w-full" />
      </div>

      {/* Download button */}
      <button onClick={handleDownload}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold
          hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25">
        下载分享图
      </button>

      {/* Native share */}
      {navigator.share && (
        <button onClick={async () => {
          try {
            const canvas = canvasRef.current
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
            if (blob && navigator.canShare?.({ files: [new File([blob], 'personality.png', { type: 'image/png' })] })) {
              await navigator.share({
                title: '游戏人格测试',
                text: `我的游戏人格是「${personality.name}」${secondary ? ' × ' + secondary.name : ''}，来测测你的！`,
                files: [new File([blob], 'personality.png', { type: 'image/png' })],
              })
            } else {
              await navigator.share({
                title: '游戏人格测试',
                text: `我的游戏人格是「${personality.name}」${secondary ? ' × ' + secondary.name : ''}，来测测你的！\n\nhttps://game-personality.yourdomain.com`,
              })
            }
          } catch (e) {
            if (e.name !== 'AbortError') console.error(e)
          }
        }}
          className="w-full py-3 rounded-xl border border-white/15 text-slate-400 text-sm
            hover:bg-white/5 transition-colors">
          分享到微信 / 朋友圈
        </button>
      )}

      {/* Clipboard fallback */}
      {!navigator.share && (
        <button onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              `我的游戏人格是「${personality.name}」${secondary ? ' × ' + secondary.name : ''}，来测测你的！`
            )
            alert('分享文字已复制到剪贴板 📋')
          } catch { /* ignore */ }
        }}
          className="w-full py-3 rounded-xl border border-white/15 text-slate-400 text-sm
            hover:bg-white/5 transition-colors">
          复制分享文字
        </button>
      )}
    </motion.div>
  )
}
