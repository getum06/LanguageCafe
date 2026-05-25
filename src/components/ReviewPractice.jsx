import { useState, useMemo } from 'react';
import { getLanguage } from '../data/languages';
import { getReviewRecommendations } from '../data/skillReview';
import { getDueReviewWords, getMasteryLabel, MAX_MASTERY_LEVEL } from '../data/spacedRepetition';
import { SKILL_EMOJI } from '../data/skillTracking';

function MasteryStars({ level }) {
  return (
    <span className="text-xs text-amber-500 font-black tracking-tight" title={`Mastery ${level}/${MAX_MASTERY_LEVEL}`}>
      {getMasteryLabel(level)}
    </span>
  );
}

function ReviewVocabCard({ entry, onKnowIt, onStillLearning }) {
  const [flipped, setFlipped] = useState(false);
  const word = entry.vocab;

  return (
    <div className="anime-card p-4 border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-pink-50">
      <div className="flex items-center justify-between mb-2">
        <MasteryStars level={entry.masteryLevel} />
        <span className="text-[10px] font-bold text-gray-400">
          Lv.{entry.masteryLevel} · {entry.timesCorrect}✓ {entry.timesWrong}✗
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped(f => !f)}
        className={`w-full aspect-[2/1] rounded-2xl border-2 mb-3 transition-all duration-300
          ${flipped ? 'bg-purple-100 border-purple-300' : 'bg-white border-pink-200'}`}
      >
        <div className="flex flex-col items-center justify-center h-full p-3 gap-1">
          <span className="text-3xl">{word.emoji}</span>
          {flipped ? (
            <>
              <span className="font-black text-purple-700">{word.english}</span>
              <span className="text-xs text-purple-400">tap to flip</span>
            </>
          ) : (
            <>
              <span className="font-black text-pink-600 text-lg">{word.word}</span>
              <span className="text-xs text-gray-400 italic">{word.pronunciation}</span>
              <span className="text-xs text-gray-300">tap to see English</span>
            </>
          )}
        </div>
      </button>

      <p className="text-xs text-gray-500 font-bold mb-2 text-center">
        {word.lessonTitle}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onStillLearning(entry)}
          className="btn-secondary py-2 text-xs"
        >
          Still learning
        </button>
        <button
          type="button"
          onClick={() => onKnowIt(entry)}
          className="btn-mint py-2 text-xs"
        >
          Got it! ✓
        </button>
      </div>
    </div>
  );
}

export default function ReviewPractice({ state, onNavigate, recordSkillAttempt, updateWordMastery }) {
  const language = state.selectedLanguage ? getLanguage(state.selectedLanguage) : null;
  const review = getReviewRecommendations(state.skillTracking, state.selectedLanguage);

  const initialDue = useMemo(
    () => getDueReviewWords(state.vocabMastery, state.selectedLanguage),
    [state.vocabMastery, state.selectedLanguage],
  );

  const [dueEntries, setDueEntries] = useState(initialDue);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });

  function removeEntry(entry) {
    setDueEntries(prev =>
      prev.filter(e => e.wordKey !== entry.wordKey || e.lessonId !== entry.lessonId),
    );
  }

  function handleKnowIt(entry) {
    updateWordMastery?.(entry.lessonId, entry.wordKey, true);
    recordSkillAttempt?.('vocabulary', true, entry.wordKey, entry.lessonId);
    removeEntry(entry);
    setSessionStats(s => ({ ...s, correct: s.correct + 1 }));
  }

  function handleStillLearning(entry) {
    updateWordMastery?.(entry.lessonId, entry.wordKey, false);
    recordSkillAttempt?.('vocabulary', false, entry.wordKey, entry.lessonId);
    removeEntry(entry);
    setSessionStats(s => ({ ...s, wrong: s.wrong + 1 }));
  }

  if (!language) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-gray-500 font-medium">Pick a language first!</p>
        <button type="button" onClick={() => onNavigate('language-select')} className="btn-primary">
          Choose Language →
        </button>
      </div>
    );
  }

  if (dueEntries.length === 0) {
    return (
      <div className="space-y-5 text-center py-8">
        <div className="text-5xl animate-bounce-soft">🌟</div>
        <h1 className="font-black text-2xl text-cafe-brown">All caught up!</h1>
        <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto">
          {sessionStats.correct + sessionStats.wrong > 0
            ? `Session: ${sessionStats.correct} mastered, ${sessionStats.wrong} to retry soon.`
            : 'No words due today. Complete a quiz or chat to add words to your review deck!'}
        </p>
        <button type="button" onClick={() => onNavigate('home')} className="btn-primary">
          🏠 Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-xl hover:bg-pink-200 transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-cafe-brown">
            {language.flag} Spaced Review
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            {dueEntries.length} word{dueEntries.length === 1 ? '' : 's'} due today
          </p>
        </div>
      </div>

      <div className="anime-card p-3 bg-violet-50 border-violet-200 text-sm font-medium text-violet-800">
        <p className="font-black mb-1">📅 Spaced repetition</p>
        <p className="text-xs text-violet-600">
          Got it → review later. Still learning → practice again today.
        </p>
      </div>

      {review.weakSkills.length > 0 && (
        <div className="anime-card p-3 bg-orange-50 border-orange-200">
          <p className="text-xs font-black text-orange-700 mb-2">Weak skills</p>
          <div className="flex flex-wrap gap-2">
            {review.weakSkills.map(skill => (
              <span
                key={skill.id}
                className="text-xs font-bold px-2 py-1 rounded-xl bg-white border border-orange-200 text-orange-700"
              >
                {SKILL_EMOJI[skill.id]} {skill.label} · {skill.accuracy}%
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dueEntries.map(entry => (
          <ReviewVocabCard
            key={`${entry.lessonId}:${entry.wordKey}`}
            entry={entry}
            onKnowIt={handleKnowIt}
            onStillLearning={handleStillLearning}
          />
        ))}
      </div>
    </div>
  );
}
