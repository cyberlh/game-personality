import { useState, useCallback, useMemo } from 'react'
import { questions } from '../data/questions'
import { getPersonality } from '../data/personalities'

const INIT_SCORES = {
  shouku: 0, tianliang: 0, saibo: 0, tianti: 0,
  chanxian: 0, fangkuai: 0, yuyin: 0, liusiBa: 0,
  laoliu: 0, gandi: 0, laoe: 0, cangshu: 0
}

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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [scores, setScores] = useState({ ...INIT_SCORES })
  const [selectedOption, setSelectedOption] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [result, setResult] = useState(null)

  const totalQuestions = questions.length
  const question = questions[currentQuestion]

  const startQuiz = useCallback(() => {
    setScreen('quiz')
    setCurrentQuestion(0)
    setAnswers([])
    setScores({ ...INIT_SCORES })
    setSelectedOption(null)
    setTransitioning(false)
    setResult(null)
  }, [])

  const selectAnswer = useCallback((optionIndex) => {
    if (transitioning) return
    setSelectedOption(optionIndex)
    setTransitioning(true)

    const newAnswers = [...answers, { questionId: question.id, optionIndex }]
    setAnswers(newAnswers)

    const option = question.options[optionIndex]
    const newScores = { ...scores }
    Object.entries(option.scores).forEach(([type, score]) => {
      newScores[type] = (newScores[type] || 0) + score
    })
    setScores(newScores)

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedOption(null)
        setTransitioning(false)
      } else {
        const finalResult = computeResult(newScores)
        setResult(finalResult)
        setScreen('result')

        fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers })
        }).catch(() => {})
      }
    }, 500)
  }, [currentQuestion, answers, scores, question, transitioning, totalQuestions])

  const goBack = useCallback(() => {
    if (transitioning || currentQuestion === 0) return
    const prevAnswers = answers.slice(0, -1)
    setAnswers(prevAnswers)

    // Recalculate scores
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
    setCurrentQuestion(prev => prev - 1)
  }, [currentQuestion, answers, transitioning])

  const progress = useMemo(() =>
    ((currentQuestion + (selectedOption !== null ? 1 : 0)) / totalQuestions) * 100,
    [currentQuestion, selectedOption, totalQuestions]
  )

  return {
    screen, currentQuestion, totalQuestions, question,
    answers, scores, selectedOption, transitioning, progress, result,
    startQuiz, selectAnswer, goBack
  }
}
