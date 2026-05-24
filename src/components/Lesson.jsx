import { useState } from 'react';
import { LESSON_CAFE } from '../data/lessonData';
import { CHARACTERS } from '../data/characters';

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
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
        <span className="text-3xl mb-1">{word.emoji}</span>
        {flipped ? (
          <>
            <span className="font-black text-purple-700 text-base">{word.english}</span>
            <span className="text-xs text-purple-400 mt-1">tap to flip back</span>
          </>
        ) : (
          <>
            <span className="font-black text-pink-600 text-base">{word.spanish}</span>
            <span className="text-xs text-gray-400 mt-1">tap to see English</span>
          </>
        )}
      </div>
    </button>
  );
}

function SlideIntro({ slide }) {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="text-6xl animate-float inline-block">☕</div>
      <h2 className="font-black text-3xl text-cafe-brown">{slide.title}</h2>
      <h3 className="font-bold text-xl text-pink-500">{slide.subtitle}</h3>
      <p className="text-gray-600 font-medium text-lg max-w-md mx-auto leading-relaxed">
        {slide.content}
      </p>
      <div className="flex justify-center gap-3 text-3xl animate-pulse-slow">
        <span>🌸</span><span>🍵</span><span>✨</span>
      </div>
    </div>
  );
}

function SlideVocab({ slide }) {
  return (
    <div className="space-y-4">
      <h2 className="font-black text-2xl text-gray-800 text-center">{slide.title}</h2>
      <p className="text-center text-gray-500 font-medium text-sm">
        Tap each card to flip it and see the meaning! 🃏
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slide.words.map((word, i) => (
          <VocabCard key={i} word={word} />
        ))}
      </div>
    </div>
  );
}

