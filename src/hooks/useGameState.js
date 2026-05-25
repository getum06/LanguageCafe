import { useState, useEffect } from 'react';
import { getStoredLanguage, setStoredLanguage } from '../lib/languageStorage';
import { getStoredWorld, getStoredLesson, setStoredWorld, setStoredLesson } from '../lib/selectionStorage';
import { recordSkillAttempt as applySkillAttempt, createEmptySkillTracking } from '../data/skillTracking';
import { createEmptyVocabMastery, updateWordMastery as applyWordMastery } from '../data/spacedRepetition';

const DEFAULT_STATE = {
  xp: 0,
  hearts: 5,
  streak: 0,
  selectedCharacter: null,
  selectedLanguage: null,
  selectedWorld: null,
  selectedLesson: null,
  completedLessons: [],
  completedQuizzes: [],
  lastPlayedDate: null,
  unlockedAreas: ['cozyCafe'],
  sessionRewards: null,
  skillTracking: createEmptySkillTracking(),
  vocabMastery: createEmptyVocabMastery(),
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('lingoCafeQuest');
    const storedLanguage = getStoredLanguage();
    const storedWorld = getStoredWorld();
    const storedLesson = getStoredLesson();

    if (saved) {
      const parsed = JSON.parse(saved);
      if (storedLanguage) parsed.selectedLanguage = storedLanguage;
      if (storedWorld) parsed.selectedWorld = storedWorld;
      if (storedLesson) parsed.selectedLesson = storedLesson;
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
      return {
        ...DEFAULT_STATE,
        ...parsed,
        skillTracking: parsed.skillTracking ?? createEmptySkillTracking(),
        vocabMastery: parsed.vocabMastery ?? createEmptyVocabMastery(),
      };
    }

    if (storedLanguage || storedWorld || storedLesson) {
      return {
        ...DEFAULT_STATE,
        ...(storedLanguage && { selectedLanguage: storedLanguage }),
        ...(storedWorld && { selectedWorld: storedWorld }),
        ...(storedLesson && { selectedLesson: storedLesson }),
      };
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
    setStoredWorld(state.selectedWorld);
    setStoredLesson(state.selectedLesson);
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

  function selectWorld(worldId) {
    setStoredWorld(worldId);
    setState(prev => ({ ...prev, selectedWorld: worldId }));
  }

  function selectLesson(lessonId) {
    setStoredLesson(lessonId);
    setState(prev => ({ ...prev, selectedLesson: lessonId }));
  }

  function startLessonFlow(worldId, lessonId) {
    setStoredWorld(worldId);
    setStoredLesson(lessonId);
    setState(prev => ({
      ...prev,
      selectedWorld: worldId,
      selectedLesson: lessonId,
      sessionRewards: {
        worldId,
        lessonId,
        lessonXp: 0,
        quizXp: 0,
        chatXp: 0,
      },
    }));
  }

  function recordSessionXp(type, amount) {
    setState(prev => {
      if (!prev.sessionRewards || amount <= 0) return prev;
      const key = `${type}Xp`;
      return {
        ...prev,
        sessionRewards: {
          ...prev.sessionRewards,
          [key]: (prev.sessionRewards[key] ?? 0) + amount,
        },
      };
    });
  }

  function recordSkillAttempt(skillId, isCorrect, wordKey = null, lessonId = null) {
    setState(prev => {
      const languageId = prev.selectedLanguage;
      if (!languageId) return prev;

      const effectiveLesson = lessonId ?? prev.selectedLesson ?? 'cafe';
      let next = {
        ...prev,
        skillTracking: applySkillAttempt(
          prev.skillTracking,
          languageId,
          skillId,
          isCorrect,
          wordKey,
        ),
      };

      if (wordKey) {
        next = {
          ...next,
          vocabMastery: applyWordMastery(
            prev.vocabMastery,
            languageId,
            effectiveLesson,
            wordKey,
            isCorrect,
          ),
        };
      }

      return next;
    });
  }

  function updateWordMastery(lessonId, wordKey, isCorrect) {
    setState(prev => {
      const languageId = prev.selectedLanguage;
      if (!languageId || !wordKey) return prev;
      return {
        ...prev,
        vocabMastery: applyWordMastery(
          prev.vocabMastery,
          languageId,
          lessonId ?? prev.selectedLesson ?? 'cafe',
          wordKey,
          isCorrect,
        ),
      };
    });
  }

  function clearSessionRewards() {
    setState(prev => ({ ...prev, sessionRewards: null }));
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
    setStoredWorld(null);
    setStoredLesson(null);
    setState(DEFAULT_STATE);
  }

  return {
    state,
    gainXP,
    loseHeart,
    gainHeart,
    selectCharacter,
    selectLanguage,
    selectWorld,
    selectLesson,
    startLessonFlow,
    recordSessionXp,
    clearSessionRewards,
    recordSkillAttempt,
    updateWordMastery,
    completeLesson,
    completeQuiz,
    unlockArea,
    resetProgress,
  };
}
