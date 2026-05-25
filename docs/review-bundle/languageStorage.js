/** Dedicated localStorage key for the user's selected learning language */
export const LANGUAGE_STORAGE_KEY = 'lingoCafeQuest.language';

export const SUPPORTED_LANGUAGE_IDS = [
  'spanish',
  'french',
  'japanese',
  'korean',
  'italian',
];

export function isSupportedLanguage(id) {
  return SUPPORTED_LANGUAGE_IDS.includes(id);
}

export function getStoredLanguage() {
  try {
    const id = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(id) ? id : null;
  } catch {
    return null;
  }
}

export function setStoredLanguage(languageId) {
  try {
    if (languageId && isSupportedLanguage(languageId)) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, languageId);
    } else {
      localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    }
  } catch {
    // ignore quota / private mode errors
  }
}
