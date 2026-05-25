import { useState } from 'react';
import { getQuizQuestionSkillMeta } from '../data/skillReview';
import { getLanguagePack, resolveLessonKey } from '../data/lessonContent';
import { CHARACTERS } from '../data/characters';
import { getCompanionFeedback } from '../data/companionFeedback';

const CONFETTI_COLORS = ['#FFB7C5', '#C9B1FF', '#B5EAD7', '#FFEAA7', '#A8D8EA', '#FFCBA4'];

function ConfettiPiece({ style }) {
  return <div className="absolute w-3 h-3 rounded-sm animate-bounce-soft pointer-events-none" style={style} />;
}

export default function Quiz({ state, onNavigate, gainXP, loseHeart, completeQuiz, recordSessionXp, recordSkillAttempt }) {
  const lessonKey = resolveLessonKey(state);
  const pack = getLanguagePack(state.selectedLanguage, lessonKey);
  const { meta: language, lesson, quiz } = pack;
  const quizId = quiz.id;
  const questions = quiz.questions;

  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : null;

  const [currentQ, setCurrentQ]     = useState(0);
  const [selected, setSelected]     = useState(null);
  const [answered, setAnswered]     = useState(false);
  const [score, setScore]           = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished]     = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const question = questions[currentQ];
  const progress = ((currentQ + (answered ? 1 : 0)) / questions.length) * 100;

  const confetti = Array.from({ length: 20 }).map((_, i) => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      animationDelay: `${Math.random() * 2}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    },
  }));

  function handleSelect(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === question.correct;
    const { skill, wordKey } = getQuizQuestionSkillMeta(question);
    recordSkillAttempt?.(skill, isCorrect, wordKey, lessonKey);
    const feedbackContext = {
      languageName: language.name,
      languageFlag: language.flag,
      lessonTitle: lesson.title,
    };

    if (isCorrect) {
      setScore(s => s + 1);
      setFeedbackMsg(
        character
          ? getCompanionFeedback(character.id, 'correctAnswer', feedbackContext)
          : '¡Correcto! 🎉',
      );
    } else {
      loseHeart();
      setWrongCount(w => w + 1);
      setFeedbackMsg(
        character
          ? getCompanionFeedback(character.id, 'wrongAnswer', feedbackContext)
          : 'Not quite! Try to remember this one.',
      );
    }
  }

  function handleNext() {
    const isLastQ = currentQ === questions.length - 1;
    const finalScore = score + (selected === question.correct ? 1 : 0);

    if (isLastQ) {
      const xpEarned = Math.round((finalScore / questions.length) * quiz.xpReward);
      gainXP(xpEarned);
      recordSessionXp?.('quiz', xpEarned);
      if (!state.completedQuizzes.includes(quizId)) completeQuiz(quizId);
      setFinished(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
      setFeedbackMsg('');
    }
  }

  const isCorrectAnswer = answered && selected === question.correct;
  const finalScore = score + (finished && selected === question?.correct ? 1 : 0);
  const percentage = Math.round(finalScore / questions.length * 100);
  const xpEarned = Math.round((finalScore / questions.length) * quiz.xpReward);

  /* ── Results screen ── */
  if (finished) {
    return (
      <div className="space-y-5">
        <div className="relative anime-card p-8 text-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          {percentage >= 70 && confetti.map((c, i) => <ConfettiPiece key={i} {...c} />)}
          <div className="relative z-10 space-y-4">
            <div className="text-6xl animate-bounce-soft inline-block">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '💪'}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{language.flag}</span>
              <h2 className="font-black text-2xl text-cafe-brown">
                {percentage >= 80 ? 'Amazing!' : percentage >= 60 ? 'Good job!' : 'Keep going!'}
              </h2>
            </div>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              {finalScore}/{questions.length}
            </div>
            <p className="text-gray-500 font-medium">{percentage}% correct in {language.name}!</p>

            {character && (
              <div className={`p-3 rounded-2xl ${character.bgColor} border ${character.borderColor}`}>
                <p className="font-bold text-gray-700 text-sm">
                  {getCompanionFeedback(character.id, 'quizComplete', {
                    languageName: language.name,
                    languageFlag: language.flag,
                    lessonTitle: lesson.title,
                    score: finalScore,
                    totalQuestions: questions.length,
                    percentage,
                    xpEarned,
                  })}
                </p>
                <p className="text-xs text-gray-400 mt-1">— {character.name} {character.emoji}</p>
              </div>
            )}

            <div className="bg-yellow-50 rounded-2xl p-3 border border-yellow-200">
              <p className="font-black text-yellow-600 text-lg">+{xpEarned} XP earned! ⭐</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate('lesson')} className="btn-secondary py-3">📖 Review Lesson</button>
          <button onClick={() => onNavigate('chat')}   className="btn-primary py-3">💬 Chat Practice →</button>
        </div>
        <button onClick={() => onNavigate('home')} className="w-full btn-mint py-3">🏠 Back to Home</button>
      </div>
    );
  }

  /* ── Quiz question ── */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-xl hover:bg-pink-200 transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span>{language.flag}</span>
            <h1 className="font-black text-lg text-cafe-brown leading-tight">
              {language.name} Quiz — {lesson.title}
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-bold">Question {currentQ + 1} of {questions.length}</p>
        </div>
        <div className="flex gap-0.5 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < state.hearts ? '' : 'opacity-20 grayscale'}`}>❤️</span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full xp-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs font-bold text-gray-400">
        <span>✅ {score} correct</span>
        <span>❌ {wrongCount} wrong</span>
      </div>

      {/* Question */}
      <div className="anime-card p-5 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center mb-4">
          <span className="text-4xl block mb-2 animate-bounce-soft">{question.emoji}</span>
          <h2 className="font-black text-lg text-gray-800 leading-snug">{question.question}</h2>
        </div>

        <div className="grid gap-2">
          {question.options.map((opt, idx) => {
            let style = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50';
            if (answered) {
              if (idx === question.correct) {
                style = 'bg-green-100 border-2 border-green-400 text-green-800 shadow-md';
              } else if (idx === selected) {
                style = 'bg-red-100 border-2 border-red-400 text-red-800';
              } else {
                style = 'bg-gray-50 border-2 border-gray-200 text-gray-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold transition-all duration-200
                  ${style} ${!answered ? 'hover:-translate-y-0.5 hover:shadow-md active:translate-y-0' : ''}
                `}
              >
                <span className="inline-flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center text-xs font-black flex-shrink-0
                    ${answered && idx === question.correct ? 'bg-green-400 border-green-500 text-white'
                      : answered && idx === selected   ? 'bg-red-400 border-red-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
                    {answered && idx === question.correct ? '✓'
                      : answered && idx === selected    ? '✗'
                      : ['A','B','C','D'][idx]}
                  </span>
                  <span className="text-sm">{opt}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`anime-card p-4 ${isCorrectAnswer ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
          {character && (
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl flex-shrink-0">{character.emoji}</span>
              <p className="font-bold text-gray-700 text-sm">{feedbackMsg}</p>
            </div>
          )}
          <div className={`rounded-xl p-3 text-sm font-medium
            ${isCorrectAnswer ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            <strong>💡 {isCorrectAnswer ? 'Great!' : 'Remember:'}</strong> {question.explanation}
          </div>
        </div>
      )}

      {answered && (
        <button onClick={handleNext} className="w-full btn-primary py-4">
          {currentQ < questions.length - 1 ? 'Next Question →' : '🏁 See Results!'}
        </button>
      )}
    </div>
  );
}
