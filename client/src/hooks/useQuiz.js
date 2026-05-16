import { useState, useCallback, useMemo } from 'react'
import { questions, selectFocusedQuestions } from '../data/questions'
import { getPersonality } from '../data/personalities'

const INIT_SCORES = {
  shouku: 0, tianliang: 0, saibo: 0, tianti: 0,
  chanxian: 0, fangkuai: 0, yuyin: 0, liusiBa: 0,
  laoliu: 0, gandi: 0, laoe: 0, cangshu: 0,
}

const SCREENING_COUNT = 12
const FOCUSED_PER_CLUSTER = 5
const TOTAL_EXPECTED = SCREENING_COUNT + FOCUSED_PER_CLUSTER * 2

function computeResult(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  let resultType
  // Tighter tolerance for Likert scores (smaller numbers)
  if (sorted.length > 1 && sorted[0][1] - sorted[1][1] <= 1) {
    resultType = `${sorted[0][0]}_${sorted[1][0]}`
  } else {
    resultType = sorted[0][0]
  }
  const personality = getPersonality(resultType) || getPersonality(sorted[0][0])
  return { resultType, personality, scores }
}

export default function useQuiz() {
  const [screen, setScreen] = useState('landing')
  const [questionQueue, setQuestionQueue] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [scores, setScores] = useState({ ...INIT_SCORES })
  const [selectedOption, setSelectedOption] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [result, setResult] = useState(null)

  const question = questionQueue[questionIndex]
  const isScreeningPhase = question?.stage === 'screening'

  const startQuiz = useCallback(() => {
    const screening = questions.filter(q => q.stage === 'screening')
    setScreen('quiz')
    setQuestionQueue(screening)
    setQuestionIndex(0)
    setAnswers([])
    setScores({ ...INIT_SCORES })
    setSelectedOption(null)
    setTransitioning(false)
    setResult(null)
  }, [])

  const selectAnswer = useCallback((value) => {
    if (transitioning || !question) return
    setSelectedOption(value)
    setTransitioning(true)

    // Value is 1-5 → weight 0, 0.25, 0.5, 0.75, 1
    const weight = (value - 1) / 4
    const newAnswers = [...answers, { questionId: question.id, value }]
    setAnswers(newAnswers)

    const newScores = { ...scores }
    Object.entries(question.scores).forEach(([type, score]) => {
      newScores[type] = (newScores[type] || 0) + score * weight
    })
    setScores(newScores)

    setTimeout(() => {
      const isLastInQueue = questionIndex >= questionQueue.length - 1

      if (isLastInQueue && isScreeningPhase) {
        const focused = selectFocusedQuestions(newScores, FOCUSED_PER_CLUSTER)
        if (focused.length > 0) {
          setQuestionQueue(prev => [...prev, ...focused])
          setQuestionIndex(prev => prev + 1)
          setSelectedOption(null)
          setTransitioning(false)
          return
        }
      }

      if (!isLastInQueue) {
        setQuestionIndex(prev => prev + 1)
        setSelectedOption(null)
        setTransitioning(false)
      } else {
        const finalResult = computeResult(newScores)
        setResult(finalResult)
        setScreen('result')

        fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        }).catch(() => {})
      }
    }, 300)
  }, [question, questionIndex, questionQueue, answers, scores, transitioning, isScreeningPhase])

  const goBack = useCallback(() => {
    if (transitioning || questionIndex === 0) return
    const prevAnswers = answers.slice(0, -1)
    setAnswers(prevAnswers)

    const newScores = { ...INIT_SCORES }
    prevAnswers.forEach(a => {
      const q = questions.find(qq => qq.id === a.questionId)
      if (q) {
        const opt = q.options[a.optionIndex]
        if (opt) {
          Object.entries(opt.scores).forEach(([type, score]) => {
            newScores[type] = (newScores[type] || 0) + score
          })
        }
      }
    })
    setScores(newScores)
    setSelectedOption(null)
    setQuestionIndex(prev => prev - 1)
  }, [questionIndex, answers, transitioning])

  const progress = useMemo(() =>
    Math.min(100, ((answers.length + (selectedOption !== null ? 1 : 0)) / TOTAL_EXPECTED) * 100),
    [answers.length, selectedOption]
  )

  const phaseText = isScreeningPhase
    ? `筛选阶段 ${questionIndex + 1}/${SCREENING_COUNT}`
    : `深度分析 ${questionIndex + 1 - SCREENING_COUNT}/${questionQueue.length - SCREENING_COUNT}`

  const goToStats = useCallback(() => {
    setScreen('stats')
  }, [])

  const goToLanding = useCallback(() => {
    setScreen('landing')
  }, [])

  return {
    screen,
    currentQuestion: questionIndex,
    totalQuestions: TOTAL_EXPECTED,
    question,
    answers,
    scores,
    selectedOption,
    transitioning,
    progress,
    result,
    phaseText,
    startQuiz,
    selectAnswer,
    goBack,
    goToStats,
    goToLanding,
  }
}
