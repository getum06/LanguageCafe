/**
 * Lesson content accessors — multi-lesson catalog with legacy compatibility.
 */
import { getLanguageMeta } from './languageMeta';
import {
  DEFAULT_LANGUAGE_ID,
  DEFAULT_LESSON_ID,
  LESSON_XP,
  getLanguageCatalog,
  getLessonProgressId,
  getLessonTopic,
  getLessonsInWorld,
  getQuizProgressId,
  isLessonReady,
  lessonCatalog,
  normalizeLanguageId,
  normalizeLessonId,
} from './lessonCatalog';
import { getWorld, isWorldUnlocked } from './worlds';

export { LANGUAGE_LIST } from './languageMeta';
export { SUPPORTED_LANGUAGE_IDS } from '../lib/languageStorage';
export { lessonCatalog, DEFAULT_LESSON_ID, DEFAULT_LANGUAGE_ID };

export function getLanguage(id) {
  return getLanguageMeta(id);
}

/** Slide sequence for story lessons */
export const LESSON_SLIDE_TYPES = ['intro', 'vocab', 'dialogue', 'tips', 'summary'];
export const CHAT_PROMPT_TYPES = ['greeting', 'order', 'size', 'price', 'thanks'];
export { LESSON_XP };

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
  const emoji = topic.emoji ?? '📖';
  return {
    meta,
    lesson: {
      id: getLessonProgressId(languageId, lessonId),
      lessonKey: lessonId,
      title: topic.title,
      description: topic.description,
      emoji,
      topic: lessonId,
      world: topic.world,
      level: topic.level,
      requiredXP: topic.requiredXP,
      slideTypes: LESSON_SLIDE_TYPES,
      xpReward: topic.lessonXp ?? LESSON_XP.lesson,
      vocab: topic.vocabulary,
      dialogue: topic.dialogue,
      tips: topic.tips,
    },
    quiz: {
      id: getQuizProgressId(languageId, lessonId),
      title: `${meta.name} ${topic.title} Quiz`,
      xpReward: topic.quizXp ?? LESSON_XP.quiz,
      questions: topic.quiz,
    },
    chat: {
      lessonId: getLessonProgressId(languageId, lessonId),
      xpPerCorrect: topic.chatXpPerPrompt ?? LESSON_XP.chatPerPrompt,
      prompts: topic.chatPrompts,
    },
  };
}

/**
 * Lesson cards for LessonSelect — includes lock/completion status.
 */
export function getLessonsForWorld(worldId, languageId, userXP = 0, completedLessonIds = []) {
  const lang = normalizeLanguageId(languageId);
  const meta = getLanguageMeta(lang);
  const world = getWorld(worldId);
  const worldUnlocked = isWorldUnlocked(worldId, userXP);

  return getLessonsInWorld(lang, worldId).map(topic => {
    const progressId = getLessonProgressId(lang, topic.id);
    const xpUnlocked = userXP >= (topic.requiredXP ?? 0);
    const ready = isLessonReady(topic);
    const completed = completedLessonIds.includes(progressId);
    const unlocked = worldUnlocked && xpUnlocked && ready;

    let lockReason = null;
    if (!worldUnlocked && world) {
      lockReason = `Unlock ${world.name} first (${world.unlockXP} XP)`;
    } else if (!xpUnlocked) {
      lockReason = `Need ${Math.max(0, topic.requiredXP - userXP)} more XP`;
    } else if (!ready) {
      lockReason = 'Coming soon';
    }

    return {
      id: topic.id,
      progressId,
      title: topic.title,
      description: topic.description,
      emoji: topic.emoji ?? '📖',
      world: topic.world,
      level: topic.level,
      requiredXP: topic.requiredXP,
      xpReward: topic.lessonXp ?? LESSON_XP.lesson,
      quizXpReward: topic.quizXp ?? LESSON_XP.quiz,
      unlocked,
      completed,
      lockReason,
      language: {
        id: meta.id,
        name: meta.name,
        flag: meta.flag,
        badgeColor: meta.badgeColor,
        borderColor: meta.borderColor,
      },
    };
  });
}

/**
 * Resolve active lesson key from game state (falls back to café).
 */
export function resolveLessonKey(state) {
  return normalizeLessonId(state?.selectedLanguage, state?.selectedLesson);
}

/**
 * Backward-compatible pack for Lesson / Quiz / Chat.
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
