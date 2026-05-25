import { useState } from 'react';
import { getLanguagePack, LESSON_SLIDE_TYPES, resolveLessonKey } from '../data/lessonContent';
import { CHARACTERS } from '../data/characters';

/* ── Vocab flip card ── */
function VocabCard({ word }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped(f => !f)}
      className={`relative w-full aspect-[3/2] rounded-2xl border-2 shadow-md
        transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
        ${flipped ? 'bg-pastel-purple border-purple-300' : 'bg-white border-pink-200'}
      `}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-1">
        <span className="text-2xl">{word.emoji}</span>
        {flipped ? (
          <>
            <span className="font-black text-purple-700 text-sm text-center">{word.english}</span>
            <span className="text-xs text-purple-400">tap to flip back</span>
          </>
        ) : (
          <>
            <span className="font-black text-pink-600 text-sm text-center leading-tight">{word.word}</span>
            <span className="text-xs text-gray-400 italic text-center">{word.pronunciation}</span>
            <span className="text-xs text-gray-300">tap to translate</span>
          </>
        )}
      </div>
    </button>
  );
}

/* ── Slide components ── */
function SlideIntro({ language, lesson }) {
  return (
    <div className="text-center space-y-4 py-6">
      <div className="text-6xl animate-float inline-block">{lesson.emoji ?? language.emoji}</div>
      <div className="text-4xl">{language.flag}</div>
      <h2 className="font-black text-3xl text-cafe-brown">
        Welcome to {language.name}! {language.flag}
      </h2>
      <h3 className="font-bold text-xl text-pink-500">{lesson.title}</h3>
      <p className="text-gray-600 font-medium max-w-sm mx-auto leading-relaxed">
        {lesson.description ?? `Practice essential ${language.name} phrases in this lesson.`} ✨
      </p>
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-3 border border-purple-200 inline-block">
        <p className="font-bold text-purple-600 text-sm">{language.funFact}</p>
      </div>
    </div>
  );
}

function SlideVocab({ language }) {
  return (
    <div className="space-y-4">
      <h2 className="font-black text-xl text-gray-800 text-center">
        {language.flag} 8 Essential Words
      </h2>
      <p className="text-center text-gray-500 font-medium text-sm">
        Tap each card to see the English meaning! 🃏
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {language.vocab.map((word, i) => (
          <VocabCard key={i} word={word} />
        ))}
      </div>
    </div>
  );
}

