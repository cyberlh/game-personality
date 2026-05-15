# 游戏人格测试 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零构建一个完整的"游戏人格测试"互动网站 — 12 种 meme 风格人格类型、20 道题、前端计分、Canvas 分享卡片、暗色霓虹主题。

**Architecture:** React 18 + Tailwind CSS 前端 (Vite 构建)，Node.js + Express 后端 (SQLite 数据库)，前后端通过 `/api` 通信。前端负责所有交互体验和计分，后端负责持久化、统计和正式分享图生成。

**Tech Stack:** React 18, Tailwind CSS 3, Vite, Node.js, Express, better-sqlite3, node-canvas, Nginx

---

## File Structure

```
client/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   ├── questions.js
│   │   └── personalities.js
│   ├── hooks/
│   │   └── useQuiz.js
│   ├── components/
│   │   ├── Landing.jsx
│   │   ├── Quiz.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── OptionCard.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Result.jsx
│   │   ├── RadarChart.jsx
│   │   ├── ShareCard.jsx
│   │   └── ParticleBackground.jsx
│   └── utils/
│       └── canvas.js

server/
├── package.json
├── index.js
├── routes/
│   └── api.js
├── models/
│   └── result.js
├── data/
│   ├── questions.json
│   └── personalities.json
└── utils/
    └── shareCard.js
```

---

### Task 1: 项目脚手架

**Files:**
- Create: `client/package.json`, `client/index.html`, `client/vite.config.js`, `client/tailwind.config.js`, `client/postcss.config.js`, `client/src/main.jsx`, `client/src/App.jsx`, `client/src/index.css`
- Create: `server/package.json`, `server/index.js`

- [ ] **Step 1: 初始化 client 项目**

```bash
mkdir -p client/src/components client/src/data client/src/hooks client/src/utils
```

`client/package.json`:
```json
{
  "name": "game-personality-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "vite": "^5.4.8"
  }
}
```

`client/vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

`client/tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0f0f23',
        neon: {
          purple: '#a855f7',
          blue: '#3b82f6',
          cyan: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif']
      }
    }
  },
  plugins: []
}
```

`client/postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

`client/index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="测测你是什么类型的游戏人格？12种meme风格等你来发现！" />
    <title>游戏人格测试</title>
  </head>
  <body class="bg-dark text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

`client/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  background-color: #0f0f23;
  color: #e2e8f0;
  overflow-x: hidden;
}

/* 隐藏滚动条但保留滚动功能 */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
```

`client/src/main.jsx`:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

`client/src/App.jsx`:
```jsx
import { useQuiz } from './hooks/useQuiz'
import Landing from './components/Landing'
import Quiz from './components/Quiz'
import Result from './components/Result'
import ParticleBackground from './components/ParticleBackground'

export default function App() {
  const { screen, startQuiz, ...quizProps } = useQuiz()

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      {screen === 'landing' && <Landing onStart={startQuiz} />}
      {screen === 'quiz' && <Quiz {...quizProps} />}
      {screen === 'result' && <Result {...quizProps} />}
    </div>
  )
}
```

- [ ] **Step 2: 初始化 server 项目**

```bash
mkdir -p server/routes server/models server/data server/utils
```

`server/package.json`:
```json
{
  "name": "game-personality-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "better-sqlite3": "^11.3.0",
    "cors": "^2.8.5",
    "express": "^4.21.0",
    "canvas": "^2.11.2",
    "uuid": "^10.0.0"
  }
}
```

`server/index.js`:
```js
import express from 'express'
import cors from 'cors'
import { initDB } from './models/result.js'
import apiRouter from './routes/api.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use('/api', apiRouter)

initDB()

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

- [ ] **Step 3: 安装依赖**

```bash
cd client && npm install
```

```bash
cd server && npm install
```

- [ ] **Step 4: 验证脚手架**

```bash
cd server && node index.js &
# 预期: "Server running on http://localhost:3001"
# 然后 kill 进程
```

```bash
cd client && npx vite build
# 预期: 构建成功，client/dist/ 目录生成
```

- [ ] **Step 5: Commit**

```bash
git add client/ server/
git commit -m "feat: 项目脚手架 — React+Vite前端 + Express后端"
```

---

### Task 2: 数据层 — 20 道题 + 12 种人格类型

**Files:**
- Create: `client/src/data/questions.js`, `client/src/data/personalities.js`
- Create: `server/data/questions.json`, `server/data/personalities.json`

- [ ] **Step 1: 编写 12 种人格类型定义**

