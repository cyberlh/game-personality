import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

const LABELS = ['受苦', '天亮', '赛博', '天梯', '产线', '方块', '语音', '648', '老六', '肝帝', '老鹅', '仓鼠']
const TYPE_KEYS = ['shouku', 'tianliang', 'saibo', 'tianti', 'chanxian', 'fangkuai', 'yuyin', 'liusiBa', 'laoliu', 'gandi', 'laoe', 'cangshu']

function polarToCart(cx, cy, r, angle) {
  return {
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  }
}

export default function RadarChart({ scores }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 400) }, [])

  // Fixed scale: outer ring = 8. Scores above 8 overflow (rare).
  const displayMax = 8
  const overflows = useMemo(
    () => (animated ? TYPE_KEYS.filter(k => (scores[k] || 0) > displayMax) : []),
    [scores, animated]
  )

  const size = 320
  const cx = size / 2
  const cy = size / 2
  const radius = 108
  const n = 12

  const gridLevels = [0.25, 0.5, 0.75, 1]

  const gridRings = gridLevels.map(level =>
    Array.from({ length: n + 1 }, (_, i) => {
      const p = polarToCart(cx, cy, radius * level, (2 * Math.PI * (i % n)) / n)
      return `${p.x},${p.y}`
    }).join(' ')
  )

  const axes = Array.from({ length: n }, (_, i) => {
    const outer = polarToCart(cx, cy, radius, (2 * Math.PI * i) / n)
    return { x1: cx, y1: cy, x2: outer.x, y2: outer.y }
  })

  const dataPoints = TYPE_KEYS.map((key, i) => {
    const score = animated ? (scores[key] || 0) : 0
    // Allow overflow: score can exceed displayMax
    const r = (score / displayMax) * radius
    return { ...polarToCart(cx, cy, r, (2 * Math.PI * i) / n), score, key }
  })
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[300px] sm:max-w-[320px] mx-auto overflow-visible"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
        </linearGradient>
        {/* Glow filter for overflow points */}
        <filter id="overflowGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid rings */}
      {gridRings.map((points, i) => {
        const isOuter = i === gridRings.length - 1
        return (
          <polygon
            key={`ring-${i}`}
            points={points}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={isOuter ? 1 : 0.5}
            strokeDasharray={isOuter ? undefined : '3 3'}
          />
        )
      })}

      {/* Radial axes */}
      {axes.map((ax, i) => (
        <line
          key={`ax-${i}`}
          x1={ax.x1} y1={ax.y1} x2={ax.x2} y2={ax.y2}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="0.5"
        />
      ))}

      {/* Outer ring reference label */}
      <text
        x={cx} y={cy + 4}
        textAnchor="middle" dominantBaseline="middle"
        fill="rgba(148,163,184,0.2)" fontSize="11" fontFamily="monospace"
      >
        {displayMax}
      </text>

      {/* Data area */}
      <motion.polygon
        points={dataPolygon}
        fill="url(#radarFill)"
        stroke="url(#radarStroke)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Data points — overflow ones get glow + ring */}
      {dataPoints.map((dp, i) => {
        const isOverflow = overflows.includes(dp.key)
        return (
          <g key={`dp-${i}`}>
            {isOverflow && (
              <motion.circle
                cx={dp.x} cy={dp.y} r={8}
                fill="none" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.03, duration: 0.3 }}
              />
            )}
            <motion.circle
              cx={dp.x} cy={dp.y}
              r={isOverflow ? 5 : 3}
              fill={isOverflow ? '#e9d5ff' : 'rgba(168,85,247,0.85)'}
              filter={isOverflow ? 'url(#overflowGlow)' : undefined}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.03, duration: 0.3 }}
            />
          </g>
        )
      })}

      {/* Labels */}
      {LABELS.map((label, i) => {
        const angle = (2 * Math.PI * i) / n
        const p = polarToCart(cx, cy, radius + 18, angle)
        return (
          <text
            key={`lbl-${i}`}
            x={p.x} y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(148,163,184,0.5)"
            fontSize="11"
            fontFamily='"PingFang SC","Microsoft YaHei",sans-serif'
          >
            {label}
          </text>
        )
      })}
    </motion.svg>
  )
}
