import { useState } from 'react';
import { LANGUAGE_LIST } from '../data/languages';

export default function LanguageSelect({ state, onNavigate, selectLanguage }) {
  const [selected, setSelected] = useState(state.selectedLanguage || null);
  const [confirmed, setConfirmed] = useState(false);

  const currentLang = LANGUAGE_LIST.find(l => l.id === selected);

  function handleConfirm() {
    if (!selected) return;
    selectLanguage(selected);
    setConfirmed(true);
    // Go to character select if no character chosen yet, else home
    setTimeout(() => {
      onNavigate(state.selectedCharacter ? 'home' : 'character-select');
    }, 900);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-2">
        <div className="text-5xl mb-3 animate-float inline-block">🌍</div>
        <h1 className="font-black text-3xl text-cafe-brown mb-2">
          What do you want to learn?
        </h1>
        <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto">
          Pick a language and start your cozy café adventure! You can change it later anytime~
        </p>
      </div>

      {/* Language cards grid */}
      <div className="grid grid-cols-1 gap-3">
        {LANGUAGE_LIST.map((lang) => {
          const isSelected = selected === lang.id;
          const isCurrent = state.selectedLanguage === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => { setSelected(lang.id); setConfirmed(false); }}
              className={`w-full text-left rounded-3xl border-2 p-4 transition-all duration-200
                ${isSelected
                  ? `${lang.bgColor} ${lang.borderColor} scale-[1.02] shadow-xl border-4`
                  : `bg-white border-gray-200 hover:${lang.borderColor} hover:shadow-md`
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Flag + emoji */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${lang.color}
                  flex flex-col items-center justify-center border-2 ${lang.borderColor}
                  shadow-sm flex-shrink-0 transition-all duration-200
                  ${isSelected ? 'scale-110 shadow-md' : ''}
                `}>
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-lg">{lang.emoji}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-black text-xl text-gray-800">{lang.name}</h3>
                    <span className="text-gray-400 font-bold text-sm">{lang.nativeName}</span>
                    {isCurrent && (
                      <span className="text-xs font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full border border-green-300">
                        ✓ current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm font-medium truncate">{lang.description}</p>
                  <p className="text-xs font-bold mt-1" style={{ color: 'inherit' }}>
                    <span className={`inline-block px-2 py-0.5 rounded-full ${lang.badgeColor} border ${lang.borderColor} text-xs font-bold`}>
                      {lang.speakers}
                    </span>
                  </p>
                </div>

                {/* Radio circle */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected ? `${lang.borderColor} bg-gradient-to-br ${lang.color}` : 'border-gray-300'}`}>
                  {isSelected && <span className="text-xs font-black">✓</span>}
                </div>
              </div>

              {/* Fun fact revealed on select */}
              {isSelected && (
                <div className={`mt-3 pt-3 border-t ${lang.borderColor} text-sm font-medium text-gray-600 flex items-start gap-2`}>
                  <span className="text-lg flex-shrink-0">✨</span>
                  <span>{lang.funFact}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      {selected && currentLang && (
        <div className="sticky bottom-24 z-10">
          <button
            onClick={handleConfirm}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg border-2
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
              ${confirmed
                ? 'bg-green-400 border-green-500 text-white'
                : `bg-gradient-to-r ${currentLang.color} ${currentLang.borderColor} text-cafe-brown`
              }
            `}
          >
            {confirmed
              ? `✓ ${currentLang.flag} ${currentLang.name} chosen! Let's go!`
              : `${currentLang.flag} Learn ${currentLang.name}! →`
            }
          </button>
        </div>
      )}

      {/* Skip / Back */}
      {state.selectedLanguage && (
        <button
          onClick={() => onNavigate('home')}
          className="w-full py-3 rounded-2xl text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
        >
          ← Keep learning {LANGUAGE_LIST.find(l => l.id === state.selectedLanguage)?.name}
        </button>
      )}
    </div>
  );
}
