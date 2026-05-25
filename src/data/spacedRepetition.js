/**
 * Spaced repetition for vocabulary — stored in game state vocabMastery.
 */
import { getLanguageCatalog } from './lessonCatalog';

export const MAX_MASTERY_LEVEL = 5;

/** Days until next review after reaching each mastery level */
export const REVIEW_INTERVALS = {
  0: 0,
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

export function toDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function addDays(fromDate, days) {
  const d = new Date(fromDate);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function getMasteryKey(languageId, lessonId, wordKey) {
  return `${languageId}:${lessonId}:${wordKey}`;
}

export function createWordMasteryEntry(languageId, lessonId, wordKey) {
  const today = toDateKey();
  return {
    wordKey,
    languageId,
    lessonId,
    timesCorrect: 0,
    timesWrong: 0,
    masteryLevel: 0,
    nextReviewDate: today,
    lastReviewedDate: null,
  };
}

export function createEmptyVocabMastery() {
  return {};
}

export function getNextReviewDateForLevel(masteryLevel, fromDate = new Date()) {
  const level = Math.min(MAX_MASTERY_LEVEL, Math.max(0, masteryLevel));
  const days = REVIEW_INTERVALS[level] ?? 0;
  return addDays(fromDate, days);
}

/**
 * Update mastery after a review attempt. Returns new vocabMastery object.
 */
export function updateWordMastery(vocabMastery, languageId, lessonId, wordKey, isCorrect) {
  if (!languageId || !lessonId || !wordKey) {
    return vocabMastery ?? createEmptyVocabMastery();
  }

  const base = { ...(vocabMastery ?? createEmptyVocabMastery()) };
  const key = getMasteryKey(languageId, lessonId, wordKey);
  const today = toDateKey();
  const existing = base[key] ?? createWordMasteryEntry(languageId, lessonId, wordKey);

  let masteryLevel = existing.masteryLevel;
  let timesCorrect = existing.timesCorrect;
  let timesWrong = existing.timesWrong;

  if (isCorrect) {
    timesCorrect += 1;
    masteryLevel = Math.min(MAX_MASTERY_LEVEL, masteryLevel + 1);
  } else {
    timesWrong += 1;
    masteryLevel = Math.max(0, masteryLevel - 1);
  }

  const nextReviewDate = isCorrect
    ? getNextReviewDateForLevel(masteryLevel)
    : today;

  base[key] = {
    ...existing,
    wordKey,
    languageId,
    lessonId,
    timesCorrect,
    timesWrong,
    masteryLevel,
    nextReviewDate,
    lastReviewedDate: today,
  };

  return base;
}

function resolveVocabCard(languageId, lessonId, wordKey) {
  const catalog = getLanguageCatalog(languageId);
  const topic = catalog?.[lessonId];
  const vocab = topic?.vocabulary?.find(v => v.key === wordKey);
  if (!vocab) return null;

  return {
    ...vocab,
    lessonId,
    lessonTitle: topic.title ?? lessonId,
  };
}

/**
 * Words due for review on or before the given date (default: today).
 */
export function getDueReviewWords(vocabMastery, languageId, asOfDate = new Date()) {
  if (!languageId || !vocabMastery) return [];

  const todayKey = toDateKey(asOfDate);

  return Object.values(vocabMastery)
    .filter(entry => entry.languageId === languageId && entry.nextReviewDate <= todayKey)
    .map(entry => {
      const vocab = resolveVocabCard(entry.languageId, entry.lessonId, entry.wordKey);
      return {
        ...entry,
        vocab,
      };
    })
    .filter(entry => entry.vocab)
    .sort((a, b) => a.masteryLevel - b.masteryLevel);
}

export function getDueReviewCount(vocabMastery, languageId, asOfDate = new Date()) {
  return getDueReviewWords(vocabMastery, languageId, asOfDate).length;
}

export function getMasteryLabel(level) {
  return '★'.repeat(level) + '☆'.repeat(MAX_MASTERY_LEVEL - level);
}
