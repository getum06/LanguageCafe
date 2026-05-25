import { useState, useEffect } from 'react';
import { getStoredLanguage, setStoredLanguage } from '../lib/languageStorage';

const DEFAULT_STATE = {
  xp: 0,
  hearts: 5,
  streak: 0,
  selectedCharacter: null,
  selectedLanguage: null,
  completedLessons: [],
  completedQuizzes: [],
  lastPlayedDate: null,
  unlockedAreas: ['cozyCafe'],
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('lingoCafeQuest');
    const storedLanguage = getStoredLanguage();

    if (saved) {
      const parsed = JSON.parse(saved);
      // Dedicated language key takes precedence for consistency
      if (storedLanguage) {
        parsed.selectedLanguage = storedLanguage;
      }
      // Migrate legacy world area ids
      if (Array.isArray(parsed.unlockedAreas)) {
        const legacyMap = {
          'cozy-cafe': 'cozyCafe',
          'anime-school': 'animeSchool',
          marketplace: 'nightMarket',
          'magic-forest': 'magicForest',
        };
        parsed.unlockedAreas = parsed.unlockedAreas.map(id => legacyMap[id] || id);
      }
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

    if (storedLanguage) {
      return { ...DEFAULT_STATE, selectedLanguage: storedLanguage };
    }
  } catch {
    // ignore
  }
  return DEFAULT_STATE;
}

function saveToStorage(state) {
  try {
    localStorage.setItem('lingoCafeQuest', JSON.stringify(state));
    setStoredLanguage(state.selectedLanguage);
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

  function selectLanguage(languageId) {
    setStoredLanguage(languageId);
    setState(prev => ({ ...prev, selectedLanguage: languageId }));
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
    setStoredLanguage(null);
    setState(DEFAULT_STATE);
  }

  return {
    state,
    gainXP,
    loseHeart,
    gainHeart,
    selectCharacter,
    selectLanguage,
    completeLesson,
    completeQuiz,
    unlockArea,
    resetProgress,
  };
}
