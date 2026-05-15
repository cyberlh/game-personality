import React from 'react';
import useQuiz from './hooks/useQuiz';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import Result from './components/Result';

export default function App() {
  const { screen, ...quizProps } = useQuiz();

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      {screen === 'landing' && <Landing onStart={quizProps.startQuiz} />}
      {screen === 'quiz' && <Quiz {...quizProps} />}
      {screen === 'result' && <Result {...quizProps} />}
    </div>
  );
}
