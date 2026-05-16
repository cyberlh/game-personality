import { AnimatePresence, motion } from 'framer-motion'
import useQuiz from './hooks/useQuiz'
import Header from './components/Header'
import Landing from './components/Landing'
import Quiz from './components/Quiz'
import Result from './components/Result'
import Stats from './components/Stats'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.25, ease: 'easeIn' } },
}

export default function App() {
  const quiz = useQuiz()

  return (
    <div className="relative min-h-screen bg-[#0f0f23] text-white font-sans flex flex-col">
      <ParticleBackground />
      <Header />
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {quiz.screen === 'landing' && (
            <motion.div key="landing" className="flex-1 flex flex-col" {...pageVariants}>
              <Landing onStart={quiz.startQuiz} onStats={quiz.goToStats} />
            </motion.div>
          )}
          {quiz.screen === 'quiz' && (
            <motion.div key="quiz" className="flex-1 flex flex-col" {...pageVariants}>
              <Quiz
                question={quiz.question}
                currentQuestion={quiz.currentQuestion}
                totalQuestions={quiz.totalQuestions}
                selectedOption={quiz.selectedOption}
                transitioning={quiz.transitioning}
                onAnswer={quiz.selectAnswer}
                onBack={quiz.goBack}
                phaseText={quiz.phaseText}
              />
            </motion.div>
          )}
          {quiz.screen === 'result' && (
            <motion.div key="result" className="flex-1 flex flex-col" {...pageVariants}>
              <Result result={quiz.result} onRestart={quiz.startQuiz} />
            </motion.div>
          )}
          {quiz.screen === 'stats' && (
            <motion.div key="stats" className="flex-1 flex flex-col" {...pageVariants}>
              <Stats onStart={quiz.startQuiz} onBack={quiz.goToLanding} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {quiz.screen === 'landing' && <Footer />}
    </div>
  )
}
