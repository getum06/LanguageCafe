import { useState, useEffect } from 'react';
import { CHARACTERS } from '../data/characters';

const FLOATING_ITEMS = ['☕', '🌸', '✨', '🍰', '⭐', '💕', '🧁', '🌙'];

function FloatingParticle({ emoji, style }) {
  return (
    <div className="absolute pointer-events-none animate-bounce-soft text-2xl" style={style}>
      {emoji}
    </div>
  );
}

export default function HomePage({ state, onNavigate, gainXP }) {
  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : null;
  const [particles] = useState(() =>
    FLOATING_ITEMS.map((emoji, i) => ({
      emoji,
      style: {
        left: `${8 + (i * 12) % 85}%`,
        top: `${10 + (i * 17) % 70}%`,
        animationDelay: `${i * 0.4}s`,
        opacity: 0.4,
        fontSize: `${1 + (i % 3) * 0.4}rem`,
      },
    }))
  );

  const level = Math.floor(state.xp / 100) + 1;
  const xpToNext = 100;
  const xpProgress = (state.xp % xpToNext) / xpToNext * 100;

  const [greeting] = useState(() => {
    if (!character) return null;
    const greets = CHARACTERS[state.selectedCharacter]?.greetings || [];
    return greets[Math.floor(Math.random() * greets.length)];
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-200 via-purple-100 to-blue-200 p-6 border-2 border-pink-200 shadow-lg min-h-[180px]">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-black text-3xl text-cafe-brown mb-1">
                Lingo<span className="text-pink-500">Café</span> Quest ☕
              </h1>
              <p className="text-purple-700 font-semibold text-sm">
                Your cozy Japanese-style language adventure!
              </p>
            </div>
            <div className="text-5xl animate-float">☕</div>
          </div>

          {/* Daily streak */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-3 py-1.5 flex items-center gap-1.5 font-bold text-sm text-orange-600 shadow-sm">
              🔥 {state.streak} Day Streak
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-3 py-1.5 flex items-center gap-1.5 font-bold text-sm text-yellow-600 shadow-sm">
              ⭐ Level {level}
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-3 py-1.5 flex items-center gap-1.5 font-bold text-sm text-pink-600 shadow-sm">
              {Array(state.hearts).fill('❤️').join('')}{Array(5 - state.hearts).fill('🖤').join('')}
            </div>
          </div>
        </div>
      </div>

      {/* Character Greeting */}
      {character ? (
        <div className={`anime-card p-4 ${character.bgColor} border-2 ${character.borderColor}`}>
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${character.color} 
              flex items-center justify-center text-4xl shadow-md border-2 ${character.borderColor} flex-shrink-0 animate-bounce-soft`}>
              {character.emoji}
            </div>
            <div className="flex-1">
              <div className="speech-bubble">
                <p className="font-bold text-gray-700">
                  {greeting || character.catchphrase}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-2 font-semibold">
                — {character.name} ({character.personality})
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onNavigate('character-select')}
          className="w-full anime-card p-5 border-dashed border-2 border-pink-300 bg-pink-50 
            hover:bg-pink-100 transition-colors text-center group"
        >
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🌸</div>
          <h3 className="font-black text-pink-600 text-lg">Choose Your AI Buddy!</h3>
          <p className="text-gray-500 text-sm mt-1">Pick Yumi, Kai, or Luna to guide your journey</p>
        </button>
      )}

      {/* XP Progress */}
      <div className="anime-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-gray-700">⭐ XP Progress</span>
          <span className="text-sm font-bold text-gray-400">{state.xp} total XP</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-400 rounded-full xp-fill"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-bold mt-1">
          <span>Level {level}</span>
          <span>{state.xp % xpToNext}/{xpToNext} XP to Level {level + 1}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('lesson')}
          className="anime-card p-5 bg-gradient-to-br from-pink-50 to-rose-50 
            hover:from-pink-100 hover:to-rose-100 transition-colors text-left group glow-pink"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📖</div>
          <h3 className="font-black text-gray-800 text-base">Today's Lesson</h3>
          <p className="text-xs text-gray-500 mt-1">Ordering at a Café ☕</p>
          <div className="mt-2 text-xs font-bold text-pink-500">+50 XP →</div>
        </button>

        <button
          onClick={() => onNavigate('quiz')}
          className="anime-card p-5 bg-gradient-to-br from-purple-50 to-violet-50 
            hover:from-purple-100 hover:to-violet-100 transition-colors text-left group glow-purple"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
          <h3 className="font-black text-gray-800 text-base">Quick Quiz</h3>
          <p className="text-xs text-gray-500 mt-1">Test your Spanish!</p>
          <div className="mt-2 text-xs font-bold text-purple-500">+75 XP →</div>
        </button>

        <button
          onClick={() => onNavigate('chat')}
          className="anime-card p-5 bg-gradient-to-br from-mint-50 to-green-50 
            hover:from-green-100 hover:to-emerald-100 transition-colors text-left group glow-mint"
          style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' }}
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💬</div>
          <h3 className="font-black text-gray-800 text-base">Chat Practice</h3>
          <p className="text-xs text-gray-500 mt-1">Talk with your buddy!</p>
          <div className="mt-2 text-xs font-bold text-green-600">+30 XP →</div>
        </button>

        <button
          onClick={() => onNavigate('world-map')}
          className="anime-card p-5 bg-gradient-to-br from-blue-50 to-cyan-50 
            hover:from-blue-100 hover:to-cyan-100 transition-colors text-left group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🗺️</div>
          <h3 className="font-black text-gray-800 text-base">World Map</h3>
          <p className="text-xs text-gray-500 mt-1">Explore new areas!</p>
          <div className="mt-2 text-xs font-bold text-blue-500">4 worlds →</div>
        </button>
      </div>

      {/* Daily Progress */}
      <div className="anime-card p-4">
        <h3 className="font-black text-gray-700 mb-3">📅 Your Progress</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-pink-50 rounded-2xl p-3 border border-pink-200">
            <div className="text-2xl font-black text-pink-500">{state.completedLessons.length}</div>
            <div className="text-xs font-bold text-gray-500 mt-1">Lessons Done</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-3 border border-purple-200">
            <div className="text-2xl font-black text-purple-500">{state.completedQuizzes.length}</div>
            <div className="text-xs font-bold text-gray-500 mt-1">Quizzes Done</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3 border border-orange-200">
            <div className="text-2xl font-black text-orange-500">{state.xp}</div>
            <div className="text-xs font-bold text-gray-500 mt-1">Total XP</div>
          </div>
        </div>
      </div>

      {/* Fun facts */}
      <div className="anime-card p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <h3 className="font-black text-amber-700 mb-2">✨ Did you know?</h3>
        <p className="text-gray-600 text-sm font-medium">
          Spanish is spoken by over <strong>500 million</strong> people worldwide! 
          It's the 2nd most spoken language on Earth. ¡Increíble! 🌍
        </p>
      </div>
    </div>
  );
}
