/**
 * Reusable lesson content schema and accessors.
 * All lessons, quizzes, and chat prompts resolve through getLanguagePack().
 */
import { getLanguage } from './languages';

export { LANGUAGE_LIST } from './languages';
export { SUPPORTED_LANGUAGE_IDS } from '../lib/languageStorage';
export { getLanguage };

/** Slide sequence for café ordering lessons */
export const LESSON_SLIDE_TYPES = ['intro', 'vocab', 'dialogue', 'tips', 'summary'];

/** Chat prompt categories used for feedback routing */
export const CHAT_PROMPT_TYPES = ['greeting', 'order', 'size', 'price', 'thanks'];

export const CAFE_LESSON_TEMPLATE = {
  topic: 'cafe-ordering',
  title: 'Ordering at a Café',
  emoji: '☕',
  slideTypes: LESSON_SLIDE_TYPES,
  lessonXp: 50,
  quizXp: 75,
  chatXpPerPrompt: 10,
};

/**
 * @typedef {Object} VocabItem
 * @property {string} key
 * @property {string} english
 * @property {string} word
 * @property {string} pronunciation
 * @property {string} emoji
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {number} id
 * @property {string} question
 * @property {string} emoji
 * @property {string[]} options
 * @property {number} correct
 * @property {string} explanation
 */

/**
 * @typedef {Object} ChatPrompt
 * @property {number} id
 * @property {string} prompt
 * @property {string} hint
 * @property {string[]} keywords
 * @property {'greeting'|'order'|'size'|'price'|'thanks'} type
 */

/**
 * @typedef {Object} LanguagePack
 * @property {Object} meta - id, name, flag, theme colors, etc.
 * @property {Object} lesson - vocab, dialogue, tips, ids
 * @property {Object} quiz - questions and ids
 * @property {Object} chat - prompts
 */

export function getLessonId(languageId) {
  return `${CAFE_LESSON_TEMPLATE.topic}-${languageId}`;
}

export function getQuizId(languageId) {
  return `quiz-cafe-${languageId}`;
}

/**
 * Build a normalized content pack for the active language.
 * Components should use this instead of reading raw language objects.
 */
export function getLanguagePack(languageId) {
  const lang = getLanguage(languageId);

  return {
    meta: {
      id: lang.id,
      name: lang.name,
      nativeName: lang.nativeName,
      flag: lang.flag,
      emoji: lang.emoji,
      speakers: lang.speakers,
      color: lang.color,
      borderColor: lang.borderColor,
      bgColor: lang.bgColor,
      badgeColor: lang.badgeColor,
      hoverColor: lang.hoverColor,
      funFact: lang.funFact,
      description: lang.description,
    },
    lesson: {
      id: getLessonId(lang.id),
      title: `${CAFE_LESSON_TEMPLATE.title} ${CAFE_LESSON_TEMPLATE.emoji}`,
      topic: CAFE_LESSON_TEMPLATE.topic,
      slideTypes: LESSON_SLIDE_TYPES,
      xpReward: CAFE_LESSON_TEMPLATE.lessonXp,
      vocab: lang.vocab,
      dialogue: lang.dialogue,
      tips: lang.tips,
    },
    quiz: {
      id: getQuizId(lang.id),
      title: `${lang.name} Café Quiz`,
      xpReward: CAFE_LESSON_TEMPLATE.quizXp,
      questions: lang.quiz,
    },
    chat: {
      lessonId: getLessonId(lang.id),
      xpPerCorrect: CAFE_LESSON_TEMPLATE.chatXpPerPrompt,
      prompts: lang.chatPrompts,
    },
  };
}

/** Shorthand accessors for components */
export function getLessonContent(languageId) {
  return getLanguagePack(languageId).lesson;
}

export function getQuizContent(languageId) {
  return getLanguagePack(languageId).quiz;
}

export function getChatContent(languageId) {
  return getLanguagePack(languageId).chat;
}

/** Lookup vocab by semantic key (hello, please, etc.) */
export function getVocabByKey(languageId, key) {
  const { vocab } = getLessonContent(languageId);
  return vocab.find(v => v.key === key);
}
