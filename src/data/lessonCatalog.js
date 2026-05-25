/**
 * Multi-lesson catalog per language.
 * Each language has topic keys (cafe, school, market) with shared lesson shape.
 */
import { SUPPORTED_LANGUAGE_IDS } from '../lib/languageStorage';
import { LANGUAGES_WITH_CONTENT } from './languagesWithContent';

export const DEFAULT_LANGUAGE_ID = 'spanish';
export const DEFAULT_LESSON_ID = 'cafe';

/** Lesson topic order for progression */
export const LESSON_TOPIC_ORDER = ['cafe', 'school', 'market'];

/** Default XP rewards per lesson topic */
export const LESSON_XP = {
  lesson: 50,
  quiz: 75,
  chatPerPrompt: 10,
};

/** Emoji per lesson topic */
export const LESSON_EMOJI = {
  cafe: '☕',
  school: '📚',
  market: '🏮',
};

function createLessonStub(id, title, description, world, level, requiredXP) {
  return {
    id,
    title,
    description,
    world,
    level,
    requiredXP,
    lessonXp: LESSON_XP.lesson,
    quizXp: LESSON_XP.quiz,
    chatXpPerPrompt: LESSON_XP.chatPerPrompt,
    emoji: LESSON_EMOJI[id] ?? '📖',
    vocabulary: [],
    dialogue: [],
    tips: [],
    quiz: [],
    chatPrompts: [],
  };
}

function cafeLessonFromLegacy(raw) {
  return {
    id: 'cafe',
    title: 'Café Ordering',
    description: 'Order drinks, greet the barista, and use polite phrases.',
    world: 'cozyCafe',
    level: 1,
    requiredXP: 0,
    lessonXp: LESSON_XP.lesson,
    quizXp: LESSON_XP.quiz,
    chatXpPerPrompt: LESSON_XP.chatPerPrompt,
    emoji: LESSON_EMOJI.cafe,
    vocabulary: raw.vocab ?? [],
    dialogue: raw.dialogue ?? [],
    tips: raw.tips ?? [],
    quiz: raw.quiz ?? [],
    chatPrompts: raw.chatPrompts ?? [],
  };
}

function buildLanguageLessons(langId) {
  const raw = LANGUAGES_WITH_CONTENT[langId];
  if (!raw) {
    return {
      cafe: createLessonStub(
        'cafe',
        'Café Ordering',
        'Order drinks, greet the barista, and use polite phrases.',
        'cozyCafe',
        1,
        0,
      ),
      school: createLessonStub(
        'school',
        'School Basics',
        'Classroom phrases, making friends, and daily school life.',
        'animeSchool',
        2,
        150,
      ),
      market: createLessonStub(
        'market',
        'Night Market',
        'Shop for food, ask prices, and practice bargaining.',
        'nightMarket',
        3,
        300,
      ),
    };
  }

  return {
    cafe: cafeLessonFromLegacy(raw),
    school: createLessonStub(
      'school',
      'School Basics',
      'Classroom phrases, making friends, and daily school life.',
      'animeSchool',
      2,
      150,
    ),
    market: createLessonStub(
      'market',
      'Night Market',
      'Shop for food, ask prices, and practice bargaining.',
      'nightMarket',
      3,
      300,
    ),
  };
}

export const lessonCatalog = Object.fromEntries(
  SUPPORTED_LANGUAGE_IDS.map(langId => [langId, buildLanguageLessons(langId)]),
);

export function normalizeLanguageId(languageId) {
  if (languageId && lessonCatalog[languageId]) return languageId;
  return DEFAULT_LANGUAGE_ID;
}

export function normalizeLessonId(languageId, lessonId) {
  const catalog = lessonCatalog[normalizeLanguageId(languageId)];
  if (lessonId && catalog[lessonId]) return lessonId;
  return DEFAULT_LESSON_ID;
}

export function getLanguageCatalog(languageId) {
  return lessonCatalog[normalizeLanguageId(languageId)];
}

export function getLessonTopic(languageId, lessonId) {
  const catalog = getLanguageCatalog(languageId);
  return catalog[normalizeLessonId(languageId, lessonId)];
}

/** Legacy progress IDs — keep café completion working */
export function getLessonProgressId(languageId, lessonId = DEFAULT_LESSON_ID) {
  const lang = normalizeLanguageId(languageId);
  const lesson = normalizeLessonId(lang, lessonId);
  if (lesson === 'cafe') return `cafe-ordering-${lang}`;
  return `${lesson}-${lang}`;
}

export function getQuizProgressId(languageId, lessonId = DEFAULT_LESSON_ID) {
  const lang = normalizeLanguageId(languageId);
  const lesson = normalizeLessonId(lang, lessonId);
  if (lesson === 'cafe') return `quiz-cafe-${lang}`;
  return `quiz-${lesson}-${lang}`;
}

export function isLessonReady(topic) {
  return Array.isArray(topic?.vocabulary) && topic.vocabulary.length > 0;
}

/** All lessons belonging to a world for the active language */
export function getLessonsInWorld(languageId, worldId) {
  const catalog = getLanguageCatalog(languageId);
  return Object.values(catalog)
    .filter(topic => topic?.world === worldId)
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
}
