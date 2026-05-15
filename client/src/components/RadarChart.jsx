import { useEffect, useState } from 'react'

const LABELS = ['受苦', '天亮', '赛博', '天梯', '产线', '方块', '语音', '648', '老六', '肝帝', '老鹅', '仓鼠']
const TYPE_KEYS = ['shouku', 'tianliang', 'saibo', 'tianti', 'chanxian', 'fangkuai', 'yuyin', 'liusiBa', 'laoliu', 'gandi', 'laoe', 'cangshu']
const COLORS = ['#C41E3A', '#FFD700', '#00D4AA', '#FF3366', '#00BFFF', '#FF6B35', '#FF69B4', '#9B59B6', '#95A5A6', '#E67E22', '#87CEEB', '#F39C12']

export default function RadarChart({ scores, maxScore = 30 }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 500) }, [])

  const size = 300
  const cx = size / 2
  const cy = size / 2
  const radius = 105
  const n = 12

  function polarToCart(r, angle) {
    return {
      x: cx + r * Math.cos(angle - Math.PI / 2),
      y: cy + r * Math.sin(angle - Math.PI / 2)
    }
  }

  const gridPolygons = [0.2, 0.4, 0.6, 0.8, 1].map(level =>
    Array.from({ length: n }, (_, i) => {
      const p = polarToCart(radius * level, (2 * Math.PI * i) / n)
      return `${p.x},${p.y}`
    }).join(' ')
  )

  const dataPoints = TYPE_KEYS.map((key, i) => {
    const score = animated ? Math.min(scores[key] || 0, maxScore) : 0
    return polarToCart((score / maxScore) * radius, (2 * Math.PI * i) / n)
  })
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm mx-auto">
      {gridPolygons.map((points, i) => (
        <polygon key={i} points={points} fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const p = polarToCart(radius, (2 * Math.PI * i) / n)
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        )
      })}
      <polygon
        points={dataPolygon}
        fill="rgba(168,85,247,0.15)"
        stroke="rgba(168,85,247,0.5)"
        strokeWidth="2"
        style={{ transition: 'all 1s ease-out' }}
      />
      {LABELS.map((label, i) => {
        const angle = (2 * Math.PI * i) / n
        const p = polarToCart(radius + 22, angle)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={COLORS[i]} fontSize="10" fontWeight="bold">
            {label}
          </text>
        )
      })}
    </svg>
  )
}
