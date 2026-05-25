import { getWorld } from '../data/worlds';
import { getLanguagePack, resolveLessonKey } from '../data/lessonContent';
import { CHARACTERS } from '../data/characters';

export default function RewardsSummary({ state, onNavigate, clearSessionRewards }) {
  const session = state.sessionRewards;
  const lessonKey = session?.lessonId ?? resolveLessonKey(state);
  const pack = getLanguagePack(state.selectedLanguage, lessonKey);
  const { meta: language, lesson } = pack;
  const world = session?.worldId ? getWorld(session.worldId) : null;
  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : null;

  const lessonXp = session?.lessonXp ?? 0;
  const quizXp = session?.quizXp ?? 0;
  const chatXp = session?.chatXp ?? 0;
  const totalXp = lessonXp + quizXp + chatXp;

  function handleHome() {
    clearSessionRewards();
    onNavigate('home');
  }

  function handleMap() {
    clearSessionRewards();
    onNavigate('world-map');
  }

  function handleAgain() {
    onNavigate('lesson');
  }

  return (
    <div className="space-y-5">
      <div className="relative anime-card p-8 text-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 border-2 border-pink-200">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {['✨', '⭐', '🎉', '💫'].map((s, i) => (
            <span
              key={s}
              className="absolute text-2xl animate-sparkle"
              style={{ left: `${10 + i * 22}%`, top: `${15 + (i % 2) * 40}%`, animationDelay: `${i * 0.4}s` }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="relative z-10 space-y-4">
          <div className="text-6xl animate-bounce-soft">🏆</div>
          <h1 className="font-black text-2xl text-cafe-brown">Quest Complete!</h1>
          <p className="text-gray-600 font-medium text-sm">
            {language.flag} {language.name} · {lesson.emoji} {lesson.title}
            {world && ` · ${world.emoji} ${world.name}`}
          </p>

          {character && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl ${character.bgColor} border ${character.borderColor}`}>
              <span className="text-2xl">{character.emoji}</span>
              <p className="font-bold text-sm text-gray-700">{character.name} is proud of you!</p>
            </div>
          )}
        </div>
      </div>

      <div className="anime-card p-5 space-y-3">
        <h2 className="font-black text-gray-800 text-sm">⭐ XP Earned This Run</h2>
        <div className="space-y-2">
          {[
            { label: '📖 Lesson', xp: lessonXp },
            { label: '🎯 Quiz', xp: quizXp },
            { label: '💬 Chat Practice', xp: chatXp },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="font-bold text-gray-600 text-sm">{row.label}</span>
              <span className="font-black text-yellow-600">+{row.xp} XP</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2 border-t-2 border-pink-100">
          <span className="font-black text-gray-800">Total</span>
          <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            +{totalXp} XP
          </span>
        </div>
        <p className="text-xs text-gray-400 font-bold text-center">
          All-time total: {state.xp} XP · 🔥 {state.streak} day streak
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={handleAgain} className="btn-secondary py-3">
          🔄 Play Again
        </button>
        <button type="button" onClick={handleMap} className="btn-primary py-3">
          🗺️ World Map
        </button>
      </div>
      <button type="button" onClick={handleHome} className="btn-mint w-full py-3">
        🏠 Back to Home
      </button>
    </div>
  );
}
