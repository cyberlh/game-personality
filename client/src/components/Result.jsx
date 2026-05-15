import React from 'react';

export default function Result({ result, restart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-3xl font-bold neon-glow mb-4">你的游戏人格</h2>
      {result ? (
        <div className="glass rounded-2xl p-6 w-full max-w-md text-center">
          <p className="text-2xl font-bold text-neon-cyan mb-2">{result.type}</p>
          <p className="text-gray-300 mb-6">{result.description}</p>
        </div>
      ) : (
        <p className="text-gray-400">计算中...</p>
      )}
      <button
        onClick={restart}
        className="mt-6 px-6 py-2 rounded-xl border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white transition-colors"
      >
        重新测试
      </button>
    </div>
  );
}
