/**
 * Lesson content accessors — multi-lesson catalog with legacy compatibility.
 */
import { getLanguageMeta } from './languageMeta';
import {
  DEFAULT_LANGUAGE_ID,
  DEFAULT_LESSON_ID,
  getLanguageCatalog,
  getLessonProgressId,
  getLessonTopic,
  getQuizProgressId,
  isLessonReady,
  lessonCatalog,
  normalizeLanguageId,
  normalizeLessonId,
} from './lessonCatalog';

export { LANGUAGE_LIST } from './languageMeta';
export { SUPPORTED_LANGUAGE_IDS } from '../lib/languageStorage';
export { lessonCatalog, DEFAULT_LESSON_ID, DEFAULT_LANGUAGE_ID };

export function getLanguage(id) {
  return getLanguageMeta(id);
}

/** Slide sequence for story lessons */
export const LESSON_SLIDE_TYPES = ['intro', 'vocab', 'dialogue', 'tips', 'summary'];

/** Chat prompt categories used for feedback routing */
export const CHAT_PROMPT_TYPES = ['greeting', 'order', 'size', 'price', 'thanks'];

export const CAFE_LESSON_TEMPLATE = {
  topic: 'cafe',
  title: 'Ordering at a Café',
  emoji: '☕',
  slideTypes: LESSON_SLIDE_TYPES,
  lessonXp: 50,
  quizXp: 75,
  chatXpPerPrompt: 10,
};

/** @deprecated Use getLessonProgressId(languageId, lessonId) */
export function getLessonId(languageId, lessonId = DEFAULT_LESSON_ID) {
  return getLessonProgressId(languageId, lessonId);
}

/** @deprecated Use getQuizProgressId(languageId, lessonId) */
export function getQuizId(languageId, lessonId = DEFAULT_LESSON_ID) {
  return getQuizProgressId(languageId, lessonId);
}

/**
 * Full lesson topic from catalog (vocabulary, dialogue, quiz, etc.)
 */
export function getLessonPack(languageId, lessonId = DEFAULT_LESSON_ID) {
  return getLessonTopic(languageId, lessonId);
}

/**
 * Lessons unlocked by XP with playable content, sorted by level.
 */
export function getAvailableLessons(languageId, userXP = 0) {
  const catalog = getLanguageCatalog(languageId);
  return Object.values(catalog)
    .filter(topic => topic && userXP >= (topic.requiredXP ?? 0))
    .filter(isLessonReady)
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
}

/**
 * Next incomplete lesson in level order, or null if all done.
 */
export function getNextLesson(languageId, completedLessonIds = [], userXP = Infinity) {
  const available = getAvailableLessons(languageId, userXP);
  const lang = normalizeLanguageId(languageId);

  for (const topic of available) {
    const progressId = getLessonProgressId(lang, topic.id);
    if (!completedLessonIds.includes(progressId)) {
      return topic;
    }
  }
  return null;
}

/**
 * Normalize a lesson topic into component-friendly lesson/quiz/chat sections.
 */
function buildPackFromTopic(meta, topic, languageId, lessonId) {
  return {
    meta,
    lesson: {
      id: getLessonProgressId(languageId, lessonId),
      lessonKey: lessonId,
      title: `${topic.title} ${CAFE_LESSON_TEMPLATE.emoji}`,
      topic: lessonId,
      world: topic.world,
      level: topic.level,
      requiredXP: topic.requiredXP,
      slideTypes: LESSON_SLIDE_TYPES,
      xpReward: CAFE_LESSON_TEMPLATE.lessonXp,
      vocab: topic.vocabulary,
      dialogue: topic.dialogue,
      tips: topic.tips,
    },
    quiz: {
      id: getQuizProgressId(languageId, lessonId),
      title: `${meta.name} ${topic.title} Quiz`,
      xpReward: CAFE_LESSON_TEMPLATE.quizXp,
      questions: topic.quiz,
    },
    chat: {
      lessonId: getLessonProgressId(languageId, lessonId),
      xpPerCorrect: CAFE_LESSON_TEMPLATE.chatXpPerPrompt,
      prompts: topic.chatPrompts,
    },
  };
}

/**
 * Backward-compatible pack for Lesson / Quiz / Chat (defaults to café lesson).
 */
export function getLanguagePack(languageId, lessonId = DEFAULT_LESSON_ID) {
  const lang = normalizeLanguageId(languageId);
  const topicId = normalizeLessonId(lang, lessonId);
  const meta = getLanguageMeta(lang);
  const topic = getLessonTopic(lang, topicId);

  return buildPackFromTopic(meta, topic, lang, topicId);
}

export function getLessonContent(languageId, lessonId = DEFAULT_LESSON_ID) {
  return getLanguagePack(languageId, lessonId).lesson;
}

export function getQuizContent(languageId, lessonId = DEFAULT_LESSON_ID) {
  return getLanguagePack(languageId, lessonId).quiz;
}

export function getChatContent(languageId, lessonId = DEFAULT_LESSON_ID) {
  return getLanguagePack(languageId, lessonId).chat;
}

/**
 * Lookup vocab by semantic key. Supports (languageId, key) or (languageId, lessonId, key).
 */
export function getVocabByKey(languageId, lessonIdOrKey, keyMaybe) {
  let lessonId = DEFAULT_LESSON_ID;
  let key = lessonIdOrKey;

  if (keyMaybe !== undefined) {
    lessonId = lessonIdOrKey;
    key = keyMaybe;
  }

  const topic = getLessonTopic(languageId, lessonId);
  return topic.vocabulary?.find(v => v.key === key);
}
