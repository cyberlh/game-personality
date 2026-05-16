import { useState, useCallback, useMemo } from 'react'
import { questions, selectFocusedQuestions } from '../data/questions'
import { getPersonality } from '../data/personalities'

const INIT_SCORES = {
  shouku: 0, tianliang: 0, saibo: 0, tianti: 0,
  chanxian: 0, fangkuai: 0, yuyin: 0, liusiBa: 0,
  laoliu: 0, gandi: 0, laoe: 0, cangshu: 0,
}

const SCREENING_COUNT = 6
const FOCUSED_PER_CLUSTER = 3
const TOTAL_EXPECTED = SCREENING_COUNT + FOCUSED_PER_CLUSTER * 2

function computeResult(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  let resultType
  if (sorted.length > 1 && sorted[0][1] - sorted[1][1] <= 2) {
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

  const selectAnswer = useCallback((optionIndex) => {
    if (transitioning || !question) return
    setSelectedOption(optionIndex)
    setTransitioning(true)

    const option = question.options[optionIndex]
    const newAnswers = [...answers, { questionId: question.id, optionIndex }]
    setAnswers(newAnswers)

    const newScores = { ...scores }
    Object.entries(option.scores).forEach(([type, score]) => {
      newScores[type] = (newScores[type] || 0) + score
    })
    setScores(newScores)

    setTimeout(() => {
      const isLastInQueue = questionIndex >= questionQueue.length - 1

      if (isLastInQueue && isScreeningPhase) {
        // Expand queue with focused questions based on screening scores
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
        // Quiz complete — compute final result
        const finalResult = computeResult(newScores)
        setResult(finalResult)
        setScreen('result')

        fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        }).catch(() => {})
      }
    }, 500)
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
