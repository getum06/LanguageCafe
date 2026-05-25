/**
 * Maps quiz questions and chat prompts to skill categories + vocab keys.
 */
import { getLanguageCatalog } from './lessonCatalog';
import {
  getMissedWordKeys,
  getWeakSkills,
} from './skillTracking';

/** Quiz question id → skill + wordKey (café lesson pattern) */
export const QUIZ_QUESTION_SKILL = {
  1: { skill: 'vocabulary', wordKey: 'hello' },
  2: { skill: 'vocabulary', wordKey: 'thankYou' },
  3: { skill: 'grammar', wordKey: 'iWant' },
  4: { skill: 'vocabulary', wordKey: 'water' },
  5: { skill: 'vocabulary', wordKey: 'goodbye' },
  6: { skill: 'grammar', wordKey: 'please' },
};

/** Chat prompt type → skill + wordKey */
export const CHAT_TYPE_SKILL = {
  greeting: { skill: 'conversation', wordKey: 'hello' },
  order: { skill: 'conversation', wordKey: 'iWant' },
  size: { skill: 'grammar', wordKey: 'coffee' },
  price: { skill: 'translation', wordKey: 'coffee' },
  thanks: { skill: 'vocabulary', wordKey: 'thankYou' },
};

export function getQuizQuestionSkillMeta(question) {
  if (question?.skill && question?.wordKey) {
    return { skill: question.skill, wordKey: question.wordKey };
  }
  return QUIZ_QUESTION_SKILL[question?.id] ?? { skill: 'vocabulary', wordKey: null };
}

export function getChatPromptSkillMeta(prompt) {
  if (prompt?.skill && prompt?.wordKey) {
    return { skill: prompt.skill, wordKey: prompt.wordKey };
  }
  return CHAT_TYPE_SKILL[prompt?.type] ?? { skill: 'conversation', wordKey: null };
}

/**
 * Resolve missed vocab cards from word keys across all lessons in a language.
 */
export function resolveMissedVocab(languageId, wordKeys) {
  if (!languageId || !wordKeys?.length) return [];

  const catalog = getLanguageCatalog(languageId);
  const resolved = [];

  for (const key of wordKeys) {
    for (const topic of Object.values(catalog)) {
      const match = topic.vocabulary?.find(v => v.key === key);
      if (match) {
        resolved.push({
          ...match,
          lessonId: topic.id,
          lessonTitle: topic.title,
        });
        break;
      }
    }
  }

  return resolved;
}

/**
 * Review recommendations for dashboard and review practice.
 */
export function getReviewRecommendations(tracking, languageId) {
  const weakSkills = getWeakSkills(tracking, languageId);
  const missedKeys = getMissedWordKeys(tracking, languageId);
  const words = resolveMissedVocab(languageId, missedKeys);

  const recommendations = weakSkills.map(skill => ({
    type: 'skill',
    skillId: skill.id,
    label: skill.label,
    emoji: skill.emoji,
    accuracy: skill.accuracy,
    message: `${skill.label} is at ${skill.accuracy}% — practice missed words below.`,
  }));

  if (words.length > 0) {
    recommendations.push({
      type: 'vocabulary',
      label: 'Missed vocabulary',
      emoji: '🃏',
      wordCount: words.length,
      message: `Review ${words.length} word${words.length === 1 ? '' : 's'} you missed in quizzes and chat.`,
    });
  }

  return {
    weakSkills,
    words,
    recommendations,
    hasReview: weakSkills.length > 0 || words.length > 0,
  };
}

export { getMissedWordKeys, getWeakSkills };
