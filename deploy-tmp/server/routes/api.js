import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { saveResult, getResult, getStats } from '../models/result.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const router = Router()

// Load question and personality data
const questionsPath = resolve(__dirname, '..', 'data', 'questions.json')
const personalitiesPath = resolve(__dirname, '..', 'data', 'personalities.json')
const questions = JSON.parse(readFileSync(questionsPath, 'utf-8'))
const personalities = JSON.parse(readFileSync(personalitiesPath, 'utf-8'))

// GET /api/questions — return all questions without scores
router.get('/questions', (req, res) => {
  const sanitized = questions.map(q => ({
    id: q.id,
    text: q.text,
    stage: q.stage || 'screening',
    cluster: q.cluster || null,
    options: q.options.map(o => ({
      label: o.label,
      text: o.text
    }))
  }))
  res.json(sanitized)
})

// POST /api/submit — calculate result from answers
router.post('/submit', (req, res) => {
  const { answers } = req.body
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers array is required' })
  }

  // Initialize scores for all personality types
  const scores = {}
  for (const key of Object.keys(personalities)) {
    scores[key] = 0
  }

  // Calculate scores from answers
  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId)
    if (!question) continue
    const option = question.options[answer.optionIndex]
    if (!option) continue
    for (const [type, points] of Object.entries(option.scores)) {
      scores[type] = (scores[type] || 0) + points
    }
  }

  // Sort scores descending
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])

  // Determine result type (handle ties: if top two within 2 points, create hybrid)
  let resultType
  if (sorted.length >= 2 && sorted[0][1] - sorted[1][1] <= 2) {
    resultType = `${sorted[0][0]}_${sorted[1][0]}`
  } else {
    resultType = sorted[0][0]
  }

  const id = uuidv4()

  // Get personality metadata for the result
  const resultPersonalities = resultType.includes('_')
    ? resultType.split('_').map(t => personalities[t]).filter(Boolean)
    : [personalities[resultType]]

  saveResult(id, answers, scores, resultType)

  res.json({
    id,
    resultType,
    personalities: resultPersonalities,
    scores
  })
})

// GET /api/result/:id — retrieve a historical result
router.get('/result/:id', (req, res) => {
  const result = getResult(req.params.id)
  if (!result) {
    return res.status(404).json({ error: 'Result not found' })
  }

  const resultPersonalities = result.result_type.includes('_')
    ? result.result_type.split('_').map(t => personalities[t]).filter(Boolean)
    : [personalities[result.result_type]]

  res.json({
    id: result.id,
    resultType: result.result_type,
    answers: result.answers,
    scores: result.scores,
    personalities: resultPersonalities,
    createdAt: result.created_at
  })
})

// GET /api/stats — aggregate statistics
router.get('/stats', (req, res) => {
  const stats = getStats()
  res.json(stats)
})

export default router
