import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import LanguageButton from './LanguageButton';
import LanguageSwitcher from './LanguageSwitcher';

export default function LanguageSelect({ state, onNavigate, selectLanguage }) {
  const { languages, languageId, chooseLanguage } = useLanguage(
    state.selectedLanguage,
    selectLanguage,
  );
  const [pendingId, setPendingId] = useState(languageId || null);
  const [confirmed, setConfirmed] = useState(false);

  const currentLang = languages.find(l => l.id === pendingId);

  function handleSelect(id) {
    setPendingId(id);
    setConfirmed(false);
  }

  function handleConfirm() {
    if (!pendingId) return;
    chooseLanguage(pendingId);
    setConfirmed(true);
    setTimeout(() => {
      onNavigate(state.selectedCharacter ? 'home' : 'character-select');
    }, 900);
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-2 relative">
        <div className="absolute inset-0 flex justify-center gap-8 opacity-20 pointer-events-none">
          {['✨', '⭐', '💫'].map(s => (
            <span key={s} className="text-2xl animate-sparkle">{s}</span>
          ))}
        </div>
        <div className="text-5xl mb-3 animate-float inline-block">🌍</div>
        <h1 className="font-black text-3xl text-cafe-brown mb-2">
          Choose Your Language
        </h1>
        <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto">
          Spanish · French · Japanese · Korean · Italian — pick one and start your café adventure!
        </p>
      </div>

      <LanguageSwitcher selectedId={pendingId} onSelect={handleSelect} />

      <div className="grid grid-cols-1 gap-3">
        {languages.map(lang => (
          <LanguageButton
            key={lang.id}
            language={lang}
            isSelected={pendingId === lang.id}
            isCurrent={languageId === lang.id}
            onSelect={handleSelect}
            variant="card"
          />
        ))}
      </div>

      {pendingId && currentLang && (
        <div className="sticky bottom-24 z-10">
          <button
            type="button"
            onClick={handleConfirm}
            className={`lang-btn-confirm w-full py-4 rounded-2xl font-black text-lg shadow-lg border-2
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
              ${confirmed
                ? 'bg-green-400 border-green-500 text-white'
                : `bg-gradient-to-r ${currentLang.color} ${currentLang.borderColor} text-cafe-brown`
              }`}
          >
            {confirmed
              ? `✓ ${currentLang.flag} ${currentLang.name} saved! Let's go!`
              : `${currentLang.flag} Learn ${currentLang.name}! →`
            }
          </button>
          <p className="text-center text-xs text-gray-400 font-medium mt-2">
            Saved to your browser automatically 💾
          </p>
        </div>
      )}

      {languageId && (
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="w-full py-3 rounded-2xl text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
        >
          ← Keep learning {languages.find(l => l.id === languageId)?.name}
        </button>
      )}
    </div>
  );
}
