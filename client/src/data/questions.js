export const CLUSTERS = {
  challenge: { name: '挑战/硬核', types: ['shouku', 'tianti'] },
  strategy: { name: '策略/规划', types: ['tianliang', 'chanxian'] },
  explore: { name: '探索/建造', types: ['saibo', 'fangkuai'] },
  social: { name: '社交/语音', types: ['yuyin', 'laoliu'] },
  collect: { name: '收集/消费', types: ['liusiBa', 'cangshu', 'gandi'] },
  casual: { name: '休闲/佛系', types: ['laoe'] },
}

// Likert scale: 1=完全不同意 → 5=完全同意
// Score = base_score × (value - 1) / 4
export const questions = [
  // ===== Phase 1: Screening (2 per cluster = 12) =====

  // --- 挑战/硬核 ---
  {
    id: 1, stage: 'screening',
    text: '我享受挑战高难度的游戏内容，越难越过瘾。',
    scores: { shouku: 3, tianti: 1 },
  },
  {
    id: 2, stage: 'screening',
    text: '和别的玩家比排名、争名次，这种竞争让我充满动力。',
    scores: { tianti: 3, shouku: 1 },
  },

  // --- 策略/规划 ---
  {
    id: 3, stage: 'screening',
    text: '面对复杂局面，我喜欢先想清楚每一步再动手。',
    scores: { tianliang: 3, chanxian: 1 },
  },
  {
    id: 4, stage: 'screening',
    text: '复杂的系统规则不会吓退我，反而会勾起我的钻研欲。',
    scores: { chanxian: 3, tianliang: 1 },
  },

  // --- 探索/建造 ---
  {
    id: 5, stage: 'screening',
    text: '游戏里那些没人去过的地方，总能勾住我的好奇心。',
    scores: { saibo: 3, fangkuai: 1 },
  },
  {
    id: 6, stage: 'screening',
    text: '比起走别人设计好的路线，我更享受亲手创造和改造的自由。',
    scores: { fangkuai: 3, saibo: 1 },
  },

  // --- 社交/语音 ---
  {
    id: 7, stage: 'screening',
    text: '没人一起玩的时候我会觉得差点意思，总想拉人上线。',
    scores: { yuyin: 3, laoliu: 1 },
  },
  {
    id: 8, stage: 'screening',
    text: '我享受在暗中观察局势变化、在最合适的时机才出手的感觉。',
    scores: { laoliu: 3, yuyin: 1 },
  },

  // --- 收集/消费 ---
  {
    id: 9, stage: 'screening',
    text: '看到「可收集」这三个字我就会忍不住点进去看看。',
    scores: { liusiBa: 3, cangshu: 1 },
  },
  {
    id: 10, stage: 'screening',
    text: '我愿意每天按时上线、慢慢积累，日积月累的成长让我踏实。',
    scores: { gandi: 3, liusiBa: 1 },
  },

  // --- 休闲/佛系 ---
  {
    id: 11, stage: 'screening',
    text: '打游戏对我来说最重要的是放松，不想费太多脑子。',
    scores: { laoe: 3, cangshu: 1 },
  },
  {
    id: 12, stage: 'screening',
    text: '我不需要游戏来证明什么，生活里已经有够多的压力了。',
    scores: { laoe: 3, shouku: 1 },
  },

  // ===== Phase 2: Focused (5 per cluster = 30) =====

  // --- 挑战/硬核 (shouku vs tianti) ---
  {
    id: 13, stage: 'focused', cluster: 'challenge',
    text: '反复死在一个 Boss 面前、一遍遍练习直到翻过去——这个过程我真的很享受。',
    scores: { shouku: 3, tianti: 1 },
  },
  {
    id: 14, stage: 'focused', cluster: 'challenge',
    text: '排名和段位对我来说是重要的身份标识，我会花大量时间冲分。',
    scores: { tianti: 3, shouku: 1 },
  },
  {
    id: 15, stage: 'focused', cluster: 'challenge',
    text: '我更佩服靠耐心和坚持磨通关的玩家，而不是天赋型选手。',
    scores: { shouku: 3, tianliang: 1 },
  },
  {
    id: 16, stage: 'focused', cluster: 'challenge',
    text: '对战赢了之后，我第一个念头是去复盘、找对手的弱点。',
    scores: { tianti: 3, laoliu: 1 },
  },
  {
    id: 17, stage: 'focused', cluster: 'challenge',
    text: '我愿意花几个小时去攻克一个具体的硬骨头，中途不会想放弃。',
    scores: { shouku: 3, gandi: 1 },
  },

  // --- 策略/规划 (tianliang vs chanxian) ---
  {
    id: 18, stage: 'focused', cluster: 'strategy',
    text: '精打细算、把有限资源安排到最优状态，这种过程让我感到极度舒适。',
    scores: { tianliang: 3, chanxian: 1 },
  },
  {
    id: 19, stage: 'focused', cluster: 'strategy',
    text: '看着自己搭的自动产线流畅运转，比通关本身还让我满足。',
    scores: { chanxian: 3, tianliang: 1 },
  },
  {
    id: 20, stage: 'focused', cluster: 'strategy',
    text: '开新游戏之前，我一定会先查一圈攻略和机制解析再做规划。',
    scores: { tianliang: 3, chanxian: 1 },
  },
  {
    id: 21, stage: 'focused', cluster: 'strategy',
    text: '我常在脑子里同时推好几套方案，反复比较哪个更高效。',
    scores: { chanxian: 3, tianliang: 1 },
  },
  {
    id: 22, stage: 'focused', cluster: 'strategy',
    text: '回合制或者能随时暂停思考的游戏，比即时操作更对我的胃口。',
    scores: { tianliang: 3, laoe: 1 },
  },

  // --- 探索/建造 (saibo vs fangkuai) ---
  {
    id: 23, stage: 'focused', cluster: 'explore',
    text: '新地图解锁的那一瞬间，我做的第一件事就是朝边缘跑、看边界在哪。',
    scores: { saibo: 3, fangkuai: 1 },
  },
  {
    id: 24, stage: 'focused', cluster: 'explore',
    text: '看到别人建的酷炫作品，我的第一反应是"我也要来造一个"。',
    scores: { fangkuai: 3, saibo: 1 },
  },
  {
    id: 25, stage: 'focused', cluster: 'explore',
    text: '隐藏任务、彩蛋、支线——这些东西比主线剧情更让我兴奋。',
    scores: { saibo: 3, laoliu: 1 },
  },
  {
    id: 26, stage: 'focused', cluster: 'explore',
    text: '给我一片空地和一个建造系统，我能沉浸一整个下午。',
    scores: { fangkuai: 3, chanxian: 1 },
  },
  {
    id: 27, stage: 'focused', cluster: 'explore',
    text: '我不喜欢被任务列表推着走，随心所欲地乱晃才是我的玩法。',
    scores: { saibo: 3, fangkuai: 1 },
  },

  // --- 社交/语音 (yuyin vs laoliu) ---
  {
    id: 28, stage: 'focused', cluster: 'social',
    text: '和朋友边打游戏边聊天的乐趣，对我来说不比游戏本身少。',
    scores: { yuyin: 3, laoliu: 1 },
  },
  {
    id: 29, stage: 'focused', cluster: 'social',
    text: '与其堂堂正正地打，我更享受设陷阱、打埋伏、让对方措手不及。',
    scores: { laoliu: 3, yuyin: 1 },
  },
  {
    id: 30, stage: 'focused', cluster: 'social',
    text: '语音功能对我而言基本是必需的，沉默的游戏让我觉得闷。',
    scores: { yuyin: 3, fangkuai: 1 },
  },
  {
    id: 31, stage: 'focused', cluster: 'social',
    text: '一套精妙的战术欺骗，比纯粹的正面碾压更让我有成就感。',
    scores: { laoliu: 3, tianliang: 1 },
  },
  {
    id: 32, stage: 'focused', cluster: 'social',
    text: '我是那种会在队伍里活跃气氛、主动发起话题的人。',
    scores: { yuyin: 3, laoliu: 1 },
  },

  // --- 收集/消费 (liusiBa vs cangshu vs gandi) ---
  {
    id: 33, stage: 'focused', cluster: 'collect',
    text: '抽卡出货那一瞬间的刺激感，是我愿意反复为它掏钱的理由。',
    scores: { liusiBa: 3, cangshu: 1 },
  },
  {
    id: 34, stage: 'focused', cluster: 'collect',
    text: '包里的稀有道具我总舍不得用，总觉得"万一后面有更关键的时刻呢"。',
    scores: { cangshu: 3, gandi: 1 },
  },
  {
    id: 35, stage: 'focused', cluster: 'collect',
    text: '每天上线清日常、攒材料，这种按部就班的积累让我觉得很踏实。',
    scores: { gandi: 3, cangshu: 1 },
  },
  {
    id: 36, stage: 'focused', cluster: 'collect',
    text: '"限定""绝版""最后机会"——这些字眼就是我的钱包密码。',
    scores: { liusiBa: 3, gandi: 1 },
  },
  {
    id: 37, stage: 'focused', cluster: 'collect',
    text: '靠自己一点一点肝出来的成果，比花钱买来的更让我自豪。',
    scores: { gandi: 3, liusiBa: 1 },
  },

  // --- 休闲/佛系 (laoe) ---
  {
    id: 38, stage: 'focused', cluster: 'casual',
    text: '不是必须做的东西我碰都不会碰，开心才是唯一标准。',
    scores: { laoe: 3, tianliang: 1 },
  },
  {
    id: 39, stage: 'focused', cluster: 'casual',
    text: '我最理想的游戏是那种可以随时放下、随时捡起来的。',
    scores: { laoe: 3, gandi: 1 },
  },
  {
    id: 40, stage: 'focused', cluster: 'casual',
    text: '别人说"不玩最高难度等于没玩"——我完全不认同这种说法。',
    scores: { laoe: 3, shouku: 1 },
  },
  {
    id: 41, stage: 'focused', cluster: 'casual',
    text: '游戏里的风景和音乐，有时候比核心玩法更让我愿意留下来。',
    scores: { laoe: 3, saibo: 1 },
  },
  {
    id: 42, stage: 'focused', cluster: 'casual',
    text: '我不希望游戏给我任何紧张感，一秒钟都不行。',
    scores: { laoe: 3, yuyin: 1 },
  },
]

