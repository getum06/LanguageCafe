import { useState } from 'react';
import { getWorlds, isWorldUnlocked } from '../data/worlds';

function MapPath() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFB7C5" fillOpacity="0.6" />
        </marker>
      </defs>
      <path d="M 100 165 Q 200 80 220 75" stroke="#FFB7C5" strokeWidth="3" strokeDasharray="8 5"
        fill="none" strokeLinecap="round" opacity="0.7" markerEnd="url(#arrow)" />
      <path d="M 220 75 Q 270 150 248 195" stroke="#C9B1FF" strokeWidth="3" strokeDasharray="8 5"
        fill="none" strokeLinecap="round" opacity="0.7" markerEnd="url(#arrow)" />
      <path d="M 100 165 Q 80 120 100 90" stroke="#B5EAD7" strokeWidth="3" strokeDasharray="8 5"
        fill="none" strokeLinecap="round" opacity="0.7" markerEnd="url(#arrow)" />
    </svg>
  );
}

function WorldNode({ world, isSelected, onClick }) {
  const { unlocked, xpNeeded } = world;

  return (
    <button
      type="button"
      onClick={() => unlocked && onClick(world)}
      disabled={!unlocked}
      style={{
        position: 'absolute',
        top: world.position.top,
        left: world.position.left,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={unlocked ? world.name : `${world.name} — locked, need ${xpNeeded} more XP`}
      className={`group flex flex-col items-center gap-1 transition-all duration-200
        ${unlocked ? 'cursor-pointer z-10 hover:scale-105' : 'cursor-not-allowed z-0'}
        ${isSelected && unlocked ? 'scale-110 z-20' : ''}
      `}
    >
      <div
        className={`relative w-16 h-16 rounded-2xl border-2 shadow-lg flex items-center justify-center text-3xl
          transition-all duration-200
          ${isSelected && unlocked ? `scale-110 shadow-xl border-4 ${world.borderColor}` : world.borderColor}
          ${unlocked
            ? `bg-gradient-to-br ${world.color} group-hover:shadow-xl`
            : 'bg-gray-200/80 border-gray-300 blur-[1px] grayscale opacity-70'
          }`}
      >
        {unlocked ? world.emoji : (
          <span className="relative">
            <span className="opacity-30 grayscale">{world.emoji}</span>
            <span className="absolute inset-0 flex items-center justify-center text-xl">🔒</span>
          </span>
        )}
        {unlocked && isSelected && (
          <div className="absolute -top-1 -right-1 text-sm animate-sparkle">✨</div>
        )}
        {unlocked && (
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${world.bgDot} rounded-full border-2 border-white shadow`} />
        )}
      </div>

      <div className={`text-center max-w-[88px] ${!unlocked ? 'opacity-80' : ''}`}>
        <span className={`text-xs font-black leading-tight block
          ${unlocked ? 'text-gray-700' : 'text-gray-400 blur-[0.3px]'}
          ${isSelected && unlocked ? 'text-gray-900' : ''}
        `}>
          {world.name}
        </span>
        {!unlocked && (
          <span className="text-[10px] font-bold text-orange-500 block mt-0.5">
            🔒 {xpNeeded} XP
          </span>
        )}
      </div>
    </button>
  );
}

function WorldListCard({ world, onSelect }) {
  const { unlocked, xpNeeded } = world;

  return (
    <button
      type="button"
      onClick={() => unlocked && onSelect(world)}
      disabled={!unlocked}
      className={`anime-card p-4 text-left transition-all duration-200 relative overflow-hidden
        ${unlocked
          ? `bg-gradient-to-br ${world.color} border-2 ${world.borderColor} ${world.hoverColor} hover:shadow-xl cursor-pointer`
          : 'bg-gray-100/80 border-2 border-gray-200 cursor-not-allowed opacity-75'
        }`}
    >
      {!unlocked && (
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 pointer-events-none" />
      )}
      <div className="relative z-10">
        <div className="text-2xl mb-2 flex items-center gap-2">
          {unlocked ? world.emoji : (
            <>
              <span className="opacity-40 grayscale">{world.emoji}</span>
              <span className="text-lg">🔒</span>
            </>
          )}
        </div>
        <div className={`font-black text-sm ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
          {world.name}
        </div>
        <p className={`text-xs mt-1 line-clamp-2 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {world.description}
        </p>
        {!unlocked ? (
          <div className="text-xs font-bold text-orange-500 mt-2">
            Need {xpNeeded} more XP ({world.unlockXP} total)
          </div>
        ) : (
          <div className={`w-2 h-2 rounded-full ${world.bgDot} mt-2`} />
        )}
      </div>
    </button>
  );
}

export default function WorldMap({ state, onNavigate, selectWorld }) {
  const worlds = getWorlds(state.xp);
  const [selectedWorld, setSelectedWorld] = useState(null);

  function openWorld(world) {
    selectWorld(world.id);
    onNavigate('lesson-select');
  }

  function handleWorldClick(world) {
    if (isWorldUnlocked(world.id, state.xp)) {
      openWorld(world);
    } else {
      setSelectedWorld(prev => (prev?.id === world.id ? null : world));
    }
  }

  const selectedUnlocked = selectedWorld && isWorldUnlocked(selectedWorld.id, state.xp);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-black text-3xl text-cafe-brown mb-1">🗺️ World Map</h1>
        <p className="text-gray-500 font-medium text-sm">
          Explore worlds and unlock adventures! You have{' '}
          <strong className="text-yellow-600">{state.xp} XP</strong>
        </p>
        <p className="text-xs text-gray-400 font-bold mt-1">
          {getWorlds(state.xp).filter(w => w.unlocked).length} of {worlds.length} worlds unlocked
        </p>
      </div>

      <div className="anime-card overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <div className="relative w-full h-full min-h-[300px] max-h-[400px]
          bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 overflow-hidden rounded-3xl">

          <div className="absolute inset-0">
            <div className="absolute top-4 left-8 text-4xl opacity-20 animate-pulse-slow">☁️</div>
            <div className="absolute top-8 right-12 text-3xl opacity-15 animate-pulse-slow" style={{ animationDelay: '1s' }}>☁️</div>
            <div className="absolute bottom-8 left-16 text-2xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}>☁️</div>
            {['✨', '⭐', '🌟', '💫'].map((s, i) => (
              <div
                key={s}
                className="absolute text-sm opacity-30 animate-sparkle star-particle"
                style={{ left: `${15 + i * 22}%`, top: `${8 + (i % 2) * 15}%`, animationDelay: `${i * 0.7}s` }}
              >
                {s}
              </div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-200/40 to-transparent rounded-b-3xl" />
          </div>

          <MapPath />

          {worlds.map(world => (
            <WorldNode
              key={world.id}
              world={world}
              isSelected={selectedWorld?.id === world.id}
              onClick={handleWorldClick}
            />
          ))}
        </div>
      </div>

      {selectedWorld ? (
        <div
          className={`anime-card p-5 border-2 transition-all duration-300
            ${selectedUnlocked
              ? `bg-gradient-to-br ${selectedWorld.color} ${selectedWorld.borderColor}`
              : 'bg-gray-100 border-gray-300 opacity-80'
            }`}
        >
          <div className="flex items-start gap-4">
            <div className={`text-5xl flex-shrink-0 ${selectedUnlocked ? 'animate-bounce-soft' : 'grayscale opacity-50'}`}>
              {selectedUnlocked ? selectedWorld.emoji : '🔒'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="font-black text-xl text-gray-800">{selectedWorld.name}</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 text-gray-600 border border-white/80">
                  {selectedWorld.theme}
                </span>
              </div>
              <p className={`font-medium text-sm mb-3 ${selectedUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {selectedWorld.description}
              </p>

              {selectedUnlocked && (
                <div className="flex gap-2 mb-3">
                  {selectedWorld.sparkles.map((s, i) => (
                    <span key={s} className="text-lg animate-sparkle" style={{ animationDelay: `${i * 0.3}s` }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {selectedUnlocked ? (
                <button type="button" onClick={() => openWorld(selectedWorld)} className="btn-primary">
                  📖 Browse Lessons →
                </button>
              ) : (
                <div className="bg-white/70 rounded-2xl p-3 border border-gray-200 backdrop-blur-sm">
                  <p className="text-gray-600 font-bold text-sm flex items-center gap-2">
                    <span className="text-lg">🔒</span>
                    Locked — need{' '}
                    <strong className="text-orange-500">{selectedWorld.xpNeeded} more XP</strong>
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Unlock at {selectedWorld.unlockXP} XP · you have {state.xp} XP
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {worlds.map(world => (
            <WorldListCard key={world.id} world={world} onSelect={handleWorldClick} />
          ))}
        </div>
      )}

      <div className="anime-card p-3 bg-amber-50 border-amber-200">
        <h3 className="font-bold text-amber-700 text-sm mb-2">📍 World unlocks</h3>
        <div className="space-y-1.5 text-xs font-medium text-gray-600">
          {worlds.map(w => (
            <div key={w.id} className="flex justify-between items-center gap-2">
              <span className={w.unlocked ? 'text-green-600' : 'text-gray-400'}>
                {w.unlocked ? '✅' : '🔒'} {w.name}
              </span>
              <span className={w.unlocked ? 'text-green-600 font-bold' : 'text-orange-500 font-bold'}>
                {w.unlocked ? 'Unlocked' : `${w.unlockXP} XP`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
