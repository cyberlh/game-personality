import { useState, useCallback } from 'react';

export default function useQuiz() {
  const [screen, setScreen] = useState('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const startQuiz = useCallback(() => {
    setScreen('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  }, []);

  const selectAnswer = useCallback((option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < 9) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Submit and get result
      fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: newAnswers }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
          setScreen('result');
        })
        .catch(() => {
          // Fallback: navigate to result anyway
          setScreen('result');
        });
    }
  }, [answers, currentQuestion]);

  const restart = useCallback(() => {
    setScreen('landing');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  }, []);

  return {
    screen,
    currentQuestion,
    answers,
    result,
    startQuiz,
    selectAnswer,
    restart,
  };
}
