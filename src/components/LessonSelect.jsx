import { getWorld } from '../data/worlds';
import { getLessonsForWorld } from '../data/lessonContent';

function LessonCard({ lesson, onStart }) {
  const { language } = lesson;

  return (
    <div
      className={`anime-card p-4 border-2 transition-all duration-200 relative overflow-hidden
        ${lesson.unlocked
          ? 'bg-white border-pink-200 hover:shadow-xl hover:-translate-y-0.5'
          : 'bg-gray-100/90 border-gray-200 opacity-80'
        }
        ${lesson.completed ? 'ring-2 ring-green-200' : ''}`}
    >
      {!lesson.unlocked && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-white/30 pointer-events-none z-10" />
      )}

      <div className="relative z-0">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 flex-shrink-0
            ${lesson.unlocked
              ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200'
              : 'bg-gray-200 border-gray-300 grayscale'
            }`}
          >
            {lesson.unlocked ? lesson.emoji : '🔒'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-black text-gray-800">{lesson.title}</h3>
              {lesson.completed && (
                <span className="text-xs font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-300">
                  ✓ Done
                </span>
              )}
              {!lesson.unlocked && (
                <span className="text-xs font-black bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  🔒 Locked
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">{lesson.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border ${language.badgeColor} ${language.borderColor}`}>
            {language.flag} {language.name}
          </span>
          <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-xl border border-yellow-200">
            +{lesson.xpReward} XP lesson
          </span>
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-xl border border-purple-200">
            +{lesson.quizXpReward} XP quiz
          </span>
        </div>

        {lesson.unlocked ? (
          <button type="button" onClick={() => onStart(lesson)} className="btn-primary w-full py-3">
            {lesson.completed ? '🔄 Play Again' : '📖 Start Lesson →'}
          </button>
        ) : (
          <div className="w-full py-3 rounded-2xl bg-gray-200 text-gray-500 font-bold text-sm text-center border border-gray-300">
            🔒 {lesson.lockReason}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LessonSelect({ state, onNavigate, startLessonFlow }) {
  const world = state.selectedWorld ? getWorld(state.selectedWorld) : null;
  const lessons = world
    ? getLessonsForWorld(world.id, state.selectedLanguage, state.xp, state.completedLessons)
    : [];

  function handleStart(lesson) {
    if (!lesson.unlocked || !world) return;
    startLessonFlow(world.id, lesson.id);
    onNavigate('lesson');
  }

  if (!world) {
    return (
      <div className="text-center space-y-4 py-12">
        <div className="text-5xl">🗺️</div>
        <p className="text-gray-500 font-medium">Pick a world on the map first!</p>
        <button type="button" onClick={() => onNavigate('world-map')} className="btn-primary">
          Go to World Map →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('world-map')}
          className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-xl hover:bg-pink-200 transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-cafe-brown">{world.emoji} {world.name}</h1>
          <p className="text-xs text-gray-500 font-medium">{world.description}</p>
        </div>
      </div>

      <div className={`rounded-2xl p-4 border-2 bg-gradient-to-br ${world.color} ${world.borderColor}`}>
        <p className="text-sm font-bold text-gray-700">
          Choose a lesson below · {lessons.filter(l => l.unlocked).length} available
        </p>
        <div className="flex gap-2 mt-2">
          {world.sparkles.map(s => (
            <span key={s} className="text-lg">{s}</span>
          ))}
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="anime-card p-8 text-center">
          <div className="text-4xl mb-2">🌙</div>
          <p className="font-bold text-gray-600">No lessons here yet!</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon for new adventures.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} onStart={handleStart} />
          ))}
        </div>
      )}
    </div>
  );
}
