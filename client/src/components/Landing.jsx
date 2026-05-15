import React from 'react';

export default function Landing({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold neon-glow mb-4">游戏人格测试</h1>
      <p className="text-lg text-gray-300 mb-8 text-center">
        回答10个问题，发现你的游戏人格
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold text-lg transition-transform hover:scale-105 active:scale-95"
      >
        开始测试
      </button>
    </div>
  );
}