`client/src/data/personalities.js`:
```js
export const personalities = {
  shouku: {
    id: 'shouku',
    name: '受苦仙人',
    emoji: '🩸',
    color: '#C41E3A',
    tagline: '拼尽全力也无法战胜……下次一定行',
    description: '你不是真的喜欢痛苦，你是喜欢征服痛苦后的那个自己。每一句"YOU DIED"都是你变强的证明，每一次"再来"都是你对自己的挑战。别人眼中的自虐，是你手中的勋章。',
    games: ['艾尔登法环', '只狼', '空洞骑士·丝之歌', '黑神话悟空', '仁王2', '匹诺曹的谎言'],
    strengths: ['超强抗压能力', '不服输的韧性', '深度专注力', '复盘分析能力'],
    weaknesses: ['容易钻进牛角尖', '看不起简单模式', '朋友劝你别受苦——你嘴上说好，回头继续死']
  },
  tianliang: {
    id: 'tianliang',
    name: '天亮战士',
    emoji: '🌅',
    color: '#FFD700',
    tagline: '再玩一回合，咦外面天亮了？',
    description: '你的大脑是一个永不停歇的策略引擎。排列组合、资源优化、战术博弈——这些让普通人头疼的东西，是你多巴胺的源泉。"就再玩一回合"是你对时间的最大谎言。',
    games: ['文明7', '杀戮尖塔2', '小丑牌', '群星', '钢铁雄心4', '十字军之王3'],
    strengths: ['强大的逻辑思维', '长线规划能力', '概率直觉', '多线程决策'],
    weaknesses: ['日常迟到率极高', '社交场合容易走神分析', '口头禅"再来一回合"导致严重缺觉']
  },
  saibo: {
    id: 'saibo',
    name: '赛博驴友',
    emoji: '🎒',
    color: '#00D4AA',
    tagline: '那座山能爬吗？我先去看看',
    description: '地图上的每一个"?"都是你的使命。你不追求最强装备或最高分，你追求的是"那个瀑布后面有没有隐藏洞穴"以及"这个NPC的第三句对话是不是有新线索"。通关不是终点，全地图解锁才是。',
    games: ['赛博朋克2077', '荒野大镖客2', '塞尔达传说', '原神', '绯红沙漠'],
    strengths: ['极强的好奇心', '细致入微的观察力', '不怕绕路的耐心', '沉浸式体验能力'],
    weaknesses: ['主线任务拖延症晚期', '经常迷路但嘴硬说是在探索', '为找一个收集品能花三小时']
  },
  tianti: {
    id: 'tianti',
    name: '天梯卷王',
    emoji: '🏆',
    color: '#FF3366',
    tagline: '赢一把就睡（凌晨四点还在排）',
    description: '你的血液里流淌着竞技的基因。排位分不是数字，是你在这个世界上的存在证明。输了不甘心，赢了还想趁着手热再来一把。电子竞技不需要睡眠——你是这句话最忠实的践行者。',
    games: ['CS2', '无畏契约', '英雄联盟', 'APEX英雄', '街霸6', '漫威争锋'],
    strengths: ['极快的反应速度', '高压下的冷静', '强烈的胜负欲', '快速学习能力'],
    weaknesses: ['容易上头连败', '队友失误时血压飙升', '嘴上说娱乐局身体很诚实']
  },
  chanxian: {
    id: 'chanxian',
    name: '产线仙人',
    emoji: '⚙️',
    color: '#00BFFF',
    tagline: '这条传送带还能再优化0.3%',
    description: '你眼中的世界是一个个等待被优化的系统。看到混乱的布局，你的第一反应不是抱怨，而是"我可以让它变得更好"。从传送带的速度到原料的配比，你的快乐来自把熵增变成熵减。',
    games: ['异星工厂', '幸福工厂', '环世界', '缺氧', '戴森球计划'],
    strengths: ['系统工程思维', '极致效率追求', '模块化设计能力', '长期规划能力'],
    weaknesses: ['优化强迫症——凌晨三点还在调传送带', '对低效事物的零容忍', '玩游戏像上班但更快乐']
  },
  fangkuai: {
    id: 'fangkuai',
    name: '方块狂人',
    emoji: '🧱',
    color: '#FF6B35',
    tagline: '别吵，我在1:1还原故宫',
    description: '给你一堆方块，你能还原整个世界。你不只是在"玩游戏"——你是在用方块当画笔，用想象力当蓝图，创造一个只属于你的宇宙。别人说"这不可能"，你说"等我造完"。',
    games: ['我的世界', '泰拉瑞亚', '城市天际线', '动物园之星', '模拟人生4'],
    strengths: ['天马行空的创造力', '惊人的空间想象力', '不求回报的耐心', '审美在线'],
    weaknesses: ['项目永远在"进行中"', '为一块砖的颜色纠结半小时', '造完的东西舍不得拆']
  },
  yuyin: {
    id: 'yuyin',
    name: '语音永动机',
    emoji: '🎙️',
    color: '#FF69B4',
    tagline: '开黑五分钟，吹水两小时',
    description: '对你来说，游戏是社交的载体。一个人在游戏里 = 孤独，语音频道才是你的主战场。什么游戏不重要，重要的是谁在语音那头。你们可以在一款游戏里聊天三小时，然后发现任务根本没做。',
    games: ['绝地潜兵2', 'REPO', 'VRChat', '双影奇境', '太空杀', '最终幻想14'],
    strengths: ['极强的社交能力', '团队润滑剂', '情绪价值提供者', '段子手天赋'],
    weaknesses: ['聊嗨了忘记游戏目标', '队友下线后瞬间失去动力', '单机游戏永远通不了关']
  },
  liusiBa: {
    id: 'liusiBa',
    name: '648战士',
    emoji: '💰',
    color: '#9B59B6',
    tagline: '这发十连必出！不出再氪一单',
    description: '你清醒地知道自己被厂商拿捏，但你更清醒地知道——出货那一刻的多巴胺是真实的。648不是数字，是你的信仰充值。你可以在现实中省吃俭用，但卡池UP的时候眼睛都不会眨一下。',
    games: ['原神', '崩坏星穹铁道', '赛马娘', '命运冠位指定', '绝区零'],
    strengths: ['经济学实践者（沉没成本管理）', '坚定的目标追求', '对美术/角色的鉴赏力'],
    weaknesses: ['每个月的648预算总有"意外"', '大保底后的贤者时间', '现实中可能吃土但不能亏待老婆']
  },
  laoliu: {
    id: 'laoliu',
    name: '老六鼠鼠',
    emoji: '🐭',
    color: '#95A5A6',
    tagline: '有人！我先蹲一下',
    description: '在所有人都往前冲的时候，你选择了蹲下。不是因为怂，是因为你知道——活到最后的人才能舔包。你的每一步都经过风险评估，每一个角落都是你的安全屋。富贵险中求？你选择不险。',
    games: ['ARC Raiders', '塔科夫', '猎杀对决', 'DayZ', 'Rust'],
    strengths: ['极致的风险意识', '超强耐心', '局势判断力', '情绪稳定'],
    weaknesses: ['错过最佳时机', '被队友催到焦虑', '舔包时手抖']
  },
  gandi: {
    id: 'gandi',
    name: '肝帝',
    emoji: '💪',
    color: '#E67E22',
    tagline: '没钱氪金，但我有命啊',
    description: '零氪也能全通——这是你的信仰，也是你的勋章。648？不存在的。你靠的是时间、毅力、和一双不知疲倦的手。当氪佬在卡池里挥金如土的时候，你在地图里挥汗如雨。最后的通关截图，是你对资本的胜利。',
    games: ['星际战甲', '流放之路', '失落的方舟', '暗黑破坏神4', '梦幻西游'],
    strengths: ['超强毅力', '时间管理大师', '对游戏机制的深度理解', '零成本达成目标的自豪'],
    weaknesses: ['护肝片已成为日常消费品', '被"休闲玩家"四个字伤害', '现实中可能缺乏社交']
  },
  laoe: {
    id: 'laoe',
    name: '传奇老鹅',
    emoji: '🦆',
    color: '#87CEEB',
    tagline: '今天不卷了，做只快乐老鹅',
    description: '你已经看透了——游戏不是为了证明什么，是为了让自己开心。不追求高难度、不追求排名、不追求全收集。浇浇花、摸摸鱼、看看风景，这就够了。在所有人都往前冲的时代，你选择了坐下，泡杯茶，享受"无意义"的快乐。',
    games: ['星露谷物语', '欧卡模拟2', '旅行青蛙', '心之桃源', '冲就完事模拟器'],
    strengths: ['顶级心态管理', '享受当下的能力', '不随波逐流的定力', '自得其乐的智慧'],
    weaknesses: ['被朋友说"玩的不是游戏"', '种田种到忘记现实时间', '对竞技类游戏完全免疫']
  },
  cangshu: {
    id: 'cangshu',
    name: '仓鼠症晚期',
    emoji: '🐹',
    color: '#F39C12',
    tagline: '这个道具先囤着，万一有用呢（通关了也没用过）',
    description: '你的背包是一个黑洞——只进不出。"这个后期可能有用""这个绝版了不能浪费""这个虽然现在用不上但是囤着安心"。当你通关时带着999瓶药水、500个稀有材料、和一背包传说道具时，你已经赢了——赢在安全感。',
    games: ['宝可梦', '怪物猎人', '各类角色扮演游戏', '卡牌游戏'],
    strengths: ['超强资源管理', '未雨绸缪的远见', '对稀有物品的敏锐嗅觉'],
    weaknesses: ['背包永远99%满', '为了省道具花了更多时间', '囤到最后发现通关了啥也没用']
  }
}

export const personalityList = Object.values(personalities)

export function getPersonality(id) {
  return personalities[id] || null
}
```

