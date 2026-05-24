import { useState } from 'react';
import { WORLD_AREAS } from '../data/worldAreas';

function MapPath() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFB7C5" fillOpacity="0.6" />
        </marker>
      </defs>
      {/* Cozy Café → Anime School */}
      <path d="M 100 165 Q 200 80 220 75" stroke="#FFB7C5" strokeWidth="3" strokeDasharray="8 5"
        fill="none" strokeLinecap="round" opacity="0.7" markerEnd="url(#arrow)" />
      {/* Anime School → Marketplace */}
      <path d="M 220 75 Q 270 150 248 195" stroke="#C9B1FF" strokeWidth="3" strokeDasharray="8 5"
        fill="none" strokeLinecap="round" opacity="0.7" markerEnd="url(#arrow)" />
      {/* Cozy Café → Magic Forest */}
      <path d="M 100 165 Q 80 120 100 90" stroke="#B5EAD7" strokeWidth="3" strokeDasharray="8 5"
        fill="none" strokeLinecap="round" opacity="0.7" markerEnd="url(#arrow)" />
    </svg>
  );
}

function AreaNode({ area, userXP, isSelected, onClick }) {
  const isUnlocked = userXP >= area.requiredXP;
  const xpNeeded = area.requiredXP - userXP;

  return (
    <button
      onClick={() => isUnlocked && onClick(area)}
      style={{
        position: 'absolute',
        top: area.position.top,
        left: area.position.left,
        transform: 'translate(-50%, -50%)',
      }}
      className={`group flex flex-col items-center gap-1 transition-all duration-200
        ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
        ${isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'}
      `}
      title={isUnlocked ? area.name : `Unlock at ${area.requiredXP} XP`}
    >
      {/* Node */}
      <div className={`relative w-16 h-16 rounded-2xl border-3 shadow-lg flex items-center justify-center text-3xl
        transition-all duration-200
        ${isSelected ? `scale-110 shadow-xl border-4 ${area.borderColor}` : `border-2 ${area.borderColor}`}
        ${isUnlocked
          ? `bg-gradient-to-br ${area.color} group-hover:shadow-xl`
          : 'bg-gray-100 border-gray-300'
        }
      `}>
        {isUnlocked ? area.emoji : '🔒'}
        {/* Sparkle decoration */}
        {isUnlocked && isSelected && (
          <div className="absolute -top-1 -right-1 text-sm animate-sparkle">✨</div>
        )}
        {/* Dot indicator */}
        {isUnlocked && (
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${area.bgDot} rounded-full border-2 border-white shadow`} />
        )}
      </div>

      {/* Label */}
      <div className={`text-center max-w-[80px]`}>
        <span className={`text-xs font-black leading-tight block
          ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}
          ${isSelected ? 'text-gray-900' : ''}
        `}>
          {area.name}
        </span>
        {!isUnlocked && (
          <span className="text-xs font-bold text-gray-400">🔒 {area.requiredXP} XP</span>
        )}
      </div>
    </button>
  );
}

export default function WorldMap({ state, onNavigate, gainXP }) {
  const [selectedArea, setSelectedArea] = useState(null);

  function handleAreaClick(area) {
    setSelectedArea(area.id === selectedArea?.id ? null : area);
  }

  function handleGoToLesson() {
    if (selectedArea?.id === 'cozy-cafe') {
      onNavigate('lesson');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-black text-3xl text-cafe-brown mb-1">🗺️ World Map</h1>
        <p className="text-gray-500 font-medium text-sm">
          Explore new areas and unlock adventures! You have <strong className="text-yellow-600">{state.xp} XP</strong>
        </p>
      </div>

      {/* Map container */}
      <div className="anime-card overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <div className="relative w-full h-full min-h-[300px] max-h-[400px] 
          bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 overflow-hidden rounded-3xl">

          {/* Background decoration */}
          <div className="absolute inset-0">
            {/* Clouds */}
            <div className="absolute top-4 left-8 text-4xl opacity-20 animate-pulse-slow">☁️</div>
            <div className="absolute top-8 right-12 text-3xl opacity-15 animate-pulse-slow" style={{ animationDelay: '1s' }}>☁️</div>
            <div className="absolute bottom-8 left-16 text-2xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}>☁️</div>
            {/* Stars */}
            {['✨', '⭐', '🌟', '💫'].map((s, i) => (
              <div key={i} className="absolute text-sm opacity-30 animate-sparkle star-particle"
                style={{ left: `${15 + i * 22}%`, top: `${8 + (i % 2) * 15}%`, animationDelay: `${i * 0.7}s` }}>
                {s}
              </div>
            ))}
            {/* Decorative hills/terrain */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-200/40 to-transparent rounded-b-3xl" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-300/30 to-transparent rounded-b-3xl" />
          </div>

          <MapPath />

          {/* Area nodes */}
          {WORLD_AREAS.map(area => (
            <AreaNode
              key={area.id}
              area={area}
              userXP={state.xp}
              isSelected={selectedArea?.id === area.id}
              onClick={handleAreaClick}
            />
          ))}
        </div>
      </div>

      {/* Selected area detail */}
      {selectedArea ? (
        <div className={`anime-card p-5 bg-gradient-to-br ${selectedArea.color} border-2 ${selectedArea.borderColor}`}>
          <div className="flex items-start gap-4">
            <div className="text-5xl animate-bounce-soft flex-shrink-0">{selectedArea.emoji}</div>
            <div className="flex-1">
              <h2 className="font-black text-xl text-gray-800 mb-1">{selectedArea.name}</h2>
              <p className="text-gray-600 font-medium text-sm mb-3">{selectedArea.description}</p>

              {/* Sparkle decorations */}
              <div className="flex gap-2 mb-3">
                {selectedArea.sparkles.map((s, i) => (
                  <span key={i} className="text-lg animate-sparkle" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>
                ))}
              </div>

              {state.xp >= selectedArea.requiredXP ? (
                <button
                  onClick={handleGoToLesson}
                  className={`btn-primary ${selectedArea.id !== 'cozy-cafe' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={selectedArea.id !== 'cozy-cafe'}
                >
                  {selectedArea.id === 'cozy-cafe' ? '📖 Start Lesson →' : '🔜 Coming Soon!'}
                </button>
              ) : (
                <div className="bg-white/60 rounded-2xl p-3 border border-gray-200">
                  <p className="text-gray-600 font-bold text-sm">
                    🔒 Need <strong className="text-orange-500">{selectedArea.requiredXP - state.xp} more XP</strong> to unlock!
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Complete lessons and quizzes to earn XP ⭐</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Area list */
        <div className="grid grid-cols-2 gap-3">
          {WORLD_AREAS.map(area => {
            const isUnlocked = state.xp >= area.requiredXP;
            return (
              <button
                key={area.id}
                onClick={() => isUnlocked && setSelectedArea(area)}
                className={`anime-card p-4 text-left transition-all duration-200
                  ${isUnlocked
                    ? `bg-gradient-to-br ${area.color} border-2 ${area.borderColor} ${area.hoverColor} hover:shadow-xl cursor-pointer`
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60 cursor-not-allowed'
                  }
                `}
              >
                <div className="text-2xl mb-2">{isUnlocked ? area.emoji : '🔒'}</div>
                <div className="font-black text-sm text-gray-700">{area.name}</div>
                {!isUnlocked && (
                  <div className="text-xs text-gray-400 font-bold mt-1">{area.requiredXP} XP needed</div>
                )}
                {isUnlocked && (
                  <div className={`w-2 h-2 rounded-full ${area.bgDot} mt-2`} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="anime-card p-3 bg-amber-50 border-amber-200">
        <h3 className="font-bold text-amber-700 text-sm mb-2">📍 Map Guide</h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-600">
          <div>✅ Tap an area to explore</div>
          <div>🔒 Locked = need more XP</div>
          <div>🔥 Keep your streak for bonus XP</div>
          <div>⭐ Earn XP in lessons & quizzes</div>
        </div>
      </div>
    </div>
  );
}