export function getClusterScores(scores) {
  const clusterScores = {}
  for (const [key, cluster] of Object.entries(CLUSTERS)) {
    clusterScores[key] = cluster.types.reduce((sum, t) => sum + (scores[t] || 0), 0)
  }
  return clusterScores
}

export function selectFocusedQuestions(scores, questionsPerCluster = 5) {
  const clusterScores = getClusterScores(scores)
  const sorted = Object.entries(clusterScores).sort((a, b) => b[1] - a[1])

  const top = []
  const topScore = sorted[0][1]
  top.push(sorted[0][0])

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][1] + 3 >= topScore) {
      top.push(sorted[i][0])
    } else {
      break
    }
  }

  let selected = top.slice(0, 2)
  if (selected.length < 2) {
    for (const [cluster] of sorted) {
      if (!selected.includes(cluster)) {
        selected.push(cluster)
        if (selected.length >= 2) break
      }
    }
  }
  const focused = []
  for (const cluster of selected) {
    const pool = questions.filter(q => q.stage === 'focused' && q.cluster === cluster)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    focused.push(...shuffled.slice(0, questionsPerCluster))
  }
  return focused.sort((a, b) => a.id - b.id)
}

export function isScreeningComplete(scores) {
  return Object.values(scores).some(v => v > 0)
}
