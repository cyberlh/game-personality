import useQuiz from './hooks/useQuiz'
import Landing from './components/Landing'
import Quiz from './components/Quiz'
import Result from './components/Result'
import ParticleBackground from './components/ParticleBackground'

export default function App() {
  const quiz = useQuiz()

  return (
    <div className="relative min-h-screen bg-[#0f0f23] text-white font-sans">
      <ParticleBackground />
      {quiz.screen === 'landing' && <Landing onStart={quiz.startQuiz} />}
      {quiz.screen === 'quiz' && (
        <Quiz
          question={quiz.question}
          currentQuestion={quiz.currentQuestion}
          totalQuestions={quiz.totalQuestions}
          selectedOption={quiz.selectedOption}
          transitioning={quiz.transitioning}
          onAnswer={quiz.selectAnswer}
          onBack={quiz.goBack}
        />
      )}
      {quiz.screen === 'result' && (
        <Result result={quiz.result} onRestart={quiz.startQuiz} />
      )}
    </div>
  )
}