`server/data/personalities.json`:
```json
{
  "shouku": {
    "id": "shouku",
    "name": "受苦仙人",
    "emoji": "🩸",
    "color": "#C41E3A",
    "tagline": "拼尽全力也无法战胜……下次一定行",
    "description": "你不是真的喜欢痛苦，你是喜欢征服痛苦后的那个自己。",
    "games": ["艾尔登法环", "只狼", "空洞骑士·丝之歌", "黑神话悟空", "仁王2", "匹诺曹的谎言"]
  }
}
```
> 注: 完整 12 个类型内容与前端 `personalities.js` 一致，此处省略重复。

- [ ] **Step 2: 编写 20 道题及完整分值**

`client/src/data/questions.js`:
```js
// 分值键: shouku=受苦, tianliang=天亮, saibo=赛博, tianti=天梯
//          chanxian=产线, fangkuai=方块, yuyin=语音, liusiBa=648
//          laoliu=老六, gandi=肝帝, laoe=老鹅, cangshu=仓鼠

export const questions = [
  {
    id: 1,
    text: '周末晚上打开电脑/手机，你最想做什么？',
    options: [
      { label: 'A', text: '挑战公认最难的那款，"今天非把它拿下不可"', scores: { shouku: 3, tianti: 1 } },
      { label: 'B', text: '潜入一个开放世界，地图上每个"?"都踩一遍', scores: { saibo: 3, laoe: 1 } },
      { label: 'C', text: '约上固定车队，语音一开就是快乐星球', scores: { yuyin: 3, tianliang: 1 } },
      { label: 'D', text: '开一局策略游戏，"就玩一回合"', scores: { tianliang: 3, shouku: 1 } }
    ]
  },
  {
    id: 2,
    text: '游戏中最让你爽到的瞬间是什么？',
    options: [
      { label: 'A', text: '排位决胜局1v3残血反杀，全场扣6', scores: { tianti: 3, shouku: 1 } },
      { label: 'B', text: '完美产线跑通那一刻，所有数据精准对齐', scores: { chanxian: 3, fangkuai: 1 } },
      { label: 'C', text: '自己造的建筑被路过玩家截图发帖"这是怎么做到的"', scores: { fangkuai: 3, chanxian: 1 } },
      { label: 'D', text: '十连三黄蛋，截图发群引爆全群羡慕', scores: { liusiBa: 3, cangshu: 1 } }
    ]
  },
  {
    id: 3,
    text: '哪种游戏成就最让你满足？',
    options: [
      { label: 'A', text: '无伤通关/最高难度/Boss连战全通', scores: { shouku: 3, tianti: 1 } },
      { label: 'B', text: '用精妙的战术体系在多人对战中以智取胜', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'C', text: '造出被社区广泛采用的蓝图/攻略/配装方案', scores: { chanxian: 3, fangkuai: 1 } },
      { label: 'D', text: '零氪全通最难副本，截图发论坛"零氪党的胜利"', scores: { gandi: 3, tianti: 1 } }
    ]
  },
  {
    id: 4,
    text: '魂类游戏 Boss 连死 20 次，你会？',
    options: [
      { label: 'A', text: '研究招式规律，制定精确对策，"这次一定过"', scores: { tianliang: 3, shouku: 1 } },
      { label: 'B', text: '越死越兴奋，"再来！这把感觉对了"', scores: { shouku: 3, tianti: 1 } },
      { label: 'C', text: '检查装备/配装/等级，一定有优化空间', scores: { tianti: 3, chanxian: 1 } },
      { label: 'D', text: '太难了换游戏——时间宝贵，不受这气', scores: { laoe: 3, yuyin: 1 } }
    ]
  },
  {
    id: 5,
    text: '肉鸽类"死后重来"的循环，你什么感受？',
    options: [
      { label: 'A', text: '每局全新策略组合，我要试遍所有套路流派', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'B', text: '每次重来都能发现新内容，探索本身就是快乐', scores: { saibo: 3, shouku: 1 } },
      { label: 'C', text: '攒永久升级，看着自己越来越强的成长感太上头', scores: { gandi: 3, tianti: 1 } },
      { label: 'D', text: '重复打同样的内容好无聊，不如玩有结局的游戏', scores: { laoe: 3, yuyin: 1 } }
    ]
  },
  {
    id: 6,
    text: '你更偏好哪种难度曲线？',
    options: [
      { label: 'A', text: '策略深度递增——越想越深，越玩越复杂，上限极高', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'B', text: '高开高走——上来就挑战我，挫败后成长最甜美', scores: { shouku: 3, tianti: 1 } },
      { label: 'C', text: '适中——有难度但不卡关，我有自己的节奏', scores: { saibo: 3, fangkuai: 1 } },
      { label: 'D', text: '低压力——最好能调难度，游戏不该制造焦虑', scores: { laoe: 3, cangshu: 1 } }
    ]
  },
  {
    id: 7,
    text: '你如何看待"死亡惩罚"（掉魂/掉装备/跑尸/删档）？',
    options: [
      { label: 'A', text: '合理的设计，让每一次决策更有分量', scores: { shouku: 3, tianliang: 1 } },
      { label: 'B', text: '紧张感拉满，这才是沉浸式冒险该有的代价', scores: { saibo: 3, tianti: 1 } },
      { label: 'C', text: '死就死了，蹲下一把——活着最重要', scores: { laoliu: 3, laoe: 1 } },
      { label: 'D', text: '太不友好了，游戏应该是放松的', scores: { laoe: 3, cangshu: 1 } }
    ]
  },
  {
    id: 8,
    text: '你对游戏内语音/开麦的态度？',
    options: [
      { label: 'A', text: '必要工具——快速沟通战术，精简短句不废话', scores: { tianliang: 3, tianti: 1 } },
      { label: 'B', text: '可有可无——我更喜欢独自沉浸在自己的世界', scores: { chanxian: 3, shouku: 1 } },
      { label: 'C', text: '必须开！聊天才是游戏的 80% 乐趣', scores: { yuyin: 3, fangkuai: 1 } },
      { label: 'D', text: '社恐福音——打字就够，能不打字更好', scores: { laoliu: 3, laoe: 1 } }
    ]
  },
  {
    id: 9,
    text: '多人游戏中，你通常是什么角色？',
    options: [
      { label: 'A', text: '战术指挥——分析局势、制定打法、分配任务', scores: { tianliang: 3, tianti: 1 } },
      { label: 'B', text: 'Carry位——我来杀穿对面，你们保我就行', scores: { tianti: 3, shouku: 1 } },
      { label: 'C', text: '气氛组——段子手+DJ，让全队笑着赢（或笑着输）', scores: { yuyin: 3, tianliang: 1 } },
      { label: 'D', text: '辅助/后勤——默默补资源/造装备，队友在前线冲锋', scores: { fangkuai: 3, chanxian: 1 } }
    ]
  },
  {
    id: 10,
    text: '朋友拉你玩一款完全没接触过的游戏类型，你会？',
    options: [
      { label: 'A', text: '先看攻略/百科/教学视频，做足功课再上手', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'B', text: '直接开玩！摸索本身就是乐趣，"别剧透我"', scores: { saibo: 3, shouku: 1 } },
      { label: 'C', text: '来者不拒——朋友玩什么我就玩什么，游戏是其次', scores: { yuyin: 3, fangkuai: 1 } },
      { label: 'D', text: '如果太复杂/太肝就算了，推荐他们玩我的游戏', scores: { laoe: 3, yuyin: 1 } }
    ]
  },
  {
    id: 11,
    text: '你更喜欢哪种游戏世界？',
    options: [
      { label: 'A', text: '精密的箱庭关卡——每条捷径、每扇"无法从这一侧打开"的门都是艺术', scores: { shouku: 3, saibo: 1 } },
      { label: 'B', text: '广袤的开放世界——"看到那座山了吗？你可以爬上去"', scores: { saibo: 3, fangkuai: 1 } },
      { label: 'C', text: '可改造的沙盒——世界是我的画布，一砖一瓦由我决定', scores: { fangkuai: 3, chanxian: 1 } },
      { label: 'D', text: '不需要世界——给我一张对战地图/一局排位就够了', scores: { tianti: 3, yuyin: 1 } }
    ]
  },
  {
    id: 12,
    text: '你更喜欢哪种叙事方式？',
    options: [
      { label: 'A', text: '碎片化叙事（魂类）——从物品描述、环境细节拼凑故事', scores: { shouku: 3, saibo: 1 } },
      { label: 'B', text: '分支选择（经典角色扮演）——我的选择真正影响世界走向', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'C', text: '玩家自创故事——和朋友们在游戏中即兴创造的回忆', scores: { yuyin: 3, fangkuai: 1 } },
      { label: 'D', text: '线性叙事——像看一部好电影，沉浸不费脑', scores: { laoe: 3, cangshu: 1 } }
    ]
  },
  {
    id: 13,
    text: '你心目中的"神作"更接近哪一款？',
    options: [
      { label: 'A', text: '只狼/艾尔登法环——"战胜 Boss 那一刻，手在抖"', scores: { shouku: 3, saibo: 1 } },
      { label: 'B', text: '文明7/杀戮尖塔2——"再玩一回合，真的最后一回合"', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'C', text: '赛博朋克2077/荒野大镖客2——"通关后像失恋了一样"', scores: { saibo: 3, shouku: 1 } },
      { label: 'D', text: '异星工厂/戴森球计划——"我妈问我为什么凌晨在画传送带"', scores: { chanxian: 3, fangkuai: 1 } }
    ]
  },
  {
    id: 14,
    text: '"肝"和"氪"，你更倾向哪一种？',
    options: [
      { label: 'A', text: '该氪就氪，时间比钱值钱——648走你', scores: { liusiBa: 3, cangshu: 1 } },
      { label: 'B', text: '肝就完了——穷得只剩时间了，命就是游戏币', scores: { gandi: 3, tianti: 1 } },
      { label: 'C', text: '都不选——适度游戏，过量伤肝又伤钱包', scores: { laoe: 3, laoliu: 1 } },
      { label: 'D', text: '不肝不氪——但我攒了10万免费钻，策划都怕我', scores: { cangshu: 3, gandi: 1 } }
    ]
  },
  {
    id: 15,
    text: '你如何看待游戏中的"刷刷刷"？',
    options: [
      { label: 'A', text: '接受，前提是刷的路线/效率需要策略规划', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'B', text: '探索顺带刷可以，纯重复刷没意思——除非风景好', scores: { saibo: 3, laoe: 1 } },
      { label: 'C', text: '为了建造/制作我愿意刷——材料是作品的血肉', scores: { fangkuai: 3, chanxian: 1 } },
      { label: 'D', text: '任何形式的"刷"都想弃游——时间太宝贵了', scores: { laoe: 3, cangshu: 1 } }
    ]
  },
  {
    id: 16,
    text: '你对 Mod / 创意工坊的态度？',
    options: [
      { label: 'A', text: '策略/深度向 Mod——新文明/新卡牌/新机制，扩展上限', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'B', text: '效率向 Mod——自动化插件、数据统计、一键整理', scores: { chanxian: 3, tianliang: 1 } },
      { label: 'C', text: '语音/社交向 Mod——更多表情动作、更好的开黑体验', scores: { yuyin: 3, fangkuai: 1 } },
      { label: 'D', text: '皮肤/美化向 Mod——抽不到的老婆就靠 Mod 了', scores: { liusiBa: 3, cangshu: 1 } }
    ]
  },
  {
    id: 17,
    text: '如果要花 1000 小时在一款游戏上，你希望花在什么上面？',
    options: [
      { label: 'A', text: '磨练技术——从被碾压到无伤通关的蜕变', scores: { shouku: 3, tianti: 1 } },
      { label: 'B', text: '深度钻研——吃透每一层策略、每一个隐藏机制', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'C', text: '建造奇观——一座让所有人瞠目结舌的史诗级作品', scores: { fangkuai: 3, yuyin: 1 } },
      { label: 'D', text: '全图鉴收集——每一个角色/每一张卡，一个都不能少', scores: { cangshu: 3, liusiBa: 1 } }
    ]
  },
  {
    id: 18,
    text: '你获得一台"完全沉浸式虚拟现实游戏舱"，第一件事？',
    options: [
      { label: 'A', text: '进入奇幻开放世界，独自踏上史诗级冒险', scores: { saibo: 3, shouku: 1 } },
      { label: 'B', text: '进入最大的虚拟社交广场，找朋友一起疯', scores: { yuyin: 3, fangkuai: 1 } },
      { label: 'C', text: '建一座现实中不可能存在的浮空城市', scores: { fangkuai: 3, chanxian: 1 } },
      { label: 'D', text: '把所有虚拟道具分类收纳进不同仓库，标签对齐', scores: { cangshu: 3, chanxian: 1 } }
    ]
  },
  {
    id: 19,
    text: '一天只剩 30 分钟打游戏，你会？',
    options: [
      { label: 'A', text: '开一局肉鸽/策略，"一局只要 30 分钟"（骗自己）', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'B', text: '上线签个到，看看风景，浇浇花，摸摸宠物——够了', scores: { laoe: 3, saibo: 1 } },
      { label: 'C', text: '排一把竞技——赢了美滋滋下线，输了"不行再来一把"', scores: { tianti: 3, shouku: 1 } },
      { label: 'D', text: '蹲一把撤离，苟到最后成功撤离——这 30 分钟值了', scores: { laoliu: 3, gandi: 1 } }
    ]
  },
  {
    id: 20,
    text: '游戏输了/被虐了，你的第一反应？',
    options: [
      { label: 'A', text: '"再来！这次我一定躲过那一招"——复盘→练习→再战', scores: { shouku: 3, tianti: 1 } },
      { label: 'B', text: '"这游戏的深度比我想象的深"——换思路/换套路再来', scores: { tianliang: 3, chanxian: 1 } },
      { label: 'C', text: '"我的我的，下把打回来"——秒排下一局，不服就干', scores: { tianti: 3, yuyin: 1 } },
      { label: 'D', text: '输了就输了呗——切出去看视频/刷手机/换个轻松的游戏', scores: { laoe: 3, laoliu: 1 } }
    ]
  }
]

// 分值均衡校验（可在构建时运行）
export function validateBalance() {
  const counts = {}
  questions.forEach(q => {
    q.options.forEach(opt => {
      Object.entries(opt.scores).forEach(([type, score]) => {
        if (score === 3) {
          counts[type] = (counts[type] || 0) + 1
        }
      })
    })
  })
  return counts
}
```

