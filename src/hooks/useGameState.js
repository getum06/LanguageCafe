import { useState, useEffect } from 'react';

const DEFAULT_STATE = {
  xp: 0,
  hearts: 5,
  streak: 0,
  selectedCharacter: null,
  completedLessons: [],
  completedQuizzes: [],
  lastPlayedDate: null,
  unlockedAreas: ['cozy-cafe'],
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('lingoCafeQuest');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check streak continuity
      const today = new Date().toDateString();
      const last = parsed.lastPlayedDate;
      if (last && last !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (last !== yesterday.toDateString()) {
          parsed.streak = 0;
        }
      }
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_STATE;
}

function saveToStorage(state) {
  try {
    localStorage.setItem('lingoCafeQuest', JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useGameState() {
  const [state, setState] = useState(loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  function gainXP(amount) {
    setState(prev => {
      const today = new Date().toDateString();
      const newStreak = prev.lastPlayedDate === today
        ? prev.streak
        : prev.streak + 1;
      return {
        ...prev,
        xp: prev.xp + amount,
        streak: newStreak,
        lastPlayedDate: today,
      };
    });
  }

  function loseHeart() {
    setState(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  }

  function gainHeart() {
    setState(prev => ({ ...prev, hearts: Math.min(5, prev.hearts + 1) }));
  }

  function selectCharacter(characterId) {
    setState(prev => ({ ...prev, selectedCharacter: characterId }));
  }

  function completeLesson(lessonId) {
    setState(prev => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId],
    }));
  }

  function completeQuiz(quizId) {
    setState(prev => ({
      ...prev,
      completedQuizzes: prev.completedQuizzes.includes(quizId)
        ? prev.completedQuizzes
        : [...prev.completedQuizzes, quizId],
    }));
  }

  function unlockArea(areaId) {
    setState(prev => ({
      ...prev,
      unlockedAreas: prev.unlockedAreas.includes(areaId)
        ? prev.unlockedAreas
        : [...prev.unlockedAreas, areaId],
    }));
  }

  function resetProgress() {
    setState(DEFAULT_STATE);
  }

  return {
    state,
    gainXP,
    loseHeart,
    gainHeart,
    selectCharacter,
    completeLesson,
    completeQuiz,
    unlockArea,
    resetProgress,
  };
}
