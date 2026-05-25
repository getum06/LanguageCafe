import { useState } from 'react';
import { getLanguage } from '../data/languages';
import { getReviewRecommendations } from '../data/skillReview';
import { SKILL_EMOJI } from '../data/skillTracking';

function ReviewVocabCard({ word, onKnowIt, onStillLearning }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="anime-card p-4 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
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
        From: {word.lessonTitle}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onStillLearning(word)} className="btn-secondary py-2 text-xs">
          Still learning
        </button>
        <button type="button" onClick={() => onKnowIt(word)} className="btn-mint py-2 text-xs">
          Got it! ✓
        </button>
      </div>
    </div>
  );
}

export default function ReviewPractice({ state, onNavigate, recordSkillAttempt }) {
  const language = state.selectedLanguage ? getLanguage(state.selectedLanguage) : null;
  const review = getReviewRecommendations(state.skillTracking, state.selectedLanguage);
  const [words, setWords] = useState(review.words);
  const [reviewed, setReviewed] = useState(0);

  function handleKnowIt(word) {
    recordSkillAttempt?.('vocabulary', true, word.key);
    setWords(prev => prev.filter(w => w.key !== word.key));
    setReviewed(r => r + 1);
  }

  function handleStillLearning(word) {
    recordSkillAttempt?.('vocabulary', false, word.key);
    setReviewed(r => r + 1);
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

  if (words.length === 0) {
    return (
      <div className="space-y-5 text-center py-8">
        <div className="text-5xl animate-bounce-soft">🌟</div>
        <h1 className="font-black text-2xl text-cafe-brown">All caught up!</h1>
        <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto">
          {reviewed > 0
            ? `You reviewed ${reviewed} card${reviewed === 1 ? '' : 's'} this session. Great work!`
            : 'No missed vocabulary to review right now. Take a quiz or chat to track your skills!'}
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
            {language.flag} Weakness Review
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Practice words you missed · {words.length} card{words.length === 1 ? '' : 's'} left
          </p>
        </div>
      </div>

      {review.weakSkills.length > 0 && (
        <div className="anime-card p-3 bg-orange-50 border-orange-200">
          <p className="text-xs font-black text-orange-700 mb-2">Focus areas</p>
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
        {words.map(word => (
          <ReviewVocabCard
            key={word.key}
            word={word}
            onKnowIt={handleKnowIt}
            onStillLearning={handleStillLearning}
          />
        ))}
      </div>
    </div>
  );
}