`server/data/questions.json`: 同前端分值数据，用 JSON 格式存储供后端验证使用。内容与前端一致，直接复制 `questions` 数组。

- [ ] **Step 3: 分值平衡验证**

```bash
cd client && node -e "
import { validateBalance } from './src/data/questions.js'
console.log(JSON.stringify(validateBalance(), null, 2))
"
```
预期输出: 每个类型主分 6-7 次，总数 80。

- [ ] **Step 4: Commit**

```bash
git add client/src/data/ server/data/
git commit -m "feat: 数据层 — 20题分值 + 12人格类型定义"
```

---

### Task 3: 后端 API

**Files:**
- Create: `server/models/result.js`
- Create: `server/routes/api.js`
- Modify: `server/index.js` (already created, verify imports work)

- [ ] **Step 1: 数据库模型**

`server/models/result.js`:
```js
import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = resolve(__dirname, '..', 'data.db')

let db

export function initDB() {
  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      answers TEXT NOT NULL,
      scores TEXT NOT NULL,
      result_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export function saveResult(id, answers, scores, resultType) {
  const stmt = db.prepare(
    'INSERT INTO results (id, answers, scores, result_type) VALUES (?, ?, ?, ?)'
  )
  stmt.run(id, JSON.stringify(answers), JSON.stringify(scores), resultType)
}

export function getResult(id) {
  const row = db.prepare('SELECT * FROM results WHERE id = ?').get(id)
  if (!row) return null
  return {
    ...row,
    answers: JSON.parse(row.answers),
    scores: JSON.parse(row.scores)
  }
}

export function getStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM results').get().count
  const counts = {}
  const rows = db.prepare(
    'SELECT result_type, COUNT(*) as count FROM results GROUP BY result_type'
  ).all()
  rows.forEach(r => { counts[r.result_type] = r.count })
  return { total, counts }
}
```

