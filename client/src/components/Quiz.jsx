import React from 'react';

export default function Quiz({ currentQuestion, answers, selectAnswer }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <p className="text-gray-400 mb-4">
        问题 {currentQuestion + 1} / 10
      </p>
      <div className="glass rounded-2xl p-6 w-full max-w-md">
        <p className="text-xl text-center mb-6">
          加载中...
        </p>
        {/* QuestionCard and Options will be implemented in subsequent tasks */}
      </div>
    </div>
  );
}