function SlideDialogue({ language }) {
  const [revealed, setRevealed] = useState(0);
  const exchanges = language.dialogue;

  return (
    <div className="space-y-4">
      <h2 className="font-black text-xl text-gray-800 text-center">
        {language.flag} Café Conversation
      </h2>
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-3 border border-amber-200 text-center">
        <p className="font-bold text-amber-700 text-sm">☕ Inside a {language.name}-speaking café…</p>
      </div>

      <div className="space-y-3">
        {exchanges.map((ex, i) => (
          <div
            key={i}
            className={`transition-all duration-500
              ${i <= revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            <div className={`flex items-start gap-3 ${ex.speaker === 'You' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm border
                ${ex.speaker === 'You' ? 'bg-pastel-pink border-pink-200' : 'bg-pastel-mint border-green-200'}`}>
                {ex.speaker === 'You' ? '🧑' : '👨‍🍳'}
              </div>
              <div className={`flex-1 ${ex.speaker === 'You' ? 'text-right' : ''}`}>
                <span className="text-xs font-black text-gray-400 block mb-1">{ex.speaker}</span>
                <div className={`inline-block rounded-2xl px-4 py-2.5 shadow-sm border
                  ${ex.speaker === 'You'
                    ? 'bg-pastel-pink border-pink-200'
                    : 'bg-pastel-mint border-green-200'}`}>
                  <p className="font-black text-gray-800 text-sm">{ex.line}</p>
                  <p className="text-gray-500 text-xs font-medium mt-0.5 italic">{ex.translation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {revealed < exchanges.length - 1 ? (
        <button
          onClick={() => setRevealed(r => r + 1)}
          className="w-full btn-primary"
        >
          Next line →
        </button>
      ) : (
        <div className="text-center bg-green-50 rounded-2xl p-3 border border-green-200">
          <p className="font-bold text-green-600 text-sm">✅ Full conversation! Great reading!</p>
        </div>
      )}
    </div>
  );
}

function SlideTips({ language }) {
  return (
    <div className="space-y-4">
      <h2 className="font-black text-xl text-gray-800 text-center">
        {language.flag} Pro Tips!
      </h2>
      <div className="space-y-3">
        {language.tips.map((tip, i) => (
          <div key={i} className="anime-card p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{tip.icon}</span>
              <div>
                <h4 className="font-black text-amber-700 mb-1 text-sm">{tip.title}</h4>
                <p className="text-gray-600 font-medium text-sm">{tip.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideSummary({ language, lesson, onComplete }) {
  const keyPhrases = [
    `Greet someone: "${language.vocab.find(v => v.key === 'hello')?.word}"`,
    `Order a drink: "${language.vocab.find(v => v.key === 'iWant')?.word} + drink + ${language.vocab.find(v => v.key === 'please')?.word}"`,
    `Say thank you: "${language.vocab.find(v => v.key === 'thankYou')?.word}"`,
    `Say goodbye: "${language.vocab.find(v => v.key === 'goodbye')?.word}"`,
  ];

  return (
    <div className="text-center space-y-4 py-4">
      <div className="text-5xl animate-bounce-soft inline-block">🎉</div>
      <h2 className="font-black text-2xl text-cafe-brown">Lesson Complete!</h2>
      <p className="text-gray-600 font-medium text-sm">
        You learned 8 essential {language.name} words and a full café conversation! {language.flag}
      </p>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 text-left">
        <h4 className="font-black text-green-700 mb-2 text-sm">✅ You can now:</h4>
        <ul className="space-y-2">
          {keyPhrases.map((phrase, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 font-medium text-sm">
              <span className="text-green-500 flex-shrink-0">🌸</span>
              {phrase}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-3 border border-yellow-200">
        <p className="font-black text-yellow-600">+{lesson?.xpReward ?? 50} XP earned! ⭐</p>
        <p className="text-gray-500 text-xs mt-0.5">Take the quiz to earn more XP!</p>
      </div>

      <button onClick={onComplete} className="btn-primary w-full py-4 text-base">
        🎯 Take the Quiz! →
      </button>
    </div>
  );
}

/* ── Main Lesson component ── */
export default function Lesson({ state, onNavigate, completeLesson, gainXP, recordSessionXp }) {
  const lessonKey = resolveLessonKey(state);
  const pack = getLanguagePack(state.selectedLanguage, lessonKey);
  const { meta: language, lesson } = pack;
  const lessonId = lesson.id;
  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : null;

  const SLIDES = LESSON_SLIDE_TYPES;
  const [slideIdx, setSlideIdx] = useState(0);
  const [completed, setCompleted] = useState(state.completedLessons.includes(lessonId));
  const slide = SLIDES[slideIdx];
  const progress = ((slideIdx + 1) / SLIDES.length) * 100;

  function handleNext() {
    if (slideIdx < SLIDES.length - 1) setSlideIdx(s => s + 1);
  }
  function handlePrev() {
    if (slideIdx > 0) setSlideIdx(s => s - 1);
  }
  function handleComplete() {
    if (!completed) {
      completeLesson(lessonId);
      gainXP(lesson.xpReward);
      recordSessionXp?.('lesson', lesson.xpReward);
      setCompleted(true);
    }
    onNavigate('quiz');
  }

  const isSummary = slide === 'summary';
  const isDialogue = slide === 'dialogue';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('lesson-select')}
          className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center
            justify-center text-xl hover:bg-pink-200 transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{language.flag}</span>
            <h1 className="font-black text-lg text-cafe-brown leading-tight">
              {language.name} — {lesson.title}
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-bold">
            Slide {slideIdx + 1} of {SLIDES.length}
          </p>
        </div>
        <div className="text-sm font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-xl border border-yellow-200 flex-shrink-0">
          +{lesson.xpReward} XP
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full xp-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Character comment on intro */}
      {character && slideIdx === 0 && (
        <div className={`flex items-start gap-3 p-3 rounded-2xl ${character.bgColor} border ${character.borderColor}`}>
          <span className="text-3xl flex-shrink-0">{character.emoji}</span>
          <p className="font-bold text-sm text-gray-700">
            {character.id === 'yumi' && `Yay! ${language.flag} ${language.name} time! Let's learn together! 🌸`}
            {character.id === 'kai' && `New quest unlocked: ${language.name} ${lesson.title}! Let's gooo! 🎮`}
            {character.id === 'luna' && `Every word is a spell. Let us begin your ${language.name} journey… 🌙`}
          </p>
        </div>
      )}

      {/* Slide content */}
      <div className="anime-card p-5 min-h-[300px]">
        {slide === 'intro'    && <SlideIntro    language={language} lesson={lesson} />}
        {slide === 'vocab'    && <SlideVocab    language={{ ...language, vocab: lesson.vocab }} />}
        {slide === 'dialogue' && <SlideDialogue language={{ ...language, dialogue: lesson.dialogue }} />}
        {slide === 'tips'     && <SlideTips     language={{ ...language, tips: lesson.tips }} />}
        {slide === 'summary'  && <SlideSummary  language={{ ...language, vocab: lesson.vocab }} lesson={lesson} onComplete={handleComplete} />}
      </div>

      {/* Navigation */}
      {!isSummary && (
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={slideIdx === 0}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-500
              hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          {!isDialogue && (
            <button
              onClick={handleNext}
              className="flex-1 btn-primary"
            >
              Next →
            </button>
          )}
        </div>
      )}

      {/* Slide dots */}
      <div className="flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideIdx(i)}
            className={`h-2.5 rounded-full transition-all duration-200
              ${i === slideIdx ? 'bg-pink-400 w-6' : i < slideIdx ? 'bg-purple-300 w-2.5' : 'bg-gray-200 w-2.5'}`}
          />
        ))}
      </div>
    </div>
  );
}
