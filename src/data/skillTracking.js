/**
 * Skill tracking by category — persisted inside game state skillTracking.
 */
export const SKILL_IDS = [
  'vocabulary',
  'translation',
  'conversation',
  'grammar',
  'listening',
];

export const SKILL_LABELS = {
  vocabulary: 'Vocabulary',
  translation: 'Translation',
  conversation: 'Conversation',
  grammar: 'Grammar',
  listening: 'Listening',
};

export const SKILL_EMOJI = {
  vocabulary: '📚',
  translation: '🔄',
  conversation: '💬',
  grammar: '✏️',
  listening: '👂',
};

export const WEAK_SKILL_THRESHOLD = 70;

export function createEmptySkillStat() {
  return {
    attempts: 0,
    correct: 0,
    accuracy: 0,
    missedWords: [],
    lastPracticedDate: null,
  };
}

export function createEmptySkillTrackingForLanguage() {
  return Object.fromEntries(SKILL_IDS.map(id => [id, createEmptySkillStat()]));
}

export function createEmptySkillTracking() {
  return {};
}

export function getSkillAccuracy(skillStat) {
  if (!skillStat || skillStat.attempts === 0) return null;
  return Math.round((skillStat.correct / skillStat.attempts) * 100);
}

function ensureLanguageSkills(tracking, languageId) {
  const base = tracking ?? createEmptySkillTracking();
  if (!base[languageId]) {
    return { ...base, [languageId]: createEmptySkillTrackingForLanguage() };
  }
  const langSkills = { ...base[languageId] };
  for (const id of SKILL_IDS) {
    if (!langSkills[id]) langSkills[id] = createEmptySkillStat();
  }
  return { ...base, [languageId]: langSkills };
}

/**
 * Record one quiz/chat attempt for a skill category.
 * Returns updated skillTracking object (immutable update).
 */
export function recordSkillAttempt(tracking, languageId, skillId, isCorrect, wordKey) {
  if (!languageId || !SKILL_IDS.includes(skillId)) return tracking ?? createEmptySkillTracking();

  const next = ensureLanguageSkills(tracking, languageId);
  const langSkills = { ...next[languageId] };
  const current = { ...langSkills[skillId] };
  const today = new Date().toDateString();

  current.attempts += 1;
  if (isCorrect) {
    current.correct += 1;
    if (wordKey) {
      current.missedWords = current.missedWords.filter(k => k !== wordKey);
    }
  } else if (wordKey && !current.missedWords.includes(wordKey)) {
    current.missedWords = [...current.missedWords, wordKey];
  }

  current.accuracy = getSkillAccuracy(current) ?? 0;
  current.lastPracticedDate = today;

  langSkills[skillId] = current;

  if (isCorrect && wordKey) {
    for (const id of SKILL_IDS) {
      if (id === skillId) continue;
      const other = langSkills[id];
      if (other?.missedWords?.includes(wordKey)) {
        langSkills[id] = {
          ...other,
          missedWords: other.missedWords.filter(k => k !== wordKey),
        };
      }
    }
  }

  return { ...next, [languageId]: langSkills };
}

/**
 * Skills below accuracy threshold with at least one attempt.
 */
export function getWeakSkills(tracking, languageId, threshold = WEAK_SKILL_THRESHOLD) {
  if (!languageId || !tracking?.[languageId]) return [];

  return SKILL_IDS
    .map(id => {
      const stat = tracking[languageId][id] ?? createEmptySkillStat();
      const accuracy = getSkillAccuracy(stat);
      return {
        id,
        label: SKILL_LABELS[id],
        emoji: SKILL_EMOJI[id],
        ...stat,
        accuracy: accuracy ?? 0,
      };
    })
    .filter(skill => skill.attempts > 0 && skill.accuracy < threshold)
    .sort((a, b) => a.accuracy - b.accuracy);
}

/**
 * Collect unique missed word keys for a language across all skills.
 */
export function getMissedWordKeys(tracking, languageId) {
  if (!languageId || !tracking?.[languageId]) return [];

  const keys = new Set();
  for (const skillId of SKILL_IDS) {
    const stat = tracking[languageId][skillId];
    stat?.missedWords?.forEach(k => keys.add(k));
  }
  return [...keys];
}
