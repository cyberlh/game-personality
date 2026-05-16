import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LABELS = ['受苦', '天亮', '赛博', '天梯', '产线', '方块', '语音', '648', '老六', '肝帝', '老鹅', '仓鼠']
const TYPE_KEYS = ['shouku', 'tianliang', 'saibo', 'tianti', 'chanxian', 'fangkuai', 'yuyin', 'liusiBa', 'laoliu', 'gandi', 'laoe', 'cangshu']

export default function RadarChart({ scores, maxScore = 30 }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 400) }, [])

  const size = 240
  const cx = size / 2
  const cy = size / 2
  const radius = 88
  const n = 12

  function polarToCart(r, angle) {
    return {
      x: cx + r * Math.cos(angle - Math.PI / 2),
      y: cy + r * Math.sin(angle - Math.PI / 2),
    }
  }

  const gridRings = [0.3, 0.6, 1].map(level =>
    Array.from({ length: n + 1 }, (_, i) => {
      const p = polarToCart(radius * level, (2 * Math.PI * (i % n)) / n)
      return `${p.x},${p.y}`
    }).join(' ')
  )

  const dataPoints = TYPE_KEYS.map((key, i) => {
    const score = animated ? Math.min(scores[key] || 0, maxScore) : 0
    return polarToCart((score / maxScore) * radius, (2 * Math.PI * i) / n)
  })
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[240px] mx-auto">
      {/* Grid rings — only 3, no radial lines */}
      {gridRings.map((points, i) => (
        <polygon key={i} points={points} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}

      {/* Data polygon — clean fill + stroke, no glow */}
      <motion.polygon
        points={dataPolygon}
        fill="rgba(168,85,247,0.12)"
        stroke="rgba(168,85,247,0.5)"
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Labels — all same subtle color */}
      {LABELS.map((label, i) => {
        const angle = (2 * Math.PI * i) / n
        const p = polarToCart(radius + 18, angle)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(148,163,184,0.6)" fontSize="9" fontFamily='"PingFang SC","Microsoft YaHei",sans-serif'>
            {label}
          </text>
        )
      })}
    </svg>
  )
}
