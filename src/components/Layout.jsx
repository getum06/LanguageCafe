import { CHARACTERS } from '../data/characters';
import { getLanguage } from '../data/languages';

export default function Layout({ state, onNavigate, isOnboarding, children }) {
  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : null;
  const language = state.selectedLanguage ? getLanguage(state.selectedLanguage) : null;
  const xpToNext = 100;
  const xpProgress = (state.xp % xpToNext) / xpToNext * 100;
  const level = Math.floor(state.xp / xpToNext) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-pastel-pink shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 hover:scale-105 transition-transform flex-shrink-0"
          >
            <span className="text-2xl">☕</span>
            <span className="font-black text-lg text-cafe-brown hidden sm:block leading-none">
              Lingo<span className="text-pink-500">Café</span>
            </span>
          </button>

          {/* Center stats */}
          <div className="flex items-center gap-2 flex-1 justify-center overflow-hidden">
            {/* Language badge */}
            {language && (
              <button
                onClick={() => onNavigate('language-select')}
                className={`stat-badge flex-shrink-0 gap-1 ${language.badgeColor} border ${language.borderColor} hover:shadow-md transition-shadow`}
                title="Change language"
              >
                <span>{language.flag}</span>
                <span className="hidden sm:inline">{language.name}</span>
              </button>
            )}

            {/* Hearts */}
            <div className="stat-badge flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-base transition-all ${i < state.hearts ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                  ❤️
                </span>
              ))}
            </div>

            {/* XP + Level */}
            <div className="stat-badge flex-col gap-0 px-3 min-w-[90px] hidden sm:flex">
              <div className="flex items-center gap-1 w-full justify-between">
                <span className="text-yellow-600 text-xs font-black">⭐ Lv.{level}</span>
                <span className="text-gray-400 text-xs">{state.xp % xpToNext}/{xpToNext}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full xp-fill"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            {/* Streak */}
            <div className="stat-badge text-orange-500 flex-shrink-0">
              🔥 <span>{state.streak}</span>
            </div>
          </div>

          {/* Character avatar */}
          {character ? (
            <button
              onClick={() => onNavigate('character-select')}
              className={`w-9 h-9 rounded-2xl ${character.badgeColor} border-2 ${character.borderColor}
                flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-sm flex-shrink-0`}
              title={`Playing as ${character.name}`}
            >
              {character.emoji}
            </button>
          ) : !isOnboarding ? (
            <button
              onClick={() => onNavigate('character-select')}
              className="btn-primary py-1 px-2 text-xs flex-shrink-0"
            >
              Pick buddy
            </button>
          ) : null}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Nav — hidden on onboarding screens */}
      {!isOnboarding && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t-2 border-pastel-pink shadow-lg z-40">
          <div className="max-w-4xl mx-auto flex justify-around py-1.5">
            {[
              { id: 'home',             icon: '🏠', label: 'Home' },
              { id: 'language-select',  icon: language ? language.flag : '🌍', label: 'Language' },
              { id: 'world-map',        icon: '🗺️',  label: 'Map' },
              { id: 'world-map',        icon: '📖', label: 'Learn' },
              { id: 'world-map',        icon: '💬', label: 'Chat' },
            ].map((nav, i) => (
              <button
                key={`${nav.id}-${i}`}
                onClick={() => onNavigate(nav.id)}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl
                  hover:bg-pink-50 transition-colors group"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">{nav.icon}</span>
                <span className="text-xs font-bold text-gray-500 group-hover:text-pink-500">{nav.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Spacer for bottom nav */}
      {!isOnboarding && <div className="h-20" />}
    </div>
  );
}
