import { useState } from 'react';
import { QUIZ_CAFE } from '../data/lessonData';
import { CHARACTERS } from '../data/characters';

function ConfettiPiece({ style }) {
  return (
    <div
      className="absolute w-3 h-3 rounded-sm animate-bounce-soft pointer-events-none"
      style={style}
    />
  );
}

const CONFETTI_COLORS = ['#FFB7C5', '#C9B1FF', '#B5EAD7', '#FFEAA7', '#A8D8EA', '#FFCBA4'];

export default function Quiz({ state, onNavigate, gainXP, loseHeart, completeQuiz }) {
  const quiz = QUIZ_CAFE;
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const character = state.selectedCharacter ? CHARACTERS[state.selectedCharacter] : null;
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const question = quiz.questions[currentQ];
  const progress = ((currentQ + (answered ? 1 : 0)) / quiz.questions.length) * 100;

  const confetti = Array.from({ length: 20 }).map((_, i) => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      animationDelay: `${Math.random() * 2}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    },
  }));

  function getRandMsg(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function handleSelect(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === question.correct;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedbackMsg(character ? getRandMsg(character.correct) : '¡Correcto! 🎉');
    } else {
      loseHeart();
      setWrongAnswers(wa => [...wa, question.id]);
      setFeedbackMsg(character ? getRandMsg(character.wrong) : 'Not quite! Try to remember this one!');
    }
    setShowExplanation(true);
  }

  function handleNext() {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
      setShowExplanation(false);
      setFeedbackMsg('');
    } else {
      setFinished(true);
      const xpEarned = Math.round((score + (selected === question.correct ? 1 : 0)) / quiz.questions.length * quiz.xpReward);
      gainXP(xpEarned);
      if (!state.completedQuizzes.includes(quiz.id)) {
        completeQuiz(quiz.id);
      }
    }
  }

  const isCorrect = answered && selected === question.correct;
  const finalScore = score + (finished && selected === question?.correct ? 1 : 0);
  const percentage = Math.round(finalScore / quiz.questions.length * 100);

  // Finished screen
  if (finished) {
    const xpEarned = Math.round(finalScore / quiz.questions.length * quiz.xpReward);
    return (
      <div className="space-y-5">
        <div className="relative anime-card p-8 text-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          {percentage >= 70 && confetti.map((c, i) => <ConfettiPiece key={i} {...c} />)}

          <div className="relative z-10 space-y-4">
            <div className="text-6xl animate-bounce-soft inline-block">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '💪'}
            </div>
            <h2 className="font-black text-3xl text-cafe-brown">
              {percentage >= 80 ? 'Amazing!' : percentage >= 60 ? 'Good job!' : 'Keep trying!'}
            </h2>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              {finalScore}/{quiz.questions.length}
            </div>
            <p className="text-gray-500 font-medium">{percentage}% correct!</p>

            {character && (
              <div className={`p-3 rounded-2xl ${character.bgColor} border ${character.borderColor}`}>
                <p className="font-bold text-gray-700">
                  {percentage >= 80
                    ? getRandMsg(character.correct)
                    : percentage >= 60
                      ? getRandMsg(character.encouragement)
                      : getRandMsg(character.wrong)
                  }
                </p>
                <p className="text-sm text-gray-400 mt-1">— {character.name} {character.emoji}</p>
              </div>
            )}

            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <p className="font-black text-yellow-600 text-xl">+{xpEarned} XP earned! ⭐</p>
              {wrongAnswers.length > 0 && (
                <p className="text-gray-500 text-sm mt-1">
                  Missed {wrongAnswers.length} question{wrongAnswers.length > 1 ? 's' : ''} — review the lesson to improve!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate('lesson')} className="btn-secondary py-4">
            📖 Review Lesson
          </button>
          <button onClick={() => onNavigate('chat')} className="btn-primary py-4">
            💬 Chat Practice →
          </button>
        </div>
        <button onClick={() => onNavigate('home')} className="w-full btn-mint py-3">
          🏠 Back to Home
        </button>
      </div>
    );
  }

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
          <h1 className="font-black text-xl text-cafe-brown">{quiz.title}</h1>
          <p className="text-xs text-gray-400 font-bold">Question {currentQ + 1} of {quiz.questions.length}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-base ${i < state.hearts ? '' : 'opacity-20 grayscale'}`}>❤️</span>
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

      {/* Score tracker */}
      <div className="flex justify-between text-sm font-bold text-gray-500">
        <span>✅ {score} correct</span>
        <span>❌ {wrongAnswers.length} wrong</span>
      </div>

      {/* Question card */}
      <div className="anime-card p-5 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center mb-4">
          <span className="text-4xl block mb-2 animate-bounce-soft">{question.emoji}</span>
          <h2 className="font-black text-xl text-gray-800 leading-snug">{question.question}</h2>
        </div>

        {/* Options */}
        <div className="grid gap-2">
          {question.options.map((opt, idx) => {
            let style = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50';
            if (answered) {
              if (idx === question.correct) {
                style = 'bg-green-100 border-2 border-green-400 text-green-800 shadow-md';
              } else if (idx === selected && idx !== question.correct) {
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
                  <span className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center text-sm font-black flex-shrink-0
                    ${answered && idx === question.correct ? 'bg-green-400 border-green-500 text-white' :
                      answered && idx === selected ? 'bg-red-400 border-red-500 text-white' :
                      'bg-gray-100 border-gray-300 text-gray-600'}`}>
                    {answered && idx === question.correct ? '✓' :
                     answered && idx === selected ? '✗' :
                     ['A', 'B', 'C', 'D'][idx]}
                  </span>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`anime-card p-4 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
          {character && (
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl flex-shrink-0">{character.emoji}</span>
              <p className="font-bold text-gray-700">{feedbackMsg}</p>
            </div>
          )}
          {showExplanation && (
            <div className={`rounded-xl p-3 text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
              <strong>💡 {isCorrect ? 'Great!' : 'Remember:'}</strong> {question.explanation}
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button onClick={handleNext} className="w-full btn-primary py-4 text-lg">
          {currentQ < quiz.questions.length - 1 ? 'Next Question →' : '🏁 See Results!'}
        </button>
      )}
    </div>
  );
}