- [ ] **Step 2: API 路由**

`server/routes/api.js`:
```js
import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { saveResult, getResult, getStats } from '../models/result.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const router = Router()

// 加载题目（不含分值）
const questions = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'data', 'questions.json'), 'utf-8')
)
const personalities = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'data', 'personalities.json'), 'utf-8')
)

// 去掉分值后再返回
const sanitizedQuestions = questions.map(q => ({
  id: q.id,
  text: q.text,
  options: q.options.map(o => ({ label: o.label, text: o.text }))
}))

// GET /api/questions
router.get('/questions', (req, res) => {
  res.json({ questions: sanitizedQuestions })
})

// POST /api/submit
router.post('/submit', (req, res) => {
  const { answers } = req.body
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: '请提供有效的答案数组' })
  }

  // 后端独立计分验证
  const scores = {
    shouku: 0, tianliang: 0, saibo: 0, tianti: 0,
    chanxian: 0, fangkuai: 0, yuyin: 0, liusiBa: 0,
    laoliu: 0, gandi: 0, laoe: 0, cangshu: 0
  }

  answers.forEach(ans => {
    const question = questions.find(q => q.id === ans.questionId)
    if (question) {
      const option = question.options[ans.optionIndex]
      if (option) {
        Object.entries(option.scores).forEach(([type, score]) => {
          scores[type] = (scores[type] || 0) + score
        })
      }
    }
  })

  // 找出最高分类型
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  let resultType = sorted[0][0]

  // 平局处理：分差 ≤ 2 则为混合类型
  if (sorted.length > 1 && (sorted[0][1] - sorted[1][1]) <= 2) {
    resultType = `${sorted[0][0]}_${sorted[1][0]}`
  }

  const id = uuidv4()
  saveResult(id, answers, scores, resultType)

  const personality = personalities[resultType] || personalities[sorted[0][0]]

  res.json({
    resultId: id,
    resultType,
    scores,
    personality: personality ? {
      name: personality.name,
      emoji: personality.emoji,
      color: personality.color,
      tagline: personality.tagline,
      description: personality.description,
      games: personality.games
    } : null
  })
})

// GET /api/result/:id
router.get('/result/:id', (req, res) => {
  const result = getResult(req.params.id)
  if (!result) {
    return res.status(404).json({ error: '结果不存在' })
  }

  const personality = personalities[result.result_type]

  res.json({
    resultId: result.id,
    resultType: result.result_type,
    scores: result.scores,
    createdAt: result.created_at,
    personality: personality ? {
      name: personality.name,
      emoji: personality.emoji,
      color: personality.color,
      tagline: personality.tagline,
      description: personality.description,
      games: personality.games
    } : null
  })
})

// GET /api/stats
router.get('/stats', (req, res) => {
  res.json(getStats())
})

export default router
```

- [ ] **Step 3: 启动后端并测试**

```bash
cd server && node index.js &
```

```bash
# 测试 /api/questions
curl http://localhost:3001/api/questions | head -c 200
# 预期: {"questions":[...]}

# 测试 /api/submit
curl -X POST http://localhost:3001/api/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":1,"optionIndex":0}]}'
# 预期: {"resultId":"...","resultType":"shouku",...}

# 测试 /api/stats
curl http://localhost:3001/api/stats
# 预期: {"total":1,"counts":{"shouku":1}}
```

- [ ] **Step 4: Commit**

```bash
git add server/
git commit -m "feat: 后端API — questions/submit/result/stats 四个端点"
```

---

### Task 4: 前端核心 — useQuiz hook + 页面切换

**Files:**
- Create: `client/src/hooks/useQuiz.js`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: useQuiz hook**

`client/src/hooks/useQuiz.js`:
```js
import { useState, useCallback } from 'react'
import { questions } from '../data/questions'
import { getPersonality } from '../data/personalities'

export function useQuiz() {
  const [screen, setScreen] = useState('landing')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [scores, setScores] = useState(null)
  const [result, setResult] = useState(null)

  const startQuiz = useCallback(() => {
    setScreen('quiz')
    setCurrentQuestion(0)
    setAnswers([])
    setScores(null)
    setResult(null)
  }, [])

  const answerQuestion = useCallback((optionIndex) => {
    const question = questions[currentQuestion]
    const option = question.options[optionIndex]

    const newAnswers = [...answers, { questionId: question.id, optionIndex }]
    setAnswers(newAnswers)

    // 更新累计得分
    const newScores = { ...(scores || {
      shouku: 0, tianliang: 0, saibo: 0, tianti: 0,
      chanxian: 0, fangkuai: 0, yuyin: 0, liusiBa: 0,
      laoliu: 0, gandi: 0, laoe: 0, cangshu: 0
    })}
    Object.entries(option.scores).forEach(([type, score]) => {
      newScores[type] = (newScores[type] || 0) + score
    })
    setScores(newScores)

    // 延迟后切换下一题或显示结果
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // 计算最终结果
        const sorted = Object.entries(newScores).sort((a, b) => b[1] - a[1])
        let resultType = sorted[0][0]
        if (sorted.length > 1 && (sorted[0][1] - sorted[1][1]) <= 2) {
          resultType = `${sorted[0][0]}_${sorted[1][0]}`
        }
        const personality = getPersonality(resultType) || getPersonality(sorted[0][0])
        setResult({ type: resultType, personality, scores: newScores })
        setScreen('result')
      }
    }, 600)
  }, [currentQuestion, answers, scores])

  const goBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setAnswers(prev => prev.slice(0, -1))
    }
  }, [currentQuestion])

  return {
    screen,
    currentQuestion,
    totalQuestions: questions.length,
    question: questions[currentQuestion],
    answers,
    scores,
    result,
    startQuiz,
    answerQuestion,
    goBack
  }
}
```