function SlideDialogue({ slide }) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="space-y-4">
      <h2 className="font-black text-2xl text-gray-800 text-center">{slide.title}</h2>
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-3 border border-amber-200 text-center">
        <p className="font-bold text-amber-700">{slide.scene}</p>
      </div>

      <div className="space-y-3">
        {slide.exchanges.map((ex, i) => (
          <div
            key={i}
            className={`transition-all duration-500 ${i <= revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            <div className={`flex items-start gap-3 ${ex.speaker === 'You' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl ${ex.color} flex items-center justify-center text-xl flex-shrink-0 shadow-sm border`}>
                {ex.emoji}
              </div>
              <div className={`flex-1 ${ex.speaker === 'You' ? 'text-right' : ''}`}>
                <span className="text-xs font-black text-gray-400 block mb-1">{ex.speaker}</span>
                <div className={`inline-block rounded-2xl px-4 py-2.5 shadow-sm border
                  ${ex.speaker === 'You' ? 'bg-pastel-pink border-pink-200' : 'bg-pastel-mint border-green-200'}`}>
                  <p className="font-black text-gray-800 text-base">{ex.line}</p>
                  <p className="text-gray-500 text-xs font-medium mt-0.5 italic">{ex.translation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {revealed < slide.exchanges.length - 1 && (
        <button
          onClick={() => setRevealed(r => r + 1)}
          className="w-full btn-primary"
        >
          Next line →
        </button>
      )}
      {revealed === slide.exchanges.length - 1 && (
        <div className="text-center bg-green-50 rounded-2xl p-3 border border-green-200">
          <p className="font-bold text-green-600">✅ Full conversation shown! Great job reading!</p>
        </div>
      )}
    </div>
  );
}

function SlideTip({ slide }) {
  return (
    <div className="space-y-4">
      <h2 className="font-black text-2xl text-gray-800 text-center">{slide.title}</h2>
      <div className="space-y-3">
        {slide.tips.map((tip, i) => (
          <div key={i} className="anime-card p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{tip.icon}</span>
              <div>
                <h4 className="font-black text-amber-700 mb-1">{tip.title}</h4>
                <p className="text-gray-600 font-medium text-sm">{tip.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideSummary({ slide, onComplete }) {
  return (
    <div className="text-center space-y-5 py-4">
      <div className="text-6xl animate-bounce-soft inline-block">🎉</div>
      <h2 className="font-black text-3xl text-cafe-brown">{slide.title}</h2>
      <p className="text-gray-600 font-medium">{slide.content}</p>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 text-left">
        <h4 className="font-black text-green-700 mb-3">✅ You learned how to:</h4>
        <ul className="space-y-2">
          {slide.learned.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 font-medium text-sm">
              <span className="text-green-500 text-lg flex-shrink-0">🌸</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-3 border border-yellow-200">
        <p className="font-black text-yellow-600 text-lg">+50 XP earned! ⭐</p>
        <p className="text-gray-500 text-sm">Try the quiz to earn 75 more XP!</p>
      </div>

      <button
        onClick={onComplete}
        className="btn-primary w-full text-lg py-4"
      >
        🎯 Take the Quiz! →
      </button>
    </div>
  );
}

export default function Lesson({ state, onNavigate, completeLesson, gainXP }) {
  const lesson = LESSON_CAFE;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completed, setCompleted] = useState(state.completedLessons.includes(lesson.id));
  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : null;
  const slide = lesson.slides[currentSlide];
  const progress = ((currentSlide + 1) / lesson.slides.length) * 100;

  function handleNext() {
    if (currentSlide < lesson.slides.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  }

  function handlePrev() {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    }
  }

  function handleComplete() {
    if (!completed) {
      completeLesson(lesson.id);
      gainXP(lesson.xpReward);
      setCompleted(true);
    }
    onNavigate('quiz');
  }

  const isDialogue = slide.type === 'dialogue';
  const isSummary = slide.type === 'summary';
  const isLast = currentSlide === lesson.slides.length - 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center 
            justify-center text-xl hover:bg-pink-200 transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-cafe-brown">{lesson.title}</h1>
          <p className="text-xs text-gray-400 font-bold">Slide {currentSlide + 1} of {lesson.slides.length}</p>
        </div>
        <div className="text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-xl border border-yellow-200">
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

      {/* Character comment */}
      {character && currentSlide === 0 && (
        <div className={`flex items-start gap-3 p-3 rounded-2xl ${character.bgColor} border ${character.borderColor}`}>
          <span className="text-3xl flex-shrink-0">{character.emoji}</span>
          <div>
            <p className="font-bold text-sm text-gray-700">
              {character.id === 'yumi' && "Yay! Let's learn Spanish together! I'll be right here cheering for you! 🌸"}
              {character.id === 'kai' && "Alright, new quest! This lesson is worth major XP, let's GOOOO! 🎮"}
              {character.id === 'luna' && "Begin your journey with patience. Each word learned is a spell mastered. 🌙"}
            </p>
          </div>
        </div>
      )}

      {/* Slide content */}
      <div className="anime-card p-6 min-h-[300px]">
        {slide.type === 'intro' && <SlideIntro slide={slide} />}
        {slide.type === 'vocab' && <SlideVocab slide={slide} />}
        {slide.type === 'dialogue' && <SlideDialogue slide={slide} />}
        {slide.type === 'tip' && <SlideTip slide={slide} />}
        {slide.type === 'summary' && <SlideSummary slide={slide} onComplete={handleComplete} />}
      </div>

      {/* Navigation */}
      {!isSummary && (
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-500
              hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          {!isDialogue && (
            <button
              onClick={isLast ? handleComplete : handleNext}
              className="flex-1 btn-primary"
            >
              {isLast ? '🎉 Complete!' : 'Next →'}
            </button>
          )}
        </div>
      )}

      {/* Slide dots */}
      <div className="flex justify-center gap-2">
        {lesson.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200
              ${i === currentSlide ? 'bg-pink-400 w-6' : i < currentSlide ? 'bg-purple-300' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
}
