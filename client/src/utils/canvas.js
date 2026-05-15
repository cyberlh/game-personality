export function drawShareCard(canvas, personality, scores, secondary) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, h)
  gradient.addColorStop(0, '#0f0f23')
  gradient.addColorStop(1, '#1a1a3e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  // Decorative circles
  ctx.fillStyle = 'rgba(168, 85, 247, 0.05)'
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.3, 300, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(59, 130, 246, 0.04)'
  ctx.beginPath()
  ctx.arc(w * 0.3, h * 0.6, 200, 0, Math.PI * 2)
  ctx.fill()

  // Title
  ctx.fillStyle = '#94a3b8'
  ctx.font = '36px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('我的游戏人格', w / 2, 150)

  // Emoji
  ctx.font = '140px sans-serif'
  ctx.fillText(personality.emoji, w / 2, 320)

  // Name
  ctx.fillStyle = personality.color
  ctx.font = 'bold 64px "PingFang SC", "Microsoft YaHei", sans-serif'
  let nameText = personality.name
  if (secondary) {
    nameText += ' × ' + secondary.name
  }
  ctx.fillText(nameText, w / 2, 410)

  // Tagline
  ctx.fillStyle = '#94a3b8'
  ctx.font = '28px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(`"${personality.tagline}"`, w / 2, 480)

  // Recommended games
  ctx.fillStyle = '#64748b'
  ctx.font = '24px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('推荐游戏', w / 2, 560)
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif'
  const games = secondary
    ? [...personality.games.slice(0, 4), ...secondary.games.slice(0, 2)]
    : personality.games
  games.forEach((game, i) => {
    ctx.fillText(game, w / 2, 600 + i * 40)
  })

  // Footer
  ctx.fillStyle = '#334155'
  ctx.font = '18px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('游戏人格测试 · 来测测你的玩家标签', w / 2, h - 60)
}