- [ ] **Step 2: 更新 App.jsx**

```jsx
import { useQuiz } from './hooks/useQuiz'
import Landing from './components/Landing'
import Quiz from './components/Quiz'
import Result from './components/Result'
import ParticleBackground from './components/ParticleBackground'

export default function App() {
  const quiz = useQuiz()

  return (
    <div className="relative min-h-screen bg-dark">
      <ParticleBackground />
      {quiz.screen === 'landing' && (
        <Landing onStart={quiz.startQuiz} />
      )}
      {quiz.screen === 'quiz' && (
        <Quiz
          question={quiz.question}
          currentQuestion={quiz.currentQuestion}
          totalQuestions={quiz.totalQuestions}
          onAnswer={quiz.answerQuestion}
          onBack={quiz.goBack}
        />
      )}
      {quiz.screen === 'result' && quiz.result && (
        <Result
          result={quiz.result}
          onRestart={quiz.startQuiz}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: 验证页面切换**

```bash
cd client && npm run dev
```
打开 http://localhost:5173，确认能看到 Landing 页（先放占位文字），点击按钮能切换到 Quiz 页。

- [ ] **Step 4: Commit**

```bash
git add client/src/hooks/ client/src/App.jsx
git commit -m "feat: useQuiz hook — 状态管理 + 计分 + 页面切换"
```

---

### Task 5 前端组件 — Landing + ProgressBar + ParticleBackground

**Files:**
- Create: `client/src/components/Landing.jsx`
- Create: `client/src/components/ProgressBar.jsx`
- Create: `client/src/components/ParticleBackground.jsx`

- [ ] **Step 1: ParticleBackground**

`client/src/components/ParticleBackground.jsx`:
```jsx
import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
```

- [ ] **Step 2: ProgressBar**

`client/src/components/ProgressBar.jsx`:
```jsx
export default function ProgressBar({ current, total }) {
  const pct = ((current + 1) / total) * 100

  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #a855f7, #3b82f6, #06b6d4)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite'
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 3: Landing 页**

`client/src/components/Landing.jsx`:
```jsx
import { personalityList } from '../data/personalities'

export default function Landing({ onStart }) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* 标题区 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            测测你的游戏人格
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl">
          20 道趣味问答 · 12 种 Meme 人格 · 找到你的专属玩家标签
        </p>
      </div>

      {/* 开始按钮 */}
      <button
        onClick={onStart}
        className="group relative px-10 py-4 rounded-2xl text-xl font-bold
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:from-purple-500 hover:to-blue-500
          transition-all duration-300 hover:scale-105
          shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50"
      >
        <span className="relative z-10">开始测试</span>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600
          blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
      </button>

      {/* 人格预览 */}
      <div className="mt-12 grid grid-cols-4 md:grid-cols-6 gap-4 max-w-2xl">
        {personalityList.map(p => (
          <div key={p.id} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-2xl">{p.emoji}</span>
            <span className="text-xs text-slate-500">{p.name}</span>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <p className="mt-8 text-sm text-slate-600">已有 12,847 人完成测试</p>
    </div>
  )
}
```

- [ ] **Step 4: 验证 Landing 页**

浏览器打开 http://localhost:5173，确认粒子背景 + 标题 + 开始按钮 + 12 人格图标正常显示。

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Landing.jsx client/src/components/ProgressBar.jsx client/src/components/ParticleBackground.jsx
git commit -m "feat: Landing页 + 粒子背景 + 进度条组件"
```

---

### Task 6: 前端组件 — Quiz + QuestionCard + OptionCard

**Files:**
- Create: `client/src/components/QuestionCard.jsx`
- Create: `client/src/components/OptionCard.jsx`
- Create: `client/src/components/Quiz.jsx`

- [ ] **Step 1: OptionCard**

`client/src/components/OptionCard.jsx`:
```jsx
import { useState } from 'react'

export default function OptionCard({ label, text, onClick, disabled }) {
  const [selected, setSelected] = useState(false)

  const handleClick = () => {
    if (disabled) return
    setSelected(true)
    setTimeout(() => onClick(), 300)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-300
        ${selected
          ? 'border-purple-400 bg-purple-500/20 scale-[0.98] shadow-lg shadow-purple-500/20'
          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:scale-[1.02]'
        }
        ${disabled && !selected ? 'opacity-50 cursor-not-allowed' : ''}
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
```

- [ ] **Step 2: QuestionCard**

`client/src/components/QuestionCard.jsx`:
```jsx
import { useState, useEffect } from 'react'
import OptionCard from './OptionCard'

export default function QuestionCard({ question, onAnswer }) {
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    setAnimating(false)
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [question.id])

  const handleSelect = (index) => {
    setAnimating(true)
    onAnswer(index)
  }

  return (
    <div
      className={`
        w-full max-w-lg mx-auto transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* 问题文本 */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
        {question.text}
      </h2>

      {/* 选项列表 */}
      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <OptionCard
            key={i}
            label={opt.label}
            text={opt.text}
            onClick={() => handleSelect(i)}
            disabled={animating}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Quiz 页面**

`client/src/components/Quiz.jsx`:
```jsx
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

export default function Quiz({ question, currentQuestion, totalQuestions, onAnswer, onBack }) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col px-4 py-6">
      {/* 顶部栏 */}
      <div className="max-w-lg mx-auto w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            disabled={currentQuestion === 0}
            className={`text-sm px-3 py-1 rounded-lg transition-colors
              ${currentQuestion === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
          >
            ← 上一题
          </button>
          <span className="text-sm text-slate-400">
            {currentQuestion + 1} / {totalQuestions}
          </span>
          <div className="w-14" />
        </div>
        <ProgressBar current={currentQuestion} total={totalQuestions} />
      </div>

      {/* 题目卡片 */}
      <div className="flex-1 flex items-center justify-center">
        <QuestionCard
          key={question.id}
          question={question}
          onAnswer={onAnswer}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 验证答题流程**

浏览器操作: 首页 → 点击"开始测试" → 答第1题 → 确认进度条和题号变化 → 逐题答完 20 题 → 确认跳转结果页。

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Quiz.jsx client/src/components/QuestionCard.jsx client/src/components/OptionCard.jsx
git commit -m "feat: 答题页面 — 题目卡片 + 选项交互"
```

---

### Task 7: 前端组件 — Result + RadarChart

**Files:**
- Create: `client/src/components/RadarChart.jsx`
- Create: `client/src/components/Result.jsx`

- [ ] **Step 1: RadarChart (SVG 实现)**

`client/src/components/RadarChart.jsx`:
```jsx
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
  const radius = 110
  const n = 12

  function polarToCart(r, angle) {
    return {
      x: cx + r * Math.cos(angle - Math.PI / 2),
      y: cy + r * Math.sin(angle - Math.PI / 2)
    }
  }

  // 背景网格
  const gridLevels = [0.25, 0.5, 0.75, 1]
  const gridPolygons = gridLevels.map(level =>
    Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n
      const p = polarToCart(radius * level, angle)
      return `${p.x},${p.y}`
    }).join(' ')
  )

  // 数据多边形
  const dataPoints = TYPE_KEYS.map((key, i) => {
    const score = animated ? Math.min(scores[key] || 0, maxScore) : 0
    const r = (score / maxScore) * radius
    const angle = (2 * Math.PI * i) / n
    return polarToCart(r, angle)
  })
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm mx-auto">
      {/* 网格 */}
      {gridPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}
      {/* 轴线 */}
      {Array.from({ length: n }, (_, i) => {
        const angle = (2 * Math.PI * i) / n
        const p = polarToCart(radius, angle)
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        )
      })}
      {/* 数据区域 */}
      <polygon
        points={dataPolygon}
        fill="rgba(168,85,247,0.2)"
        stroke="rgba(168,85,247,0.6)"
        strokeWidth="2"
        style={{ transition: 'all 1s ease-out' }}
      />
      {/* 标签 */}
      {LABELS.map((label, i) => {
        const angle = (2 * Math.PI * i) / n
        const p = polarToCart(radius + 20, angle)
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={COLORS[i]}
            fontSize="10"
            fontWeight="bold"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}
```

- [ ] **Step 2: Result 页**

`client/src/components/Result.jsx`:
```jsx
import { useEffect, useState } from 'react'
import RadarChart from './RadarChart'

export default function Result({ result, onRestart }) {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])

  const { personality, scores, type } = result

  // 处理混合类型
  const isHybrid = type.includes('_')
  const types = isHybrid ? type.split('_') : [type]

  return (
    <div className={`relative z-10 min-h-screen flex flex-col items-center px-4 py-8
      transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

      {/* 类型揭晓 */}
      <div className="text-center mb-6">
        <p className="text-slate-400 mb-2">你的游戏人格是</p>
        <div className="text-6xl mb-3">{personality.emoji}</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: personality.color }}>
          {personality.name}
        </h1>
        {isHybrid && (
          <p className="text-sm text-slate-500">混合型人格</p>
        )}
        <p className="text-lg text-slate-300 italic mt-2">
          "{personality.tagline}"
        </p>
      </div>

      {/* 描述 */}
      <div className="max-w-md text-center mb-6">
        <p className="text-slate-400 leading-relaxed">{personality.description}</p>
      </div>

      {/* 雷达图 */}
      <div className="mb-6 w-full max-w-sm">
        <RadarChart scores={scores} />
      </div>

      {/* 推荐游戏 */}
      <div className="max-w-md w-full mb-8">
        <h3 className="text-sm text-slate-500 uppercase tracking-wide mb-3">推荐游戏</h3>
        <div className="flex flex-wrap gap-2">
          {personality.games.map(game => (
            <span key={game} className="px-3 py-1.5 rounded-full bg-white/5
              border border-white/10 text-sm text-slate-300">
              {game}
            </span>
          ))}
        </div>
      </div>

      {/* 强弱项 */}
      <div className="max-w-md w-full grid grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="text-sm text-green-400 mb-2">优势</h3>
          <ul className="space-y-1">
            {personality.strengths.map(s => (
              <li key={s} className="text-sm text-slate-300">✓ {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm text-red-400 mb-2">注意</h3>
          <ul className="space-y-1">
            {personality.weaknesses.map(w => (
              <li key={w} className="text-sm text-slate-400">⚡ {w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 rounded-xl border border-white/20
            text-slate-300 hover:bg-white/10 transition-colors"
        >
          重新测试
        </button>
        <button
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600
            text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-colors"
        >
          分享结果
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 验证结果页**

完成 20 题答题，确认:
- 揭晓动画正常
- 人格名称/emoji/描述正确显示
- 雷达图动画绘制
- 推荐游戏列表显示
- "重新测试"按钮回到首页

- [ ] **Step 4: Commit**

```bash
git add client/src/components/Result.jsx client/src/components/RadarChart.jsx
git commit -m "feat: 结果页 — 人格揭晓 + 12维雷达图 + 游戏推荐"
```

---

### Task 8: 分享卡片 — 前端 Canvas 预览 + 后端生成

**Files:**
- Create: `client/src/components/ShareCard.jsx`, `client/src/utils/canvas.js`
- Create: `server/utils/shareCard.js`
- Modify: `server/routes/api.js`

- [ ] **Step 1: 前端 Canvas 预览**

`client/src/utils/canvas.js`:
```js
export function drawShareCard(canvas, personality, scores) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width  // 1080
  const h = canvas.height // 1920 或 1080

  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, h)
  gradient.addColorStop(0, '#0f0f23')
  gradient.addColorStop(1, '#1a1a3e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  // 类型名
  ctx.fillStyle = personality.color
  ctx.font = 'bold 72px "PingFang SC", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(personality.name, w / 2, 200)

  // Emoji
  ctx.font = '120px sans-serif'
  ctx.fillText(personality.emoji, w / 2, 380)

  // Tagline
  ctx.fillStyle = '#94a3b8'
  ctx.font = '36px "PingFang SC", sans-serif'
  ctx.fillText(`"${personality.tagline}"`, w / 2, 500)

  // 推荐游戏
  ctx.fillStyle = '#64748b'
  ctx.font = '28px "PingFang SC", sans-serif'
  ctx.fillText('推荐游戏', w / 2, 620)
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '24px "PingFang SC", sans-serif'
  personality.games.forEach((game, i) => {
    ctx.fillText(game, w / 2, 670 + i * 40)
  })

  // 底部水印
  ctx.fillStyle = '#334155'
  ctx.font = '20px "PingFang SC", sans-serif'
  ctx.fillText('游戏人格测试 · 来测测你的玩家标签', w / 2, h - 60)
}
```

`client/src/components/ShareCard.jsx`:
```jsx
import { useRef, useEffect, useState } from 'react'
import { drawShareCard } from '../utils/canvas'

export default function ShareCard({ personality, scores }) {
  const canvasRef = useRef(null)
  const [format, setFormat] = useState('square') // 'square' | 'moments'

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = 1080
    canvas.height = format === 'moments' ? 1920 : 1080
    drawShareCard(canvas, personality, scores)
  }, [personality, scores, format])

  const handleDownload = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `游戏人格_${personality.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        <button onClick={() => setFormat('square')}
          className={`px-3 py-1 rounded-lg text-sm transition-colors
            ${format === 'square' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'}`}>
          正方形 1:1
        </button>
        <button onClick={() => setFormat('moments')}
          className={`px-3 py-1 rounded-lg text-sm transition-colors
            ${format === 'moments' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'}`}>
          朋友圈 9:16
        </button>
      </div>
      <canvas ref={canvasRef} className="w-full max-w-sm mx-auto rounded-xl shadow-2xl" />
      <button
        onClick={handleDownload}
        className="w-full max-w-sm mx-auto block py-2.5 rounded-xl
          bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold
          hover:from-purple-500 hover:to-blue-500 transition-colors"
      >
        下载分享图
      </button>
    </div>
  )
}
```

- [ ] **Step 2: 后端分享图生成**

`server/utils/shareCard.js`:
```js
import { createCanvas } from 'canvas'

export function generateShareImage(personality, scores, format = 'square') {
  const w = 1080
  const h = format === 'moments' ? 1920 : 1080
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')

  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, h)
  gradient.addColorStop(0, '#0f0f23')
  gradient.addColorStop(1, '#1a1a3e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  // 类型名
  ctx.fillStyle = personality.color
  ctx.font = 'bold 72px "PingFang SC", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(personality.name, w / 2, 200)

  // Emoji
  ctx.font = '120px sans-serif'
  ctx.fillText(personality.emoji, w / 2, 380)

  // Tagline
  ctx.fillStyle = '#94a3b8'
  ctx.font = '36px "PingFang SC", sans-serif'
  ctx.fillText(`"${personality.tagline}"`, w / 2, 520)

  // 推荐游戏
  ctx.fillStyle = '#64748b'
  ctx.font = '28px "PingFang SC", sans-serif'
  ctx.fillText('推荐游戏', w / 2, 640)
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '24px "PingFang SC", sans-serif'
  personality.games.forEach((game, i) => {
    ctx.fillText(game, w / 2, 690 + i * 45)
  })

  // 底部水印
  ctx.fillStyle = '#334155'
  ctx.font = '20px "PingFang SC", sans-serif'
  ctx.fillText('游戏人格测试 · 来测测你的玩家标签', w / 2, h - 60)

  return canvas.toBuffer('image/png')
}
```

- [ ] **Step 3: 添加 /api/share/:id 路由**

在 `server/routes/api.js` 末尾添加:
```js
// GET /api/share/:id?format=moments|square
router.get('/share/:id', async (req, res) => {
  const result = getResult(req.params.id)
  if (!result) {
    return res.status(404).json({ error: '结果不存在' })
  }

  const personality = personalities[result.result_type]
  if (!personality) {
    return res.status(404).json({ error: '类型不存在' })
  }

  const format = req.query.format === 'moments' ? 'moments' : 'square'
  const { generateShareImage } = await import('../utils/shareCard.js')
  const buffer = generateShareImage(personality, result.scores, format)

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.send(buffer)
})
```

- [ ] **Step 4: 测试后端分享图**

```bash
# 先提交一次获取 resultId
curl -X POST http://localhost:3001/api/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":1,"optionIndex":0}]}'
# 记录返回的 resultId

# 获取分享图
curl http://localhost:3001/api/share/RESULT_ID_HERE?format=square -o test-share.png
# 预期: 生成 1080x1080 PNG 文件
```

- [ ] **Step 5: 将 ShareCard 集成到 Result 页**

在 `client/src/components/Result.jsx` 中"分享结果"按钮下方插入:
```jsx
<ShareCard personality={personality} scores={scores} />
```

- [ ] **Step 6: Commit**

```bash
git add client/src/components/ShareCard.jsx client/src/utils/canvas.js server/utils/shareCard.js server/routes/api.js
git commit -m "feat: 分享卡片 — 前端Canvas预览 + 后端png生成"
```

---

### Task 9: 后端统计对接 + 动画打磨 + 响应式

**Files:**
- Modify: `client/src/components/Landing.jsx` (接入真实统计数)
- Modify: `client/src/components/Result.jsx` (提交结果到后端)
- Modify: `client/src/hooks/useQuiz.js` (后端提交 + 新 hook)
- Create: `client/src/hooks/useStats.js`

- [ ] **Step 1: useStats hook**

`client/src/hooks/useStats.js`:
```js
import { useState, useEffect } from 'react'

export function useStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats({ total: 12847, counts: {} }))
  }, [])

  return stats
}
```

- [ ] **Step 2: Landing 页接入真实统计**

修改 `client/src/components/Landing.jsx`:
```jsx
import { useStats } from '../hooks/useStats'
// ...
export default function Landing({ onStart }) {
  const stats = useStats()
  // ...
  <p className="mt-8 text-sm text-slate-600">
    已有 {stats ? stats.total.toLocaleString() : '...'} 人完成测试
  </p>
```

- [ ] **Step 3: Result 页提交结果到后端**

修改 `client/src/hooks/useQuiz.js`，在 `answerQuestion` 的最后一道题完成后调用后端:
```js
// 在 setResult 之前添加
fetch('/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers: newAnswers })
}).catch(() => {})
```

- [ ] **Step 4: 响应式打磨**

确认以下断点适配:
- 320px (小手机): 所有文字可读、按钮可点
- 375-414px (主流手机): 最佳显示效果
- 768px+ (平板/桌面): 卡片居中，最大宽度 max-w-lg

在 `client/src/index.css` 追加:
```css
/* 触摸优化 */
@media (max-width: 640px) {
  button, a { min-height: 44px; }
  input, select, textarea { font-size: 16px; } /* 防止iOS缩放 */
}

/* 安全区域适配 */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

- [ ] **Step 5: 全流程端到端测试**

```bash
# 启动后端
cd server && node index.js &

# 启动前端
cd client && npm run dev &
```

测试流程:
1. 打开 http://localhost:5173
2. 首页加载 → 确认粒子背景 + 统计数字
3. 点击"开始测试"
4. 答完全部 20 题
5. 结果页展示 → 雷达图动画 → 分享卡片预览
6. 下载分享图
7. 点击"重新测试"回到首页
8. 手机浏览器测试 (localhost:5173 在同一 WiFi 下用手机访问)

- [ ] **Step 6: Commit**

```bash
git add client/src/hooks/useStats.js client/src/components/Landing.jsx client/src/hooks/useQuiz.js client/src/index.css
git commit -m "feat: 统计对接 + 后端提交 + 响应式打磨"
```

---

### Task 10: Nginx 配置 + 部署文档

**Files:**
- Create: `nginx.conf`
- Create: `DEPLOY.md`

- [ ] **Step 1: Nginx 配置**

`nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;
    root /opt/game-personality/client/dist;
    index index.html;

    # 前端静态文件
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

- [ ] **Step 2: 部署文档**

`DEPLOY.md`:
```markdown
# 游戏人格测试 · 部署指南

## 环境要求
- Alibaba Cloud Linux 3
- Node.js 18+
- Nginx 1.18+

## 部署步骤

### 1. 安装依赖
```bash
# 前端构建
cd client && npm install && npm run build
# 后端
cd server && npm install
```

### 2. 配置 Nginx
```bash
cp nginx.conf /etc/nginx/conf.d/game-personality.conf
nginx -t && systemctl reload nginx
```

### 3. 启动后端
```bash
cd server && nohup node index.js > /var/log/game-personality.log 2>&1 &
```

### 4. 验证
```bash
curl http://localhost/api/questions
curl http://localhost/
```
```

- [ ] **Step 3: Commit**

```bash
git add nginx.conf DEPLOY.md
git commit -m "feat: Nginx配置 + 部署文档"
```

---

## Plan Summary

| Task | 内容 | 文件数 |
|------|------|--------|
| 1 | 项目脚手架 | 10 |
| 2 | 数据层 (20题+12人格) | 4 |
| 3 | 后端 API | 3 |
| 4 | useQuiz hook + 页面切换 | 2 |
| 5 | Landing + 背景 + 进度条 | 3 |
| 6 | Quiz + QuestionCard + OptionCard | 3 |
| 7 | Result + RadarChart | 2 |
| 8 | ShareCard (前端+后端) | 4 |
| 9 | 统计对接 + 响应式 + E2E | 4 |
| 10 | Nginx + 部署文档 | 2 |

**总计: 10 个 Task，约 37 个文件**
