import { useState } from 'react';
import { CHARACTERS } from '../data/characters';

export default function CharacterSelect({ state, onNavigate, selectCharacter }) {
  const [selected, setSelected] = useState(state.selectedCharacter);
  const [confirmed, setConfirmed] = useState(false);

  function handleSelect(id) {
    setSelected(id);
    setConfirmed(false);
  }

  function handleConfirm() {
    if (!selected) return;
    selectCharacter(selected);
    setConfirmed(true);
    setTimeout(() => onNavigate('home'), 1200);
  }

  const chars = Object.values(CHARACTERS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-3 animate-float inline-block">🌸</div>
        <h1 className="font-black text-3xl text-cafe-brown mb-2">Choose Your Buddy!</h1>
        <p className="text-gray-500 font-medium">
          Your AI friend will guide you, cheer you on, and make learning fun! 
          You can change them anytime~
        </p>
      </div>

      {/* Character Cards */}
      <div className="grid gap-4">
        {chars.map((char) => {
          const isSelected = selected === char.id;
          const isCurrent = state.selectedCharacter === char.id;
          return (
            <button
              key={char.id}
              onClick={() => handleSelect(char.id)}
              className={`w-full text-left anime-card p-5 transition-all duration-300
                ${isSelected
                  ? `border-4 ${char.borderColor} scale-[1.02] shadow-xl`
                  : 'border-2 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${char.color} 
                  flex items-center justify-center text-5xl shadow-md border-2 ${char.borderColor}
                  flex-shrink-0 transition-all duration-300
                  ${isSelected ? 'scale-110 shadow-lg' : ''}
                `}>
                  {char.emoji}
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2 bg-green-400 text-white text-xs 
                      font-black rounded-full px-1.5 py-0.5 border-2 border-white shadow">
                      ✓
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-xl text-gray-800">{char.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full 
                      bg-gradient-to-r ${char.color} ${char.borderColor} border`}>
                      {char.personality}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed mb-2">
                    {char.description}
                  </p>
                  <div className={`text-sm font-black italic 
                    ${char.id === 'yumi' ? 'text-pink-500' : char.id === 'kai' ? 'text-blue-500' : 'text-purple-600'}`}>
                    "{char.catchphrase}"
                  </div>
                </div>

                {/* Select indicator */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
                  ${isSelected ? `${char.borderColor} bg-gradient-to-br ${char.color}` : 'border-gray-300'}`}>
                  {isSelected && <span className="text-xs">✓</span>}
                </div>
              </div>

              {/* Example messages when selected */}
              {isSelected && (
                <div className={`mt-4 p-3 rounded-2xl ${char.bgColor} border ${char.borderColor}`}>
                  <p className="text-xs font-bold text-gray-500 mb-2">When you get an answer right, {char.name} says:</p>
                  <div className="space-y-1">
                    {char.correct.slice(0, 2).map((msg, i) => (
                      <p key={i} className="text-sm font-bold text-gray-700">• {msg}</p>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirm Button */}
      {selected && (
        <div className="sticky bottom-24 z-10">
          <button
            onClick={handleConfirm}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg 
              border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
              ${confirmed
                ? 'bg-green-400 border-green-500 text-white'
                : `bg-gradient-to-r ${CHARACTERS[selected].color} ${CHARACTERS[selected].borderColor} text-cafe-brown`
              }
            `}
          >
            {confirmed
              ? `✓ ${CHARACTERS[selected].name} chosen! Taking you home...`
              : `✨ Choose ${CHARACTERS[selected].name}!`
            }
          </button>
        </div>
      )}

      {/* Already selected note */}
      {state.selectedCharacter && (
        <div className="text-center text-sm text-gray-400 font-medium">
          Currently playing with: {CHARACTERS[state.selectedCharacter].emoji} {CHARACTERS[state.selectedCharacter].name}
        </div>
      )}
    </div>
  );
}
