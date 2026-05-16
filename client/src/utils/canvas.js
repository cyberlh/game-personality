const FONT = '"PingFang SC", "Microsoft YaHei", sans-serif'

function drawRadarMini(ctx, cx, cy, size, scores, maxScore) {
  const TYPES = ['shouku', 'tianliang', 'saibo', 'tianti', 'chanxian', 'fangkuai', 'yuyin', 'liusiBa', 'laoliu', 'gandi', 'laoe', 'cangshu']
  const n = TYPES.length
  const r = size / 2

  function p(r2, a) {
    return { x: cx + r2 * Math.cos(a - Math.PI / 2), y: cy + r2 * Math.sin(a - Math.PI / 2) }
  }

  for (let lv = 1; lv <= 3; lv++) {
    ctx.beginPath()
    for (let i = 0; i <= n; i++) {
      const pt = p((r * lv) / 3, (2 * Math.PI * (i % n)) / n)
      i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ctx.beginPath()
  for (let i = 0; i <= n; i++) {
    const s = Math.min(scores[TYPES[i % n]] || 0, maxScore)
    const pt = p((s / maxScore) * r, (2 * Math.PI * (i % n)) / n)
    i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(168, 85, 247, 0.12)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

export function drawShareCard(canvas, personality, scores, secondary) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const isLong = h > w
  const S = w / 1080

  ctx.textAlign = 'center'

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#0a0a1a')
  bg.addColorStop(1, '#14143a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Glow
  const g = ctx.createRadialGradient(w / 2, h * 0.28, 0, w / 2, h * 0.28, w * 0.45)
  g.addColorStop(0, 'rgba(168, 85, 247, 0.06)')
  g.addColorStop(1, 'rgba(168, 85, 247, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // ===== Emoji =====
  ctx.font = `${110 * S}px sans-serif`
  const emojiY = h * (isLong ? 0.09 : 0.10)
  ctx.fillText(personality.emoji, w / 2, emojiY)

  // ===== Name =====
  let nameText = personality.name
  if (secondary) nameText += ' × ' + secondary.name
  ctx.fillStyle = personality.color
  ctx.font = `bold ${78 * S}px ${FONT}`
  const nameY = emojiY + 68 * S
  ctx.fillText(nameText, w / 2, nameY)

  // ===== Tagline =====
  ctx.fillStyle = '#94a3b8'
  ctx.font = `${40 * S}px ${FONT}`
  const taglineY = nameY + 44 * S
  ctx.fillText(`"${personality.tagline}"`, w / 2, taglineY)

  // ===== Radar =====
  const radarSize = w * (isLong ? 0.40 : 0.44)
  const radarY = taglineY + 16 * S
  drawRadarMini(ctx, w / 2, radarY + radarSize / 2, radarSize, scores, 30)

  // ===== Games =====
  const gamesY = radarY + radarSize + 26 * S
  ctx.fillStyle = '#64748b'
  ctx.font = `${30 * S}px ${FONT}`
  ctx.fillText('推荐游戏', w / 2, gamesY)

  const games = secondary
    ? [...personality.games.slice(0, 3), ...secondary.games.slice(0, 2)]
    : personality.games.slice(0, 4)

  // Draw game tags
  ctx.font = `${28 * S}px ${FONT}`
  const tagH = 40 * S
  const tagGap = 10 * S
  const maxTagW = w * 0.48

  const tagData = games.map(g => ({
    name: g,
    w: Math.min(ctx.measureText(g).width + 32 * S, maxTagW),
  }))

  // Arrange into centered rows
  const rows = []
  let row = []
  let rowW = 0
  for (const t of tagData) {
    if (rowW + t.w + (row.length ? tagGap : 0) > w * 0.72 && row.length) {
      rows.push(row)
      row = [t]
      rowW = t.w
    } else {
      row.push(t)
      rowW += t.w + (row.length > 1 ? tagGap : 0)
    }
  }
  if (row.length) rows.push(row)

  const tagStartY = gamesY + 10 * S
  rows.forEach((r, ri) => {
    const totalW = r.reduce((s, t) => s + t.w + tagGap, 0) - tagGap
    let x = w / 2 - totalW / 2
    const y = tagStartY + ri * (tagH + 10 * S)
    r.forEach(t => {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.08)'
      ctx.beginPath()
      ctx.roundRect(x, y, t.w, tagH, tagH / 2)
      ctx.fill()
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText(t.name, x + t.w / 2, y + tagH - 11 * S)
      x += t.w + tagGap
    })
  })

  const bottomY = tagStartY + rows.length * (tagH + 10 * S) + 24 * S

  // ===== Footer =====
  ctx.fillStyle = 'rgba(51, 65, 85, 0.35)'
  ctx.font = `${22 * S}px ${FONT}`
  ctx.fillText('游戏人格测试 · 来测测你的专属玩家标签', w / 2, Math.max(bottomY, h - 36 * S))
}
